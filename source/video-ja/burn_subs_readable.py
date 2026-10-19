#!/usr/bin/env python3
"""Burn high-contrast Japanese subtitles onto the dubbed clinical AI video."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT.parent.parent / "assets" / "reference" / "clinical-ai"
SRC = ASSETS / "clinical-ai-ja-dubbed.mp4"
OUT_FINAL = ASSETS / "clinical-ai-ja-dubbed.mp4"
TMP = ROOT / "live" / "with-subs.raw.mp4"
TMP_OUT = ROOT / "live" / "with-subs.mp4"
AUDIO_SRC = ROOT / "live" / "pre-subs-audio-src.mp4"
SRT_OUT = ROOT / "live" / "narration_ja.srt"
TIMELINE = ROOT / "live" / "timeline.json"

# Current narration (keep in sync with build_ja_live.SCENES)
NARRATION = [
    "テラボックスの臨床AI。忙しい臨床の現場で、医師の時間を、再び患者のために戻します。",
    "医師は複雑な病態に向き合うだけでなく、重い文書業務にも追われています。画面とキーボードが、本来は患者のための時間を奪ってしまうことがあります。",
    "テラボックスの臨床AIは、医師が改めて学び直す複雑なソフトではありません。既存の電子カルテに溶け込む、見えない助手です。録音、転写、構造化、根拠トレース、確認と連携。この五つのステップで、現場の流れを止めずに文書化を支えます。",
    "実際の外来では、天気の話や通勤の遅れなど、雑談と環境音が混ざります。臨床AIはまず生の会話ログを受け取り、次にノイズを抑制。症状、既往、検査方針といった臨床情報だけを抜き出してカルテへ反映します。駅の混雑や週末の予定は残さず、医師が確認すべき要点だけが残ります。",
    "カルテ作成の速さは基礎に過ぎません。検査所見を選ぶだけで、専門知識ベースとガイドラインから関連根拠を提示。さらに原文トレースにより、疑わしい一文は患者の原音声と原文へジャンプできます。医師は入力係ではなく、確認者として最終判断を行います。",
    "自動生成から循証検索まで。技術は背後へ退き、医師の時間を患者と根拠に戻す。テラボックスが、臨床AIの導入から定着まで伴走します。ご視聴ありがとうございました。",
]

FONT_CANDIDATES = [
    "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
    "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
]


def pick_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size=size, index=0)
            except OSError:
                continue
    return ImageFont.load_default()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[。！？])", text)
    return [p.strip() for p in parts if p.strip()]


def chunk_for_display(sentence: str, max_chars: int = 22) -> list[str]:
    """Split long Japanese sentence into up to 2 subtitle lines."""
    if len(sentence) <= max_chars:
        return [sentence]
    # prefer break near middle on punctuation/space
    mid = len(sentence) // 2
    candidates = []
    for i, ch in enumerate(sentence):
        if ch in "、。・／　 ":
            candidates.append(i + 1)
    if candidates:
        br = min(candidates, key=lambda i: abs(i - mid))
        a, b = sentence[:br].strip(), sentence[br:].strip()
        if a and b:
            return [a, b][:2]
    return [sentence[:max_chars], sentence[max_chars:]]


def to_ts(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, rem = divmod(ms, 3600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def build_cues(durations: list[float]) -> list[tuple[float, float, str]]:
    cues: list[tuple[float, float, str]] = []
    t = 0.0
    for dur, text in zip(durations, NARRATION):
        sentences = split_sentences(text)
        if not sentences:
            t += dur
            continue
        # weight by char length
        weights = [max(len(s), 8) for s in sentences]
        total_w = sum(weights)
        # leave tiny padding at scene edges
        usable = max(dur - 0.35, dur * 0.92)
        cursor = t + 0.12
        for w, sent in zip(weights, sentences):
            span = usable * (w / total_w)
            lines = chunk_for_display(sent)
            body = "\n".join(lines)
            cues.append((cursor, cursor + span, body))
            cursor += span
        t += dur
    return cues


def write_srt(cues: list[tuple[float, float, str]], path: Path) -> None:
    lines = []
    for i, (a, b, text) in enumerate(cues, 1):
        lines.append(str(i))
        lines.append(f"{to_ts(a)} --> {to_ts(b)}")
        lines.append(text)
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def active_text(cues, t: float) -> str | None:
    for a, b, text in cues:
        if a <= t < b:
            return text
    return None


def main() -> int:
    actual = ROOT / "live" / "actual_durations.json"
    if actual.exists():
        durations = [float(x) for x in json.loads(actual.read_text(encoding="utf-8"))]
    else:
        timeline = json.loads(TIMELINE.read_text(encoding="utf-8"))
        durations = [float(x["duration"]) for x in timeline]
    if len(durations) != len(NARRATION):
        raise SystemExit(f"duration/narration mismatch: {len(durations)} vs {len(NARRATION)}")

    cues = build_cues(durations)
    write_srt(cues, SRT_OUT)
    print(f"cues={len(cues)} srt={SRT_OUT}")

    cap = cv2.VideoCapture(str(SRC))
    if not cap.isOpened():
        raise SystemExit(f"cannot open {SRC}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"{width}x{height} @{fps:.2f} frames={total}")

    font = pick_font(30 if width >= 1200 else 26)
    bar_h = max(88, int(height * 0.15))
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    TMP.parent.mkdir(parents=True, exist_ok=True)
    writer = cv2.VideoWriter(str(TMP), fourcc, fps, (width, height))

    frame_i = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        t = frame_i / fps
        text = active_text(cues, t)

        # high-contrast bar: near-black with slight transparency
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, height - bar_h), (width, height), (12, 14, 16), -1)
        frame = cv2.addWeighted(overlay, 0.82, frame, 0.18, 0)
        # lime accent line on top of bar for brand consistency / separation
        cv2.rectangle(frame, (0, height - bar_h), (width, height - bar_h + 3), (53, 215, 173), -1)

        if text:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb)
            draw = ImageDraw.Draw(img)
            lines = text.split("\n")
            line_h = 36
            block_h = line_h * len(lines)
            y0 = height - bar_h + max(14, (bar_h - block_h) // 2)
            for i, line in enumerate(lines):
                w = draw.textlength(line, font=font)
                x = int((width - w) / 2)
                y = y0 + i * line_h
                # strong outline for readability on any background
                for dx, dy in (
                    (-2, 0), (2, 0), (0, -2), (0, 2),
                    (-2, -2), (2, 2), (-2, 2), (2, -2),
                    (-1, 0), (1, 0), (0, -1), (0, 1),
                ):
                    draw.text((x + dx, y + dy), line, font=font, fill=(0, 0, 0))
                draw.text((x, y), line, font=font, fill=(255, 255, 255))
            frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        writer.write(frame)
        frame_i += 1
        if frame_i % 250 == 0:
            print(f"  {frame_i}/{total}")

    cap.release()
    writer.release()

    # Keep a copy for audio before overwriting final
    if not AUDIO_SRC.exists():
        AUDIO_SRC.write_bytes(SRC.read_bytes())

    subprocess.check_call(
        [
            "ffmpeg", "-y",
            "-i", str(TMP),
            "-i", str(AUDIO_SRC),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "2",
            "-shortest", "-movflags", "+faststart",
            str(TMP_OUT),
        ]
    )
    TMP.unlink(missing_ok=True)
    OUT_FINAL.write_bytes(TMP_OUT.read_bytes())
    (ROOT / "clinical-ai-ja-dubbed.mp4").write_bytes(TMP_OUT.read_bytes())
    print(f"DONE {OUT_FINAL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
