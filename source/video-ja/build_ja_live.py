#!/usr/bin/env python3
"""Japanese dubbed clinical AI demo with live UI motion + Ken Burns + transitions."""
from __future__ import annotations

import asyncio
import json
import subprocess
import wave
from pathlib import Path

import edge_tts
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
MOCK = ROOT.parent / "mockups"
ASSETS = ROOT.parent.parent / "assets" / "reference" / "clinical-ai"
WORK = ROOT / "live"
OUT = ASSETS / "clinical-ai-ja-dubbed.mp4"
VOICE = "ja-JP-NanamiNeural"
FPS = 25
W, H = 1280, 720


SCENES = [
    {
        "id": "01-title",
        "kind": "kenburns",
        "html": "ui-title.html",
        "text": "テラボックスの臨床AI。忙しい臨床の現場で、医師の時間を、再び患者のために戻します。",
        "zoom": "in",
    },
    {
        "id": "02-problem",
        "kind": "kenburns",
        "html": "ui-problem.html",
        "text": "医師は複雑な病態に向き合うだけでなく、重い文書業務にも追われています。画面とキーボードが、本来は患者のための時間を奪ってしまうことがあります。",
        "zoom": "out",
    },
    {
        "id": "03-workflow",
        "kind": "kenburns",
        "html": "ui-workflow.html",
        "text": "テラボックスの臨床AIは、医師が改めて学び直す複雑なソフトではありません。既存の電子カルテに溶け込む、見えない助手です。録音、転写、構造化、根拠トレース、確認と連携。この五つのステップで、現場の流れを止めずに文書化を支えます。",
        "zoom": "in",
    },
    {
        "id": "04-recording-live",
        "kind": "live",
        "html": "ui-recording-live.html",
        "text": "実際の外来では、天気の話や通勤の遅れなど、雑談と環境音が混ざります。臨床AIはまず生の会話ログを受け取り、次にノイズを抑制。症状、既往、検査方針といった臨床情報だけを抜き出してカルテへ反映します。駅の混雑や週末の予定は残さず、医師が確認すべき要点だけが残ります。",
        "record_ms": 30000,
        "ambient": True,
    },
    {
        "id": "05-trace-live",
        "kind": "live",
        "html": "ui-trace-live.html",
        "text": "カルテ作成の速さは基礎に過ぎません。検査所見を選ぶだけで、専門知識ベースとガイドラインから関連根拠を提示。さらに原文トレースにより、疑わしい一文は患者の原音声と原文へジャンプできます。医師は入力係ではなく、確認者として最終判断を行います。",
        "record_ms": 26000,
    },
    {
        "id": "06-close",
        "kind": "kenburns",
        "html": "ui-closing.html",
        "text": "自動生成から循証検索まで。技術は背後へ退き、医師の時間を患者と根拠に戻す。テラボックスが、臨床AIの導入から定着まで伴走します。ご視聴ありがとうございました。",
        "zoom": "in",
    },
]


def run(cmd: list[str]) -> None:
    print("+", " ".join(str(c) for c in cmd))
    subprocess.check_call(cmd)


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / float(w.getframerate())


async def synth(text: str, out_mp3: Path, voice: str = VOICE, rate: str = "-4%") -> None:
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(str(out_mp3))


