/*
 * Chapter 08 — 事例｜AI導入実績 (p.44–54)
 * 顧客名は匿名(業種のみ記載)。数値は確認済みのもののみ。
 * app.js から buildChapter8(helpers) として呼び出す。
 */
function buildChapter8({ frame, sectionSlide }) {
  const badge = (text, kind = "") => `<span class="c8-badge ${kind ? `c8-badge--${kind}` : ""}">${text}</span>`;

  // ページ下部のまとめ。そのページの内容から直接導ける一文だけを置く。
  const takeaway = (text) => `
    <div class="c8-takeaway"><span>POINT</span><p>${text}</p></div>`;

  const steps = (items) => `
    <ol class="c8-steps">
      ${items.map((text, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b><span>${text}</span></li>`).join("")}
    </ol>`;

  const panel = (tag, title, inner, tobe = false) => `
    <section class="c8-panel ${tobe ? "c8-panel--tobe" : ""}">
      <div class="c8-panel__tag">${tag}</div>
      <h3>${title}</h3>
      ${inner}
    </section>`;

  const asisTobe = (asis, tobe) => `
    <div class="c8-at">
      ${asis}
      <div class="c8-arrow" aria-hidden="true">→</div>
      ${tobe}
    </div>`;

  const table = (head, rows, className = "") => `
    <table class="c8-table ${className}">
      <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join("")}</tr>`).join("")}</tbody>
    </table>`;

  const dot = (on) => (on === "future" ? `<span class="c8-dot c8-dot--future">○</span>` : on ? `<span class="c8-dot">●</span>` : "");

  return [
    // 44 — 章扉
    () => sectionSlide(44, "08", "CASE STUDIES", "事例｜AI導入実績", "構想から現場定着まで、AIを業務に根づかせる", [
      ["事例サマリー", "4社の課題・手法・状況"],
      ["AI導入の進め方", "構想から定着までの9ステップ"],
      ["導入事例", "製薬・塗料・飼料／動物栄養"],
      ["Microsoft技術スタック", "機能別の活用マップ"],
      ["ご提案", "Microsoftとの協業テーマ"],
    ]),

    // 45 — 事例サマリー
    () => frame(
      45,
      "CASE SUMMARY",
      "業種の異なる4社で、AIを業務プロセスに組み込む",
      "いずれもグローバル企業の中国拠点。文書や報告といった日常の業務情報を、AIで活用できる形に変えています。",
      `<div class="c8-body">
        ${table(
          ["", "A社<small>製薬</small>", "B社<small>塗料</small>", "C社<small>飼料・動物栄養</small>", "D社<small>産業用樹脂部品</small>"],
          [
            ["課題", "薬物警戒に関する文献を、人手で精読・判定", "検査報告書の検索や横断分析に、数時間〜数日", "営業日報・週報の確認と集計の負荷が大きい", "製品数が膨大で、需要見込みの入力に手間がかかる"],
            ["AI手法", "PDF解析＋RAG＋LLMで一次判定、人が最終確認", "OCR＋RAG＋複数Agentで検証、出典付きで回答", "音声・テキスト入力 → 項目の構造化 → 品質採点 → 週次サマリー", "自然言語での需要見込み入力を支援（LLM＋RAG）"],
            ["Microsoft構成", "Azure OpenAI／Document Intelligence／AI Search", "Azure（21Vianet＋Global Azure EU）／Entra ID", "Power Platform／Azure OpenAI／Teams", "Azure OpenAI Service"],
            ["状況", badge("稼働中", "live"), badge("PoC完了（本導入に向け協議中）", "poc"), badge("導入準備中", "prep"), badge("設計完了（第2フェーズ）", "design")],
            ["成果", "<strong>週約6時間 → 約1時間</strong><br />判定精度 約96.1%", "実業務の質問10件で検証", "目標：日報から週次サマリーまでの自動化", "―"],
          ],
          "c8-table--summary",
        )}
        <p class="c8-note">※ 社名は非公開です。Microsoft構成は、各案件の機能をMicrosoft製品に対応づけたアーキテクチャです。</p>
      </div>
      ${takeaway("4社に共通するのは、AIが一次処理を担い、人が最終判断を行う設計です。稼働中のA社では、週約6時間の作業を約1時間に短縮しました。")}`,
      "c8",
    ),

    // 46 — AI導入の進め方
    () => frame(
      46,
      "DELIVERY APPROACH",
      "構想から定着まで、一貫した型で進める",
      "9つのステップを、AIを活用しながら短いサイクルで回します。",
      `<div class="c8-body">
        <div class="c8-phases">
          <div class="c8-phase c8-phase--1">理解する</div>
          <div class="c8-phase c8-phase--2">合意する</div>
          <div class="c8-phase c8-phase--3">つくり、定着させる</div>
        </div>
        <div class="c8-process">
          ${[
            ["事前調査", "公開情報・業界資料の収集と要約を効率化"],
            ["ヒアリング", "議事録を自動作成し、論点と未確認事項を抽出"],
            ["社内分析", "資料やデータを構造化し、課題・業務フローの整理案を作成"],
            ["提案<br />（概算・RFP）", "要件整理と工数見積の叩き台、提案書の草案を作成"],
            ["説明・デモ", "実務に近いサンプルデータで、デモ環境を短期間で用意"],
            ["スコープ確定", "対象・対象外を整理し、範囲の差分確認を支援"],
            ["最小構成<br />（MVP）の構築", "AIコーディング支援で、画面・API・連携を短期間で実装"],
            ["実データ検証・<br />受入テスト", "AIの結果と人の判断結果を突き合わせ、差分を分析して改善"],
            ["試行運用・<br />移管", "手順書・FAQを作成し、ルールとプロンプトを設定化して運用側へ移管"],
          ]
            .map(
              ([name, ai], i) => `
            <div class="c8-process__col">
              <div class="c8-process__step"><b>${String(i + 1).padStart(2, "0")}</b><span>${name}</span></div>
              <div class="c8-process__ai"><em>AIの活用</em>${ai}</div>
            </div>`,
            )
            .join("")}
        </div>
        <div class="c8-principles">
          <div><b>01</b><span>AIは一次判断、最終判断は人<small>人の確認を経ずに確定させない</small></span></div>
          <div><b>02</b><span>ルールとプロンプトは設定として切り出す<small>運用側で調整できる状態にする</small></span></div>
          <div><b>03</b><span>AIの結果と人の結果を突き合わせる<small>差分をもとに継続的に改善する</small></span></div>
        </div>
      </div>
      ${takeaway("AIは各ステップの下準備と検証を担い、判断と合意は人が行います。この役割分担が、次ページ以降の3つの事例で共通して働いています。")}`,
      "c8",
    ),

    // 47 — A社 ① ASIS → TOBE
    () => frame(
      47,
      "CASE A ｜ PHARMACEUTICAL",
      "薬物警戒の文献レビューを、AIの一次判定と人の最終確認へ",
      "A社（グローバル製薬企業・中国拠点）｜ 薬物警戒（PV）業務",
      `<div class="c8-body">
        ${asisTobe(
          panel(
            "AS-IS",
            "全工程が人手に依存",
            steps([
              "公開文献を人手で収集・ダウンロード",
              "全文を精読",
              "製品との関連性、安全性情報の有無を判定",
              "タグ付け・結論を記録（形式は担当者ごとに異なる）",
              "登録（保管が目的化）",
              "登録後の再利用が進まない",
            ]),
          ),
          panel(
            "TO-BE",
            "主要工程はシステム、人は判断に専念",
            steps([
              "文献を取込（アップロード／目録同期）",
              "PDFを解析し、テキストを構造化",
              "ベクトル化し、検索基盤へ登録",
              "製品ごとにAIが関連性・安全性を一次判定",
              "重要・判断が難しい案件のみ人が確認",
              "結果を蓄積し、再実行・改善に活用",
            ]),
            true,
          ),
        )}
        <div class="c8-shifts">
          <div><small>判断</small><span>全件を人が精読 → <b>AIが一次判定、人が最終確認</b></span></div>
          <div><small>判断基準</small><span>担当者の経験に依存 → <b>設定として版管理</b></span></div>
          <div><small>文献数の変動</small><span>残業・積み残しで対応 → <b>非同期処理で吸収</b></span></div>
        </div>
      </div>
      ${takeaway("AIが全件を一次判定し、人は重要案件の確認に専念する。この役割分担が、次ページの作業時間の短縮（週約6時間 → 約1時間）につながっています。")}`,
      "c8",
    ),

    // 48 — A社 ② 構成と成果
    () => frame(
      48,
      "CASE A ｜ ARCHITECTURE & RESULTS",
      "一次判定の仕組みを、機能単位でMicrosoft製品に対応づける",
      "A社（グローバル製薬企業・中国拠点）｜ 薬物警戒（PV）業務",
      `<div class="c8-body c8-split">
        <section class="c8-split__main">
          <div class="c8-label">MICROSOFT構成｜リファレンスアーキテクチャ</div>
          ${table(
            ["機能", "Microsoft製品"],
            [
              ["文献の取込・保管", "Azure Blob Storage"],
              ["PDF解析・OCR", "Azure AI Document Intelligence"],
              ["ベクトル化・一次判定", "Azure OpenAI Service"],
              ["検索・ナレッジ基盤", "Azure AI Search ／ Azure Database for PostgreSQL（pgvector）"],
              ["非同期処理（取込・バッチ）", "Azure Functions ／ Azure Service Bus"],
              ["確認画面・Web", "Azure Container Apps ／ Power Apps"],
              ["認証・権限", "Microsoft Entra ID"],
              ["監視・監査", "Azure Monitor ／ Application Insights"],
            ],
            "c8-table--compact",
          )}
        </section>
        <aside class="c8-split__side">
          <div class="c8-label">導入成果</div>
          <div class="c8-kpi">
            <div class="c8-kpi__value"><span>6</span><i>h</i><em>→</em><span>1</span><i>h</i></div>
            <div class="c8-kpi__text">人手の作業時間（週あたり）<small>担当者1名あたり。約83%の削減</small></div>
          </div>
          <div class="c8-kpi">
            <div class="c8-kpi__value"><span>96.1</span><i>%</i></div>
            <div class="c8-kpi__text">判定精度<small>お客様の基準データと照合した、文献件数ベースの正答率</small></div>
          </div>
          <p class="c8-side-note">取得する文献数が増減しても、非同期処理で吸収し、人の確認時間を安定させています。</p>
        </aside>
      </div>
      ${takeaway("取込から確認までの各機能をMicrosoft製品に対応づけ、週約6時間 → 約1時間の成果を生んだ流れを構成できます。")}`,
      "c8",
    ),

    // 49 — B社 ① ASIS → TOBE と PoC
    () => frame(
      49,
      "CASE B ｜ COATINGS",
      "検査報告書を、探す資料から、問いに答える知識へ",
      "B社（グローバル塗料メーカー・中国法人）｜ 技術サービス部門",
      `<div class="c8-body c8-split c8-split--even">
        <section class="c8-split__main">
          ${panel(
            "AS-IS",
            "探すだけで、数時間〜数日を要する",
            `<ul class="c8-list">
              <li>スキャン・透かし・公印入りのPDFが大量に蓄積</li>
              <li>人手での検索に、数時間〜数日かかる</li>
              <li>複数の報告書にまたがる分析が難しい</li>
              <li>専門知識が属人化し、新任者の立ち上がりに時間がかかる</li>
              <li>多言語の文書を安定して処理できない</li>
            </ul>`,
          )}
          <div class="c8-arrow c8-arrow--down" aria-hidden="true">↓</div>
          ${panel(
            "TO-BE",
            "質問するだけで、出典付きの回答が得られる",
            `<ul class="c8-list">
              <li>OCRで読み取り、ベクトル化して検索基盤に登録</li>
              <li>自然言語で質問すると、複数の報告書を横断して回答</li>
              <li>回答にファイル名・ページを付与し、原文を確認可能</li>
              <li>権限管理と利用履歴で、ナレッジを安全に共有</li>
            </ul>`,
            true,
          )}
        </section>
        <section class="c8-split__main">
          <div class="c8-label">POC検証｜2025年6月〜2026年3月（9か月）</div>
          <div class="c8-timeline">
            ${[
              ["2025/6", "要件調査"],
              ["7–8月", "方式設計"],
              ["9–10月", "技術検証<small>OCR・RAG・複数Agent</small>"],
              ["11–12月", "業務テスト<small>実業務の質問10件</small>"],
              ["2026/1–3", "改善・成果報告"],
            ]
              .map(([when, what]) => `<div><b>${when}</b><span>${what}</span></div>`)
              .join("")}
          </div>
          <div class="c8-label c8-label--spaced">検証で見つかった課題と対策</div>
          ${table(
            ["課題", "対策"],
            [
              ["化学物質名の誤認識", "塗料業界の専門知識ベースを構築"],
              ["記号（%）の読み取り誤り", "複数Agentによる相互検証"],
              ["中英の専門用語の対応ずれ", "フィードバックを取り込み、継続的に改善"],
            ],
            "c8-table--compact",
          )}
        </section>
      </div>
      ${takeaway("検証で見つかった課題には、いずれも対策の方針が定まっています。「探す」作業を「質問する」作業に置き換える土台が整いました。")}`,
      "c8",
    ),

    // 50 — B社 ② Azure 提案アーキテクチャ
    () => frame(
      50,
      "CASE B ｜ ARCHITECTURE",
      "文書は中国国内に保管し、AI処理はGlobal Azureで行う",
      "B社（グローバル塗料メーカー・中国法人）｜ 本導入向け提案アーキテクチャ（v9.1）",
      `<div class="c8-body">
        <div class="c8-auth">
          <div><small>Global</small><b>Microsoft Entra ID</b></div>
          <div class="c8-auth__link">フェデレーション<br /><span>既存のグローバルアカウントでシングルサインオン</span></div>
          <div><small>21Vianet（中国）</small><b>Azure AD B2C</b></div>
        </div>
        <div class="c8-zones">
          <section class="c8-zone">
            <div class="c8-zone__title">AZURE CHINA（21Vianet）<span>アクセス層・文書保管｜PIPL対応</span></div>
            <div class="c8-nodes">
              <div class="c8-node"><small>ユーザー画面</small><b>Web・モバイル<br />管理ポータル</b><i>App Service</i></div>
              <div class="c8-node"><small>ナレッジAPI</small><b>プロンプト制御<br />用語辞書</b><i>API Management</i></div>
              <div class="c8-node"><small>文書保管</small><b>全文書を<br />中国国内に保管</b><i>Blob Storage</i></div>
              <div class="c8-node"><small>非同期取込</small><b>アップロードを<br />起点に自動処理</b><i>Event Grid</i></div>
              <div class="c8-node"><small>監視・監査</small><b>操作ログ<br />稼働監視</b><i>Application Insights</i></div>
            </div>
          </section>
          <div class="c8-zones__arrow" aria-hidden="true"><span>個人情報を除去し<br />AI処理へ</span>→</div>
          <section class="c8-zone c8-zone--ai">
            <div class="c8-zone__title">GLOBAL AZURE（EU）<span>AI処理</span></div>
            <div class="c8-chain">
              <div class="c8-node"><small>01</small><b>OCR</b><i>文書の読み取り</i></div>
              <div class="c8-node"><small>02</small><b>ベクトル化</b><i>Embedding</i></div>
              <div class="c8-node"><small>03</small><b>回答生成</b><i>LLM</i></div>
            </div>
          </section>
        </div>
        <div class="c8-keys">
          <div><b>データ主権</b>文書は中国国内（21Vianet）に保管し、PIPLに対応</div>
          <div><b>認証</b>グローバルのEntra IDと連携。中国側の新規アカウントは不要</div>
          <div><b>状況</b>本導入に向けて協議中</div>
        </div>
      </div>
      ${takeaway("PIPLに対応した国内保管と、Global AzureのAI基盤を両立。認証もEntra IDに統一し、利用者に新しいアカウントを求めません。")}`,
      "c8",
    ),

    // 51 — C社 ① ASIS → TOBE
    () => frame(
      51,
      "CASE C ｜ FEED & ANIMAL NUTRITION",
      "営業報告をAIが構造化し、マネジメントの意思決定につなぐ",
      "C社（グローバル飼料・動物栄養企業・中国法人）｜ 営業部門",
      `<div class="c8-body">
        <div class="c8-at c8-at--compact">
          ${panel(
            "AS-IS",
            "自由記述の報告を、管理者が読み込む",
            `<ul class="c8-list">
              <li>日報・週報は自由記述が中心で、確認と集計に手間がかかる</li>
              <li>管理者が大量の報告を読み込む負担が大きい</li>
              <li>報告の質が、担当者によってばらつく</li>
            </ul>`,
          )}
          <div class="c8-arrow" aria-hidden="true">→</div>
          ${panel(
            "TO-BE",
            "AIが整理し、要点が管理層に届く",
            `<div class="c8-mini-flow">
              <div><b>01</b>現場が音声・テキストで入力</div>
              <div><b>02</b>AIが項目を構造化し、品質を採点</div>
              <div><b>03</b>本人が内容を確認して提出</div>
              <div><b>04</b>管理層に週次サマリーと赤・黄のアラートを表示</div>
            </div>`,
            true,
          )}
        </div>
        <div class="c8-scope">
          <div class="c8-scope__head">今回のスコープ<span>試行対象：5〜10名</span></div>
          <div class="c8-scope__cols">
            <div>
              <h4>対象</h4>
              <ul class="c8-list c8-list--check">
                <li>日報・週報の提出</li>
                <li>AIによる項目の構造化と品質採点</li>
                <li>管理サマリー（赤・黄のアラート付き）</li>
                <li>週次のバッチ要約</li>
                <li>試行運用と移管</li>
              </ul>
            </div>
            <div>
              <h4>対象外</h4>
              <ul class="c8-list c8-list--out">
                <li>ERP・Fabricとのリアルタイム連携</li>
                <li>勤怠管理</li>
                <li>AIによる自動評価・ランキング</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      ${takeaway("「提出 → 構造化 → 管理サマリー」の一連の流れに絞り、5〜10名の試行で効果を確かめます。ERP連携や勤怠は対象外とし、範囲を明確にして短期で検証します。")}`,
      "c8",
    ),

    // 52 — C社 ② 全Microsoft構成
    () => frame(
      52,
      "CASE C ｜ ARCHITECTURE",
      "現場の入力から管理層の確認まで、Microsoft製品で一気通貫",
      "C社（グローバル飼料・動物栄養企業・中国法人）｜ 設計アーキテクチャ（導入準備中）",
      `<div class="c8-body">
        <div class="c8-stack">
          <div class="c8-stack__item">
            <small>現場（営業担当）</small>
            <b>入力・提出</b>
            <i>Power Apps ／ Power Pages</i>
            <em>認証：Microsoft Entra ID</em>
          </div>
          <div class="c8-stack__arrow" aria-hidden="true">→</div>
          <div class="c8-stack__item">
            <small>データ</small>
            <b>報告・マスタデータの保管</b>
            <i>Microsoft Dataverse</i>
          </div>
          <div class="c8-stack__arrow" aria-hidden="true">→</div>
          <div class="c8-stack__item c8-stack__item--ai">
            <small>AI</small>
            <b>構造化・品質採点・週次要約</b>
            <i>Azure OpenAI Service</i>
          </div>
          <div class="c8-stack__arrow" aria-hidden="true">→</div>
          <div class="c8-stack__item">
            <small>管理層</small>
            <b>週次サマリー・アラートの確認</b>
            <i>Microsoft Teams</i>
          </div>
        </div>
        <div class="c8-next">
          <span>NEXT PHASE</span>
          <div>対話型アシスタント：<b>Microsoft Copilot Studio</b>（Teams上で質問・助言）</div>
          <div>データ連携の拡張：<b>Microsoft Fabric</b></div>
        </div>
        <div class="c8-guard">
          <h4>設計上のガードレール</h4>
          <div class="c8-guard__cols">
            <div><b>01</b>AIは顧客情報などの事実を補完・創作しない</div>
            <div><b>02</b>本人の確認を経てから提出する（確認は省略できない）</div>
            <div><b>03</b>追問の文言やルールは設定化し、運用側で調整できる</div>
          </div>
        </div>
      </div>
      ${takeaway("入力・保管・AI・確認の4層をMicrosoft製品で統一し、認証もEntra IDに集約。ガードレールを設計に組み込み、AIが事実を創作しない運用を前提にしています。")}`,
      "c8",
    ),

    // 53 — Microsoft 技術スタック
    () => frame(
      53,
      "MICROSOFT STACK",
      "案件ごとに、機能に応じてMicrosoft製品を組み合わせる",
      "4案件で共通して使うものと、案件の要件に応じて選ぶものがあります。",
      `<div class="c8-body">
        ${table(
          ["機能", "Microsoft製品", "A社<small>製薬</small>", "B社<small>塗料</small>", "C社<small>飼料・動物栄養</small>", "D社<small>産業用樹脂部品</small>"],
          [
            ["生成AI", "Azure OpenAI Service", dot(1), dot(1), dot(1), dot(1)],
            ["文書解析・OCR", "Azure AI Document Intelligence", dot(1), dot(1), dot(0), dot(0)],
            ["検索・ナレッジ", "Azure AI Search ／ Azure Database for PostgreSQL", dot(1), dot(1), dot(0), dot(1)],
            ["業務アプリ", "Power Apps ／ Power Pages ／ Dataverse", dot(1), dot(0), dot(1), dot(0)],
            ["コラボレーション・対話", "Microsoft Teams ／ Copilot Studio", dot(0), dot(0), dot(1), dot(0)],
            ["ID・認証", "Microsoft Entra ID ／ Azure AD B2C", dot(1), dot(1), dot(1), dot(0)],
            ["ホスティング・監視", "App Service ／ Container Apps ／ Azure Monitor", dot(1), dot(1), dot(0), dot(0)],
            ["データ基盤", "Microsoft Fabric", dot(0), dot(0), dot("future"), dot(0)],
          ],
          "c8-table--matrix",
        )}
        <p class="c8-note">● 活用　○ 将来の拡張</p>
      </div>
      ${takeaway("Azure OpenAI Serviceは4案件すべてに共通する基盤です。文書解析・検索・業務アプリ・認証は、案件の要件に応じて組み合わせています。")}`,
      "c8",
    ),

    // 54 — ご提案
    () => frame(
      54,
      "PROPOSAL",
      "Microsoftとの協業で、日本企業の業務AIを広げたい",
      "4つの事例で得た知見をもとに、次の取り組みをご提案します。",
      `<div class="c8-body">
        <div class="c8-themes">
          ${[
            ["Azure OpenAI Serviceを軸にした、業務AIの共同展開", "文書処理・報告・問い合わせなど、日本企業に共通するユースケースを横展開します。"],
            ["Power Platform・Copilot Studioとの連携", "現場の入力から管理層との対話まで、ローコードで素早く実装します。"],
            ["中国拠点（21Vianet）を含むデータ主権への対応", "文書の国内保管とグローバルのAI基盤を組み合わせた構成を、共同で整備します。"],
            ["日本企業の海外拠点への展開", "日本本社と海外拠点をつなぐAI活用を、共通の型として提供します。"],
          ]
            .map(([title, text], i) => `<section><b>${String(i + 1).padStart(2, "0")}</b><h3>${title}</h3><p>${text}</p></section>`)
            .join("")}
        </div>
        <div class="c8-nextsteps">
          <div class="c8-label">次のステップ</div>
          <div class="c8-nextsteps__flow">
            <div><b>01</b>事例の詳細説明</div>
            <span aria-hidden="true">→</span>
            <div><b>02</b>ユースケースの選定</div>
            <span aria-hidden="true">→</span>
            <div><b>03</b>共同PoCの実施</div>
          </div>
        </div>
      </div>
      ${takeaway("4案件に共通する基盤はAzure OpenAI Serviceです。この共通基盤を軸に、共同で展開するユースケースの選定から始めたいと考えています。")}`,
      "c8",
    ),
  ];
}
