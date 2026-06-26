const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");

// ---------- palette (earth / terracotta brand) ----------
const DARK="262019", DARK2="33291F", TERRA="B85042", TERRA2="8F3D31";
const SAND="EDE7D9", SANDLT="F6F2EA", GREEN="5C8A5A", GREEN2="47704A";
const MUTED="7A6E60", WHITE="FFFFFF", GOLD="D8A24A", CONS="B0473A", BODY="55493D";
const HFONT="Cambria", BFONT="Calibri";

function svg(IC,color,size=256){return ReactDOMServer.renderToStaticMarkup(React.createElement(IC,{color,size:String(size)}));}
async function png(IC,color,size=256){const b=await sharp(Buffer.from(svg(IC,color,size))).png().toBuffer();return "image/png;base64,"+b.toString("base64");}

async function main(){
  const need={
    coins:[FA.FaCoins,WHITE], bolt:[FA.FaBolt,WHITE], roller:[FA.FaPaintRoller,WHITE],
    thermo:[FA.FaThermometerHalf,WHITE], leaf:[FA.FaLeaf,WHITE], shield:[FA.FaShieldAlt,WHITE],
    tint:[FA.FaTint,WHITE], ruler:[FA.FaRulerVertical,WHITE], seed:[FA.FaSeedling,WHITE],
    eye:[FA.FaEye,WHITE], cert:[FA.FaCertificate,WHITE], cubes:[FA.FaCubes,WHITE],
    clock:[FA.FaRegClock,WHITE], scale:[FA.FaBalanceScale,WHITE], warn:[FA.FaExclamationTriangle,WHITE],
    check:[FA.FaCheck,WHITE], times:[FA.FaTimes,WHITE], house:[FA.FaHome,WHITE], recycle:[FA.FaRecycle,WHITE],
    checkg:[FA.FaCheckCircle,GREEN], timesr:[FA.FaTimesCircle,CONS], sun:[FA.FaSun,WHITE],
  };
  const I={}; for(const k in need) I[k]=await png(need[k][0],need[k][1],256);

  const pres=new pptxgen(); pres.layout="LAYOUT_16x9"; pres.author="TerraBlock";
  pres.title="Mud Interlocking Brick — The Honest Comparison";
  const W=10,H=5.625;
  const shadow=()=>({type:"outer",color:"000000",blur:7,offset:3,angle:90,opacity:0.16});

  function iconCircle(s,k,x,y,d,c){s.addShape(pres.shapes.OVAL,{x,y,w:d,h:d,fill:{color:c},line:{type:"none"}});const p=d*0.27;s.addImage({data:I[k],x:x+p,y:y+p,w:d-2*p,h:d-2*p});}
  function kicker(s,t,x,y,c=TERRA){s.addText(t.toUpperCase(),{x,y,w:9,h:0.3,fontFace:BFONT,fontSize:12,bold:true,color:c,charSpacing:3,margin:0});}
  function src(s,t){s.addText(t,{x:0.5,y:H-0.34,w:W-1,h:0.26,fontFace:BFONT,fontSize:8,italic:true,color:MUTED,align:"left",margin:0});}
  function pageNo(s,n){s.addText(String(n).padStart(2,"0"),{x:W-0.85,y:H-0.4,w:0.5,h:0.3,fontFace:BFONT,fontSize:10,color:MUTED,align:"right",margin:0});}

  // ============ SLIDE 1 — TITLE ============
  let s=pres.addSlide(); s.background={color:DARK};
  for(let r=0;r<4;r++)for(let c=0;c<6;c++)s.addShape(pres.shapes.RECTANGLE,{x:6.55+c*0.62+(r%2)*0.31,y:3.75+r*0.42,w:0.54,h:0.34,fill:{color:r===1&&c===2?GREEN:"32281E"},line:{color:"3D3024",width:0.5}});
  s.addText("Mud Interlocking Brick",{x:0.6,y:1.4,w:8.6,h:0.8,fontFace:HFONT,fontSize:42,bold:true,color:WHITE,margin:0});
  s.addShape(pres.shapes.RECTANGLE,{x:0.62,y:2.28,w:0.55,h:0.07,fill:{color:GREEN},line:{type:"none"}});
  s.addText("The honest comparison — pros, cons & real cost savings",{x:0.6,y:2.45,w:8.6,h:0.5,fontFace:HFONT,fontSize:21,italic:true,color:SAND,margin:0});
  s.addText([{text:"Compressed Stabilised Earth Block (CSEB)",options:{color:GOLD,bold:true}},{text:"   ·   evidence-based   ·   sources cited",options:{color:"BCAE9C"}}],{x:0.62,y:3.15,w:9,h:0.4,fontFace:BFONT,fontSize:14,margin:0});
  s.addText("TERRABLOCK  ·  TELANGANA",{x:0.62,y:4.85,w:6,h:0.3,fontFace:BFONT,fontSize:12,bold:true,color:GREEN,charSpacing:3,margin:0});

  // ============ SLIDE 2 — BIG PICTURE ============
  s=pres.addSlide(); s.background={color:WHITE};
  kicker(s,"The big picture",0.6,0.5);
  s.addText("Should you build with mud interlocking brick?",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:28,bold:true,color:DARK2,margin:0});
  s.addText("The honest answer: yes — for the right building, in the right climate. Here is the evidence.",{x:0.6,y:1.45,w:8.9,h:0.4,fontFace:BFONT,fontSize:13,italic:true,color:BODY,margin:0});
  const big=[["15–35%","lower wall cost vs conventional brick",GREEN],["−80%","laying labour (no mortar, dry-stack)",TERRA],["11–13×","less energy & CO₂ than fired clay",GREEN2]];
  big.forEach((g,i)=>{const x=0.6+i*3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:2.05,w:2.75,h:2.3,fill:{color:i===1?DARK:SANDLT},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
    s.addText(g[0],{x,y:2.3,w:2.75,h:0.95,fontFace:HFONT,fontSize:42,bold:true,color:g[2],align:"center",margin:0});
    s.addText(g[1],{x:x+0.2,y:3.35,w:2.35,h:0.85,fontFace:BFONT,fontSize:13,color:i===1?SAND:BODY,align:"center",margin:0});});
  s.addText([{text:"But it is not magic. ",options:{bold:true,color:CONS}},{text:"It has real limits — water, height, curing time. We cover those too.",options:{color:DARK2}}],{x:0.6,y:4.6,w:8.9,h:0.4,fontFace:HFONT,fontSize:15,italic:true,margin:0});
  src(s,"Sources: Auroville Earth Institute; Brick&Bolt; IIT Kanpur NICEE; CivilTutorials. Full citations on final slide.");
  pageNo(s,2);

  // ============ SLIDE 3 — WHAT IT IS ============
  s=pres.addSlide(); s.background={color:SANDLT};
  kicker(s,"What it is",0.6,0.5);
  s.addText("Soil, a little cement, and a clever shape",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:26,bold:true,color:DARK2,margin:0});
  const steps=[["seed","Local soil + 5–8% cement","Sieved soil mixed with a little cement and water — no firing, no kiln."],["bolt","Pressed, not burnt","Compressed in a hydraulic press, then cured for ~28 days to full strength."],["cubes","Interlocking shape","Tongue-and-groove edges lock together — stacked dry, with little or no mortar."]];
  steps.forEach((p,i)=>{const x=0.6+i*3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:1.8,w:2.75,h:2.85,fill:{color:WHITE},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
    iconCircle(s,p[0],x+0.28,2.05,0.66,i===1?TERRA:GREEN);
    s.addText(p[1],{x:x+0.25,y:2.85,w:2.3,h:0.6,fontFace:HFONT,fontSize:15,bold:true,color:DARK2,margin:0});
    s.addText(p[2],{x:x+0.25,y:3.5,w:2.3,h:1.0,fontFace:BFONT,fontSize:12,color:BODY,margin:0});});
  src(s,"Source: Auroville Earth Institute (earth-auroville.com); IIT Kanpur NICEE. Governed in India by BIS IS 1725.");
  pageNo(s,3);

  // ============ SLIDE 4 — PROS GRID ============
  s=pres.addSlide(); s.background={color:WHITE};
  kicker(s,"The pros",0.6,0.5,GREEN);
  s.addText("Six real advantages",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:28,bold:true,color:DARK2,margin:0});
  const pros=[["coins","Cheaper walls","15–35% lower wall cost than fired brick"],["bolt","Faster build","Mortarless stacking cuts laying time 20–30%"],["roller","No plaster, no paint","Smooth exposed faces — skip plaster & paint"],["thermo","Cooler inside","Earth walls stay cooler — ideal for hot Telangana"],["leaf","Low carbon","11–13× less energy & CO₂ than fired clay"],["shield","Quake-friendly","Reinforced interlocking walls flex, don't shatter"]];
  pros.forEach((p,i)=>{const x=0.6+(i%3)*3.0,y=1.75+Math.floor(i/3)*1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w:2.75,h:1.4,fill:{color:SANDLT},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
    iconCircle(s,p[0],x+0.22,y+0.24,0.6,GREEN);
    s.addText(p[1],{x:x+0.95,y:y+0.22,w:1.7,h:0.4,fontFace:HFONT,fontSize:14,bold:true,color:DARK2,margin:0});
    s.addText(p[2],{x:x+0.95,y:y+0.62,w:1.72,h:0.7,fontFace:BFONT,fontSize:10.5,color:BODY,margin:0});});
  src(s,"Sources: Brick&Bolt; CivilTutorials; Auroville Earth Institute; IIT Kanpur NICEE (seismic).");
  pageNo(s,4);

  // ============ SLIDE 5 — THE MONEY SLIDE ============
  s=pres.addSlide(); s.background={color:DARK};
  kicker(s,"Cost savings",0.6,0.5,GOLD);
  s.addText("Where the money is saved",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:28,bold:true,color:WHITE,margin:0});
  const save=[["No external plaster","25–35%","of wall cost — exposed finish",4.6],["Little/no mortar","20%","saved on mortar & plaster materials",3.6],["Dry-stack labour","up to 80%","less laying labour",4.0],["Build time","20–30%","faster construction",3.2]];
  save.forEach((r,i)=>{const y=1.75+i*0.72;
    s.addText(r[0],{x:0.6,y,w:2.7,h:0.62,fontFace:BFONT,fontSize:12.5,color:SAND,valign:"middle",margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:3.4,y:y+0.06,w:r[3],h:0.5,fill:{color:i%2?GREEN:TERRA},line:{type:"none"},rectRadius:0.05});
    s.addText([{text:r[1]+"  ",options:{bold:true,color:WHITE,fontSize:15}},{text:r[2],options:{color:"F3E7E2",fontSize:10.5}}],{x:3.55,y:y+0.06,w:r[3]+1.6,h:0.5,fontFace:HFONT,valign:"middle",margin:0});});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.75,w:8.8,h:0.5,fill:{color:"32281E"},line:{type:"none"},rectRadius:0.06});
  s.addText([{text:"Net result:  ",options:{bold:true,color:GOLD}},{text:"a finished CSEB wall runs 15–20% cheaper than fired brick (up to ~40% in some studies).",options:{color:SAND}}],{x:0.8,y:4.75,w:8.5,h:0.5,fontFace:BFONT,fontSize:12,valign:"middle",margin:0});
  src(s,"Sources: Brick&Bolt (plaster −25–35%); CivilTutorials (mortar −20%, time −20–30%); IIT Kanpur (labour −80%); Auroville/Happho (15–40% cheaper).");
  pageNo(s,5);

  // ============ SLIDE 6 — REALITY CHECK: 1 WEEK ============
  s=pres.addSlide(); s.background={color:WHITE};
  kicker(s,"Reality check",0.6,0.5,GOLD);
  s.addText("“Can we build a house in 1 week?”",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:27,bold:true,color:DARK2,margin:0});
  // myth box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.75,w:4.3,h:2.95,fill:{color:SANDLT},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
  iconCircle(s,"times",0.9,2.0,0.55,CONS);
  s.addText("The myth",{x:1.6,y:2.05,w:3.0,h:0.45,fontFace:HFONT,fontSize:17,bold:true,color:CONS,margin:0});
  s.addText("“Just stack the blocks — a whole house goes up in 7 days, start to finish.”",{x:0.9,y:2.75,w:3.7,h:0.9,fontFace:BFONT,fontSize:13,italic:true,color:BODY,margin:0});
  s.addText("Not the whole house. Foundation, roof, plumbing and wiring still take their normal time.",{x:0.9,y:3.7,w:3.7,h:0.9,fontFace:BFONT,fontSize:12,color:DARK2,margin:0});
  // fact box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:5.1,y:1.75,w:4.3,h:2.95,fill:{color:DARK},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
  iconCircle(s,"check",5.4,2.0,0.55,GREEN);
  s.addText("The fact",{x:6.1,y:2.05,w:3.0,h:0.45,fontFace:HFONT,fontSize:17,bold:true,color:GREEN,margin:0});
  s.addText([
    {text:"Walls go up in days. ",options:{bold:true,color:WHITE,breakLine:true}},
    {text:"Mortarless stacking cuts laying labour ~80% and time 20–30%.",options:{color:SAND,breakLine:true}},
    {text:"BUT the blocks must cure ~28 days first",options:{bold:true,color:GOLD,breakLine:true}},
    {text:" — done at the factory, so pre-cured blocks let the site shell finish in about a week.",options:{color:SAND}},
  ],{x:5.4,y:2.7,w:3.7,h:1.9,fontFace:BFONT,fontSize:12,margin:0});
  src(s,"Sources: IIT Kanpur NICEE (labour −80%); CivilTutorials (time −20–30%); Auroville Earth Institute (28-day curing).");
  pageNo(s,6);

  // ============ SLIDE 7 — REALITY CHECK: NO PLASTER/PAINT ============
  s=pres.addSlide(); s.background={color:WHITE};
  kicker(s,"Reality check",0.6,0.5,GOLD);
  s.addText("“No plastering and no painting?”",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:27,bold:true,color:DARK2,margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.75,w:4.3,h:2.95,fill:{color:"EEF4EE"},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
  iconCircle(s,"check",0.9,2.0,0.55,GREEN);
  s.addText("Mostly TRUE",{x:1.6,y:2.05,w:3.0,h:0.45,fontFace:HFONT,fontSize:17,bold:true,color:GREEN2,margin:0});
  s.addText([
    {text:"Plaster is optional, inside and out. ",options:{bold:true,color:DARK2,breakLine:true}},
    {text:"Smooth faces = exposed-brick look (a design trend). Saves 25–35% of wall cost. No mortar means no plaster base — and the natural earth tone needs no paint.",options:{color:BODY}},
  ],{x:0.9,y:2.7,w:3.7,h:1.9,fontFace:BFONT,fontSize:12,margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:5.1,y:1.75,w:4.3,h:2.95,fill:{color:SANDLT},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
  iconCircle(s,"warn",5.4,2.0,0.55,GOLD);
  s.addText("The caveats",{x:6.1,y:2.05,w:3.0,h:0.45,fontFace:HFONT,fontSize:17,bold:true,color:TERRA2,margin:0});
  s.addText([
    {text:"Fill the joints",options:{bold:true,color:DARK2}},{text:" — gaps invite ants/insects.",options:{color:BODY,breakLine:true}},
    {text:"Seal exposed faces",options:{bold:true,color:DARK2}},{text:" in heavy rain — earth blocks lose 40–60% strength when soaked.",options:{color:BODY,breakLine:true}},
    {text:"Good news: ",options:{bold:true,color:GREEN2}},{text:"semi-arid Telangana is a strong fit for exposed finish.",options:{color:BODY}},
  ],{x:5.4,y:2.7,w:3.7,h:1.9,fontFace:BFONT,fontSize:11.5,margin:0});
  src(s,"Sources: Brick&Bolt (plaster optional, −25–35%, rain caveat); NCBI/PMC (saturated strength loss 42–62%).");
  pageNo(s,7);

  // ============ SLIDE 8 — ECO EDGE ============
  s=pres.addSlide(); s.background={color:GREEN2};
  kicker(s,"The green edge",0.6,0.5,"DCEAD6");
  s.addText("The lowest-carbon brick you can buy",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:27,bold:true,color:WHITE,margin:0});
  const eco=[["bolt","11×","less energy to make than a fired-clay brick"],["leaf","13×","less CO₂ pollution than a fired-clay brick"],["recycle","~95%","local soil — barely any transport or mining"]];
  eco.forEach((g,i)=>{const x=0.6+i*3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:1.9,w:2.75,h:2.6,fill:{color:"3C6140"},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
    iconCircle(s,g[0],x+1.02,2.15,0.7,GOLD);
    s.addText(g[1],{x,y:2.95,w:2.75,h:0.7,fontFace:HFONT,fontSize:38,bold:true,color:WHITE,align:"center",margin:0});
    s.addText(g[2],{x:x+0.2,y:3.7,w:2.35,h:0.7,fontFace:BFONT,fontSize:12,color:"DCEAD6",align:"center",margin:0});});
  s.addText("No kiln means no coal, no fired-brick smoke — the single biggest pollution source in Indian brick-making.",{x:0.6,y:4.75,w:8.9,h:0.4,fontFace:BFONT,fontSize:12,italic:true,color:"DCEAD6",margin:0});
  src(s,"Sources: Auroville Earth Institute (11× energy, 13× CO₂); IIT Kanpur NICEE (1/5–1/15 manufacturing energy).");
  pageNo(s,8);

  // ============ SLIDE 9 — CONS ============
  s=pres.addSlide(); s.background={color:WHITE};
  kicker(s,"The cons",0.6,0.5,CONS);
  s.addText("The honest limitations",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:28,bold:true,color:DARK2,margin:0});
  const cons=[["tint","Weak when wet","Loses 40–60% strength soaked — needs sealing & good roof overhangs"],["ruler","Low-rise only","Lower strength than concrete block — best for G+1 / G+2 homes"],["clock","28-day cure","Blocks must cure ~4 weeks before use — plan factory stock ahead"],["seed","Soil-dependent","Needs the right soil; cement % (5–10%) tuned to each soil"],["eye","Perception","“Mud = poor” stigma — needs education & show-homes to sell"],["cert","Quality control","Strength varies with press & curing discipline — BIS IS 1725 testing a must"]];
  cons.forEach((p,i)=>{const x=0.6+(i%3)*3.0,y=1.75+Math.floor(i/3)*1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w:2.75,h:1.4,fill:{color:SANDLT},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
    iconCircle(s,p[0],x+0.22,y+0.24,0.6,CONS);
    s.addText(p[1],{x:x+0.95,y:y+0.2,w:1.7,h:0.4,fontFace:HFONT,fontSize:13.5,bold:true,color:DARK2,margin:0});
    s.addText(p[2],{x:x+0.95,y:y+0.58,w:1.72,h:0.78,fontFace:BFONT,fontSize:9.8,color:BODY,margin:0});});
  src(s,"Sources: NCBI/PMC (saturated strength); IIT Kanpur (strength vs concrete); Auroville & block-machine.net (28-day cure); ScienceDirect (soil/cement).");
  pageNo(s,9);

  // ============ SLIDE 10 — HEAD TO HEAD TABLE ============
  s=pres.addSlide(); s.background={color:SANDLT};
  kicker(s,"Head to head",0.6,0.5);
  s.addText("Mud interlocking vs the alternatives",{x:0.6,y:0.82,w:8.9,h:0.55,fontFace:HFONT,fontSize:25,bold:true,color:DARK2,margin:0});
  const hd=(t,c)=>({text:t,options:{fill:{color:c},color:WHITE,bold:true,fontSize:11.5,align:"center",valign:"middle"}});
  const cMud=t=>({text:t,options:{fill:{color:"EEF4EE"},color:GREEN2,fontSize:10.5,align:"center",valign:"middle",bold:true}});
  const cell=(t,b)=>({text:t,options:{fill:{color:WHITE},color:b?DARK2:MUTED,fontSize:10.5,align:"center",valign:"middle",bold:!!b}});
  const lab=t=>({text:t,options:{fill:{color:"E7DECE"},color:DARK2,bold:true,fontSize:10.5,valign:"middle"}});
  const rows=[
    [{text:"",options:{fill:{color:SANDLT}}},hd("Mud Interlocking",GREEN),hd("Fired Clay",TERRA2),hd("Fly Ash",MUTED)],
    [lab("Price / unit"),cMud("₹25–52 / block"),cell("₹8–12 / brick"),cell("₹5–8 / brick")],
    [lab("Mortar"),cMud("Little / none"),cell("Required"),cell("Required")],
    [lab("Plaster + paint"),cMud("Optional (skip it)"),cell("Required"),cell("Required")],
    [lab("Laying speed"),cMud("Fast — dry stack"),cell("Slow"),cell("Slow")],
    [lab("Strength (MPa)"),cMud("3–7.8"),cell("3–10"),cell("3–10")],
    [lab("Energy / CO₂"),cMud("Very low"),cell("High (kiln)"),cell("Medium")],
    [lab("Water resistance"),cMud("Needs sealing"),cell("Good"),cell("Good")],
    [lab("Best for"),cMud("Low-rise, dry, green"),cell("All-round"),cell("Bulk / cheap")],
  ];
  s.addTable(rows,{x:0.6,y:1.5,w:8.8,colW:[1.7,2.55,2.275,2.275],rowH:0.33,border:{type:"solid",pt:1,color:"DCD2C2"},margin:2});
  src(s,"Sources: CivilTutorials & IndiaMart (price); IIT Kanpur & block-machine.net (strength); Auroville (energy); Brick&Bolt (finish).");
  pageNo(s,10);

  // ============ SLIDE 11 — VERDICT ============
  s=pres.addSlide(); s.background={color:WHITE};
  kicker(s,"The verdict",0.6,0.5);
  s.addText("When to use it — and when not to",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:27,bold:true,color:DARK2,margin:0});
  // YES card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.75,w:4.3,h:3.0,fill:{color:"EEF4EE"},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
  iconCircle(s,"check",0.9,2.0,0.55,GREEN);
  s.addText("Use it for",{x:1.6,y:2.05,w:3.0,h:0.45,fontFace:HFONT,fontSize:18,bold:true,color:GREEN2,margin:0});
  s.addText(["Low-rise homes (G+1, G+2)","Hot, dry climates — like Telangana","Exposed / natural-finish design","Green-rated & cost-led projects","Sites with good local soil"].map(t=>({text:t,options:{bullet:{indent:13},breakLine:true,paraSpaceAfter:7}})),{x:0.95,y:2.7,w:3.7,h:1.95,fontFace:BFONT,fontSize:12.5,color:DARK2,margin:0});
  // NO card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:5.1,y:1.75,w:4.3,h:3.0,fill:{color:SANDLT},line:{type:"none"},rectRadius:0.1,shadow:shadow()});
  iconCircle(s,"times",5.4,2.0,0.55,CONS);
  s.addText("Think twice for",{x:6.1,y:2.05,w:3.0,h:0.45,fontFace:HFONT,fontSize:18,bold:true,color:CONS,margin:0});
  s.addText(["High-rise / heavy load buildings","Flood-prone or very wet regions","Unprotected walls with no roof overhang","Sites with poor or sandy-only soil","Buyers who reject the look"].map(t=>({text:t,options:{bullet:{indent:13},breakLine:true,paraSpaceAfter:7}})),{x:5.45,y:2.7,w:3.7,h:1.95,fontFace:BFONT,fontSize:12.5,color:DARK2,margin:0});
  src(s,"Telangana is semi-arid and low-rise-dominated — a strong natural fit for mud interlocking brick.");
  pageNo(s,11);

  // ============ SLIDE 12 — SOURCES ============
  s=pres.addSlide(); s.background={color:DARK};
  kicker(s,"Sources",0.6,0.5,GOLD);
  s.addText("Every claim, traceable",{x:0.6,y:0.82,w:8.9,h:0.6,fontFace:HFONT,fontSize:26,bold:true,color:WHITE,margin:0});
  const srcs=[
    ["Auroville Earth Institute","Cost 15–20% lower; 11× energy, 13× CO₂; 28-day curing","earth-auroville.com"],
    ["IIT Kanpur — NICEE (WCEE 2012)","Labour −80%; strength 7.76 MPa; 1/5–1/15 energy; seismic","iitk.ac.in/nicee"],
    ["Brick&Bolt","Plaster optional, wall −25–35%; exposed finish; rain caveat","bricknbolt.com"],
    ["CivilTutorials","Price ₹25–40/block; time −20–30%; mortar/plaster −20%","civiltutorials.com"],
    ["NCBI / PMC","Saturated strength loss 42–62%; 10% cement → 5.92 MPa","ncbi.nlm.nih.gov"],
    ["Happho / Frontiers","Up to ~40% cheaper; 13% cheaper than RCC+brick apartment","happho.com"],
    ["IndiaMart (market price)","CSEB 300×150×90 mm ₹30/unit; interlocking ₹52/piece","indiamart.com"],
    ["BIS IS 1725","Indian standard for stabilised soil blocks","bis.gov.in"],
  ];
  srcs.forEach((r,i)=>{const x=0.6+(i%2)*4.5,y=1.65+Math.floor(i/2)*0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w:4.3,h:0.72,fill:{color:"32281E"},line:{type:"none"},rectRadius:0.06});
    s.addText([{text:r[0]+"  ",options:{bold:true,color:GOLD,fontSize:10.5}},{text:"— "+r[2],options:{italic:true,color:"9C8E7C",fontSize:8.5}}],{x:x+0.18,y:y+0.06,w:4.0,h:0.3,fontFace:BFONT,margin:0,valign:"middle"});
    s.addText(r[1],{x:x+0.18,y:y+0.36,w:4.0,h:0.32,fontFace:BFONT,fontSize:9,color:SAND,margin:0,valign:"middle"});});
  s.addText("Research compiled June 2026 · figures are indicative ranges from public sources, not adversarially verified.",{x:0.6,y:H-0.34,w:9,h:0.26,fontFace:BFONT,fontSize:8,italic:true,color:MUTED,margin:0});

  await pres.writeFile({fileName:"Mud_Interlocking_Comparison.pptx"});
  console.log("done");
}
main().catch(e=>{console.error(e);process.exit(1);});
