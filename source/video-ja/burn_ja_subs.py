#!/usr/bin/env python3
"""Burn Japanese subtitles onto the Chinese demo video.

Covers the burned-in Chinese subtitle band and overlays JA captions.
Requires: opencv-python-headless, pillow (venv).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
SRC_VIDEO = ROOT.parent / "810108755fa1c043b09a0b0de4ce327c.mov"
SRT = ROOT / "audio_ja.srt"
OUT_TMP = ROOT / "clinical-ai-ja.raw.mp4"
OUT_FINAL = ROOT / "clinical-ai-ja.mp4"

FONT_CANDIDATES = [
    "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
]


def parse_srt(path: Path) -> list[tuple[float, float, str]]:
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", text.strip())
    cues = []
    for block in blocks:
        lines = [ln for ln in block.splitlines() if ln.strip()]
        if len(lines) < 2:
            continue
        # skip index line if present
        if re.fullmatch(r"\d+", lines[0].strip()):
            lines = lines[1:]
        if "-->" not in lines[0]:
            continue
        start_s, end_s = [p.strip() for p in lines[0].split("-->")]
        body = " ".join(lines[1:]).strip()
        cues.append((to_seconds(start_s), to_seconds(end_s), body))
    return cues


def to_seconds(ts: str) -> float:
    ts = ts.replace(",", ".")
    h, m, s = ts.split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def pick_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size=size, index=0)
            except OSError:
                continue
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    # Prefer wrapping on Japanese punctuation / spaces
    units = re.findall(r"[^、。！？\s]+[、。！？]?|\s+", text)
    if not units:
        units = list(text)
    lines: list[str] = []
    cur = ""
    for unit in units:
        trial = cur + unit
        if draw.textlength(trial, font=font) <= max_width or not cur:
            cur = trial
        else:
            lines.append(cur.strip())
            cur = unit.lstrip()
    if cur.strip():
        lines.append(cur.strip())
    return lines[:3]


def active_cue(cues, t: float) -> str | None:
    for start, end, body in cues:
        if start <= t < end:
            return body
    return None


def main() -> int:
    try:
        import cv2  # noqa: F401
    except ImportError:
        print("opencv missing", file=sys.stderr)
        return 1

    cues = parse_srt(SRT)
    print(f"cues: {len(cues)}")

    cap = cv2.VideoCapture(str(SRC_VIDEO))
    if not cap.isOpened():
        print("cannot open video", file=sys.stderr)
        return 1

    fps = cap.get(cv2.CAP_PROP_FPS) or 22.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"video: {width}x{height} @ {fps:.2f}fps, frames={total}")

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(OUT_TMP), fourcc, fps, (width, height))

    font = pick_font(28 if width >= 900 else 22)
    bar_h = max(70, int(height * 0.14))
    pad_x = 28
    frame_i = 0

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        t = frame_i / fps
        cue = active_cue(cues, t)

        # Cover Chinese burned-in subtitles
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, height - bar_h), (width, height), (20, 24, 26), -1)
        frame = cv2.addWeighted(overlay, 0.92, frame, 0.08, 0)

        if cue:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb)
            draw = ImageDraw.Draw(img)
            lines = wrap_text(draw, cue, font, width - pad_x * 2)
            line_h = 34
            block_h = line_h * len(lines)
            y0 = height - bar_h + max(8, (bar_h - block_h) // 2)
            for i, line in enumerate(lines):
                w = draw.textlength(line, font=font)
                x = int((width - w) / 2)
                y = y0 + i * line_h
                # soft outline
                for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1)):
                    draw.text((x + dx, y + dy), line, font=font, fill=(0, 0, 0))
                draw.text((x, y), line, font=font, fill=(245, 248, 250))
            frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        # small TB badge top-left
        if frame_i % int(fps) == 0 or frame_i < 3:
            pass
        cv2.rectangle(frame, (12, 12), (210, 40), (47, 54, 57), -1)
        cv2.putText(
            frame,
            "TERABOX Clinical AI",
            (20, 32),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            (173, 215, 53),
            1,
            cv2.LINE_AA,
        )

        writer.write(frame)
        frame_i += 1
        if frame_i % 200 == 0:
            print(f"  {frame_i}/{total} ({100 * frame_i / max(total, 1):.1f}%)")

    cap.release()
    writer.release()
    print(f"wrote {OUT_TMP}")

    # Remux with original audio via ffmpeg
    import subprocess

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(OUT_TMP),
        "-i",
        str(SRC_VIDEO),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0?",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "22",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-shortest",
        "-movflags",
        "+faststart",
        str(OUT_FINAL),
    ]
    print(" ".join(cmd))
    subprocess.check_call(cmd)
    print(f"final: {OUT_FINAL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
