const sharp = require("sharp");
const fs = require("fs");

const BG="#221C15", CREAM="#F3EDE1", SAND="#B7A88F", TERRA="#C75D49",
      TERRA_DK="#9C4030", GREEN="#6FA86A", GOLD="#E0A94A", PANEL="#2C2419", LINE="#3A3022";
const F = "Helvetica Neue, Arial, sans-serif";

// interlocking CSEB brick icon: body + top tab + bottom notch + 2 holes
function ibrick(x,y,w,h,fill,stroke,hole){
  const tw=w*0.34, th=h*0.18;
  return `<rect x="${x+(w-tw)/2}" y="${y-th+2}" width="${tw}" height="${th+4}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
  <rect x="${x+(w-tw)/2}" y="${y+h-3}" width="${tw}" height="${th+3}" rx="3" fill="${BG}" stroke="${stroke}" stroke-width="2"/>
  <circle cx="${x+w*0.31}" cy="${y+h*0.52}" r="${h*0.17}" fill="${hole}"/>
  <circle cx="${x+w*0.69}" cy="${y+h*0.52}" r="${h*0.17}" fill="${hole}"/>`;
}

// emblem: brick inside a ring
function emblem(cx,cy,r){
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PANEL}" stroke="${TERRA}" stroke-width="3.5"/>
  ${ibrick(cx-23,cy-13,46,30,CREAM,TERRA,BG)}`;
}

// interlocking-brick motif beside the "0" — the gap we fill (one hot brick)
const motif =
  ibrick(905,560,138,56,PANEL,SAND,BG) +
  ibrick(890,623,138,56,TERRA,TERRA,"#7E3326") +
  ibrick(905,686,138,56,PANEL,SAND,BG);

// chips
function chip(x,big,small,accent){
  return `<rect x="${x}" y="990" width="300" height="92" rx="14" fill="${PANEL}" stroke="${LINE}" stroke-width="1.5"/>
  <circle cx="${x+40}" cy="1036" r="17" fill="${accent}"/>
  <text x="${x+70}" y="1030" font-family="${F}" font-size="23" font-weight="800" fill="${CREAM}">${big}</text>
  <text x="${x+70}" y="1060" font-family="${F}" font-size="16" font-weight="500" fill="${SAND}">${small}</text>`;
}

const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
<rect width="1080" height="1350" fill="${BG}"/>

${emblem(116,110,38)}
<text x="172" y="123" font-family="${F}" font-size="40" font-weight="800" letter-spacing="4" fill="${CREAM}">TERRABLOCK</text>

<rect x="700" y="84" width="300" height="48" rx="24" fill="none" stroke="${TERRA}" stroke-width="2.5"/>
<text x="850" y="114" font-family="${F}" font-size="18" font-weight="700" letter-spacing="2" fill="${TERRA}" text-anchor="middle">INVESTOR OPPORTUNITY</text>

<text x="80" y="212" font-family="${F}" font-size="30" font-weight="700" fill="${GOLD}">Telangana's First Mud Brick Industries</text>
<rect x="80" y="236" width="920" height="2" fill="${LINE}"/>

<text x="82" y="312" font-family="${F}" font-size="23" font-weight="700" letter-spacing="5" fill="${TERRA}">WE MAPPED EVERY BRICK FACTORY IN TELANGANA</text>

<text x="455" y="510" font-family="${F}" font-size="205" font-weight="900" fill="${CREAM}" text-anchor="end">355</text>
<text x="500" y="442" font-family="${F}" font-size="30" font-weight="800" letter-spacing="2" fill="${CREAM}">BRICK FACTORIES</text>
<text x="500" y="484" font-family="${F}" font-size="23" font-weight="500" fill="${SAND}">surveyed across 33 districts</text>

<text x="455" y="735" font-family="${F}" font-size="205" font-weight="900" fill="${TERRA}" text-anchor="end">0</text>
<text x="500" y="667" font-family="${F}" font-size="30" font-weight="800" letter-spacing="2" fill="${CREAM}">MAKE THIS BRICK</text>
<text x="500" y="709" font-family="${F}" font-size="23" font-weight="500" fill="${SAND}">machine-made mud interlocking</text>
${motif}

<rect x="80" y="810" width="920" height="2" fill="${LINE}"/>
<text x="80" y="878" font-family="${F}" font-size="34" font-weight="800" fill="${CREAM}">Telangana imports them from 3 states.</text>
<text x="80" y="926" font-family="${F}" font-size="34" font-weight="800" fill="${GOLD}">We will make them here.</text>

${chip(80,"Low carbon","13× less vs clay",GREEN)}
${chip(390,"Cooler","homes, less AC",TERRA)}
${chip(700,"Faster","walls in days",GOLD)}

<rect x="80" y="1128" width="920" height="150" rx="18" fill="${TERRA}"/>
<text x="120" y="1198" font-family="${F}" font-size="46" font-weight="900" fill="${CREAM}">Raising ₹75 lakh</text>
<text x="122" y="1240" font-family="${F}" font-size="25" font-weight="500" fill="#F6E4DE">Seeking investors &amp; partners who build for the planet.</text>
${ibrick(928,1168,70,40,"#E89A86","#F6E4DE",TERRA)}

<text x="80" y="1330" font-family="${F}" font-size="22" font-weight="600" fill="${SAND}">Srikanth Kunta  ·  Ranga Reddy, Telangana  ·  The future of building is grown, not burned.</text>
</svg>`;

fs.writeFileSync("assets/terrablock_poster.svg", svg);
sharp(Buffer.from(svg)).png().toFile("assets/terrablock_poster.png")
  .then(()=>console.log("PNG written"))
  .catch(e=>{console.error(e);process.exit(1);});
