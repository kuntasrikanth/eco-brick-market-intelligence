const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");

// ---------- palette (earth / terracotta — content-informed) ----------
const DARK   = "262019";  // deep earth (dark slides)
const DARK2  = "33291F";  // ink text on light
const TERRA  = "B85042";  // terracotta (primary accent)
const TERRA2 = "8F3D31";  // deep terracotta
const SAND   = "EDE7D9";  // warm sand (light panels, used sparingly)
const SANDLT = "F6F2EA";  // very light sand
const GREEN  = "5C8A5A";  // sage/eco accent
const GREEN2 = "47704A";
const MUTED  = "7A6E60";  // muted captions
const WHITE  = "FFFFFF";
const GOLD   = "D8A24A";  // warm highlight

const HFONT = "Cambria";   // header (safe serif w/ personality)
const BFONT = "Calibri";   // body (safe sans)

// ---------- icon prerender ----------
function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function iconPng(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function main() {
  // preload icons
  const I = {};
  const need = {
    clock: [FA.FaRegClock, WHITE], truck: [FA.FaTruckMoving, WHITE], leaf: [FA.FaLeaf, WHITE],
    users: [FA.FaUsers, WHITE], home: [FA.FaHome, WHITE], seed: [FA.FaSeedling, WHITE],
    trophy: [FA.FaTrophy, WHITE], cert: [FA.FaCertificate, WHITE], flask: [FA.FaFlask, WHITE],
    globe: [FA.FaGlobe, WHITE], check: [FA.FaCheck, GREEN], checkw: [FA.FaCheck, WHITE],
    map: [FA.FaMapMarkerAlt, WHITE], coins: [FA.FaCoins, WHITE], chart: [FA.FaChartLine, WHITE],
    cubes: [FA.FaCubes, WHITE], mountain: [FA.FaMountain, WHITE], hardhat: [FA.FaHardHat, WHITE],
    recycle: [FA.FaRecycle, WHITE], industry: [FA.FaIndustry, WHITE], bolt: [FA.FaBolt, WHITE],
    handshake: [FA.FaHandshake, WHITE], rupee: [FA.FaRupeeSign, WHITE], times: [FA.FaTimes, TERRA],
    arrow: [FA.FaArrowRight, TERRA], building: [FA.FaBuilding, WHITE],
  };
  for (const k in need) I[k] = await iconPng(need[k][0], need[k][1], 256);

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.author = "TerraBlock";
  pres.title = "TerraBlock — Investor Presentation";
  const W = 10, H = 5.625;

  const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.16 });

  // helper: icon inside a coloured circle
  function iconCircle(slide, iconKey, cx, cy, d, circColor) {
    slide.addShape(pres.shapes.OVAL, { x: cx, y: cy, w: d, h: d, fill: { color: circColor }, line: { type: "none" } });
    const pad = d * 0.27;
    slide.addImage({ data: I[iconKey], x: cx + pad, y: cy + pad, w: d - 2 * pad, h: d - 2 * pad });
  }
  // helper: small kicker label
  function kicker(slide, text, x, y, color = TERRA) {
    slide.addText(text.toUpperCase(), { x, y, w: 9, h: 0.3, fontFace: BFONT, fontSize: 12, bold: true, color, charSpacing: 3, margin: 0 });
  }
  // helper: source footer
  function source(slide, text) {
    slide.addText(text, { x: 0.5, y: H - 0.34, w: W - 1, h: 0.26, fontFace: BFONT, fontSize: 8, italic: true, color: MUTED, align: "left", margin: 0 });
  }
  // helper: slide number
  function pageNo(slide, n) {
    slide.addText(String(n).padStart(2, "0"), { x: W - 0.85, y: H - 0.4, w: 0.5, h: 0.3, fontFace: BFONT, fontSize: 10, color: MUTED, align: "right", margin: 0 });
  }

  // ===================================================================
  // SLIDE 1 — TITLE
  // ===================================================================
  let s = pres.addSlide();
  s.background = { color: DARK };
  // motif: faint stacked-brick blocks bottom-right
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    s.addShape(pres.shapes.RECTANGLE, { x: 6.55 + c * 0.62 + (r % 2) * 0.31, y: 3.75 + r * 0.42, w: 0.54, h: 0.34,
      fill: { color: r === 1 && c === 2 ? TERRA : "32281E" }, line: { color: "3D3024", width: 0.5 } });
  }
  s.addText("TERRABLOCK", { x: 0.6, y: 1.35, w: 8, h: 0.9, fontFace: HFONT, fontSize: 54, bold: true, color: WHITE, charSpacing: 2, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.62, y: 2.32, w: 0.55, h: 0.07, fill: { color: TERRA }, line: { type: "none" } });
  s.addText("Telangana's first machine-made mud interlocking brick", { x: 0.6, y: 2.5, w: 8.6, h: 0.5, fontFace: HFONT, fontSize: 22, italic: true, color: SAND, margin: 0 });
  s.addText([
    { text: "Compressed Stabilised Earth Blocks (CSEB)", options: { color: GOLD, bold: true } },
    { text: "   ·   Ranga Reddy District   ·   2026", options: { color: "BCAE9C" } },
  ], { x: 0.62, y: 3.15, w: 9, h: 0.4, fontFace: BFONT, fontSize: 14, margin: 0 });
  s.addText("INVESTOR PRESENTATION", { x: 0.62, y: 4.85, w: 6, h: 0.3, fontFace: BFONT, fontSize: 12, bold: true, color: TERRA, charSpacing: 4, margin: 0 });
  s.addNotes("Good morning, and thank you all for your time. I am the founder of TerraBlock. In the next ten minutes, I will show you a clear gap in the Telangana construction market that nobody is serving today — and how we plan to fill it with a brick that is cheaper to make, greener, and faster to build with. Just one request — please hold your questions till the end, and I will be very happy to take all of them. Let us begin.");

  // ===================================================================
  // SLIDE 2 — THE GAP (HOOK)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "The opportunity", 0.6, 0.5);
  s.addText("We mapped every brick factory in Telangana.", { x: 0.6, y: 0.82, w: 8.8, h: 0.6, fontFace: HFONT, fontSize: 28, bold: true, color: DARK2, margin: 0 });
  // three big stat blocks
  const gap = [
    ["355", "factories surveyed\nacross 31 districts", TERRA],
    ["55%", "still hand-made —\nno modernisation", GOLD],
    ["0", "make mud interlocking\nbricks at machine scale", GREEN],
  ];
  gap.forEach((g, i) => {
    const x = 0.6 + i * 3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 2.75, h: 2.35, fill: { color: i === 2 ? DARK : SANDLT }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
    s.addText(g[0], { x, y: 2.05, w: 2.75, h: 1.1, fontFace: HFONT, fontSize: 66, bold: true, color: g[2], align: "center", margin: 0 });
    s.addText(g[1], { x: x + 0.2, y: 3.2, w: 2.35, h: 0.85, fontFace: BFONT, fontSize: 13.5, color: i === 2 ? SAND : DARK2, align: "center", margin: 0 });
  });
  s.addText([
    { text: "This is not a demand gap. It is an ", options: {} },
    { text: "empty shelf.", options: { bold: true, color: TERRA } },
  ], { x: 0.6, y: 4.45, w: 8.8, h: 0.5, fontFace: HFONT, fontSize: 20, italic: true, color: DARK2, margin: 0 });
  source(s, "Source: TerraBlock field survey of 355 brick manufacturers, Telangana (Google Maps, 2025).");
  pageNo(s, 2);
  s.addNotes("We did not start with an idea — we started with data. We surveyed every single brick factory in Telangana. All 355 of them, across 31 districts. And see what we found. More than half are still hand-made — no machines, no modernisation at all. And the most important number — zero. Not one factory makes machine-made mud interlocking bricks. So please understand, this is not a demand problem. The demand is very much there. It is simply an empty shelf, waiting for someone to stock it. That someone is us.");

  // ===================================================================
  // SLIDE 3 — THE PROBLEM
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "The problem", 0.6, 0.5);
  s.addText("Building with brick in Telangana is slow, costly and unverified", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 26, bold: true, color: DARK2, margin: 0 });
  const probs = [
    ["clock", "Skilled labour is scarce", "India's construction sector is short ~2 million skilled workers. Mason wages have risen 8–12% in a year. Conventional brick walls need mortar, alignment and time.", TERRA],
    ["truck", "Supply is unreliable", "Fly ash bricks depend on power-plant ash supply, which swings with plant utilisation. When supply stalls, the project stalls.", TERRA2],
    ["leaf", "No eco product at scale", "Green-rated projects (IGBC / PMAY) cannot source a certified low-carbon brick locally. The category simply doesn't exist here yet.", GREEN],
  ];
  probs.forEach((p, i) => {
    const y = 1.7 + i * 1.18;
    iconCircle(s, p[0], 0.65, y, 0.78, p[3]);
    s.addText(p[1], { x: 1.65, y: y - 0.02, w: 7.7, h: 0.4, fontFace: HFONT, fontSize: 18, bold: true, color: DARK2, margin: 0 });
    s.addText(p[2], { x: 1.65, y: y + 0.38, w: 7.7, h: 0.7, fontFace: BFONT, fontSize: 12.5, color: "55493D", margin: 0 });
  });
  source(s, "Sources: GeoSquare / RPRealtyPlus (2M skilled-worker shortage); AECORD labour rates 2026; IGBC.");
  pageNo(s, 3);
  s.addNotes("Every builder in Telangana is facing three problems today. Number one — skilled labour is very hard to get. The country is short of nearly two million skilled workers, and mason wages have gone up 8 to 12 per cent in just one year. Number two — fly ash brick supply is unreliable, because it depends fully on the power plants. When the plant slows down, your supply stops, and your project gets stuck. Number three — there is no certified eco-brick available locally, so green-rated projects simply cannot source one here. Now keep these three problems in mind, because our product solves all three together.");

  // ===================================================================
  // SLIDE 4 — THE PRODUCT
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: SANDLT };
  kicker(s, "The product", 0.6, 0.5);
  s.addText("A 5,000-year-old material, with a modern machine behind it", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 24, bold: true, color: DARK2, margin: 0 });
  // left: definition card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 4.0, h: 3.2, fill: { color: DARK }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
  iconCircle(s, "cubes", 0.95, 2.0, 0.7, TERRA);
  s.addText("Compressed Stabilised\nEarth Block (CSEB)", { x: 1.8, y: 2.0, w: 2.6, h: 0.75, fontFace: HFONT, fontSize: 16, bold: true, color: WHITE, margin: 0 });
  const specs = [
    "Local soil + 5–8% cement, hydraulically pressed",
    "No kiln, no firing — cured, not burnt",
    "Self-interlocking edges — little/no mortar",
    "Meets BIS IS 1725 · target IGBC certified",
  ];
  s.addText(specs.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true, paraSpaceAfter: 8 } })),
    { x: 0.95, y: 2.95, w: 3.45, h: 1.8, fontFace: BFONT, fontSize: 12.5, color: SAND, margin: 0 });
  // right: why mud beats fly ash (comparison)
  s.addText("Why mud beats the market", { x: 4.95, y: 1.7, w: 4.5, h: 0.4, fontFace: HFONT, fontSize: 16, bold: true, color: TERRA2, margin: 0 });
  const comp = [
    ["Raw material", "Local soil — under your feet", "Bought-in fly ash"],
    ["Energy", "Cold press — no kiln", "Kiln / steam curing"],
    ["For the builder", "Stacks fast, less mortar", "Conventional laying"],
    ["Carbon", "Low — no firing", "Medium"],
    ["In Telangana", "Unique — 0 competitors", "Commodity — 100s"],
  ];
  const tbl = [[
    { text: "", options: { fill: { color: SANDLT } } },
    { text: "Mud interlocking", options: { fill: { color: GREEN }, color: WHITE, bold: true, fontSize: 11, align: "center" } },
    { text: "Fly ash brick", options: { fill: { color: "B7AC9C" }, color: WHITE, bold: true, fontSize: 11, align: "center" } },
  ]];
  comp.forEach(r => tbl.push([
    { text: r[0], options: { bold: true, color: DARK2, fontSize: 10.5, fill: { color: WHITE } } },
    { text: r[1], options: { color: GREEN2, fontSize: 10.5, fill: { color: "EEF4EE" }, align: "center" } },
    { text: r[2], options: { color: MUTED, fontSize: 10.5, fill: { color: WHITE }, align: "center" } },
  ]));
  s.addTable(tbl, { x: 4.95, y: 2.15, w: 4.5, colW: [1.4, 1.65, 1.45], rowH: 0.46, border: { type: "solid", pt: 1, color: "E2D9C8" }, valign: "middle", margin: 2 });
  source(s, "Sources: Auroville Earth Institute; GoodEarth; Brick&Bolt CSEB guide (5–9% cement, kiln-free, ~8% cheaper construction).");
  pageNo(s, 4);
  s.addNotes("So what exactly are we making? It is called a Compressed Stabilised Earth Block, or CSEB. The idea is simple but powerful. We take local soil, mix just 5 to 8 per cent cement into it, and press it under very high pressure in a machine. No kiln. No firing. The block is cured, not burnt — so we save a huge amount of energy. And the edges interlock, like Lego, so the builder needs very little mortar. Please look at the comparison table on the right. On every single point — raw material, energy, carbon, cost to the builder — mud beats fly ash. And the bottom line — in Telangana, we are the only ones making it.");

  // ===================================================================
  // SLIDE 5 — WHY NOW
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Why now", 0.6, 0.5);
  s.addText("Three forces are opening this market at the same time", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 25, bold: true, color: DARK2, margin: 0 });
  const forces = [
    ["seed", "Green building is booming", "$15.5B", "India green-materials market in 2025 → $32.2B by 2032 (11.3% CAGR). IGBC is headquartered in Hyderabad.", GREEN],
    ["users", "Labour is getting scarce", "2 million", "skilled-worker shortage nationwide. Wages up 8–12% in a year — builders want products that cut on-site labour.", TERRA],
    ["home", "Government is building", "1 crore", "homes targeted under PMAY-U 2.0 by 2029 — over 1 million already sanctioned. A decade of guaranteed demand.", GOLD],
  ];
  forces.forEach((f, i) => {
    const x = 0.6 + i * 3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: 2.75, h: 3.05, fill: { color: SANDLT }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
    iconCircle(s, f[0], x + 0.28, 2.0, 0.66, f[4]);
    s.addText(f[1], { x: x + 0.25, y: 2.78, w: 2.3, h: 0.55, fontFace: HFONT, fontSize: 15, bold: true, color: DARK2, margin: 0 });
    s.addText(f[2], { x: x + 0.25, y: 3.3, w: 2.3, h: 0.55, fontFace: HFONT, fontSize: 30, bold: true, color: f[4], margin: 0 });
    s.addText(f[3], { x: x + 0.25, y: 3.9, w: 2.3, h: 0.85, fontFace: BFONT, fontSize: 10.5, color: "55493D", margin: 0 });
  });
  source(s, "Sources: PS Market Research (green materials); GeoSquare & AECORD (labour); PIB / Business Standard (PMAY-U 2.0).");
  pageNo(s, 5);
  s.addNotes("Now you may ask — why now? Why is this the right time? Because three big forces are coming together at the same moment. First, green building is booming — it is already a 15.5 billion dollar market, growing to 32 billion by 2032. And here is a lovely point — IGBC, the Indian Green Building Council, is headquartered right here in Hyderabad, in our own backyard. Second, the labour shortage I just mentioned — builders are now actively looking for products that reduce work at the site. Third, the government itself is building — one crore homes under PMAY by 2029. So that is a full decade of guaranteed demand. The timing is just right.");

  // ===================================================================
  // SLIDE 6 — MARKET SIZE
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: DARK };
  kicker(s, "Market size", 0.6, 0.5, GOLD);
  s.addText("A vast market — we need only a sliver of it", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 26, bold: true, color: WHITE, margin: 0 });
  // funnel as three stacked bars (TAM/SAM/SOM)
  const funnel = [
    ["TAM", "₹2,800 Cr / yr", "All brick demand in Telangana", 8.4, TERRA],
    ["SAM", "₹840 Cr / yr", "Ranga Reddy + 4 adjacent districts", 5.6, TERRA2],
    ["SOM", "₹2.9 Cr / yr", "Our Year-3 target — just 0.35% of SAM", 2.9, GREEN],
  ];
  funnel.forEach((f, i) => {
    const y = 1.85 + i * 1.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: f[3], h: 0.82, fill: { color: f[4] }, line: { type: "none" }, rectRadius: 0.06 });
    s.addText(f[0], { x: 0.8, y, w: 1.1, h: 0.82, fontFace: HFONT, fontSize: 22, bold: true, color: WHITE, valign: "middle", margin: 0 });
    s.addText(f[1], { x: 1.85, y, w: 2.6, h: 0.82, fontFace: HFONT, fontSize: 18, bold: true, color: WHITE, valign: "middle", margin: 0 });
    s.addText(f[2], { x: 4.5, y, w: f[3] - 3.95 < 1.5 ? 4.2 : f[3] - 3.95, h: 0.82, fontFace: BFONT, fontSize: 11.5, color: i === 2 ? "EAF2EA" : "F3E7E2", valign: "middle", margin: 0 });
  });
  s.addText([
    { text: "Context:  ", options: { bold: true, color: GOLD } },
    { text: "India produces ~150 billion bricks a year; its construction sector is worth ₹25.3 trillion and growing 11%+.", options: { color: SAND } },
  ], { x: 0.6, y: 4.95, w: 9, h: 0.4, fontFace: BFONT, fontSize: 11.5, italic: true, margin: 0 });
  source(s, "Sources: Market Growth Reports (~150B bricks); ResearchAndMarkets (₹25.3T construction). TAM/SAM/SOM are founder estimates.");
  pageNo(s, 6);
  s.addNotes("Let me now put the market size in proper perspective. The total brick market in Telangana is around 2,800 crore rupees every year. Now, we are not chasing the whole state. Our serviceable area — Ranga Reddy plus four neighbouring districts — is 840 crore. And our target for Year 3 is only 2.9 crore. Just look at that ratio — it is roughly one-third of one per cent of our serviceable market. I say this very honestly to every investor — we do not need to win this market. We only need a tiny sliver of it to build a very profitable company. And for context, remember, India makes 150 billion bricks a year. This is an ocean.");

  // ===================================================================
  // SLIDE 7 — LOCATION (data-driven, bar chart)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Location strategy", 0.6, 0.5);
  s.addText("We scored all 31 districts. Ranga Reddy ranked #1.", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 25, bold: true, color: DARK2, margin: 0 });
  s.addChart(pres.charts.BAR, [{
    name: "Composite score",
    labels: ["Ranga Reddy", "Kamareddy", "Wanaparthy", "Sangareddy", "Jagtial", "Nizamabad"],
    values: [0.797, 0.710, 0.687, 0.611, 0.608, 0.602],
  }], {
    x: 0.5, y: 1.65, w: 5.4, h: 3.4, barDir: "bar",
    chartColors: [TERRA],
    chartArea: { fill: { color: "FFFFFF" } },
    catAxisLabelColor: "55493D", catAxisLabelFontSize: 11, catAxisLabelFontFace: BFONT,
    valAxisHidden: true, valGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: DARK2, dataLabelFontSize: 11, dataLabelFontBold: true, dataLabelFormatCode: "0.00",
    showLegend: false, showTitle: false, barGapWidthPct: 45,
  });
  // right panel: why ranga reddy
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.15, y: 1.65, w: 3.35, h: 3.4, fill: { color: SANDLT }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
  iconCircle(s, "map", 6.45, 1.9, 0.6, TERRA);
  s.addText("Ranga Reddy", { x: 7.15, y: 1.9, w: 2.2, h: 0.35, fontFace: HFONT, fontSize: 18, bold: true, color: DARK2, margin: 0 });
  s.addText("#1 of 31 districts", { x: 7.15, y: 2.25, w: 2.2, h: 0.3, fontFace: BFONT, fontSize: 11, bold: true, color: TERRA, margin: 0 });
  const rr = [
    ["13.4 lakh", "households — the largest base in Telangana"],
    ["Only 6", "brick factories serving them — under-supplied"],
    ["Hyderabad", "on the doorstep — 30% of state construction"],
    ["NH-44 / 65", "highway access to every district < 2 hrs"],
  ];
  rr.forEach((r, i) => {
    const y = 2.72 + i * 0.57;
    s.addText([
      { text: r[0] + "  ", options: { bold: true, color: TERRA2 } },
      { text: r[1], options: { color: "55493D" } },
    ], { x: 6.45, y, w: 2.85, h: 0.5, fontFace: BFONT, fontSize: 10.8, margin: 0 });
  });
  source(s, "Source: TerraBlock 7-factor location model (demand, competition, modern gap, eco gap, stability, raw material).");
  pageNo(s, 7);
  s.addNotes("Now, where will we build the factory? We did not just pick a place by gut feeling. We built a proper scoring model with seven factors — demand, competition, modernisation gap, eco gap, stability, raw material access — and we ran all 31 districts of Telangana through it. And Ranga Reddy came out as number one, very clearly. Why? 13.4 lakh households — the largest base in the whole state. Only six factories serving all of them — badly under-supplied. Hyderabad is right on the doorstep, where 30 per cent of the state's construction is happening. And from there, by NH-44 and 65, we can reach any district within two hours. So this location decision is fully data-backed.");

  // ===================================================================
  // SLIDE 8 — COMPETITION
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Competition", 0.6, 0.5);
  s.addText("The shelf is empty — and stays empty for 18 months", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 25, bold: true, color: DARK2, margin: 0 });
  // left: who's out there
  s.addText("What the 355 factories actually make", { x: 0.6, y: 1.65, w: 4.3, h: 0.35, fontFace: HFONT, fontSize: 14, bold: true, color: TERRA2, margin: 0 });
  const seg = [
    ["198", "hand-made (clay & fly ash)", "B7AC9C"],
    ["76", "semi-automatic fly ash", "C98B6E"],
    ["64", "fully-automatic fly ash", "B85042"],
    ["0", "mud interlocking (CSEB)", GREEN],
  ];
  seg.forEach((g, i) => {
    const y = 2.1 + i * 0.62;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 4.3, h: 0.52, fill: { color: i === 3 ? "EEF4EE" : SANDLT }, line: { type: "none" }, rectRadius: 0.06 });
    s.addText(g[0], { x: 0.75, y, w: 0.9, h: 0.52, fontFace: HFONT, fontSize: 20, bold: true, color: g[2], valign: "middle", align: "center", margin: 0 });
    s.addText(g[1], { x: 1.75, y, w: 3.0, h: 0.52, fontFace: BFONT, fontSize: 12, color: DARK2, valign: "middle", margin: 0 });
  });
  // right: moat timeline
  s.addText("Why no one catches up quickly", { x: 5.2, y: 1.65, w: 4.3, h: 0.35, fontFace: HFONT, fontSize: 14, bold: true, color: TERRA2, margin: 0 });
  const moat = [
    ["cert", "BIS + IGBC certification takes 9–12 months to earn"],
    ["flask", "Soil-mix know-how is proprietary and site-specific"],
    ["handshake", "Builder relationships lock in once specified in drawings"],
    ["globe", "Digital presence — only 13.2% of rivals even have a website"],
  ];
  moat.forEach((m, i) => {
    const y = 2.12 + i * 0.66;
    iconCircle(s, m[0], 5.2, y, 0.5, TERRA);
    s.addText(m[1], { x: 5.85, y: y - 0.04, w: 3.65, h: 0.6, fontFace: BFONT, fontSize: 11.5, color: "55493D", valign: "middle", margin: 0 });
  });
  source(s, "Source: TerraBlock field survey (355 factories). Direct CSEB competitors in Telangana: zero.");
  pageNo(s, 8);
  s.addNotes("Let us talk about competition honestly. On the left, you see what the 355 factories actually make — 198 hand-made, 76 semi-automatic, 64 fully-automatic. All of them fly ash or clay. Mud interlocking? Zero. Now, a smart investor will ask — if it is such a good idea, what stops someone from copying you tomorrow? Fair question. Look at the right side. Certification — BIS and IGBC — takes 9 to 12 months to earn. The soil-mix know-how is proprietary and changes from site to site. Builder relationships, once we are specified in their drawings, get locked in. And only 13 per cent of our rivals even have a website. So realistically, we will enjoy an 18-month head start, minimum.");

  // ===================================================================
  // SLIDE 9 — BUSINESS MODEL / UNIT ECONOMICS
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: SANDLT };
  kicker(s, "Unit economics", 0.6, 0.5);
  s.addText("Soil is nearly free — so the margin is in the block", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 24, bold: true, color: DARK2, margin: 0 });
  // left: per-block waterfall-ish
  s.addText("Per CSEB block (300×150×90 mm)", { x: 0.6, y: 1.6, w: 4.5, h: 0.35, fontFace: HFONT, fontSize: 14, bold: true, color: TERRA2, margin: 0 });
  const SC = 3.4 / 28; // scale: ₹28 -> 3.4"
  const econ = [
    ["Sells for", "₹28", TERRA, 28],
    ["Soil + 6% cement", "₹8.5", "B7AC9C", 8.5],
    ["Labour", "₹3.5", "B7AC9C", 3.5],
    ["Power + overhead", "₹3.0", "B7AC9C", 3.0],
    ["Gross profit", "₹13", GREEN, 13],
  ];
  econ.forEach((e, i) => {
    const y = 2.05 + i * 0.56;
    const bw = Math.max(e[3] * SC, 0.18);
    s.addText(e[0], { x: 0.6, y, w: 2.1, h: 0.46, fontFace: BFONT, fontSize: 12, color: DARK2, valign: "middle", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.75, y: y + 0.04, w: bw, h: 0.38, fill: { color: e[2] }, line: { type: "none" }, rectRadius: 0.04 });
    s.addText(e[1], { x: 2.75 + bw + 0.1, y: y + 0.04, w: 0.9, h: 0.38, fontFace: HFONT, fontSize: 12.5, bold: true, color: e[2] === "B7AC9C" ? "8A7E6E" : e[2], valign: "middle", margin: 0 });
  });
  // right: headline margin card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.95, w: 2.5, h: 1.5, fill: { color: DARK }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
  s.addText("~46%", { x: 7.0, y: 2.1, w: 2.5, h: 0.8, fontFace: HFONT, fontSize: 44, bold: true, color: GREEN, align: "center", margin: 0 });
  s.addText("gross margin per block", { x: 7.0, y: 2.95, w: 2.5, h: 0.4, fontFace: BFONT, fontSize: 12, color: SAND, align: "center", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 3.6, w: 2.5, h: 1.15, fill: { color: WHITE }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
  s.addText("Market price today", { x: 7.0, y: 3.72, w: 2.5, h: 0.3, fontFace: BFONT, fontSize: 11, color: MUTED, align: "center", margin: 0 });
  s.addText("₹30–50", { x: 7.0, y: 3.98, w: 2.5, h: 0.5, fontFace: HFONT, fontSize: 30, bold: true, color: TERRA, align: "center", margin: 0 });
  s.addText("per block — we enter below it", { x: 7.0, y: 4.45, w: 2.5, h: 0.3, fontFace: BFONT, fontSize: 9.5, italic: true, color: MUTED, align: "center", margin: 0 });
  s.addText("Sell the total cost, not the brick price: a CSEB wall cuts a builder's mortar, plastering and labour.", { x: 0.6, y: 4.95, w: 6.2, h: 0.4, fontFace: BFONT, fontSize: 11, italic: true, color: "55493D", margin: 0 });
  source(s, "Cost figures are founder estimates pending soil test & machine quotes. Market price: Brick&Bolt CSEB guide.");
  pageNo(s, 9);
  s.addNotes("Now this is my favourite slide — the economics. Because our main raw material is soil, which is practically free, the margin sits right inside the block. We sell at 28 rupees. Our total cost is around 15 rupees. That gives us a 46 per cent gross margin per block. And notice one very important thing — the market price today is 30 to 50 rupees. So we are entering below the market price and still making excellent margins. There is plenty of room. One last point I always make to builders — please do not look at the block price alone. Yes, our block costs a little more than a basic brick, but it cuts your mortar, your plastering, and your labour, and it builds much faster. It is a premium green product, and for the right project, that premium pays for itself.");

  // ===================================================================
  // SLIDE 10 — FINANCIALS (3-year)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Financial projection", 0.6, 0.5);
  s.addText("Break-even by Month 16, profitable from Year 2", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 25, bold: true, color: DARK2, margin: 0 });
  s.addChart(pres.charts.BAR, [
    { name: "Revenue (₹ lakh)", labels: ["Year 1", "Year 2", "Year 3"], values: [48, 147, 293] },
    { name: "Net profit (₹ lakh)", labels: ["Year 1", "Year 2", "Year 3"], values: [-4, 31, 75] },
  ], {
    x: 0.5, y: 1.7, w: 5.7, h: 3.35, barDir: "col", barGrouping: "clustered",
    chartColors: [TERRA, GREEN],
    chartArea: { fill: { color: "FFFFFF" } },
    catAxisLabelColor: "55493D", catAxisLabelFontSize: 12, catAxisLabelFontFace: BFONT,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: DARK2, dataLabelFontSize: 10, dataLabelFontBold: true,
    showLegend: true, legendPos: "b", legendColor: "55493D", legendFontSize: 10, showTitle: false, barGapWidthPct: 40,
  });
  // right: KPI stack
  const kpis = [
    ["₹12 lakh", "monthly revenue run-rate by Year 2", TERRA],
    ["~46%", "gross margin at steady state", GREEN],
    ["Month 16", "cash break-even", GOLD],
    ["~3 yrs", "payback on total investment", DARK],
  ];
  kpis.forEach((k, i) => {
    const y = 1.72 + i * 0.84;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.45, y, w: 3.05, h: 0.72, fill: { color: SANDLT }, line: { type: "none" }, rectRadius: 0.08 });
    s.addText(k[0], { x: 6.6, y, w: 1.35, h: 0.72, fontFace: HFONT, fontSize: 19, bold: true, color: k[2], valign: "middle", margin: 0 });
    s.addText(k[1], { x: 7.95, y, w: 1.45, h: 0.72, fontFace: BFONT, fontSize: 10, color: "55493D", valign: "middle", margin: 0 });
  });
  source(s, "Projections are founder estimates (conservative case), to be validated by soil test and supplier quotes. Year 1 includes ramp-up.");
  pageNo(s, 10);
  s.addNotes("These are our financial projections. And I want to be very honest with you — these are conservative estimates, and we will validate them once the soil test and machine quotes are done. So please take them in that spirit. In Year 1, we ramp up and take a small loss of about 6 lakh — this is fully expected for any manufacturing setup. In Year 2, we turn profitable — 38 lakh profit on 168 lakh revenue. By Year 3, 72 lakh profit. We reach cash break-even by Month 16, and the full payback on investment comes in about three and a half years. Steady, realistic, and not over-promised.");

  // ===================================================================
  // SLIDE 11 — THE ASK
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: DARK };
  kicker(s, "The ask", 0.6, 0.5, GOLD);
  s.addText([
    { text: "We are raising  ", options: { color: WHITE } },
    { text: "₹75 lakh", options: { color: TERRA, bold: true } },
    { text: "   (~£71,000)", options: { color: "BCAE9C" } },
  ], { x: 0.6, y: 0.85, w: 9, h: 0.7, fontFace: HFONT, fontSize: 32, bold: true, margin: 0 });
  // use of funds — horizontal bars
  const funds = [
    ["Machinery — 2 CEB presses", 32, "£30k", TERRA],
    ["Working capital (6 months)", 18, "£17k", GOLD],
    ["Factory construction", 12, "£11k", "C98B6E"],
    ["Land lease deposit", 10, "£9k", GREEN],
    ["Certification & trials", 3, "£3k", "8FA88C"],
  ];
  const maxF = 32, scale = 5.4 / maxF;
  funds.forEach((f, i) => {
    const y = 1.85 + i * 0.5;
    s.addText(f[0], { x: 0.6, y, w: 3.0, h: 0.4, fontFace: BFONT, fontSize: 11.5, color: SAND, valign: "middle", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.65, y: y + 0.03, w: Math.max(f[1] * scale, 0.5), h: 0.34, fill: { color: f[3] }, line: { type: "none" }, rectRadius: 0.04 });
    s.addText("₹" + f[1] + "L", { x: 3.75, y: y + 0.03, w: 1.0, h: 0.34, fontFace: HFONT, fontSize: 11, bold: true, color: WHITE, valign: "middle", margin: 0 });
  });
  // structure cards
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.45, w: 4.35, h: 0.85, fill: { color: "32281E" }, line: { type: "none" }, rectRadius: 0.08 });
  s.addText([
    { text: "For investors:  ", options: { bold: true, color: GOLD } },
    { text: "20% equity for ₹40–50 lakh", options: { color: SAND } },
  ], { x: 0.8, y: 4.45, w: 4.0, h: 0.85, fontFace: BFONT, fontSize: 12.5, valign: "middle", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.15, y: 4.45, w: 4.35, h: 0.85, fill: { color: "32281E" }, line: { type: "none" }, rectRadius: 0.08 });
  s.addText([
    { text: "Or debt:  ", options: { bold: true, color: GREEN } },
    { text: "₹35L MSME loan, plant as collateral", options: { color: SAND } },
  ], { x: 5.35, y: 4.45, w: 4.0, h: 0.85, fontFace: BFONT, fontSize: 12.5, valign: "middle", margin: 0 });
  s.addText("≈ at ₹106 / £", { x: 7.7, y: 1.25, w: 1.8, h: 0.3, fontFace: BFONT, fontSize: 9, italic: true, color: MUTED, align: "right", margin: 0 });
  pageNo(s, 11);
  s.addNotes("So, coming to the ask. We are raising 75 lakh rupees — that is roughly 71,000 pounds for our overseas friends. And I will show you exactly where every rupee goes. The biggest piece is machinery — 32 lakh for two presses. Then working capital for six months, factory construction, the land lease deposit, and certification. Nothing vague, everything accounted for. And we are flexible on the structure. For an equity investor, we are offering 20 per cent for 40 to 50 lakh. Or, if you prefer a smaller exposure, we can take a 35 lakh MSME loan against the plant and you come in lighter. Whatever suits you best, we can work it out.");

  // ===================================================================
  // SLIDE 12 — ROADMAP
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Roadmap", 0.6, 0.5);
  s.addText("From soil test to a second plant in 24 months", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 25, bold: true, color: DARK2, margin: 0 });
  const road = [
    ["Q1–Q2 '26", "Build", "Register · soil test · land · machine order", TERRA],
    ["Q3 '26", "First brick", "Trial run · BIS test · pilot buyers", GOLD],
    ["Q4 '26", "Launch", "Full sales · 10 builders · go digital", "C98B6E"],
    ["Q1–Q2 '27", "Break-even", "IGBC cert · first supply contract", GREEN],
    ["H2 '27", "Scale", "Plant #2 · ₹1.5 Cr run-rate", DARK],
  ];
  // horizontal timeline line
  s.addShape(pres.shapes.LINE, { x: 1.0, y: 2.55, w: 8.0, h: 0, line: { color: "DCD2C2", width: 2 } });
  road.forEach((r, i) => {
    const x = 0.85 + i * 1.83;
    s.addShape(pres.shapes.OVAL, { x: x + 0.62, y: 2.4, w: 0.3, h: 0.3, fill: { color: r[3] }, line: { color: WHITE, width: 2 } });
    // alternate above/below
    const above = i % 2 === 0;
    const cy = above ? 1.35 : 2.95;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: 1.6, h: 1.05, fill: { color: SANDLT }, line: { type: "none" }, rectRadius: 0.08, shadow: shadow() });
    s.addText(r[0], { x: x + 0.1, y: cy + 0.08, w: 1.4, h: 0.3, fontFace: BFONT, fontSize: 10, bold: true, color: r[3] === DARK ? TERRA2 : r[3], margin: 0 });
    s.addText(r[1], { x: x + 0.1, y: cy + 0.32, w: 1.4, h: 0.3, fontFace: HFONT, fontSize: 14, bold: true, color: DARK2, margin: 0 });
    s.addText(r[2], { x: x + 0.1, y: cy + 0.62, w: 1.42, h: 0.4, fontFace: BFONT, fontSize: 8.5, color: "55493D", margin: 0 });
  });
  pageNo(s, 12);
  s.addNotes("Here is our plan for the next 24 months, so you can see we have thought it through step by step. First half of 2026 — company registration, soil test, land, and machine order. By the third quarter, our first brick rolls out, along with BIS testing and the first pilot customers. Fourth quarter — full sales launch, and we go digital with Google and WhatsApp. By early 2027, we hit break-even and get our IGBC certification. And in the second half of 2027, we open our second plant in Kamareddy, which was the number two district in our model, taking us to a 1.5 crore run-rate. Clear milestones, clear timeline, no guesswork.");

  // ===================================================================
  // SLIDE 13 — WHY US / MOAT
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: SANDLT };
  kicker(s, "Why us", 0.6, 0.5);
  s.addText("We analysed 355 competitors before laying a single brick", { x: 0.6, y: 0.82, w: 8.9, h: 0.6, fontFace: HFONT, fontSize: 23, bold: true, color: DARK2, margin: 0 });
  const why = [
    ["trophy", "First mover", "The only CSEB producer in a 355-factory market — an 18-month head start.", TERRA],
    ["chart", "Data-driven", "Location chosen by a 7-factor scored model, not a hunch.", GREEN],
    ["cert", "Certification moat", "BIS + IGBC unlocks government & green-rated projects rivals can't bid for.", GOLD],
    ["flask", "Soil IP", "Proprietary mix ratios per site — a database that compounds with every batch.", TERRA2],
  ];
  why.forEach((w_, i) => {
    const x = 0.6 + (i % 2) * 4.55;
    const y = 1.75 + Math.floor(i / 2) * 1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.3, h: 1.35, fill: { color: WHITE }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow() });
    iconCircle(s, w_[0], x + 0.25, y + 0.3, 0.72, w_[3]);
    s.addText(w_[1], { x: x + 1.2, y: y + 0.2, w: 2.95, h: 0.4, fontFace: HFONT, fontSize: 17, bold: true, color: DARK2, margin: 0 });
    s.addText(w_[2], { x: x + 1.2, y: y + 0.6, w: 2.95, h: 0.7, fontFace: BFONT, fontSize: 11.5, color: "55493D", margin: 0 });
  });
  pageNo(s, 13);
  s.addNotes("So, why should you back us specifically? Four reasons. One — we are the first mover. The only CSEB producer in a market of 355 factories. Two — we are data-driven. You have seen our location model; we do not work on hunches. Three — we have a certification moat. BIS and IGBC will unlock government and green-rated projects that our rivals simply cannot bid for. And four — we are building soil IP. A database of mix ratios for every site, which gets better and more valuable with every single batch we produce. First mover, data, certification, and IP — that is a strong foundation.");

  // ===================================================================
  // SLIDE 14 — CLOSE
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: DARK };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.0 + c * 0.62 + (r % 2) * 0.31 - 0.3, y: 4.35 + r * 0.42, w: 0.54, h: 0.34,
      fill: { color: r === 1 && c === 2 ? TERRA : "2E251B" }, line: { color: "3A2D21", width: 0.5 } });
  }
  s.addText("Build the future of Telangana,", { x: 0.6, y: 1.5, w: 9, h: 0.6, fontFace: HFONT, fontSize: 32, bold: true, color: WHITE, margin: 0 });
  s.addText([
    { text: "one ", options: { color: WHITE } },
    { text: "earth block", options: { color: TERRA, bold: true } },
    { text: " at a time.", options: { color: WHITE } },
  ], { x: 0.6, y: 2.15, w: 9, h: 0.6, fontFace: HFONT, fontSize: 32, bold: true, margin: 0 });
  s.addText("An empty shelf, a documented demand, and a product the market has never been offered.", { x: 0.62, y: 2.95, w: 8.6, h: 0.5, fontFace: HFONT, fontSize: 15, italic: true, color: SAND, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.62, y: 3.7, w: 0.55, h: 0.06, fill: { color: TERRA }, line: { type: "none" } });
  s.addText([
    { text: "TerraBlock", options: { bold: true, color: WHITE } },
    { text: "   ·   Ranga Reddy, Telangana   ·   Let's talk.", options: { color: "BCAE9C" } },
  ], { x: 0.62, y: 3.9, w: 9, h: 0.4, fontFace: BFONT, fontSize: 14, margin: 0 });
  s.addNotes("Let me leave you with one simple picture. An empty shelf. A demand that is documented, not assumed. And a product that this market has never even been offered before. That combination does not come often. We would be truly delighted to have you build this with us, right from the ground floor. Thank you so much for your time and patience — and now I will be very happy to take all your questions. (Pause. Smile. Invite questions.)");

  await pres.writeFile({ fileName: "TerraBlock_Investor_Presentation.pptx" });
  console.log("done");
}
main().catch(e => { console.error(e); process.exit(1); });
