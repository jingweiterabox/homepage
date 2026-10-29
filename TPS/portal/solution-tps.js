/* Solution 5.4 — public one-page summaries; source-deck details stay offline. */
function buildSolutionTps({ frame, sectionSlide }) {
  return [
    () => sectionSlide(
      39,
      "5.4",
      "TOYOTA PRODUCTION SYSTEM",
      "TPS・現場改善部",
      "トヨタ生産方式（TPS）の考え方と実践を通じ、現場の継続的改善を支援します。",
      [
        ["目的と基本原則", "TPSのねらいと二本の柱", "5.4.1", 40],
        ["現場での実践", "観察・改善・効果確認・標準化", "5.4.2", 41],
      ],
    ),
    () => frame(
      40,
      "5.4.1 / PURPOSE & PRINCIPLES",
      "トヨタ生産方式の目的と、支え合う二つの柱",
      "必要なものを、必要なときに、必要な量だけつくり、異常を後工程へ流さない。人の知恵を生かしながら、品質・納期・コストを同時に高めます。",
      `<div class="tps-summary tps-summary--principles">
        <div class="tps-house" role="img" aria-label="TPSの家。顧客価値とQCDを頂点に、ジャスト・イン・タイムと自働化の二本柱を、平準化・標準作業・人材育成と継続的改善が支える。">
          <div class="tps-house__roof"><div><small>目指すもの</small><strong>顧客価値</strong><span>品質 <b>Q</b>　・　納期 <b>D</b>　・　コスト <b>C</b></span></div></div>
          <div class="tps-house__pillars">
            <section><small>柱 01 / JUST-IN-TIME</small><h2>必要なものを、必要なときに</h2><p>後工程の使用に合わせて生産・補充し、流れとタクトを整える。</p><b>タクト　｜　流れ　｜　かんばん引取り</b></section>
            <section><small>柱 02 / JIDOKA（自働化）</small><h2>異常を止め、品質を工程でつくる</h2><p>異常を検知したら止めて知らせ、原因を除いて再発を防ぐ。</p><b>検知　｜　停止・通知　｜　再発防止</b></section>
          </div>
          <div class="tps-house__foundation"><b>土台</b><span>平準化</span><i>＋</i><span>標準作業</span><i>＋</i><span>人材育成・継続的改善（カイゼン）</span></div>
        </div>
        <p class="tps-summary__note">TPSは道具の導入だけではなく、現場の事実を基に問題を解決し、改善を続ける運営の仕組みです。</p>
      </div>`,
      "tps-summary-slide",
    ),
    () => frame(
      41,
      "5.4.2 / PRACTICE & KAIZEN",
      "現場の事実から始める、TPS改善の進め方",
      "現場を観察し、小さく試し、効果を確かめて標準にする。安全・品質を守りながら、次の改善へつなげます。",
      `<div class="tps-summary tps-summary--practice">
        <div class="tps-summary__flow" aria-label="改善の六段階">
          <div><b>01</b><span>需要・P-Q</span></div><i>→</i><div><b>02</b><span>現場観察</span></div><i>→</i><div><b>03</b><span>ムダ特定</span></div><i>→</i><div><b>04</b><span>改善試行</span></div><i>→</i><div><b>05</b><span>効果測定</span></div><i>→</i><div><b>06</b><span>標準化</span></div>
        </div>
        <div class="tps-summary__steps">
          <article><b>01</b><small>目的をそろえる</small><h2>需要と品種を整理</h2><p>顧客需要からタクトを確認し、品種・数量（P-Q）を整理して目標を定める。</p></article>
          <article><b>02</b><small>現場を観察する</small><h2>モノと情報を見える化</h2><p>後工程から現地現物で追い、作業時間・移動・仕掛かり・情報の流れを記録。</p></article>
          <article><b>03</b><small>原因を見極める</small><h2>ムダとばらつきを特定</h2><p>七つのムダ、動作、標準作業との差を見て、問題の真因を掘り下げる。</p></article>
          <article><b>04</b><small>改善を試す</small><h2>流れ・配置・方法を変える</h2><p>工程配置、1個流し、かんばん引取り、作業順序や負荷配分を小さく試行。</p></article>
          <article><b>05</b><small>効果を確かめる</small><h2>改善前後を測る</h2><p>同じ条件で品質、リードタイム、仕掛かり、安全への影響を確認。</p></article>
          <article><b>06</b><small>標準化して続ける</small><h2>標準作業に反映</h2><p>手順を共有・教育し、多能工化と日々の確認で維持して次の課題へ。</p></article>
        </div>
        <div class="tps-summary__cycle"><strong>改善後も維持状況を確認し、新たな問題が見えたら観察へ戻る</strong><i>↻</i></div>
        <p class="tps-summary__note">改善の指標例：安全・品質・リードタイム・仕掛かり・作業負荷。数値は対象工程と測定条件をそろえて比較します。</p>
      </div>`,
      "tps-summary-slide",
    ),
  ];
}
