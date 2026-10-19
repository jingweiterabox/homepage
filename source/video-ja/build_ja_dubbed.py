#!/usr/bin/env python3
"""Build Japanese-dubbed clinical AI demo with Japanese UI mockups only (no Chinese UI)."""
from __future__ import annotations

import asyncio
import json
import subprocess
import wave
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
MOCK = ROOT.parent / "mockups"
ASSETS = ROOT.parent.parent / "assets" / "reference" / "clinical-ai"
WORK = ROOT / "dub"
OUT = ASSETS / "clinical-ai-ja-dubbed.mp4"
VOICE = "ja-JP-NanamiNeural"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Each scene: mockup html stem (or existing png name), narration text
SCENES = [
    {
        "id": "01-title",
        "html": "ui-title",
        "png": "ui-title.png",
        "text": "テラボックスの臨床AI。忙しい臨床の現場で、医師の時間を、再び患者のために戻します。",
    },
    {
        "id": "02-problem",
        "html": "ui-problem",
        "png": "ui-problem.png",
        "text": "医師は複雑な病態に向き合うだけでなく、重い文書業務にも追われています。画面とキーボードが、本来は患者のための時間を奪ってしまうことがあります。",
    },
    {
        "id": "03-solution",
        "html": "ui-workflow",
        "png": "ui-workflow.png",
        "existing": True,
        "text": "テラボックスの臨床AIは、医師が改めて学び直す複雑なソフトではありません。既存の電子カルテに溶け込む、見えない助手です。録音、転写、構造化、根拠トレース、確認と連携。この五つのステップで、現場の流れを止めずに文書化を支えます。",
    },
    {
        "id": "04-recording",
        "html": "ui-recording",
        "png": "ui-recording.png",
        "existing": True,
        "text": "医師が通常どおり問診を始めると、対話はリアルタイムに構造化カルテへ反映されます。主訴、病歴、所見、診療計画。雑談や口語のノイズを抑え、医学上重要な情報だけを抽出します。",
    },
    {
        "id": "05-visit",
        "html": "ui-recording",
        "png": "ui-recording.png",
        "existing": True,
        "text": "たとえば市中肺炎が疑われる外来では、症状の経過、既往、アレルギー、生活背景を対話から整理。検査としては血算と胸部CTを提案し、結果に基づいて方針を決めます。",
    },
    {
        "id": "06-plan",
        "html": "ui-trace",
        "png": "ui-trace.png",
        "existing": True,
        "text": "感染範囲が限定的であれば、アジスロマイシンなど経口薬中心の外来治療も可能です。服薬指導、生活上の注意、再診のタイミングまで、カルテと会話ログに残ります。医師は入力係ではなく、確認者として最終判断を行います。",
    },
    {
        "id": "07-evidence",
        "html": "ui-trace",
        "png": "ui-trace.png",
        "existing": True,
        "text": "カルテ作成の速さは基礎に過ぎません。検査所見を選ぶだけで、専門知識ベースとガイドラインから関連根拠を提示。出典付きで条項を確認でき、循証医学を診療の速度で実践できます。",
    },
    {
        "id": "08-trace",
        "html": "ui-trace",
        "png": "ui-trace.png",
        "existing": True,
        "text": "さらに原文トレースにより、疑わしい一文は患者の原音声と原文へジャンプできます。一文書ごとに根拠があり、安全で適合した記載を支えます。",
    },
    {
        "id": "09-close",
        "html": "ui-closing",
        "png": "ui-closing.png",
        "text": "自動生成から循証検索まで。技術は背後へ退き、医師の時間を患者と根拠に戻す。テラボックスが、臨床AIの導入から定着まで伴走します。ご視聴ありがとうございました。",
    },
]


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    subprocess.check_call(cmd)


def screenshot(html_stem: str, out_png: Path) -> None:
    html = MOCK / f"{html_stem}.html"
    run(
        [
            CHROME,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            "--window-size=1440,900",
            f"--screenshot={out_png}",
            html.as_uri(),
        ]
    )


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / float(w.getframerate())


async def synth(text: str, out_mp3: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(str(out_mp3))


def ensure_png(scene: dict) -> Path:
    dest = WORK / "slides" / scene["png"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    if scene.get("existing"):
        src = ASSETS / scene["png"]
        if not src.exists():
            raise FileNotFoundError(src)
        if not dest.exists() or src.stat().st_mtime > dest.stat().st_mtime:
            dest.write_bytes(src.read_bytes())
        return dest
    html_stem = scene["html"]
    # regenerate from html
    screenshot(html_stem, dest)
    # also copy into assets for reuse
    ASSETS.mkdir(parents=True, exist_ok=True)
    (ASSETS / scene["png"]).write_bytes(dest.read_bytes())
    return dest


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    (WORK / "audio").mkdir(exist_ok=True)
    (WORK / "clips").mkdir(exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)

    timeline = []
    for scene in SCENES:
        print(f"=== {scene['id']} ===")
        png = ensure_png(scene)
        mp3 = WORK / "audio" / f"{scene['id']}.mp3"
        wav = WORK / "audio" / f"{scene['id']}.wav"
        asyncio.run(synth(scene["text"], mp3))
        run(["ffmpeg", "-y", "-i", str(mp3), str(wav)])
        dur = wav_duration(wav) + 0.45  # short pause between scenes
        clip = WORK / "clips" / f"{scene['id']}.mp4"
        # 1280x720 output for lighter file; scale mockups
        run(
            [
                "ffmpeg",
                "-y",
                "-loop",
                "1",
                "-i",
                str(png),
                "-i",
                str(mp3),
                "-c:v",
                "libx264",
                "-tune",
                "stillimage",
                "-pix_fmt",
                "yuv420p",
                "-vf",
                "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                "-shortest",
                "-t",
                f"{dur:.3f}",
                "-movflags",
                "+faststart",
                str(clip),
            ]
        )
        timeline.append(
            {
                "id": scene["id"],
                "text": scene["text"],
                "duration": round(dur, 3),
                "png": scene["png"],
            }
        )

    concat_list = WORK / "concat.txt"
    concat_list.write_text(
        "".join(f"file '{WORK / 'clips' / (s['id'] + '.mp4')}'\n" for s in SCENES),
        encoding="utf-8",
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_list),
            "-c",
            "copy",
            str(OUT),
        ]
    )
    (WORK / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")
    # also keep a copy under source/video-ja
    (ROOT / "clinical-ai-ja-dubbed.mp4").write_bytes(OUT.read_bytes())
    print(f"DONE: {OUT}")
    print(f"total ~{sum(x['duration'] for x in timeline):.1f}s")


if __name__ == "__main__":
    main()
