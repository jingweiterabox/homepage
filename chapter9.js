/*
 * Chapter 09 — 事例｜臨床AI (p.55–65)
 * 第08章と同型の構成。実装は専用臨床AIフレームワーク（Microsoftスタック非依存）。
 * 対外はテラボックスブランド。施設名は匿名。数値は確認済みのもののみ。
 * app.js から buildChapter9(helpers) として呼び出す。
 * 見た目は chapter8.css の c8 デザインシステムを再利用する。
 */
function buildChapter9({ frame, sectionSlide }) {
  const badge = (text, kind = "") => `<span class="c8-badge ${kind ? `c8-badge--${kind}` : ""}">${text}</span>`;

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

  return [
    // 55 — 章扉
    () => sectionSlide(55, "09", "CASE STUDIES", "事例｜臨床AI", "対話から病歴・循証・保険適合まで、臨床の現場にAIを根づかせる", [
      ["課題と価値", "医師・医療機関・保険者の三方視点"],
      ["導入の型", "AS-IS／TO-BEと5ステップの流れ"],
      ["製品デモ", "日本語デモ動画（ノイズ抑制〜カルテ）"],
      ["導入事例", "クリニックから大学附属病院まで"],
      ["ご提案", "日本の医療機関への展開"],
    ]),

    // 56 — 課題と三方価値
    () => frame(
      56,
      "CHALLENGE & VALUE",
      "文書に奪われた時間を、診療の本質へ戻す",
      "医師は業務時間の約30〜40%を病歴記載に費やしています。テラボックスの臨床AIは、対話を構造化し、品質と適合まで一気通貫で支えます。",
      `<div class="c8-body">
        <div class="c8-themes" style="grid-template-columns:repeat(3,1fr)">
          <section>
            <b>01</b>
            <h3>医師</h3>
            <p>効率向上とリスク低減。病歴の自動生成で、1日あたり約1〜2時間の文書時間を削減。治療方針の循証審査と保険適合の事前提示で、差戻しや追加コストを抑えます。</p>
          </section>
          <section>
            <b>02</b>
            <h3>医療機関</h3>
            <p>品質とリスクを可視化。診療の全過程を追跡可能にし、質管理・紛争時の証跡を整備。保険審査の通過率向上につなげます。</p>
          </section>
          <section>
            <b>03</b>
            <h3>保険者</h3>
            <p>事前の風控と効率。不適切な診療・費用を早期に検知し、事後審査の負荷を下げます。</p>
          </section>
        </div>
        <p class="c8-note">※ 数値は導入先の実測・パイロット結果に基づきます。施設名・製品ブランドは対外資料では匿名化しています。</p>
      </div>
      ${takeaway("臨床AIの目的は「書く」ことの代替ではなく、医師が傾聴・診断・治療に集中できる環境をつくることです。")}`,
      "c8",
    ),

    // 57 — AS-IS → TO-BE
    () => frame(
      57,
      "AS-IS → TO-BE",
      "経験に頼る記載から、証跡のある臨床プロセスへ",
      "診療の各工程をデジタル化・構造化・追跡可能にし、経験医療から循証医療への移行を支援します。",
      `<div class="c8-body">
        ${asisTobe(
          panel(
            "AS-IS",
            "文書が診療時間を圧迫する",
            steps([
              "問診後に手入力で病歴を作成",
              "記載漏れ・表現のばらつきが発生",
              "根拠の確認に時間がかかる",
              "保険・質管理の指摘が事後に集中",
              "医師の本来業務（傾聴・判断）が削られる",
            ]),
          ),
          panel(
            "TO-BE",
            "対話から確認までを一連の流れに",
            steps([
              "診療対話を録音・収集",
              "AIが構造化病歴の下書きを生成",
              "文単位で根拠（音声・原文）へ遡及",
              "治療方針の循証審査と保険適合の事前確認",
              "医師が確認・修正し、HIS／EMRへ連携",
            ]),
            true,
          ),
        )}
        <div class="c8-shifts">
          <div><small>役割</small><span>医師が全文を手書き → <b>AIが下書き、医師が最終確認</b></span></div>
          <div><small>品質</small><span>属人的な記載 → <b>構造化と証跡で均質化</b></span></div>
          <div><small>適合</small><span>事後の差戻し対応 → <b>事前の審査と改善提案</b></span></div>
        </div>
      </div>
      ${takeaway("最終判断は常に医師に残します。AIは一次整理とリスク提示に徹し、強制的な医療指示にはしません。")}`,
      "c8",
    ),

    // 58 — 5ステップ（ネイティブUI、画像の入れ子は使わない）
    () => frame(
      58,
      "WORKFLOW",
      "録音から病歴まで、現場の5ステップ",
      "診療の流れを止めずに、文書化と質管理を自動化します。",
      `<div class="c8-body">
        <div class="c9-steps">
          ${[
            ["01", "ワンタッチ録音", "スマートバッジ等で診療対話を開始", "CAPTURE"],
            ["02", "リアルタイム転写", "話者分離で医師と患者を識別", "TRANSCRIBE"],
            ["03", "構造化カルテ", "主訴・病歴・所見・計画へ自動整理", "STRUCTURE", true],
            ["04", "根拠トレース", "重要記載を録音・原文へ遡及", "TRACE"],
            ["05", "確認して連携", "医師確認後、HIS／EMRへ同期", "CONFIRM"],
          ]
            .map(
              ([num, title, desc, tag, accent]) => `
            <article class="c9-step${accent ? " c9-step--accent" : ""}">
              <div class="c9-step__num">${num}</div>
              <h3>${title}</h3>
              <p>${desc}</p>
              <span>${tag}</span>
            </article>`,
            )
            .join("")}
        </div>
        <div class="c8-principles">
          <div><b>01</b><span>対話終了から病歴生成まで、目標3分以内<small>診療科に応じて設定可能</small></span></div>
          <div><b>02</b><span>手書きより高い項目完全性を目指す<small>主訴・根拠・アレルギー・服薬歴を漏れなく</small></span></div>
          <div><b>03</b><span>任意の重要段落を根拠へ遡及可能<small>録音時刻・原文・引用カード</small></span></div>
        </div>
      </div>
      ${takeaway("医師は「書く」から「確認する」へ。文書時間の約30〜40%を診療の本質に戻すことを狙います。")}`,
      "c8",
    ),

    // 59 — 日本語デモ動画を埋め込み
    () => frame(
      59,
      "PRODUCT DEMO",
      "日本語デモ：雑談ノイズを抑え、臨床情報だけを残す",
      "対外向けに再構成したデモ映像です。再生ボタンから視聴できます（約2分）。",
      `<div class="c8-body">
        <div class="c9-video">
          <video
            controls
            playsinline
            preload="metadata"
            poster="./assets/reference/clinical-ai/video-poster.jpg"
            aria-label="テラボックス臨床AI 日本語デモ"
          >
            <source src="./assets/reference/clinical-ai/clinical-ai-ja-dubbed.mp4" type="video/mp4" />
          </video>
          <div class="c9-video__meta">
            <div><b>内容</b>問診録音 → ノイズ抑制 → 構造化カルテ → 循証・根拠トレース</div>
            <div><b>言語</b>日本語UI ／ 日本語ナレーション ／ 日本語字幕</div>
          </div>
        </div>
      </div>
      ${takeaway("デモでは、雑談や環境音をフィルタし、症状・方針など確認すべき要点だけがカルテに残る流れを示します。")}`,
      "c8",
    ),

    // 60 — システム構成（非MS）
    () => frame(
      60,
      "ARCHITECTURE",
      "現場端末からコアエンジンまで、臨床に特化した一体構成",
      "汎用クラウド製品の組合せではなく、臨床文書・循証・適合に特化した実装フレームワークで提供します。",
      `<div class="c8-body">
        <div class="c8-stack">
          <div class="c8-stack__item">
            <small>現場</small>
            <b>病院向けAI一体機<br />医師ワークベンチ</b>
            <i>録音・生成・確認・質管理</i>
            <em>App ＋ Web</em>
          </div>
          <div class="c8-stack__arrow" aria-hidden="true">→</div>
          <div class="c8-stack__item c8-stack__item--ai">
            <small>コアエンジン</small>
            <b>対話構造化<br />循証審査<br />証跡追跡</b>
            <i>Audio／Text → Clinical Notes</i>
          </div>
          <div class="c8-stack__arrow" aria-hidden="true">→</div>
          <div class="c8-stack__item">
            <small>適合・連携</small>
            <b>保険適合エンジン<br />HIS／EMR連携</b>
            <i>HL7／FHIR ほか</i>
          </div>
          <div class="c8-stack__arrow" aria-hidden="true">→</div>
          <div class="c8-stack__item">
            <small>拡張</small>
            <b>AIフォローアップ<br />患者プロファイル</b>
            <i>音声・メッセージによる継続支援</i>
          </div>
        </div>
        <div class="c8-keys">
          <div><b>展開形態</b>クラウド／院内プライベートの両方に対応。核心データは院外に出さない構成も選択可能</div>
          <div><b>専門特化</b>汎用LLMのままではなく、診療科・高頻度疾患向けの知識とテンプレートを整備</div>
          <div><b>既存投資の保護</b>業務システムは既存HIS／EMRを活かし、AI層を分離して拡張</div>
        </div>
      </div>
      ${takeaway("第08章のMicrosoftスタック事例とは実装基盤が異なります。臨床領域に特化したエンジンと院内連携を前提に設計しています。")}`,
      "c8",
    ),

    // 61 — セキュリティと原則
    () => frame(
      61,
      "SECURITY & GOVERNANCE",
      "安全で信頼できる医療システムであること",
      "権限・隔離・監査・意思決定の境界を、設計段階から固定します。",
      `<div class="c8-body c8-split c8-split--even">
        <section class="c8-split__main">
          <div class="c8-label">セキュリティとコンプライアンス</div>
          ${table(
            ["項目", "内容"],
            [
              ["身元確認", "招待コード／医療機関の実名認証による医師アカウント登録"],
              ["データ隔離", "機関・診療科・医師単位のマルチテナント分離"],
              ["配置", "院内ネットワークへのプライベート展開に対応"],
              ["監査", "誰が・いつ・何を閲覧／出力したかの全経路ログ"],
              ["プライバシー", "研究・学習利用時は患者識別情報（PII）を自動除去"],
            ],
            "c8-table--compact",
          )}
        </section>
        <section class="c8-split__main">
          <div class="c8-label">臨床意思決定の原則</div>
          <div class="c8-guard">
            <h4>必ず守る境界</h4>
            <div class="c8-guard__cols" style="grid-template-columns:1fr">
              <div><b>01</b>本システムは医師の独立した専門判断を代替・変更・拘束しない</div>
              <div><b>02</b>診断・治療およびそれに伴う責任は、署名医師が負う</div>
              <div><b>03</b>循証・適合の提案には、検証可能な出典を付与する</div>
              <div><b>04</b>採択前に二次確認を促し、不確実性を明示する</div>
            </div>
          </div>
        </section>
      </div>
      ${takeaway("技術の価値は、医師の判断を奪うことではなく、判断に必要な根拠と時間を返すことにあります。")}`,
      "c8",
    ),

    // 62 — 導入事例サマリー
    () => frame(
      62,
      "CASE SUMMARY",
      "クリニックから大学附属病院まで、現場で検証された導入",
      "いずれも医療機関向け。診療科の特性に合わせ、病歴生成・循証・適合の比重を調整しています。",
      `<div class="c8-body">
        ${table(
          ["", "医療機関A<small>クリニックチェーン</small>", "医療機関B<small>大学附属病院</small>", "医療機関C<small>周産期・婦人科</small>", "医療機関D<small>中西医結合</small>"],
          [
            ["焦点", "小児・美容・総合外来の文書負荷", "美容科・呼吸器の外来／入院", "産婦人科超音波の報告", "中西医の問診・病歴・保険"],
            ["主な施策", "対話の構造化病歴、証跡、コーディング助言", "専門用語認識、入院・退院支援、フォロー記録", "音声操作・テンプレート・報告品質", "予診、リアルタイム助手、DRG連携"],
            ["状況", badge("稼働中", "live"), badge("稼働中", "live"), badge("稼働中", "live"), badge("構築中〜展開", "prep")],
            ["成果（例）", "医師効率 約30〜40%向上", "病歴時間 約35%短縮／完全性 98%超", "検査＋報告 約31%短縮／認識精度 96%以上", "段階導入で全院の中西医知能化を推進"],
          ],
          "c8-table--summary",
        )}
        <p class="c8-note">※ 施設名は非公開です。成果数値は各導入先の報告値です。</p>
      </div>
      ${takeaway("規模や診療科が違っても、「対話の構造化 → 医師確認 → システム連携」の型は共通です。")}`,
      "c8",
    ),

    // 63 — 事例 A・B
    () => frame(
      63,
      "CASE A・B",
      "連鎖クリニックと大学附属病院での定着",
      "文書負荷の高い外来と、専門性の高い入院・フォローの双方で効果を確認しています。",
      `<div class="c8-body c8-split c8-split--even">
        <section class="c8-split__main">
          <div class="c8-label">医療機関A｜中高価格クリニックチェーン</div>
          ${panel(
            "SCOPE",
            "小児・美容・総合外来へ横展開",
            `<ul class="c8-list">
              <li>保護者との問診が複雑で情報量が多い小児科</li>
              <li>個別プランと同意取得が重要な美容外来</li>
              <li>短時間・高頻度の総合外来での標準病歴</li>
            </ul>`,
            true,
          )}
          <div class="c8-kpi" style="margin-top:16px">
            <div class="c8-kpi__value"><span>30</span><i>–</i><span>40</span><i>%</i></div>
            <div class="c8-kpi__text">医師効率の向上<small>日々の文書時間を大幅に削減。手入力から確認中心へ</small></div>
          </div>
        </section>
        <section class="c8-split__main">
          <div class="c8-label">医療機関B｜大学附属病院</div>
          <div class="c8-scope">
            <div class="c8-scope__cols">
              <div>
                <h4>美容科</h4>
                <ul class="c8-list c8-list--check">
                  <li>問診の全程録音と構造化病歴</li>
                  <li>皮膚・形成の専門用語認識</li>
                  <li>術前評価・術後フォローの一括生成</li>
                </ul>
              </div>
              <div>
                <h4>呼吸器内科</h4>
                <ul class="c8-list c8-list--check">
                  <li>慢性疾患フォロー記録の自動生成</li>
                  <li>肺機能報告と病歴の関連付け</li>
                  <li>入院病歴・退院サマリー支援</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="c8-kpi" style="margin-top:16px">
            <div class="c8-kpi__value"><span>35</span><i>%</i><em>／</em><span>98</span><i>%+</i></div>
            <div class="c8-kpi__text">病歴時間の短縮 ／ 項目完全性<small>1日あたり約1.5時間の文書削減（美容科）。入院病歴効率 約40%向上</small></div>
          </div>
        </section>
      </div>
      ${takeaway("外来の速度と、専門科の精度。どちらも「下書き生成＋根拠遡及＋医師確認」で両立しています。")}`,
      "c8",
    ),

    // 64 — 事例 C・D
    () => frame(
      64,
      "CASE C・D",
      "専門検査と中西医領域への拡張",
      "超音波報告のような装置併設業務から、中西医の知識体系まで、同じ基盤で専門特化できます。",
      `<div class="c8-body c8-split c8-split--even">
        <section class="c8-split__main">
          <div class="c8-label">医療機関C｜婦人科・周産期専門病院（超音波）</div>
          <ul class="c8-list">
            <li>音声指示、テンプレート提示、数値の自動記入</li>
            <li>履歴報告の知能的提示と品質アラート</li>
            <li>「検査→切替→入力」から「検査しながら入力」へ</li>
          </ul>
          <div class="c8-kpi" style="margin-top:14px">
            <div class="c8-kpi__value"><span>31</span><i>%</i><em>／</em><span>96</span><i>%+</i></div>
            <div class="c8-kpi__text">検査＋報告時間の短縮 ／ 認識精度<small>累計5,700件超の報告。日次の対応件数 約25%増</small></div>
          </div>
        </section>
        <section class="c8-split__main">
          <div class="c8-label">医療機関D｜中西医結合病院</div>
          <ul class="c8-list">
            <li>AI予診、中西医リアルタイム問診助手、病歴助手</li>
            <li>中医病歴の質管理、保険・DRGエンジンとの協調</li>
            <li>業務システムとAI層を分離し、既存投資を保護</li>
          </ul>
          <div class="c8-mini-flow" style="margin-top:14px">
            <div><b>01</b>基盤・設備</div>
            <div><b>02</b>中西医コア業務</div>
            <div><b>03</b>全院の知能化</div>
          </div>
          <p class="c8-note" style="margin-top:10px">重点シーンから段階導入し、リスクを抑えながら範囲を広げます。</p>
        </section>
      </div>
      ${takeaway("臨床AIは「一つの画面」ではなく、診療科の知識と装置・保険制度に合わせて厚みを変えられる基盤です。")}`,
      "c8",
    ),

    // 65 — ご提案
    () => frame(
      65,
      "PROPOSAL",
      "日本の医療機関に、使える臨床AIを届けたい",
      "第08章の業務AI事例とは別に、臨床現場に特化した導入をご提案します。テラボックスが要件整理から定着まで伴走します。",
      `<div class="c8-body">
        <div class="c8-themes">
          ${[
            ["外来文書の負荷低減", "対話の構造化病歴と根拠遡及で、医師の確認中心の運用へ移行します。"],
            ["診療科特化の知識整備", "高頻度疾患・専門用語・テンプレートを、施設ごとに段階的に最適化します。"],
            ["既存HIS／EMRとの連携", "現行システムを活かし、院内プライベート展開にも対応します。"],
            ["質管理と保険適合の事前化", "差戻しや紛争の事後対応を減らし、証跡のあるプロセスを定着させます。"],
          ]
            .map(([title, text], i) => `<section><b>${String(i + 1).padStart(2, "0")}</b><h3>${title}</h3><p>${text}</p></section>`)
            .join("")}
        </div>
        <div class="c8-nextsteps">
          <div class="c8-label">次のステップ</div>
          <div class="c8-nextsteps__flow">
            <div><b>01</b>課題ヒアリング（診療科・文書・連携）</div>
            <span aria-hidden="true">→</span>
            <div><b>02</b>パイロット診療科の選定</div>
            <span aria-hidden="true">→</span>
            <div><b>03</b>小規模PoCと定着支援</div>
          </div>
        </div>
      </div>
      ${takeaway("実装フレームワークは第08章と異なりますが、「AIは一次処理、人は最終判断」という原則は共通です。")}`,
      "c8",
    ),
  ];
}
