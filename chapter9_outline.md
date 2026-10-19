# 第09章「事例｜臨床AI」ページ構成案

> 正本は `chapter9.js`。本ファイルは作業メモ。
> 対象: テラボックス社外向け / 全11ページ(p.55〜65) / 全文日本語
> 方針: 第08章と同型の構成。実装は専用臨床AIフレームワーク（Microsoftスタックに依存しない）。顧客・施設名は匿名。数値は `source/` 資料に根拠があるもののみ。
> 素材: `source/小爱公司介绍_V260903.pdf`（パートナー技術資料）。対外は TB ブランドで再構成し、パートナー社名を前面に出さない。

## 匿名表記
| 表記 | 実際（社内メモ） | 種別 |
|---|---|---|
| 医療機関A | 卓正医療 | 中高価格クリニックチェーン |
| 医療機関B | 皖南医学院第一附属医院 | 大学附属病院 |
| 医療機関C | 上海国際和平婦幼保健院 | 婦人科・周産期専門病院 |
| 医療機関D | 浙江省立同徳医院 | 中西医結合病院 |

## ページ構成
| # | 内容 |
|---|---|
| 55 | 章扉 |
| 56 | 課題と三方価値 |
| 57 | AS-IS → TO-BE |
| 58 | 医師ワークフロー（5ステップ） |
| 59 | コア機能（病歴／循証／保険適合） |
| 60 | システム構成（専用エンジン・HIS連携・オンプレ可） |
| 61 | セキュリティと意思決定の原則 |
| 62 | 導入事例サマリー |
| 63 | 事例A・B |
| 64 | 事例C・D |
| 65 | ご提案（日本向け） |

## 第08章との違い
- Microsoft製品マトリクスは置かない
- 技術スタックは「対話構造化／循証／証跡／保険適合エンジン＋HIS・EMR連携」で表現
- 協業提案は Microsoft 共同展開ではなく、医療機関向け臨床AIの導入・定着

## UI素材
- `source/*.mov` は**中国語UI＋中国語字幕**（日文版なし）。
- 対外用日本語モック截図（`source/mockups/*.html` → Chrome headless）:
  - `assets/reference/clinical-ai/ui-workflow.png`（p.58）
  - `assets/reference/clinical-ai/ui-recording.png`（p.59）
  - `assets/reference/clinical-ai/ui-trace.png`（p.59）
- 対外用日本語動画:
  - `assets/reference/clinical-ai/clinical-ai-ja-dubbed.mp4`（約2分）**推奨**
    - 画面: 日本語UIのみ（中国語UIなし）
    - 動き: Ken Burns＋フェード、録音UI／循証UIは Playwright 録画のライブアニメ
    - 音声: edge-tts `ja-JP-NanamiNeural`
    - 再生成: `source/video-ja/.venv/bin/python source/video-ja/build_ja_live.py`
  - `assets/reference/clinical-ai/clinical-ai-ja.mp4`（約7分40秒・旧）
    - 原動画＋日文字幕のみ。中国語UIが残るため対外非推奨。