async def build_ambient_bed(out_wav: Path, duration: float) -> None:
    """Doctor/patient chatter + room noise that ducks after AI filter (~11s)."""
    amb_dir = WORK / "ambient"
    amb_dir.mkdir(parents=True, exist_ok=True)
    lines = [
        ("pt1", "ja-JP-NanamiNeural", "先生、今日駅前が混んでて遅くなりました。すみません。"),
        ("dr1", "ja-JP-KeitaNeural", "大丈夫ですよ。天気も急に寒くなりましたね。"),
        ("pt2", "ja-JP-NanamiNeural", "ええ、エアコンの音も気になって。咳と熱が続いていて。"),
        ("dr2", "ja-JP-KeitaNeural", "では本題を。息苦しさはありますか。"),
        ("pt3", "ja-JP-NanamiNeural", "あと週末は孫の運動会で忙しくて。"),
    ]
    parts = []
    for key, voice, text in lines:
        mp3 = amb_dir / f"{key}.mp3"
        wav = amb_dir / f"{key}.wav"
        await synth(text, mp3, voice=voice, rate="+8%")
        run(["ffmpeg", "-y", "-i", str(mp3), "-ar", "44100", "-ac", "1", str(wav)])
        parts.append(wav)

    # Concat chatter, loop/pad to duration, mix with anoise, volume envelope: loud then duck
    list_file = amb_dir / "list.txt"
    list_file.write_text("".join(f"file '{p}'\n" for p in parts), encoding="utf-8")
    chatter = amb_dir / "chatter.wav"
    run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
            "-ar", "44100", "-ac", "1", str(chatter),
        ]
    )
    # noise + chatter, then volume duck after 11s (AI filter moment)
    run(
        [
            "ffmpeg", "-y",
            "-i", str(chatter),
            "-f", "lavfi", "-i", f"anoisesrc=color=brown:amplitude=0.04:duration={duration:.2f}:sample_rate=44100",
            "-filter_complex",
            (
                f"[0:a]aloop=loop=-1:size=2e+09,atrim=0:{duration:.2f},volume=0.55[c];"
                f"[1:a]volume=0.35[n];"
                f"[c][n]amix=inputs=2:duration=longest:dropout_transition=0,"
                f"volume='if(lt(t,11),0.85,0.85*max(0.08,1-(t-11)/2.5))':eval=frame[a]"
            ),
            "-map", "[a]",
            "-ar", "44100", "-ac", "1",
            str(out_wav),
        ]
    )


def screenshot_still(html_name: str, out_png: Path) -> None:
    url = (MOCK / html_name).as_uri()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(400)
        page.screenshot(path=str(out_png), type="png")
        browser.close()


def record_live(html_name: str, out_webm: Path, record_ms: int) -> None:
    out_webm.parent.mkdir(parents=True, exist_ok=True)
    url = (MOCK / html_name).as_uri()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=str(out_webm.parent),
            record_video_size={"width": 1440, "height": 900},
            device_scale_factor=1,
        )
        page = context.new_page()
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(record_ms)
        video = page.video
        page.close()
        # finalize recording before closing browser
        context.close()
        if video is None:
            browser.close()
            raise RuntimeError("playwright video recording unavailable")
        src = Path(video.path())
        browser.close()
        out_webm.parent.mkdir(parents=True, exist_ok=True)
        if src.exists():
            out_webm.write_bytes(src.read_bytes())
            src.unlink(missing_ok=True)
        else:
            raise RuntimeError(f"recorded video missing: {src}")


def kenburns_clip(png: Path, mp3: Path, out_mp4: Path, duration: float, zoom: str) -> None:
    # High-res zoompan for motion feel
    frames = max(int(duration * FPS), FPS)
    if zoom == "in":
        zexpr = f"min(1.0+0.18*on/{frames},1.18)"
    else:
        zexpr = f"max(1.18-0.18*on/{frames},1.0)"
    vf = (
        f"scale=3600:-1,"
        f"zoompan=z='{zexpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},"
        f"fade=t=in:st=0:d=0.45,fade=t=out:st={max(duration-0.45,0.1):.2f}:d=0.45"
    )
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
            "-vf",
            vf,
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-shortest",
            "-t",
            f"{duration:.3f}",
            "-movflags",
            "+faststart",
            str(out_mp4),
        ]
    )


