/* Chapter 06: standalone TPS customer story — retains evidence photos from the original PPT. */
function buildChapter10({ frame, sectionSlide, startPage = 80 }) {
  const page = (offset, eyebrow, title, lead, body) =>
    () => frame(startPage + offset, eyebrow, title, lead, body, "c8 c10 c10-story");
  const image = (file, alt, caption) => `
    <figure class="c10-photo">
      <img src="./TPS/assets/${file}" alt="${alt}" />
      <figcaption>${caption}</figcaption>
    </figure>`;
  const takeaway = (text) => `<div class="c8-takeaway"><span>POINT</span><p>${text}</p></div>`;

  return [
    () => sectionSlide(startPage, "10", "TPS CUSTOMER CASE", "事例｜TPS改善", "弁当・惣菜ラインの動線と配置を見直し、誰でも再現できる標準へ。", [
      ["現状を観察", "現場写真と作業手順で事実を共有", null, 70],
      ["標準作業", "写真と手順書で作業を見える化", null, 71],
      ["ムダを減らす", "歩行・探索・切替の時間を短縮", null, 72],
      ["配置を整える", "食材ゾーンと台車の位置を標準化", null, 73],
    ]),
    page(
      1,
      "10 / CASE OVERVIEW",
      "弁当・惣菜ラインの現状を、現場写真から読み解く",
      "多品種・短納期・厳格な衛生管理が求められる食品製造の改善事例です。",
      `<div class="c10-story-overview">
        ${image("case-line-overview.jpg", "食品工場の盛り付けライン", "原資料｜盛り付けラインの現場")}
        <div class="c10-case-at">
          <section><small>AS-IS</small><h2>歩行・探索・切替が発生</h2><ul>
            <li>頻繁に使う備品が作業点から離れている</li><li>食材と器具の位置を経験で判断する</li><li>段取り方法が人によって異なる</li>
          </ul></section><i>→</i>
          <section class="is-to"><small>TO-BE</small><h2>配置と手順を標準化</h2><ul>
            <li>備品を使用点へ定位置化する</li><li>食材を左右・使用順でゾーニングする</li><li>配置図と手順書で状態を維持する</li>
          </ul></section>
        </div>
      </div>${takeaway("生産性とともに、衛生・アレルゲン・温度・異物混入の管理条件も標準へ含めます。")}`,
    ),
    page(
      2,
      "10 / STANDARD WORK",
      "写真と手順書で、金属探知チェックを見える化",
      "作業の順序と標準時間を記録し、担当者が変わっても確認できる形にします。",
      `<div class="c10-standard-work">
        <div class="c10-standard-work__photos">
          ${image("case-worker.jpg", "食品工場の作業者", "原資料｜作業現場")}
          ${image("case-check-label.jpg", "作業者のチェック表示", "原資料｜作業表示")}
          ${image("case-standard-sheet.png", "原資料の標準作業票", "原資料｜標準作業票")}
        </div>
        <div class="c10-standard-work__steps">
          <div><b>01</b><span>指示書BOXからラベルを取り出し、貼付・確認</span><strong>5秒</strong></div>
          <div><b>02</b><span>ラベルを箱取り担当者へ渡す</span><strong>5秒</strong></div>
          <div><b>03</b><span>指示書を使って製品を確認</span><strong>5秒</strong></div>
          <div><b>04</b><span>金属探知チェックを実施。異常時はライン停止</span><strong>5秒</strong></div>
          <div><b>05</b><span>日報へ人数・先頭時間・設備番号・サインを記録</span><strong>5秒</strong></div>
        </div>
      </div>${takeaway("写真、標準時間、異常時の対応を一組にして、教育と日々の確認に使います。")}`,
    ),
    page(
      3,
      "10 / MOTION KAIZEN",
      "衛生用品を使用点へ移し、歩行のムダを減らす",
      "盛り付け中に離れた場所まで取りに行っていた備品を、手の届く定位置へ移しました。",
      `<div class="c10-before-after">
        <section><small>BEFORE</small><h2>作業点から離れた備品</h2>
          ${image("case-before.jpg", "改善前の盛り付け作業と離れた衛生用品", "原資料｜改善前")}
          <p>作業を中断して往復。歩行と手待ちが発生。</p>
        </section><b aria-hidden="true">→</b>
        <section class="is-to"><small>AFTER</small><h2>使用点へ吊り下げて定位置化</h2>
          ${image("case-after.jpg", "改善後、手の届く位置に吊るした衛生用品", "原資料｜改善後")}
          <p>手を伸ばしてすぐ使え、位置の異常も見つけやすい。</p>
        </section>
      </div>${takeaway("頻度と所要時間を測り、1回あたりの短縮を一日の作業量・人数に換算して効果を確認します。")}`,
    ),
    page(
      4,
      "10 / LAYOUT & STANDARDIZATION",
      "食材ゾーンと台車の位置を決め、段取りを短縮",
      "原資料では、品種切替の段取りを役割分担や配置変更で短縮しています。",
      `<div class="c10-layout-result">
        <div class="c10-layout-result__metrics">
          <article><small>小ロット・多品種ライン</small><strong>5分 → 2分30秒</strong><span>役割分担による切替時間</span></article>
          <article><small>大ロットライン</small><strong>8分 → 2分</strong><span>配膳台車による切替時間</span></article>
          <p>原資料の記載値。対外提案時は対象商品・測定回数・人員などの条件を添えて提示します。</p>
        </div>
        <div class="c10-layout-result__photos">
          ${image("case-food-zones.png", "食材の左右配置を示す原資料", "原資料｜食材配置指示書")}
          ${image("case-serving-cart.jpg", "青い天板の配膳台車", "原資料｜配膳台車")}
        </div>
      </div>
      <div class="c10-case-cards">
        <article><b>01</b><h3>配置を図示</h3><p>左右の食材と使用順を明確にする。</p></article>
        <article><b>02</b><h3>現物を表示</h3><p>台車・容器・棚の位置を合わせる。</p></article>
        <article><b>03</b><h3>開始前に確認</h3><p>位置・数量・衛生状態を確認する。</p></article>
        <article><b>04</b><h3>標準を維持</h3><p>写真と手順で教育し、逸脱を直す。</p></article>
      </div>${takeaway("改善を一時的な整理で終わらせず、配置図・手順・教育・確認まで標準化します。")}`,
    ),
  ];
}