def live_clip(
    webm: Path,
    mp3: Path,
    out_mp4: Path,
    duration: float,
    ambient_wav: Path | None = None,
) -> None:
    fade_out_at = max(duration - 0.4, 0.1)
    if ambient_wav and ambient_wav.exists():
        run(
            [
                "ffmpeg", "-y",
                "-stream_loop", "-1", "-i", str(webm),
                "-i", str(mp3),
                "-i", str(ambient_wav),
                "-filter_complex",
                (
                    f"[0:v]scale={W}:{H}:force_original_aspect_ratio=decrease,"
                    f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2,fps={FPS},"
                    f"fade=t=in:st=0:d=0.4,fade=t=out:st={fade_out_at:.2f}:d=0.4[v];"
                    f"[1:a]aformat=sample_rates=44100:channel_layouts=mono,volume=1.0[nar];"
                    f"[2:a]aformat=sample_rates=44100:channel_layouts=mono,atrim=0:{duration:.2f},volume=0.5[amb];"
                    f"[nar][amb]amix=inputs=2:duration=first:dropout_transition=2[a]"
                ),
                "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "128k",
                "-shortest", "-t", f"{duration:.3f}",
                "-movflags", "+faststart",
                str(out_mp4),
            ]
        )
        return

    vf = (
        f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
        f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2,"
        f"fps={FPS},"
        f"fade=t=in:st=0:d=0.4,fade=t=out:st={fade_out_at:.2f}:d=0.4"
    )
    run(
        [
            "ffmpeg", "-y",
            "-stream_loop", "-1", "-i", str(webm),
            "-i", str(mp3),
            "-vf", vf,
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k",
            "-shortest", "-t", f"{duration:.3f}",
            "-movflags", "+faststart",
            str(out_mp4),
        ]
    )


def concat_xfade(clips: list[Path], out: Path, overlap: float = 0.35) -> None:
    """Normalize each clip then concat (avoids AAC sample-rate mismatches)."""
    if len(clips) == 1:
        out.write_bytes(clips[0].read_bytes())
        return

    norm_dir = WORK / "norm"
    norm_dir.mkdir(parents=True, exist_ok=True)
    normed: list[Path] = []
    for i, c in enumerate(clips):
        n = norm_dir / f"{i:02d}.mp4"
        run(
            [
                "ffmpeg", "-y", "-i", str(c),
                "-vf", f"scale={W}:{H},fps={FPS},format=yuv420p",
                "-af", "aformat=sample_rates=44100:channel_layouts=stereo",
                "-c:v", "libx264", "-preset", "fast", "-crf", "19",
                "-c:a", "aac", "-b:a", "128k",
                "-movflags", "+faststart",
                str(n),
            ]
        )
        normed.append(n)

    lst = WORK / "concat.txt"
    lst.write_text("".join(f"file '{c}'\n" for c in normed), encoding="utf-8")
    run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
            "-c", "copy", "-movflags", "+faststart",
            str(out),
        ]
    )


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    (WORK / "audio").mkdir(exist_ok=True)
    (WORK / "stills").mkdir(exist_ok=True)
    (WORK / "livevid").mkdir(exist_ok=True)
    (WORK / "clips").mkdir(exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)

    # clean old playwright videos in livevid
    for old in (WORK / "livevid").glob("*"):
        old.unlink()

    timeline = []
    clips: list[Path] = []

    for scene in SCENES:
        print(f"=== {scene['id']} ({scene['kind']}) ===")
        mp3 = WORK / "audio" / f"{scene['id']}.mp3"
        wav = WORK / "audio" / f"{scene['id']}.wav"
        asyncio.run(synth(scene["text"], mp3))
        run(["ffmpeg", "-y", "-i", str(mp3), str(wav)])
        dur = wav_duration(wav) + 0.35
        clip = WORK / "clips" / f"{scene['id']}.mp4"

        if scene["kind"] == "kenburns":
            png = WORK / "stills" / f"{scene['id']}.png"
            screenshot_still(scene["html"], png)
            kenburns_clip(png, mp3, clip, dur, scene.get("zoom", "in"))
        else:
            webm = WORK / "livevid" / f"{scene['id']}.webm"
            record_live(scene["html"], webm, scene.get("record_ms", 9000))
            ambient = None
            if scene.get("ambient"):
                ambient = WORK / "audio" / f"{scene['id']}-ambient.wav"
                asyncio.run(build_ambient_bed(ambient, dur))
            live_clip(webm, mp3, clip, dur, ambient_wav=ambient)

        clips.append(clip)
        timeline.append({"id": scene["id"], "kind": scene["kind"], "duration": round(dur, 3), "text": scene["text"]})

    concat_xfade(clips, OUT)
    (ROOT / "clinical-ai-ja-dubbed.mp4").write_bytes(OUT.read_bytes())
    (WORK / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"DONE {OUT}")
    print(f"total ~{sum(x['duration'] for x in timeline):.1f}s")


if __name__ == "__main__":
    main()
