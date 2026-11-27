/* Young Grizzlys – App-Code (ab 1.39.0 eigene Datei) */

/* Fallback, falls das Firebase-Modul nicht lädt (Vorschau, offline): Spielplan bleibt nutzbar, nur ohne Ergebnisse */
window.resultFor=window.resultFor||function(){return null};window.resultBadge=window.resultBadge||function(){return ""};
const ALL_GAMES=window.SPIELPLAN||[]; /* 1.39.0: Spielplan steht in spielplan.js */
/* 1.70.0: Helferdienste – Daten früh anlegen, weil die Spielkarten schon beim Start danach fragen */
var HP_DEFAULT=[
  {id:"bericht",s:"g",t:"Spielbericht",n:1},{id:"zeit",s:"g",t:"Zeitnehmer",n:1},{id:"sbh",s:"g",t:"Strafbank Heim",n:1},{id:"sbg",s:"g",t:"Strafbank Gast",n:1},
  {id:"tore",s:"g",t:"Aufbau der Tore",d:"vor dem Spiel, in den Drittelpausen und nach dem Spiel",n:2},{id:"fenster",s:"g",t:"Fensterputzer",d:"bei Bedarf",n:1},
  {id:"schiri",s:"g",t:"Verpflegung Schiedsrichter",d:"Kaffee + Zubehör, Mineralwasser",n:1},{id:"mokipa",s:"g",t:"Verpflegung MoKiPa",n:1},{id:"musik",s:"g",t:"Musik / Stadionsprecher",n:1},
  {id:"platten",s:"v",t:"Obst- und Gemüseplatten vorbereiten",n:2},{id:"belegt",s:"v",t:"Belegte Brötchen vorbereiten",n:4},{id:"riegel",s:"v",t:"3er-Pack Müsliriegel",n:2},
  {id:"wasser",s:"v",t:"6 Flaschen Mineralwasser still (1,5 l)",n:2},{id:"obst",s:"v",t:"Obst",d:"z. B. 6 Bananen, 4 Äpfel",n:1},{id:"trauben",s:"v",t:"2 Pack Weintrauben",n:1},
  {id:"broetchen",s:"v",t:"20 Brötchen",n:1},{id:"belag",s:"v",t:"Käse, Mortadella und Salami",d:"für je 10 Brötchen",n:1},{id:"eier",s:"v",t:"10 gekochte Eier",n:1},
  {id:"deko",s:"v",t:"Dekoration für Brötchen",d:"Gurke, Paprika, Tomaten und Brezel",n:1},{id:"serv",s:"v",t:"Servietten, Messer und Platten",d:"für den Brötchenverkauf",n:1}];
var HP_SECT={g:"Für das Spiel",v:"Verpflegung"};
var HP_DAYS=5;
var HP_CFG={template:null,games:null}, HP_ENTRIES={}, HP_LOADED=false;
/* 1.35.0: Nutzer-Ansichten zeigen nur „Meine Mannschaften“; Admin-Bereiche arbeiten mit ALL_GAMES */
const games=ALL_GAMES.filter(g=>window.myTeam(g.team));
const logoUrls={"Dinslakener Kobras": "https://www.google.com/s2/favicons?domain=dinslakener-kobras.de&sz=128", "ESC Darmstadt": "https://ehv-nrw.de/media/_versions/club/darmstadt-dukes_medium.png", "ESC Rheine Young Cats": "https://ehv-nrw.de/media/uploads/club/yc-rheine.png", "EHC Gelsenkirchen": "https://www.google.com/s2/favicons?domain=ehc-gelsenkirchen.de&sz=128", "Herner EV": "https://www.google.com/s2/favicons?domain=herner-ev.de&sz=128", "Neusser EV": "https://www.google.com/s2/favicons?domain=neusser-ev.de&sz=128", "GSC Moers": "https://www.rodi-db.de/img/db/img1091.png", "TSVE Bielefeld": "https://www.google.com/s2/favicons?domain=tsve.de&sz=128", "EHC Neuwied": "https://www.google.com/s2/favicons?domain=ehc-neuwied.de&sz=128", "Eisadler Dortmund": "https://www.eishockey.net/admin/files/pictures/30586/30586_37577_1024_ead-logo-1024.png", "TuS Wiehl": "https://ehv-nrw.de/media/uploads/club/tus-wiehl.png", "EC Bergisch Land": "https://ehv-nrw.de/media/uploads/club/ec-bergisch-land.png", "EV Duisburg": "https://www.google.com/s2/favicons?domain=fuechse-duisburg.de&sz=128", "Ratinger Ice Aliens": "https://www.google.com/s2/favicons?domain=icealiens97.de&sz=128", "Lippe Hockey Hamm": "https://ehv-nrw.de/media/uploads/club/lh-hamm.png", "Herforder EV": "https://www.google.com/s2/favicons?domain=herforder-ev.de&sz=128", "Grefrather EC": "https://www.google.com/s2/favicons?domain=grefrather-eg.de&sz=128", "Aachener EC": "https://www.google.com/s2/favicons?domain=aachener-ec.de&sz=128", "Soester EG": "https://www.google.com/s2/favicons?domain=soester-eg.de&sz=128", "EHC Essen Ruhr": "https://ehc-essen.de/images/ehc/EHC_Logo.webp"};
const grizzlysLogo="logo.png";
/* Gegner-Logos liegen als Dateien im Ordner "logos/" der App. logoUrls (oben) ist nur noch die Reserve,
   falls eine Datei im Ordner fehlt. */
window.resultsLoading=true; setTimeout(()=>{if(window.resultsLoading){window.resultsLoading=false;window.applyResults&&window.applyResults()}},8000); /* 1.40.0: Platzhalter, solange die Ergebnisse laden */
const LOGO_FILES={"Dinslakener Kobras":"dinslakener-kobras.png","ESC Darmstadt":"esc-darmstadt.png","ESC Rheine Young Cats":"esc-rheine-young-cats.png","EHC Gelsenkirchen":"ehc-gelsenkirchen.png","Herner EV":"herner-ev.png","Neusser EV":"neusser-ev.png","GSC Moers":"gsc-moers.png","TSVE Bielefeld":"tsve-bielefeld.png","EHC Neuwied":"ehc-neuwied.png","Eisadler Dortmund":"eisadler-dortmund.png","TuS Wiehl":"tus-wiehl.png","EC Bergisch Land":"ec-bergisch-land.png","EV Duisburg":"ev-duisburg.png","Ratinger Ice Aliens":"ratinger-ice-aliens.png","Lippe Hockey Hamm":"lippe-hockey-hamm.png","Herforder EV":"herforder-ev.png","Grefrather EC":"grefrather-ec.png","Aachener EC":"aachener-ec.png","Soester EG":"soester-eg.png","EHC Essen Ruhr":"ehc-essen-ruhr.webp","EHC Troisdorf":"ehc-troisdorf.png"};
function logoImgHtml(k,cls){
  const local=LOGO_FILES[k]?"logos/"+LOGO_FILES[k]:"", ext=logoUrls[k]||"";
  return `<img class="${cls}" src="${esc(local||ext)}" alt="${esc(k)}" loading="lazy"${local&&ext?` data-ext="${esc(ext)}"`:""} onerror="if(this.dataset.ext){this.src=this.dataset.ext;delete this.dataset.ext}else{window.logoFallback(this)}">`;
}
/* 1.40.0: fehlt ein Logo, erscheint ein Kürzel-Wappen (Farbe aus dem Namen) statt eines defekten Bildes */
function logoFbHtml(name,cls){
  const T=String(name||"").replace(/\b\d+[a-z]?\b/gi,"").split(/[\s\/\-]+/).filter(w=>w&&!/^(ESV|EHC|ESC|EC|EV|ERC|TSV|SG|ETC|EHV|e\.?v\.?)$/i.test(w));
  let k=T.slice(0,3).map(w=>w[0]).join(""); if(k.length<2)k=(T[0]||String(name||"?")).slice(0,2); k=k.toUpperCase();
  let h=0; for(const c of String(name||""))h=(h*31+c.charCodeAt(0))%360;
  return `<span class="logoFb ${cls}" style="background:hsl(${h} 38% 90%);color:hsl(${h} 40% 28%)" role="img" aria-label="${esc(name)}">${esc(k)}</span>`;
}
window.logoFallback=function(img){const s=document.createElement("span");s.innerHTML=logoFbHtml(img.alt,img.className);img.replaceWith(s.firstChild)};
/* 1.44.2: Absage oder „verlegt, neuer Termin offen“ (g.postponed) – Anzeigetexte */
function cxW(g){return g&&g.postponed?"Verlegt":"Abgesagt"}function cxw(g){return g&&g.postponed?"verlegt":"abgesagt"}function cxU(g){return g&&g.postponed?"VERLEGT":"ABGESAGT"}
const rinkAddresses={"Bergkamen": "Häupenweg 29, 59192 Bergkamen", "Gelsenkirchen": "Adenauerallee 118, 45891 Gelsenkirchen", "Neuss": "Jakob-Koch-Straße 1, 41466 Neuss", "Duisburg": "Margaretenstraße 17-19, 47055 Duisburg", "Hamm": "Karl-Koßmann-Straße 1, 59071 Hamm", "Herford": "Westring 108, 32051 Herford", "Grefeath": "Stadionstraße 161, 47929 Grefrath", "Grefrath": "Stadionstraße 161, 47929 Grefrath", "Dinslaken": "Am Stadtbad 1, 46537 Dinslaken", "Essen": "Curtiusstraße 2, 45144 Essen", "Dortmund": "Strobelallee 32, 44139 Dortmund", "Bielefeld": "Duisburger Straße 14, 33647 Bielefeld", "Solingen": "Brühler Straße 20, 42657 Solingen", "Aachen": "Hubert-Wienen-Straße 8, 52070 Aachen", "Ratingen": "Am Sandbach 12, 40878 Ratingen", "Wiehl": "Mühlenstraße 23, 51674 Wiehl", "Möhnesee": "Teigelhof 4, 59519 Möhnesee", "Neuwied": "Andernacher Straße 111, 56564 Neuwied", "Darmstadt": "Alsfelder Straße 45, 64289 Darmstadt", "Troisdorf": "Uckendorfer Straße 135, 53844 Troisdorf"};
/* Ungefähre Lage der Hallen (Schlüssel wie rinkAddresses) – Gegner-Karte und Wetter (Function weatherForecast liest diese Zeile) */
const RINK_GEO={"Bergkamen":[51.6275,7.6460],"Gelsenkirchen":[51.5560,7.0880],"Neuss":[51.1830,6.6950],"Duisburg":[51.4170,6.7780],"Hamm":[51.6730,7.8350],"Herford":[52.1170,8.6560],"Grefeath":[51.3420,6.3420],"Grefrath":[51.3420,6.3420],"Dinslaken":[51.5620,6.7370],"Essen":[51.4500,6.9900],"Dortmund":[51.4930,7.4560],"Bielefeld":[51.9960,8.5240],"Solingen":[51.1640,7.0690],"Aachen":[50.7930,6.0970],"Ratingen":[51.2970,6.8460],"Wiehl":[50.9500,7.5400],"Möhnesee":[51.4980,8.1300],"Neuwied":[50.4300,7.4400],"Darmstadt":[49.8865,8.6625],"Troisdorf":[50.8240,7.1660]};
function dt(g){return new Date(g.date+"T"+g.time+":00")}
function fmtDate(g){return dt(g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})}
function monthLabel(g){return dt(g).toLocaleDateString("de-DE",{month:"long",year:"numeric"})}
function isHome(g){return g.home.includes("ESV Grizzlys")}
function opponent(g){return isHome(g)?g.away:g.home}
function address(g){return rinkAddresses[g.stadium]||g.stadium+", Deutschland"}
/* ===== Tabellenstand vom EHV NRW =====
   Zeigt Platz, Punkte und Tordifferenz als kleinen Chip bei Paarungen und Gegnern.
   Die Daten kommen ausschließlich über die eigene Cloud Function "standings"
   (functions/standings.js) – die App fragt den externen Dienst nie direkt ab.
   Fällt der Abruf aus, bleibt der Chip weg – der Spielplan läuft normal weiter. */
const STAND_URL="https://europe-west1-grizzlys-u15.cloudfunctions.net/standings";
const STAND_STORE="grizzlysStandings", STAND_TTL=5*60000;
const STAND_APPVER=(document.querySelector(".inVer")?.textContent||"").trim();
let standings={};
try{const c=JSON.parse(localStorage.getItem(STAND_STORE)||"{}");if(c&&typeof c==="object")standings=c}catch(e){}
if(standings.v!==STAND_APPVER)standings.ts=0; // neue App-Version: gespeicherten Stand anzeigen, aber sofort neu holen
function standNorm(s){return String(s||"").toLowerCase().replace(/[^a-z0-9äöüß]/g,"")}
function standSig(s){const n=String(s||"");return logoKeys(n).sort().join("|")+(/grizzlys/i.test(n)?"|GRZ":"")+(/1b/i.test(n)?"#1b":"")}
function standRow(team,name){
  const rows=standings[team]&&standings[team].rows; if(!Array.isArray(rows))return null;
  const n=standNorm(name);
  return rows.find(r=>standNorm(r.n)===n)||(sig=>sig?rows.find(r=>standSig(r.n)===sig):null)(standSig(name))||null;
}
function standHtml(team,name,long=false){
  const r=standRow(team,name); if(!r)return "";
  if(!r.gp) return '<small class="gzStand none" title="Tabelle: noch kein Spiel absolviert">noch kein Spiel</small>';
  const gd=Number(r.gd)||0, gdTxt=gd>0?"+"+gd:gd<0?"−"+Math.abs(gd):"±0";
  const title="Tabelle: Platz "+r.r+" · "+r.gp+" "+(r.gp===1?"Spiel":"Spiele")+" · "+r.p+" Punkte · Tordifferenz "+gdTxt;
  return '<small class="gzStand" title="'+esc(title)+'"><b>'+esc(r.r)+'.</b><span>'+esc(r.gp)+(long?(r.gp===1?' Spiel':' Spiele'):' Sp')+' · '+esc(r.p)+' Pkt · '+gdTxt+'</span></small>'+'';
}
function standClean(part){
  if(!part||!Array.isArray(part.rows))return null;
  const rows=part.rows.map(x=>({n:String(x.n||"").slice(0,120),r:Number(x.r)||0,gp:Number(x.gp)||0,p:Number(x.p)||0,gd:Number(x.gd)||0})).filter(x=>x.n&&x.r).slice(0,40);
  if(!rows.length)return null;
  const out={rows,upd:String(part.upd||"").slice(0,40)};
  if(part.scorers&&Array.isArray(part.scorers.list))out.scorers={games:Number(part.scorers.games)||0,list:part.scorers.list.filter(x=>x&&/^[0-9]{1,3}$/.test(String(x.nr))).slice(0,60).map(x=>({nr:String(x.nr),g:Number(x.g)||0,a:Number(x.a)||0,pp:Number(x.pp)||0,gw:Number(x.gw)||0}))};
  /* 1.46.1: Strafen & Special Teams wurden hier bisher herausgefiltert – Kasten in der Saisonbilanz blieb leer */
  if(out.scorers&&part.scorers.special&&typeof part.scorers.special==="object"){const S=part.scorers.special,n=k=>Math.max(0,Math.min(9999,Number(S[k])||0));out.scorers.special={games:n("games"),pim:n("pim"),oppPim:n("oppPim"),ppOpp:n("ppOpp"),ppG:n("ppG"),pkSit:n("pkSit"),ppGA:n("ppGA"),shG:n("shG"),shGA:n("shGA"),lead:Math.max(0,Number(S.lead)||0),tied:Math.max(0,Number(S.tied)||0),trail:Math.max(0,Number(S.trail)||0)};
    /* 1.47.0: Tore nach Spielminute (6 × 10 Min. + Verlängerung) */
    const arr=v=>Array.isArray(v)&&v.length>=6?v.slice(0,7).map(q=>Math.max(0,Math.min(999,Number(q)||0))):null; const tf=arr(S.tf),ta=arr(S.ta); if(tf&&ta){out.scorers.special.tf=tf;out.scorers.special.ta=ta}}
  if(Array.isArray(part.games)){
    out.games=part.games.filter(x=>x&&/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(x.d)&&x.h&&x.a).slice(-400).map(x=>({d:x.d,t:Number(x.t)||0,h:String(x.h).slice(0,120),a:String(x.a).slice(0,120),hs:Number(x.hs)||0,as:Number(x.as)||0,ot:x.ot===true,so:x.so===true,p:(Array.isArray(x.p)?x.p:[]).filter(v=>/^[0-9]{1,2}:[0-9]{1,2}$/.test(v)).slice(0,3),sc:(Array.isArray(x.sc)?x.sc:[]).map(String).filter(v=>/^[0-9]{1,3}$/.test(v)).slice(0,30),pp:Number(x.pp)||0,...(Array.isArray(x.av)?{av:x.av.map(String).filter(v=>/^[0-9]{1,3}$/.test(v)).slice(0,60)}:{})}));
  }
  return out;
}
/* Form: die letzten (bis zu 5) Ligaspiele eines Teams als Punkte – grün Sieg, rot Niederlage,
   mit Rand = Entscheidung nach Verlängerung/Penaltyschießen */
function standFormHtml(team,name){
  const r=standRow(team,name), games=standings[team]&&standings[team].games; if(!r||!Array.isArray(games))return "";
  const mine=games.filter(x=>x.h===r.n||x.a===r.n).sort((x,y)=>x.t-y.t).slice(-5); if(!mine.length)return "";
  const word=[]; const dots=mine.map(x=>{const home=x.h===r.n, won=home?x.hs>x.as:x.as>x.hs, extra=x.ot||x.so; word.push((won?"Sieg":"Niederlage")+(x.so?" n.P.":x.ot?" n.V.":"")); return '<i class="'+(won?"w":"l")+(extra?" x":"")+'"></i>'}).join("");
  return '<span class="gzForm" title="'+esc("Letzte Spiele: "+word.join(", "))+'" aria-label="'+esc("Letzte Spiele: "+word.join(", "))+'">'+'<i class="e"></i>'.repeat(5-mine.length)+dots+'</span>';
}
/* Drittelergebnisse eines Grizzlys-Spiels – nur wenn der EHV-Endstand zum eingetragenen Ergebnis passt */
function standPeriodsHtml(g){
  const games=standings[g.team]&&standings[g.team].games; if(!Array.isArray(games))return "";
  const h=standRow(g.team,g.home), a=standRow(g.team,g.away); if(!h||!a)return "";
  const x=games.find(x=>x.d===g.date&&x.h===h.n&&x.a===a.n); if(!x||x.p.length<3)return "";
  const res=window.resultFor&&window.resultFor(g);
  if(!res||Number(res.homeScore)!==x.hs||Number(res.awayScore)!==x.as)return "";
  return '<div class="gzPeriods">Drittel <b>'+x.p.map(esc).join(" · ")+'</b>'+(x.so?" · n.P.":x.ot?" · n.V.":"")+'</div>';
}
/* Eigene Zeile unter der Paarung: links Heim, rechts Gast – steht immer auf gleicher Höhe,
   egal über wie viele Zeilen die Teamnamen laufen. Passt in jedes 3-Spalten-Raster (Heim | VS | Gast). */
function standSideHtml(team,name){const c=standHtml(team,name);return c?c+standFormHtml(team,name):""}
function standPairHtml(team,home,away){
  const l=standSideHtml(team,home), r=standSideHtml(team,away); if(!l&&!r)return "";
  return '<div class="gzMetaRow"><div class="gzMeta">'+l+'</div><div class="gzMeta">'+r+'</div></div>';
}
function standNote(){
  const el=document.getElementById("standNote"); if(!el)return;
  const have=window.MY_TEAMS.filter(t=>standings[t]&&standings[t].rows);
  if(!have.length){el.hidden=true;return}
  const upd=have.map(t=>standings[t].upd).filter(Boolean).sort().pop();
  el.hidden=false; el.textContent="Tabellenstand: EHV NRW"+(upd?" · Stand "+upd+" Uhr":"");
}
let standBusy=false;
async function loadStandings(force=false){
  if(standBusy)return;
  if(!force&&standings.ts&&Date.now()-standings.ts<STAND_TTL){standNote();return}
  standBusy=true;
  try{
    const res=await fetch(STAND_URL,{credentials:"omit",cache:"no-cache"});
    if(!res.ok)throw new Error("HTTP "+res.status);
    const d=await res.json(), next={ts:Date.now(),v:STAND_APPVER};
    window.TEAM_KEYS.forEach(t=>{const c=standClean(d&&d[t]); if(c)next[t]=c; else if(standings[t])next[t]=standings[t]});
    const changed=window.TEAM_KEYS.some(t=>JSON.stringify(next[t]||null)!==JSON.stringify(standings[t]||null));
    if(next.A||next.B){
      standings=next;
      try{localStorage.setItem(STAND_STORE,JSON.stringify(standings))}catch(e){}
      if(changed){ try{renderNext(); if(window.applyResults)window.applyResults()}catch(e){console.warn(e)} }
    }
  }catch(e){ console.warn("Tabellenstand konnte nicht geladen werden",e); }
  standBusy=false; standNote();
}
window.loadStandings=loadStandings;
/* Admin: Ergebnis des EHV-Abgleichs anzeigen. „Ins Formular“ füllt nur die Felder der
   Spieländerung – gespeichert wird erst mit dem normalen Speichern-Knopf. */
window.renderEhvCheck=function(data,box){
  const fd=d=>d?new Date(d+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"}):"";
  const label={date:"Datum",time:"Uhrzeit",stadium:"Spielort",open:"beim EHV noch ohne Termin",missing:"beim EHV nicht gefunden"};
  const line=x=>x?(x.open?"ohne Termin (n.n.)":esc(fd(x.date))+" · "+esc(x.time)+" Uhr")+(x.stadium?" · "+esc(x.stadium):""):"–";
  const diffs=Array.isArray(data&&data.diffs)?data.diffs:[], extra=Array.isArray(data&&data.extra)?data.extra:[], na=Array.isArray(data&&data.unavailable)?data.unavailable:[];
  let html="";
  if(na.length) html+='<div class="ehvWarn">EHV-Spielplan für '+na.map(t=>esc(teamName(t))).join(" und ")+' gerade nicht abrufbar.</div>';
  if(!diffs.length&&!extra.length) html+='<div class="ehvOk">✓ Keine Abweichungen'+(na.length?" bei den abrufbaren Spielen":"")+' – '+esc(data&&data.games||0)+' Spiele geprüft.</div>';
  else html+='<div class="ehvHead"><b>'+(diffs.length+extra.length)+' Abweichung'+(diffs.length+extra.length===1?"":"en")+'</b> zum EHV-Spielplan</div>';
  html+=diffs.map((d,i)=>'<div class="ehvDiff" data-team="'+esc(d.team)+'"><div><b>'+esc(teamName(d.team))+'</b> · '+esc(d.home)+' – '+esc(d.away)+'</div>'+
    '<div class="ehvTags">'+(d.what||[]).map(w=>'<span>'+esc(label[w]||w)+'</span>').join("")+'</div>'+
    '<div class="ehvRow"><i>App</i>'+line(d.app)+'</div>'+(d.ehv?'<div class="ehvRow"><i>EHV</i>'+line(d.ehv)+'</div>':'')+
    (d.ehv&&!d.ehv.open?'<button class="action ehvFill" type="button" data-i="'+i+'">Ins Formular übernehmen</button>':'')+'</div>').join("");
  html+=extra.map(x=>'<div class="ehvDiff" data-team="'+esc(x.team)+'"><div><b>'+esc(teamName(x.team))+'</b> · '+esc(x.home)+' – '+esc(x.away)+'</div><div class="ehvTags"><span>fehlt in der App</span></div><div class="ehvRow"><i>EHV</i>'+line(x.ehv)+'</div></div>').join("");
  box.hidden=false; box.innerHTML=html;
  box.querySelectorAll(".ehvFill").forEach(btn=>btn.onclick=()=>{
    const d=diffs[Number(btn.dataset.i)], row=[...document.querySelectorAll(".adminScheduleGame")].find(r=>r.dataset.scheduleId===d.id);
    if(!row){alert("Dieses Spiel wurde im Formular nicht gefunden.");return}
    if(d.ehv.date)row.querySelector(".scheduleDate").value=d.ehv.date;
    if(d.ehv.time)row.querySelector(".scheduleTime").value=d.ehv.time;
    if(d.what.includes("stadium")&&d.ehv.stadium)row.querySelector(".scheduleStadium").value=d.ehv.stadium;
    row.classList.add("ehvFilled"); row.scrollIntoView({behavior:"smooth",block:"center"});
  });
};


// Ungefähre Fahrentfernung ab Eissporthalle Bergkamen (Häupenweg 29).
// Die Werte beziehen sich auf die jeweilige Eishalle und werden bewusst als ca.-Angabe angezeigt.
const rinkDistanceKm={
  /* Fahrstrecke Eishalle Bergkamen → Eishalle in km (OSRM/OpenStreetMap, schnellste Route, Stand 20.10.2026) */
  "Bergkamen":0,
  "Gelsenkirchen":47,
  "Neuss":103,
  "Duisburg":82,
  "Hamm":17,
  "Herford":112,
  "Grefeath":123,
  "Grefrath":123,
  "Dinslaken":73,
  "Essen":65,
  "Dortmund":30,
  "Bielefeld":95,
  "Solingen":79,
  "Aachen":170,
  "Ratingen":94,
  "Wiehl":122,
  "Möhnesee":52,
  "Neuwied":188,
  "Darmstadt":262,
  "Troisdorf":128   /* 1.35.0: ungefähr */
};
function distanceForStadium(stadium){
  const km=rinkDistanceKm[stadium];
  return km===undefined?null:km;
}
function distanceHtml(stadium){
  const km=distanceForStadium(stadium);
  return km===null?"":`<span class="opponentDistance">${ic("pin")} ${km} km</span>`;
}
function logoKeys(name){
  const n=name.toLowerCase(); const keys=[];
  if(n.includes("dinslak")) keys.push("Dinslakener Kobras");   if(n.includes("troisdorf")) keys.push("EHC Troisdorf");
  if(n.includes("darmstadt")) keys.push("ESC Darmstadt"); if(n.includes("rheine")&&n.includes("young cats")) keys.push("ESC Rheine Young Cats");
  if(n.includes("gelsenkirchen")) keys.push("EHC Gelsenkirchen");
  if(n.includes("herner")) keys.push("Herner EV");
  if(n.includes("neusser")) keys.push("Neusser EV");
  if(n.includes("moers")) keys.push("GSC Moers");
  if(n.includes("tsve")) keys.push("TSVE Bielefeld");
  if(n.includes("neuwied")) keys.push("EHC Neuwied");
  if(n.includes("eisadler")) keys.push("Eisadler Dortmund");
  if(n.includes("wiehl")) keys.push("TuS Wiehl");
  if(n.includes("bergisch")) keys.push("EC Bergisch Land");
  if(n.includes("duisburg")) keys.push("EV Duisburg");
  if(n.includes("rating")) keys.push("Ratinger Ice Aliens");
  if(n.includes("lippe")||n.includes("hockey hamm")) keys.push("Lippe Hockey Hamm");
  if(n.includes("herforder")) keys.push("Herforder EV");
  if(n.includes("grefrath")) keys.push("Grefrather EC");
  if(n.includes("aachener")) keys.push("Aachener EC");
  if(n.includes("soester")) keys.push("Soester EG");
  if(n.includes("essen")) keys.push("EHC Essen Ruhr");
  return [...new Set(keys)];
}
function logoHtml(name, cls="opponentLogo"){
  const keys=logoKeys(name);
  if(!keys.length) return logoFbHtml(name,cls);
  return `<div class="logos">${keys.map(k=>logoImgHtml(k,cls)).join("")}</div>`;
}
function grizzlysHtml(cls="clubLogo"){return `<img class="${cls}" src="${grizzlysLogo}" alt="ESV Grizzlys">`}
function teamLogoHtml(name,cls="opponentLogo"){
  if(String(name).toLowerCase().includes("rheine young cats")){
    return `<div class="logos"><img class="${cls}" src="${grizzlysLogo}" alt="ESV Grizzlys">${logoImgHtml("ESC Rheine Young Cats",cls)}</div>`;
  }
  return grizzlysHtml(cls);
}
function sideHtml(name,right=false,team=""){
  const ours=name.includes("ESV Grizzlys");
  return `<div class="teamSide ${right?"right":""}">${right?"":(ours?teamLogoHtml(name):logoHtml(name))}<div class="teamSideName">${esc(shortTeam(name))}</div>${right?(ours?teamLogoHtml(name):logoHtml(name)):""}</div>`;
}
let scheduleMode="chrono";
let calendarCursor=new Date(dt(games.slice().sort((a,b)=>dt(a)-dt(b))[0]));
calendarCursor.setDate(1);
function monthKey(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
let activeTeamFilters=new Set(window.MY_TEAMS);
let activeVenueFilters=new Set(["home","away"]);
function gameMatchesFilters(g){
  const teamOk=activeTeamFilters.size===0||activeTeamFilters.has(g.team);
  const venueOk=activeVenueFilters.size===0||activeVenueFilters.has(isHome(g)?"home":"away");
  return teamOk&&venueOk;
}
function currentFilterSummary(){
  const allT=activeTeamFilters.size===window.MY_TEAMS.length;
  const teams=allT?(window.oneTeam()?teamName(window.MY_TEAMS[0]):window.MY_TEAMS.length===2&&window.MY_TEAMS.join("")==="AB"?teamName("A + B"):"Alle Mannschaften"):activeTeamFilters.size>=1?[...activeTeamFilters].map(teamName).join(" + "):"Keine Mannschaft";
  const venues=activeVenueFilters.size===2?"Heim + Auswärts":activeVenueFilters.size===1?(activeVenueFilters.has("home")?"Heim":"Auswärts"):"Keine Spiele";
  if(allT&&activeVenueFilters.size===2)return "Alle Spiele";
  if(activeTeamFilters.size===0||activeVenueFilters.size===0)return "Keine Spiele";
  return `${teams} · ${venues}`;
}
function updateFilterUi(){
  document.querySelectorAll(".filterOption").forEach(b=>{
    const f=b.dataset.filter;
    const selected=window.APP_CFG.teams[f]?activeTeamFilters.has(f):activeVenueFilters.has(f);
    b.classList.toggle("selected",selected);
  });
  const summary=document.getElementById("filterSummary"); if(summary)summary.textContent=currentFilterSummary();
  const toggle=document.getElementById("filterToggle"); if(toggle)toggle.classList.toggle("active",currentFilterSummary()!=="Alle Spiele");
}
/* Schulferien NRW (Schuljahr 2026/27). Bewegliche Ferientage der einzelnen Schulen sind nicht enthalten.
   Für die nächste Saison hier die neuen Termine eintragen. */
const nrwFerien=[
  {name:"Herbstferien",from:"2026-10-17",to:"2026-10-31"},
  {name:"Weihnachtsferien",from:"2026-12-23",to:"2027-01-06"},
  {name:"Osterferien",from:"2027-03-22",to:"2027-04-03"},
  {name:"Pfingstferien",from:"2027-05-18",to:"2027-05-18"},
  {name:"Sommerferien",from:"2027-07-19",to:"2027-08-31"}
];
function ferienFor(key){return nrwFerien.find(f=>key>=f.from&&key<=f.to)||null}
function ferienShort(k){return k.slice(8,10)+"."+k.slice(5,7)+"."}
function renderCalendar(){
  const root=document.getElementById("calendarView");
  const arr=games.filter(gameMatchesFilters).sort((a,b)=>dt(a)-dt(b));
  const y=calendarCursor.getFullYear(), m=calendarCursor.getMonth();
  const first=new Date(y,m,1), last=new Date(y,m+1,0);
  const start=(first.getDay()+6)%7;
  const labels=["Mo","Di","Mi","Do","Fr","Sa","So"];
  document.getElementById("scheduleTitle").textContent="Spielplan";
  document.getElementById("scheduleCount").textContent=arr.length+" Spiele";
  let html='<div class="calendarNav"><button id="prevMonth" type="button" aria-label="Vorheriger Monat">‹</button><div class="calendarNavCenter"><div class="calendarTitle">'+first.toLocaleDateString("de-DE",{month:"long",year:"numeric"})+'</div><button id="todayMonth" class="calendarTodayBtn" type="button">Heute</button></div><button id="nextMonth" type="button" aria-label="Nächster Monat">›</button></div><div class="calendarHint">Termine sind direkt im jeweiligen Tagesfeld eingetragen</div>'+(()=>{const p=n=>String(n).padStart(2,"0"),a=y+"-"+p(m+1)+"-01",b=y+"-"+p(m+1)+"-"+p(last.getDate());const fs=nrwFerien.filter(f=>f.from<=b&&f.to>=a);return fs.length?'<div class="ferienLegend">'+fs.map(f=>'<span><i></i>'+esc(f.name)+' NRW · '+(f.from===f.to?ferienShort(f.from):ferienShort(f.from)+'–'+ferienShort(f.to))+'</span>').join("")+'</div>':""})()+'<div class="calendarMonthGrid">'+labels.map(x=>'<div class="weekday">'+x+'</div>').join("");
  for(let i=0;i<start;i++) html+='<div class="dayCell" style="visibility:hidden"></div>';
  for(let d=1;d<=last.getDate();d++){
    const key=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const dayGames=arr.filter(g=>g.date===key);
    const today=new Date(); const todayKey=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
    const fer=ferienFor(key);
    html+='<div class="dayCell '+(todayKey===key?'today':'')+(fer?' ferien':'')+'"'+(fer?' title="'+esc(fer.name)+' NRW"':'')+'><div class="dayNum">'+d+'</div><div class="dayGames">'+dayGames.map(g=>'<button type="button" class="dayGame '+g.team+(g.cancelled?' isCx':'')+'" data-game-index="'+games.indexOf(g)+'" title="'+esc(g.time+' · '+opponent(g)+(g.cancelled?' · '+cxw(g):''))+'"><span class="gameTime">U15 '+g.team+' · '+(g.cancelled?cxw(g):esc(g.time))+'</span><span class="gameOpp">'+esc(opponent(g))+'</span><span class="gameVenue">'+(isHome(g)?'🏠':'✈️')+' '+esc(g.stadium)+'</span></button>').join("")+'</div></div>';
  }
  const cells=7+start+last.getDate();
  for(let i=cells;i%7!==0;i++) html+='<div class="dayCell" style="visibility:hidden"></div>';
  html+='</div>';
  root.innerHTML=html;
  root.querySelectorAll('.dayGame').forEach(btn=>btn.onclick=()=>openMatchDetails(games[Number(btn.dataset.gameIndex)]));
  root.querySelector('#prevMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()};
  root.querySelector('#nextMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()};
  root.querySelector('#todayMonth').onclick=()=>{calendarCursor=new Date();calendarCursor.setDate(1);renderCalendar()};
}
function setScheduleMode(mode){
  scheduleMode=mode;
  const chrono=document.getElementById("chronoBtn"), month=document.getElementById("monthBtn");
  const list=document.getElementById("gamesList"), cal=document.getElementById("calendarView");
  chrono.classList.toggle("active",mode==="chrono");
  month.classList.toggle("active",mode==="month");
  if(mode==="month"){
    const mj=document.getElementById("monthJump");if(mj)mj.hidden=true;
    list.hidden=true;list.style.display="none";
    cal.hidden=false;cal.style.display="block";
    renderCalendar();
  }else{
    cal.hidden=true;cal.style.display="none";
    list.hidden=false;list.style.display="grid";
    renderList("all");
  }
}
function todayKey(){const n=new Date(),p=x=>String(x).padStart(2,"0");return n.getFullYear()+"-"+p(n.getMonth()+1)+"-"+p(n.getDate())}
function nextGame(){const now=Date.now();return games.filter(gameMatchesFilters).sort((a,b)=>dt(a)-dt(b)).find(g=>dt(g).getTime()+2*3600000>=now)||null}
function stickyOffset(){const el=document.getElementById("scheduleSticky"),tb=document.querySelector(".tabs");const rs=getComputedStyle(document.documentElement);const bar=46;const tabsH=document.documentElement.classList.contains("dv")?0:(tb?tb.offsetHeight:parseFloat(rs.getPropertyValue("--tabsH"))||52); /* 1.54.1: im neuen Design liegt die Navigation unten */return bar+tabsH+(el?el.offsetHeight:0)+12}
function scrollToToday(smooth=true){
  const sec=document.getElementById("scheduleView"); if(!sec||sec.hidden)return;
  let target=null;
  if(scheduleMode==="month"){
    const all=games.slice().sort((a,b)=>dt(a)-dt(b)), t=todayKey();
    const ref=all.find(g=>g.date>=t)||all[all.length-1];
    const inSeason=all.length&&t>=all[0].date&&t<=all[all.length-1].date;
    const base=inSeason?new Date():ref?dt(ref):new Date();
    calendarCursor=new Date(base.getFullYear(),base.getMonth(),1);
    renderCalendar();
    target=document.getElementById("calendarView");
  }else{
    const cards=[...document.querySelectorAll("#gamesList .card[data-date]")], t=todayKey();
    const card=document.querySelector("#gamesList .card.nextGame")||cards.find(c=>c.dataset.date>=t)||cards[cards.length-1];
    if(card){
      target=card;
      const prev=card.previousElementSibling;
      if(prev&&prev.classList.contains("month"))target=prev;
      card.classList.remove("todayFlash"); void card.offsetWidth; card.classList.add("todayFlash");
    }else target=document.getElementById("gamesList");
  }
  if(!target)return;
  const y=target.getBoundingClientRect().top+window.scrollY-stickyOffset();
  window.scrollTo({top:Math.max(0,y),behavior:smooth?"smooth":"auto"});
}

const calSel={teams:new Set(window.MY_TEAMS),venues:new Set(["home","away"]),range:"all"};
function calGames(){const now=new Date();return games.filter(g=>calSel.teams.has(g.team)&&calSel.venues.has(isHome(g)?"home":"away")&&(calSel.range==="all"||dt(g)>=now)).sort((a,b)=>dt(a)-dt(b))}
function updateCalFilterUI(){
  document.querySelectorAll(".calChip[data-cal]").forEach(b=>{const [k,v]=b.dataset.cal.split(":");b.classList.toggle("active",k==="team"?calSel.teams.has(v):k==="venue"?calSel.venues.has(v):calSel.range===v)});
  const n=calGames().length;
  document.getElementById("calFilterHint").textContent=n===1?"1 Spiel ausgewählt":n+" Spiele ausgewählt";
  document.getElementById("calFilterGo").disabled=n===0;
}
function openCalFilter(){const m=document.getElementById("calFilterModal");updateCalFilterUI();m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCalFilter(){const m=document.getElementById("calFilterModal");m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function downloadSelectedCalendar(){
  const arr=calGames(); if(!arr.length)return;
  const t=[...calSel.teams].sort().join("+");
  const label=teamName(t.replace)("+"," + ");
  trackAnalyticsEvent("calendar_download",{team:label,type:"custom",venue:calSel.venues.size===2?"alle":[...calSel.venues][0],range:calSel.range});
  const parts=[APP_CFG.age,t.replace("+","-und-")];
  if(calSel.venues.size===1)parts.push([...calSel.venues][0]==="home"?"Heim":"Auswaerts");
  if(calSel.range==="future")parts.push("kommende");
  downloadIcsBundle(arr,parts.join("-")+"-Spielplan.ics");
  closeCalFilter();
}
function downloadTeamCalendar(team){trackAnalyticsEvent("calendar_download",{team:teamName(team),type:"team"});const arr=games.filter(g=>g.team===team).sort((a,b)=>dt(a)-dt(b));downloadIcsBundle(arr,"U15-"+team+"-Spielplan.ics")}
function downloadBothCalendars(){trackAnalyticsEvent("calendar_download",{team:teamName("A+B"),type:"both"});downloadIcsBundle(games.slice().sort((a,b)=>dt(a)-dt(b)),"U15-A-und-B-Spielplan.ics")}
function pdfFilterMatch(g,filters){
  if(!filters || filters.length===0 || filters.includes("all")) return true;
  const teamFilters=filters.filter(f=>!!window.APP_CFG.teams[f]);
  const locationFilters=filters.filter(f=>f==="home"||f==="away");
  if(teamFilters.length && !teamFilters.includes(g.team)) return false;
  if(locationFilters.length){
    const home=isHome(g);
    if(locationFilters.includes("home") && locationFilters.includes("away")) return true;
    if(locationFilters.includes("home") && !home) return false;
    if(locationFilters.includes("away") && home) return false;
  }
  return true;
}
function pdfFilterLabel(filters){
  if(!filters || !filters.length || filters.includes("all")) return "Alle Spiele";
  const labels=[];
  if(filters.includes("A")) labels.push(teamName("A"));
  if(filters.includes("B")) labels.push(teamName("B"));
  if(filters.includes("home")) labels.push("Heimspiele");
  if(filters.includes("away")) labels.push("Auswärtsspiele");
  return labels.join(" + ");
}
let pdfSelectedFilters=["all"];
function updatePdfFilterUI(){
  document.querySelectorAll(".pdfFilterBtn").forEach(b=>b.classList.toggle("active",pdfSelectedFilters.includes(b.dataset.pdfFilter)));
  document.getElementById("pdfFilterHint").textContent=pdfSelectedFilters.includes("all")?"Alle Spiele werden gedruckt.":"Auswahl: "+pdfFilterLabel(pdfSelectedFilters);
}
function openPdfFilter(){
  pdfSelectedFilters=["all"];
  updatePdfFilterUI();
  const m=document.getElementById("pdfFilterModal");m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closePdfFilter(){
  const m=document.getElementById("pdfFilterModal");m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow="";
}
function printAllGamesPdf(filters=["all"]){
  trackAnalyticsEvent("pdf_download",{filter:pdfFilterLabel(filters)});
  const label=pdfFilterLabel(filters);
  const arr=games.filter(g=>pdfFilterMatch(g,filters)).slice().sort((a,b)=>dt(a)-dt(b));
  const rows=arr.map(g=>{
    const r=resultFor(g);
    const score=r&&r.homeScore!==undefined&&r.awayScore!==undefined?esc(String(r.homeScore)+":"+String(r.awayScore)):"–";
    return "<tr>"+
      "<td>"+esc(fmtDate(g))+"</td>"+
      "<td>"+esc(g.time)+"</td>"+
      "<td class=\"printTeam"+g.team+"\">"+teamName(esc)(g.team)+"</td>"+
      "<td>"+esc(g.home)+"</td>"+
      "<td>"+esc(g.away)+"</td>"+
      "<td class=\"printResult\">"+(g.cancelled?(score!=="–"?score+" ":"")+"<b>"+(g.postponed?"verlegt, Termin offen":"abgesagt")+"</b>":score)+"</td>"+
      "<td>"+esc(g.stadium)+"</td>"+
    "</tr>";
  }).join("");
  const root=document.getElementById("printSchedule");
  root.innerHTML=
    '<table class="printTable"><thead>'+
    '<tr class="printRepeatHead"><td colspan="7">'+'<div class="printHeader">'+'<div class="printHeaderLeft"><img class="printLogo" src="logo.png" alt="ESV Grizzlys Logo"><div><div class="printTitle">ESV Grizzlys Bergkamen · Young Grizzlys Spielplan</div>'+'<div class="printSub">Saison 2026/27 · '+esc(label)+' · Ergebnisse, wenn vorhanden</div></div></div>'+'<div class="printDate">Stand: '+esc(new Date().toLocaleDateString("de-DE"))+'</div>'+'</div>'+'</td></tr>'+
    '<tr><th>Datum</th><th>Uhrzeit</th><th>Mannschaft</th><th>Heim</th><th>Gast</th><th>Ergebnis</th><th>Spielort</th></tr></thead><tbody>'+rows+'</tbody></table>'+
    '<div class="printFooter">'+APP_CFG.club+' · '+APP_CFG.appName+' · Saison '+APP_CFG.season+'</div>';
  const printWindow=window.open("","_blank");
  if(!printWindow){alert("Das Druckfenster konnte nicht geöffnet werden. Bitte Pop-ups für die App erlauben.");return;}
  const logoUrl=new URL("logo.png",window.location.href).href;
  const printHtml=root.innerHTML;
  printWindow.document.open();
  printWindow.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Young Grizzlys Spielplan</title><style>
    @page{size:A4 landscape;margin:10mm}
    html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}
    .printHeader{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #071b33;padding-bottom:7px;margin-bottom:10px}
    .printHeaderLeft{display:flex;align-items:center;gap:12px}.printLogo{width:70px;height:70px;object-fit:contain;flex:0 0 70px}
    .printTitle{font-size:18pt;font-weight:800}.printSub{font-size:9pt;color:#555;margin-top:2px}.printDate{font-size:8pt;color:#555}
    .printTable{width:100%;border-collapse:collapse;font-size:8.5pt}.printTable th{background:#071b33;color:#fff;text-align:left;padding:5px 6px}.printTable td{border-bottom:1px solid #d8e4ef;padding:4px 6px;vertical-align:top}.printTable tr{break-inside:avoid}.printTeamA{color:#0864b7;font-weight:800}.printTeamB{color:#b65d00;font-weight:800}.printResult{font-weight:800}.printFooter{margin-top:8px;font-size:7.5pt;color:#666}
  </style></head><body>${printHtml.replace(/src="logo\\.png"/g,'src="'+logoUrl+'')}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload=()=>setTimeout(()=>printWindow.print(),150);
}
function downloadIcsBundle(arr,filename){const body=arr.flatMap(g=>icsForEvent(g));const content=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ESV Grizzlys//U15//DE","CALSCALE:GREGORIAN",...body,"END:VCALENDAR"].join("\r\n");const blob=new Blob([content],{type:"text/calendar;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function icsForEvent(g){const d=dt(g),end=new Date(d.getTime()+2*3600000),p=n=>String(n).padStart(2,"0"),stamp=x=>x.getFullYear()+p(x.getMonth()+1)+p(x.getDate())+"T"+p(x.getHours())+p(x.getMinutes())+"00";return ["BEGIN:VEVENT","UID:"+g.date+"-"+g.time+"-"+g.team+"@grizzlys-u15","DTSTART:"+stamp(d),"DTEND:"+stamp(end),...(g.cancelled?["STATUS:CANCELLED"]:[]),"SUMMARY:"+(g.cancelled?cxU(g)+": ":"")+teamName(g.team)+" – "+opponent(g),"LOCATION:"+address(g),"DESCRIPTION:"+g.home+" gegen "+g.away+"\\nSpielort: "+address(g),"END:VEVENT"]}
function isLiveNow(x){const n=Date.now(),s=+dt(x);return !x.cancelled&&s<=n&&s+2.5*3600000>n&&!resInfo(x)}
function renderNext(){
  const g=games.filter(x=>dt(x)>=new Date()).sort((a,b)=>dt(a)-dt(b))[0]||games[games.length-1];
  const cls="team"+g.team;
  const t=document.getElementById("nextTeam"); t.className="nextTeam "+cls; t.textContent=teamName(g.team); document.querySelector(".next").dataset.team=g.team; document.querySelector(".nextLabel").innerHTML="Nächstes Spiel"+`<span class="homeaway">${isHome(g)?ic("home")+"Heim":ic("away")+"Auswärts"}</span>`+hwBadge(g);
  document.getElementById("nextDate").innerHTML=`<span>${fmtDate(g)}</span><b class="nextTime">${g.time} Uhr</b>`;
  document.getElementById("nextMatch").innerHTML=sideHtml(g.home,false,g.team)+`<div class="vs">VS</div>`+sideHtml(g.away,true,g.team)+standPairHtml(g.team,g.home,g.away);
  const nextDistance=distanceHtml(g.stadium);
  document.getElementById("nextMeta").innerHTML=`<svg class="pinIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg><span class="gzNextVenue"><b>${g.stadium}</b>${nextDistance?`<span class="gzDist">${nextDistance}</span>`:""}</span>`;
  {const box=document.querySelector(".next"), meta=document.getElementById("nextMeta"), acts=box.querySelector(".actions");
   if(acts&&!box.querySelector(".gzFoot")){const f=document.createElement("div");f.className="gzFoot";box.insertBefore(f,meta);f.appendChild(meta);f.appendChild(acts);
     [["nextRoute","Route"],["nextCalendar","Termin"],["nextReminder","Erinnerung"],["nextShare","Teilen"]].forEach(([id,l])=>{const b=document.getElementById(id);if(b){b.setAttribute("aria-label",l);b.title=l}});}}
  document.getElementById("nextRoute").onclick=()=>route(g); document.getElementById("nextCalendar").onclick=()=>calendar(g); document.getElementById("nextReminder").onclick=()=>reminder(g); document.getElementById("nextShare").onclick=()=>shareGame(g);
  hwDecorate(document.querySelector(".next"),g);
  /* 1.70.4: Ein Spiel, das gerade läuft (Bully vorbei, noch kein Endstand, höchstens 2,5 Std.), steht ganz oben – darunter die nächsten Spiele */
  const liveG=games.filter(isLiveNow).sort((a,b)=>dt(b)-dt(a))[0]||null;
  {const now=new Date();
   const more=dt(g)>=now?window.MY_TEAMS.filter(t=>t!==g.team).map(t=>games.filter(x=>x.team===t&&dt(x)>=now).sort((a,b)=>dt(a)-dt(b))[0]).filter(Boolean).sort((a,b)=>dt(a)-dt(b)):[];
   const list=liveG?[liveG,g,...more]:[g,...more];
   g3HomeCard("g3HomeNext",list[0],liveG?"Läuft gerade":"Nächstes Spiel",false);
   g3HomeCard("g3HomeNext2",list[1]||null,"Nächstes Spiel",false);
   g3HomeCard("g3HomeNext3",list[2]||null,"Nächstes Spiel",false);}
  renderLast(); renderTeamTiles();
}


const HW_PUMPKIN='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 8c0-3 1-5 3-6" fill="none" stroke="#3b8a2f" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="9.5" cy="19" rx="7" ry="9.5" fill="#e8660a"/><ellipse cx="22.5" cy="19" rx="7" ry="9.5" fill="#e8660a"/><ellipse cx="16" cy="19" rx="6.2" ry="10.5" fill="#ff8a1f"/><path d="M9 17l3 2.2l-3.4 .4zM23 17l-3 2.2l3.4 .4zM11 24q5 3.4 10 0l-1.6 -1.6l-1.6 1.2l-1.8 -1.4l-1.8 1.4l-1.6 -1.2z" fill="#1a0f05"/></svg>';
function isHwGame(g){return /-10-31$/.test(g.date)}
function hwBadge(g){return (document.documentElement.classList.contains("hw")&&isHwGame(g))?`<span class="hwBadge">${HW_PUMPKIN}Halloween-Spiel</span>`:""}
function hwDecorate(el,g){
  if(!el)return;
  el.querySelectorAll(":scope > .hwSpook").forEach(n=>n.remove());
  const on=document.documentElement.classList.contains("hw")&&isHwGame(g);
  el.classList.toggle("hwGameCard",on);
  if(on)el.insertAdjacentHTML("beforeend",'<span class="hwSpook" aria-hidden="true"><span class="hwEyes"><i></i><i></i></span><span class="hwGhost">👻</span><span class="hwGhost hwGhost2">👻</span></span>');
}
function hwGreetClosedKey(){return "hwGreetingClosed"+new Date().getFullYear()}
function hwUpdateGreeting(){
  const el=document.getElementById("hwGreeting"); if(!el)return;
  let closed=false; try{closed=localStorage.getItem(hwGreetClosedKey())==="1"}catch(e){}
  el.hidden=!(document.documentElement.classList.contains("hw")&&!closed);
}
/* Push-Bereich: Status anzeigen */
(function(){const ids={results:"pfResults",reminders:"pfReminders",reports:"pfReports",teamA:"pfTeamA",teamB:"pfTeamB",teamU13:"pfTeamU13",liveGoals:"pfLiveGoals",livePeriods:"pfLivePeriods",liveMyNr:"pfLiveMyNr"},E={};for(const k in ids){E[k]=document.getElementById(ids[k]);if(!E[k])return}
  const OPTIN={liveGoals:1,livePeriods:1,teamU13:1,reports:1,liveMyNr:1}; /* 1.43.0: Spielbericht und „Tore meiner Nummer“ nur auf Wunsch */ /* 1.35.0: U13 nur bei ausdrücklicher Auswahl */ /* 1.26.0: Live-Pushs nur, wenn ausdrücklich eingeschaltet */
  let p={};try{p=JSON.parse(localStorage.getItem("grizzlysPushPrefs")||"{}")}catch(e){}for(const k in E)E[k].checked=OPTIN[k]?p[k]===true:p[k]!==false;
  const save=()=>{let o={};try{o=JSON.parse(localStorage.getItem("grizzlysPushPrefs")||"{}")||{}}catch(e){}for(const k in E)o[k]=E[k].checked;try{localStorage.setItem("grizzlysPushPrefs",JSON.stringify(o))}catch(e){}window.savePushPrefs&&window.savePushPrefs()};
  for(const k in E)E[k].addEventListener("change",save);})();
function pushRefreshUi(){
  const card=document.getElementById("pushCard");if(!card)return;
  let st="off",txt="Push aktivieren",note="Du entscheidest pro Gerät. Beim ersten Mal fragt dein Browser nach der Erlaubnis.",lab="Aus";
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.matchMedia("(display-mode: standalone)").matches&&!navigator.standalone;
  if(!("Notification" in window)||ios){st="unsupported";lab="Nicht möglich";txt="Hier nicht verfügbar";note=ios?"Auf dem iPhone: Seite im Teilen-Menü „Zum Home-Bildschirm“ hinzufügen und die App von dort öffnen. Dann kannst du Push aktivieren.":"Dieser Browser unterstützt keine Push-Benachrichtigungen.";}
  else if(Notification.permission==="denied"){st="blocked";lab="Blockiert";txt="Im Browser blockiert";note="Erlaube Benachrichtigungen für diese Seite in den Browser- oder Handy-Einstellungen und öffne die App danach neu.";}
  else{let reg=false;try{reg=localStorage.getItem("grizzlysPushRegistered")==="1"}catch(e){}
    if(Notification.permission==="granted"&&reg){st="on";lab="Aktiv";txt="Push ist aktiv ✓";note="Dieses Gerät erhält Ergebnisse und Spiel-Erinnerungen. Abschalten geht in den Browser- oder Handy-Einstellungen.";}}
  card.dataset.state=st;{const rb=document.getElementById("pushRenew");if(rb)rb.hidden=st!=="on";}
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};set("pushState",lab);set("pushBtnText",txt);set("pushNote",note);
}
pushRefreshUi();
window.addEventListener("grizzlysPushChanged",pushRefreshUi);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)pushRefreshUi()});
document.getElementById("enablePush")?.addEventListener("click",()=>{[1200,4000,9000].forEach(t=>setTimeout(pushRefreshUi,t))});
/* Feedback: Schnellauswahl und Auswahl-Leiste */
function fbSync(){const v=document.getElementById("bugReportType")?.value||"Fehler";document.querySelectorAll("#fbSeg button").forEach(b=>{const on=b.dataset.fb===v;b.classList.toggle("on",on);b.setAttribute("aria-checked",on?"true":"false")});fbCount()}
function fbCount(){const t=document.getElementById("bugReportDescription"),c=document.getElementById("fbCount");if(t&&c)c.textContent=t.value.length+" / 2000"}
function fbSetType(v){const sel=document.getElementById("bugReportType");if(!sel)return;sel.value=v;sel.dispatchEvent(new Event("change"));fbSync()}
document.getElementById("fbSeg")?.addEventListener("click",e=>{const b=e.target.closest("button[data-fb]");if(b)fbSetType(b.dataset.fb)});
document.querySelectorAll(".fbTile").forEach(t=>t.addEventListener("click",()=>{const v=t.dataset.fb;document.getElementById("openBugReport")?.click();setTimeout(()=>fbSetType(v),30)}));
document.getElementById("bugReportDescription")?.addEventListener("input",fbCount);
document.getElementById("openBugReport")?.addEventListener("click",()=>setTimeout(fbSync,30));
/* Darstellung: hell / dunkel / automatisch */
function applyTheme(){
  const dark=window.themeDark(),m=window.themeMode(),hw=window.hwActive();
  document.documentElement.classList.toggle("dark",dark);
  document.querySelectorAll("#themeSeg button").forEach(b=>{const on=b.dataset.theme===m;b.classList.toggle("on",on);b.setAttribute("aria-checked",on?"true":"false")});
  const h=document.getElementById("themeHint");if(h)h.hidden=!(hw&&m!=="light");
  if(!hw&&!window.xmActive()){const tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",dark?"#0a1422":(window.GRIZZLYS_TEST?"#e8760a":"#071b33"))}
}
document.getElementById("themeSeg")?.addEventListener("click",e=>{const b=e.target.closest("button[data-theme]");if(!b)return;try{localStorage.setItem("grizzlysTheme",b.dataset.theme)}catch(err){}applyTheme();});
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{if(window.themeMode()==="auto")applyTheme()})}catch(e){}
applyTheme();
function applyHalloween(rerender){
  const on=window.hwActive();
  document.documentElement.classList.toggle("hw",on);
  if(typeof applyTheme==="function")applyTheme();
  const xm=!on&&window.xmActive(), lsrc=on?"halloween-logo.png?v=2":xm?"christmas-logo.png":"logo.png";
  document.documentElement.classList.toggle("xm",xm);
  const logo=document.querySelector(".heroTop img"); if(logo){logo.src=lsrc}
  const mlogo=document.querySelector("#miniBar img"); if(mlogo){mlogo.src=lsrc}
  const tc=document.querySelector('meta[name="theme-color"]'); if(tc)tc.setAttribute("content",on?"#0c0a09":xm?"#0b1a30":(window.GRIZZLYS_TEST?"#e8760a":"#071b33"));
  {const c=document.getElementById("xmSwitchCard");if(c)c.hidden=!window.xmAvailable();const x=document.getElementById("xmToggle");if(x)x.checked=xm;}
  try{window.xmRefresh&&window.xmRefresh()}catch(e){console.warn(e)}
  const card=document.getElementById("hwSwitchCard"); if(card)card.hidden=!window.hwAvailable();
  const t=document.getElementById("hwToggle"); if(t)t.checked=on;
  hwUpdateGreeting();
  {const on2=on,t1=document.getElementById("hockeyBtnTitle"),t2=document.getElementById("hockeyBtnSub"),t3=document.getElementById("hockeyBtnIcon");if(t1){t1.textContent=on2?"Gruselspiel":"Hockey Mini-Spiel";t2.textContent=on2?"Kürbis gegen Geist – wagst du dich?":"Best of 5 · 🏆 0/3 Pokale";t3.textContent=on2?"🎃":"🏒";try{if(!on2&&typeof hqBtnRefresh==="function")hqBtnRefresh()}catch(e){}}}
  if(rerender){try{renderNext();const a=document.querySelector(".scheduleFilters .filter.active");renderList(a?a.dataset.filter:"all");renderOpponents()}catch(e){}}
}
document.getElementById("xmToggle")?.addEventListener("change",e=>{try{localStorage.setItem("grizzlysXmas",e.target.checked?"on":"off");if(e.target.checked&&window.hwActive())localStorage.setItem("grizzlysHalloween","off")}catch(err){}applyHalloween(true)});
document.getElementById("hwToggle")?.addEventListener("change",e=>{try{localStorage.setItem("grizzlysHalloween",e.target.checked?"on":"off");if(e.target.checked)localStorage.setItem("grizzlysXmas","off");if(e.target.checked)localStorage.removeItem(hwGreetClosedKey())}catch(err){}applyHalloween(true)});
document.getElementById("hwGreetingClose")?.addEventListener("click",()=>{try{localStorage.setItem(hwGreetClosedKey(),"1")}catch(e){}hwUpdateGreeting()});

/* Kopfbereich: Live-Status, Gameday, Mini-Leiste */
function hwSameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
function heroUpdate(){
  const el=document.getElementById("heroStatus"), mini=document.getElementById("miniStatus");
  if(!el)return;
  const now=new Date(), hm=g=>g.time.replace(/^0/,"");
  const today=games.filter(g=>hwSameDay(dt(g),now)).sort((a,b)=>dt(a)-dt(b));
  const live=today.filter(g=>dt(g).getTime()+2.5*3600000>now.getTime());
  let txt="",short="",cls="";
  if(live.length){
    cls="gameday";
    txt="GAMEDAY · "+(live.length===1?hm(live[0])+" Uhr":live.map(g=>teamName(g.team)+" "+hm(g)).join(" · "));
    short="Gameday";
  }else{
    const next=games.filter(g=>dt(g)>now).sort((a,b)=>dt(a)-dt(b))[0];
    if(next){
      const d0=new Date(now.getFullYear(),now.getMonth(),now.getDate()), d1=new Date(dt(next).getFullYear(),dt(next).getMonth(),dt(next).getDate());
      const days=Math.round((d1-d0)/86400000);
      if(days<=1){txt="Morgen "+hm(next)+" Uhr · "+teamName(next.team);short="Morgen "+hm(next)}
      else{txt="Nächstes Spiel in "+days+" Tagen · "+teamName(next.team);short="in "+days+" Tagen"}
    }else{txt="Saison beendet";short="Saison beendet"}
  }
  el.hidden=!txt; el.className="heroChip"+(cls?" "+cls:""); el.textContent=txt;
  if(mini){mini.textContent=short;mini.className="miniStatus"+(cls?" "+cls:"")}
}
(function(){
  const bar=document.getElementById("miniBar"),hero=document.querySelector(".hero"),tabs=document.querySelector(".tabs"),root=document.documentElement;
  if(!bar||!hero)return;
  let on=false,ticking=false;
  function measure(){root.style.setProperty("--tabsH",(tabs?tabs.offsetHeight:0)+"px")}
  function check(){
    ticking=false;
    const show=window.scrollY>hero.offsetHeight-52;
    if(show!==on){on=show;bar.classList.toggle("on",on);bar.setAttribute("aria-hidden",on?"false":"true");root.style.setProperty("--barH",on?"46px":"0px")}
  }
  window.addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(check)}},{passive:true});
  window.addEventListener("resize",()=>{measure();check()});
  bar.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  measure();check();
  setInterval(heroUpdate,60000);
})();
function resInfo(g){
  const r=window.resultFor&&window.resultFor(g);
  if(!r||r.homeScore===undefined||r.awayScore===undefined||r.homeScore===""||r.awayScore==="")return null;
  const hs=Number(r.homeScore),as=Number(r.awayScore),h=isHome(g),gs=h?hs:as,os=h?as:hs;
  /* 1.29.3: Im Eishockey gibt es kein Unentschieden – in der U15 entscheidet bei Gleichstand nach 60 Minuten ein Penaltyschießen.
     Der Endstand enthält (wie beim EHV) den Siegtreffer; „n.P.“ kommt aus dem Ergebnis (so) oder aus den EHV-Daten. */
  const x=ehvGameOf(g), same=x&&x.hs===hs&&x.as===as;
  let o=gs>os?"w":gs<os?"l":"d", k=r.so===true||(same&&x.so)?"so":r.ot===true||(same&&x.ot)?"ot":"";
  if(o==="d"&&x&&x.hs!==x.as){const eg=h?x.hs:x.as,eo=h?x.as:x.hs;o=eg>eo?"w":"l";k="so"}
  return {hs,as,gs,os,o,x:k};
}
function ehvGameOf(g){
  try{const L=standings&&standings[g.team]&&standings[g.team].games;if(!Array.isArray(L))return null;
    const h=standRow(g.team,g.home),a=standRow(g.team,g.away);if(!h||!a)return null;
    return L.find(x=>x.d===g.date&&x.h===h.n&&x.a===a.n)||null}catch(e){return null}
}
/* Ausgang als Wort: Sieg / Niederlage, mit „n.P.“ bzw. „n.V.“; offener Gleichstand = Penaltyschießen */
const OUTW={w:"Sieg",l:"Niederlage",d:"Penaltyschießen"};
function outLabel(r,short){if(!r)return "";if(r.o==="d")return short?"n.P. offen":OUTW.d;return OUTW[r.o]+(r.x==="so"?" n.P.":r.x==="ot"?" n.V.":"")}
window.outLabel=outLabel;
function renderLast(){
  heroUpdate();
  try{window.renderSpruch&&window.renderSpruch()}catch(e){console.warn(e)}
  const box=document.getElementById("lastGameCard"); if(!box)return;
  const now=new Date();
  /* 1.70.5: ein gerade laufendes Spiel steht oben – hier nur wirklich abgeschlossene Spiele */
  const past=games.filter(g=>dt(g)<now&&!isLiveNow(g)).sort((a,b)=>dt(b)-dt(a));
  /* Letztes Spiel beider Mannschaften: je Team das zuletzt gespielte Spiel (ohne Ergebnis „Ergebnis folgt“), oben das neuere */
  const lastOf=t=>past.find(x=>x.team===t)||null;
  const both=window.MY_TEAMS.map(lastOf).filter(Boolean).sort((a,b)=>dt(b)-dt(a));
  let g=both[0]||past.find(x=>resInfo(x))||past[0];
  g3HomeCard("g3HomeLast",g||null,"Letztes Spiel",false);
  g3HomeCard("g3HomeLast2",both[1]||null,"Letztes Spiel",false);
  g3HomeCard("g3HomeLast3",both[2]||null,"Letztes Spiel",false);
  lrRender([g,both[1],both[2]].filter(Boolean));
  if(!g){box.hidden=true;return}
  const r=resInfo(g), cls="team"+g.team;
  const word=OUTW;
  box.hidden=false; box.className="last "+(r?"res_"+r.o:"res_none"); box.dataset.team=g.team;
  box.innerHTML=`<div class="nextHead"><div class="nextLabel">Letztes Spiel${hwBadge(g)}</div><div class="nextTeam ${cls}">${teamName(g.team)}</div></div>`+
   `<div class="lastBody">${sideHtml(g.home,false,g.team)}<div class="lastScore">${r?`<b>${r.hs}:${r.as}</b><span class="lastPill ${r.o}">${outLabel(r)}</span>`:`<span class="lastPill none">Ergebnis folgt</span>`}</div>${sideHtml(g.away,true,g.team)}${standPairHtml(g.team,g.home,g.away)}</div>`+(r?standPeriodsHtml(g):"")+
   `<div class="lastFoot">${fmtDate(g)} · ${g.stadium} · ${isHome(g)?"Heimspiel":"Auswärtsspiel"}</div>`;
  hwDecorate(box,g);
  box.onclick=()=>openMatchDetails(g);
}
/* 1.29.0: Saisonbilanz als Kachel mit den wichtigsten Zahlen */
const sbData={};
function renderSbCard(){
  const box=document.querySelector(".sbBtns,.sbCard"); if(!box)return;
  box.className="sbCard";
  box.innerHTML=`<div class="sbHead"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/></svg><b>Saisonbilanz</b><span>Antippen für alle Zahlen</span></div><div class="sbGrid">`+window.MY_TEAMS.map(t=>{const x=sbData[t]||{w:0,d:0,l:0,gf:0,ga:0,n:0},df=x.gf-x.ga;
    return `<button type="button" class="sbTeam team${t}" data-bilanz="${t}" aria-label="Saisonbilanz ${esc(teamName(t))} öffnen"><span class="sbName">${esc(teamName(t))}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6"/></svg></span>${x.n?`<span class="sbNums"><span><b>${x.w}</b><small>Siege</small></span><span><b>${x.gf}:${x.ga}</b><small>Tore</small></span><span><b>${df>0?"+":""}${df}</b><small>Diff.</small></span></span>`:`<span class="sbNone">Noch keine Ergebnisse</span>`}</button>`}).join("")+`</div>`;
  box.querySelectorAll("[data-bilanz]").forEach(b=>b.onclick=()=>openBilanz(b.dataset.bilanz));
}
function renderTeamTiles(){
  const now=new Date();
  window.MY_TEAMS.forEach(team=>{
    const el=document.querySelector(".teamCard.team"+team); if(!el)return;
    const all=games.filter(g=>g.team===team).sort((a,b)=>dt(a)-dt(b));
    const played=all.filter(g=>dt(g)<now).length;
    const res=all.map(g=>({g,r:resInfo(g)})).filter(x=>x.r);
    const w=res.filter(x=>x.r.o==="w").length,d=res.filter(x=>x.r.o==="d").length,l=res.filter(x=>x.r.o==="l").length;
    const gf=res.reduce((n,x)=>n+x.r.gs,0),ga=res.reduce((n,x)=>n+x.r.os,0);
    const dots=res.slice(-5).map(x=>`<i class="fd ${x.r.o}" title="${esc(outLabel(x.r))}">${{w:"S",d:"P",l:"N"}[x.r.o]}</i>`).join("");
    const nx=all.find(g=>dt(g)>=now);
    const pct=all.length?Math.round(played/all.length*100):0;
    const own=all[0]?(isHome(all[0])?all[0].home:all[0].away):"", sr=own&&typeof standRow==="function"?standRow(team,own):null;
    const stats=res.length?`<div class="tcStats"><div><b>${w}</b><span>Siege</span></div><div><b>${d}</b><span>Unent.</span></div><div><b>${l}</b><span>Niederl.</span></div><div><b>${gf}:${ga}</b><span>Tore</span></div></div>`:"";
    const nextRow=nx?`<div class="tcNext">${isHome(nx)?teamLogoHtml(nx.home,"tcLogo")+"":logoHtml(opponent(nx),"tcLogo")}<div class="tcNextTxt"><small>Nächstes Spiel · ${isHome(nx)?"Heim":"Auswärts"}</small><b>${esc(opponent(nx))}</b><small>${fmtDate(nx)} · ${nx.time} Uhr</small></div>${ic("chev")}</div>`:`<div class="tcNext"><div class="tcNextTxt"><b>Saison abgeschlossen</b></div></div>`;
    sbData[team]={w,d,l,gf,ga,n:res.length,rank:sr&&sr.r?sr.r:0,pts:sr&&sr.p!==undefined?sr.p:null,form:res.slice(-5).map(x=>x.r.o),played,total:all.length};
    el.innerHTML=`<div class="tcTop"><div class="teamLetter">${(APP_CFG.teams[team]&&APP_CFG.teams[team].letter)||team}</div><div><div class="teamTitle">${teamName(team)}</div>${capLine(team)}${res.length?"":window.resultsLoading?'<div class="tcSub sk"></div>':'<div class="tcSub">Noch keine Ergebnisse</div>'}</div>${sr&&sr.r?`<span class="tcRank">Platz ${sr.r}</span>`:""}${dots?`<div class="tcForm" title="Letzte Spiele">${dots}</div>`:""}</div>${stats}<div class="tcProg"><i style="width:${pct}%"></i></div><div class="tcProgTxt">${played} von ${all.length} Spielen gespielt</div>${nextRow}`;
  });
  try{renderSbCard()}catch(e){console.warn(e)}
  try{renderHomeTeams27()}catch(e){console.warn(e)}
}
/* ===== 1.27.0: Saisonbilanz, Direktvergleich, Spielbericht-Archiv ===== */
function sbOwn(team){const g=games.find(x=>x.team===team);return g?(isHome(g)?g.home:g.away):""}
function sbPer(g){/* Drittel aus Grizzlys-Sicht [[für,gegen],…] – nur wenn der EHV-Endstand passt */
  const x=standPeriodsData(g); if(!x)return null; const h=isHome(g);
  return x.p.slice(0,3).map(t=>{const [a,b]=String(t).split(":").map(Number);return h?[a,b]:[b,a]});
}
function seasonStats(team){
  const all=games.filter(g=>g.team===team).sort((a,b)=>dt(a)-dt(b));
  const P=all.map(g=>({g,r:resInfo(g)})).filter(x=>x.r&&!x.g.cancelled);
  const z=()=>({gp:0,w:0,d:0,l:0,gf:0,ga:0,so:0}), add=(o,x)=>{o.gp++;o[x.r.o]++;if(x.r.x==="so"||x.r.o==="d")o.so++;o.gf+=x.r.gs;o.ga+=x.r.os};
  const S={team,all,P,tot:z(),home:z(),away:z(),per:[[0,0],[0,0],[0,0]],perN:0,shut:0,big:null,worst:null,streak:null};
  P.forEach(x=>{add(S.tot,x);add(isHome(x.g)?S.home:S.away,x);if(x.r.os===0)S.shut++;
    const d=x.r.gs-x.r.os; if(d>0&&(!S.big||d>S.big.r.gs-S.big.r.os))S.big=x; if(d<0&&(!S.worst||d<S.worst.r.gs-S.worst.r.os))S.worst=x;
    const pr=sbPer(x.g); if(pr){S.perN++;pr.forEach((v,i)=>{S.per[i][0]+=v[0];S.per[i][1]+=v[1]})}});
  if(P.length){const last=P[P.length-1].r.o;let n=0;for(let i=P.length-1;i>=0&&P[i].r.o===last;i--)n++;S.streak={o:last,n}}
  S.row=typeof standRow==="function"?standRow(team,sbOwn(team)):null;
  S.reports=P.filter(x=>{const r=(window.gameReports||{})[rkey(x.g)];return r&&r.published&&r.text}).map(x=>({...x,rep:window.gameReports[rkey(x.g)]})).reverse();
  return S;
}
function sbRec(o){return `${o.w} S · ${o.l} N`+(o.d?` · ${o.d} offen`:"")}
function sbChart(S){/* Tordifferenz je Spiel als Balken */
  const P=S.P; if(!P.length)return "";
  const W=Math.max(280,P.length*26), H=96, mid=H/2, max=Math.max(3,...P.map(x=>Math.abs(x.r.gs-x.r.os))), bw=Math.min(18,W/P.length-6);
  const bars=P.map((x,i)=>{const d=x.r.gs-x.r.os,h=Math.max(3,Math.abs(d)/max*(mid-10)),cx=(i+.5)*(W/P.length);
    return `<g><title>${esc(fmtDate(x.g))} · ${esc(shortTeam(opponent(x.g)))} · ${x.r.gs}:${x.r.os}</title><rect x="${(cx-bw/2).toFixed(1)}" y="${(d>=0?mid-h:mid).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" class="sbBar ${x.r.o}"/></g>`}).join("");
  return `<div class="sbChartWrap"><svg class="sbChart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Tordifferenz je Spiel"><line x1="0" x2="${W}" y1="${mid}" y2="${mid}" class="sbAxis"/>${bars}</svg></div><div class="sbChartLeg"><span>Saisonstart</span><span>Tordifferenz je Spiel</span><span>zuletzt</span></div>`;
}
/* 1.30.0: Tabellenverlauf – Platz nach jedem eigenen Spiel, berechnet aus allen EHV-Ergebnissen der Liga */
function rankHistory(team){
  const st=standings[team]; if(!st||!Array.isArray(st.rows)||!Array.isArray(st.games)||!st.games.length)return null;
  const own=standRow(team,sbOwn(team)); if(!own)return null;
  const names=st.rows.map(r=>r.n), G=st.games.slice().sort((a,b)=>a.d.localeCompare(b.d)||a.t-b.t);
  const SYS=[[3,2,1,0],[2,2,1,0],[2,1,1,0],[3,3,0,0]];
  const tab=(L,sy)=>{const T={},z=n=>T[n]||(T[n]={p:0,gf:0,ga:0});names.forEach(z);
    L.forEach(x=>{const H=z(x.h),A=z(x.a),xt=x.ot||x.so;H.gf+=x.hs;H.ga+=x.as;A.gf+=x.as;A.ga+=x.hs;
      if(x.hs>x.as){H.p+=xt?sy[1]:sy[0];A.p+=xt?sy[2]:sy[3]}else if(x.as>x.hs){A.p+=xt?sy[1]:sy[0];H.p+=xt?sy[2]:sy[3]}else{H.p++;A.p++}});return T};
  let sy=SYS[0],bs=-1;SYS.forEach(q=>{const T=tab(G,q),sc=st.rows.filter(r=>T[r.n]&&T[r.n].p===r.p).length;if(sc>bs){bs=sc;sy=q}});
  const rank=T=>names.slice().sort((a,b)=>T[b].p-T[a].p||(T[b].gf-T[b].ga)-(T[a].gf-T[a].ga)||T[b].gf-T[a].gf||a.localeCompare(b)).indexOf(own.n)+1;
  const pts=[];G.forEach(x=>{if(x.h!==own.n&&x.a!==own.n)return;const T=tab(G.filter(y=>y.d<=x.d),sy);
    pts.push({d:x.d,r:rank(T),opp:x.h===own.n?x.a:x.h,us:x.h===own.n?x.hs:x.as,them:x.h===own.n?x.as:x.hs})});
  if(pts.length&&own.gp===pts.length)pts[pts.length-1].r=own.r;
  return pts.length?{pts,n:names.length}:null;
}
function rankChart(team){
  const H0=rankHistory(team); if(!H0||H0.pts.length<2)return "";
  const P=H0.pts,N=Math.max(2,H0.n),W=Math.max(300,P.length*44),H=132,px=22,py=20,x=i=>px+i*(W-2*px)/(P.length-1),y=r=>py+(r-1)*(H-2*py)/(N-1);
  const line=P.map((q,i)=>`${i?"L":"M"}${x(i).toFixed(1)} ${y(q.r).toFixed(1)}`).join(""), area=line+`L${x(P.length-1).toFixed(1)} ${H-4}L${x(0).toFixed(1)} ${H-4}Z`;
  const grid=[1,Math.ceil(N/2),N].filter((v,i,a)=>a.indexOf(v)===i).map(r=>`<line x1="0" x2="${W}" y1="${y(r).toFixed(1)}" y2="${y(r).toFixed(1)}" class="rkGrid"/>`).join("");
  const dots=P.map((q,i)=>`<g><title>${esc(q.d.slice(8,10)+"."+q.d.slice(5,7)+".")} · ${esc(shortTeam(q.opp))} ${q.us}:${q.them} · danach Platz ${q.r}</title><circle cx="${x(i).toFixed(1)}" cy="${y(q.r).toFixed(1)}" r="${i===P.length-1?11:9}" class="rkDot${i===P.length-1?" last":""} ${q.us>q.them?"w":"l"}"/><text x="${x(i).toFixed(1)}" y="${(y(q.r)+4).toFixed(1)}" class="rkNum">${q.r}</text></g>`).join("");
  return `<div class="sbSec"><h4>Tabellenverlauf <small>(Platz nach jedem Spiel)</small></h4><div class="rkWrap"><svg class="rkChart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tabellenplatz nach jedem Spiel: ${P.map(q=>q.r).join(", ")}">${grid}<path d="${area}" class="rkArea"/><path d="${line}" class="rkLine"/>${dots}</svg></div><div class="sbChartLeg"><span>1. Spiel</span><span>oben = Platz 1 · ${N} Teams</span><span>zuletzt</span></div></div>`;
}
/* 1.30.0: Tore und Vorlagen je Rückennummer (EHV-Spielberichte, ohne Namen) */
function scorerHtml(team){
  const sc=standings[team]&&standings[team].scorers; if(!sc||!sc.list||!sc.list.length)return "";
  const L=sc.list, max=Math.max(1,...L.map(x=>x.g+x.a)), med=["🥇","🥈","🥉"];
  const row=(x,i)=>`<div class="scR"><span class="scNr" aria-label="Rückennummer ${esc(x.nr)}">${esc(x.nr)}${capBadge(team,x.nr)}</span><span class="scBar"><i class="g" style="width:${(x.g/max*100).toFixed(1)}%"></i><i class="a" style="width:${(x.a/max*100).toFixed(1)}%"></i></span><span>${x.g}</span><span>${x.a}</span><b>${x.g+x.a}${i<3&&x.g+x.a>0?" "+med[i]:""}</b></div>`;
  const top=L.slice(0,8).map(row).join(""), more=L.length>8?`<details class="scMore"><summary>Alle ${L.length} Rückennummern</summary>${L.slice(8).map((x,i)=>row(x,i+8)).join("")}</details>`:"";
  return `<div class="sbSec"><h4>Tore nach Rückennummer <small>(${sc.games} EHV-Spielberichte)</small></h4><div class="scTab"><div class="scH"><span>Nr.</span><span></span><span>Tore</span><span>Vorl.</span><span>Pkt.</span></div>${top}${more}</div><div class="scLeg"><i class="g"></i>Tore <i class="a"></i>Vorlagen · ohne Namen, nur Rückennummern</div></div>`;
}
function bilanzHtml(team){
  const S=seasonStats(team), t=S.tot, word=OUTW;
  if(!t.gp)return `<div class="sbEmpty">${emptyBox("puck","Noch keine Ergebnisse","Sobald die "+teamName(team)+" gespielt hat, erscheint hier die Bilanz.")}</div>`;
  const tile=(v,l,c="")=>`<div class="sbTile ${c}"><b>${v}</b><span>${l}</span></div>`;
  const avg=v=>(v/t.gp).toLocaleString("de-DE",{maximumFractionDigits:1});
  const row=S.row&&S.row.r?`<div class="sbRank"><b>Platz ${esc(String(S.row.r))}</b><span>${S.row.p!==undefined?esc(String(S.row.p))+" Punkte · ":""}${esc(APP_CFG.teams[team]?APP_CFG.teams[team].league:"")}</span></div>`:"";
  const vs=x=>`${esc(shortTeam(opponent(x.g)))} <small>${isHome(x.g)?"H":"A"} · ${esc(x.g.date.slice(8,10)+"."+x.g.date.slice(5,7)+".")}</small>`;
  const form=S.P.slice(-5).map(x=>`<i class="fd ${x.r.o}" title="${esc(outLabel(x.r))}"></i>`).join("");
  const reps=S.reports.length?`<div class="sbSec"><h4>Spielberichte <small>(${S.reports.length})</small></h4><div class="sbReps">${S.reports.map((x,i)=>`<button type="button" class="sbRep" data-rep="${i}"><span class="sbRepTop"><b>${x.r.gs}:${x.r.os}</b> ${vs(x)}</span><span class="sbRepTitle">${esc(x.rep.title||"Spielbericht")}</span></button>`).join("")}</div><button type="button" class="action sbPrint" data-print>🖨 Alle Berichte als PDF (Saisonrückblick)</button></div>`:"";
  /* 1.47.0: in vier Reiter aufgeteilt, damit die Seite übersichtlich bleibt */
  const ov=`${row}${capBilanz(team)}<div class="sbGrid">${tile(t.gp,"Spiele")}${tile(t.w,"Siege","w")}${tile(t.l,"Niederl.","l")}${tile(t.so,"davon n.P.","d")}</div>
    <div class="sbGrid sbGrid3">${tile(t.gf+":"+t.ga,"Tore")}${tile((t.gf-t.ga>0?"+":"")+(t.gf-t.ga),"Differenz")}${tile(avg(t.gf),"Tore/Spiel")}</div>
    ${sbChart(S)}
    <div class="sbSec"><h4>Heim und auswärts</h4><div class="sbHA"><div><span>🏠 Heim</span><b>${sbRec(S.home)}</b><small>${S.home.gf}:${S.home.ga} Tore</small></div><div><span>🚌 Auswärts</span><b>${sbRec(S.away)}</b><small>${S.away.gf}:${S.away.ga} Tore</small></div></div></div>
    <div class="sbSec"><h4>Auffälliges</h4><ul class="sbFacts">
      ${form?`<li><span>Form (letzte ${Math.min(5,S.P.length)})</span><b class="sbForm">${form}</b></li>`:""}
      ${S.streak&&S.streak.n>=2?`<li><span>Serie</span><b>${S.streak.n} ${S.streak.o==="w"?"Siege":S.streak.o==="l"?"Niederlagen":"Penaltyschießen"} in Folge</b></li>`:""}
      ${S.big?`<li><span>Höchster Sieg</span><b>${S.big.r.gs}:${S.big.r.os} · ${vs(S.big)}</b></li>`:""}
      ${S.worst?`<li><span>Höchste Niederlage</span><b>${S.worst.r.gs}:${S.worst.r.os} · ${vs(S.worst)}</b></li>`:""}
      ${S.shut?`<li><span>Zu null gespielt</span><b>${S.shut}×</b></li>`:""}
      <li><span>Gegentore je Spiel</span><b>${avg(t.ga)}</b></li>
    </ul></div>${msList(team)}${reps}
    ${S.row&&S.row.r?`<button type="button" class="action sbTabImg" data-tabimg="${team}">📸 Tabelle als Bild teilen</button>`:""}`;
  const flow=sbLeadTime(team)+sbComeback(S)+sbClose(S)+sbPeriods(S)+sbMinutes(team)+specialHtml(team);
  const liga=rankChart(team)+sbLeagueCmp(team)+sbHalves(team,S)+sbRest(team,S);
  const nr=scorerHtml(team)+sbSpecialGoals(team)+sbMulti(team)+sbStreaks(team);
  return sbTabsHtml({ov,flow,liga,nr})+`<div class="sbNote">Berechnet aus den eingetragenen Ergebnissen und den EHV-Daten. Spieler werden nicht genannt, nur Rückennummern.</div>`;
}
function openBilanz(team){
  const m=document.getElementById("bilanzModal"), c=document.getElementById("bilanzModalContent"); if(!m||!c)return;
  document.getElementById("bilanzModalTitle").textContent="Saisonbilanz "+teamName(team);
  if(c.dataset.team!==team)sbTabLast="ov";
  c.innerHTML=bilanzHtml(team); c.dataset.team=team;
  const S=seasonStats(team);
  c.querySelectorAll("[data-rep]").forEach(b=>b.onclick=()=>{const x=S.reports[Number(b.dataset.rep)];closeBilanz();openMatchDetails(x.g,true)});
  c.querySelector("[data-print]")?.addEventListener("click",()=>printReports(team));
  c.querySelector("[data-tabimg]")?.addEventListener("click",()=>{closeBilanz();instaOpen({team},"table",true)});
  m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  try{sbBindTabs(c);const bx=m.querySelector(".matchModalBox");if(bx)bx.scrollTop=0}catch(e){console.warn(e)}
  trackAnalyticsEvent("saisonbilanz_opened",{team:teamName(team)});
}
function closeBilanz(){const m=document.getElementById("bilanzModal");if(!m)return;m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow=""}
/* Saisonrückblick: alle veröffentlichten Berichte eines Teams in einem Druckfenster (dort „Als PDF speichern“) */
function printReports(team){
  const S=seasonStats(team); if(!S.reports.length)return;
  const w=window.open("","_blank");
  if(!w){alert("Das Druckfenster konnte nicht geöffnet werden. Bitte Pop-ups für die App erlauben.");return}
  const logo=new URL("logo.png",window.location.href).href, list=S.reports.slice().reverse();
  const body=`<div class="h"><div class="hl"><img src="${logo}" alt=""><div><div class="t">Saisonrückblick ${esc(teamName(team))}</div><div class="s">${esc(APP_CFG.club)} · Saison ${esc(APP_CFG.season)} · ${sbRec(S.tot)} · Tore ${S.tot.gf}:${S.tot.ga}</div></div></div><div class="d">Stand ${new Date().toLocaleDateString("de-DE")}</div></div>`+
    list.map(x=>`<article><div class="m">${esc(fmtDate(x.g))} · ${esc(x.g.home)} – ${esc(x.g.away)} · <b>${x.r.hs}:${x.r.as}</b></div><h2>${esc(x.rep.title||"")}</h2>${String(x.rep.text||"").split(/\n\s*\n/).map(p=>`<p>${esc(p)}</p>`).join("")}</article>`).join("")+
    `<div class="f">${esc(APP_CFG.club)} · ${esc(APP_CFG.age)} · Saison ${esc(APP_CFG.season)} · App: JAZM</div>`;
  w.document.open();
  w.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Saisonrückblick ${esc(teamName(team))}</title><style>
    @page{size:A4 portrait;margin:16mm 16mm 14mm}
    html,body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}
    .h{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #071b33;padding-bottom:8px;margin-bottom:14px}
    .hl{display:flex;align-items:center;gap:12px}.hl img{width:64px;height:64px;object-fit:contain}
    .t{font-size:19pt;font-weight:800}.s{font-size:9.5pt;color:#555;margin-top:2px}.d{font-size:8pt;color:#555}
    article{break-inside:avoid-page;margin:0 0 9mm;padding-bottom:6mm;border-bottom:1px solid #ccc}
    .m{font-size:9pt;color:#555}h2{font-size:14pt;margin:3pt 0 6pt}p{font-size:10.5pt;line-height:1.45;margin:0 0 6pt}
    .f{font-size:8pt;color:#777;margin-top:8mm}
  </style></head><body>${body}</body></html>`);
  w.document.close(); w.focus();
  w.onload=()=>setTimeout(()=>w.print(),150);
}
/* Direktvergleich mit einem Gegner (alle eigenen Spiele mit Ergebnis) */
function h2hHtml(gs){
  const P=gs.slice().sort((a,b)=>dt(a)-dt(b)).map(g=>({g,r:resInfo(g)})).filter(x=>x.r&&!x.g.cancelled);
  if(!P.length)return "";
  const word=OUTW;
  const by={}; P.forEach(x=>{const t=x.g.team;by[t]=by[t]||{w:0,d:0,l:0,gf:0,ga:0};by[t][x.r.o]++;by[t].gf+=x.r.gs;by[t].ga+=x.r.os});
  return `<div class="h2hBox"><div class="h2hHead">Direktvergleich</div>${Object.keys(by).sort().map(t=>`<div class="h2hSum"><span class="opponentTeamBadge ${t}">${esc(teamName(t))}</span><b>${sbRec(by[t])}</b><small>Tore ${by[t].gf}:${by[t].ga}</small></div>`).join("")}
    <ul class="h2hList">${P.map(x=>`<li><span>${esc(fmtDate(x.g))} · ${isHome(x.g)?"Heim":"Ausw."}${Object.keys(by).length>1?" · "+esc(x.g.team):""}</span><b>${x.r.gs}:${x.r.os}</b><i class="lastPill ${x.r.o}">${outLabel(x.r)}</i></li>`).join("")}</ul></div>`;
}

window.applyResults=function(){
  if(typeof renderList==="function"){
    const active=document.querySelector(".scheduleFilters .filter.active");
    renderList(active?active.dataset.filter:"all");
  }
  renderOpponents(); renderLast(); renderTeamTiles();
  const homeNext=games.filter(x=>dt(x)>=new Date()).sort((a,b)=>dt(a)-dt(b))[0];
  if(homeNext){
    const badge=resultBadge(homeNext); const meta=document.getElementById("nextMeta");
    if(meta && badge && !meta.innerHTML.includes("resultBadge")) meta.innerHTML += "<br>"+badge;
  }
};
  function renderOpponents(){
  const root=document.getElementById("opponentsList");
  if(!root)return;

  const groups=new Map();

  games.forEach(g=>{
    const name=opponent(g);
    if(!groups.has(name))groups.set(name,[]);
    groups.get(name).push(g);
  });

  const search=(document.getElementById("opponentSearch")?.value||"").trim().toLocaleLowerCase("de-DE");
  const arr=[...groups.entries()].filter(([name,gs])=>!search||name.toLocaleLowerCase("de-DE").includes(search)||gs.some(g=>!isHome(g)&&(g.stadium+" "+address(g)).toLocaleLowerCase("de-DE").includes(search))).sort((a,b)=>a[0].localeCompare(b[0],"de"));

  document.getElementById("opponentsCount").textContent=arr.length+" Gegner";

  root.innerHTML=arr.map(([name,gs])=>{
    const sorted=gs.slice().sort((a,b)=>dt(a)-dt(b));

    // Für Entfernung und Route immer die tatsächliche Auswärtshalle
    // dieses Gegners verwenden. So landet die Route nicht versehentlich
    // wieder in Bergkamen, wenn das nächste Spiel ein Heimspiel ist.
    const awayGame=sorted.find(g=>!isHome(g));
    const routeGame=awayGame||sorted.find(g=>dt(g)>=new Date())||sorted[sorted.length-1];

    const teamSet=[...new Set(gs.map(g=>g.team))].sort();
    const teamClasses=teamSet.length===1?" opponent"+teamSet[0]:"";
    const teamBadges=teamSet.map(t=>`<span class="opponentTeamBadge ${t}">${teamName(t)}</span>`).join("");

    return '<article class="opponentCard'+teamClasses+'" data-opponent="'+esc(name)+'"'+(teamSet.length===1?' data-team="'+teamSet[0]+'"':'')+'>'+
      logoHtml(name,"opponentLogo")+
      '<div class="opponentCardInfo">'+
      '<div class="opponentCardName">'+esc(name)+'</div>'+
      '<div class="opponentCardMeta"><span>'+gs.length+" "+(gs.length===1?"Spiel":"Spiele")+'</span>'+teamBadges+'<span>·</span>'+distanceHtml(routeGame.stadium)+'</div>'+
      (s=>s?'<div class="gzStandRow">'+s+standFormHtml(teamSet[0],name)+'</div>':'')(standHtml(teamSet[0],name,true))+
      '</div>'+
      '<button class="action opponentRoute" type="button">'+ic("pin")+'Route</button>'+
      '</article>';
  }).join("");

  root.querySelectorAll(".opponentCard").forEach(card=>{
    const name=card.dataset.opponent;
    const gs=groups.get(name)||[];

    card.onclick=e=>{
      if(e.target.closest(".opponentRoute"))return;
      openOpponentDetails(name,gs);
    };

    const sorted=gs.slice().sort((a,b)=>dt(a)-dt(b));
    const awayGame=sorted.find(g=>!isHome(g));
    const routeGame=awayGame||sorted.find(g=>dt(g)>=new Date())||sorted[sorted.length-1];

    card.querySelector(".opponentRoute").onclick=e=>{
      e.stopPropagation();
      route(routeGame);
    };
  });
  }

  /* 1.22.0: Gegner-Karte – alle Gegner an ihren Spielorten (Hallen), Filter Alle / U15 A / U15 B.
     Leaflet + OpenStreetMap werden erst nach „Karte laden“ geholt (Datenschutz); die Entscheidung kann gemerkt werden.
     Koordinaten: ungefähre Lage der Eishallen (Schlüssel wie in rinkAddresses). */
  /* RINK_GEO steht seit 1.43.0 oben (auch für die Cloud Function weatherForecast) */
  /* Gegner, die auf der Karte an ihrer eigenen Halle stehen sollen, auch wenn sie ihr Heimspiel woanders austragen */
  const OPP_HOME={"ESC Darmstadt":"Darmstadt"};
  const OM={map:null,layer:null,filter:"all",mode:"list",loading:null,pts:[],size:""};
  /* Ausschnitt so wählen, dass alle sichtbaren Hallen draufpassen – so nah wie möglich.
     Nur bei sichtbarer Karte (Größe > 0), sonst rechnet Leaflet die Weltkarte aus. */
  function omFit(){
    if(!OM.map||!OM.pts.length)return;
    const box=document.getElementById("oppMap"); if(!box||!box.clientWidth||!box.clientHeight)return;
    OM.map.invalidateSize({animate:false});
    OM.map.fitBounds(L.latLngBounds(OM.pts),{padding:[26,26],maxZoom:11,animate:false});
  }
  function omLoadLeaflet(){
    if(window.L)return Promise.resolve();
    if(OM.loading)return OM.loading;
    OM.loading=new Promise((res,rej)=>{
      const css=document.createElement("link");css.rel="stylesheet";css.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(css);
      const sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";sc.onload=()=>res();sc.onerror=()=>{OM.loading=null;rej(new Error("Leaflet"))};document.head.appendChild(sc);
    });
    return OM.loading;
  }
  function omGroups(){
    /* Spielort je Gegner = Halle seines Auswärtsspiels (wie Route und Entfernung in der Liste) */
    const by=new Map();
    games.forEach(g=>{const n=opponent(g);if(!by.has(n))by.set(n,[]);by.get(n).push(g);});
    const rinks=new Map();
    by.forEach((gs,name)=>{
      const sorted=gs.slice().sort((a,b)=>dt(a)-dt(b)), away=sorted.find(g=>!isHome(g))||sorted[0];
      const st=OPP_HOME[name]||away.stadium, teams=[...new Set(gs.map(g=>g.team))].sort();
      const travel=gs.some(g=>!isHome(g)&&g.stadium===st);
      if(!RINK_GEO[st])return;
      if(!rinks.has(st))rinks.set(st,{st,g:{...away,stadium:st},list:[],travel:false});
      const r=rinks.get(st); r.travel=r.travel||travel;
      r.list.push({name,gs,teams,elsewhere:!travel&&st!=="Bergkamen"});
    });
    if(!rinks.has("Bergkamen"))rinks.set("Bergkamen",{st:"Bergkamen",g:{stadium:"Bergkamen"},list:[],travel:false});
    return [...rinks.values()];
  }
  function omRender(){
    if(!OM.map||!window.L)return;
    OM.map.closePopup();
    if(OM.layer)OM.layer.remove();
    OM.layer=L.layerGroup().addTo(OM.map);
    const f=OM.filter, pts=[], marks=[];
    const nq=t=>String(t||"").toLocaleLowerCase("de-DE").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss");
    const q=nq((document.getElementById("opponentSearch")?.value||"").trim());
    omGroups().forEach(r=>{
      const isHomeRink=r.st==="Bergkamen";
      const placeHit=!!q&&nq(r.st+" "+address(r.g)+(isHomeRink?" grizzlys esv bergkamen heimhalle":"")).includes(q);
      const list=r.list.filter(x=>(f==="all"||x.teams.includes(f))&&(!q||placeHit||nq(x.name).includes(q)));
      if(q&&!list.length&&!placeHit)return;
      if(!list.length&&!isHomeRink)return;
      const ts=[...new Set(list.flatMap(x=>x.teams))].sort().join("");
      const one=h=>{const m=String(h).match(/<img[^>]*>/);return m?m[0]:h};
      const logos=isHomeRink?one(teamLogoHtml("ESV Grizzlys Bergkamen","omLogo")):list.slice(0,2).map(x=>one(logoHtml(x.name,"omLogo"))).join("");
      const cnt=!isHomeRink&&list.length>2?`<span class="omCount">${list.length}</span>`:"";
      const icon=L.divIcon({className:"omIcon",html:`<div class="omPin ${isHomeRink?"home":"t"+(ts||"A")}">${logos}${cnt}</div>`,iconSize:[0,0],iconAnchor:[0,0],popupAnchor:[0,-24]});
      const ll=RINK_GEO[r.st]; pts.push(ll);
      const km=distanceForStadium(r.st);
      const teamsHtml=list.map((x,i)=>`<div class="omTeam">${logoHtml(x.name,"opponentLogo")}<div><b>${esc(x.name)}</b>${x.teams.map(t=>`<span class="opponentTeamBadge ${t}">${teamName(t)}</span>`).join("")}</div><button type="button" data-omi="${i}">Spiele</button></div>`).join("");
      const html=`<div class="omPop"><h4>${isHomeRink?SI("home")+" Unsere Halle · ":""}${esc(r.st==="Grefeath"?"Grefrath":r.st)}</h4><div class="omAddr">${esc(address(r.g))}${km?" · "+km+" km":""}</div>${teamsHtml}${list.some(x=>x.elsewhere)?`<div class="omHomeNote">Heimspiel wird nicht hier ausgetragen – beide Spiele finden in Bergkamen statt.</div>`:""}${isHomeRink||!r.travel?"":`<button type="button" class="omRoute">${SI("pin")} Route</button>`}</div>`;
      const mk=L.marker(ll,{icon,zIndexOffset:isHomeRink?1000:0,title:isHomeRink?"Bergkamen":list.map(x=>x.name).join(", ")}).addTo(OM.layer);
      mk.bindPopup(html,{maxWidth:280,autoPanPadding:[20,20]}); marks.push(mk);
      mk.on("popupopen",e=>{const el=e.popup.getElement();if(!el)return;
        el.querySelectorAll("[data-omi]").forEach(b=>b.onclick=()=>{const x=list[Number(b.dataset.omi)];OM.map.closePopup();openOpponentDetails(x.name,x.gs)});
        const rb=el.querySelector(".omRoute");if(rb)rb.onclick=()=>route(r.g);});
    });
    OM.pts=pts; omFit();
    const info=document.getElementById("oppMapInfo");
    if(info){info.hidden=!q;info.textContent=q?(marks.length?(marks.length===1?"1 Treffer":marks.length+" Treffer"):"Kein Gegner gefunden – anderer Name oder Ort?"):"";}
    if(q&&marks.length===1)setTimeout(()=>{try{marks[0].openPopup()}catch(e){}},80);
  }
  async function omShowMap(){
    const ask=document.getElementById("oppMapAsk"), box=document.getElementById("oppMap"), btn=document.getElementById("oppMapLoad");
    if(btn){btn.disabled=true;btn.textContent="Lädt …";}
    try{await omLoadLeaflet();}catch(e){if(btn){btn.disabled=false;btn.textContent="Erneut versuchen";}return;}
    ask.hidden=true; box.hidden=false;
    if(!OM.map){
      OM.map=L.map(box,{zoomControl:true,attributionControl:true,scrollWheelZoom:false,zoomSnap:0.25,zoomDelta:0.5}).setView([51.35,7.2],8);
      /* Wird die Karte sichtbar oder ändert sich ihre Größe (Reiterwechsel, Drehen), neu einpassen */
      if(window.ResizeObserver)new ResizeObserver(()=>{const k=box.clientWidth+"x"+box.clientHeight;if(k===OM.size)return;OM.size=k;if(box.clientWidth&&box.clientHeight)omFit();}).observe(box);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(OM.map);
    }
    setTimeout(()=>{OM.map.invalidateSize();omRender();},60);
  }
  let omT; window.omSearch=()=>{if(OM.mode!=="map"||!OM.map)return;clearTimeout(omT);omT=setTimeout(omRender,180);};
  function omSetMode(m){
    OM.mode=m;
    document.querySelectorAll(".oppModes [data-om]").forEach(b=>{const on=b.dataset.om===m;b.classList.toggle("active",on);b.setAttribute("aria-selected",on?"true":"false");});
    const wrap=document.getElementById("oppMapWrap"); if(wrap)wrap.hidden=m!=="map";
    ["opponentsList"].forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=m==="map";});
    
    const sn=document.getElementById("standNote"); if(sn&&m==="map")sn.hidden=true;
    if(m==="map"){let ok=false;try{ok=localStorage.getItem("grizzlysMapOk")==="1"}catch(e){}
      if(ok||OM.map)omShowMap();}
    try{localStorage.setItem("grizzlysOppMode",m)}catch(e){}
  }
  document.querySelectorAll(".oppModes [data-om]").forEach(b=>b.addEventListener("click",()=>omSetMode(b.dataset.om)));
  document.querySelectorAll(".oppMapFilter [data-mf]").forEach(b=>b.addEventListener("click",()=>{OM.filter=b.dataset.mf;document.querySelectorAll(".oppMapFilter [data-mf]").forEach(x=>x.classList.toggle("on",x===b));omRender();}));
  document.getElementById("oppMapLoad")?.addEventListener("click",()=>{if(document.getElementById("oppMapRemember")?.checked){try{localStorage.setItem("grizzlysMapOk","1")}catch(e){}}omShowMap();});
  try{if(localStorage.getItem("grizzlysOppMode")==="map")setTimeout(()=>omSetMode("map"),0);}catch(e){}
  function openOpponentDetails(name,gs){
  const modal=document.getElementById("opponentModal");
  const content=document.getElementById("opponentModalContent");

  const sorted=gs.slice().sort((a,b)=>dt(a)-dt(b));

  document.getElementById("opponentModalTitle").textContent=name;

  const cardInfo=sorted.map(g=>{const res=resInfo(g);return {g,res,past:!!res||dt(g).getTime()+2*3600000<Date.now()}});
  content.innerHTML=
    '<div class="small" style="margin-bottom:10px">'+gs.length+" "+(gs.length===1?"Spiel":"Spiele")+" gegen diesen Gegner</div>"+h2hHtml(gs)+
    '<div class="opponentGames gzOppGames">'+
    cardInfo.map(x=>'<article class="card gz2 '+("team"+x.g.team)+' gz3" data-team="'+esc(x.g.team)+'" data-date="'+esc(x.g.date)+'">'+gameCardHtml(x.g,x.past,x.res)+'</article>').join("")+
    '</div>';
  content.querySelectorAll(".gzOppGames .card").forEach((card,i)=>{
    const {g}=cardInfo[i];
    g3Bind(card,g);g3SetOpen(card,cardInfo.length===1);
    hwDecorate(card,g);
  });

  modal.hidden=false;
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}

function closeOpponentDetails(){
  const modal=document.getElementById("opponentModal");
  modal.hidden=true;
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
/* Kurzname nur für die Anzeige in den Kacheln – die Spielgemeinschaft bleibt erkennbar. */
function shortTeam(name){
  const n=String(name);
  if(/grizzlys/i.test(n)){ if(/young cats/i.test(n))return "Grizzlys / Young Cats"; if(/1b/i.test(n))return "Grizzlys B"; return "Grizzlys"; }
  return n;
}
function standPeriodsShort(g){
  const games=standings[g.team]&&standings[g.team].games; if(!Array.isArray(games))return "";
  const h=standRow(g.team,g.home), a=standRow(g.team,g.away); if(!h||!a)return "";
  const x=games.find(x=>x.d===g.date&&x.h===h.n&&x.a===a.n); if(!x||x.p.length<3)return "";
  const res=window.resultFor&&window.resultFor(g);
  if(!res||Number(res.homeScore)!==x.hs||Number(res.awayScore)!==x.as)return "";
  return '<span class="gzPer" title="Drittelergebnisse">'+x.p.map(esc).join(" · ")+(x.so?" · n.P.":x.ot?" · n.V.":"")+'</span>';
}
/* v66: Spielkarten zum Aufklappen – Datumsblock links, Details als Blöcke.
   g3OpenKey: null = Standard (nächstes Spiel offen), "" = alle zu, sonst das offene Spiel. */
let g3OpenKey=null;
function g3Key(g){return g.date+"_"+g.time+"_"+g.team}
function standPeriodsData(g){
  const games=standings[g.team]&&standings[g.team].games; if(!Array.isArray(games))return null;
  const h=standRow(g.team,g.home), a=standRow(g.team,g.away); if(!h||!a)return null;
  const x=games.find(x=>x.d===g.date&&x.h===h.n&&x.a===a.n); if(!x||x.p.length<3)return null;
  const res=window.resultFor&&window.resultFor(g);
  if(!res||Number(res.homeScore)!==x.hs||Number(res.awayScore)!==x.as)return null;
  return x;
}
function g3TeamTile(team,name){
  const r=standRow(team,name); if(!r)return "";
  const gd=Number(r.gd)||0, gdTxt=gd>0?"+"+gd:gd<0?"−"+Math.abs(gd):"±0";
  const title="Tabelle: Platz "+r.r+" · "+r.gp+" "+(r.gp===1?"Spiel":"Spiele")+" · "+r.p+" Punkte · Tordifferenz "+gdTxt;
  return `<div class="g3Tile"><small>${esc(shortTeam(name))}</small>`+(r.gp?`<div class="g3Pl" title="${esc(title)}"><b>${esc(r.r)}.</b><span>${esc(r.gp)} Sp · ${esc(r.p)} Pkt · ${gdTxt}</span></div>`:`<div class="g3Pl"><span>noch kein Spiel</span></div>`)+standFormHtml(team,name)+`</div>`;
}
/* 1.26.0: Live-Ticker – Hilfen für die Anzeige */
function liveFor(g){const x=(window.liveGames||{})[g.date+"_"+String(g.time).replace(/:/g,"")+"_"+g.team];return x&&x.status&&x.status!=="pre"?x:null}
function liveLabel(x){if(!x)return "";if(x.status==="final")return "Spielende";
  if(x.status==="pause")return x.period?"Pause nach dem "+x.period+". Drittel":"Pause";
  const p=Number(x.period)||0;return (p>3?"Verlängerung":p?p+". Drittel":"läuft")+(x.clock?" · "+x.clock:"")}
function liveGoalsHtml(g,x){
  const goals=(x&&x.goals)||[]; if(!goals.length)return "";
  const home=isHome(g), me=home?"h":"a";
  const row=q=>{const our=q.side===me, sc=String(q.score||"");
    const tags=[q.pp?"Überzahl":"",q.sh?"Unterzahl":"",q.en?"leeres Tor":"",q.ps?"Penalty":""].filter(Boolean);
    const who=q.nr?"Nr. "+esc(q.nr)+(q.ast&&q.ast.length?" <span class=\"lgAst\">(Nr. "+q.ast.map(esc).join(", Nr. ")+")</span>":""):"";
    return `<li class="${our?"our":"opp"}"><span class="lgMin">${Math.floor((Number(q.t)||0)/60)+1}.</span><b class="lgSc">${esc(sc)}</b><span class="lgWho">${our?"Grizzlys":esc(shortTeam(opponent(g)))}${who?" · "+who:""}${tags.length?` <i>${esc(tags.join(", "))}</i>`:""}</span></li>`};
  return `<div class="g3Tile g3Goals"><div class="lgHead">Torfolge<span>Minute · Spielstand</span></div><ol>${goals.map(row).join("")}</ol></div>`;
}
window.liveFor=liveFor;
/* ===== 1.28.0: Fan-Tipp ===== */
const FT_MIN=3;
function ftKey(g){return g.date+"_"+String(g.time).replace(/:/g,"")+"_"+g.team} /* Auswertung erst ab so vielen Tipps zeigen */
function ftMine(){try{return JSON.parse(localStorage.getItem("grizzlysFanTips")||"{}")}catch(e){return{}}}
function ftOpen(g){return !g.cancelled&&!resInfo(g)&&Date.now()<dt(g).getTime()}
function ftTile(g){
  if(g.cancelled)return "";
  const key=ftKey(g), open=ftOpen(g), res=resInfo(g), S=(window.ftStats||{})[key], mine=ftMine()[key];
  if(!open&&!res&&!S&&!mine)return "";
  return `<div class="g3Tile ftTile" data-ft="${esc(key)}">${ftInner(g)}</div>`;
}
function ftInner(g){
  const key=ftKey(g), open=ftOpen(g), res=resInfo(g), S=(window.ftStats||{})[key], mine=ftMine()[key], home=isHome(g);
  const pct=v=>S&&S.n?Math.round(v/S.n*100):0;
  const top=S&&S.scores?Object.entries(S.scores).sort((a,b)=>b[1]-a[1])[0]:null;
  const head=`<div class="ftHead"><b>🎯 Fan-Tipp</b><span>${open?"anonym · bis zum Bully":"Tipps geschlossen"}</span></div>`;
  const bars=S&&S.n>=FT_MIN?`<div class="ftBars"><div class="ftBar w" style="--p:${pct(S.w)}%"><span>Sieg</span><b>${pct(S.w)} %</b></div>${S.d>0?`<div class="ftBar d" style="--p:${pct(S.d)}%"><span>Gleichstand</span><b>${pct(S.d)} %</b></div>`:""}<div class="ftBar l" style="--p:${pct(S.l)}%"><span>Niederlage</span><b>${pct(S.l)} %</b></div></div><div class="ftMeta">${S.n} Tipps${top?` · häufigster Tipp <b>${esc(top[0])}</b>`:""}</div>`
    :S?`<div class="ftMeta">${S.n?S.n+" "+(S.n===1?"Tipp":"Tipps")+" – die Auswertung gibt es ab "+FT_MIN+" Tipps.":"Noch keine Tipps – sei der Erste!"}</div>`:`<div class="ftMeta">Tipps werden geladen …</div>`;
  if(res){
    const hit=S&&S.scores?(S.scores[res.hs+":"+res.as]||0):0, tend=S?S[res.o]:0;
    let my="";
    if(mine){const [h,a]=mine.split(":").map(Number),us=home?h:a,them=home?a:h,o=us>them?"w":us<them?"l":"d";
      my=`<div class="ftMine ${mine===res.hs+":"+res.as?"exact":o===res.o?"ok":"no"}">Dein Tipp ${esc(mine)} · ${mine===res.hs+":"+res.as?"🎯 genau richtig!":o===res.o?"✓ Tendenz richtig":"daneben"}</div>`}
    return head+(S&&S.n?`<div class="ftMeta">${S.n} Tipps · <b>${hit}</b> genau richtig · ${pct(tend)} % hatten den Ausgang richtig</div>`:`<div class="ftMeta">Für dieses Spiel gab es keine Tipps.</div>`)+my;
  }
  if(!open)return head+(mine?`<div class="ftMine">Dein Tipp ${esc(mine)}</div>`:"")+bars;
  if(mine&&!window.__ftEdit?.[key])return head+`<div class="ftMine">Dein Tipp <b>${esc(mine)}</b><button type="button" class="ftLink" data-ft-edit>ändern</button></div>`+bars;
  const v=(mine||"0:0").split(":").map(Number);
  const side=(n,i)=>`<div class="ftSide"><span class="ftTeam">${esc(shortTeam(n))}</span><div class="ftStep"><button type="button" data-ft-step="${i}" data-d="-1" aria-label="weniger Tore für ${esc(shortTeam(n))}">−</button><input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" class="ftIn" data-ft-v="${i}" value="${v[i]}" aria-label="Tore für ${esc(shortTeam(n))}"><button type="button" data-ft-step="${i}" data-d="1" aria-label="mehr Tore für ${esc(shortTeam(n))}">+</button></div></div>`;
  return head+`<div class="ftPick">${side(g.home,0)}<span class="ftColon">:</span>${side(g.away,1)}</div><button type="button" class="ftSend" data-ft-send>Tipp abgeben</button>`+(S&&S.n?bars:"");
}
const FT_MAX=40; /* 1.52.1: Tipps bis 40 Tore (vorher 20) */
function ftRefresh(key){
  const g=games.find(x=>ftKey(x)===key); if(!g)return;
  document.querySelectorAll(`.ftTile[data-ft="${CSS.escape(key)}"]`).forEach(t=>{t.innerHTML=ftInner(g);ftBind(t,g)});
}
function ftBind(t,g){
  const key=ftKey(g);
  t.onclick=e=>e.stopPropagation();
  t.querySelectorAll("[data-ft-step]").forEach(b=>b.onclick=()=>{const i=b.dataset.ftStep,el=t.querySelector(`[data-ft-v="${i}"]`);el.value=Math.max(0,Math.min(FT_MAX,(Number(el.value)||0)+Number(b.dataset.d)))});
  /* 1.52.1: Tore auch direkt eintippen (0–40) */
  t.querySelectorAll("input[data-ft-v]").forEach(i=>{let sel=false;i.onfocus=()=>{i.select();sel=true};i.onpointerup=e=>{if(sel){e.preventDefault();sel=false}};
    i.oninput=()=>{i.value=i.value.replace(/\D/g,"").slice(0,2)};
    i.onblur=()=>{i.value=String(Math.max(0,Math.min(FT_MAX,Number(i.value)||0)))};
    i.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();i.blur()}}});
  t.querySelector("[data-ft-edit]")?.addEventListener("click",()=>{window.__ftEdit=window.__ftEdit||{};window.__ftEdit[key]=true;ftRefresh(key)});
  t.querySelector("[data-ft-send]")?.addEventListener("click",async e=>{
    const b=e.currentTarget, hs=Math.max(0,Math.min(FT_MAX,Number(t.querySelector('[data-ft-v="0"]').value)||0)), as=Math.max(0,Math.min(FT_MAX,Number(t.querySelector('[data-ft-v="1"]').value)||0));
    if(!ftOpen(g)){ftRefresh(key);return}
    if(hs===as){let w=t.querySelector(".ftWarn");if(!w){w=document.createElement("div");w.className="ftWarn";b.before(w)}
      w.textContent="Ein Unentschieden gibt es nicht – bitte einen Sieger tippen. Bei einem Penaltyschießen zählt der Endstand mit einem Tor Vorsprung (z. B. 3:2).";return}
    b.disabled=true;b.textContent="Wird gespeichert …";
    let ok=true;try{await window.ftSave(g,key,hs,as)}catch(err){ok=false;console.warn(err)}
    const m=ftMine();m[key]=hs+":"+as;try{localStorage.setItem("grizzlysFanTips",JSON.stringify(m))}catch(err){}
    if(window.__ftEdit)delete window.__ftEdit[key];
    trackAnalyticsEvent("fan_tip",{team:teamName(g.team)});
    if(ok)setTimeout(()=>window.ftLoad(key).then(()=>ftRefresh(key)),2500);
    ftRefresh(key);
    if(!ok){const x=document.querySelector(`.ftTile[data-ft="${CSS.escape(key)}"] .ftMine`);if(x)x.insertAdjacentHTML("beforeend",window.GRIZZLYS_TEST?' <span class="ftNote">(Test-App: nicht gespeichert)</span>':' <span class="ftNote">(konnte nicht gesendet werden)</span>')}
  });
}
/* Kachel beim Aufklappen füllen und Auswertung laden */
function ftActivate(card,g){const t=card.querySelector(".ftTile");if(!t)return;ftBind(t,g);const key=ftKey(g);
  if(window.ftLoad&&!(window.__ftLoaded||{})[key]){window.__ftLoaded=window.__ftLoaded||{};window.__ftLoaded[key]=1;window.ftLoad(key).then(()=>ftRefresh(key))}}
function gameCardHtml(g,past,res,detail=false,label=""){
  const home=isHome(g), word=OUTW, d=dt(g), lv=liveFor(g);
  const logo=(name,cls)=>/grizzlys/i.test(name)?teamLogoHtml(name,cls):logoHtml(name,cls);
  const wd=d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".",""), mon=d.toLocaleDateString("de-DE",{month:"short"}).replace(".","");
  const date=`<div class="g3Date"><span>${esc(wd)}</span><b>${String(d.getDate()).padStart(2,"0")}.</b><span>${esc(mon)}</span><i>${esc(g.time)}</i></div>`;
  const head=`<div class="g3Head"><div class="gcLeft"><span class="teamBadge">${esc(teamName(g.team))}</span>${g.cancelled?`<span class="cxBadge${g.postponed?" pp":""}">${g.postponed?"Verlegt · Termin offen":"Abgesagt"}</span>`:""}<span class="homeaway">${home?ic("home")+"Heim":ic("away")+"Auswärts"}</span>${label?`<span class="nextBadge">${esc(label)}</span>`:""}${hwBadge(g)}${xmBadge(g)}${hpBadge(g)}</div>${detail?"":'<span class="g3Tog" aria-hidden="true"><span class="g3TogTxt">Details</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6l6-6"/></svg></span>'}</div>`;
  const mid=res?`<div class="gzMid"><b class="gzScore"><i>${res.hs}</i><em>:</em><i>${res.as}</i></b><span class="lastPill ${res.o}">${outLabel(res)}</span></div>`
               :lv?`<div class="gzMid gzLive"><b class="gzScore">${esc(String(lv.hs))}:${esc(String(lv.as))}</b><span class="lastPill live${lv.status==="final"?" fin":""}">${lv.status==="final"?"Endstand · vorläufig":`<i class="liveDot"></i>Live`}</span>${lv.status==="final"?"":`<span class="liveClock">${esc(liveLabel(lv))}</span>`}</div>`
               :`<div class="gzMid">${g.cancelled?`<span class="lastPill cx${g.postponed?" pp":""}">${cxW(g)}</span>`:past?'<span class="lastPill none">Ergebnis folgt</span>':'<span class="vs">VS</span>'}</div>`;
  const match=`<div class="gcMatch"><div class="gcSide">${logo(g.home,"opponentLogo")}<span>${esc(shortTeam(g.home))}</span></div>${mid}<div class="gcSide">${logo(g.away,"opponentLogo")}<span>${esc(shortTeam(g.away))}</span></div></div>`;
  const per=res?standPeriodsData(g):(lv&&lv.periods&&lv.periods.length?{p:lv.periods.map(v=>v[0]+":"+v[1]),ot:lv.ot,so:lv.so}:null);
  const thirds=per?`<div class="g3Tile g3Thirds">`+per.p.map((v,i)=>`<div><small>${i+1}. Drittel</small><b>${esc(v)}</b></div>`).join("")+(per.so||per.ot?`<div><small>Ende</small><b>${per.so?"n.P.":"n.V."}</b></div>`:"")+`</div>`:"";
  const tiles=g3TeamTile(g.team,g.home)+g3TeamTile(g.team,g.away);
  const venue=past?`<div class="g3Tile g3Venue g3VenuePast"><div><span>${g.postponed?"Spielort":"Gespielt in"}</span><b>${esc(g.stadium)}</b></div></div>`
    :home?`<div class="g3Tile g3Venue"><div><span>Heimspiel</span><b>${esc(g.stadium)}</b></div></div>` /* 1.28.1: bei Heimspielen keine Route */
    :`<div class="g3Tile g3Venue"><div><b>${esc(g.stadium)}</b><span>${esc(address(g))}${(km=>km?" · "+km+" km":"")(distanceForStadium(g.stadium))}</span></div><button class="g3Route route" type="button">${ic("pin")}Route</button></div>`;
  const btn=(c,icon,label)=>`<button class="g3Btn ${c}" type="button">${ic(icon)}${label}</button>`;
  const hasRep=!!(res&&!detail&&window.repFor&&window.repFor(g));
  const acts=`<div class="g3Acts">`+(past||g.cancelled?"":btn("cal","calplus","Termin")+btn("rem","bell","Erinnerung"))+(hasRep?btn("rep","file","Bericht"):"")+btn("share","share",res?"Ergebnis teilen":"Teilen")+`</div>`;
  return `<div class="g3Top">${date}<div class="g3Main">${head}${match}</div></div><div class="g3Det"><div class="g3In"><div class="g3Pad">${thirds}${lv&&lv.goals&&lv.goals.length?liveGoalsHtml(g,lv):res&&!g.cancelled?g3ScorersTile(g,res):""}${ftTile(g)}${hpTile(g)}${tiles?`<div class="g3Pair">${tiles}</div>`:""}${venue}${acts}</div></div></div>`;
}
function g3SetOpen(card,on){
  card.classList.toggle("open",on);
  if(on){const g=card.__g3g;if(g)try{ftActivate(card,g)}catch(e){console.warn(e)}}
  const d=card.querySelector(".g3Det"); if(d)d.inert=!on;
  const tx=card.querySelector(".g3TogTxt"); if(tx)tx.textContent=on?"Weniger":"Details";
  if(card.getAttribute("role")==="button")card.setAttribute("aria-expanded",on?"true":"false");
}
/* Startseite: „Nächstes Spiel“ (dauerhaft offen) und „Letztes Spiel“ (aufklappbar) als normale Spielkarten.
   Die bisherigen Kästen bleiben unsichtbar im Dokument, damit der restliche Code unverändert weiterläuft. */
const g3HomeOpen={}; /* gemerkter Zustand der beiden Startkarten */
/* 1.28.0: Countdown-Text bis zum Bully */
function g3Countdown(g){const ms=dt(g)-Date.now();if(ms<=0)return "Bully!";const m=Math.round(ms/60000),h=Math.floor(m/60),mm=m%60;
  if(m<60)return "Bully in "+m+" Min.";return "Bully in "+h+":"+String(mm).padStart(2,"0")+" Std."}
setInterval(()=>{document.querySelectorAll(".g3Band [data-cd]").forEach(sp=>{const [d,t]=sp.dataset.cd.split("T");const g=games.find(x=>x.date===d&&x.time===t);if(g)sp.textContent=g3Countdown(g)})},30000);
function g3HomeCard(id,g,label,defOpen){
  const old=document.querySelector(id==="g3HomeNext"?".next":id==="g3HomeNext2"?"#g3HomeNext":id==="g3HomeNext3"?"#g3HomeNext2":id==="g3HomeLast2"?"#g3HomeLast":id==="g3HomeLast3"?"#g3HomeLast2":"#lastGameCard"); if(!old)return;
  let el=document.getElementById(id);
  if(!el){el=document.createElement("article");el.id=id;if(/[23]$/.test(id))old.after(el);else old.parentNode.insertBefore(el,old)}
  if(!g){el.hidden=true;return}
  const res=resInfo(g), past=!!res||dt(g).getTime()+2*3600000<Date.now(), wasOpen=el.classList.contains("open");
  el.hidden=false;el.className="card gz2 gz3 g3Home "+("team"+g.team)+(id.startsWith("g3HomeLast")&&res?" res_"+res.o:"")+(g.cancelled?" isCx":"");el.dataset.team=g.team;
  el.innerHTML=gameCardHtml(g,past,res,false,"");
  {const word=OUTW;let sub="",k="";
   if(id.startsWith("g3HomeLast")){k=res?res.o:"none";sub=res?outLabel(res):"Ergebnis folgt"}
   else if(g.cancelled){k="cx";sub=g.postponed?"Verlegt – neuer Termin offen":"Abgesagt"}
   else{const d0=new Date();d0.setHours(0,0,0,0);const d1=dt(g);d1.setHours(0,0,0,0);const n=Math.round((d1-d0)/86400000);sub=n===0?"Heute":n===1?"Morgen":n>1?"in "+n+" Tagen":"";
     /* 1.28.0: Countdown in den letzten 24 Stunden, am Spieltag „Heute“-Band */
     if(id.startsWith("g3HomeNext")&&n===0){k="today";if(label==="Läuft gerade"){sub="● Live"}else{label="Heute";sub=g3Countdown(g)}}
     else if(id.startsWith("g3HomeNext")&&dt(g)-Date.now()<24*3600000)sub=g3Countdown(g)}
   el.insertAdjacentHTML("afterbegin",`<div class="g3Band ${k}">${esc(label)}${sub?`<span${id.startsWith("g3HomeNext")&&!g.cancelled&&/^Bully/.test(sub)?` data-cd="${esc(g.date+"T"+g.time)}"`:""}>${esc(sub)}</span>`:""}</div>`);
   /* Spieltag: Route und Halle direkt auf der Karte */
   if(k==="today"){const m=el.querySelector(".g3Main");if(m){m.insertAdjacentHTML("beforeend",`<div class="g3Today"><span class="g3TodayWhere"><small>${isHome(g)?"Heimspiel":"Auswärtsspiel"}</small>${esc(g.stadium)}</span>${isHome(g)?"":`<button type="button" class="g3Route g3TodayRoute"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>Route</button>`}</div>`);
     const rb=m.querySelector(".g3TodayRoute");if(rb)rb.onclick=e=>{e.stopPropagation();route(g)}}}}
  /* 1.9.1.131: Spielbericht vorhanden → Verweis direkt auf der Startkarte */
  const rp=id.startsWith("g3HomeLast")&&res&&window.repFor&&window.repFor(g);
  if(rp){const m=el.querySelector(".g3Main");if(m)m.insertAdjacentHTML("beforeend",`<button class="g3RepLink" type="button"><span class="g3RepIc">📝</span><span class="g3RepTx"><small>Spielbericht</small>${esc(rp.title||"Jetzt lesen")}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6"/></svg></button>`);
    const b=el.querySelector(".g3RepLink");if(b)b.onclick=e=>{e.stopPropagation();openMatchDetails(g,true)};
    const dup=el.querySelector(".g3Btn.rep");if(dup)dup.remove();}
  /* 1.29.0: großes „Nächstes Spiel“ (Puck, Countdown) und kompakte zweite Karte */
  if(id==="g3HomeNext"&&!past&&!g.cancelled){el.classList.add("g3Hero");
    const vs=el.querySelector(".gcMatch .vs");if(vs)vs.outerHTML='<span class="g3Puck" role="img" aria-label="gegen"><span class="pk3" aria-hidden="true"><i class="pkF"></i><i class="pkB"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i><i class="pkE"></i></span></span>';
    const m=el.querySelector(".g3Main");if(m&&dt(g)>Date.now())m.insertAdjacentHTML("beforeend",`<div class="g3Cd" data-cdt="${dt(g).getTime()}" aria-label="Countdown bis zum Bully">${dzCdHtml(dt(g).getTime())}</div>`);}
  else if(id==="g3HomeNext2"&&!past)el.classList.add("g3Compact");
  if(id.startsWith("g3HomeNext")&&!past&&!g.cancelled){const wx=wxLine(g);const m=el.querySelector(".g3Main");if(wx&&m)m.insertAdjacentHTML("beforeend",wx)} /* 1.43.0: Wetter am Spielort */
  g3Bind(el,g); g3SetOpen(el,id in g3HomeOpen?g3HomeOpen[id]:defOpen);
  hwDecorate(el,g);
}
function dzCdParts(t){let s=Math.max(0,Math.floor((t-Date.now())/1000));const d=Math.floor(s/86400);s-=d*86400;const h=Math.floor(s/3600);s-=h*3600;const m=Math.floor(s/60);return [d,h,m,s-m*60]}
function dzCdHtml(t){const p=dzCdParts(t),L=[p[0]===1?"Tag":"Tage","Std","Min","Sek"];return p.map((v,i)=>`<div><b>${i?String(v).padStart(2,"0"):v}</b><small>${L[i]}</small></div>`).join("")}
setInterval(()=>{if(document.hidden)return;document.querySelectorAll(".g3Cd[data-cdt]").forEach(box=>{const t=Number(box.dataset.cdt),p=dzCdParts(t),bs=box.querySelectorAll("b"),sm=box.querySelectorAll("small");
  p.forEach((v,i)=>{const tx=i?String(v).padStart(2,"0"):String(v);if(bs[i]&&bs[i].textContent!==tx){bs[i].textContent=tx;bs[i].classList.remove("tick");void bs[i].offsetWidth;bs[i].classList.add("tick")}});
  if(sm[0])sm[0].textContent=p[0]===1?"Tag":"Tage";})},1000);
/* 1.29.0: Logos „ploppen“ beim Antippen */
document.addEventListener("pointerdown",e=>{const l=e.target.closest&&e.target.closest(".opponentLogo,.lrLogo,.tcLogo,.gcSide img");if(!l)return;l.classList.remove("dzPop");void l.offsetWidth;l.classList.add("dzPop");setTimeout(()=>l.classList.remove("dzPop"),500)},{passive:true});
/* 1.21.1: „Letzte Ergebnisse“ – beide letzten Spiele kompakt in einer Karte (Variante A).
   Die beiden großen Karten g3HomeLast/g3HomeLast2 bleiben im Dokument (versteckt), damit der übrige Code unverändert läuft. */
/* 1.36.6: Torschützen-Kachel in den Spieldetails / aufgeklappten Spielkarten */
function lrScorerList(g,r){
  const x=ehvGameOf(g); if(!x||!Array.isArray(x.sc)||!x.sc.length)return null;
  if(Number(x.hs)!==Number(r.hs)||Number(x.as)!==Number(r.as))return null;
  const cnt=new Map(); x.sc.forEach(n=>cnt.set(n,(cnt.get(n)||0)+1));
  return {list:[...cnt],pp:Number(x.pp)||0,n:x.sc.length};
}
function g3ScorersTile(g,r){
  const d=lrScorerList(g,r); if(!d)return "";
  const chips=d.list.map(([n,k])=>`<span class="scChip">Nr. ${esc(n)}${k>1?`<b>×${k}</b>`:""}</span>`).join("");
  return `<div class="g3Tile g3Scorers"><div class="lgHead">Torschützen<span>Rückennummern${d.pp?" · "+d.pp+"× Überzahl":""}</span></div><div class="scChips">${chips}</div></div>`;
}
/* 1.36.5: Torschützen der Grizzlys (nur Rückennummern) aus dem EHV-Spielbericht – nur wenn der EHV-Endstand zum Ergebnis passt */
function lrScorers(g,r){
  const x=ehvGameOf(g); if(!x||!Array.isArray(x.sc)||!x.sc.length)return "";
  if(Number(x.hs)!==Number(r.hs)||Number(x.as)!==Number(r.as))return "";
  const cnt=new Map(); x.sc.forEach(n=>cnt.set(n,(cnt.get(n)||0)+1));
  const txt=[...cnt].map(([n,k])=>"Nr. "+esc(n)+(k>1?" ("+k+")":"")).join(" · ");
  return `<div class="lrSc" title="Torschützen der Grizzlys (Rückennummern, Quelle: EHV)"><span>🏒</span>${txt}</div>`;
}
function lrRender(list){
  const a=document.getElementById("g3HomeLast"); if(!a)return;
  let el=document.getElementById("lrCard");
  if(!el){el=document.createElement("section");el.id="lrCard";a.parentNode.insertBefore(el,a);}
  ["g3HomeLast","g3HomeLast2","g3HomeLast3"].forEach(id=>{const c=document.getElementById(id);if(c)c.hidden=true;}); /* 1.36.1: auch die dritte Karte – steht schon in „Letzte Ergebnisse“ */
  if(!list.length){el.hidden=true;return}
  const word=OUTW;
  const logo=n=>/grizzlys/i.test(n)?teamLogoHtml(n,"lrLogo"):logoHtml(n,"lrLogo");
  el.hidden=false; el.className="card lrCard";
  el.innerHTML=`<div class="lrHead">${list.length>1?"Letzte Ergebnisse":"Letztes Ergebnis"}<span>Antippen für Details</span></div>`+list.map((g,i)=>{
    const r=resInfo(g), d=dt(g), wd=d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".",""), mon=d.toLocaleDateString("de-DE",{month:"short"}).replace(".","");
    const rp=r&&window.repFor&&window.repFor(g);
    return `<div class="lrRow team${esc(g.team)}${r&&!g.cancelled?" o_"+r.o:""}" role="button" tabindex="0" data-i="${i}">
      <div class="lrDate">${esc(wd)}<b>${String(d.getDate()).padStart(2,"0")}.</b>${esc(mon)}</div>
      <div class="lrTeams"><span class="lrBadge">${esc(teamName(g.team))}</span>
        <div class="lrTeam">${logo(g.home)}<span>${esc(shortTeam(g.home))}</span></div>
        <div class="lrTeam">${logo(g.away)}<span>${esc(shortTeam(g.away))}</span></div>${r&&!g.cancelled?lrScorers(g,r)+msChips(g):""}</div>
      <div class="lrScore">${r?`<b><i>${r.hs}</i><em>:</em><i>${r.as}</i></b><span class="lrPill ${g.cancelled?"cx"+(g.postponed?" pp":""):r.o}">${g.cancelled?cxW(g):outLabel(r)}</span>`:liveFor(g)?(x=>`<b>${esc(String(x.hs))}:${esc(String(x.as))}</b><span class="lrPill live">${x.status==="final"?"vorläufig":"● Live"}</span>`)(liveFor(g)):`${window.resultsLoading&&!g.cancelled?'<span class="lrPill sk"></span>':`<span class="lrPill ${g.cancelled?"cx"+(g.postponed?" pp":""):"none"}">${g.cancelled?cxW(g):"Ergebnis folgt"}</span>`}`}</div>
      ${rp?`<button class="lrRep" type="button" data-rep="${i}"><span>📝</span><span><small>Spielbericht</small>${esc(rp.title||"Jetzt lesen")}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6"/></svg></button>`:""}
    </div>`;}).join("");
  el.querySelectorAll(".lrRow").forEach(row=>{const g=list[Number(row.dataset.i)];
    row.onclick=e=>{if(e.target.closest(".lrRep"))return;openMatchDetails(g)};
    row.onkeydown=e=>{if(e.target===row&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openMatchDetails(g)}};});
  el.querySelectorAll(".lrRep").forEach(b=>b.onclick=e=>{e.stopPropagation();openMatchDetails(list[Number(b.dataset.rep)],true)});
}
/* 1.26.0: Live-Ticker – Startseite (rote Live-Karte), Listen und offenes Spiel aktualisieren */
function liveBarRender(){
  const anchor=document.getElementById("lrCard")||document.getElementById("g3HomeNext")||document.querySelector(".next"); if(!anchor)return;
  let box=document.getElementById("liveBars");
  if(!box){box=document.createElement("div");box.id="liveBars";const first=document.getElementById("g3HomeNext")||anchor;first.parentNode.insertBefore(box,first)}
  const list=games.filter(g=>liveFor(g)&&!resInfo(g)).sort((a,b)=>dt(a)-dt(b));
  if(!list.length){box.hidden=true;box.innerHTML="";return}
  box.hidden=false;
  const logo=n=>/grizzlys/i.test(n)?teamLogoHtml(n,"opponentLogo"):logoHtml(n,"opponentLogo");
  box.innerHTML=list.map((g,i)=>{const x=liveFor(g), fin=x.status==="final";
    return `<button type="button" class="liveBar${fin?" fin":""}" data-i="${i}" aria-label="${fin?"Spielende":"Live"}: ${esc(g.home)} ${esc(String(x.hs))} zu ${esc(String(x.as))} ${esc(g.away)}">
      <span class="lbTop">${fin?"🏁 Spielende":'<i class="liveDot"></i>Live'} · ${esc(teamName(g.team))}<span class="lbState">${esc(fin?"Endstand vorläufig":liveLabel(x))}</span></span>
      <span class="lbMatch"><span class="lbSide">${logo(g.home)}<span>${esc(shortTeam(g.home))}</span></span><b class="lbScore">${esc(String(x.hs))}:${esc(String(x.as))}</b><span class="lbSide r">${logo(g.away)}<span>${esc(shortTeam(g.away))}</span></span></span>
      <span class="lbHint">${fin?"Das Ergebnis wird gleich übernommen.":"Antippen für Drittel und Torfolge · aktualisiert sich automatisch"}</span></button>`}).join("");
  box.querySelectorAll(".liveBar").forEach(b=>b.onclick=()=>openMatchDetails(list[Number(b.dataset.i)]));
}
window.liveRefresh=function(){
  try{window.applyResults&&window.applyResults()}catch(e){console.warn(e)}
  try{liveBarRender()}catch(e){console.warn(e)}
  const m=document.getElementById("matchModal"), g=window._mdGame;
  if(m&&!m.hidden&&g&&liveFor(g)){const c=m.querySelector(".mdCard");
    if(c){const res=resInfo(g), past=!!res||dt(g).getTime()+2*3600000<Date.now();c.innerHTML=gameCardHtml(g,past,res,true);g3Bind(c,g,true);hwDecorate(c,g)}}
};
/* 1.28.0: Konfetti beim Öffnen eines gewonnenen Spiels – einmal pro Spiel und Gerät, abschaltbar, nicht bei „weniger Bewegung“ */
function cfOn(){try{return localStorage.getItem("grizzlysConfetti")!=="off"}catch(e){return true}}
function winConfetti(g){
  const r=resInfo(g); if(!r||r.o!=="w"||!cfOn())return;
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const key=rkey(g); let seen=[];try{seen=JSON.parse(localStorage.getItem("grizzlysConfettiSeen")||"[]")}catch(e){}
  if(seen.includes(key))return; seen.push(key); try{localStorage.setItem("grizzlysConfettiSeen",JSON.stringify(seen.slice(-80)))}catch(e){}
  const cv=document.createElement("canvas"); cv.className="cfCanvas"; cv.setAttribute("aria-hidden","true"); document.body.appendChild(cv);
  const dpr=Math.min(2,window.devicePixelRatio||1), W=innerWidth, H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext("2d"); c.scale(dpr,dpr);
  const col=["#1f6fb8","#4fa6ff","#ff8a00","#ffb347","#ffffff","#16a34a"];
  const P=Array.from({length:130},(_,i)=>({x:W*(.15+Math.random()*.7),y:H*.32+Math.random()*30,vx:(Math.random()-.5)*9,vy:-7-Math.random()*8,w:5+Math.random()*6,h:8+Math.random()*8,a:Math.random()*6.3,va:(Math.random()-.5)*.35,c:col[i%col.length]}));
  const t0=performance.now();
  (function f(t){const k=(t-t0)/1900; c.clearRect(0,0,W,H);
    P.forEach(p=>{p.vy+=.32;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;c.save();c.globalAlpha=Math.max(0,1-k*k);c.translate(p.x,p.y);c.rotate(p.a);c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore()});
    if(k<1)requestAnimationFrame(f);else cv.remove()})(t0);
}
window.winConfetti=winConfetti;
document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("introToggle");if(!t)return;let off=false;try{off=localStorage.getItem("grizzlysIntro")==="off"}catch(e){}t.checked=!off;
  t.onchange=()=>{try{localStorage.setItem("grizzlysIntro",t.checked?"on":"off")}catch(e){}try{trackAnalyticsEvent("intro_toggle",{on:t.checked?"ja":"nein"})}catch(e){}if(t.checked){try{sessionStorage.removeItem("grizzlysIntroSeen")}catch(e){}}}});
document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("bigTxtToggle");if(!t)return;t.checked=document.documentElement.classList.contains("bigText");
  t.onchange=()=>{document.documentElement.classList.toggle("bigText",t.checked);try{localStorage.setItem("grizzlysBigText",t.checked?"1":"0")}catch(e){}try{trackAnalyticsEvent("big_text",{on:t.checked?"ja":"nein"})}catch(e){}}});
document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("cfToggle");if(!t)return;t.checked=cfOn();t.onchange=()=>{try{localStorage.setItem("grizzlysConfetti",t.checked?"on":"off")}catch(e){}}});
/* fixed=true: Karte ist dauerhaft offen (Fenster „Spieldetails“) */
function g3Bind(card,g,fixed=false){
  card.__g3g=g;
  [["route",route],["cal",calendar],["rem",reminder],["share",shareGame],["rep",x=>openMatchDetails(x,true)]].forEach(([c,fn])=>{const b=card.querySelector("."+c);if(b)b.onclick=e=>{e.stopPropagation();fn(g)}});
  if(fixed){g3SetOpen(card,true);return}
  card.setAttribute("role","button");card.tabIndex=0;
  const tog=()=>{
    const on=!card.classList.contains("open");
    const home=card.classList.contains("g3Home");
    (home?document.querySelectorAll(".g3Home.open"):card.parentNode.querySelectorAll(".card.gz3.open:not(.g3Fixed)")).forEach(c=>{if(c!==card){g3SetOpen(c,false);if(home)g3HomeOpen[c.id]=false}});
    if(home)g3HomeOpen[card.id]=on;
    g3SetOpen(card,on);
    if(on)winConfetti(g);
    if(card.closest("#gamesList"))g3OpenKey=on?g3Key(g):"";
    if(on)setTimeout(()=>{try{card.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}},300);
  };
  card.onclick=e=>{if(e.target.closest("button,a"))return;tog()};
  card.onkeydown=e=>{if(e.target!==card)return;if(e.key==="Enter"||e.key===" "){e.preventDefault();tog()}};
}
const SI_P={"list": "<path d=\"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01\"/>", "map": "<path d=\"M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z\"/><path d=\"M9 4v14M15 6v14\"/>", "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4\"/>", "moon": "<path d=\"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z\"/>", "phone": "<rect x=\"7\" y=\"3\" width=\"10\" height=\"18\" rx=\"2.5\"/><path d=\"M11 18h2\"/>", "party": "<path d=\"M4 20l5-13 8 8z\"/><path d=\"M14 4v2M19 4l-1.2 1.2M20 9h-2M16 10.5l.01 0\"/>", "target": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/><path d=\"M12 12h.01\"/>", "puck": "<ellipse cx=\"12\" cy=\"9\" rx=\"7\" ry=\"3\"/><path d=\"M5 9v5c0 1.7 3.1 3 7 3s7-1.3 7-3V9\"/>", "ghost": "<path d=\"M5 20V11a7 7 0 0 1 14 0v9l-2.5-2-2 2-2.5-2-2.5 2-2-2z\"/><path d=\"M9.5 11h.01M14.5 11h.01\"/>", "tree": "<path d=\"M12 3l4.5 5.5h-2.5L18 13.5h-3L19.5 19h-15L9 13.5H6L10 8.5H7.5z\"/><path d=\"M12 19v2.5\"/>", "clock": "<circle cx=\"12\" cy=\"13\" r=\"7.5\"/><path d=\"M12 9v4l2.5 1.5M5 4.5L3 6.5M19 4.5l2 2\"/>", "siren": "<path d=\"M7 18v-5a5 5 0 0 1 10 0v5\"/><path d=\"M5 18h14v3H5zM12 3v2M4.5 7l1.4 1.4M19.5 7l-1.4 1.4\"/>", "chart": "<path d=\"M4 20V10M10 20V4M16 20v-7M21 20H3\"/>", "lock": "<rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"2.5\"/><path d=\"M8 10.5V8a4 4 0 0 1 8 0v2.5\"/>", "pin": "<path d=\"M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.3\"/>", "home": "<path d=\"M4 11l8-7 8 7v9H4z\"/><path d=\"M10 20v-5h4v5\"/>", "stopwatch": "<circle cx=\"12\" cy=\"13.5\" r=\"7\"/><path d=\"M12 10v4M9.5 3h5M18.5 6.5L17 8\"/>", "ice": "<path d=\"M12 3l7.5 4v10L12 21l-7.5-4V7z\"/><path d=\"M4.5 7L12 11l7.5-4M12 11v10\"/>", "stop": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M6 6l12 12\"/>", "warn": "<path d=\"M12 4L21 19H3z\"/><path d=\"M12 10v4M12 16.8h.01\"/>", "pad": "<path d=\"M8 3h8l1 10-2 8H9l-2-8z\"/><path d=\"M8.5 9h7M8.8 14h6.4\"/>", "goal": "<path d=\"M3 19V7h18v12\"/><path d=\"M3 11h18M3 15h18M8 7v12M13 7v12M18 7v12\"/>", "kid": "<circle cx=\"12\" cy=\"8\" r=\"3.5\"/><path d=\"M5.5 20a6.5 6.5 0 0 1 13 0\"/>", "book": "<path d=\"M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z\"/><path d=\"M12 6v14\"/>", "books": "<path d=\"M5 4h4v16H5zM10 4h4v16h-4z\"/><path d=\"M15.5 6l3.8-1 3 14-3.8 1z\"/>", "hand": "<path d=\"M7 12V6.5a1.5 1.5 0 0 1 3 0V11M10 11V4.5a1.5 1.5 0 0 1 3 0V11M13 11V5.5a1.5 1.5 0 0 1 3 0V13M16 9.5a1.5 1.5 0 0 1 3 0V14c0 4-3 7-7 7-3 0-5-1.5-6.5-4L3.5 13a1.5 1.5 0 0 1 2.6-1.4L7 13\"/>"};
function SI(k){return '<svg class="sIc" viewBox="0 0 24 24" aria-hidden="true">'+(SI_P[k]||SI_P.book)+'</svg>'}
window.SI=SI;
const EMPTY_ICONS={
  puck:'<ellipse cx="12" cy="9" rx="7" ry="3"/><path d="M5 9v5c0 1.7 3.1 3 7 3s7-1.3 7-3V9"/>',
  doc:'<rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 9h6M9 13h6M9 16.5h3"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/>'};
function emptyBox(kind,title,text){return '<div class="emptyBox"><svg viewBox="0 0 24 24" aria-hidden="true">'+(EMPTY_ICONS[kind]||EMPTY_ICONS.puck)+'</svg><b>'+title+'</b>'+(text?'<span>'+text+'</span>':'')+'</div>'}
function renderList(filter="all"){
  if(scheduleMode!=="chrono"){renderCalendar();return;}
  const list=document.getElementById("gamesList"); list.innerHTML="";
  const arr=games.filter(gameMatchesFilters).sort((a,b)=>dt(a)-dt(b));
  document.getElementById("scheduleTitle").textContent="Spielplan"; document.getElementById("scheduleCount").textContent=arr.length+" Spiele";
  if(!arr.length){list.innerHTML=emptyBox("puck","Keine Spiele","Mit diesen Filtern gibt es keine Spiele. Wähle oben eine Mannschaft oder Heim/Auswärts.");return}
  let month=""; const ng=nextGame(), openKey=g3OpenKey===null?(ng?g3Key(ng):""):g3OpenKey;
  /* Gespielte Spiele stehen zugeklappt über den kommenden („Gespielte Spiele anzeigen“) */
  /* 1.44.2: verlegte Spiele ohne neuen Termin stehen oben unter „Termin offen“ (nicht bei den gespielten versteckt) */
  const tbd=arr.filter(g=>g.postponed&&!resInfo(g)), tbdSet=new Set(tbd);
  if(tbd.length){const mh=document.createElement("div");mh.className="month monthTbd";mh.textContent="Termin offen";list.appendChild(mh);
    tbd.forEach(g=>{const card=document.createElement("article");card.className="card team"+g.team+" gz2 gz3 isCx isPp";card.dataset.date=g.date;card.dataset.team=g.team;
      card.innerHTML=gameCardHtml(g,false,null);g3Bind(card,g);g3SetOpen(card,false);hwDecorate(card,g);list.appendChild(card)})}
  const isPast=g=>!!resInfo(g)||dt(g).getTime()+2*3600000<Date.now();
  const pastN=arr.filter(g=>!tbdSet.has(g)&&isPast(g)).length, fold=pastN>0&&pastN<arr.length-tbd.length;
  let target=list, pastWrap=null;
  if(fold){
    const tb=document.createElement("button");tb.type="button";tb.className="pastToggle"+(schedPastOpen?" open":"");
    tb.innerHTML=`<span>${schedPastOpen?"Gespielte Spiele ausblenden":"Gespielte Spiele anzeigen"}</span><b>${pastN}</b><i aria-hidden="true">⌄</i>`;
    tb.setAttribute("aria-expanded",schedPastOpen?"true":"false");
    tb.onclick=()=>{schedPastOpen=!schedPastOpen;renderList(filter)};
    list.appendChild(tb);
    pastWrap=document.createElement("div");pastWrap.className="pastWrap";pastWrap.hidden=!schedPastOpen;list.appendChild(pastWrap);target=pastWrap;
  }
  arr.forEach(g=>{
    if(tbdSet.has(g))return;
    if(fold&&target===pastWrap&&!isPast(g)){target=list;month=""}
    const m=monthLabel(g); if(m!==month){month=m; const mh=document.createElement("div");mh.className="month";mh.textContent=m;mh.dataset.mkey=g.date.slice(0,7);target.appendChild(mh)}
    const card=document.createElement("article"); card.className="card "+("team"+g.team); card.dataset.date=g.date; card.dataset.team=g.team;
    const home=isHome(g);
    const sideL=home?teamLogoHtml(g.home,"opponentLogo"):logoHtml(g.home), sideR=home?logoHtml(g.away):teamLogoHtml(g.away,"opponentLogo");
    const res=resInfo(g), past=!!res||dt(g).getTime()+2*3600000<Date.now();
    card.classList.add("gz2","gz3"); if(g.cancelled)card.classList.add("isCx");
    card.innerHTML=gameCardHtml(g,past,res);
    g3Bind(card,g);g3SetOpen(card,g3Key(g)===openKey);
    if(g===ng){card.classList.add("nextGame");card.querySelector(".gcLeft").insertAdjacentHTML("beforeend",'<span class="nextBadge">Nächstes Spiel</span>')}
    hwDecorate(card,g);
    target.appendChild(card);
  });
  try{renderMonthJump()}catch(e){console.warn(e)}
}
var schedPastOpen=false;
/* 1.28.0: Monatsleiste im Spielplan – antippen springt zum Monat */
function renderMonthJump(){
  const bar=document.getElementById("monthJump"); if(!bar)return;
  if(scheduleMode!=="chrono"){bar.hidden=true;return}
  const arr=games.filter(gameMatchesFilters).sort((a,b)=>dt(a)-dt(b)), keys=[...new Set(arr.map(g=>g.date.slice(0,7)))];
  if(keys.length<2){bar.hidden=true;return}
  const now=todayKey().slice(0,7), cur=keys.find(k=>k>=now)||keys[keys.length-1];
  const lbl=k=>new Date(k+"-15T12:00:00").toLocaleDateString("de-DE",{month:"short"}).replace(".","");
  bar.hidden=false;
  bar.innerHTML=keys.map(k=>`<button type="button" data-m="${k}" class="${k===cur?"cur":""}${k<now?" past":""}" aria-label="${esc(new Date(k+"-15T12:00:00").toLocaleDateString("de-DE",{month:"long",year:"numeric"}))}">${esc(lbl(k))}</button>`).join("");
  bar.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.m; let h=document.querySelector(`#gamesList .month[data-mkey="${k}"]`);
    if(h&&h.closest(".pastWrap")&&h.closest(".pastWrap").hidden){schedPastOpen=true;renderList("all");h=document.querySelector(`#gamesList .month[data-mkey="${k}"]`)}
    if(!h)return; bar.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
    const y=h.getBoundingClientRect().top+window.scrollY-stickyOffset();window.scrollTo({top:Math.max(0,y),behavior:"smooth"});
  });
  const c=bar.querySelector(".cur"); if(c)bar.scrollLeft=Math.max(0,c.offsetLeft-bar.clientWidth/2+c.offsetWidth/2);
}
function route(g){window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(address(g)),"_blank")}
function icsFor(g,alarm=false){
 const d=dt(g),end=new Date(d.getTime()+2*3600000),p=n=>String(n).padStart(2,"0");
 const stamp=x=>x.getFullYear()+p(x.getMonth()+1)+p(x.getDate())+"T"+p(x.getHours())+p(x.getMinutes())+"00";
 let a=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ESV Grizzlys//U15//DE","CALSCALE:GREGORIAN","BEGIN:VEVENT","UID:"+g.date+"-"+g.time+"-"+g.team+"@grizzlys-u15","DTSTART:"+stamp(d),"DTEND:"+stamp(end),"SUMMARY:"+(g.cancelled?cxU(g)+": ":"")+(alarm?"Erinnerung: ":"")+teamName(g.team)+" – "+opponent(g),...(g.cancelled?["STATUS:CANCELLED"]:[]),"LOCATION:"+address(g),"DESCRIPTION:"+g.home+" gegen "+g.away+"\nSpielort: "+address(g)];
 if(alarm)a.push("BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY","DESCRIPTION:U15-Spiel der ESV Grizzlys morgen","END:VALARM");
 a.push("END:VEVENT","END:VCALENDAR"); return a.join("\r\n");
}
function downloadIcs(g,alarm){const blob=new Blob([icsFor(g,alarm)],{type:"text/calendar"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(alarm?"Erinnerung-":"U15-")+g.date+"-"+g.team+".ics";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function calendar(g){downloadIcs(g,false)} function reminder(g){downloadIcs(g,true);setTimeout(()=>alert("Kalenderdatei vorbereitet – die Erinnerung ist 24 Stunden vorher hinterlegt."),250)}
async function shareGame(g){const r=resInfo(g), per=r?standPeriodsData(g):null;
  /* 1.40.2: Ergebnis und Spieltag als Bild teilen (Bild-Fenster mit Teilen/Speichern); abgesagte Spiele bleiben Text */
  if(!g.cancelled&&typeof instaOpen==="function"){try{await instaOpen(g,r?"result":"announce",true);return}catch(e){console.warn(e)}}
  const text=(g.cancelled?(g.postponed?"⏸ VERLEGT – NEUER TERMIN OFFEN\n":"❌ ABGESAGT\n"):"")+(r?"🏒 "+teamName(g.team)+" – Endstand\n"+g.home+" "+r.hs+":"+r.as+" "+g.away+(per?"\nDrittel: "+per.p.join(" · ")+(per.so?" · n.P.":per.ot?" · n.V.":""):"")+"\n"+fmtDate(g)+" · "+g.stadium
    :"🏒 "+teamName(g.team)+"\n"+fmtDate(g)+" · "+g.time+" Uhr\n"+g.home+" gegen "+g.away+"\n📍 "+g.stadium+" – "+address(g));if(navigator.share){try{await navigator.share({title:"ESV Grizzlys "+teamName(g.team),text})}catch(e){}}else alert(text)}

function openMatchDetails(g,toReport=false){
  window._mdGame=g; setTimeout(()=>{try{winConfetti(g)}catch(e){}},250); /* 1.26.0: offenes Spiel merken, damit der Live-Stand mitläuft */
  const modal=document.getElementById("matchModal");
  const content=document.getElementById("matchModalContent");
  const home=isHome(g);
  const cls="team"+g.team;
  const homeLogo=home?teamLogoHtml(g.home,"opponentLogo"):logoHtml(g.home);
  const awayLogo=home?logoHtml(g.away):teamLogoHtml(g.away,"opponentLogo");
  const sideL=homeLogo, sideR=awayLogo;
  const res=resInfo(g), past=!!res||dt(g).getTime()+2*3600000<Date.now();
  const rep=(window.gameReports||{})[rkey(g)];
  content.innerHTML=`<article class="card gz2 gz3 mdCard ${"team"+g.team}" data-team="${g.team}">${gameCardHtml(g,past,res,true)}</article>`+msBox(g)+wxBox(g)+(rep&&rep.published&&rep.text?repHtml(rep):"");
  {const mr=content.querySelector(".mdReport");if(mr)mr.insertAdjacentHTML("beforeend",rxBar("rep_"+rkey(g),"War der Bericht gut?"))} /* 1.44.0 */
  hwDecorate(content.querySelector(".mdCard"),g);
  g3Bind(content.querySelector(".mdCard"),g,true);
  modal.hidden=false;
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  document.getElementById("matchModalClose").focus();
  if(toReport)setTimeout(()=>{const r=content.querySelector(".mdReport");if(r)r.scrollIntoView({block:"start",behavior:"smooth"})},150);
}
function closeMatchDetails(){
  const modal=document.getElementById("matchModal");
  modal.hidden=true;
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}

function showView(name){if(["home","schedule","opponents","rules","stats","downloads"].includes(name))window.__lastMain=name;trackAnalyticsEvent(name==="home"?"home_opened":name==="schedule"?"spielplan_opened":name==="opponents"?"opponents_opened":name==="downloads"?"downloads_opened":name==="rules"?"rules_opened":name==="stats"?"stats_opened":name==="settings"?"settings_opened":"info_opened");["home","schedule","opponents","rules","stats","downloads","info","settings"].forEach(v=>{const e=document.getElementById(v+"View");if(e)e.hidden=v!==name});if(name==="stats")try{renderStats()}catch(e){console.warn(e)}if(name==="rules")try{renderRules()}catch(e){console.warn(e)}document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.view===name));if(name==="schedule"){const ng=nextGame();if(ng){calendarCursor=new Date(dt(ng).getFullYear(),dt(ng).getMonth(),1)}setScheduleMode(scheduleMode)}window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>showView(b.dataset.view));
{const v=document.querySelector(".inVer"),t=document.getElementById("inMadeVer");if(v&&t)t.textContent=" · Version "+v.textContent.trim();}
/* 1.9.1.107: Gruselmoment im Halloween-Design – höchstens einmal am Tag, nie über offenen Fenstern, nicht anklickbar */
(function(){
  const KEY="grizzlysHwScare", DAY="grizzlysHwScareDay";
  const on=()=>{try{return localStorage.getItem(KEY)!=="off"}catch(e){return true}};
  const tg=document.getElementById("hwScareToggle");
  if(tg){tg.checked=on();tg.addEventListener("change",()=>{try{localStorage.setItem(KEY,tg.checked?"on":"off")}catch(e){}})}
  const today=()=>new Date().toISOString().slice(0,10);
  const busy=()=>document.hidden||document.documentElement.classList.contains("swiping")||[...document.querySelectorAll(".matchModal,.adminModal,.bugReportModal,.thanksModal,.admSheetWrap,.gdSplash")].some(m=>!m.hidden&&m.offsetParent!==null)||/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||"");
  function show(force){
    if(!force){
      if(!window.hwActive||!window.hwActive()||!on())return;
      if(!window.GRIZZLYS_TEST){try{if(localStorage.getItem(DAY)===today())return}catch(e){}}
      if(busy()){setTimeout(()=>show(false),15000);return}
      try{localStorage.setItem(DAY,today())}catch(e){}
    }
    const dim=document.createElement("div");dim.className="hwScareDim";dim.setAttribute("aria-hidden","true");
    const el=document.createElement("div");el.className="hwScare";el.setAttribute("aria-hidden","true");el.innerHTML='<img src="halloween/gestalt.webp" alt="">';
    const img=el.firstChild;
    const go=()=>{document.body.appendChild(dim);document.body.appendChild(el);void el.offsetWidth;el.classList.add("go");setTimeout(()=>{el.remove();dim.remove()},2800)};
    if(img.complete&&img.naturalWidth)go();else{img.onload=go;img.onerror=()=>{}}
  }
  window.hwScareNow=()=>show(true);
  // Zufällig nach dem Öffnen: live 25–70 s, in der Testversion schon nach 6–10 s
  const wait=window.GRIZZLYS_TEST?6000+Math.random()*4000:25000+Math.random()*45000;
  setTimeout(()=>show(false),wait);
})();
/* 1.9.1.103: News-Fenster per Wisch nach rechts oder unten schließen */
(function(){
  let st=null;
  document.addEventListener("touchstart",e=>{
    st=null; const m=document.getElementById("newsModal"); if(!m||m.hidden||e.touches.length!==1)return;
    const box=m.querySelector(".matchModalBox"), t=e.touches[0]; if(!box||e.target.closest("input,textarea,select,a"))return;
    st={x:t.clientX,y:t.clientY,box,m,lock:null,dx:0,dy:0,top:box.scrollTop<=0,t:Date.now()};
  },{passive:true});
  document.addEventListener("touchmove",e=>{
    if(!st||st.lock==="no")return;
    const t=e.touches[0], dx=t.clientX-st.x, dy=t.clientY-st.y;
    if(!st.lock){
      if(dx>10&&Math.abs(dx)>Math.abs(dy)*1.2)st.lock="x";
      else if(dy>10&&st.top&&dy>Math.abs(dx)*1.2)st.lock="y";
      else if(Math.abs(dx)>10||Math.abs(dy)>10){st.lock="no";return}
      else return;
    }
    e.preventDefault();
    st.dx=st.lock==="x"?Math.max(0,dx):0; st.dy=st.lock==="y"?Math.max(0,dy):0;
    st.box.style.transition="none"; st.box.style.transform="translate("+st.dx+"px,"+st.dy+"px)"; st.box.style.opacity=String(1-Math.min(.6,(st.dx+st.dy)/600));
  },{passive:false});
  document.addEventListener("touchend",()=>{
    if(!st||!st.lock||st.lock==="no"){st=null;return}
    const s0=st; st=null; const d=s0.dx+s0.dy, fast=d/Math.max(1,Date.now()-s0.t)>.6&&d>40;
    s0.box.style.transition="transform .2s ease-out,opacity .2s";
    if(d>100||fast){
      s0.box.style.transform=s0.lock==="x"?"translateX(100vw)":"translateY(100vh)"; s0.box.style.opacity="0";
      setTimeout(()=>{closeNews();s0.box.style.transition="";s0.box.style.transform="";s0.box.style.opacity=""},190);
    }else{ s0.box.style.transform=""; s0.box.style.opacity=""; setTimeout(()=>{s0.box.style.transition=""},220); }
  },{passive:true});
})();
/* 1.9.1.101: Seitliche Leiste zeigt beim Scrollen, wo man auf der Seite ist; im Spielplan mit Monat */
(function(){
  const bar=document.createElement("div");bar.className="scrBar";bar.setAttribute("aria-hidden","true");bar.innerHTML="<i></i><b></b>";document.body.appendChild(bar);
  const th=bar.firstChild, lab=bar.lastChild; let hideT=0, raf=0, drag=null;
  function update(){
    raf=0;
    const de=document.documentElement, total=de.scrollHeight, vh=innerHeight;
    if(total<vh*1.4){bar.classList.remove("on");return}
    const track=bar.clientHeight, size=Math.max(22,track*vh/total), max=Math.max(1,total-vh), pos=(track-size)*Math.min(1,scrollY/max);
    th.style.height=size+"px"; th.style.top=pos+"px";
    let m="";
    const sv=document.getElementById("scheduleView");
    if(sv&&!sv.hidden){const hs=[...sv.querySelectorAll(".month")].filter(h=>h.offsetParent!==null);for(const h of hs){if(h.getBoundingClientRect().top<vh*.35)m=h.textContent;else break}if(!m&&hs[0])m=hs[0].textContent}
    lab.textContent=m; lab.style.top=(pos+size/2)+"px";
    bar.classList.add("on"); clearTimeout(hideT); if(!drag)hideT=setTimeout(()=>bar.classList.remove("on"),1300);
  }
  /* Balken anfassen und ziehen: springt direkt an die Stelle (im Spielplan mit Monatsanzeige) */
  th.addEventListener("pointerdown",e=>{
    if(!bar.classList.contains("on"))return;
    e.preventDefault(); e.stopPropagation();
    const r=th.getBoundingClientRect(); drag={off:e.clientY-r.top};
    try{th.setPointerCapture(e.pointerId)}catch(_){}
    bar.classList.add("drag"); clearTimeout(hideT);
    try{navigator.vibrate&&navigator.vibrate(8)}catch(_){}
  });
  th.addEventListener("pointermove",e=>{
    if(!drag)return; e.preventDefault();
    const tr=bar.getBoundingClientRect(), size=th.offsetHeight, max=document.documentElement.scrollHeight-innerHeight;
    const ratio=Math.min(1,Math.max(0,(e.clientY-drag.off-tr.top)/Math.max(1,tr.height-size)));
    window.scrollTo({top:ratio*max,behavior:"instant"});
  });
  const end=()=>{if(!drag)return;drag=null;bar.classList.remove("drag");clearTimeout(hideT);hideT=setTimeout(()=>bar.classList.remove("on"),1300)};
  th.addEventListener("pointerup",end); th.addEventListener("pointercancel",end); th.addEventListener("lostpointercapture",end);
  addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
})();
/* 1.9.1.100: Wischen nach links/rechts wechselt zwischen Start, Spielplan, Gegner und Downloads – die Seite folgt dem Finger */
(function(){
  const ORDER=["home","schedule","opponents","rules","downloads"];const syncOrder=()=>{const a=document.documentElement.classList.contains("dv")?["home","schedule","opponents","stats","downloads"]:["home","schedule","opponents","rules","downloads"];ORDER.splice(0,ORDER.length,...a)};syncOrder();
  const label=v=>(document.querySelector('.tab[data-view="'+v+'"]')||{}).textContent||v;
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  let st=null;
  const hint=document.createElement("div");hint.className="swHint";hint.setAttribute("aria-hidden","true");document.body.appendChild(hint);
  const dots=document.createElement("div");dots.className="swDots";dots.setAttribute("aria-hidden","true");dots.innerHTML=ORDER.map(()=>"<i></i>").join("");document.body.appendChild(dots);
  let dotsT=0;
  function showDots(v){[...dots.children].forEach((d,k)=>d.classList.toggle("on",ORDER[k]===v));dots.classList.add("on");clearTimeout(dotsT);dotsT=setTimeout(()=>dots.classList.remove("on"),900)}
  const cur=()=>{syncOrder();return ORDER.concat(["settings","info","rules","stats"]).find(v=>{const e=document.getElementById(v+"View");return e&&!e.hidden})};
  const overlayOpen=()=>[...document.querySelectorAll(".matchModal,.adminModal,.bugReportModal,.thanksModal,.admSheetWrap,.gdSplash")].some(m=>!m.hidden&&m.offsetParent!==null);
  function setPos(el,x,anim,ms){el.style.transition=anim?"transform "+ms+"ms cubic-bezier(.2,.8,.2,1),opacity "+ms+"ms":"none";el.style.transform=x?"translateX("+x+"px)":"";el.style.opacity=x?String(Math.max(.35,1-Math.abs(x)/innerWidth*.7)):"";}
  function cleanup(el){el.style.transition="";el.style.transform="";el.style.opacity="";el.classList.remove("swView");document.documentElement.classList.remove("swiping");hint.style.transition="opacity .15s";hint.style.opacity="0";}
  document.addEventListener("touchstart",e=>{
    st=null; if(e.touches.length!==1)return;
    const t=e.touches[0], el=e.target;
    if(t.clientX<24||t.clientX>innerWidth-24)return;          // Rand frei für die Zurück-Geste von Android
    const c=cur(); if(!c||overlayOpen())return;
    if(!el.closest||!el.closest("main,#homeView,#scheduleView,#opponentsView,#rulesView,#statsView,#downloadsView,#settingsView,#infoView"))return;
    if(el.closest("input,select,textarea,canvas,[data-noswipe]"))return;
    for(let n=el;n&&n!==document.body;n=n.parentElement){if(n.scrollWidth>n.clientWidth+4&&/(auto|scroll)/.test(getComputedStyle(n).overflowX))return;}
    st={x:t.clientX,y:t.clientY,t:Date.now(),lock:null,dx:0,c,view:document.getElementById(c+"View"),lx:t.clientX,lt:Date.now(),v:0};
  },{passive:true});
  document.addEventListener("touchmove",e=>{
    if(!st||st.lock==="v")return;
    const t=e.touches[0], dx=t.clientX-st.x, dy=t.clientY-st.y;
    if(!st.lock){
      if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){st.lock="v";return}
      if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){st.lock="h";st.view.classList.add("swView");document.documentElement.classList.add("swiping")}
      else return;
    }
    e.preventDefault();
    const now=Date.now();st.v=(t.clientX-st.lx)/Math.max(1,now-st.lt);st.lx=t.clientX;st.lt=now;
    const i=ORDER.indexOf(st.c), n=i<0?(dx>0?(window.__lastMain||"home"):null):ORDER[i+(dx<0?1:-1)];  // Einstellungen/Info: nur zurück
    st.n=n; st.dx=n?dx:dx*.25;                                 // an den Enden nur leicht nachgeben
    setPos(st.view,st.dx,false);
    if(n){hint.className="swHint "+(dx<0?"r":"l");hint.textContent=dx<0?label(n)+" ›":"‹ "+label(n);hint.style.transition="none";hint.style.opacity=String(Math.min(1,Math.abs(dx)/(innerWidth*.28)));}
    else hint.style.opacity="0";
  },{passive:false});
  function finish(cancel){
    if(!st||st.lock!=="h"){st=null;return}
    const s0=st; st=null;
    const w=innerWidth, go=!cancel&&s0.n&&(Math.abs(s0.dx)>w*.28||(Math.abs(s0.v)>.45&&Math.abs(s0.dx)>40&&Math.sign(s0.v)===Math.sign(s0.dx)));
    if(window.getSelection)try{window.getSelection().removeAllRanges()}catch(e){}
    if(!go){setPos(s0.view,0,true,220);setTimeout(()=>cleanup(s0.view),230);hint.style.transition="opacity .2s";hint.style.opacity="0";return}
    const dir=s0.dx<0?-1:1;
    setPos(s0.view,dir*w,!reduce,reduce?0:170);
    setTimeout(()=>{
      cleanup(s0.view);
      showView(s0.n); showDots(s0.n);
      const v=document.getElementById(s0.n+"View");
      if(reduce)return;
      v.classList.add("swView");document.documentElement.classList.add("swiping");
      setPos(v,-dir*w*.45,false);void v.offsetWidth;setPos(v,0,true,240);
      setTimeout(()=>cleanup(v),260);
    },reduce?0:170);
  }
  document.addEventListener("touchend",()=>finish(false),{passive:true});
  document.addEventListener("touchcancel",()=>finish(true),{passive:true});
})();
/* ===== 1.9.1.113: Reiter „Regeln“ mit Freitextsuche ===== */
const RULES=[
 {c:"Spielablauf",t:"Spielzeit",x:"Ein Spiel hat drei Drittel. Gezählt wird nur die effektive Spielzeit: Bei jedem Pfiff bleibt die Uhr stehen. Bei den Erwachsenen dauert ein Drittel 20 Minuten, im Nachwuchs legt der Verband die Länge fest.",k:"drittel minuten uhr pause dauer"},
 {c:"Spielablauf",t:"Spieler auf dem Eis",x:"Jede Mannschaft hat fünf Feldspieler und einen Torhüter auf dem Eis. Bei einer Strafe spielt sie mit einem Spieler weniger, mindestens aber mit drei Feldspielern.",k:"anzahl sechs feldspieler aufstellung"},
 {c:"Spielablauf",t:"Fliegender Wechsel",x:"Gewechselt werden darf jederzeit, auch während das Spiel läuft. Der neue Spieler darf erst aufs Eis, wenn der wechselnde Spieler nah an der Bande ist (etwa 1,5 m) und nicht mehr ins Spiel eingreift. Sonst gibt es eine kleine Bankstrafe wegen „zu vieler Spieler auf dem Eis“.",k:"wechsel auswechseln zu viele spieler bank"},
 {c:"Spielablauf",t:"Bully (Anspiel)",x:"Mit dem Bully beginnt jedes Drittel und es geht nach jedem Tor am Mittelpunkt weiter. Nach anderen Unterbrechungen findet es am nächstgelegenen der neun Bullypunkte statt. Der verteidigende Spieler legt den Schläger zuerst aufs Eis. Wer sich beim Bully falsch verhält, wird durch einen Mitspieler ersetzt.",k:"anspiel faceoff einwurf bullypunkt center"},
 {c:"Spielablauf",t:"Linien und Zonen",x:"Die rote Mittellinie teilt das Eis in zwei Hälften. Die beiden blauen Linien teilen es in Verteidigungsdrittel, neutrale Zone und Angriffsdrittel. Die roten Torlinien verlaufen durch die Tore.",k:"rote linie blaue linie mittellinie drittel zone spielfeld"},
 {c:"Spielablauf",t:"Wann zählt ein Tor?",x:"Der Puck muss die Torlinie zwischen den Pfosten vollständig überquert haben. Kein Tor gibt es, wenn der Puck mit dem Schlittschuh absichtlich hineingekickt, mit der Hand hineingeworfen oder mit dem Schläger über Höhe der Torlatte gespielt wurde. Auch eine Behinderung des Torhüters im Torraum macht das Tor ungültig.",k:"tor torlinie kicken schlittschuh hand videobeweis"},
 {c:"Spielablauf",t:"Hoher Stock (Puck spielen)",x:"Den Puck mit dem Schläger über Schulterhöhe zu spielen ist nicht erlaubt: Das Spiel wird unterbrochen. Trifft der hohe Stock einen Gegner, ist das ein Foul (siehe „Hoher Stock“ bei den Fouls).",k:"high stick schulter schläger hoch"},
 {c:"Spielablauf",t:"Handpass",x:"Den Puck mit der Hand stoppen oder aus der Luft fangen ist erlaubt, er muss aber sofort aufs Eis. Einem Mitspieler zuspielen darf man mit der Hand nur im eigenen Verteidigungsdrittel, sonst wird unterbrochen. Prallt der Puck nur zufällig von der Hand ab und bringt keinen Vorteil, läuft das Spiel weiter.",k:"hand fangen pass werfen"},
 {c:"Spielablauf",t:"Puck aus dem Spielfeld",x:"Fliegt der Puck über die Bande oder ins Publikum, geht es mit einem Bully weiter. Schießt ein Spieler ihn aus dem eigenen Verteidigungsdrittel direkt (ohne Bande oder Glas zu berühren) aus dem Spielfeld, gibt es zwei Minuten wegen Spielverzögerung.",k:"bande plexiglas glas zuschauer spielverzögerung"},
 {c:"Spielablauf",t:"Auszeit (Timeout)",x:"Jede Mannschaft darf pro Spiel eine Auszeit von 30 Sekunden nehmen, aber nur während einer Unterbrechung.",k:"timeout pause trainer 30 sekunden"},
 {c:"Spielablauf",t:"Gleichstand nach 60 Minuten",x:"Ein Unentschieden gibt es im Eishockey nicht. In der U15 entscheidet bei Gleichstand nach drei Dritteln direkt ein Penaltyschießen. Der Sieger bekommt im Endstand ein Tor dazu, gekennzeichnet mit „n.P.“ (nach Penaltyschießen). In anderen Ligen gibt es vorher noch eine Verlängerung („n.V.“).",k:"verlängerung overtime penaltyschießen shootout gleichstand"},

 {c:"Abseits & Icing",t:"Abseits",x:"Ein Angreifer darf erst ins Angriffsdrittel, wenn der Puck die blaue Linie vollständig überquert hat. Maßgeblich sind die Schlittschuhe: Sind beide vor dem Puck über der Linie, ist es Abseits. Danach gibt es ein Bully in der neutralen Zone.",k:"offside blaue linie angriffsdrittel schlittschuh"},
 {c:"Abseits & Icing",t:"Verzögertes Abseits",x:"Fährt der Puck ins Drittel, während ein Angreifer schon drin steht, hebt der Linienrichter den Arm. Das Spiel läuft weiter, wenn alle Angreifer das Drittel wieder verlassen (die blaue Linie berühren), ohne den Puck zu spielen.",k:"delayed offside arm linienrichter"},
 {c:"Abseits & Icing",t:"Icing (unerlaubter Weitschuss)",x:"Schießt eine Mannschaft den Puck aus der eigenen Hälfte über die gegnerische Torlinie, ohne dass ihn jemand berührt, ist das Icing. Das Bully findet im Verteidigungsdrittel der Mannschaft statt, die das Icing verursacht hat, und sie darf vorher nicht wechseln.",k:"icing weitschuss befreiungsschlag torlinie"},
 {c:"Abseits & Icing",t:"Hybrid-Icing",x:"Ob gepfiffen wird, entscheidet der Linienrichter. Erreicht ein Verteidiger die Höhe der Bullypunkte zuerst, wird Icing gepfiffen. Ist ein Angreifer zuerst dort, läuft das Spiel weiter. So werden gefährliche Wettläufe zur Bande vermieden.",k:"icing linienrichter wettlauf bullypunkte"},
 {c:"Abseits & Icing",t:"Wann gibt es kein Icing?",x:"Kein Icing ist es, wenn die Mannschaft in Unterzahl spielt, wenn der Puck ins Tor geht, wenn ein Gegner (außer dem Torhüter) ihn hätte spielen können oder wenn der Torhüter seinen Torraum verlässt, um den Puck zu spielen.",k:"icing unterzahl ausnahme"},

 {c:"Strafen",t:"Kleine Strafe – 2 Minuten",x:"Für die meisten Fouls muss der Spieler zwei Minuten auf die Strafbank, seine Mannschaft spielt so lange in Unterzahl. Schießt der Gegner in dieser Zeit ein Tor, endet die kleine Strafe sofort.",k:"zwei minuten strafbank minor unterzahl"},
 {c:"Strafen",t:"Doppelte kleine Strafe – 2 + 2",x:"Zwei kleine Strafen hintereinander, zum Beispiel bei einem hohen Stock mit Verletzung. Ein Gegentor beendet nur die gerade laufenden zwei Minuten.",k:"vier minuten doppelt"},
 {c:"Strafen",t:"Große Strafe – 5 Minuten",x:"Für schwere Fouls. Die Mannschaft spielt volle fünf Minuten in Unterzahl, auch wenn sie Gegentore kassiert. Meist kommt eine Spieldauer-Disziplinarstrafe dazu, der Spieler darf dann nicht mehr mitspielen.",k:"fünf minuten major schwer"},
 {c:"Strafen",t:"Disziplinarstrafe – 10 Minuten",x:"Der Spieler muss zehn Minuten raus, seine Mannschaft darf aber vollzählig weiterspielen. Typisch für unsportliches Verhalten oder Meckern.",k:"zehn minuten misconduct unsportlich"},
 {c:"Strafen",t:"Spieldauer-Disziplinarstrafe und Matchstrafe",x:"Bei der Spieldauer-Disziplinarstrafe ist das Spiel für den Spieler vorbei. Die Matchstrafe ist die härteste Strafe: Ausschluss, fünf Minuten Unterzahl für die Mannschaft und in der Regel eine Sperre für weitere Spiele.",k:"ausschluss sperre rot spieldauer match"},
 {c:"Strafen",t:"Bankstrafe",x:"Eine kleine Strafe gegen die Mannschaft statt gegen einen bestimmten Spieler, zum Beispiel bei zu vielen Spielern auf dem Eis. Der Trainer bestimmt, wer auf die Strafbank geht.",k:"bank mannschaft zu viele spieler"},
 {c:"Strafen",t:"Angezeigte Strafe",x:"Begeht die Mannschaft ohne Puck ein Foul, hebt der Schiedsrichter den Arm und lässt weiterspielen, bis die foulende Mannschaft den Puck bekommt. Die gefoulte Mannschaft nimmt dann oft den Torhüter für einen sechsten Feldspieler vom Eis.",k:"verzögerte strafe arm delayed penalty sechster feldspieler"},
 {c:"Strafen",t:"Penalty (Strafschuss)",x:"Wird ein Spieler bei einer klaren Torchance von hinten gefoult, ohne dass noch ein Verteidiger außer dem Torhüter vor ihm ist, gibt es einen Penalty. Der Spieler läuft dann allein vom Mittelkreis auf den Torhüter zu.",k:"strafschuss penalty shot durchbruch alleingang"},
 {c:"Strafen",t:"Überzahl und Unterzahl",x:"Höchstens zwei Spieler einer Mannschaft zählen gleichzeitig auf der Strafbank, mindestens drei Feldspieler bleiben immer auf dem Eis. Bekommen beide Mannschaften gleichzeitig gleich lange Strafen, spielen sie mit gleich vielen Spielern weiter.",k:"powerplay penalty killing fünf gegen drei vier gegen vier"},

 {c:"Fouls",t:"Haken",x:"Den Gegner mit dem Schläger einhaken und so bremsen oder festhalten. Meist 2 Minuten.",k:"hooking schläger einhaken"},
 {c:"Fouls",t:"Halten",x:"Den Gegner mit Händen, Armen oder dem Schläger festhalten. Meist 2 Minuten.",k:"holding festhalten trikot"},
 {c:"Fouls",t:"Beinstellen",x:"Den Gegner mit Schläger, Bein oder Fuß zu Fall bringen. Meist 2 Minuten.",k:"tripping stolpern fallen"},
 {c:"Fouls",t:"Behinderung",x:"Einen Gegner angreifen oder blocken, der den Puck gar nicht hat. Meist 2 Minuten.",k:"interference blocken ohne puck"},
 {c:"Fouls",t:"Hoher Stock",x:"Den Gegner mit dem Schläger über Schulterhöhe treffen. 2 Minuten, bei Verletzung 2 + 2 oder schwerer.",k:"high sticking schläger gesicht kopf"},
 {c:"Fouls",t:"Stockschlag",x:"Mit dem Schläger nach dem Gegner oder seinem Schläger schlagen. Meist 2 Minuten, bei Verletzung deutlich mehr.",k:"slashing schlagen"},
 {c:"Fouls",t:"Crosscheck",x:"Den Gegner mit dem quer gehaltenen Schläger (beide Hände am Schaft) stoßen. Meist 2 Minuten.",k:"cross checking stoßen schläger quer"},
 {c:"Fouls",t:"Check von hinten",x:"Einen Gegner von hinten anfahren oder stoßen, der sich nicht schützen kann. Besonders gefährlich, deshalb mindestens 2 + 10 Minuten, oft 5 Minuten und Ausschluss.",k:"checking from behind rücken bande gefährlich"},
 {c:"Fouls",t:"Check gegen Kopf oder Nacken",x:"Jeder Check, der Kopf oder Nacken trifft, ist verboten. Mindestens 2 + 10 Minuten, oft 5 Minuten und Ausschluss.",k:"kopfcheck head hit kopf nacken gehirnerschütterung"},
 {c:"Fouls",t:"Bandencheck",x:"Den Gegner so gegen die Bande checken, dass er heftig gegen die Bande prallt. 2 Minuten, bei Verletzung 5 Minuten und Ausschluss.",k:"boarding bande checken"},
 {c:"Fouls",t:"Unkorrekter Körperangriff",x:"Mit Anlauf, Sprung oder mehreren Schritten in den Gegner fahren. 2 Minuten, bei Verletzung mehr.",k:"charging anlauf springen"},
 {c:"Fouls",t:"Ellbogencheck und Kniecheck",x:"Den Gegner mit Ellbogen oder Knie angehen. 2 Minuten, bei Verletzung 5 Minuten und Ausschluss.",k:"elbowing kneeing ellbogen knie"},
 {c:"Fouls",t:"Stechen und Stockendstoß",x:"Mit der Schlägerspitze oder dem oberen Schlägerende zustoßen. Schon der Versuch wird bestraft, ein Treffer mit 5 Minuten und Ausschluss.",k:"spearing butt ending stechen"},
 {c:"Fouls",t:"Faustkampf",x:"Wer sich prügelt, wird ausgeschlossen. Im Nachwuchs wird das besonders streng bestraft und kann zu Sperren führen.",k:"schlägerei fighting prügeln"},
 {c:"Fouls",t:"Spielverzögerung",x:"Das Spiel absichtlich aufhalten, zum Beispiel den Puck aus dem Verteidigungsdrittel direkt aus dem Spielfeld schießen oder das Tor verschieben. 2 Minuten.",k:"delay of game glas tor verschieben"},
 {c:"Fouls",t:"Unsportliches Verhalten",x:"Beleidigen, Meckern oder Provozieren. Je nach Schwere 2 oder 10 Minuten bis zum Ausschluss.",k:"unsportlich meckern schiedsrichter beleidigen"},

 {c:"Torhüter",t:"Torraum",x:"Der blaue Bereich vor dem Tor gehört dem Torhüter. Ein Angreifer darf ihn dort nicht behindern. Passiert das und fällt ein Tor, zählt es nicht.",k:"torraum blau crease goalie behinderung"},
 {c:"Torhüter",t:"Torhüter hinter der Mittellinie",x:"Der Torhüter darf nicht über die rote Mittellinie fahren und dort mitspielen, sonst gibt es 2 Minuten.",k:"mittellinie torwart goalie"},
 {c:"Torhüter",t:"Puck festhalten",x:"Fängt oder deckt der Torhüter den Puck ab, wird unterbrochen und es gibt ein Bully. Hält er ihn ohne Not fest oder spielt ihn absichtlich aus dem Spielfeld, kann das 2 Minuten Spielverzögerung geben.",k:"fangen abdecken unterbrechung torwart"},
 {c:"Torhüter",t:"Sechster Feldspieler",x:"Der Torhüter darf jederzeit vom Eis für einen zusätzlichen Feldspieler. Das passiert bei einer angezeigten Strafe oder kurz vor Schluss, wenn eine Mannschaft knapp zurückliegt. Das leere Tor heißt „Empty Net“.",k:"empty net leeres tor torwart raus"},

 {c:"Tore & Statistik",t:"Vorlagen (Assists)",x:"Für jedes Tor können bis zu zwei Vorlagen gezählt werden: an die Spieler, die den Puck zuletzt vor dem Torschützen gespielt haben.",k:"assist vorlage scorer punkte"},
 {c:"Tore & Statistik",t:"Zuerkanntes Tor",x:"Wird ein Spieler auf dem Weg zum leeren Tor gefoult, kann der Schiedsrichter das Tor direkt zuerkennen. Das Tor bekommt dann der gefoulte Spieler gutgeschrieben.",k:"tor zuerkannt empty net foul"},
 {c:"Tore & Statistik",t:"Powerplay- und Unterzahltor",x:"Ein Tor in Überzahl heißt Powerplaytor. Ein Tor in Unterzahl heißt Shorthander.",k:"powerplay shorthander unterzahl überzahl"},
 {c:"Tore & Statistik",t:"Hattrick",x:"Ein Spieler schießt drei Tore in einem Spiel.",k:"drei tore"},

 {c:"Nachwuchs",t:"U15: wer darf spielen?",x:"In der Saison 2026/27 gehören die Jahrgänge 2012 und 2013 zur U15. Zur U13 gehören 2014 und 2015, zur U17 2010 und 2011.",k:"ehv nrw anhang 4 nachwuchs altersklasse jahrgang 2012 2013 u13 u17 alter"},
 {c:"Nachwuchs",t:"Hochspielen in die U17",x:"Spieler von U9 bis U17 dürfen zusätzlich in der nächsthöheren Altersklasse ihres Stammvereins gemeldet und eingesetzt werden. Voraussetzung: Sie stehen in der Stammmeldung der höchsten Mannschaft ihrer eigenen Altersklasse.",k:"ehv nrw anhang 4 nachwuchs hochspielen höhere altersklasse u17 aushelfen"},
 {c:"Nachwuchs",t:"Bodycheck ab U15",x:"In NRW sind in U7 bis U13 Bodychecks und Checks gegen die Laufrichtung verboten. Diese Schutzregel gilt ab der U15 nicht mehr: Regelgerechte Körperchecks sind dann erlaubt, Fouls wie Check von hinten oder gegen den Kopf bleiben natürlich verboten.",k:"ehv nrw anhang 4 nachwuchs bodycheck körperspiel check u13 schutzbestimmung erlaubt"},
 {c:"Nachwuchs",t:"Zahnschutz ist Pflicht",x:"Für alle Spieler von U15 bis U20 ist in NRW das Tragen eines Zahnschutzes während des Spiels vorgeschrieben.",k:"ehv nrw anhang 4 nachwuchs zahnschutz mundschutz pflicht ausrüstung"},
 {c:"Nachwuchs",t:"A- und B-Mannschaft",x:"Ein Verein darf pro Altersklasse höchstens zwei Mannschaften melden. Wer in der Stammmeldung der höheren Mannschaft steht, darf in derselben Saison nicht in der tieferen Mannschaft eingesetzt werden. Eine einmalige Ummeldung ist vom 1. Dezember bis 31. Januar möglich; wer dann nach unten wechselt, darf bis Saisonende nicht mehr in der höheren Mannschaft spielen.",k:"ehv nrw anhang 4 nachwuchs u15a u15b zwei mannschaften stammmeldung ummeldung wechsel a b"},
 {c:"Nachwuchs",t:"Die ersten beiden Spiele",x:"Wer in der Erstmeldung der höchsten Mannschaft steht, dort aber in den ersten beiden Meisterschaftsspielen nicht eingesetzt wird, zählt nicht mehr zur Mindestmeldestärke. Ausnahme: ärztlich nachgewiesene Krankheit, Antrag mit Attest innerhalb von 5 Werktagen nach dem zweiten Spiel.",k:"ehv nrw anhang 4 nachwuchs erstmeldung einsatz zwei spiele krank attest"},
 {c:"Nachwuchs",t:"Höchstens zwei Mannschaften pro Spieler",x:"Von U13 bis U20 darf ein Spieler im NRW-Nachwuchs für höchstens zwei Mannschaften gemeldet und eingesetzt werden – egal ob höhere Altersklasse, A- und B-Mannschaft oder Doppellizenz. Torhüter mit Doppellizenz dürfen ausnahmsweise in einer dritten Mannschaft spielen. Auswahlmannschaften zählen nicht mit.",k:"ehv nrw anhang 4 nachwuchs zwei mannschaften einsatz grenze doppellizenz torhüter"},
 {c:"Nachwuchs",t:"Torhüter-Einsatzzeiten U13/U15",x:"Sind mehr als ein Torhüter gemeldet, müssen alle spielen: Jeder braucht bis Saisonende mindestens 10 % der Eiszeit, keiner darf mehr als 75 % spielen. Ausgenommen sind Torhüter aus einer jüngeren Altersklasse.",k:"ehv nrw anhang 4 nachwuchs torhüter torwart goalie einsatzzeit prozent time on ice"},
 {c:"Nachwuchs",t:"Mindestens so viele Spieler zum Spiel",x:"Mindestantrittsstärke U15 in 2026/27: Landesliga 10 Feldspieler + 2 Torhüter, Bezirksliga 10 + 1, Regionalliga A 9 + 1, Regionalliga B 13 + 2 (1b-Teams 11 + 2).",k:"ehv nrw anhang 4 nachwuchs antrittsstärke mindestens spieler anzahl kader landesliga bezirksliga"},
 {c:"Nachwuchs",t:"Kadergröße bei der Meldung",x:"Eine Nachwuchsmannschaft muss mindestens 13 Feldspieler und 1 Torhüter melden (ab 2027/28: 2 Torhüter), in der U13/U15-Regionalliga 15 + 2. Hat ein Verein zwei Mannschaften, gelten eigene Zahlen, z. B. U15 Landesliga als erste Mannschaft 15 + 1, U15 Landes- oder Bezirksliga als 1b-Team 14 + 2.",k:"ehv nrw anhang 4 nachwuchs meldestärke kader meldung anzahl spieler 1b"},
 {c:"Nachwuchs",t:"Doppellizenz",x:"Mit einer Doppellizenz kann ein Spieler zusätzlich für einen anderen Verein spielen (Antrag 1. Juni bis 31. Januar, kostenpflichtig, Stammverein muss zustimmen). Pro Spiel höchstens 5 Feldspieler und 2 Torhüter mit Doppellizenz (U13/U15-Regionalliga: 5 + 1). Ein Wechsel ist nur einmal pro Saison bis 31. Januar möglich.",k:"ehv nrw anhang 4 nachwuchs doppellizenz anderer verein lizenz"},
 {c:"Nachwuchs",t:"Spielerinnen",x:"Spielerinnen dürfen eine Altersklasse tiefer spielen: in der U15 auch Spielerinnen der U17 (junger und alter Jahrgang), in der U13 Spielerinnen des jungen U15-Jahrgangs. Ein Wechsel in die Gegenrichtung ist in derselben Saison nicht mehr erlaubt.",k:"ehv nrw anhang 4 nachwuchs mädchen spielerinnen frauen altersklasse tiefer"},
 {c:"Nachwuchs",t:"Kontingentspieler",x:"Von U13 bis U20 dürfen pro Mannschaft höchstens zwei transferkartenpflichtige Spieler eingesetzt werden. EU-Bürger mit regelmäßigem Wohnsitz am Vereinsort sind ausgenommen.",k:"ehv nrw anhang 4 nachwuchs transferkarte kontingent ausländer eu"},
 {c:"Nachwuchs",t:"Tabelle bei Punktgleichheit",x:"Im NRW-Nachwuchs entscheidet bei zwei punktgleichen Mannschaften der direkte Vergleich, wer in der Tabelle vorn steht.",k:"ehv nrw anhang 4 nachwuchs tabelle punkte gleich direkter vergleich platzierung"},
 {c:"Nachwuchs",t:"Spielzeiten am Wochenende",x:"Samstags und sonntags darf ein Spiel nicht vor 9:00 Uhr beginnen, sonntags nicht nach 18:00 Uhr (Ausnahmen nur mit Zustimmung des Gegners und der Ligenleitung). Bei mehr als 200 km Anreise wird am Wochenende gespielt; Freitags- und Feiertagsspiele nur unter 200 km und wenn beide Vereine zustimmen.",k:"ehv nrw anhang 4 nachwuchs anstoß uhrzeit samstag sonntag freitag feiertag 200 km anreise"},
 {c:"Nachwuchs",t:"Spielverlegung",x:"Überschneidet sich ein Spiel mit später angesetzten DEB-Spielen, bleibt die Verlegung kostenfrei, wenn der Antrag mindestens zwei Wochen vorher bei der Ligenleitung eingeht.",k:"ehv nrw anhang 4 nachwuchs verlegung termin verschieben ligenleitung"},
 {c:"Nachwuchs",t:"Meldeliga",x:"U7 bis U15 sind in NRW Meldeligen: Mannschaften werden ohne sportliche Qualifikation gemeldet, die Einteilung entscheidet der Nachwuchs-Sportausschuss. In U17 und U20 gibt es vorher eine Qualifikationsrunde.",k:"ehv nrw anhang 4 nachwuchs meldeliga liga einteilung qualifikation u17 u20"},
 {c:"Nachwuchs",t:"Schutzausrüstung im Nachwuchs",x:"Bis U18 ist ein Vollvisier oder Gitter Pflicht, fest am Helm. Ein Halsschutz gegen Schnittverletzungen ist ebenfalls vorgeschrieben. In NRW ist für U15 bis U20 außerdem ein Zahnschutz im Spiel Pflicht.",k:"gitter vollvisier helm halsschutz mundschutz zahnschutz ausrüstung schutz"},
 {c:"Nachwuchs",t:"Ausrüstung nicht in Ordnung",x:"Ist die Ausrüstung nicht regelgerecht (zum Beispiel lockerer Helm oder fehlendes Gitter), muss der Spieler sie in Ordnung bringen und darf so lange nicht mitspielen. Seit 2026/27 gelten dafür dieselben Regeln wie bei den Erwachsenen.",k:"ausrüstung helm verstoß"},
 {c:"Nachwuchs",t:"Pfiff nach einem Tor",x:"Im Nachwuchs pfeift der Schiedsrichter nach jedem Tor. In einigen Profiligen zeigt er stattdessen nur ins Tor.",k:"pfiff tor schiedsrichter"},
 {c:"Nachwuchs",t:"Kapitän",x:"Eine Mannschaft hat entweder einen Kapitän (C) und zwei Assistenten (A) oder keinen Kapitän und drei Assistenten. Nur sie dürfen mit dem Schiedsrichter über Regelfragen sprechen.",k:"kapitän c a assistent"},
 {c:"Nachwuchs",t:"Drittellänge und Verlängerung",x:"Länge der Drittel, Verlängerung und Penaltyschießen stehen in den allgemeinen Durchführungsbestimmungen des EHV NRW; die besonderen Nachwuchs-Regeln in Anhang 4 – Nachwuchs (Stand 13.05.2026).",k:"ehv nrw durchführungsbestimmungen drittel länge verlängerung penaltyschießen"},

 {c:"Begriffe",t:"Slot",x:"Der Bereich direkt vor dem Tor zwischen den Bullykreisen. Von hier fallen die meisten Tore.",k:"slot tor bereich"},
 {c:"Begriffe",t:"Powerplay / Penalty Killing",x:"Powerplay ist das Spiel in Überzahl, Penalty Killing das Verteidigen in Unterzahl.",k:"überzahl unterzahl pk pp"},
 {c:"Begriffe",t:"Forechecking / Backchecking",x:"Beim Forechecking stört eine Mannschaft den Gegner schon in dessen Drittel. Beim Backchecking fahren die Stürmer schnell zurück, um zu verteidigen.",k:"forecheck backcheck pressing"},
 {c:"Begriffe",t:"Breakaway",x:"Ein Spieler läuft allein auf den Torhüter zu, kein Verteidiger ist mehr vor ihm.",k:"alleingang durchbruch konter"},
 {c:"Begriffe",t:"Rebound",x:"Der Abpraller vom Torhüter. Wer ihn zuerst erreicht, hat oft eine gute Chance.",k:"abpraller nachschuss"},
 {c:"Begriffe",t:"Bodycheck",x:"Den Gegner, der den Puck führt, mit dem Körper (Hüfte oder Schulter) von vorn oder von der Seite vom Puck trennen. In NRW ist das in U7 bis U13 verboten, ab der U15 erlaubt.",k:"körperspiel check körper"}
,
 {c:"Handzeichen",t:"Tor",x:"Der Schiedsrichter zeigt mit ausgestrecktem Arm auf das Tor, in das der Puck regulär gegangen ist.",k:"schiedsrichter zeichen signal handzeichen puck im netz treffer",p:"tor"},
 {c:"Handzeichen",t:"Kein Tor / Abwinken",x:"Beide Arme seitlich in Schulterhöhe ausgestreckt, Handflächen nach unten, mit einer Wischbewegung vor dem Körper. Beim Schiedsrichter heißt das kein Tor, kein Handpass oder kein hoher Stock, beim Linienrichter kein Icing oder kein Abseits.",k:"schiedsrichter zeichen signal handzeichen wash out abwinken kein tor aufgehoben",p:"abwinken"},
 {c:"Handzeichen",t:"Angezeigte Strafe",x:"Der freie Arm (ohne Pfeife) wird ganz nach oben gestreckt. Gepfiffen wird, sobald die foulende Mannschaft den Puck hat.",k:"schiedsrichter zeichen signal handzeichen verzögerte strafe arm hoch delayed penalty",p:"strafe"},
 {c:"Handzeichen",t:"Abseits angezeigt",x:"Der Linienrichter streckt den freien Arm senkrecht nach oben, die Hand flach. Senkt er den Arm, ist das Abseits aufgehoben.",k:"schiedsrichter zeichen signal handzeichen verzögertes abseits linienrichter arm hoch",p:"strafe"},
 {c:"Handzeichen",t:"Abseits gepfiffen",x:"Nach dem Pfiff zeigt der Linienrichter mit waagerecht ausgestrecktem Arm auf die blaue Linie.",k:"schiedsrichter zeichen signal handzeichen abseits offside linienrichter blaue linie",p:"abseits"},
 {c:"Handzeichen",t:"Icing",x:"Der hintere Linienrichter streckt zuerst einen Arm über den Kopf. Ist Icing gepfiffen, zeigt er auf den Bullypunkt und verschränkt die Arme vor der Brust.",k:"schiedsrichter zeichen signal handzeichen icing weitschuss linienrichter arme verschränkt gekreuzt",p:"icing"},
 {c:"Handzeichen",t:"Penalty",x:"Beide Arme über dem Kopf gekreuzt.",k:"schiedsrichter zeichen signal handzeichen strafschuss penalty",p:"penalty"},
 {c:"Handzeichen",t:"Auszeit",x:"Beide Hände bilden vor der Brust ein „T“.",k:"schiedsrichter zeichen signal handzeichen timeout auszeit t",p:"auszeit"},
 {c:"Handzeichen",t:"Zu viele Spieler",x:"Sechs Finger vor der Brust: eine Hand offen, an der anderen ein Finger.",k:"schiedsrichter zeichen signal handzeichen zu viele spieler wechselfehler sechs finger bankstrafe",p:"sechs"},
 {c:"Handzeichen",t:"Halten",x:"Eine Hand umfasst vor der Brust das Handgelenk der anderen.",k:"schiedsrichter zeichen signal handzeichen holding halten handgelenk",p:"halten"},
 {c:"Handzeichen",t:"Haken",x:"Ziehbewegung mit beiden Armen, als würde man etwas zum Bauch heranziehen.",k:"schiedsrichter zeichen signal handzeichen hooking haken ziehen",p:"haken"},
 {c:"Handzeichen",t:"Beinstellen",x:"Mit einer Hand unterhalb des Knies gegen das Bein schlagen, beide Schlittschuhe bleiben auf dem Eis.",k:"schiedsrichter zeichen signal handzeichen tripping beinstellen bein",p:"bein"},
 {c:"Handzeichen",t:"Behinderung",x:"Die Arme sind vor der Brust zu einem X gekreuzt, die Fäuste geschlossen, ohne Bewegung.",k:"schiedsrichter zeichen signal handzeichen interference behinderung x",p:"behinderung"},
 {c:"Handzeichen",t:"Hoher Stock",x:"Beide Fäuste übereinander in Stirnhöhe, als würde man einen Schläger halten. Dasselbe Zeichen gibt es, wenn der Puck mit dem hohen Stock gespielt wurde.",k:"schiedsrichter zeichen signal handzeichen high sticking hoher stock fäuste stirn",p:"hoch"},
 {c:"Handzeichen",t:"Stockschlag",x:"Mit der Handkante über den Unterarm der anderen Hand hacken.",k:"schiedsrichter zeichen signal handzeichen slashing stockschlag hacken unterarm",p:"stockschlag"},
 {c:"Handzeichen",t:"Crosscheck",x:"Beide Fäuste vor der Brust ein Stück nach vorn und zurück stoßen.",k:"schiedsrichter zeichen signal handzeichen cross checking crosscheck fäuste stoßen",p:"crosscheck"},
 {c:"Handzeichen",t:"Bandencheck",x:"Vor der Brust mit der Faust in die offene Hand der anderen Seite schlagen.",k:"schiedsrichter zeichen signal handzeichen boarding bandencheck faust hand",p:"bande"},
 {c:"Handzeichen",t:"Check von hinten",x:"Beide Arme mit offenen, nach vorn gerichteten Handflächen auf Schulterhöhe nach vorn stoßen.",k:"schiedsrichter zeichen signal handzeichen checking from behind check von hinten stoßen",p:"hinten"},
 {c:"Handzeichen",t:"Check gegen Kopf oder Nacken",x:"Mit der flachen Hand seitlich an den eigenen Kopf klopfen.",k:"schiedsrichter zeichen signal handzeichen kopfcheck head kopf nacken",p:"kopf"},
 {c:"Handzeichen",t:"Unkorrekter Körperangriff",x:"Die geballten Fäuste vor der Brust umeinander kreisen lassen.",k:"schiedsrichter zeichen signal handzeichen charging körperangriff kreisen",p:"charging"},
 {c:"Handzeichen",t:"Ellbogencheck",x:"Mit der Hand auf den Ellbogen des anderen Arms tippen.",k:"schiedsrichter zeichen signal handzeichen elbowing ellbogen",p:"ellbogen"},
 {c:"Handzeichen",t:"Kniecheck",x:"Mit der flachen Hand auf das Knie schlagen, beide Schlittschuhe bleiben auf dem Eis.",k:"schiedsrichter zeichen signal handzeichen kneeing knie",p:"knie"},
 {c:"Handzeichen",t:"Stechen",x:"Beide Hände stoßen vor dem Körper nach vorn und fallen dann an die Seite, also umgekehrt zum Haken.",k:"schiedsrichter zeichen signal handzeichen spearing stechen",p:"stechen"},
 {c:"Handzeichen",t:"Stockendstoß",x:"Ein Unterarm mit geballter Faust fährt unter dem anderen Unterarm hindurch, dessen Handfläche nach unten zeigt.",k:"schiedsrichter zeichen signal handzeichen butt ending stockendstoß",p:"endstoss"},
 {c:"Handzeichen",t:"Spielverzögerung",x:"Die flache Hand gleitet vor der Körpermitte an der anderen Hand entlang nach oben.",k:"schiedsrichter zeichen signal handzeichen delay of game spielverzögerung",p:"verzoegerung"},
 {c:"Handzeichen",t:"Unsportliches Verhalten / Schwalbe",x:"Beide Hände an den Hüften, dazu zeigt der Schiedsrichter zwei Finger für zwei Minuten.",k:"schiedsrichter zeichen signal handzeichen unsportlich schwalbe diving embellishment hüfte zwei",p:"huefte2"},
 {c:"Handzeichen",t:"Disziplinarstrafe",x:"Beide Hände an den Hüften: zehn Minuten Disziplinarstrafe (auch bei der Spieldauer-Disziplinarstrafe).",k:"schiedsrichter zeichen signal handzeichen misconduct disziplinarstrafe zehn minuten hüfte spieldauer",p:"huefte"},
 {c:"Handzeichen",t:"Matchstrafe",x:"Mit der flachen Hand oben auf den eigenen Kopf klopfen.",k:"schiedsrichter zeichen signal handzeichen match penalty matchstrafe kopf",p:"match"},
 {c:"Handzeichen",t:"Handpass",x:"Die offene Handfläche ein- oder zweimal nach vorn stoßen.",k:"schiedsrichter zeichen signal handzeichen handpass hand",p:"handpass"},
 {c:"Handzeichen",t:"Bully-Verwarnung",x:"Ein angewinkelter Arm mit offener Handfläche nach oben, zur Seite der Mannschaft, die beim Bully einen Fehler gemacht hat.",k:"schiedsrichter zeichen signal handzeichen bully anspiel verwarnung faceoff",p:"bully"}
];
/* Schiedsrichter-Piktogramme: Figur von vorn, Arme als Schulter→Ellbogen→Hand, f = Faust, o = offene Hand */
const SIG_POSE={
 tor:{L:[40,70,38,88,"o"],R:[92,40,112,32,"o"],x:'<path d="M112 22l-6 -4M112 22l-7 2" class="sa"/>'},
 abwinken:{L:[26,48,6,48,"o"],R:[94,48,114,48,"o"],x:'<path d="M42 60h36M42 60l5 -4M42 60l5 4M78 60l-5 -4M78 60l-5 4" class="sa"/>'},
 strafe:{L:[40,70,38,88,"o"],R:[80,28,82,8,"o"]},
 abseits:{L:[40,70,38,88,"o"],R:[94,48,114,48,"o"],x:'<path d="M100 60h16" class="sb"/>'},
 icing:{L:[40,66,72,56,"f"],R:[80,66,48,56,"f"]},
 penalty:{L:[42,26,74,8,"f"],R:[78,26,46,8,"f"]},
 auszeit:{L:[34,58,72,44,"o"],R:[64,86,60,52,"o"]},
 sechs:{L:[38,66,50,54,"o"],R:[82,66,70,54,"1"]},
 halten:{L:[38,68,58,58,"f"],R:[82,68,64,58,"o"]},
 haken:{L:[38,66,52,70,"f"],R:[82,66,68,70,"f"],x:'<path d="M50 80q10 6 20 0M50 80l3 -5M70 80l-3 -5" class="sa"/>'},
 bein:{L:[40,70,38,88,"o"],R:[86,74,74,110,"o"],x:'<path d="M84 112l-6 0" class="sa"/>'},
 behinderung:{L:[38,70,72,54,"f"],R:[82,70,48,54,"f"]},
 hoch:{L:[52,40,84,26,"f"],R:[90,44,84,36,"f"]},
 stockschlag:{L:[36,64,64,60,"o"],R:[86,50,62,46,"o"],x:'<path d="M70 40v10M70 50l-3 -4M70 50l3 -4" class="sa"/>'},
 crosscheck:{L:[38,66,52,58,"f"],R:[82,66,68,58,"f"],x:'<path d="M48 46h24M48 46l4 -3M48 46l4 3M72 46l-4 -3M72 46l-4 3" class="sa"/>'},
 bande:{L:[36,66,56,60,"o"],R:[84,62,66,56,"f"],x:'<path d="M80 48l-8 6" class="sa"/>'},
 hinten:{L:[34,56,46,46,"O"],R:[86,56,74,46,"O"],x:'<path d="M60 36v-8M60 28l-3 4M60 28l3 4" class="sa"/>'},
 kopf:{L:[40,70,38,88,"o"],R:[94,48,73,30,"o"]},
 charging:{L:[38,68,54,60,"f"],R:[82,68,66,56,"f"],x:'<circle cx="60" cy="58" r="13" class="sc"/><path d="M73 58l-3 -5M73 58l3 -5" class="sa"/>'},
 ellbogen:{L:[30,62,40,42,"f"],R:[72,76,36,62,"o"]},
 knie:{L:[40,70,38,88,"o"],R:[84,80,70,104,"o"]},
 stechen:{L:[38,66,54,62,"f"],R:[82,66,66,62,"f"],x:'<path d="M60 70v14M60 84l-3 -4M60 84l3 -4" class="sa"/>'},
 endstoss:{L:[36,62,66,58,"o"],R:[84,76,58,68,"f"],x:'<path d="M82 68h-12M70 68l4 -3M70 68l4 3" class="sa"/>'},
 verzoegerung:{L:[38,76,60,74,"o"],R:[82,70,62,60,"o"],x:'<path d="M74 70v-12M74 58l-3 4M74 58l3 4" class="sa"/>'},
 huefte:{L:[30,68,46,88,"f"],R:[90,68,74,88,"f"]},
 huefte2:{L:[30,68,46,88,"f"],R:[90,68,74,88,"f"],x:'<text x="100" y="40" class="st">2</text>'},
 match:{L:[40,70,38,88,"o"],R:[90,26,62,12,"o"]},
 handpass:{L:[40,70,38,88,"o"],R:[84,62,70,50,"O"],x:'<path d="M80 40l8 -6M88 34l-5 0M88 34l-1 5" class="sa"/>'},
 bully:{L:[40,70,38,88,"o"],R:[92,64,104,48,"u"]}
};
/* 1.9.1.140: Handzeichen als Bilder (Ordner handzeichen, 320 x 360, Figur unten bündig); die gezeichnete Figur bleibt als Ersatz, falls ein Bild nicht lädt */
function sigSvg(key){
  if(!SIG_POSE[key]) return "";
  return '<img class="rlPic rlImg" src="handzeichen/'+key+'.webp" alt="" width="100" height="112" loading="lazy" decoding="async" onerror="this.outerHTML=sigSvgOld(\''+key+'\')">';
}
function sigSvgOld(key){
  const p=SIG_POSE[key]; if(!p) return "";
  const sh={L:[45,48],R:[75,48]};
  const hand=(x,y,t)=>t==="f"?`<circle cx="${x}" cy="${y}" r="5" class="sf"/>`
    :t==="1"?`<circle cx="${x}" cy="${y}" r="4.5" class="sf"/><path d="M${x} ${y-4}v-7" class="sg"/>`
    :t==="u"?`<path d="M${x-7} ${y}q7 5 14 0" class="sg"/><circle cx="${x}" cy="${y+1}" r="4" class="so"/>`
    :t==="O"?`<rect x="${x-5}" y="${y-8}" width="10" height="13" rx="4" class="so"/>`
    :`<rect x="${x-4}" y="${y-6}" width="8" height="11" rx="3.5" class="so"/>`;
  let arms="";
  for(const s of ["L","R"]){
    const [ex,ey,hx,hy,t]=p[s], [sx,sy]=sh[s];
    const mx=(sx+ex)/2, my=(sy+ey)/2;
    arms+=`<path d="M${sx} ${sy}L${ex} ${ey}L${hx} ${hy}" class="sk"/><circle cx="${mx}" cy="${my}" r="3.6" class="sb2"/>`+hand(hx,hy,t);
  }
  return `<svg viewBox="0 0 120 140" class="rlPic" aria-hidden="true">
<path d="M50 92L48 130M70 92L72 130" class="sl"/><path d="M40 131h14M66 131h14" class="ss"/>
<rect x="44" y="42" width="32" height="52" rx="9" class="st0"/>
<path d="M50 44v48M56 43v50M62 43v50M68 43v50M73 44v46" class="st1"/>
<rect x="44" y="86" width="32" height="10" rx="3" class="sp"/>
<circle cx="60" cy="27" r="11" class="sh"/><path d="M48 27q12 -20 24 0z" class="shh"/>
${arms}${p.x||""}</svg>`;
}
const RULE_CATS=["Alle",...new Set(RULES.map(r=>r.c))];
let ruleCat="Alle";
function rlNorm(s){return String(s||"").toLocaleLowerCase("de-DE").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[–—-]/g," ")}
function rlEsc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function rlMark(text,words){
  // Treffer hervorheben (Umlaut-unabhängig): Positionen im normalisierten Text auf den Originaltext übertragen
  if(!words.length) return rlEsc(text);
  const map=[];let n="";
  for(let i=0;i<text.length;i++){const part=rlNorm(text[i]);for(let k=0;k<part.length;k++){n+=part[k];map.push(i)}}
  const hit=new Array(text.length).fill(false);
  for(const w of words){let p=n.indexOf(w);while(p>=0){for(let k=p;k<p+w.length;k++)hit[map[k]]=true;p=n.indexOf(w,p+w.length)}}
  let out="",open=false;
  for(let i=0;i<text.length;i++){if(hit[i]&&!open){out+="<mark>";open=true}if(!hit[i]&&open){out+="</mark>";open=false}out+=rlEsc(text[i])}
  return out+(open?"</mark>":"");
}
function renderRules(){
  const list=document.getElementById("rulesList"), menu=document.getElementById("rulesMenu"), act=document.getElementById("rulesActive"), cnt=document.getElementById("rulesCount");
  if(!list||!menu) return;
  const chips=document.getElementById("rulesChips");
  if(chips){ const sl=chips.scrollLeft; chips.innerHTML=RULE_CATS.map(c=>'<button type="button" role="tab" aria-selected="'+(c===ruleCat)+'" class="'+(c===ruleCat?"on":"")+'" data-cat="'+rlEsc(c)+'">'+rlEsc(c==="Alle"?"Alle":c)+'<span>'+(c==="Alle"?RULES.length:RULES.filter(r=>r.c===c).length)+'</span></button>').join(""); chips.scrollLeft=sl; }
  menu.innerHTML=RULE_CATS.map(c=>'<button type="button" class="'+(c===ruleCat?"on":"")+'" data-cat="'+rlEsc(c)+'">'+rlEsc(c==="Alle"?"Alle Themen":c)+'<span>'+(c==="Alle"?RULES.length:RULES.filter(r=>r.c===c).length)+'</span></button>').join("");
  if(act){ act.hidden=ruleCat==="Alle"; act.innerHTML=ruleCat==="Alle"?"":'Thema: <button type="button" data-cat="Alle" aria-label="Thema '+rlEsc(ruleCat)+' entfernen">'+rlEsc(ruleCat)+' ✕</button>'; }
  const q=rlNorm(document.getElementById("rulesSearch")?.value||"").trim();
  const words=q.split(/\s+/).filter(w=>w.length>0);
  const score=r=>words.reduce((s,w)=>s+(rlNorm(r.t).includes(w)?4:0)+(rlNorm(r.k+" "+r.c).includes(w)?2:0)+(rlNorm(r.x).includes(w)?1:0),0);
  const hits=RULES.filter(r=>(ruleCat==="Alle"||words.length||r.c===ruleCat)&&words.every(w=>rlNorm(r.t+" "+r.x+" "+r.k+" "+r.c).includes(w)))
    .map((r,i)=>({r,i,s:score(r)})).sort((a,b)=>b.s-a.s||a.i-b.i).map(o=>o.r);
  /* 1.22.5: ohne Suchbegriff Themen-Kacheln, mit Suchbegriff Trefferliste über alle Themen */
  ruleCat="Alle";
  const tiles=document.getElementById("rulesTiles");
  if(tiles){
    const RL_IC={"Spielablauf":SI("stopwatch"),"Abseits & Icing":SI("ice"),"Strafen":SI("stop"),"Fouls":SI("warn"),"Torhüter":SI("pad"),"Tore & Statistik":SI("goal"),"Nachwuchs":SI("kid"),"Begriffe":SI("book"),"Handzeichen":SI("hand")};
    tiles.hidden=words.length>0; list.hidden=words.length===0;
    if(!words.length){
      tiles.innerHTML=RULE_CATS.filter(c=>c!=="Alle").map(c=>{const n=RULES.filter(r=>r.c===c).length;return '<button type="button" class="rlTile" data-topic="'+rlEsc(c)+'"><span class="ti" aria-hidden="true">'+(RL_IC[c]||SI("book"))+'</span><b>'+rlEsc(c)+'</b><small>'+n+(n===1?" Regel":" Regeln")+'</small></button>'}).join("")
        +'<button type="button" class="rlTile all" data-topic="Alle"><span class="ti" aria-hidden="true">'+SI("books")+'</span><span><b>Alle Regeln</b><br><small>'+RULES.length+' Regeln von A bis Z</small></span></button>';
      if(cnt) cnt.textContent=RULES.length+" Regeln";
      return;
    }
  }
  if(cnt) cnt.textContent=hits.length===RULES.length?RULES.length+" Regeln":hits.length+" von "+RULES.length;
  list.innerHTML=hits.length?hits.map(r=>'<article class="infoCard rlItem'+(r.p?' rlHas':'')+'">'+(r.p?sigSvg(r.p):'')+'<div>'+(ruleCat==="Alle"||words.length?'<span class="rlCat">'+rlEsc(r.c)+'</span>':'')+'<b>'+rlMark(r.t,words)+'</b><p>'+rlMark(r.x,words)+'</p></div></article>').join("")
    :'<div class="infoCard rlEmpty">'+emptyBox("search","Keine Regel gefunden","Versuch es mit einem anderen Wort, z. B. „Strafe“, „Tor“ oder „Torhüter“.")+'</div>';
}
document.getElementById("rulesSearch")?.addEventListener("input",()=>{renderRules();if(window.scrollY>140)window.scrollTo({top:0})});
function rlTopicOpen(cat){
  const m=document.getElementById("rulesModal"), l=document.getElementById("rulesModalList"); if(!m||!l)return;
  const rs=cat==="Alle"?RULES.slice().sort((a,b)=>a.t.localeCompare(b.t,"de")):RULES.filter(r=>r.c===cat);
  document.getElementById("rulesModalTitle").textContent=cat==="Alle"?"Alle Regeln":cat;
  document.getElementById("rulesModalSub").textContent=rs.length+(rs.length===1?" Regel":" Regeln")+(cat==="Alle"?" · alphabetisch":"");
  l.innerHTML=rs.map(r=>'<article class="infoCard rlItem'+(r.p?' rlHas':'')+'">'+(r.p?sigSvg(r.p):'')+'<div>'+(cat==="Alle"?'<span class="rlCat">'+rlEsc(r.c)+'</span>':'')+'<b>'+rlEsc(r.t)+'</b><p>'+rlEsc(r.x)+'</p></div></article>').join("");
  m.hidden=false; m.setAttribute("aria-hidden","false"); m.querySelector(".matchModalBox").scrollTop=0;
}
function rlTopicClose(){const m=document.getElementById("rulesModal");if(!m)return;m.hidden=true;m.setAttribute("aria-hidden","true");}
document.getElementById("rulesTiles")?.addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(b)rlTopicOpen(b.dataset.topic);});
document.getElementById("rulesModalClose")?.addEventListener("click",rlTopicClose);
document.getElementById("rulesModal")?.addEventListener("click",e=>{if(e.target.id==="rulesModal")rlTopicClose();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")rlTopicClose();});
function rlMenuOpen(o){const m=document.getElementById("rulesMenu"),b=document.getElementById("rulesMenuBtn");if(!m||!b)return;m.hidden=!o;b.setAttribute("aria-expanded",o?"true":"false");}
document.getElementById("rulesMenuBtn")?.addEventListener("click",()=>rlMenuOpen(document.getElementById("rulesMenu").hidden));
document.getElementById("rulesView")?.addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;ruleCat=b.dataset.cat;const se=document.getElementById("rulesSearch");if(se&&se.value&&b.closest("#rulesChips")){se.value="";}rlMenuOpen(false);renderRules();document.querySelector('#rulesChips [data-cat="'+CSS.escape(ruleCat)+'"]')?.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});if(window.scrollY>140)window.scrollTo({top:0});});
document.getElementById("infoTopBtn").onclick=()=>showView("info");
document.getElementById("settingsTopBtn").onclick=()=>showView("settings");


const shareAppBtn=document.getElementById("shareApp");
if(shareAppBtn){
  shareAppBtn.onclick=async()=>{
    trackAnalyticsEvent("app_share");
    const shareData={title:APP_CFG.appName+" – Spielplan",text:APP_CFG.appName+" – Spielplan U13 und U15 des "+APP_CFG.club+", Saison "+APP_CFG.season,url:window.location.href};
    try{
      if(navigator.share){
        await navigator.share(shareData);
      }else if(navigator.clipboard){
        await navigator.clipboard.writeText(window.location.href);
        alert("App-Link wurde kopiert.");
      }else{
        window.prompt("App-Link kopieren:",window.location.href);
      }
    }catch(e){
      if(e && e.name!=="AbortError") alert("Teilen war nicht möglich.");
    }
  };
}
document.getElementById("filterToggle").onclick=()=>{const p=document.getElementById("filterPanel"),open=!p.classList.contains("open");p.classList.toggle("open",open);document.getElementById("filterToggle").setAttribute("aria-expanded",String(open));p.setAttribute("aria-hidden",String(!open));};
document.querySelectorAll(".filterOption").forEach(b=>b.onclick=()=>{const f=b.dataset.filter;if(window.APP_CFG.teams[f]){if(activeTeamFilters.has(f))activeTeamFilters.delete(f);else activeTeamFilters.add(f)}else{if(activeVenueFilters.has(f))activeVenueFilters.delete(f);else activeVenueFilters.add(f)}updateFilterUi();if(scheduleMode==="month")renderCalendar();else renderList("all")});
document.getElementById("filterReset").onclick=()=>{activeTeamFilters=new Set(window.MY_TEAMS);activeVenueFilters=new Set(["home","away"]);updateFilterUi();if(scheduleMode==="month")renderCalendar();else renderList("all")};
document.getElementById("opponentSearch").addEventListener("input",()=>{renderOpponents();if(window.omSearch)window.omSearch();});
document.getElementById("chronoBtn").onclick=()=>setScheduleMode("chrono");
document.getElementById("monthBtn").onclick=()=>setScheduleMode("month");
document.getElementById("todayBtn").onclick=()=>{const p=document.getElementById("filterPanel");p.classList.remove("open");p.setAttribute("aria-hidden","true");document.getElementById("filterToggle").setAttribute("aria-expanded","false");trackAnalyticsEvent("today_jump");scrollToToday(true)};
document.getElementById("downloadCal").onclick=openCalFilter;
document.getElementById("calFilterClose").onclick=closeCalFilter;
document.getElementById("calFilterCancel").onclick=closeCalFilter;
document.getElementById("calFilterGo").onclick=downloadSelectedCalendar;
document.getElementById("calFilterModal").addEventListener("click",e=>{if(e.target.id==="calFilterModal")closeCalFilter();});
document.querySelectorAll(".calChip[data-cal]").forEach(b=>b.onclick=()=>{
  const [k,v]=b.dataset.cal.split(":");
  if(k==="range")calSel.range=v;
  else{const set=k==="team"?calSel.teams:calSel.venues; if(set.has(v)){if(set.size>1)set.delete(v)}else set.add(v)}
  updateCalFilterUI();
});
document.getElementById("downloadPdf").onclick=openPdfFilter;
document.querySelectorAll(".pdfFilterBtn").forEach(b=>b.onclick=()=>{
  const f=b.dataset.pdfFilter;
  if(f==="all"){ pdfSelectedFilters=["all"]; }
  else {
    pdfSelectedFilters=pdfSelectedFilters.filter(x=>x!=="all");
    const pair=window.APP_CFG.teams[f]?window.MY_TEAMS:["home","away"];
    const other=pair.find(x=>x!==f);
    if(pdfSelectedFilters.includes(f)) pdfSelectedFilters=pdfSelectedFilters.filter(x=>x!==f);
    else { pdfSelectedFilters=pdfSelectedFilters.filter(x=>x!==other); pdfSelectedFilters.push(f); }
    if(!pdfSelectedFilters.length) pdfSelectedFilters=["all"];
  }
  updatePdfFilterUI();
});
document.getElementById("pdfFilterPrint").onclick=()=>{const f=pdfSelectedFilters.slice();closePdfFilter();printAllGamesPdf(f);};
document.getElementById("pdfFilterCancel").onclick=closePdfFilter;
document.getElementById("pdfFilterClose").onclick=closePdfFilter;
document.getElementById("pdfFilterModal").addEventListener("click",e=>{if(e.target.id==="pdfFilterModal")closePdfFilter();});
document.getElementById("matchModalClose").onclick=closeMatchDetails;
document.getElementById("opponentModalClose").onclick=closeOpponentDetails;
document.querySelectorAll("[data-bilanz]").forEach(b=>b.onclick=()=>openBilanz(b.dataset.bilanz));
document.getElementById("bilanzModalClose").onclick=closeBilanz;
document.getElementById("bilanzModal").addEventListener("click",e=>{if(e.target.id==="bilanzModal")closeBilanz()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!document.getElementById("bilanzModal").hidden)closeBilanz()});
document.getElementById("opponentModal").addEventListener("click",e=>{if(e.target.id==="opponentModal")closeOpponentDetails();});
document.getElementById("matchModal").addEventListener("click",e=>{if(e.target.id==="matchModal")closeMatchDetails()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const am=document.getElementById("adminModal");if(am&&!am.hidden){closeAdminModal();return;}if(!document.getElementById("matchModal").hidden)closeMatchDetails();}});
document.querySelectorAll(".teamCard").forEach(b=>b.onclick=()=>{showView("schedule");activeTeamFilters=new Set([b.dataset.team]);activeVenueFilters=new Set(["home","away"]);updateFilterUi();if(scheduleMode==="month")renderCalendar();else renderList("all")});
if("serviceWorker" in navigator){(function(){
  const banner=document.getElementById("updateBanner");
  const RELOAD_KEY="grizzlysUpdateReloadAt";
  let reloadRequested=false,reloaded=false,dismissed=false,waitingWorker=null,suppressUntil=0;
  try{const t=Number(sessionStorage.getItem(RELOAD_KEY)||0);if(t&&Date.now()-t<120000)suppressUntil=t+120000;}catch(e){}
  function go(){if(reloaded)return;reloaded=true;location.reload();}
  const pageBuild=Number(((document.querySelector(".inVer")||{}).textContent||"").split(".").pop())||0;
  function workerBuild(worker){
    return new Promise(res=>{
      let done=false;const fin=v=>{if(!done){done=true;res(v)}};
      try{const ch=new MessageChannel();ch.port1.onmessage=e=>{const m=String((e.data&&e.data.cache)||"").match(/(\d+)$/);fin({b:m?Number(m[1]):0,hinweis:!(e.data&&e.data.hinweis===false)})};worker.postMessage({type:"GET_VERSION"},[ch.port2]);}catch(e){fin({b:0,hinweis:true})}
      setTimeout(()=>fin({b:0,hinweis:true}),1500);
    });
  }
  async function showBanner(worker){
    /* Die Seite selbst kommt immer frisch aus dem Netz. Ist sie schon so neu wie der wartende Service Worker,
       wird er still übernommen; ist er älter (veraltete Kopie vom Server), wird er ignoriert. */
    const info=await workerBuild(worker), wb=info.b;
    if(pageBuild&&wb<pageBuild)return;
    /* 1.9.1.112: Version ohne Update-Hinweis (Häkchen beim „Live gehen“ nicht gesetzt) – kommt still beim nächsten Öffnen */
    if(pageBuild&&wb>pageBuild&&!info.hinweis)return;
    if(pageBuild&&wb===pageBuild){try{worker.postMessage({type:"SKIP_WAITING"})}catch(e){}return}
    waitingWorker=worker;if(dismissed)return;
    const wait=suppressUntil-Date.now();
    if(wait>0){setTimeout(()=>{if(!dismissed&&waitingWorker)banner.hidden=false;},wait);return;}
    banner.hidden=false;
  }
  function track(reg){
    if(reg.waiting&&navigator.serviceWorker.controller)showBanner(reg.waiting);
    reg.addEventListener("updatefound",()=>{
      const nw=reg.installing;if(!nw)return;
      nw.addEventListener("statechange",()=>{if(nw.state==="installed"&&navigator.serviceWorker.controller)showBanner(nw);});
    });
  }
  document.getElementById("updateBannerReload").onclick=async()=>{
    const btn=document.getElementById("updateBannerReload");
    btn.disabled=true;btn.textContent="Wird aktualisiert…";
    reloadRequested=true;
    try{sessionStorage.setItem(RELOAD_KEY,String(Date.now()));}catch(e){}
    try{
      const reg=await navigator.serviceWorker.getRegistration();
      const w=(reg&&reg.waiting)||waitingWorker;
      if(w){
        w.addEventListener("statechange",()=>{if(w.state==="activated")go();});
        w.postMessage({type:"SKIP_WAITING"});
      }else go();
    }catch(e){go();}
    setTimeout(go,2500);
  };
  document.getElementById("updateBannerClose").onclick=()=>{dismissed=true;banner.hidden=true;};
  navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reloadRequested)go();});
applyHalloween(false);
  navigator.serviceWorker.register("./sw.js").then(reg=>{
    track(reg);
    const check=()=>reg.update().catch(()=>{});
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")check();});
    setInterval(check,30*60*1000);
  }).catch(()=>{});
})();}
updateFilterUi();renderNext();renderList("all");renderOpponents();standNote();loadStandings();document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadStandings()});setInterval(()=>{if(!document.hidden)loadStandings()},5*60000);

/* ===== Instagram-Bilder (Admin) =====
   Zeichnet aus den Spieldaten ein Bild 1080 x 1350 (Beitragsformat 4:5): Hallenfoto als Hintergrund,
   Heim oben links, Gast unten rechts. Die Gegner-Logos kommen aus dem Ordner "logos/" der App
   (gleiche Herkunft – fremde Bild-Adressen darf der Browser nicht in ein erzeugtes Bild übernehmen).
   Fehlt eine Logo-Datei, erscheint ein Kürzel im Kreis. */
const INSTA_LOGOS=LOGO_FILES;
const INSTA_LEAGUE=Object.fromEntries(Object.entries(APP_CFG.teams).map(([k,v])=>[k,v.league]));
/* 1.67.0: Farbpalette der erzeugten Bilder (Social Media, Hintergrundbilder) – im Vereinsdesign (html.d29) Anthrazit, Grau und Logo-Blau statt Navy und Orange, schmale Großbuchstaben statt Pinselschrift */
const IC_={get v(){return document.documentElement.classList.contains("dv")},
  get acc(){return this.v?"#2b93f0":"#ff8a00"},get accTx(){return this.v?"#ffffff":"#2b1500"},get accTx2(){return this.v?"#08345e":"#4a2500"},get accLight(){return this.v?"#a9d4ff":"#ffd2a1"},get accDark(){return this.v?"#0a62b8":"#c2410c"},
  get bg(){return this.v?"#1f1f1f":"#04101f"},get bg2(){return this.v?"#2b2b2b":"#0a2547"},get navy(){return this.v?"#2b2b2b":"#0b2a52"},
  get t1(){return this.v?"#f2f2f2":"#e7eef8"},get t2(){return this.v?"#d6d6d6":"#d5e1ef"},get t3(){return this.v?"#a8a8a8":"#9fb3ca"},get t3a(){return this.v?"rgba(168,168,168,.75)":"rgba(159,179,202,.75)"},get t4(){return this.v?"#6f6f6f":"#4a6380"},
  get photo(){return this.v?"grayscale(1) brightness(.85) contrast(1.05)":"saturate(1.2) brightness(1.15)"},
  ov(a){return this.v?"rgba(31,31,31,"+a+")":"rgba(4,16,31,"+a+")"},accA(a){return this.v?"rgba(43,147,240,"+a+")":"rgba(255,138,0,"+a+")"},panel(a){return this.v?"rgba(48,48,48,"+a+")":"rgba(7,27,51,"+a+")"},
  navyA(a){return this.v?"rgba(43,43,43,"+a+")":"rgba(11,42,82,"+a+")"},t2a(a){return this.v?"rgba(214,214,214,"+a+")":"rgba(213,225,239,"+a+")"},
  up(s){return this.v?String(s).toUpperCase():s}};
const INSTA_COND='"Barlow Condensed","Roboto Condensed","sans-serif-condensed","Arial Narrow","Avenir Next Condensed",sans-serif';
const INSTA_FONT='system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';
function instaImg(src){return new Promise(res=>{if(!src){res(null);return}const i=new Image();i.onload=()=>res(i.naturalWidth?i:null);i.onerror=()=>res(null);i.src=src})}
/* 1.27.0: Hallenfoto liegt jetzt als eigene Datei vor (schnellerer Start der App) */
function instaRinkSrc(){return "img/header-hintergrund.webp"}
function instaRR(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function instaFont(c,w,size,brush){c.font=brush?(IC_.v?"800 "+size+"px "+INSTA_COND:size+'px "GrizzlyBrush",Impact,'+INSTA_FONT):w+" "+size+"px "+INSTA_FONT}
function instaSpace(c,px){try{c.letterSpacing=px+"px"}catch(e){}}
function instaWrap(c,text,maxW){const words=String(text).split(/\s+/).filter(Boolean),lines=[];let cur="";words.forEach(w=>{const t=cur?cur+" "+w:w;if(cur&&c.measureText(t).width>maxW){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);return lines}
function instaContain(c,img,cx,cy,box){const s=Math.min(box/img.naturalWidth,box/img.naturalHeight),w=img.naturalWidth*s,h=img.naturalHeight*s;c.drawImage(img,cx-w/2,cy-h/2,w,h)}
async function instaLogos(name){
  if(/grizzlys/i.test(name)){const main=await instaImg(grizzlysLogo);const yc=/young cats/i.test(name)?await instaImg("logos/"+INSTA_LOGOS["ESC Rheine Young Cats"]):null;return {imgs:main?[main]:[],badge:yc}}
  const imgs=(await Promise.all(logoKeys(name).map(k=>instaImg(INSTA_LOGOS[k]?"logos/"+INSTA_LOGOS[k]:"")))).filter(Boolean);
  return {imgs,badge:null};
}
function instaCircle(c,lg,name,cx,cy,r){
  c.save();c.shadowColor="rgba(0,0,0,.55)";c.shadowBlur=50;c.shadowOffsetY=18;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fillStyle=IC_.panel(.62);c.fill();c.restore();
  c.save();c.beginPath();c.arc(cx,cy,r-2,0,Math.PI*2);c.clip();
  if(lg.imgs.length===1) instaContain(c,lg.imgs[0],cx,cy,r*1.4);
  else if(lg.imgs.length>1){ instaContain(c,lg.imgs[0],cx-r*.42,cy,r*.78); instaContain(c,lg.imgs[1],cx+r*.42,cy,r*.78); }
  else { instaFont(c,900,r*.4);instaSpace(c,2);c.fillStyle="#cfe3fb";c.textAlign="center";c.textBaseline="middle";c.fillText(String(name).replace(/^SpG\s+/i,"").slice(0,3).toUpperCase(),cx,cy+4);instaSpace(c,0); }
  c.restore();
  c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.lineWidth=4;c.strokeStyle="rgba(255,255,255,.35)";c.stroke();
  if(lg.badge){const bx=cx+r*.72,by=cy+r*.72,br=r*.36;c.save();c.shadowColor="rgba(0,0,0,.5)";c.shadowBlur=18;c.beginPath();c.arc(bx,by,br,0,Math.PI*2);c.fillStyle="#fff";c.fill();c.restore();c.save();c.beginPath();c.arc(bx,by,br-3,0,Math.PI*2);c.clip();instaContain(c,lg.badge,bx,by,br*1.6);c.restore()}
}
function instaChip(c,team,name,x,y,alignRight){
  const r=standRow(team,name); if(!r||!r.gp) return;
  const gd=Number(r.gd)||0, txt=r.gp+" Sp · "+r.p+" Pkt · "+(gd>0?"+"+gd:gd<0?"−"+Math.abs(gd):"±0"), rank=r.r+".";
  instaFont(c,900,25);const rw=c.measureText(rank).width+26;instaFont(c,800,25);const tw=c.measureText(txt).width,w=6+rw+12+tw+20,h=46,x0=alignRight?x-w:x;
  instaRR(c,x0,y,w,h,23);c.fillStyle=IC_.panel(.76);c.fill();c.lineWidth=2;c.strokeStyle="rgba(255,255,255,.24)";c.stroke();
  instaRR(c,x0+6,y+6,rw,h-12,17);c.fillStyle=team==="B"?"#ff8a00":team==="U13"?"#f2b705":"#168cff";c.fill();
  c.textBaseline="middle";c.textAlign="center";instaFont(c,900,25);c.fillStyle=team==="B"?"#3a1d00":team==="U13"?"#3a2c00":"#fff";c.fillText(rank,x0+6+rw/2,y+h/2+1);
  c.textAlign="left";instaFont(c,800,25);c.fillStyle=IC_.t1;c.fillText(txt,x0+6+rw+12,y+h/2+1);
}
function instaName(c,team,name,x,cy,maxW,alignRight,withChip){
  let size=50,lines;do{instaFont(c,900,size);lines=instaWrap(c,shortTeam(name),maxW);size-=4}while(lines.length>3&&size>30);size+=4;
  const lh=size*1.08,hasChip=withChip&&!!(standRow(team,name)&&standRow(team,name).gp),total=lines.length*lh+(hasChip?62:0);let y=cy-total/2+lh/2;
  c.save();c.shadowColor="rgba(0,0,0,.7)";c.shadowBlur=18;c.shadowOffsetY=4;c.fillStyle="#fff";c.textBaseline="middle";c.textAlign=alignRight?"right":"left";instaFont(c,900,size);
  lines.forEach(l=>{c.fillText(l,x,y);y+=lh});c.restore();
  if(hasChip) instaChip(c,team,name,x,y-lh/2+14,alignRight);
}
/* 1.26.3: Halloween-Spiel (31.10.) – Spinnennetze und Halloween-Eisfläche aus dem Halloween-Design der App */
async function instaHwArt(){
  const [netL,netR,bg]=await Promise.all([instaImg("halloween/netz-links.webp"),instaImg("halloween/netz-rechts.webp"),instaImg("halloween/karte3.webp")]);
  return {netL,netR,bg};
}
/* 1.27.1: Spiel verlegt (Datum, Uhrzeit oder Halle geändert, nicht abgesagt) */
/* 1.36.7: verlegt = auf einen anderen Tag; nur Uhrzeit oder Halle korrigiert zählt nicht */ function instaMoved(g){const b=g&&g._base;return !!(b&&!g.cancelled&&b.date!==g.date)}
async function instaDraw(g,type){
  const W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('100px "GrizzlyBrush"'),document.fonts.ready])}catch(e){}
  const [rink,lh,la,hwArt]=await Promise.all([instaImg(instaRinkSrc()),instaLogos(g.home),instaLogos(g.away),isHwGame(g)?instaHwArt():null]);
  const res=type==="result"?resInfo(g):null, home=isHome(g), moved=type==="moved"&&instaMoved(g);
  // Hintergrund
  c.fillStyle=IC_.bg;c.fillRect(0,0,W,H);
  if(rink){const s=Math.max(W/rink.naturalWidth,H/rink.naturalHeight)*1.04,w=rink.naturalWidth*s,h=rink.naturalHeight*s;c.save();c.filter=IC_.photo;c.drawImage(rink,(W-w)/2,(H-h)*.3,w,h);c.restore()}
  if(hwArt&&hwArt.bg){const b=hwArt.bg,s=H/b.naturalHeight,w=b.naturalWidth*s,x=Math.min(0,Math.max(W-w,W*.62-w*.80));c.save();c.globalAlpha=.42;c.drawImage(b,x,0,w,H);c.restore()}
  let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,IC_.ov(.62));gr.addColorStop(.3,IC_.ov(.30));gr.addColorStop(.62,IC_.ov(.55));gr.addColorStop(1,IC_.ov(.94));c.fillStyle=gr;c.fillRect(0,0,W,H);
  c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,405);c.lineTo(0,810);c.closePath();gr=c.createLinearGradient(0,0,W*.4,810);gr.addColorStop(0,"rgba(22,140,255,.42)");gr.addColorStop(1,"rgba(22,140,255,.10)");c.fillStyle=gr;c.fill();
  c.save();c.shadowColor=IC_.accA(.75);c.shadowBlur=36;c.strokeStyle=IC_.acc;c.lineWidth=10;c.beginPath();c.moveTo(-20,817.5);c.lineTo(W+20,397.5);c.stroke();c.restore();
  // Halloween: Spinnennetz oben rechts (das U15-Schild hängt darin) und unten rechts (gespiegelt)
  if(hwArt){c.save();c.globalAlpha=.92;
    if(hwArt.netR){const w=hwArt.netR.naturalWidth*1.9,h=hwArt.netR.naturalHeight*1.9;c.drawImage(hwArt.netR,W-w,0,w,h);
      c.save();c.translate(W,H);c.scale(-1,-1);const w2=hwArt.netL?hwArt.netL.naturalWidth*1.45:w*.8,h2=hwArt.netL?hwArt.netL.naturalHeight*1.45:h*.8;if(hwArt.netL)c.drawImage(hwArt.netL,0,0,w2,h2);c.restore()}
    c.restore()}
  // Kopf
  c.textBaseline="alphabetic";c.textAlign="left";c.fillStyle="#fff";instaFont(c,900,27);instaSpace(c,5);c.fillText("ESV GRIZZLYS BERGKAMEN",62,93);
  instaSpace(c,3);const tag=teamName(g.team),tw=c.measureText(tag).width+44;instaRR(c,W-62-tw,56,tw,48,10);c.fillStyle=IC_.acc;c.fill();c.fillStyle=IC_.accTx;c.textAlign="center";c.fillText(tag,W-62-tw/2+1.5,90);instaSpace(c,0);
  let head=g.cancelled?["Spiel ",g.postponed?"verlegt":"abgesagt"]:moved?["Spiel ","verlegt"]:res?(res.o==="w"?(home?["Heim","sieg!"]:["Auswärts","sieg!"]):["End","stand"]):["Spiel","tag"];if(IC_.v)head=head.map(s=>s.toUpperCase());
  let hs=112;c.textAlign="left";do{instaFont(c,0,hs,true);hs-=6}while(c.measureText(head[0]+head[1]).width>W-124&&hs>60);hs+=6;instaFont(c,0,hs,true);
  c.save();c.shadowColor="rgba(0,0,0,.65)";c.shadowBlur=26;c.shadowOffsetY=6;c.fillStyle="#fff";c.fillText(head[0],62,222);c.fillStyle=IC_.acc;c.fillText(head[1],62+c.measureText(head[0]).width,222);c.restore();
  // Paarung: Heim oben links, Gast unten rechts
  instaCircle(c,lh,g.home,219,433,165);instaName(c,g.team,g.home,412,433,W-412-50,false,!res);
  instaCircle(c,la,g.away,861,907,165);instaName(c,g.team,g.away,668,907,668-50,true,!res);
  // Mitte: VS oder Ergebnis
  const mid=res?res.hs+" : "+res.as:"VS";if(res)instaFont(c,900,104);else instaFont(c,0,116,true);
  const mw=c.measureText(mid).width+(res?76:84),mh=res?132:136,mx=W/2-mw/2,my=640-mh/2;
  c.save();c.shadowColor="rgba(0,0,0,.55)";c.shadowBlur=46;c.shadowOffsetY=16;instaRR(c,mx,my,mw,mh,30);c.fillStyle="#fff";c.fill();c.restore();
  c.fillStyle="#071b33";c.textAlign="center";c.textBaseline="middle";c.fillText(mid,W/2,640+(res?6:8));
  /* 1.25.0: abgesagt – roter Stempel über der Mitte */
  if(g.cancelled){c.save();c.translate(W/2,res?770:760);c.rotate(-0.09);instaFont(c,900,74);instaSpace(c,6);const st=cxU(g),sw=c.measureText(st).width+90;
    c.shadowColor="rgba(0,0,0,.5)";c.shadowBlur=30;instaRR(c,-sw/2,-62,sw,124,18);c.fillStyle="#d6453b";c.fill();c.shadowBlur=0;
    c.lineWidth=6;c.strokeStyle="#fff";instaRR(c,-sw/2+12,-50,sw-24,100,12);c.stroke();c.fillStyle="#fff";c.textAlign="center";c.textBaseline="middle";c.fillText(st,3,6);instaSpace(c,0);c.restore();}
  /* 1.27.1: verlegt – oranger Stempel über der Mitte */
  if(moved){c.save();c.translate(392,782);c.rotate(-0.07);instaFont(c,900,52);instaSpace(c,5);const st="NEUER TERMIN",sw=c.measureText(st).width+70;
    c.shadowColor="rgba(0,0,0,.5)";c.shadowBlur=30;instaRR(c,-sw/2,-46,sw,92,16);c.fillStyle=IC_.acc;c.fill();c.shadowBlur=0;
    c.lineWidth=4;c.strokeStyle=IC_.accTx;instaRR(c,-sw/2+10,-36,sw-20,72,10);c.stroke();c.fillStyle=IC_.accTx;c.textAlign="center";c.textBaseline="middle";c.fillText(st,3,5);instaSpace(c,0);c.restore();}
  // Fuß
  c.textAlign="left";c.textBaseline="alphabetic";const d=dt(g),day=d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}),full=d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"});
  let parts;
  if(res){const p=standPeriodsShort(g).replace(/<[^>]+>/g,"");parts=p?[["Drittel ","#fff"],[p,IC_.acc]]:[[full,"#fff"]];}
  else if(g.cancelled)parts=[[day+" ","#fff"],["· ",IC_.acc],[g.postponed?"neuer Termin offen":"abgesagt",IC_.acc]];
  else if(moved)parts=[["Neu: ",IC_.acc],[day+" ","#fff"],["· ",IC_.acc],[g.time+" Uhr","#fff"]];
  else parts=[[day+" ","#fff"],["· ",IC_.acc],[g.time+" Uhr","#fff"]];
  let bs=68;do{instaFont(c,900,bs);bs-=4}while(parts.reduce((n,x)=>n+c.measureText(x[0]).width,0)>W-124&&bs>40);bs+=4;instaFont(c,900,bs);
  let bx=62;parts.forEach(([s,col])=>{c.fillStyle=col;c.fillText(s,bx,1182);bx+=c.measureText(s).width});
  /* verlegt: bisheriger Termin klein und durchgestrichen darüber */
  if(moved){const b=g._base,od=new Date(b.date+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
    const old="bisher "+od+" · "+b.time+" Uhr"+(b.stadium!==g.stadium?" · "+b.stadium:"");instaFont(c,700,34);
    let ot=old;while(c.measureText(ot).width>W-124-260&&ot.length>12)ot=ot.slice(0,-2);if(ot!==old)ot=ot.replace(/\s*\S*$/,"")+" …";
    c.fillStyle=IC_.t3;c.fillText(ot,62,1100);const ow=c.measureText(ot).width;c.strokeStyle=IC_.acc;c.lineWidth=4;c.beginPath();c.moveTo(56,1088);c.lineTo(62+ow+6,1088);c.stroke();}
  const line=g.stadium+" · "+(res&&parts.length>1?full:moved&&g._base.stadium!==g.stadium?"neuer Spielort":(home?"Heimspiel":"Auswärtsspiel"));
  c.save();c.translate(62,1202);c.scale(1.5,1.5);c.strokeStyle=IC_.acc;c.lineWidth=2;c.lineCap="round";c.lineJoin="round";c.stroke(new Path2D("M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"));c.stroke(new Path2D("M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"));c.restore();
  instaFont(c,700,31);c.fillStyle=IC_.t2;c.fillText(line,112,1232);
  instaFont(c,700,22);instaSpace(c,3);c.fillStyle=IC_.t3;c.fillText(((INSTA_LEAGUE[g.team]||"")+" · Saison "+APP_CFG.season).toUpperCase(),62,1288);c.textAlign="right";c.fillStyle=IC_.t3a;c.fillText("APP: JAZM",W-62,1288);c.textAlign="left";instaSpace(c,0);
  return cv;
}
/* 1.30.0: gemeinsamer Hintergrund (Eishalle, Verlauf, orange Linie) */
function instaBg(c,W,H,rink){
  c.fillStyle=IC_.bg;c.fillRect(0,0,W,H);
  if(rink){const s=Math.max(W/rink.naturalWidth,H/rink.naturalHeight)*1.04,w=rink.naturalWidth*s,h=rink.naturalHeight*s;c.save();c.filter=IC_.photo;c.drawImage(rink,(W-w)/2,(H-h)*.3,w,h);c.restore()}
  let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,IC_.ov(.70));gr.addColorStop(.3,IC_.ov(.62));gr.addColorStop(1,IC_.ov(.96));c.fillStyle=gr;c.fillRect(0,0,W,H);
  c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,160);c.lineTo(0,330);c.closePath();gr=c.createLinearGradient(0,0,W*.4,330);gr.addColorStop(0,"rgba(22,140,255,.40)");gr.addColorStop(1,"rgba(22,140,255,.08)");c.fillStyle=gr;c.fill();
  c.save();c.shadowColor=IC_.accA(.75);c.shadowBlur=30;c.strokeStyle=IC_.acc;c.lineWidth=8;c.beginPath();c.moveTo(-20,334);c.lineTo(W+20,156);c.stroke();c.restore();
}
function instaHead(c,W,tag,h1,h2){if(IC_.v){h1=h1.toUpperCase();h2=h2.toUpperCase()}
  c.textBaseline="alphabetic";c.textAlign="left";c.fillStyle="#fff";instaFont(c,900,27);instaSpace(c,5);c.fillText("ESV GRIZZLYS BERGKAMEN",62,93);
  instaSpace(c,3);const tw=c.measureText(tag).width+44;instaRR(c,W-62-tw,56,tw,48,10);c.fillStyle=IC_.acc;c.fill();c.fillStyle=IC_.accTx;c.textAlign="center";c.fillText(tag,W-62-tw/2+1.5,90);instaSpace(c,0);
  let hs=112;c.textAlign="left";do{instaFont(c,0,hs,true);hs-=6}while(c.measureText(h1+h2).width>W-124&&hs>60);hs+=6;instaFont(c,0,hs,true);
  c.save();c.shadowColor="rgba(0,0,0,.65)";c.shadowBlur=26;c.shadowOffsetY=6;c.fillStyle="#fff";c.fillText(h1,62,222);c.fillStyle=IC_.acc;c.fillText(h2,62+c.measureText(h1).width,222);c.restore();
}
function instaFoot(c,W,left){instaFont(c,700,22);instaSpace(c,3);c.textAlign="left";c.textBaseline="alphabetic";c.fillStyle=IC_.t3;c.fillText(left.toUpperCase(),62,1288);c.textAlign="right";c.fillStyle=IC_.t3a;c.fillText("APP: JAZM",W-62,1288);c.textAlign="left";instaSpace(c,0)}
/* 8) Tabelle als Bild */
async function instaTable(team){
  const W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('100px "GrizzlyBrush"'),document.fonts.ready])}catch(e){}
  const st=standings[team]; if(!st||!Array.isArray(st.rows)||!st.rows.length)throw new Error("Kein Tabellenstand");
  const rows=st.rows.slice().sort((a,b)=>a.r-b.r).slice(0,14), own=standRow(team,sbOwn(team));
  const [rink,...logos]=await Promise.all([instaImg(instaRinkSrc()),...rows.map(r=>instaLogos(r.n))]);
  instaBg(c,W,H,rink); instaHead(c,W,teamName(team),"Tabel","le");
  instaFont(c,800,30);c.fillStyle=IC_.t2;c.fillText(INSTA_LEAGUE[team]||"",62,272);
  const top=330,bottom=1200,rh=Math.min(90,(bottom-top-56)/rows.length),cx={nr:96,logo:170,name:216,sp:770,gd:880,p:990};
  instaFont(c,800,24);instaSpace(c,2);c.fillStyle=IC_.t3;c.textAlign="center";c.fillText("SP",cx.sp,top+30);c.fillText("DIFF",cx.gd,top+30);c.fillText("PKT",cx.p,top+30);c.textAlign="left";c.fillText("TEAM",cx.name,top+30);instaSpace(c,0);
  rows.forEach((r,i)=>{const y=top+48+i*rh,mine=own&&r.n===own.n,mid=y+rh/2;
    instaRR(c,48,y+3,W-96,rh-6,16);c.fillStyle=mine?IC_.accA(.92):i%2?IC_.panel(.55):"rgba(255,255,255,.08)";c.fill();
    if(mine){c.save();c.shadowColor=IC_.accA(.6);c.shadowBlur=24;instaRR(c,48,y+3,W-96,rh-6,16);c.lineWidth=3;c.strokeStyle=IC_.accLight;c.stroke();c.restore()}
    const fg=mine?IC_.accTx:"#fff",fs=Math.min(36,rh*.46);
    c.textBaseline="middle";instaFont(c,900,fs);c.fillStyle=fg;c.textAlign="center";c.fillText(r.r+".",cx.nr,mid+1);
    const lg=logos[i],lr=rh*.36;c.save();c.beginPath();c.arc(cx.logo,mid,lr,0,Math.PI*2);c.fillStyle=mine?"rgba(255,255,255,.85)":"rgba(255,255,255,.92)";c.fill();c.clip();
    if(lg&&lg.imgs.length)instaContain(c,lg.imgs[0],cx.logo,mid,lr*1.55);else{instaFont(c,900,lr*.7);c.fillStyle="#12263f";c.fillText(shortTeam(r.n).slice(0,2).toUpperCase(),cx.logo,mid+1)}c.restore();
    c.textAlign="left";instaFont(c,mine?900:800,fs);c.fillStyle=fg;let nm=shortTeam(r.n);while(c.measureText(nm).width>cx.sp-60-cx.name&&nm.length>6)nm=nm.slice(0,-2);if(nm!==shortTeam(r.n))nm=nm.replace(/\s*$/,"")+"…";c.fillText(nm,cx.name,mid+1);
    c.textAlign="center";instaFont(c,800,fs);c.fillText(String(r.gp),cx.sp,mid+1);const gd=Number(r.gd)||0;c.fillText(gd>0?"+"+gd:gd<0?"−"+Math.abs(gd):"0",cx.gd,mid+1);instaFont(c,900,fs*1.08);c.fillText(String(r.p),cx.p,mid+1);
  });
  c.textBaseline="alphabetic";c.textAlign="left";instaFont(c,700,28);c.fillStyle=IC_.t2;
  c.fillText("Stand: "+(st.upd||new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"}))+" · Quelle: EHV NRW",62,1240);
  instaFoot(c,W,APP_CFG.appName+" · Saison "+APP_CFG.season);
  return cv;
}
/* 5) Jahresrückblick */
function yearStats(y){
  const P=games.filter(g=>g.date.startsWith(String(y))&&!g.cancelled).map(g=>({g,r:resInfo(g)})).filter(x=>x.r).sort((a,b)=>dt(a.g)-dt(b.g));
  const z=()=>({gp:0,w:0,l:0,so:0,gf:0,ga:0,hw:0,shut:0}),T=z(),by=Object.fromEntries(window.TEAM_KEYS.map(k=>[k,z()]));let big=null,streak={n:0,team:""};
  const run=Object.fromEntries(window.TEAM_KEYS.map(k=>[k,0]));
  P.forEach(x=>{[T,by[x.g.team]].forEach(o=>{o.gp++;if(x.r.o==="w"){o.w++;if(isHome(x.g))o.hw++}else o.l++;if(x.r.x==="so"||x.r.o==="d")o.so++;o.gf+=x.r.gs;o.ga+=x.r.os;if(x.r.os===0)o.shut++});
    const d=x.r.gs-x.r.os;if(x.r.o==="w"&&(!big||d>big.r.gs-big.r.os||(d===big.r.gs-big.r.os&&x.r.gs>big.r.gs)))big=x;
    run[x.g.team]=x.r.o==="w"?run[x.g.team]+1:0;if(run[x.g.team]>streak.n)streak={n:run[x.g.team],team:x.g.team}});
  return {y,P,T,by,big,streak};
}
function yearReviewYear(d){d=d||new Date();return d.getMonth()===0?d.getFullYear()-1:d.getFullYear()}
async function instaYear(y){
  const W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('100px "GrizzlyBrush"'),document.fonts.ready])}catch(e){}
  const Y=yearStats(y),T=Y.T; if(!T.gp)throw new Error("Keine Ergebnisse "+y);
  const rink=await instaImg(instaRinkSrc());
  instaBg(c,W,H,rink); instaHead(c,W,APP_CFG.age,"Jahres","rückblick");
  instaFont(c,900,40);c.fillStyle=IC_.acc;c.fillText(String(y),62,276);const yw=c.measureText(String(y)).width;instaFont(c,800,30);c.fillStyle=IC_.t2;c.fillText(" in Zahlen – U15 A und U15 B",62+yw,276);
  const gd=T.gf-T.ga,tiles=[[T.gp,"Spiele"],[T.w,T.w===1?"Sieg":"Siege"],[T.gf,"Tore"],[(gd>0?"+":"")+gd,"Tordifferenz"],[T.hw,T.hw===1?"Heimsieg":"Heimsiege"],[Y.streak.n>=2?Y.streak.n:T.shut,Y.streak.n>=2?"Siege in Folge":"Zu-null-Spiele"]];
  const tx=62,ty=330,tw=(W-124-24)/2,th=150;
  tiles.forEach(([v,l],i)=>{const x=tx+(i%2)*(tw+24),y=ty+Math.floor(i/2)*(th+22);
    c.save();c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=30;c.shadowOffsetY=10;instaRR(c,x,y,tw,th,26);c.fillStyle=i===1?IC_.accA(.94):IC_.panel(.78);c.fill();c.restore();
    instaRR(c,x,y,tw,th,26);c.lineWidth=2;c.strokeStyle=i===1?IC_.accLight:"rgba(255,255,255,.18)";c.stroke();
    c.textAlign="left";c.textBaseline="alphabetic";instaFont(c,900,84);c.fillStyle=i===1?IC_.accTx:"#fff";c.fillText(String(v),x+32,y+96);
    instaFont(c,800,26);instaSpace(c,2);c.fillStyle=i===1?IC_.accTx2:IC_.t3;c.fillText(l.toUpperCase(),x+34,y+132);instaSpace(c,0)});
  let y0=ty+3*(th+22)+8;
  if(Y.big){const b=Y.big,opp=shortTeam(opponent(b.g));c.save();c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=30;instaRR(c,62,y0,W-124,128,26);c.fillStyle="rgba(255,255,255,.94)";c.fill();c.restore();
    instaFont(c,800,24);instaSpace(c,2);c.fillStyle=IC_.accDark;c.fillText("HÖCHSTER SIEG",96,y0+44);instaSpace(c,0);
    instaFont(c,900,54);c.fillStyle="#071b33";const sc=b.r.gs+":"+b.r.os;c.fillText(sc,96,y0+104);const sw=c.measureText(sc).width;
    instaFont(c,800,32);let t="gegen "+opp+" · "+teamName(b.g.team)+" · "+b.g.date.slice(8,10)+"."+b.g.date.slice(5,7)+".";while(c.measureText(t).width>W-124-sw-80&&t.length>12)t=t.slice(0,-2);c.fillStyle="#3b4f66";c.fillText(t,96+sw+24,y0+100);y0+=150}
  window.TEAM_KEYS.forEach(t=>{const o=Y.by[t];if(!o||!o.gp)return;instaRR(c,62,y0,W-124,62,31);c.fillStyle=IC_.panel(.72);c.fill();
    instaRR(c,70,y0+8,120,46,23);c.fillStyle=t==="B"?"#ff8a00":t==="U13"?"#f2b705":"#168cff";c.fill();instaFont(c,900,26);c.textAlign="center";c.textBaseline="middle";c.fillStyle=t==="B"?"#3a1d00":t==="U13"?"#3a2c00":"#fff";c.fillText(teamName(t),130,y0+32);
    c.textAlign="left";instaFont(c,800,28);c.fillStyle=IC_.t1;c.fillText(`${o.gp} ${o.gp===1?"Spiel":"Spiele"} · ${o.w} S · ${o.l} N · Tore ${o.gf}:${o.ga}`,214,y0+32);c.textBaseline="alphabetic";y0+=76});
  instaFoot(c,W,"Saison "+APP_CFG.season+" · "+APP_CFG.club);
  return cv;
}
function instaClose(){const m=document.getElementById("instaModal");if(m){m.hidden=true;m.setAttribute("aria-hidden","true")}const a=document.getElementById("adminModal");document.body.style.overflow=(a&&!a.hidden)?"hidden":""}
async function instaOpen(g,type,pub=false){
  let m=document.getElementById("instaModal");
  if(!m){m=document.createElement("div");m.id="instaModal";m.className="matchModal instaModal";m.hidden=true;
    m.innerHTML='<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="instaTitle"><div class="matchModalHead"><div id="instaTitle" class="matchModalTitle">Social-Media-Bild</div><button id="instaClose" class="matchModalClose" type="button" aria-label="Schließen">×</button></div><div id="instaBody" class="instaBody"></div><div id="instaCap" class="instaCap" hidden><label class="newsPushChk"><input id="instaCapOn" type="checkbox" checked> Kurzbericht mit teilen</label><textarea id="instaCapTx" rows="6" maxlength="2000" aria-label="Text zum Bild"></textarea></div><div class="instaActions"><button id="instaShare" class="action" type="button">Teilen</button><button id="instaSave" class="action" type="button">Speichern</button><button id="instaCopy" class="action" type="button" hidden>Text kopieren</button></div><div id="instaHint" class="small" style="margin-top:8px"></div></div>';
    document.body.appendChild(m);m.querySelector("#instaClose").onclick=instaClose;m.addEventListener("click",e=>{if(e.target===m)instaClose()});}
  const body=m.querySelector("#instaBody"),hint=m.querySelector("#instaHint"),bS=m.querySelector("#instaShare"),bD=m.querySelector("#instaSave");
  /* 1.9.1.137: Kurzfassung des Spielberichts als Text zum Ergebnisbild */
  const capBox=m.querySelector("#instaCap"),capOn=m.querySelector("#instaCapOn"),capTx=m.querySelector("#instaCapTx"),bC=m.querySelector("#instaCopy");
  const special=type==="table"||type==="year"||type==="weekend";
  m.querySelector("#instaTitle").textContent=type==="table"?"Tabelle als Bild":type==="year"?"Jahresrückblick":type==="weekend"?"Wochenende als Bild":"Social-Media-Bild";
  const cap=type==="result"?instaCaption(g,pub):"";
  capBox.hidden=!cap; bC.hidden=!cap; capTx.value=cap; capOn.checked=!!cap;
  capOn.onchange=()=>{capTx.disabled=!capOn.checked};capTx.disabled=false;
  const capText=()=>cap&&capOn.checked?capTx.value.trim():"";
  const copyCap=async()=>{const t=capText();if(!t)return false;try{await navigator.clipboard.writeText(t);return true}catch(e){return false}};
  bC.onclick=async()=>{if(await copyCap()){bC.textContent="✓ Kopiert";setTimeout(()=>bC.textContent="Text kopieren",1800)}else{capTx.focus();capTx.select()}};
  body.textContent="Bild wird erstellt …";hint.textContent="";bS.disabled=bD.disabled=true;m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  try{
    const cv=type==="table"?await instaTable(g.team):type==="year"?await instaYear(g.year):type==="weekend"?await instaWeekend(g):await instaDraw(g,type), blob=await new Promise(r=>cv.toBlob(r,"image/png"));
    if(!blob)throw new Error("Bild konnte nicht erzeugt werden");
    const name=type==="weekend"?"young-grizzlys-wochenende-"+g.list[0].date+".png":type==="table"?"grizzlys-u15"+g.team.toLowerCase()+"-tabelle-"+new Date().toISOString().slice(0,10)+".png":type==="year"?"grizzlys-u15-jahresrueckblick-"+g.year+".png":"grizzlys-u15"+g.team.toLowerCase()+"-"+g.date+"-"+(g.cancelled?(g.postponed?"verlegt":"abgesagt"):type==="result"?"ergebnis":type==="moved"?"verlegung":"ankuendigung")+".png", file=new File([blob],name,{type:"image/png"}), url=URL.createObjectURL(blob);
    body.innerHTML="";const img=new Image();img.src=url;img.alt="Vorschau des Bildes";img.className="instaPreview";body.appendChild(img);
    const canShare=!!(navigator.canShare&&navigator.canShare({files:[file]}));
    bS.hidden=!canShare;bS.disabled=false;bD.disabled=false;
    bS.onclick=async()=>{const t=capText(), copied=await copyCap();
      if(t)hint.textContent=copied?"Text ist kopiert. Instagram übernimmt keinen Text – dort unter dem Bild einfach einfügen.":"Instagram übernimmt keinen Text – bitte vorher „Text kopieren“.";
      const ttl="ESV Grizzlys "+(g.team?teamName(g.team):APP_CFG.age);
      try{await navigator.share(t?{files:[file],title:ttl,text:t}:{files:[file],title:ttl})}catch(e){}};
    bD.onclick=()=>{const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove()};
    if(special){hint.textContent="";return}
    const missing=[...new Set([g.home,g.away].filter(n=>!/grizzlys/i.test(n)).flatMap(n=>logoKeys(n)))].filter(k=>INSTA_LOGOS[k]);
    const loaded=await Promise.all(missing.map(k=>instaImg("logos/"+INSTA_LOGOS[k])));const lost=missing.filter((k,i)=>!loaded[i]);
    hint.textContent=(lost.length&&!pub)?"Logo fehlt im Ordner „logos“: "+lost.map(k=>INSTA_LOGOS[k]).join(", "):"";
  }catch(e){console.error(e);body.textContent=type==="table"?"Die Tabelle ist gerade nicht geladen. Bitte später noch einmal versuchen.":type==="year"?"Für dieses Jahr gibt es noch keine Ergebnisse.":"Das Bild konnte nicht erstellt werden.";}
}
window.instaOpen=instaOpen;window.instaDraw=instaDraw;
/* Kurzfassung: gespeicherter Kurzbericht oder aus den gespeicherten Einstellungen (Schlagworte, Auswahl) neu erzeugt.
   Nutzer (pub) sehen nur veröffentlichte Berichte, der Admin auch Entwürfe. */
function instaCaption(g,pub){
  const r=(window.gameReports||{})[rkey(g)]; if(!r||!r.text||(pub&&!r.published))return "";
  if(r.len==="kurz")return r.text;
  const d=window.repDraft&&window.repDraft(g,0,r.keywords||"",r.use||{},"kurz");
  return d&&d.text?d.text:r.text;
}
/* 1.31.0: Eigener Social-Media-Bereich im Admin */
const admSoc={f:"next",t:"",n:12};
function renderAdmSocial(){
  const box=document.getElementById("admSocial"); if(!box)return;
  const now=Date.now(), day=86400000, yy=yearReviewYear(), yN=yearStats(yy).T.gp;
  const sub=g=>`${esc(teamName(g.team))} · ${esc(dt(g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}))} · ${isHome(g)?"Heim":"Ausw."}`;
  const opp=g=>esc(shortTeam(opponent(g)));
  /* jetzt passend: wie unter Downloads (Spieltag 5 Tage vorher, Ergebnis bis 5 Tage danach, Verlegungen) */
  const now1=[];
  ALL_GAMES.forEach(g=>{const t=dt(g).getTime(),r=resInfo(g);
    if(r&&now<=t+5*day)now1.push({g,type:"result",ic:"🏆",l:"Ergebnis "+r.hs+":"+r.as,t});
    else if(instaMoved(g)&&now<t&&!r)now1.push({g,type:"moved",ic:"🔁",l:"Spielverlegung",t});
    else if(!r&&now>=t-5*day&&now<t+2*3600000)now1.push({g,type:"announce",ic:g.cancelled?"🚫":"📣",l:g.cancelled?"Absage":"Spieltag",t})});
  now1.sort((a,b)=>a.t-b.t);
  const card=(x,i)=>`<button type="button" class="socCard team${esc(x.g.team)}" data-now="${i}"><span class="socIc">${x.ic}</span><span class="socTx"><b>${x.l} · ${opp(x.g)}</b><small>${sub(x.g)}</small></span><span class="socGo">Erstellen ›</span></button>`;
  /* alle Spiele */
  const list=ALL_GAMES.filter(g=>(!admSoc.t||g.team===admSoc.t)&&(admSoc.f==="next"?dt(g).getTime()>now-3*3600000:dt(g).getTime()<=now)).sort((a,b)=>admSoc.f==="next"?dt(a)-dt(b):dt(b)-dt(a));
  const row=(g,i)=>{const r=resInfo(g),mv=instaMoved(g);return `<div class="socRow team${esc(g.team)}" data-row="${i}"><div class="socRowTx"><b>${opp(g)}</b><small>${sub(g)}${g.cancelled?" · "+(g.postponed?"verlegt, Termin offen":"abgesagt"):""}</small></div><div class="socRowB">${admSoc.f==="next"?`<button type="button" class="admBtn" data-k="announce">📣 Spieltag</button>${mv?'<button type="button" class="admBtn" data-k="moved">🔁 Verlegung</button>':""}`:`<button type="button" class="admBtn${r?" pri":""}" data-k="result"${r?"":" disabled"}>${r?"🏆 "+r.hs+":"+r.as:"Ergebnis fehlt"}</button>`}</div></div>`};
  const chip=(k,v,l)=>`<button type="button" class="${admSoc[k]===v?"on":""}" data-${k}="${v}">${l}</button>`;
  box.innerHTML=`<div class="socSec"><div class="socH">Jetzt passend <small>sehen Nutzer auch unter Downloads</small></div>${now1.length?`<div class="socCards">${now1.map(card).join("")}</div>`:'<div class="small socEmpty">Gerade steht kein Spieltag und kein frisches Ergebnis an.</div>'}</div>
  <div class="socSec"><div class="socH">Saison</div><div class="socTiles"><button type="button" class="socTile teamA" data-x="tA"><span>📊</span><b>Tabelle</b><small>${esc(teamName("A"))}</small></button><button type="button" class="socTile teamB" data-x="tB"><span>📊</span><b>Tabelle</b><small>${esc(teamName("B"))}</small></button><button type="button" class="socTile teamU13" data-x="tU13"><span>📊</span><b>Tabelle</b><small>${esc(teamName("U13"))}</small></button><button type="button" class="socTile" data-x="w"${weekendGames(ALL_GAMES).length?"":" disabled"}><span>📅</span><b>Wochenende</b><small>${weekendGames(ALL_GAMES).length||"keine"} Spiele</small></button><button type="button" class="socTile" data-x="y"${yN?"":" disabled"}><span>🎆</span><b>Rückblick</b><small>${yy}${yN?"":" · noch leer"}</small></button></div></div>
  <div class="socSec"><div class="socH">Alle Spiele</div><div class="admFlt socFlt">${chip("f","next","Kommende")}${chip("f","past","Gespielt")}<span class="socSp"></span>${chip("t","","Alle")}${chip("t","A","A")}${chip("t","B","B")}${chip("t","U13","U13")}</div>
   <div class="socRows">${list.slice(0,admSoc.n).map(row).join("")||'<div class="small socEmpty">Keine Spiele.</div>'}</div>${list.length>admSoc.n?`<button type="button" class="admMore socMore">Alle ${list.length} Spiele anzeigen</button>`:""}</div>`;
  box.querySelectorAll("[data-now]").forEach(b=>{const x=now1[Number(b.dataset.now)];b.onclick=()=>instaOpen(x.g,x.type)});
  box.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const k=b.dataset.x;if(k==="w")instaOpen({list:weekendGames(ALL_GAMES)},"weekend");else if(k==="y")instaOpen({year:yy},"year");else instaOpen({team:k.slice(1)},"table")});
  box.querySelectorAll(".socRow").forEach(r=>{const g=list[Number(r.dataset.row)];r.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>instaOpen(g,b.dataset.k))});
  box.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{admSoc.f=b.dataset.f;admSoc.n=12;renderAdmSocial()});
  box.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{admSoc.t=b.dataset.t;renderAdmSocial()});
  box.querySelector(".socMore")?.addEventListener("click",()=>{admSoc.n=999;renderAdmSocial()});
}
window.renderAdmSocial=renderAdmSocial;
{const prev=window.applyResults;window.applyResults=function(){prev&&prev.apply(this,arguments);try{const p=document.getElementById("admSocBody");if(p&&!p.hidden)renderAdmSocial()}catch(e){console.warn(e)}};}

/* Instagram-Bilder für alle: Spieltag ab 5 Tage vorher bis Spielende, Ergebnis bis 5 Tage nach dem Spiel */
const INSTA_DAYS=5;
function renderInstaDownloads(){
  const box=document.getElementById("dlInstaList"); if(!box)return;
  const now=Date.now(), day=86400000, items=[];
  games.forEach(g=>{
    const t=dt(g).getTime(), r=resInfo(g);
    if(now>=t-INSTA_DAYS*day&&now<t+2*3600000&&!r)items.push({g,type:"announce",t});
    if(instaMoved(g)&&now<t&&!r)items.push({g,type:"moved",t});
    if(r&&now<=t+INSTA_DAYS*day)items.push({g,type:"result",t,r});
  });
  window.dlInstaFresh=items.filter(x=>x.type==="result"||x.type==="announce"||x.type==="moved").length; try{window.dlTabBadge&&window.dlTabBadge()}catch(e){}
  const ord={result:0,moved:1,announce:2,weekend:2.5,year:3,table:4}; items.sort((a,b)=>a.type===b.type?a.t-b.t:ord[a.type]-ord[b.type]);
  /* 1.30.0: Tabelle immer, Jahresrückblick vom 20.12. bis 31.1. */
  {const d=new Date(now),yy=yearReviewYear(d);if(((d.getMonth()===11&&d.getDate()>=20)||d.getMonth()===0)&&yearStats(yy).T.gp)items.push({g:{year:yy},type:"year",t:0});
   window.MY_TEAMS.forEach(t=>{if(standings[t]&&Array.isArray(standings[t].rows)&&standings[t].rows.length)items.push({g:{team:t},type:"table",t:0})});}
  /* 1.43.0: Wochenend-Vorschau – ab Montag für das kommende Wochenende (Fr–So), solange dort Spiele anstehen */
  {const wl=weekendGames(games,now);if(wl.length&&wl.some(g=>dt(g).getTime()+2*3600000>now))items.push({g:{list:wl},type:"weekend",t:-1});}
  if(!items.length){
    const nx=games.filter(g=>dt(g).getTime()>now).sort((a,b)=>dt(a)-dt(b))[0];
    const from=nx?new Date(dt(nx).getTime()-INSTA_DAYS*day):null;
    box.innerHTML=`<div class="small dlInstaEmpty">Gerade gibt es keine Bilder.${from?" Das nächste Spieltagsbild gibt es ab "+esc(from.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})).replace(/\.$/,"")+".":""}</div>`;
    return;
  }
  const icA='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/></svg>';
  const icR='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1 -10 0z"/><path d="M5 9h2M17 9h2"/></svg>';
  const icT='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/><path d="M3 10h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>';
  const go='<svg class="ic dlGo" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6"/></svg>';
  box.innerHTML=items.map((x,i)=>{const g=x.g, cls="team"+g.team;
    if(x.type==="table"){const st=standRow(g.team,sbOwn(g.team));return `<button class="downloadCard dlInstaItem ${cls}" data-i="${i}" type="button"><span class="dlIcon">${icT}</span><b>Tabelle · ${esc(teamName(g.team))}</b><small>${st&&st.r?"Platz "+esc(String(st.r))+" · ":""}${esc(INSTA_LEAGUE[g.team]||"")}</small>${go}</button>`}
    if(x.type==="weekend"){const L=g.list,f=d=>d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}).replace(/\.$/,"");return `<button class="downloadCard dlInstaItem teamA" data-i="${i}" type="button"><span class="dlIcon">${icA}</span><b>Wochenende · ${L.length} ${L.length===1?"Spiel":"Spiele"}</b><small>${esc(f(dt(L[0])))}${L.length>1&&dt(L[0]).toDateString()!==dt(L[L.length-1]).toDateString()?" – "+esc(f(dt(L[L.length-1]))):""} · alle deine Mannschaften</small>${go}</button>`}
    if(x.type==="year")return `<button class="downloadCard dlInstaItem teamB" data-i="${i}" type="button"><span class="dlIcon">${icR}</span><b>Jahresrückblick ${g.year}</b><small>U15 A und B in Zahlen</small>${go}</button>`;
    const title=x.type==="result"?"Ergebnis "+x.r.hs+":"+x.r.as:x.type==="moved"?"Spielverlegung":"Spieltag";
    return `<button class="downloadCard dlInstaItem ${cls}" data-i="${i}" type="button"><span class="dlIcon">${x.type==="result"?icR:icA}</span><b>${title} · ${esc(teamName(g.team))}</b><small>${esc(shortTeam(g.home))} – ${esc(shortTeam(g.away))} · ${esc(dt(g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}))}</small><svg class="ic dlGo" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6"/></svg></button>`}).join("");
  box.querySelectorAll(".dlInstaItem").forEach(b=>{const x=items[Number(b.dataset.i)];b.onclick=()=>instaOpen(x.g,x.type,true)});
  try{instaThumbs(box,items)}catch(e){console.warn(e)}
}
{const prev=window.applyResults;window.applyResults=function(){prev&&prev.apply(this,arguments);try{renderInstaDownloads()}catch(e){console.warn(e)}};}
/* 1.63.0: Vorschaubilder statt Symbolen – werden erst erzeugt, wenn der Eintrag sichtbar ist, nacheinander und klein zwischengespeichert */
const instaThumbCache=new Map();let instaThumbQ=Promise.resolve(),instaThumbObs=null;
function instaThumbKey(x){return (IC_.v?"v|":"")+instaThumbKey0(x)}
function instaThumbKey0(x){const g=x.g;if(x.type==="table"){const s=standings[g.team];return "t:"+g.team+":"+(s&&s.updated||"")+":"+(s&&s.rows?s.rows.length:0)}if(x.type==="year")return "y:"+g.year;if(x.type==="weekend")return "w:"+g.list.map(z=>z.date+z.time+z.team).join(",");const r=resInfo(g);return x.type+":"+g.date+g.time+g.team+":"+(r?r.hs+"-"+r.as:"")}
function instaThumbMake(x){const k=instaThumbKey(x);if(instaThumbCache.has(k))return Promise.resolve(instaThumbCache.get(k));
  const p=instaThumbQ.then(async()=>{const g=x.g;const cv=x.type==="table"?await instaTable(g.team):x.type==="year"?await instaYear(g.year):x.type==="weekend"?await instaWeekend(g):await instaDraw(g,x.type);
    const t=document.createElement("canvas");t.width=144;t.height=180;t.getContext("2d").drawImage(cv,0,0,144,180);const u=t.toDataURL("image/jpeg",.82);instaThumbCache.set(k,u);return u}).catch(e=>{console.warn(e);return null});
  instaThumbQ=p.then(()=>new Promise(r=>setTimeout(r,60)));return p}
function instaThumbs(box,items){
  const put=(b,u)=>{const ic=b.querySelector(".dlIcon");if(!ic||!u)return;ic.classList.add("dlThumb");ic.innerHTML=`<img src="${u}" alt="" width="48" height="60">`};
  const els=[...box.querySelectorAll(".dlInstaItem")];
  els.forEach(b=>{const x=items[Number(b.dataset.i)];const k=instaThumbKey(x);if(instaThumbCache.has(k))put(b,instaThumbCache.get(k))});
  if(!("IntersectionObserver" in window)){return}
  if(instaThumbObs)instaThumbObs.disconnect();
  instaThumbObs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;instaThumbObs.unobserve(e.target);const b=e.target,x=items[Number(b.dataset.i)];if(!x||b.querySelector(".dlThumb"))return;b.classList.add("dlThumbLoading");instaThumbMake(x).then(u=>{b.classList.remove("dlThumbLoading");if(b.isConnected)put(b,u)})}),{rootMargin:"120px"});
  els.forEach(b=>{if(!b.querySelector(".dlThumb"))instaThumbObs.observe(b)});
}
renderInstaDownloads(); setInterval(()=>{try{renderInstaDownloads()}catch(e){}},10*60000);

/* ===== v66: News-Bereich – Hinweise, Spieländerungen, Neues in der App ===== */
/* Nur Neuerungen, die für Nutzer sichtbar oder spürbar sind. Neueste Version oben. */
const APP_NEWS=[
  {v:"1.53.0.243",d:"November 2026",items:["Hintergrundbilder: Vereinsdesign jetzt auch mit Logo in Dunkelblau und als ruhigere Variante für den Startbildschirm."]},
  {v:"1.52.1.240",d:"November 2026",items:["Fan-Tipp: Tore lassen sich jetzt auch direkt eintippen – bis 40 statt 20."]},
  {v:"1.52.0.239",d:"November 2026",items:["Einstellungen neu sortiert: alles auf einen Blick mit dem aktuellen Wert – antippen öffnet die Einstellung."]},
  {v:"1.51.0.237",d:"November 2026",items:["Neuer Knopf „App installieren“ auf der Startseite und in den Einstellungen – klappt jetzt auch im Samsung-Browser, mit Anleitung für iPhone und Firefox."]},
  {v:"1.50.0.233",d:"November 2026",items:["Alle Hintergrundbilder gibt es jetzt auch hell – einfach in der Vorschau „Hell“ wählen."]},
  {v:"1.49.0.232",d:"November 2026",items:["Downloads aufgeräumt: drei Reiter – Spielplan, Social Media und Hintergründe. Eine Zahl zeigt, wenn neue Spieltags- oder Ergebnisbilder da sind."]},
  {v:"1.48.0.230",d:"November 2026",items:["Hintergrundbilder fürs Handy unter Downloads: Vereinsdesign in vier Stilen, Trikot mit deiner Rückennummer, Nächstes Spiel und Spiele des Monats für den Sperrbildschirm – jetzt auch Advent & Weihnachten. Passend zu deinem Bildschirm, oben bleibt Platz für die Uhr."]},
  {v:"1.47.0.229",d:"November 2026",items:["Saisonbilanz neu sortiert: Überblick, Verlauf, Liga und Nummern als Reiter – mit Grafiken.","Neu im Verlauf: Zeit in Führung, Comebacks, knappe Spiele, Tore nach Spielminute und Überzahl/Unterzahl (die fehlten bisher).","Neu bei Liga und Nummern: Angriff und Abwehr im Ligavergleich, Bilanz gegen obere und untere Tabellenhälfte, Restprogramm, Hattricks, Siegtore und Scorer-Serien – weiter nur mit Rückennummern."]},
  {v:"1.44.2.221",d:"November 2026",items:["Verlegte Spiele ohne neuen Termin werden jetzt als „Verlegt · Termin offen“ angezeigt – statt als abgesagt."]},
  {v:"1.44.0.219",d:"November 2026",items:["Wunschliste: Stimm ab, welche Funktion als Nächstes kommen soll – bis zu 3 Stimmen, anonym (Startseite unten und News).","Mit einem Tipp sagen, ob dir ein Spielbericht oder eine Neuerung gefällt (👍/👎).","Feedback ist jetzt schneller erreichbar: auf der Startseite, in der Info und in den News."]},
  {v:"1.43.0.218",d:"November 2026",items:["Meine Rückennummer: In den Einstellungen die Nummer deines Kindes eintragen – sie wird bei Torschützen, Spielberichten und in der Saisonbilanz hervorgehoben. Auf Wunsch Push bei Tor oder Vorlage dieser Nummer.","Neuer Push „Spielbericht ist online“ – ein Tipp öffnet den Bericht.","Wochenende als Bild: Unter Downloads alle Spiele des Wochenendes als Bild für die WhatsApp-Gruppe.","Wetter am Spielort: Temperatur und Glättegefahr beim nächsten Spiel und in der Erinnerung am Vortag.","Saisonbilanz: Strafminuten, Überzahl- und Unterzahlquote."]},
  {v:"1.42.1.216",d:"November 2026",items:["Meilensteine: erster Saisonsieg, Siegesserien, 50. Saisontor & Co. stehen bei den Ergebnissen, im Spiel und in der Saisonbilanz.","App weiterempfehlen: In der Info zeigt „QR-Code zeigen“ einen Code zum Scannen – so ist die App in Sekunden auf dem Handy.","Schneller zur Statistik: Lange auf das App-Symbol drücken bietet die Saisonbilanz von U13, U15 A und U15 B an (Android)."]},
  {v:"1.41.0.210",d:"November 2026",items:["Neu auf der Startseite: der Spruch des Tages – jeden Tag ein anderer Eishockey-Spruch. Am Spieltag und nach einem Sieg oder einer Niederlage passt er zum Spiel."]},
  {v:"1.39.0.199",d:"November 2026",items:["Push-Meldungen folgen jetzt „Meine Mannschaften“: Du bekommst nur Push für die Mannschaften, die du ausgewählt hast.","Die App lädt schneller und aktualisiert sich gezielter."]},
  {v:"1.38.0.198",d:"November 2026",items:["Neu: die U13 – mit Spielplan, Ergebnissen, Tabelle, Live-Ticker und Push. Die App heißt jetzt „Young Grizzlys“.","Unter Einstellungen › Meine Mannschaften wählst du, ob du U15 A, U15 B und/oder U13 sehen möchtest. Push für die U13 gibt es nur, wenn du sie auswählst."]},
  {v:"1.34.0.183",d:"November 2026",items:["Fan-Tipp: Vor einem Spiel fragt die App einmal freiwillig nach deinem Tipp – mit „Später“ oder „Nicht tippen“. Abschaltbar unter Einstellungen › Tipp-Erinnerung."]},
  {v:"1.30.0.173",d:"November 2026",items:["Saisonbilanz: Tore und Vorlagen nach Rückennummer (ohne Namen) und der Tabellenverlauf – Platz nach jedem Spiel.","Tabelle als Bild zum Teilen – in der Saisonbilanz und unter Downloads.","Einstellungen: „Große Schrift“ für alle Texte."]},
  {v:"1.29.3.171",d:"November 2026",items:["Kein Unentschieden: Steht es nach 60 Minuten gleich, entscheidet in der U15 das Penaltyschießen – Ergebnisse zeigen dann „Sieg n.P.“ bzw. „Niederlage n.P.“."]},
  {v:"1.29.0.168",d:"November 2026",items:["Neue Startseite: Das nächste Spiel steht groß mit Countdown, Ergebnisse sind farbig nach Sieg oder Niederlage.","Mannschafts-Kacheln mit Formkurve und Tabellenplatz, darunter die Saisonbilanz.","Spielplan übersichtlicher: Ansicht, Filter und „Heute“ in einer Zeile.","Neuigkeiten mit Reitern: Hinweise, Berichte, Änderungen und App."]},
  {v:"1.28.0.166",d:"November 2026",items:["Fan-Tipp: Tippe vor jedem Spiel das Ergebnis – anonym, direkt in den Spieldetails. Danach siehst du, wie die anderen Fans getippt haben, und nach dem Spiel, wer richtig lag.","Am Spieltag zeigt die Startseite „Heute“ mit Countdown bis zum Bully.","Im Spielplan springst du über die Monatsleiste direkt zu einem Monat.","Konfetti, wenn du ein gewonnenes Spiel öffnest – abschaltbar unter Einstellungen."]},
  {v:"1.27.0.164",d:"November 2026",items:["Saisonbilanz: Unter den Mannschafts-Kacheln öffnet „📊 Saisonbilanz“ Siege, Tore, Heim- und Auswärtsbilanz, Tore je Drittel, Formkurve und alle Spielberichte der Saison – auch als PDF zum Ausdrucken.","Gegner: Beim Antippen eines Gegners steht oben der Direktvergleich mit allen bisherigen Ergebnissen.","Die App startet schneller."]},
  {v:"1.26.0.158",d:"Oktober 2026",items:["Live-Ticker: Während eines Spiels zeigt die Startseite eine rote Live-Karte mit Spielstand, Drittel und Spielzeit – sie aktualisiert sich von selbst. In den Spieldetails stehen Drittelergebnisse und die Torfolge.","Neue Push-Auswahl unter Einstellungen: „Live-Tore“ und „Drittelergebnisse“ – beides kannst du einzeln einschalten.","Spieler werden in der App nie mit Namen genannt, nur mit Rückennummer."]},
  {v:"1.25.0.156",d:"Oktober 2026",items:["Abgesagte Spiele sind jetzt überall als „Abgesagt“ gekennzeichnet – auf den Spielkarten, im Kalender, in den News und auf den Social-Media-Bildern."]},
  {v:"1.24.0.154",d:"Oktober 2026",items:["Gegner: Die Suche funktioniert jetzt auch auf der Karte – Verein oder Ort eingeben, die Karte zoomt zum Treffer."]},
  {v:"1.23.2.153",d:"Oktober 2026",items:["Anleitung Anzeigetafel: Neues Suchfeld – z. B. „2+2“ eingeben und nur die passende Stelle wird angezeigt.","Regeln: Die Themen stehen jetzt als große Kacheln – ein Tipp öffnet das Thema in einem eigenen Fenster. Die Suche findet weiterhin Regeln aus allen Themen."]},
  {v:"1.22.3.148",d:"Oktober 2026",items:["Gegner: Neue Karte mit allen Gegnern an ihren Spielorten – umschaltbar zwischen Liste und Karte, mit Filter Alle / U15 A / U15 B. Ein Tipp auf ein Logo zeigt Halle, Entfernung, Spiele und Route.","Entfernungen neu berechnet: Alle km-Angaben gelten jetzt als Fahrstrecke von unserer Eishalle bis zur Eishalle des Gegners.","Startseite: Die letzten Ergebnisse beider Mannschaften stehen jetzt kompakt in einer Karte – antippen öffnet die Spieldetails.","Besser lesbar: Kleine Schriften (z. B. Entfernung, Heim/Auswärts, Hinweise) sind etwas größer.","Datenschutz: Neue Seite „Datenschutz & Kontakt“ (Info und Einstellungen). Die Nutzungsstatistik läuft nur noch, wenn du zustimmst – änderbar unter Einstellungen › Datenschutz.","Feedback: Bricht beim Senden die Verbindung ab, bleibt dein Text gespeichert – mit „Nochmal senden“ schickst du ihn später einfach erneut ab."]},
  {id:"1.9.1.138",v:"1.19.1.138",d:"Oktober 2026",items:["Neu in der Info: „So findest du dich zurecht“ – alle Bereiche der App auf einen Blick, ein Tipp bringt dich direkt hin."]},
  {id:"1.9.1.137",v:"1.19.0.137",d:"Oktober 2026",items:["Ergebnisbilder in Downloads: Beim Teilen kommt jetzt der Kurzbericht zum Spiel als Text mit."]},
  {id:"1.9.1.133",v:"1.17.0.131",d:"Oktober 2026",items:["Neu: Spielberichte! Nach dem Spiel gibt es einen kurzen Bericht – in den News, auf der Startseite beim letzten Spiel und in den Spieldetails.","Gespielte Spiele zeigen statt Route und Adresse nur noch, wo gespielt wurde."]},
  {id:"1.9.1.120",v:"1.15.1.120",d:"Oktober 2026",items:["Regeln: neue Nachwuchs-Regeln aus NRW (Anhang 4) – z. B. wer in der U15 spielt, Bodycheck ab U15, Zahnschutz-Pflicht, A- und B-Mannschaft, Torhüter-Einsatzzeiten. Die Themen stehen jetzt aufgeräumt im Menü ☰ neben der Suche."]},
  {id:"1.9.1.117",v:"1.15.0.117",d:"Oktober 2026",items:["Regeln: neues Thema „Handzeichen“ – 30 Zeichen der Schiedsrichter und Linienrichter mit Bild und kurzer Erklärung, auch über die Suche zu finden (z. B. „Hüfte“ oder „Arme gekreuzt“)."]},
  {id:"1.9.1.115",v:"1.15.0.117",d:"Oktober 2026",items:["Downloads: neue Kurzanleitung „Anzeigetafel bedienen“ für das Kampfgericht – Stramatel-Hauptpult und Strafzeitpulte mit Tastenbild, Schritt für Schritt."]},
  {id:"1.9.1.113",v:"1.15.0.117",d:"Oktober 2026",items:["Neuer Reiter „Regeln“: die wichtigsten Eishockey-Regeln einfach erklärt – von Abseits und Icing über Strafen und Fouls bis zur Schutzausrüstung im Nachwuchs. Mit Suchfeld und Themen-Knöpfen; auch per Wischen erreichbar."]},
  {id:"1.9.1.108",v:"1.13.0.108",d:"Oktober 2026",items:["Schneller: Logos und Bilder sind deutlich kleiner – die App lädt beim ersten Öffnen schneller und braucht weniger Datenvolumen."]},
  {id:"1.9.1.103",v:"1.13.0.108",d:"Oktober 2026",items:["In Einstellungen und Info bringt dich ein Wisch nach rechts zurück; das News-Fenster schließt sich mit einem Wisch nach rechts oder unten.","Beim Scrollen zeigt eine schmale Leiste rechts, wo du auf der Seite bist – im Spielplan mit dem Monat. Den Balken kannst du anfassen und ziehen, um schnell zu springen.","Wischen: Mit einem Wisch nach links oder rechts wechselst du zwischen Start, Spielplan, Gegner und Downloads – die Seite folgt dabei deinem Finger."]},
  {id:"1.9.1.95",v:"1.12.2.96",d:"Oktober 2026",items:[
    "Startseite: nächstes und letztes Spiel von U15 A und U15 B auf einen Blick, die Mannschafts-Kacheln sind kompakter.",
    "Spielplan: Gespielte Spiele sind eingeklappt – „Gespielte Spiele anzeigen“ blendet sie wieder ein.",
    "Einstellungen und Info sind aufgeräumt."]},
  {id:"1.9.1.90",v:"1.11.0.90",d:"Oktober 2026",items:[
    "Push zuverlässiger: Die App erneuert ihre Push-Anmeldung jetzt regelmäßig von selbst.",
    "Kommt bei dir kein Push an? In den Einstellungen gibt es dafür unter dem Push-Knopf „Neu einrichten“."]},
  {id:"1.9.1.83",v:"1.10.0.83",d:"Oktober 2026",items:[
    "Gameday: An Spieltagen leuchtet oben „GAME DAY“ – mit Countdown bis zum Bully, während des Spiels „Läuft gerade“ und danach das Ergebnis.",
    "Beim ersten Öffnen am Spieltag zeigt die App kurz die Paarung, Uhrzeit und Halle. Einfach antippen zum Schließen."]},
  {v:"1.9.1.66",d:"Oktober 2026",items:[
    "Spielkarten zum Aufklappen: Ein Tipp zeigt Tabellenplatz, Form, Halle und alle Aktionen.",
    "Startseite: Nächstes und letztes Spiel mit Farbband – Sieg oder Niederlage auf einen Blick.",
    "„Ergebnis teilen“ teilt jetzt den Endstand mit Dritteln.",
    "Downloads: Bilder für Social Media – Spieltagsbild ab 5 Tage vor dem Spiel, Ergebnisbild bis 5 Tage danach.",
    "Neu: dieser News-Bereich mit Hinweisen, Spieländerungen und Neuigkeiten zur App."]},
  {v:"1.9.0.65",d:"Oktober 2026",items:[
    "Tabellenplatz, Spiele, Punkte und Tordifferenz bei jeder Paarung.",
    "Form der letzten fünf Spiele und Drittelergebnisse.",
    "Ergebnisse werden automatisch vom EHV NRW übernommen.",
    "Schulferien NRW im Kalender."]}
];
const NEWS_SEEN_KEY="grizzlysNewsSeen";
function newsSeen(){try{const x=JSON.parse(localStorage.getItem(NEWS_SEEN_KEY)||"null");return Array.isArray(x)?x:null}catch(e){return null}}
function newsSave(arr){try{localStorage.setItem(NEWS_SEEN_KEY,JSON.stringify(arr.slice(-300)))}catch(e){}}
let newsSeenMem=newsSeen();
if(!newsSeenMem){newsSeenMem=APP_NEWS.slice(1).map(x=>"v:"+(x.id||x.v));newsSave(newsSeenMem)}
/* 1.25.1: Sammel-Eintrag nach Live-Versionen aufgeteilt – die älteren Teile sind schon bekannt und gelten als gelesen */
["v:1.24.0.154","v:1.23.2.153","v:1.22.3.148"].forEach(id=>{if(!newsSeenMem.includes(id))newsSeenMem.push(id)});newsSave(newsSeenMem);
function newsToday(){const d=new Date();d.setHours(0,0,0,0);return d}
function newsActiveNotes(){
  const t=newsToday();
  return (window.newsNotes||[]).filter(n=>(!n.until||new Date(n.until+"T23:59:59")>=t)&&(!n.team||window.myTeam(n.team)));
}
/* 1.9.1.126: Tippfehler-Korrekturen nicht als Spieländerung melden */
function chgNorm(x){return String(x||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,"")}
function chgDist(a,b){/* Damerau-Levenshtein (Vertauschung zählt als 1) */
  const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++){d[i]=[i];for(let j=1;j<=n;j++)d[i][j]=i?0:j}
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const c=a[i-1]===b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}
  return d[m][n];
}
/* gleich = identisch oder nur Schreibweise (Groß/klein, Leerzeichen, Umlaute, 1–2 vertippte Buchstaben). Andere Ziffern (z. B. „1b“) zählen immer als echte Änderung. */
function chgSame(a,b){
  if(a===b)return true;const x=chgNorm(a),y=chgNorm(b);if(x===y)return true;
  if(x.replace(/\D/g,"")!==y.replace(/\D/g,""))return false;
  const m=Math.max(x.length,y.length);if(m<4)return false;
  return chgDist(x,y)<=(m>=12?2:1);
}
/* Was hat sich gegenüber dem Original wirklich geändert? */
function chgFields(b,v){const f=[];if(b.date!==v.date)f.push("date");if(b.time!==v.time)f.push("time");["stadium","home","away"].forEach(k=>{if(!chgSame(b[k],v[k]))f.push(k)});return f}
window.chgFields=chgFields;
function newsChanges(){
  const ov=(window.getScheduleOverrides&&window.getScheduleOverrides())||{}, t=newsToday().getTime()-86400000, out=[];
  games.forEach(g=>{
    const o=ov[g._baseId]; if(!o||!g._base)return;
    if(o.news===false)return; /* im Admin bewusst „nicht in den News“ */
    if(dt(g).getTime()<t)return;
    const b=g._base, diff=[], same=o.news===true?(x,y)=>x===y:chgSame;
    if(g.cancelled)diff.push(g.postponed?"Spiel verlegt":"Spiel abgesagt");
    if(b.date!==g.date||b.time!==g.time)diff.push("vorher "+new Date(b.date+"T"+b.time).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})+" · "+b.time+" Uhr");
    if(!same(b.stadium,g.stadium))diff.push("Ort vorher "+b.stadium);
    if(!same(b.home,g.home)||!same(b.away,g.away))diff.push("Paarung geändert");
    if(!diff.length)return;
    out.push({id:"c:"+g._baseId+":"+g.date+g.time+g.stadium+(g.cancelled?":x":""),g,diff});
  });
  return out.sort((a,b)=>dt(a.g)-dt(b.g));
}
/* ===== 1.37.0: Spielbericht-Vorlage liegt in spielbericht.js (gemeinsam mit der Cloud Function) ===== */
window.gameReports=window.gameReports||{};
window.repDetails=window.repDetails||{};
const rkey=g=>g.date+"_"+g.time.replace(/:/g,"")+"_"+g.team;
let __SB=null;
/* 1.37.1: Bausteine der letzten 8 Berichte dieser Mannschaft meiden */
function repRecent(g){const k0=rkey(g),m={};Object.entries(window.gameReports||{}).filter(([k,r])=>r&&r.bausteine&&k!==k0&&k.endsWith("_"+g.team)&&k<k0).sort((a,b)=>a[0]<b[0]?-1:1).slice(-8).forEach(([,r])=>Object.entries(r.bausteine).forEach(([s,i])=>{(m[s]=m[s]||[]).push(i)}));return m}
function SB(){return __SB||(__SB=window.createSpielbericht({win:window,ALL_GAMES,standings:()=>standings,dt,isHome,shortTeam,teamName,standRow,standPeriodsData,leagues:()=>INSTA_LEAGUE,recent:repRecent}))}
function repEhvGame(g){return SB().repEhvGame(g)}
function repDraft(g,variant,kw,use,len){return SB().repDraft(g,variant,kw,use,len)}
function repAiPrompt(g,kw,len,use){return SB().repAiPrompt(g,kw,len,use)}
function repKeywordSentences(a,b,c,d){return SB().repKeywordSentences(a,b,c,d)}
window.repDraft=repDraft; window.repAiPrompt=repAiPrompt; window.repKeywordSentences=repKeywordSentences;
function repPublished(){
  const t=newsToday().getTime()-14*86400000;
  return games.map(g=>({g,r:window.gameReports[rkey(g)]})).filter(x=>x.r&&x.r.published&&x.r.text&&dt(x.g).getTime()>=t).sort((a,b)=>dt(b.g)-dt(a.g));
}
const NEWS_IC={
  note:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 16.5h4"/>',
  report:'<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4M9 12h6M9 16h6"/>',
  change:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  app:'<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>',
  cancel:'<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>'};
function newsIc(k){return '<svg class="nIc" viewBox="0 0 24 24" aria-hidden="true">'+NEWS_IC[k]+'</svg>'}
function repHtml(r){return `<div class="mdReport"><div class="mdReportHead">${newsIc("report")} Spielbericht</div><b>${esc(r.title||"")}</b><p>${esc(r.text)}</p></div>`}
window.repHtml=repHtml;
window.repFor=g=>{const r=(window.gameReports||{})[rkey(g)];return r&&r.published&&r.text?r:null};
function newsReportHtml(x,unread){
  const g=x.g, day=dt(g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
  return `<button class="newsItem newsChange newsReport${unread?" unread":""}" data-team="${esc(g.team)}" data-rid="${esc(rkey(g))}" type="button"><div class="newsItemHead"><span class="teamBadge">${esc(teamName(g.team))}</span><span class="newsDate">${esc(day)}</span></div><b>${esc(x.r.title||"Spielbericht")}</b><p class="newsRepTx">${esc(x.r.text)}</p></button>`;
}
const repNid=x=>"r:"+rkey(x.g)+":"+(x.r.publishedAt||0);
function newsItemsAll(){
  return [...newsActiveNotes().map(n=>({id:"n:"+n.id,kind:"note",n})),...repPublished().map(x=>({...x,id:repNid(x),kind:"report"})),...newsChanges().map(c=>({...c,kind:"change"})),...APP_NEWS.map(x=>({id:"v:"+(x.id||x.v),kind:"app",x}))];
}
function newsUnread(){const s=new Set(newsSeenMem);return newsItemsAll().filter(i=>!s.has(i.id))}
function newsMarkSeen(ids){ids.forEach(id=>{if(!newsSeenMem.includes(id))newsSeenMem.push(id)});newsSave(newsSeenMem)}
function newsFmtCreated(ms){return ms?new Date(ms).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"}):""}
function newsNoteHtml(n,unread){
  return `<div class="newsItem newsNote${unread?" unread":""}"${n.team?` data-team="${esc(n.team)}"`:""}><div class="newsItemHead">${n.team?`<span class="teamBadge">${esc(teamName(n.team))}</span>`:'<span class="teamBadge both">'+(window.oneTeam()?esc(teamName(window.MY_TEAMS[0])):window.MY_TEAMS.join('')==='AB'?'A + B':'Alle')+'</span>'}<span class="newsDate">${esc(newsFmtCreated(n.created))}</span></div><b>${esc(n.title)}</b>${n.text?`<p>${esc(n.text)}</p>`:""}</div>`;
}
function newsChangeHtml(c,unread){
  const g=c.g, day=dt(g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
  return `<button class="newsItem newsChange${unread?" unread":""}" data-team="${esc(g.team)}" data-cid="${esc(c.id)}" type="button"><div class="newsItemHead"><span class="teamBadge">${esc(teamName(g.team))}</span><span class="newsDate">${g.cancelled?"Absage":"Spieländerung"}</span></div><b>${esc(shortTeam(g.home))} – ${esc(shortTeam(g.away))}</b><p>${g.cancelled?`<span class="newsNew">${newsIc("cancel")} ${g.postponed?"Verlegt, neuer Termin offen – ursprünglich":"Abgesagt:"} ${esc(day)} · ${esc(g.time)} Uhr · ${esc(g.stadium)}</span>${c.diff.filter(x=>!/^Spiel (abgesagt|verlegt)$/.test(x)).length?"<br>"+c.diff.filter(x=>!/^Spiel (abgesagt|verlegt)$/.test(x)).map(esc).join(" · "):""}`:`<span class="newsNew">Neu: ${esc(day)} · ${esc(g.time)} Uhr · ${esc(g.stadium)}</span><br>${c.diff.map(esc).join(" · ")}`}</p></button>`;
}
function renderNews(){
  const items=newsUnread(), n=items.length, badge=document.getElementById("newsBadge");
  if(badge){badge.hidden=!n;badge.textContent=n>9?"9+":String(n)}
  const btn=document.getElementById("newsTopBtn"); if(btn)btn.setAttribute("aria-label",n?"Neuigkeiten, "+n+" ungelesen":"Neuigkeiten");
  /* Startseite: neuester ungelesener Hinweis oder Spieländerung */
  const top=items.find(i=>i.kind==="note")||items.find(i=>i.kind==="report")||items.find(i=>i.kind==="change");
  let ban=document.getElementById("newsBanner"); const anchor=document.getElementById("g3HomeNext")||document.querySelector(".next");
  if(!ban&&anchor){ban=document.createElement("div");ban.id="newsBanner";ban.className="newsBanner";anchor.parentNode.insertBefore(ban,anchor)}
  if(ban){
    if(!top){ban.hidden=true}
    else{
      ban.hidden=false;
      const reps=top.kind==="report"?items.filter(i=>i.kind==="report"&&i.g.date===top.g.date).sort((a,b)=>dt(a.g)-dt(b.g)):[];
      if(reps.length>1){
        ban.innerHTML=`<div class="newsBannerMulti">${reps.map((i,n)=>`<button class="newsBannerMain" type="button" data-i="${n}"><span class="newsBannerIc">📝</span><span class="newsBannerTx"><small>Spielbericht ${esc(teamName(i.g.team))}</small>${esc(i.r.title||"Spielbericht")}</span></button>`).join("")}</div><button class="newsBannerX" type="button" aria-label="Hinweise ausblenden">×</button>`;
        ban.querySelectorAll(".newsBannerMain").forEach(b=>b.onclick=()=>{const i=reps[Number(b.dataset.i)];newsMarkSeen([i.id]);renderNews();openMatchDetails(i.g,true)});
        ban.querySelector(".newsBannerX").onclick=()=>{newsMarkSeen(reps.map(i=>i.id));renderNews()};
        const m0=document.getElementById("newsModal"); if(m0&&!m0.hidden)newsFill();
        return;
      }
      const txt=top.kind==="note"?top.n.title:top.kind==="report"?(top.r.title||"Spielbericht"):top.g.cancelled?(top.g.postponed?"Verlegt, Termin offen ":"Abgesagt ")+teamName(top.g.team)+": "+shortTeam(top.g.home)+" – "+shortTeam(top.g.away)+" am "+dt(top.g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})+" "+top.g.time+" Uhr"
      :"Spieländerung "+teamName(top.g.team)+": "+shortTeam(top.g.home)+" – "+shortTeam(top.g.away)+", jetzt "+dt(top.g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})+" "+top.g.time+" Uhr";
      ban.innerHTML=`<button class="newsBannerMain" type="button"><span class="newsBannerIc">${newsIc(top.kind==="note"?"note":top.kind==="report"?"report":top.g&&top.g.cancelled?"cancel":"change")}</span><span class="newsBannerTx"><small>${top.kind==="note"?"Hinweis":top.kind==="report"?"Spielbericht":top.g&&top.g.cancelled?"Absage":"Spieländerung"}</small>${esc(txt)}</span></button><button class="newsBannerX" type="button" aria-label="Hinweis ausblenden">×</button>`;
      ban.querySelector(".newsBannerMain").onclick=()=>{if(top.kind==="report"){newsMarkSeen([top.id]);renderNews();openMatchDetails(top.g,true)}else openNews()};
      ban.querySelector(".newsBannerX").onclick=()=>{newsMarkSeen([top.id]);renderNews()};
    }
  }
  const m=document.getElementById("newsModal"); if(m&&!m.hidden)newsFill();
}
/* 1.29.1: Neuigkeiten mit Reitern */
let newsTab=null, newsSnap=null;
function newsFill(){
  const body=document.getElementById("newsBody"); if(!body)return;
  const s=new Set(newsSeenMem), isNew=id=>newsSnap?newsSnap.has(id):!s.has(id);
  const notes=newsActiveNotes(), ch=newsChanges(), rp=repPublished(), app=APP_NEWS.slice(0,5);
  const T=[
    {k:"notes",ic:newsIc("note"),l:"Hinweise",n:notes.length,u:notes.filter(x=>isNew("n:"+x.id)).length},
    {k:"reports",ic:newsIc("report"),l:"Berichte",n:rp.length,u:rp.filter(x=>isNew(repNid(x))).length},
    {k:"changes",ic:newsIc("change"),l:"Änderungen",n:ch.length,u:ch.filter(c=>isNew(c.id)).length},
    {k:"app",ic:newsIc("app"),l:"App",n:app.length,u:app.filter(x=>isNew("v:"+(x.id||x.v))).length}];
  if(!newsTab||!T.some(t=>t.k===newsTab))newsTab=(T.find(t=>t.u&&t.k!=="app")||T.find(t=>t.n&&t.k!=="app")||T.find(t=>t.u)||T[0]).k;
  const pane=newsTab==="notes"?(notes.length?notes.map(x=>newsNoteHtml(x,isNew("n:"+x.id))).join(""):'<div class="small newsEmpty">Aktuell keine Hinweise.</div>')
    :newsTab==="reports"?(rp.length?rp.map(x=>newsReportHtml(x,isNew(repNid(x)))).join(""):emptyBox("doc","Keine Spielberichte","In den letzten 14 Tagen gab es keine Berichte."))
    :newsTab==="changes"?(ch.length?ch.map(c=>newsChangeHtml(c,isNew(c.id))).join(""):emptyBox("cal","Keine Terminänderungen","Alle Spiele finden wie geplant statt."))
    :wishTeaser()+app.map((x,ai)=>`<div class="newsItem newsApp${isNew("v:"+(x.id||x.v))?" unread":""}"><div class="newsItemHead"><b>Version ${esc(x.v)}</b><span class="newsDate">${esc(x.d)}</span></div><ul>${x.items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>${ai<3?rxBar("neu_"+x.v,"Gefällt dir das?"):""}</div>`).join("")+fbLinkHtml("news");
  body.innerHTML=`<div class="newsTabs" role="tablist" aria-label="Bereiche">${T.map(t=>`<button type="button" role="tab" class="newsTab${t.k===newsTab?" on":""}" aria-selected="${t.k===newsTab}" data-nt="${t.k}"><span class="ntIc" aria-hidden="true">${t.ic}</span><span class="ntL">${t.l}</span>${t.u?`<i class="ntNew" aria-label="${t.u} neu">${t.u}</i>`:t.n&&t.k!=="app"?`<small class="ntN">${t.n}</small>`:""}</button>`).join("")}</div><div class="newsPane" role="tabpanel">${pane}</div>`;
  body.querySelectorAll(".newsTab").forEach(b=>b.onclick=()=>{newsTab=b.dataset.nt;newsFill()});
  body.querySelectorAll(".newsItem.newsChange[data-cid]").forEach(b=>{const c=ch.find(x=>x.id===b.dataset.cid);b.onclick=()=>{closeNews();openMatchDetails(c.g)}});
  body.querySelectorAll(".newsReport").forEach(b=>{const x=rp.find(y=>rkey(y.g)===b.dataset.rid);b.onclick=()=>{closeNews();openMatchDetails(x.g)}});
}
function openNews(){
  let m=document.getElementById("newsModal");
  if(!m){m=document.createElement("div");m.id="newsModal";m.className="matchModal newsModal";m.hidden=true;
    m.innerHTML='<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="newsTitle"><div class="matchModalHead"><div id="newsTitle" class="matchModalTitle">Neuigkeiten</div><button id="newsClose" class="matchModalClose" type="button" aria-label="Schließen">×</button></div><div id="newsBody"></div></div>';
    document.body.appendChild(m);m.querySelector("#newsClose").onclick=closeNews;m.addEventListener("click",e=>{if(e.target===m)closeNews()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)closeNews()});}
  newsTab=null;newsSnap=new Set(newsUnread().map(i=>i.id));
  newsFill();m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  newsMarkSeen(newsItemsAll().map(i=>i.id));
  setTimeout(()=>{const b=document.getElementById("newsBadge");if(b)b.hidden=true;const ban=document.getElementById("newsBanner");if(ban)ban.hidden=true},0);
}
function closeNews(){newsSnap=null;const m=document.getElementById("newsModal");if(m){m.hidden=true;m.setAttribute("aria-hidden","true");m.querySelectorAll(".unread").forEach(x=>x.classList.remove("unread"))}document.body.style.overflow="";renderNews()}
window.renderNews=renderNews;window.openNews=openNews;
/* 1.9.1.138: Übersicht „So findest du dich zurecht“ in der Info – Einträge springen an die Stelle */
document.querySelectorAll("#appMap [data-go]").forEach(b=>b.onclick=()=>{const k=b.dataset.go;
  if(k==="news"){openNews();return}
  showView(k==="start"?"home":k)});
document.getElementById("newsTopBtn").onclick=openNews;

/* ===== Gameday ===== */
(function(){
  const hero=document.querySelector(".hero"), season=document.querySelector(".heroChips .season");
  if(!hero)return;
  const head=document.createElement("div");head.className="gdHead";head.setAttribute("aria-hidden","true");head.innerHTML="<b>GAME<br>DAY</b>";hero.appendChild(head);
  const seasonHTML=season?season.innerHTML:"";
  const sameDay=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
  const hm=g=>g.time.replace(/^0/,"");
  function todays(){const n=new Date();return games.filter(g=>sameDay(dt(g),n)&&!g.cancelled).sort((a,b)=>dt(a)-dt(b))}
  /* 1.9.1.125: Status eines einzelnen Spiels (vor dem Spiel, läuft, Ergebnis) */
  function gameText(g,now){
    const s=dt(g).getTime(), r=resInfo(g);
    if(r){const home=isHome(g),our=home?r.hs:r.as,their=home?r.as:r.hs;return (r.o==="w"?"🎉 ":"")+outLabel(r)+" "+our+":"+their}
    if(now>=s&&now<s+2.5*3600000)return "🏒 Läuft gerade";
    if(s>now){const m=Math.max(0,Math.round((s-now)/60000));const h=Math.floor(m/60),mm=m%60;
      return "🏒 Bully in "+(h?h+":"+String(mm).padStart(2,"0")+" h":mm+" min")}
    return "🏒 Ergebnis folgt";
  }
  function chipText(list){
    const now=Date.now();
    if(list.length===1)return gameText(list[0],now);
    /* An Tagen mit zwei (oder mehr) Spielen: jedes Spiel in einer eigenen Zeile */
    return list.map(g=>teamName(g.team)+" · "+gameText(g,now));
  }
  function update(){
    const list=todays(), on=list.length>0;
    document.documentElement.classList.toggle("gameday",on);
    if(season){
      if(on){const t=chipText(list);
        if(Array.isArray(t)){season.classList.add("gdMulti");season.innerHTML=t.map(x=>'<span class="gdLine">'+esc(x)+'</span>').join("")}
        else{season.classList.remove("gdMulti");season.textContent=t}}
      else{season.classList.remove("gdMulti");if(season.innerHTML!==seasonHTML)season.innerHTML=seasonHTML}
    }
  }
  function splash(){
    const list=todays(); if(!list.length)return;
    const n=new Date(), key="grizzlysGameday"+n.getFullYear()+"-"+(n.getMonth()+1)+"-"+n.getDate();
    try{if(localStorage.getItem(key))return;localStorage.setItem(key,"1")}catch(e){}
    if(Date.now()>dt(list[list.length-1]).getTime()+2.5*3600000)return;
    const logo=(document.querySelector(".heroTop img")||{}).getAttribute?document.querySelector(".heroTop img").getAttribute("src"):"logo.png";
    const el=document.createElement("div");el.className="gdSplash";el.setAttribute("role","dialog");el.setAttribute("aria-label","Gameday");
    el.innerHTML='<div class="gdCrack"></div><div class="gdIn"><img class="gdLogo" src="'+esc(logo)+'" alt=""><span class="gdWord">GAMEDAY</span>'+
      list.map(g=>'<div class="gdGame"><div class="gdVs"><span>'+esc(shortTeam(g.home))+'</span><em>vs</em><span>'+esc(shortTeam(g.away))+'</span></div><span class="gdT">'+esc(teamName(g.team))+' · '+esc(hm(g))+' Uhr · '+esc(g.stadium)+'</span></div>').join("")+
      '<div class="gdHint">Tippen zum Schließen</div></div>';
    const close=()=>{if(el.parentNode)el.remove()};
    el.addEventListener("click",close);el.addEventListener("animationend",e=>{if(e.animationName==="gdOut")close()});
    document.body.appendChild(el);setTimeout(close,3600);
    try{navigator.vibrate&&navigator.vibrate([60,40,120])}catch(e){}
  }
  window.gamedayUpdate=update;
  update();setInterval(update,30000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden){update();splash()}});
  {const prev=window.applyResults;window.applyResults=function(){prev&&prev.apply(this,arguments);try{update()}catch(e){}};}
  setTimeout(splash,(window.__introMs||0)+350);
})();



/* 1.34.0: Fan-Tipp-Popup – fragt freiwillig nach einem Tipp, solange noch nicht getippt wurde */
const FTP_KEY="grizzlysFtPop", FTP_DAYS=4, FTP_SNOOZE=6*3600*1000;
function ftpState(){try{return JSON.parse(localStorage.getItem(FTP_KEY)||"{}")}catch(e){return{}}}
function ftpSet(key,val){const st=ftpState();st[key]=val;const now=Date.now();Object.keys(st).forEach(k=>{const g=games.find(x=>ftKey(x)===k);if(!g||dt(g).getTime()<now-86400000)delete st[k]});try{localStorage.setItem(FTP_KEY,JSON.stringify(st))}catch(e){}}
function ftpOff(){try{return localStorage.getItem("grizzlysFtPopOff")==="1"}catch(e){return false}}
function ftpCandidates(){
  if(ftpOff())return [];
  const now=Date.now(),mine=ftMine(),st=ftpState();
  return games.filter(g=>{const t=dt(g).getTime(),k=ftKey(g),v=st[k];
    return ftOpen(g)&&t-now<FTP_DAYS*86400000&&t-now>10*60000&&!mine[k]&&v!=="no"&&!(typeof v==="number"&&v>now)}).sort((a,b)=>dt(a)-dt(b));
}
function ftpBusy(){
  if(document.documentElement.classList.contains("intro"))return true;
  if(document.querySelector(".gdSplash"))return true;
  if(document.querySelector(".matchModal:not([hidden]),.adminModal:not([hidden]),.bugReportModal:not([hidden])"))return true;
  const cb=document.getElementById("consentBar");if(cb&&!cb.hidden&&cb.offsetParent!==null)return true;
  return false;
}
function ftpClose(mode){
  const m=document.getElementById("ftPop");if(!m||m.hidden)return;const key=m.dataset.key,pv=m.dataset.preview==="1";m.dataset.preview="";
  if(pv&&window.__ftEdit)delete window.__ftEdit[key];
  if(key&&!pv&&!ftMine()[key]){if(mode==="no")ftpSet(key,"no");else ftpSet(key,Date.now()+FTP_SNOOZE)}
  try{trackAnalyticsEvent("fan_tip_popup",{aktion:mode||"spaeter"})}catch(e){}
  m.hidden=true;m.setAttribute("aria-hidden","true");document.body.classList.remove("ftPopOpen");
  const tile=m.querySelector(".ftTile");if(tile){tile.innerHTML="";tile.removeAttribute("data-ft")}
}
/* 1.34.1: Vorschau für den Admin – auch wenn schon getippt oder abgelehnt wurde; ändert nichts an „Später“/„Nicht tippen“ */
function ftpPreview(){
  const g=games.filter(ftOpen).sort((a,b)=>dt(a)-dt(b))[0];
  if(!g){alert("Gerade gibt es kein kommendes Spiel, für das getippt werden kann.");return}
  const key=ftKey(g);window.__ftEdit=window.__ftEdit||{};window.__ftEdit[key]=true;
  try{if(typeof closeAdminModal==="function")closeAdminModal();else{const a=document.getElementById("adminModal");a.hidden=true;a.setAttribute("aria-hidden","true");document.body.style.overflow=""}}catch(e){}
  ftpShow(g);document.getElementById("ftPop").dataset.preview="1";
}
window.ftpPreview=ftpPreview;
function ftpShow(g){
  const m=document.getElementById("ftPop");if(!m)return;const key=ftKey(g),d=dt(g);
  m.dataset.key=key;
  m.querySelector(".ftPopGame").textContent=`${teamName(g.team)} · ${d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})} · ${g.time} Uhr · ${isHome(g)?"Heimspiel":"auswärts"}`;
  const tile=m.querySelector(".ftTile");tile.dataset.ft=key;tile.innerHTML=ftInner(g);ftBind(tile,g);
  const foot=m.querySelector(".ftPopFoot");foot.hidden=false;m.querySelector(".ftPopDone").hidden=true;
  m.hidden=false;m.setAttribute("aria-hidden","false");document.body.classList.add("ftPopOpen");
  try{trackAnalyticsEvent("fan_tip_popup",{aktion:"gezeigt",team:teamName(g.team)})}catch(e){}
  if(window.ftLoad&&!(window.__ftLoaded||{})[key]){window.__ftLoaded=window.__ftLoaded||{};window.__ftLoaded[key]=1;window.ftLoad(key).then(()=>{if(m.dataset.key===key)ftRefresh(key)})}
  setTimeout(()=>m.querySelector("[data-ft-send]")?.focus({preventScroll:true}),60);
}
/* nach dem Tipp: Fertig oder nächstes Spiel */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#ftPop [data-ft-send]");if(!b)return;
  let n=0;const wait=()=>{const m=document.getElementById("ftPop");if(!m||m.hidden)return;if(!ftMine()[m.dataset.key]){if(++n<40)setTimeout(wait,150);return}
    m.querySelector(".ftPopFoot").hidden=true;const nx=ftpCandidates()[0],done=m.querySelector(".ftPopDone");done.hidden=false;
    const btn=done.querySelector("[data-ftp-next]");btn.hidden=!nx;if(nx)btn.textContent="Nächstes Spiel tippen: "+shortTeam(opponent(nx));
    btn.onclick=()=>nx&&ftpShow(nx);try{trackAnalyticsEvent("fan_tip_popup",{aktion:"getippt"})}catch(err){}};setTimeout(wait,100)},true);
document.addEventListener("DOMContentLoaded",()=>{
  const m=document.getElementById("ftPop");if(!m)return;
  m.querySelector(".ftPopX").onclick=()=>ftpClose("spaeter");
  m.querySelector("[data-ftp-later]").onclick=()=>ftpClose("spaeter");
  m.querySelector("[data-ftp-no]").onclick=()=>ftpClose("no");
  m.querySelector("[data-ftp-close]").onclick=()=>ftpClose("fertig");
  document.getElementById("admFtpPreview")?.addEventListener("click",ftpPreview);
  if(location.hash==="#tipp-vorschau")setTimeout(ftpPreview,(window.__introMs||0)+1500);
  m.addEventListener("click",e=>{if(e.target===m)ftpClose("spaeter")});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)ftpClose("spaeter")});
  const tg=document.getElementById("ftPopToggle");if(tg){tg.checked=!ftpOff();tg.onchange=()=>{try{localStorage.setItem("grizzlysFtPopOff",tg.checked?"0":"1")}catch(e){}}}
  if(navigator.webdriver&&location.hash!=="#tipp")return;
  let tries=0;const tick=()=>{if(++tries>60)return;if(ftpBusy()){setTimeout(tick,700);return}const c=ftpCandidates();if(c.length)ftpShow(c[0])};
  setTimeout(tick,(window.__introMs||0)+1800);
});

/* 1.33.1: angedockte Menüleiste erkennen */
(function(){const t=document.querySelector(".tabs");if(!t)return;let q=false;
  const chk=()=>{q=false;const top=parseFloat(getComputedStyle(t).top)||0;document.documentElement.classList.toggle("tabsStuck",window.scrollY>0&&t.getBoundingClientRect().top<=top+1)};
  window.addEventListener("scroll",()=>{if(!q){q=true;requestAnimationFrame(chk)}},{passive:true});window.addEventListener("resize",chk);chk();})();

/* Halloween: Bodennebel und gelegentlicher Fledermaus-Schwarm */
(function(){
  const fog=document.createElement("div");fog.className="hwFog";fog.setAttribute("aria-hidden","true");fog.innerHTML="<i></i><i></i>";document.body.appendChild(fog);
  const bats=document.createElement("div");bats.className="hwBats";bats.setAttribute("aria-hidden","true");document.body.appendChild(bats);
  let n=0;
  function fly(){
    const on=document.documentElement.classList.contains("hw")&&!document.hidden&&!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
    if(on){bats.classList.remove("fly","rev");void bats.offsetWidth;bats.style.top=(14+Math.random()*45)+"%";if(n++%2)bats.classList.add("rev");bats.classList.add("fly")}
    setTimeout(fly,30000+Math.random()*30000);
  }
  setTimeout(fly,6000);
})();


/* Weihnachten: gelegentlich fliegt der Schlitten über die Seite */
(function(){
  const sl=document.createElement("div");sl.className="xmSleigh";sl.setAttribute("aria-hidden","true");document.body.appendChild(sl);
  function fly(){
    const on=document.documentElement.classList.contains("xm")&&!document.hidden&&!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
    if(on){sl.classList.remove("fly");void sl.offsetWidth;sl.style.top=(12+Math.random()*40)+"%";sl.classList.add("fly")}
    setTimeout(fly,40000+Math.random()*40000);
  }
  setTimeout(fly,8000);
})();

/* ===== Weihnachts-Design und Adventskalender (1.12.–6.1.) ===== */
function xmSeasonYear(d){d=d||new Date();return d.getMonth()===0?d.getFullYear()-1:d.getFullYear()}
/* Letztes Spiel einer Mannschaft im laufenden Kalenderjahr bekommt im Weihnachts-Design eine Plakette */
function xmBadge(g){
  if(!document.documentElement.classList.contains("xm"))return "";
  const y=dt(g).getFullYear(); if(dt(g).getMonth()<10)return "";
  const last=ALL_GAMES.filter(x=>x.team===g.team&&dt(x).getFullYear()===y).sort((a,b)=>dt(b)-dt(a))[0];
  return last===g?`<span class="xmBadge">🎄 Letztes Spiel ${y}</span>`:"";
}
const XM_RULES=[
 {q:"Wann gibt es „Icing“ (unerlaubter Weitschuss)?",a:["Der Puck wird aus der eigenen Hälfte über die gegnerische Torlinie geschossen, ohne dass ihn jemand berührt","Der Puck prallt an die Bande und springt zurück ins eigene Drittel","Zwei Spieler derselben Mannschaft berühren den Puck gleichzeitig"],i:"Danach gibt es ein Bully im Verteidigungsdrittel der Mannschaft, die das Icing verursacht hat."},
 {q:"Wie viele Spieler einer Mannschaft stehen normalerweise gleichzeitig auf dem Eis?",a:["6 – fünf Feldspieler und ein Torhüter","5 – vier Feldspieler und ein Torhüter","7 – sechs Feldspieler und ein Torhüter"],i:"Bei einer Strafe spielt die Mannschaft mit einem Spieler weniger – das ist dann Unterzahl."},
 {q:"Wie lange dauert eine kleine Strafe?",a:["2 Minuten","5 Minuten","1 Minute"],i:"Schießt die Mannschaft in Überzahl ein Tor, endet die kleine Strafe sofort."},
 {q:"Was ist ein „Hattrick“?",a:["Ein Spieler schießt drei Tore in einem Spiel","Drei Strafen gegen dieselbe Mannschaft","Ein Tor direkt nach dem Bully"],i:"Bei den Profis fliegen dann oft Mützen aufs Eis."},
 {q:"Wann steht ein Spieler im Abseits?",a:["Er fährt vor dem Puck über die blaue Linie ins Angriffsdrittel","Er steht hinter dem gegnerischen Tor","Er überquert vor dem Puck die rote Mittellinie"],i:"Entscheidend ist die blaue Linie vor dem gegnerischen Drittel – der Puck muss zuerst drüber."},
 {q:"Wie heißt der Einwurf, mit dem jedes Drittel beginnt?",a:["Bully","Anstoß","Einwurf"],i:"Der Schiedsrichter lässt den Puck zwischen die Schläger zweier Spieler fallen."},
 {q:"Woraus besteht ein Eishockey-Puck?",a:["Aus Hartgummi","Aus Kunststoff mit Metallkern","Aus Holz"],i:"Vor dem Spiel werden die Pucks oft gekühlt, damit sie weniger springen."},
 {q:"Was bedeutet „Powerplay“?",a:["Überzahl, weil ein Gegner auf der Strafbank sitzt","Ein besonders harter Schuss","Die letzten zwei Minuten eines Spiels"],i:"Die Mannschaft in Unterzahl darf dann sogar „icen“, ohne dass das Spiel unterbrochen wird."},
 {q:"Was heißt „Empty Net“?",a:["Das Tor ist leer, weil der Torhüter für einen weiteren Feldspieler vom Eis genommen wurde","Ein Tor ohne Torhüter-Berührung des Pucks","Das Netz ist kaputt und muss gewechselt werden"],i:"Das passiert oft in den letzten Minuten, wenn eine Mannschaft knapp zurückliegt."},
 {q:"Wie viele Bullypunkte gibt es auf dem Eis?",a:["9","5","7"],i:"Einer in der Mitte, je zwei in den Angriffs- und Verteidigungsdritteln und vier in der neutralen Zone."},
 {q:"Welche Farbe hat die Mittellinie?",a:["Rot","Blau","Schwarz"],i:"Die beiden Linien, die die Drittel abgrenzen, sind blau."},
 {q:"Was ist ein „Penalty“?",a:["Ein Strafschuss: ein Spieler läuft allein auf den Torhüter zu","Eine Strafe von zehn Minuten","Ein Tor in Unterzahl"],i:"Einen Penalty gibt es zum Beispiel, wenn ein Spieler bei einer klaren Torchance von hinten gefoult wird."},
 {q:"Darf der Torhüter über die rote Mittellinie fahren und mitspielen?",a:["Nein – dafür gibt es eine Strafe","Ja, jederzeit","Nur in der Verlängerung"],i:"Der Torhüter bleibt in seiner eigenen Hälfte."},
 {q:"Was ist der „Slot“?",a:["Der Bereich direkt vor dem Tor zwischen den Bullykreisen","Die Strafbank","Der Wechselbereich an der Bande"],i:"Aus dem Slot fallen die meisten Tore."},
 {q:"Was ist ein „Assist“?",a:["Die Vorlage zu einem Tor","Ein Schuss an den Pfosten","Der zweite Torhüter auf der Bank"],i:"Pro Tor können bis zu zwei Vorlagen gezählt werden."},
 {q:"Wie viele Drittel hat ein Eishockeyspiel?",a:["3","2","4"],i:"Steht es danach gleich, folgt in der U15 direkt ein Penaltyschießen."}
];
function xmPlayed(team){
  return ALL_GAMES.filter(g=>g.team===team).map(g=>{const r=resInfo(g);if(!r)return null;const h=isHome(g);return {g,our:h?r.hs:r.as,their:h?r.as:r.hs,opp:h?g.away:g.home,o:r.o}}).filter(Boolean).sort((a,b)=>dt(a.g)-dt(b.g));
}
function xmNums(n,deltas){const out=[n];for(const d of deltas){const v=n+d;if(v>=0&&!out.includes(v))out.push(v);if(out.length===3)break}let k=1;while(out.length<3){if(!out.includes(n+k))out.push(n+k);k++}return out.map(String)}
function xmOurName(team){const g=ALL_GAMES.find(x=>x.team===team);return g?(/grizzlys/i.test(g.home)?g.home:g.away):""}
const XM_TEAM=[
 ()=>{const w=xmPlayed("A").filter(x=>x.o==="w").sort((a,b)=>(b.our-b.their)-(a.our-a.their)||b.our-a.our)[0];if(!w)return null;
   return {q:"Was war bisher der höchste Sieg der U15 A?",a:[w.our+":"+w.their,(w.our-2)+":"+(w.their+1),(w.our+1)+":"+w.their].filter((v,i,s)=>s.indexOf(v)===i&&!/-/.test(v)),i:"Gegen "+w.opp+" am "+fmtDate(w.g)+"."}},
 ()=>{const p=xmPlayed("A");if(p.length<2)return null;const n=p.reduce((s,x)=>s+x.our,0);return {q:"Wie viele Tore hat die U15 A bisher in der Liga geschossen?",a:xmNums(n,[4,-3,7]),i:"In "+p.length+" Spielen – das sind im Schnitt "+(n/p.length).toFixed(1).replace(".",",")+" pro Spiel."}},
 ()=>{const bs=ALL_GAMES.filter(g=>g.team==="B").sort((a,b)=>dt(a)-dt(b));if(bs.length<3)return null;const opp=g=>/grizzlys/i.test(g.home)?g.away:g.home;const c=opp(bs[0]);const o=[...new Set(bs.slice(1).map(opp))].filter(x=>x!==c);if(o.length<2)return null;
   return {q:"Gegen wen spielte die U15 B ihr erstes Saisonspiel?",a:[c,o[0],o[1]],i:"Am "+fmtDate(bs[0])+" in "+bs[0].stadium+"."}},
 ()=>{const r=standRow("A",xmOurName("A"));if(!r||!r.gp)return null;return {q:"Auf welchem Tabellenplatz steht die U15 A gerade in der Landesliga?",a:xmNums(r.r,[-1,2,1,-2]).filter(v=>Number(v)>=1).concat(String(r.r+3)).slice(0,3),i:r.gp+(r.gp===1?" Spiel, ":" Spiele, ")+r.p+(r.p===1?" Punkt, ":" Punkte, ")+"Tordifferenz "+(r.gd>0?"+":"")+r.gd+"."}},
 ()=>{const games2=standings.A&&standings.A.games;if(!Array.isArray(games2))return null;const sum=[0,0,0];let n=0;
   xmPlayed("A").forEach(x=>{const h=standRow("A",x.g.home),a=standRow("A",x.g.away);if(!h||!a)return;const e=games2.find(y=>y.d===x.g.date&&y.h===h.n&&y.a===a.n);if(!e||e.p.length<3)return;n++;const home=/grizzlys/i.test(x.g.home);e.p.forEach((v,i)=>{const [p1,p2]=v.split(":").map(Number);sum[i]+=home?p1:p2})});
   if(!n)return null;const best=sum.indexOf(Math.max(...sum));const names=["1. Drittel","2. Drittel","3. Drittel"];if(sum.filter(v=>v===sum[best]).length>1)return null;
   return {q:"In welchem Drittel schießt die U15 A die meisten Tore?",a:[names[best],...names.filter((_,i)=>i!==best)],i:"Tore nach Dritteln: "+sum.join(" · ")+"."}},
 ()=>{const w=xmPlayed("B").filter(x=>x.o==="w").sort((a,b)=>(b.our-b.their)-(a.our-a.their)||b.our-a.our)[0];if(!w)return null;
   return {q:"Was war bisher der höchste Sieg der U15 B?",a:[w.our+":"+w.their,(w.our+2)+":"+(w.their+1),Math.max(1,w.our-1)+":"+w.their].filter((v,i,s)=>s.indexOf(v)===i),i:"Gegen "+w.opp+" am "+fmtDate(w.g)+"."}},
 ()=>{const aw=ALL_GAMES.filter(g=>!isHome(g)).map(g=>({s:g.stadium,km:distanceForStadium(g.stadium)})).filter(x=>x.km!==null&&x.km>5&&!/bergkamen/i.test(x.s));const u=[...new Map(aw.map(x=>[x.s,x])).values()].sort((a,b)=>b.km-a.km);if(u.length<3)return null;
   return {q:"Wohin geht die weiteste Auswärtsfahrt der Saison?",a:[u[0].s,u[Math.floor(u.length/2)].s,u[u.length-1].s],i:"Rund "+u[0].km+" km von Bergkamen."}},
 ()=>{const p=xmPlayed("B");if(p.length<2)return null;const n=p.filter(x=>x.o==="w").length;return {q:"Wie viele Spiele hat die U15 B bisher gewonnen?",a:xmNums(n,[1,2,-1,3]),i:"Bisher "+p.length+" Spiele mit Ergebnis."}},
 ()=>{const rows=standings.A&&standings.A.rows;if(!Array.isArray(rows)||rows.length<4)return null;const s=rows.slice().sort((a,b)=>a.r-b.r);if(!s[0].gp)return null;
   return {q:"Wer führt gerade die Tabelle der Landesliga (Liga der U15 A) an?",a:[s[0].n,s[2].n,s[s.length-1].n],i:s[0].p+" Punkte aus "+s[0].gp+" Spielen."}},
 ()=>{const p=xmPlayed("A").concat(xmPlayed("B")).sort((a,b)=>(b.our+b.their)-(a.our+a.their));if(p.length<3)return null;const f=x=>teamName(x.g.team)+" gegen "+x.opp+" ("+x.our+":"+x.their+")";
   return {q:"In welchem Spiel der Grizzlys fielen bisher die meisten Tore?",a:[f(p[0]),f(p[Math.floor(p.length/2)]),f(p[p.length-1])].filter((v,i,s)=>s.indexOf(v)===i),i:(p[0].our+p[0].their)+" Tore am "+fmtDate(p[0].g)+"."}},
 ()=>{const y=xmSeasonYear();const n=ALL_GAMES.filter(g=>g.team==="A"&&dt(g)<new Date(y,11,25)).length;if(!n)return null;return {q:"Wie viele Spiele hat die U15 A im Jahr "+y+" (bis Weihnachten) auf dem Plan?",a:xmNums(n,[2,-2,4]),i:"Insgesamt hat die U15 A "+ALL_GAMES.filter(g=>g.team==="A").length+" Spiele in der Saison."}},
 ()=>{const p=xmPlayed("B");if(p.length<2)return null;const n=p.reduce((s,x)=>s+x.our,0);return {q:"Wie viele Tore hat die U15 B bisher in der Liga geschossen?",a:xmNums(n,[3,-4,6]),i:"In "+p.length+" Spielen."}}
];
function xmDoor(d){
  if(d===24){
    const line=t=>{const p=xmPlayed(t);if(!p.length)return "";const w=p.filter(x=>x.o==="w").length,dr=p.filter(x=>x.o==="d").length,l=p.length-w-dr,tf=p.reduce((s,x)=>s+x.our,0),ta=p.reduce((s,x)=>s+x.their,0),r=standRow(t,xmOurName(t));return `<div class="xmSum"><b>${teamName(t)}</b><span>${w} ${w===1?"Sieg":"Siege"} · ${l} ${l===1?"Niederlage":"Niederlagen"}${dr?" · "+dr+" n.P. offen":""}</span><span>Tore ${tf}:${ta}${r&&r.gp?" · Tabellenplatz "+r.r:""}</span></div>`};
    return {gift:true,html:`<h4>Frohe Weihnachten!</h4><p>Danke an alle Spieler, Eltern, Trainer und Fans für eine starke Hinrunde. Das Grizzlys-Team wünscht schöne Feiertage!</p>${line("A")}${line("B")}`};
  }
  let k=0,item=null;const used=new Set();
  if(d%2===0){const f=XM_TEAM[(d/2-1)%XM_TEAM.length];try{item=f()}catch(e){item=null}if(item&&item.a.length<3)item=null;if(item)item.kind="Mannschafts-Quiz"}
  if(!item){const idx=d%2===1?(d-1)/2:12+((d/2-1)%4);item={...XM_RULES[idx%XM_RULES.length],kind:"Regel-Quiz"}}
  const n=item.a.length, rot=d%n, order=item.a.map((_,i)=>(i+rot)%n);
  return {q:item.q,opts:order.map(i=>item.a[i]),correct:order.indexOf(0),info:item.i||"",kind:item.kind};
}
/* Türchen wie bei einem echten Kalender durcheinander; 24 groß, einige breit */
const XM_ORDER=[13,4,20,9,1,17,24,7,15,22,3,11,18,6,2,14,23,10,19,5,16,8,21,12], XM_WIDE=[6,9,13,17,20];
function xmStoreKey(){return "grizzlysAdvent"+xmSeasonYear()}
function xmAnswers(){try{return JSON.parse(localStorage.getItem(xmStoreKey())||"{}")||{}}catch(e){return {}}}
function xmSaveAnswer(d,v){const a=xmAnswers();a[d]=v;try{localStorage.setItem(xmStoreKey(),JSON.stringify(a))}catch(e){}}
function xmToday(){const n=new Date();if(n.getMonth()!==11)return n.getMonth()===0?25:0;return n.getDate()}
function xmCanOpen(d){return !!window.GRIZZLYS_TEST||xmToday()>=d}
function xmStatAnswers(){const a=xmAnswers(),o={};for(const k in a){if(k==="24")continue;const v=a[k];if(!v||typeof v.ok!=="boolean")continue;let kind=v.k;if(kind!=="R"&&kind!=="T"){try{kind=xmDoor(Number(k)).kind==="Regel-Quiz"?"R":"T"}catch(e){kind="R"}}o[k]={k:kind,ok:v.ok}}return o}
window.xmStatAnswers=xmStatAnswers;
function xmStatHtml(){const a=xmStatAnswers(),R={ok:0,n:0},T={ok:0,n:0};for(const k in a){const t=a[k].k==="T"?T:R;t.n++;if(a[k].ok)t.ok++}const n=R.n+T.n;if(!n)return "";const ok=R.ok+T.ok;
  return `<div class="xmStat"><b>Deine Auswertung</b><span>✓ ${ok} richtig · ✗ ${n-ok} falsch</span>${R.n?`<span>📘 Regelfragen: ${R.ok} von ${R.n} richtig</span>`:""}${T.n?`<span>🏒 Mannschaftsfragen: ${T.ok} von ${T.n} richtig</span>`:""}</div>`}
function xmScore(){const a=xmAnswers();let r=0,t=0;for(const k in a){if(k==="24")continue;t++;if(a[k]&&a[k].ok)r++}return {r,t}}
function xmGreetText(){const n=new Date(),m=n.getMonth(),d=n.getDate(),y=xmSeasonYear(n);
  if(m===11&&d<24)return {k:"advent",t:"Schöne Adventszeit!",s:"Jeden Tag ein neues Türchen im Adventskalender – euer Grizzlys-Team"};
  if(m===11&&d<31)return {k:"xmas",t:"Frohe Weihnachten!",s:"Danke für eine starke Hinrunde – euer Grizzlys-Team"};
  return {k:"ny",t:"Frohes neues Jahr!",s:"Auf eine starke Rückrunde "+(y+1)+" – euer Grizzlys-Team"}}
function xmRefresh(){
  const on=document.documentElement.classList.contains("xm");
  const hero=document.querySelector(".hero");
  if(hero&&!hero.querySelector(".xmDeco")){
    const flakes=Array.from({length:60},(_,i)=>`<i style="left:${(i*37+11)%100}%;top:${(i*53+5)%100}%;width:${2+(i%4)}px;height:${2+(i%4)}px;opacity:${(.45+(i%5)*.11).toFixed(2)};animation-duration:${6+(i%7)*1.3}s;animation-delay:-${(i*0.7)%9}s"></i>`).join("");
    const cols=["#4dc3ff","#ffffff","#f2c14e","#d7263d","#4dc3ff","#ff8a00"];
    const bulbs=Array.from({length:18},(_,i)=>`<span style="left:${2+i*5.6}%;top:${i%2?9:3}px;background:${cols[i%6]};--c:${cols[i%6]};animation-delay:-${(i*0.37)%2}s"></span>`).join("");
    hero.insertAdjacentHTML("beforeend",`<div class="xmDeco" aria-hidden="true"><div class="xmSnow">${flakes}</div><div class="xmLights"><svg viewBox="0 0 100 22" preserveAspectRatio="none"><path d="M0 5 Q 5 12 10 7 T 20 7 T 30 7 T 40 7 T 50 7 T 60 7 T 70 7 T 80 7 T 90 7 T 100 5" fill="none" stroke="#2a3a52" stroke-width="1"/></svg>${bulbs}</div><svg class="xmCap" viewBox="0 0 100 16" preserveAspectRatio="none"><path d="M0 16 V6 Q3 0 6 5 Q9 9 12 4 Q16 -1 20 5 Q24 9 28 4 Q32 0 36 6 Q40 10 44 4 Q48 -1 52 5 Q56 9 60 3 Q64 0 68 6 Q72 10 76 4 Q80 0 84 5 Q88 9 92 4 Q96 0 100 5 V16 Z" fill="#f4fbff"/></svg></div>`);
  }
  const anchor=document.getElementById("g3HomeNext"); if(!anchor)return;
  let gr=document.getElementById("xmGreeting"), tile=document.getElementById("xmAdvTile");
  if(!gr){gr=document.createElement("div");gr.id="xmGreeting";gr.className="xmGreet";anchor.parentNode.insertBefore(gr,anchor)}
  if(!tile){tile=document.createElement("button");tile.type="button";tile.id="xmAdvTile";tile.className="xmAdv";anchor.parentNode.insertBefore(tile,anchor);tile.onclick=()=>xmOpenCalendar()}
  if(anchor.previousElementSibling!==tile){anchor.parentNode.insertBefore(gr,anchor);anchor.parentNode.insertBefore(tile,anchor)}
  const gt=xmGreetText(), gkey="grizzlysXmasGreet"+xmSeasonYear()+gt.k;let closed=false;try{closed=localStorage.getItem(gkey)==="1"}catch(e){}
  gr.hidden=!on||closed;
  gr.innerHTML=`<img src="christmas-logo.png" alt=""><span><b>${gt.t}</b><small>${gt.s}</small></span><button class="xmX" type="button" aria-label="Gruß ausblenden">×</button>`;
  gr.querySelector(".xmX").onclick=()=>{try{localStorage.setItem(gkey,"1")}catch(e){}gr.hidden=true};
  const td=xmToday(), a=xmAnswers(), sc=xmScore();
  let big,txt;
  if(window.GRIZZLYS_TEST&&!td){big="🎄";txt="Testversion: alle Türchen sind offen"}
  else if(td>=1&&td<=24){big=String(td);txt=a[td]?("Türchen "+td+" geöffnet"+(sc.t?" · "+sc.r+" von "+sc.t+" richtig":"")):"Türchen "+td+" wartet auf dich"}
  else {big="🎁";txt="Alle 24 Türchen ansehen"+(sc.t?" · "+sc.r+" von "+sc.t+" richtig":"")}
  tile.hidden=!on;
  tile.innerHTML=`<span class="door">${big}</span><span class="tx"><b>Adventskalender</b><small>${esc(txt)}</small></span><span class="go">Öffnen ›</span>`;
}
window.xmRefresh=xmRefresh;
function xmModal(){
  let m=document.getElementById("xmAdvModal");
  if(!m){m=document.createElement("div");m.id="xmAdvModal";m.className="matchModal xmAdvModal";m.hidden=true;
    m.innerHTML='<div class="matchModalBox xmBox" role="dialog" aria-modal="true" aria-labelledby="xmAdvTitle"><div class="matchModalHead"><div id="xmAdvTitle" class="matchModalTitle">🎄 Adventskalender</div><button class="matchModalClose" type="button" aria-label="Schließen">×</button></div><div id="xmAdvBody"></div></div>';
    document.body.appendChild(m);m.querySelector(".matchModalClose").onclick=xmClose;m.addEventListener("click",e=>{if(e.target===m)xmClose()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)xmClose()});}
  return m;
}
function xmClose(){const m=document.getElementById("xmAdvModal");if(m){m.hidden=true;m.setAttribute("aria-hidden","true")}document.body.style.overflow="";xmRefresh()}
function xmOpenCalendar(){
  const m=xmModal(), body=m.querySelector("#xmAdvBody"), a=xmAnswers(), td=xmToday(), sc=xmScore();
  m.querySelector("#xmAdvTitle").textContent="🎄 Adventskalender";
  body.innerHTML=`<div class="xmSub">${window.GRIZZLYS_TEST&&!td?"Testversion: alle Türchen lassen sich öffnen.":"Jeden Tag ein neues Türchen – geöffnet wird ab dem jeweiligen Tag."}${sc.t?` <b>${sc.r} von ${sc.t} richtig</b>`:""}</div><div class="xmGrid">`+
    XM_ORDER.map(d=>{const ans=a[d],can=xmCanOpen(d);
      const cls=ans?(d===24?"done gift":ans.ok?"done ok":"done no"):d===td?"today":can?"open":"locked";
      const inner=ans?`<span class="mk">${d===24?"⭐":ans.ok?"✓":"✗"}</span>`:`<span class="n">${d===24?"🎁 24":d}</span>`;
      return `<button type="button" class="xmD ${cls}${d===24?" big":XM_WIDE.includes(d)?" w2":""}" data-d="${d}" aria-label="Türchen ${d}${ans?" (geöffnet)":can?"":" (noch geschlossen)"}">${inner}</button>`}).join("")+`</div><div id="xmHint" class="xmHint" hidden></div>`+xmStatHtml();
  body.querySelectorAll(".xmD").forEach(b=>b.onclick=()=>{const d=Number(b.dataset.d);if(!xmCanOpen(d)){const h=body.querySelector("#xmHint");h.hidden=false;h.textContent="Türchen "+d+" lässt sich ab dem "+d+". Dezember öffnen.";return}xmOpenDoor(d)});
  if(m.hidden){m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
}
function xmOpenDoor(d){
  const m=xmModal(), body=m.querySelector("#xmAdvBody"), item=xmDoor(d), prev=xmAnswers()[d];
  m.querySelector("#xmAdvTitle").textContent="🎄 Türchen "+d;
  if(m.hidden){m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
  {const bx=m.querySelector(".matchModalBox");if(bx)bx.scrollTop=0}
  const back=`<div class="xmTop"><button class="xmBack" type="button">‹ Alle Türchen</button><span class="xmProg">${(s=>s.t?s.r+" von "+s.t+" richtig":"")(xmScore())}</span></div>`;
  if(item.gift){xmSaveAnswer(d,{ok:true});body.innerHTML=back+`<div class="xmCardQ gift xmOpenAnim"><div class="xmQHead"><span class="xmBig">24</span><span class="xmCat">🎁 Weihnachtsgruß</span></div><div class="xmQBody">${item.html}</div></div>`;body.querySelector(".xmBack").onclick=xmOpenCalendar;return}
  const L=["A","B","C","D"], rules=item.kind==="Regel-Quiz", anim=!prev;
  body.innerHTML=back+`<div class="xmCardQ${anim?" xmOpenAnim":""}"><div class="xmQHead"><span class="xmBig">${d}</span><span class="xmCat">${rules?"📘 Regel-Quiz":"🏒 Mannschafts-Quiz"}</span></div>
    <div class="xmQBody"><h4 class="xmQ">${esc(item.q)}</h4>
    <div class="xmOpts">${item.opts.map((o,i)=>`<button type="button" data-i="${i}" class="${anim?"xmIn":""}" style="${anim?`animation-delay:${600+i*450}ms`:""}"><span class="xmL">${L[i]}</span><span class="xmT">${esc(o)}</span></button>`).join("")}</div>
    <div class="xmInfo" hidden></div></div><div class="xmBurst" aria-hidden="true"></div></div>`;
  body.querySelector(".xmBack").onclick=xmOpenCalendar;
  const card=body.querySelector(".xmCardQ");
  const show=(pick,fresh)=>{
    const ok=pick===item.correct;
    body.querySelectorAll(".xmOpts button").forEach((b,i)=>{b.disabled=true;b.classList.remove("xmIn");b.style.animationDelay="";const l=b.querySelector(".xmL");if(i===item.correct){b.classList.add("ok");l.textContent="✓"}else if(i===pick){b.classList.add("no");l.textContent="✗"}else b.classList.add("dim")});
    const inf=body.querySelector(".xmInfo");inf.hidden=false;inf.className="xmInfo "+(ok?"good":"bad")+(fresh?" xmSlide":"");
    inf.innerHTML=`<b>${ok?"Richtig! 🎉":"Leider falsch – richtig ist "+L[item.correct]+"."}</b><span>${esc(item.info)}</span>`;
    const pr=body.querySelector(".xmProg");if(pr){const s=xmScore();pr.textContent=s.t?s.r+" von "+s.t+" richtig":""}
    if(fresh){
      if(ok){const bz=body.querySelector(".xmBurst");bz.innerHTML=Array.from({length:18},(_,k)=>`<i style="--dx:${Math.round(Math.cos(k/18*6.283)*(70+(k%3)*25))}px;--dy:${Math.round(Math.sin(k/18*6.283)*(60+(k%4)*20))}px;animation-delay:${(k%5)*30}ms">${k%3?"❄":"✨"}</i>`).join("");}
      else card.classList.add("xmShake");
      try{navigator.vibrate&&navigator.vibrate(ok?[30,40,30]:120)}catch(e){}
    }
  };
  if(prev&&typeof prev.pick==="number"){show(prev.pick,false);return}
  body.querySelectorAll(".xmOpts button").forEach(b=>b.onclick=()=>{const pick=Number(b.dataset.i);xmSaveAnswer(d,{pick,ok:pick===item.correct,k:rules?"R":"T"});try{window.xmSyncAnswers&&window.xmSyncAnswers(xmSeasonYear(),xmStatAnswers())}catch(e){}show(pick,true)});
}
window.xmOpenCalendar=xmOpenCalendar;
{const prev=window.applyResults;window.applyResults=function(){prev&&prev.apply(this,arguments);try{xmRefresh()}catch(e){console.warn(e)}};}
xmRefresh();
{const prev=window.applyResults;window.applyResults=function(){prev&&prev.apply(this,arguments);try{renderNews()}catch(e){console.warn(e)}};}
renderNews();

/* ===== 1.41.0: Spruch des Tages auf der Startseite (1.41.3: ganz oben, ohne Hintergrund, mittig, Titel in Pinselschrift) =====
   Jeden Tag ein anderer Spruch, für alle Geräte derselbe (hängt am Datum). Anlass:
   „spieltag“ = heute spielt eine meiner Mannschaften und das Ergebnis fehlt noch,
   „sieg“ / „niederlage“ = letztes Spiel heute oder gestern, sonst „allgemein“.
   Die Liste kommt aus dem Admin-Bereich (Firestore appConfig/sprueche, im Gerät gemerkt) oder aus sprueche.js. */
(function(){
  const KEY="grizzlysSprueche";
  const KINDS={allgemein:"Allgemein",spieltag:"Spieltag",sieg:"Nach einem Sieg",niederlage:"Nach einer Niederlage"};
  const LABEL={allgemein:"Spruch des Tages",spieltag:"Spruch zum Spieltag",sieg:"Spruch zum Sieg",niederlage:"Kopf hoch"};
  let data=null;
  try{const c=JSON.parse(localStorage.getItem(KEY)||"null");if(c&&typeof c==="object")data=c}catch(e){}
  function clean(list){return (Array.isArray(list)?list:[]).map(x=>({t:String(x&&x.t||"").replace(/\s+/g," ").trim().slice(0,200),a:String(x&&x.a||"").trim().slice(0,60),k:KINDS[x&&x.k]?x.k:"allgemein"})).filter(x=>x.t)}
  function cur(){return {on:!data||data.on!==false,list:clean(data&&Array.isArray(data.list)?data.list:window.SPRUECHE_STANDARD)}}
  const dayNo=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);
  function situation(now){
    now=now||new Date(); const today=dayNo(now), mine=games.filter(g=>!g.cancelled);
    const open=mine.filter(g=>dayNo(dt(g))===today&&!resInfo(g)).sort((a,b)=>dt(a)-dt(b));
    if(open.length)return {k:"spieltag",g:open[0]};
    const done=mine.filter(g=>{const n=today-dayNo(dt(g));return n>=0&&n<=1&&dt(g)<=now}).map(g=>({g,r:resInfo(g)})).filter(x=>x.r&&(x.r.o==="w"||x.r.o==="l")).sort((a,b)=>dt(b.g)-dt(a.g));
    if(done.length)return {k:done[0].r.o==="w"?"sieg":"niederlage",g:done[0].g};
    return {k:"allgemein"};
  }
  function pick(list,now){
    now=now||new Date(); list=list||cur().list; if(!list.length)return null;
    const s=situation(now); let pool=list.filter(x=>x.k===s.k); if(!pool.length)pool=list.filter(x=>x.k==="allgemein"); if(!pool.length)pool=list;
    return {...pool[dayNo(now)%pool.length],sk:s.k};
  }
  function render(){
    const box=document.getElementById("spruchCard"); if(!box)return;
    const c=cur(), q=c.on?pick(c.list):null;
    if(!q){box.hidden=true;return}
    box.hidden=false; box.dataset.k=q.sk;
    box.innerHTML=`<img class="spruchBear" src="logo.png" alt="" aria-hidden="true"><span class="spruchLab">${esc(LABEL[q.sk]||LABEL.allgemein)}</span><blockquote>„${esc(q.t)}“</blockquote>${q.a?`<figcaption>– ${esc(q.a)}</figcaption>`:""}`;
  }
  window.setSprueche=function(o){data={ts:Date.now(),on:!o||o.on!==false,list:o&&Array.isArray(o.list)?clean(o.list):null};try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}render()};
  window.spruchInfo={KINDS,clean,cur,situation,pick};
  window.renderSpruch=render;
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
  render();
})();

/* ===== 1.42.0: Meilensteine – aus den eingetragenen Ergebnissen je Mannschaft (keine Namen) =====
   Erster Saisonsieg, 5./10./15. … Saisonsieg, 3/5/7/10/15 Siege in Folge, 25./50./75./100. … Saisontor,
   zu null gewonnen, höchster Saisonsieg (ab 5 Toren Unterschied, wenn höher als der bisherige). */
const MS_IC='<svg class="msIc" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>';
let msCache={key:"",map:{}};
function milestones(team){
  const all=games.filter(g=>g.team===team&&!g.cancelled).sort((a,b)=>dt(a)-dt(b)), out=[];
  const GOALS=[25,50,75,100,125,150,175,200,250,300], WINS=[5,10,15,20,25,30], ROW=[3,5,7,10,15];
  let gf=0,w=0,row=0,best=0;
  all.forEach(g=>{const r=resInfo(g); if(!r)return; const L=[], before=gf; gf+=r.gs;
    if(r.o==="w"){w++;row++;
      if(w===1)L.push({k:"first",t:"Erster Saisonsieg"});
      if(WINS.includes(w))L.push({k:"wins",t:w+". Saisonsieg"});
      if(ROW.includes(row))L.push({k:"row",t:row+". Sieg in Folge"});
      const d=r.gs-r.os; if(d>=5&&d>best){L.push({k:"big",t:"Höchster Saisonsieg"});} if(d>best)best=d;
      if(r.os===0)L.push({k:"shut",t:"Zu null gewonnen"});
    }else row=0;
    GOALS.forEach(n=>{if(before<n&&gf>=n)L.push({k:"goals",t:n+". Saisontor"})});
    if(L.length)out.push({g,r,L});
  });
  return out;
}
function msFor(g){
  const key=games.length+"|"+games.filter(x=>resInfo(x)).length+"|"+Object.keys(window.gameResults||{}).length;
  if(msCache.key!==key){msCache={key,map:{}};[...new Set(games.map(x=>x.team))].forEach(t=>milestones(t).forEach(m=>{msCache.map[rkey(m.g)]=m.L}))}
  return msCache.map[rkey(g)]||[];
}
function msChips(g){const L=msFor(g);return L.length?`<div class="msRow">${MS_IC}<span>${L.map(x=>esc(x.t)).join(" · ")}</span></div>`:""}
function msBox(g){const L=msFor(g);if(!L.length)return "";
  return `<div class="msBox"><div class="msBoxHead">${MS_IC}<b>${L.length>1?"Meilensteine":"Meilenstein"}</b></div>${L.map(x=>`<div class="msItem ms_${x.k}">${esc(x.t)}</div>`).join("")}</div>`}
function msList(team){const M=milestones(team); if(!M.length)return "";
  return `<div class="sbSec"><h4>Meilensteine <small>(${M.reduce((a,m)=>a+m.L.length,0)})</small></h4><ul class="msList">${M.slice().reverse().map(m=>`<li><span class="msDate">${esc(dt(m.g).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}))}</span><span class="msTx">${m.L.map(x=>`<b>${esc(x.t)}</b>`).join(" · ")}<small>${m.r.gs}:${m.r.os} ${isHome(m.g)?"gegen":"bei"} ${esc(shortTeam(opponent(m.g)))}</small></span></li>`).join("")}</ul></div>`}

/* ===== 1.42.0: App weiterempfehlen – QR-Code der Live-App (in der Info) ===== */
const APP_LIVE_URL="https://jazm1309.github.io/grizzlys-u15/";
const QR_PATH="M4 4h7v1h-7zM15 4h4v1h-4zM21 4h1v1h-1zM26 4h3v1h-3zM30 4h7v1h-7zM4 5h1v1h-1zM10 5h1v1h-1zM15 5h3v1h-3zM19 5h1v1h-1zM21 5h1v1h-1zM23 5h2v1h-2zM26 5h1v1h-1zM30 5h1v1h-1zM36 5h1v1h-1zM4 6h1v1h-1zM6 6h3v1h-3zM10 6h1v1h-1zM12 6h1v1h-1zM19 6h2v1h-2zM25 6h1v1h-1zM27 6h1v1h-1zM30 6h1v1h-1zM32 6h3v1h-3zM36 6h1v1h-1zM4 7h1v1h-1zM6 7h3v1h-3zM10 7h1v1h-1zM18 7h1v1h-1zM20 7h5v1h-5zM26 7h3v1h-3zM30 7h1v1h-1zM32 7h3v1h-3zM36 7h1v1h-1zM4 8h1v1h-1zM6 8h3v1h-3zM10 8h1v1h-1zM12 8h3v1h-3zM16 8h1v1h-1zM18 8h1v1h-1zM22 8h3v1h-3zM26 8h2v1h-2zM30 8h1v1h-1zM32 8h3v1h-3zM36 8h1v1h-1zM4 9h1v1h-1zM10 9h1v1h-1zM12 9h2v1h-2zM15 9h1v1h-1zM17 9h1v1h-1zM19 9h1v1h-1zM23 9h1v1h-1zM25 9h1v1h-1zM30 9h1v1h-1zM36 9h1v1h-1zM4 10h7v1h-7zM12 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM30 10h7v1h-7zM16 11h1v1h-1zM19 11h4v1h-4zM25 11h1v1h-1zM27 11h2v1h-2zM5 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h2v1h-2zM15 12h3v1h-3zM21 12h1v1h-1zM23 12h3v1h-3zM27 12h1v1h-1zM29 12h1v1h-1zM31 12h2v1h-2zM34 12h1v1h-1zM6 13h2v1h-2zM9 13h1v1h-1zM12 13h1v1h-1zM17 13h3v1h-3zM22 13h1v1h-1zM26 13h4v1h-4zM33 13h3v1h-3zM5 14h1v1h-1zM7 14h1v1h-1zM9 14h2v1h-2zM12 14h1v1h-1zM14 14h4v1h-4zM19 14h1v1h-1zM21 14h1v1h-1zM25 14h4v1h-4zM30 14h1v1h-1zM33 14h1v1h-1zM35 14h1v1h-1zM5 15h1v1h-1zM8 15h1v1h-1zM13 15h1v1h-1zM18 15h1v1h-1zM21 15h2v1h-2zM24 15h2v1h-2zM27 15h2v1h-2zM30 15h1v1h-1zM35 15h1v1h-1zM5 16h1v1h-1zM8 16h1v1h-1zM10 16h6v1h-6zM19 16h1v1h-1zM22 16h4v1h-4zM27 16h2v1h-2zM30 16h4v1h-4zM35 16h1v1h-1zM6 17h2v1h-2zM11 17h1v1h-1zM13 17h1v1h-1zM17 17h5v1h-5zM23 17h1v1h-1zM26 17h3v1h-3zM31 17h1v1h-1zM33 17h1v1h-1zM5 18h3v1h-3zM9 18h2v1h-2zM12 18h3v1h-3zM17 18h3v1h-3zM21 18h1v1h-1zM23 18h1v1h-1zM25 18h6v1h-6zM32 18h1v1h-1zM34 18h2v1h-2zM7 19h3v1h-3zM11 19h1v1h-1zM14 19h1v1h-1zM21 19h6v1h-6zM29 19h3v1h-3zM33 19h1v1h-1zM6 20h1v1h-1zM9 20h2v1h-2zM13 20h1v1h-1zM15 20h7v1h-7zM25 20h1v1h-1zM28 20h1v1h-1zM30 20h1v1h-1zM32 20h1v1h-1zM35 20h1v1h-1zM5 21h1v1h-1zM7 21h1v1h-1zM9 21h1v1h-1zM12 21h4v1h-4zM18 21h1v1h-1zM20 21h3v1h-3zM26 21h2v1h-2zM29 21h1v1h-1zM33 21h3v1h-3zM4 22h1v1h-1zM6 22h1v1h-1zM9 22h2v1h-2zM12 22h1v1h-1zM14 22h2v1h-2zM17 22h3v1h-3zM22 22h1v1h-1zM24 22h2v1h-2zM27 22h1v1h-1zM30 22h2v1h-2zM33 22h1v1h-1zM35 22h1v1h-1zM6 23h1v1h-1zM8 23h2v1h-2zM12 23h1v1h-1zM18 23h4v1h-4zM25 23h1v1h-1zM30 23h2v1h-2zM36 23h1v1h-1zM4 24h2v1h-2zM10 24h1v1h-1zM16 24h2v1h-2zM20 24h3v1h-3zM25 24h1v1h-1zM27 24h1v1h-1zM30 24h1v1h-1zM32 24h2v1h-2zM4 25h1v1h-1zM6 25h2v1h-2zM9 25h1v1h-1zM13 25h2v1h-2zM16 25h2v1h-2zM19 25h1v1h-1zM23 25h3v1h-3zM27 25h1v1h-1zM29 25h1v1h-1zM31 25h1v1h-1zM33 25h1v1h-1zM35 25h1v1h-1zM9 26h2v1h-2zM13 26h1v1h-1zM17 26h1v1h-1zM22 26h1v1h-1zM24 26h5v1h-5zM30 26h2v1h-2zM34 26h2v1h-2zM7 27h1v1h-1zM9 27h1v1h-1zM11 27h1v1h-1zM14 27h3v1h-3zM18 27h2v1h-2zM21 27h2v1h-2zM25 27h1v1h-1zM27 27h1v1h-1zM30 27h3v1h-3zM4 28h5v1h-5zM10 28h3v1h-3zM16 28h1v1h-1zM18 28h1v1h-1zM21 28h1v1h-1zM23 28h3v1h-3zM27 28h6v1h-6zM35 28h1v1h-1zM12 29h2v1h-2zM15 29h1v1h-1zM18 29h3v1h-3zM25 29h1v1h-1zM27 29h2v1h-2zM32 29h1v1h-1zM34 29h2v1h-2zM4 30h7v1h-7zM15 30h2v1h-2zM18 30h2v1h-2zM24 30h1v1h-1zM28 30h1v1h-1zM30 30h1v1h-1zM32 30h2v1h-2zM4 31h1v1h-1zM10 31h1v1h-1zM13 31h1v1h-1zM15 31h2v1h-2zM19 31h1v1h-1zM23 31h3v1h-3zM28 31h1v1h-1zM32 31h1v1h-1zM36 31h1v1h-1zM4 32h1v1h-1zM6 32h3v1h-3zM10 32h1v1h-1zM12 32h1v1h-1zM15 32h7v1h-7zM23 32h2v1h-2zM28 32h6v1h-6zM35 32h2v1h-2zM4 33h1v1h-1zM6 33h3v1h-3zM10 33h1v1h-1zM13 33h1v1h-1zM15 33h4v1h-4zM22 33h2v1h-2zM25 33h1v1h-1zM27 33h2v1h-2zM30 33h6v1h-6zM4 34h1v1h-1zM6 34h3v1h-3zM10 34h1v1h-1zM13 34h1v1h-1zM15 34h5v1h-5zM22 34h2v1h-2zM27 34h1v1h-1zM30 34h3v1h-3zM34 34h1v1h-1zM4 35h1v1h-1zM10 35h1v1h-1zM12 35h1v1h-1zM15 35h1v1h-1zM18 35h9v1h-9zM28 35h3v1h-3zM4 36h7v1h-7zM13 36h5v1h-5zM24 36h7v1h-7zM33 36h1v1h-1zM36 36h1v1h-1z", QR_N=41;
function openQr(){
  let m=document.getElementById("qrModal");
  if(!m){m=document.createElement("div");m.id="qrModal";m.className="matchModal qrModal";m.hidden=true;
    m.innerHTML=`<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="qrTitle"><div class="matchModalHead"><div id="qrTitle" class="matchModalTitle">App weiterempfehlen</div><button id="qrClose" class="matchModalClose" type="button" aria-label="Schließen">×</button></div>
      <div class="qrBody"><div class="qrCard"><div class="qrBrand"><img src="logo.png" alt="" width="40" height="40"><div><b>${esc(APP_CFG.appName)}</b><small>Spielplan U13 &amp; U15 · ${esc(APP_CFG.club)}</small></div></div>
      <svg class="qrCode" viewBox="0 0 ${QR_N} ${QR_N}" role="img" aria-label="QR-Code zur App"><rect width="${QR_N}" height="${QR_N}" fill="#fff"/><path d="${QR_PATH}" fill="#071b33"/></svg>
      <div class="qrUrl">${esc(APP_LIVE_URL.replace("https://",""))}</div></div>
      <ol class="qrSteps"><li>Mit der <b>Handykamera</b> auf den Code halten und den Link öffnen.</li><li>Im Browser <b>„Zum Startbildschirm hinzufügen“</b> bzw. <b>„App installieren“</b> wählen.</li><li>Fertig – Spielplan, Ergebnisse und Push immer dabei.</li></ol>
      <button type="button" class="action qrShare" id="qrShare">Link teilen</button></div></div>`;
    document.body.appendChild(m);
    const close=()=>{m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow=""};
    m.querySelector("#qrClose").onclick=close; m.addEventListener("click",e=>{if(e.target===m)close()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)close()});
    m.querySelector("#qrShare").onclick=async()=>{const d={title:APP_CFG.appName,text:APP_CFG.appName+" – Spielplan U13 und U15 des "+APP_CFG.club,url:APP_LIVE_URL};
      try{if(navigator.share)await navigator.share(d);else if(navigator.clipboard){await navigator.clipboard.writeText(APP_LIVE_URL);alert("App-Link wurde kopiert.")}else window.prompt("App-Link kopieren:",APP_LIVE_URL)}catch(e){if(e&&e.name!=="AbortError")alert("Teilen war nicht möglich.")}};
  }
  m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  try{trackAnalyticsEvent("app_qr")}catch(e){}
}
window.openQr=openQr;
document.getElementById("qrApp")?.addEventListener("click",openQr);

/* ===== 1.42.0: App-Verknüpfungen (langes Drücken auf das App-Symbol, siehe manifest.webmanifest „shortcuts“)
   ./?go=bilanz-U13 | bilanz-A | bilanz-B öffnet die Saisonbilanz der Mannschaft und räumt die Adresse wieder auf.
   Ist die Mannschaft unter „Meine Mannschaften“ nicht ausgewählt, kommt ein Hinweis und die Einstellungen öffnen sich. */
(function(){
  let go=""; try{go=new URLSearchParams(location.search).get("go")||""}catch(e){}
  /* 1.43.0: Tipp auf eine Push-Meldung bei schon offener App – der Service Worker schickt {type:"GO",go} */
  try{navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",e=>{if(e.data&&e.data.type==="GO"&&e.data.go)goTo(String(e.data.go))})}catch(e){}
  if(!go)return;
  try{history.replaceState(null,"",location.pathname+location.hash)}catch(e){}
  const run=()=>goTo(go);
  setTimeout(run,(window.__introMs||0)+300);
  function goTo(go){try{
    const hp=/^helfer-(.+)$/.exec(go);if(hp){showView("home");hpOpen(hp[1]);trackAnalyticsEvent("shortcut_opened",{ziel:"helfer"});return}
    const rp=/^report-(.+)$/.exec(go);
    if(rp){const g=ALL_GAMES.find(x=>rkey(x)===rp[1]);if(g){showView("home");openMatchDetails(g,true)}trackAnalyticsEvent("shortcut_opened",{ziel:"bericht"});return}
    const m=/^bilanz-(.+)$/.exec(go), team=m&&m[1];
    if(team&&APP_CFG.teams&&APP_CFG.teams[team]){
      showView("home");
      if(window.myTeam(team))openBilanz(team);
      else{alert(teamName(team)+" ist unter „Meine Mannschaften“ nicht ausgewählt. Wähle sie in den Einstellungen aus, dann klappt die Verknüpfung.");showView("settings")}
    }else if(["schedule","opponents","rules","stats","home"].includes(go))showView(go);
    trackAnalyticsEvent("shortcut_opened",{ziel:go});
  }catch(e){console.warn(e)}}
})();

/* ===== 1.43.0: Wetter am Spielort (nur Anzeige; Daten von der Cloud Function weatherForecast) ===== */
function wxFor(g){const w=(window.weatherData||{})[g.date+"_"+String(g.time).replace(/:/g,"")+"_"+g.team]; /* nicht rkey(): läuft schon beim ersten Zeichnen der Startseite */if(!w||!w.txt)return null;const t=dt(g).getTime();if(t<Date.now()-3*3600000||t>Date.now()+4*86400000)return null;return w}
const WX_IC='<svg class="wxIc" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 9a3.5 3.5 0 0 1 .5 6.97V16"/><path d="M7 18h10.5"/></svg>';
const WX_ICE='<svg class="wxIc" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/></svg>';
function wxLine(g){const w=wxFor(g);if(!w)return "";return `<div class="wxLine${w.ice?" ice":w.frost?" frost":""}">${w.ice||w.frost?WX_ICE:WX_IC}<span>${esc(w.txt)}${w.warn?` · <b>${esc(w.warn)}</b>`:""}</span><small>am Spielort${isHome(g)?"":" · "+esc(g.stadium)}</small></div>`}
function wxBox(g){const w=wxFor(g);if(!w)return "";
  return `<div class="wxBox${w.ice?" ice":w.frost?" frost":""}"><div class="wxBoxHead">${w.ice||w.frost?WX_ICE:WX_IC}<b>Wetter am Spielort</b><small>${esc(g.stadium)} · ${esc(g.time)} Uhr</small></div><div class="wxBoxTx">${esc(w.txt)}</div>${w.warn?`<div class="wxWarn">${esc(w.warn)}${w.ice?" – bei der Anfahrt vorsichtig fahren und mehr Zeit einplanen.":" – morgens und abends kann es glatt sein."}</div>`:""}<div class="wxSrc">Vorhersage: Open-Meteo</div></div>`}
window.renderWeather=function(){try{renderNext()}catch(e){}};

/* ===== 1.43.0: Saisonbilanz – Strafen und Special Teams (aus den EHV-Spielberichten, Function standings) ===== */
function specialHtml(team){
  const sp=standings[team]&&standings[team].scorers&&standings[team].scorers.special; if(!sp||!sp.games)return "";
  const pct=(a,b)=>b?Math.round(a/b*100)+" %":"–", avg=v=>(v/sp.games).toFixed(1).replace(".",",");
  const pk=sp.pkSit?Math.max(0,sp.pkSit-sp.ppGA):0;
  return `<div class="sbSec"><h4>Strafen &amp; Special Teams <small>(${sp.games} EHV-Spielberichte)</small></h4><div class="spGrid">
    <div class="spTile"><small>Strafminuten</small><b>${sp.pim}</b><span>${avg(sp.pim)} je Spiel · Gegner ${sp.oppPim}</span></div>
    <div class="spTile"><small>Überzahl</small><b>${pct(sp.ppG,sp.ppOpp)}</b><span>${sp.ppG} ${sp.ppG===1?"Tor":"Tore"} aus ${sp.ppOpp} Überzahl${sp.ppOpp===1?"":"spielen"}</span></div>
    <div class="spTile"><small>Unterzahl</small><b>${pct(pk,sp.pkSit)}</b><span>${pk} von ${sp.pkSit} überstanden</span></div>
  </div></div>`;
}

/* ===== 1.43.0: Meine Rückennummer – nur Nummern, keine Namen; gespeichert auf dem Gerät (grizzlysMyNr),
   für den Push „Tore meiner Nummer“ zusätzlich in der Push-Auswahl. ===== */
function myNrAll(){let m={};try{m=JSON.parse(localStorage.getItem("grizzlysMyNr")||"{}")||{}}catch(e){}const o={};
  window.TEAM_KEYS.forEach(k=>{const L=(Array.isArray(m[k])?m[k]:[]).map(v=>String(v).trim()).filter(v=>/^\d{1,2}$/.test(v)).slice(0,3);if(L.length)o[k]=L});return o}
window.myNrAll=myNrAll;
function myNrSet(team){return new Set((myNrAll()[team])||[])}
function myNrCard(){
  if(document.getElementById("myNrCard"))return;
  const after=document.getElementById("myTeamsCard")||document.querySelector("#settingsView .settingsHead"); if(!after)return;
  const c=document.createElement("div"); c.className="infoCard myNrCard"; c.id="myNrCard";
  const cur=myNrAll();
  c.innerHTML=`<div class="infoTitle">Meine Rückennummer</div><div class="small mtSub">Die Nummer deines Kindes wird bei Torschützen, Spielberichten und in der Saisonbilanz hervorgehoben. Keine Namen – die Nummer bleibt auf diesem Gerät.</div>
    <div class="mnRows">${window.MY_TEAMS.map(t=>`<label class="mnRow team${esc(t)}"><span class="mnTeam">${esc(teamName(t))}</span><input type="text" inputmode="numeric" maxlength="12" autocomplete="off" data-team="${esc(t)}" placeholder="z. B. 17" value="${esc((cur[t]||[]).join(", "))}"><span class="mnOk" aria-hidden="true"></span></label>`).join("")}</div>
    <div class="small mnHint">Mehrere Kinder in einer Mannschaft? Nummern mit Komma trennen (höchstens 3). Push bei Toren: unten unter „Live während des Spiels“ › „Tore meiner Nummer“.</div>`;
  after.after(c);
  let tmr=null;
  const save=inp=>{const t=inp.dataset.team, L=[...new Set(String(inp.value).split(/[^0-9]+/).filter(v=>/^\d{1,2}$/.test(v)).map(v=>String(Number(v))))].slice(0,3);
    let m={};try{m=JSON.parse(localStorage.getItem("grizzlysMyNr")||"{}")||{}}catch(e){}
    if(L.length)m[t]=L;else delete m[t];
    try{localStorage.setItem("grizzlysMyNr",JSON.stringify(m))}catch(e){}
    inp.closest(".mnRow").classList.toggle("set",L.length>0);
    clearTimeout(tmr);tmr=setTimeout(()=>{window.savePushPrefs&&window.savePushPrefs();myNrApply(document.body);myNrNote()},400);
    try{trackAnalyticsEvent("my_number_set",{team:teamName(t),anzahl:L.length})}catch(e){}};
  c.querySelectorAll("input[data-team]").forEach(inp=>{inp.closest(".mnRow").classList.toggle("set",!!inp.value.trim());
    inp.addEventListener("change",()=>{save(inp);const t=inp.dataset.team;inp.value=(myNrAll()[t]||[]).join(", ")});inp.addEventListener("input",()=>{clearTimeout(inp._t);inp._t=setTimeout(()=>save(inp),700)})});
}
function myNrNote(){const n=document.getElementById("pfMyNrNote");if(!n)return;const has=Object.keys(myNrAll()).length;
  n.textContent=has?"bei Tor oder Vorlage der Nr. "+Object.entries(myNrAll()).map(([t,L])=>L.join("/")+(window.MY_TEAMS.length>1?" ("+teamName(t)+")":"")).join(", ")+" – auch ohne „Live-Tore“":"zuerst oben unter „Meine Rückennummer“ eine Nummer eintragen"}
/* Hervorheben: „Nr. 17“ im Text und die Zeile in „Tore nach Rückennummer“ – nur bei der passenden Mannschaft, nie beim Gegner */
function myNrTeamOf(n){
  const mm=n.closest&&n.closest("#matchModal"); if(mm&&window._mdGame)return window._mdGame.team;
  const bz=n.closest&&n.closest("#bilanzModalContent"); if(bz&&bz.dataset.team)return bz.dataset.team;
  const t=n.closest&&n.closest("[data-team]"); if(t)return t.dataset.team;
  const c=n.closest&&n.closest('[class*="team"]'); if(c){const m=/\bteam(A|B|U13)\b/.exec(c.className);if(m)return m[1]}
  return "";
}
function myNrApply(root){
  const all=myNrAll(); if(!Object.keys(all).length){document.querySelectorAll("mark.myNr").forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));document.querySelectorAll(".scR.myNrRow").forEach(r=>r.classList.remove("myNrRow"));return}
  if(!root||!root.querySelectorAll)return;
  const skip=n=>n.closest("textarea,input,script,style,.adminModal,#adminModal,.opp,.instaModal,mark.myNr");
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:t=>/Nr\.\s?\d/.test(t.nodeValue)&&t.parentElement&&!skip(t.parentElement)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
  const list=[];while(walker.nextNode())list.push(walker.currentNode);
  list.forEach(t=>{const team=myNrTeamOf(t.parentElement), set=new Set(all[team]||[]); if(!set.size)return;
    const re=/Nr\.\s?(\d{1,2})(?!\d)/g; let m,last=0,hit=false; const frag=document.createDocumentFragment(), v=t.nodeValue;
    while((m=re.exec(v))){if(!set.has(String(Number(m[1]))))continue;hit=true;frag.appendChild(document.createTextNode(v.slice(last,m.index)));const mk=document.createElement("mark");mk.className="myNr";mk.textContent=m[0];frag.appendChild(mk);last=m.index+m[0].length}
    if(!hit)return; frag.appendChild(document.createTextNode(v.slice(last))); t.replaceWith(frag)});
  root.querySelectorAll(".scR").forEach(r=>{const nr=r.querySelector(".scNr"),team=myNrTeamOf(r);r.classList.toggle("myNrRow",!!(nr&&myNrSet(team).has(String(Number(nr.textContent.trim())))))});
}
(function(){
  let q=new Set(),raf=0;
  const run=()=>{raf=0;const L=[...q];q.clear();L.forEach(n=>{if(n.isConnected)myNrApply(n)})};
  new MutationObserver(ms=>{if(!Object.keys(myNrAll()).length)return;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&!n.closest("mark.myNr"))q.add(n);else if(n.nodeType===3&&n.parentElement)q.add(n.parentElement)}));if(q.size&&!raf)raf=requestAnimationFrame(run)})
    .observe(document.body,{childList:true,subtree:true});
  myNrCard(); myNrNote(); myNrApply(document.body);
})();

/* ===== 1.43.0: Wochenend-Vorschau als Bild (Downloads und Admin › Social Media) ===== */
function weekendRange(now){
  const d=new Date(now||Date.now()); d.setHours(0,0,0,0); const wd=d.getDay(); /* 0 So … 6 Sa */
  const fri=new Date(d); fri.setDate(d.getDate()+(wd===0?-2:wd===6?-1:5-wd)); const sun=new Date(fri); sun.setDate(fri.getDate()+2); sun.setHours(23,59,59,999);
  return {from:fri,to:sun};
}
function weekendGames(list,now){const R=weekendRange(now);return (list||games).filter(g=>{const t=dt(g);return t>=R.from&&t<=R.to}).sort((a,b)=>dt(a)-dt(b))}
async function instaWeekend(W0){
  const W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('100px "GrizzlyBrush"'),document.fonts.ready])}catch(e){}
  const L=W0.list.slice(0,6); if(!L.length)throw new Error("Keine Spiele am Wochenende");
  const f=d=>d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}), d0=dt(L[0]), d1=dt(W0.list[W0.list.length-1]);
  const tag=d0.toDateString()===d1.toDateString()?d0.toLocaleDateString("de-DE",{weekday:"short"}).replace(".","")+" "+f(d0):f(d0)+"–"+f(d1);
  const [rink,...logos]=await Promise.all([instaImg(instaRinkSrc()),...L.map(g=>Promise.all([instaLogos(g.home),instaLogos(g.away)]))]);
  instaBg(c,W,H,rink); instaHead(c,W,tag,"Wochen","ende");
  instaFont(c,800,30);c.fillStyle=IC_.t2;c.textAlign="left";c.fillText(L.length+(L.length===1?" Spiel":" Spiele")+" der "+APP_CFG.appName,62,272);
  const top=320,bottom=1220,gap=18,rh=Math.min(190,(bottom-top-gap*(L.length-1))/L.length),CX=610;
  L.forEach((g,i)=>{const y=top+i*(rh+gap),r=resInfo(g),d=dt(g),home=isHome(g);
    c.save();c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=26;c.shadowOffsetY=8;instaRR(c,48,y,W-96,rh,24);c.fillStyle=IC_.panel(.80);c.fill();c.restore();
    instaRR(c,48,y,W-96,rh,24);c.lineWidth=2;c.strokeStyle="rgba(255,255,255,.16)";c.stroke();
    const col=g.team==="B"?"#ff8a00":g.team==="U13"?"#f2b705":"#168cff"; instaRR(c,48,y,12,rh,6);c.fillStyle=col;c.fill();
    /* Datum links */
    c.textAlign="center";c.textBaseline="alphabetic";instaFont(c,800,24);c.fillStyle=IC_.t3;c.fillText(d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".","").toUpperCase(),135,y+rh*.36);
    instaFont(c,900,Math.min(44,rh*.3));c.fillStyle="#fff";c.fillText(g.time,135,y+rh*.66);
    instaFont(c,800,20);c.fillStyle=col;c.fillText(teamName(g.team).toUpperCase(),135,y+rh*.88);
    /* Logos und Namen */
    const lr=Math.min(40,rh*.27), mid=y+rh*.44;
    [[g.home,logos[i][0],390],[g.away,logos[i][1],830]].forEach(([n,lg,x])=>{c.save();c.beginPath();c.arc(x,mid,lr,0,Math.PI*2);c.fillStyle="rgba(255,255,255,.94)";c.fill();c.clip();
      if(lg&&lg.imgs.length)instaContain(c,lg.imgs[0],x,mid,lr*1.55);else{instaFont(c,900,lr*.7);c.fillStyle="#12263f";c.textBaseline="middle";c.fillText(shortTeam(n).slice(0,2).toUpperCase(),x,mid+1);c.textBaseline="alphabetic"}c.restore();
      instaFont(c,800,Math.min(26,rh*.17));c.fillStyle=IC_.t1;let nm=shortTeam(n);while(c.measureText(nm).width>250&&nm.length>6)nm=nm.slice(0,-2);if(nm!==shortTeam(n))nm=nm.replace(/\s*$/,"")+"…";c.fillText(nm,x,y+rh*.88)});
    instaFont(c,900,r?Math.min(56,rh*.36):Math.min(34,rh*.24));c.fillStyle=r?(r.o==="w"?"#5fd18f":"#fff"):IC_.acc;c.textBaseline="middle";
    c.fillText(g.cancelled?cxU(g):r?r.hs+":"+r.as:"VS",CX,mid);c.textBaseline="alphabetic";
    instaFont(c,700,18);instaSpace(c,1);c.fillStyle=IC_.t3;const lbs=home?["HEIMSPIEL"]:["AUSWÄRTS",String(g.stadium).toUpperCase()];lbs.forEach((lb,k)=>{while(c.measureText(lb).width>180&&lb.length>4)lb=lb.slice(0,-1);c.fillText(lb,CX,y+rh*(.72+k*.13))});instaSpace(c,0);
  });
  if(W0.list.length>L.length){instaFont(c,800,26);c.fillStyle=IC_.t2;c.textAlign="left";c.fillText("+ "+(W0.list.length-L.length)+" weitere Spiele in der App",62,1250)}
  instaFoot(c,W,APP_CFG.appName+" · Saison "+APP_CFG.season);
  return cv;
}

/* ===== 1.44.0: Feedback antreiben – Ein-Tipp-Feedback, Wunschliste, Feedback-Einstiege ===== */
window.WUENSCHE_STANDARD=[
  {id:"fahrgemeinschaften",t:"Fahrgemeinschaften",d:"Bei Auswärtsspielen freie Plätze anbieten oder einen Platz suchen."},
  {id:"trainingszeiten",t:"Trainingszeiten",d:"Eiszeiten je Mannschaft – mit Push, wenn ein Training ausfällt."},
  {id:"einsteiger",t:"Neu bei den Grizzlys",d:"Infos für neue Eltern: Ablauf, Ausrüstung, Ansprechpartner, Begriffe."},
  {id:"umfragen",t:"Umfragen",d:"Kurze Abstimmungen in den News, z. B. zum Termin der Weihnachtsfeier."},
  {id:"regelquiz",t:"Regel-Quiz",d:"Fünf zufällige Fragen zu Regeln und Handzeichen – das ganze Jahr."},
  {id:"losfahren",t:"Losfahren um …",d:"Bei Auswärtsspielen: wann man spätestens losfahren sollte."}
];
const wishSlug=t=>String(t).toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40)||"wunsch";
function wishClean(L){return (Array.isArray(L)?L:[]).map(w=>({id:/^[a-z0-9-]{2,40}$/.test(w&&w.id)?w.id:wishSlug(w&&w.t),t:String(w&&w.t||"").trim().slice(0,60),d:String(w&&w.d||"").trim().slice(0,180),done:!!(w&&w.done)})).filter(w=>w.t)}
window.wishInfo={clean:wishClean,slug:wishSlug};
function wishMine(){try{const v=JSON.parse(localStorage.getItem("grizzlysWishVotes")||"[]");return Array.isArray(v)?v.slice(0,3):[]}catch(e){return []}}
var wishData=null, wishOrder=null; /* var: newsFill kann vor dieser Zeile laufen */
async function wishRefresh(){try{if(window.wishLoad){const d=await window.wishLoad();wishData={on:d.on,list:wishClean(d.list||window.WUENSCHE_STANDARD),counts:d.counts||{},voters:d.voters||0}}}catch(e){}
  if(!wishData)wishData={on:true,list:wishClean(window.WUENSCHE_STANDARD),counts:{},voters:0};return wishData}
function wishTeaser(){if(wishData&&!wishData.on)return "";return `<button type="button" class="wishTeaser" data-wish-open><span class="wishTIc">💡</span><span><b>Was soll als Nächstes kommen?</b><small>Stimm in der Wunschliste ab – bis zu 3 Stimmen</small></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6"/></svg></button>`}
function fbLinkHtml(where){return `<div class="fbLink" data-where="${where}"><span>Idee, Fehler oder Lob?</span><button type="button" data-fb-open>Sag's uns</button>${wishData&&!wishData.on?"":`<button type="button" data-wish-open>Wunschliste</button>`}</div>`}
async function openWishes(){
  let m=document.getElementById("wishModal");
  if(!m){m=document.createElement("div");m.id="wishModal";m.className="matchModal wishModal";m.hidden=true;
    m.innerHTML='<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="wishTitle"><div class="matchModalHead"><div id="wishTitle" class="matchModalTitle">Wunschliste</div><button id="wishClose" class="matchModalClose" type="button" aria-label="Schließen">×</button></div><div id="wishBody"></div></div>';
    document.body.appendChild(m);const close=()=>{m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow=""};
    m.querySelector("#wishClose").onclick=close;m.addEventListener("click",e=>{if(e.target===m)close()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)close()});}
  m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  const body=m.querySelector("#wishBody"); if(!wishData)body.innerHTML='<div class="small">Lädt …</div>';
  wishOrder=null; wishFill(); await wishRefresh(); wishOrder=null; wishFill();
  try{trackAnalyticsEvent("wishlist_opened")}catch(e){}
}
function wishFill(){
  const body=document.getElementById("wishBody"); if(!body||!wishData)return;
  const mine=wishMine(), open=wishData.list.filter(w=>!w.done), done=wishData.list.filter(w=>w.done);
  const cnt=w=>(wishData.counts[w.id]||0), max=Math.max(1,...open.map(cnt)), left=3-mine.filter(id=>open.some(w=>w.id===id)).length;
  /* Reihenfolge nur beim Öffnen nach Stimmen sortieren – beim Abstimmen springt nichts */
  if(!wishOrder)wishOrder=open.slice().sort((a,b)=>cnt(b)-cnt(a)).map(w=>w.id);
  open.sort((a,b)=>{const ia=wishOrder.indexOf(a.id),ib=wishOrder.indexOf(b.id);return (ia<0?99:ia)-(ib<0?99:ib)});
  body.innerHTML=`<div class="wishIntro">Welche Funktion wünschst du dir als Nächstes? Du hast <b>${left} von 3</b> Stimmen frei – antippen zum Abstimmen oder Zurücknehmen. Anonym.</div>
    <div class="wishList">${open.map(w=>{const on=mine.includes(w.id);return `<button type="button" class="wishItem${on?" on":""}" data-wid="${esc(w.id)}"${!on&&left<=0?" disabled":""} aria-pressed="${on}"><span class="wishTx"><b>${esc(w.t)}</b><small>${esc(w.d)}</small><span class="wishBar"><i style="width:${(cnt(w)/max*100).toFixed(0)}%"></i></span></span><span class="wishVote"><span class="wishThumb">${on?"✓":"👍"}</span><small>${cnt(w)}</small></span></button>`}).join("")||'<div class="small">Gerade keine offenen Wünsche.</div>'}</div>
    ${done.length?`<div class="wishDoneH">Umgesetzt dank euch</div><div class="wishDone">${done.map(w=>`<div><b>✓ ${esc(w.t)}</b><small>${esc(w.d)}</small></div>`).join("")}</div>`:""}
    <div class="wishOwn"><span>Deine Idee fehlt?</span><button type="button" class="action" data-fb-open="idee">💡 Eigene Idee schicken</button></div>
    ${wishData.voters?`<div class="small wishVoters">${wishData.voters} ${wishData.voters===1?"Person hat":"Personen haben"} schon abgestimmt.</div>`:""}`;
  body.querySelectorAll(".wishItem").forEach(b=>b.onclick=async()=>{const id=b.dataset.wid;let L=wishMine();
    if(L.includes(id))L=L.filter(x=>x!==id);else{if(L.filter(x=>open.some(w=>w.id===x)).length>=3)return;L.push(id)}
    L=L.filter(x=>wishData.list.some(w=>w.id===x)).slice(0,3);
    const was=wishMine();wishData.counts[id]=Math.max(0,(wishData.counts[id]||0)+(L.includes(id)?1:-1));
    if(!was.length&&L.length)wishData.voters++; else if(was.length&&!L.length)wishData.voters=Math.max(0,wishData.voters-1);
    try{localStorage.setItem("grizzlysWishVotes",JSON.stringify(L))}catch(e){}
    wishFill(); window.wishVote&&window.wishVote(L); try{trackAnalyticsEvent("wish_vote",{wunsch:id})}catch(e){}});
}
window.openWishes=openWishes;
/* 👍/👎 mit einem Tipp – eigene Wahl merkt sich das Gerät */
function rxMine(){try{return JSON.parse(localStorage.getItem("grizzlysReactions")||"{}")||{}}catch(e){return {}}}
function rxBar(target,q){const v=rxMine()[target]||0;return `<div class="rxBar${v?" done":""}" data-rx="${esc(target)}"><span class="rxQ">${v?"Danke für dein Feedback!":esc(q)}</span><button type="button" class="rxB${v===1?" on":""}" data-v="1" aria-label="Gefällt mir" aria-pressed="${v===1}">👍</button><button type="button" class="rxB${v===-1?" on":""}" data-v="-1" aria-label="Gefällt mir nicht" aria-pressed="${v===-1}">👎</button>${v===-1?`<button type="button" class="rxMore" data-fb-open="rx">Was können wir besser machen?</button>`:""}</div>`}
function fbOpen(type,area,text){
  document.getElementById("openBugReport")?.click();
  setTimeout(()=>{try{fbSetType(type||"Wunsch / Anregung");const a=document.getElementById("bugReportArea");if(a&&area)a.value=area;const t=document.getElementById("bugReportDescription");if(t&&text&&(!t.value.trim()||/^[^\n]{0,90}:\s*$/.test(t.value))){t.value=text;fbCount()}t&&t.focus()}catch(e){}},80);
}
window.fbOpen=fbOpen;
document.addEventListener("click",e=>{
  const rb=e.target.closest&&e.target.closest(".rxBar .rxB");
  if(rb){e.stopPropagation();const bar=rb.closest(".rxBar"),t=bar.dataset.rx,v=Number(rb.dataset.v),M=rxMine();
    M[t]=v;try{localStorage.setItem("grizzlysReactions",JSON.stringify(M))}catch(err){}
    const q=t.startsWith("rep_")?"War der Bericht gut?":"Gefällt dir das?";bar.outerHTML=rxBar(t,q);
    window.fbReact&&window.fbReact(t,v);try{trackAnalyticsEvent("reaction",{ziel:t.slice(0,3),wert:v})}catch(err){}return}
  const fo=e.target.closest&&e.target.closest("[data-fb-open]");
  if(fo){e.stopPropagation();const k=fo.dataset.fbOpen, bar=fo.closest(".rxBar");
    if(k==="rx"&&bar){const t=bar.dataset.rx;let txt="";
      if(t.startsWith("rep_")){const g=ALL_GAMES.find(x=>"rep_"+rkey(x)===t);txt="Zum Spielbericht"+(g?" vom "+dt(g).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" ("+shortTeam(g.home)+" – "+shortTeam(g.away)+")":"")+": "}
      else txt="Zu „Neu in der App“ (Version "+t.slice(4)+"): ";
      ["matchModal","newsModal"].forEach(id=>{const m=document.getElementById(id);if(m&&!m.hidden){if(id==="matchModal")closeMatchDetails();else closeNews()}});
      fbOpen("Wunsch / Anregung",t.startsWith("rep_")?"Spielbericht":"Neue Funktion",txt)}
    else{const wm=document.getElementById("wishModal");if(wm&&!wm.hidden){wm.hidden=true;document.body.style.overflow=""}
      const nm=document.getElementById("newsModal");if(nm&&!nm.hidden)closeNews();
      fbOpen(k==="idee"?"Wunsch / Anregung":"Fehler",k==="idee"?"Neue Funktion":"",k==="idee"?"Meine Idee: ":"")}
    return}
  const wo=e.target.closest&&e.target.closest("[data-wish-open]");
  if(wo){e.stopPropagation();const nm=document.getElementById("newsModal");if(nm&&!nm.hidden)closeNews();openWishes()}
},true);
/* Einstiege: Startseite (unten) und Info */
(function(){
  const home=document.getElementById("homeView");
  if(home&&!document.getElementById("fbHome")){const c=document.createElement("section");c.id="fbHome";c.className="card fbHome";
    c.innerHTML=`<div class="fbHomeTx"><b>Deine Stimme zählt</b><small>Was soll als Nächstes in die App? Oder ist dir etwas aufgefallen?</small></div><div class="fbHomeBtns"><button type="button" class="action" data-wish-open>💡 Wunschliste</button><button type="button" class="action" data-fb-open>✉️ Feedback</button></div>`;
    home.appendChild(c)}
  const info=document.querySelector("#infoView .inShareRow");
  if(info&&!document.getElementById("fbInfo")){const d=document.createElement("div");d.id="fbInfo";d.innerHTML=fbLinkHtml("info");info.after(d)}
  setTimeout(()=>{wishRefresh().then(d=>{if(!d.on){document.querySelectorAll("[data-wish-open]").forEach(b=>{if(!b.closest(".fbHome"))b.remove()});const hb=document.querySelector(".fbHome [data-wish-open]");if(hb)hb.remove()}})},(window.__introMs||0)+2500);
})();

/* ===== 1.44.5: Zurück-Taste des Handys schließt Fenster (statt die App) =====
   Öffnet sich ein Fenster (Spieldetails, Saisonbilanz, News, Admin, Formulare …), legt die App einen Eintrag im
   Browser-Verlauf an. Die Zurück-Taste schließt dann das oberste Fenster. Wird ein Fenster per × geschlossen,
   wird der Eintrag wieder entfernt – so bleibt der Verlauf sauber. */
(function(){
  const SEL=".matchModal,.adminModal,.bugReportModal,.thanksModal,.admSheetWrap,.stSheetWrap";
  const CLOSE=".admX,.matchModalClose,.adminModalClose,#thanksClose,[aria-label*='chließen']";
  const stack=[]; let ignore=0, pending=0, timer=0;
  const isOpen=el=>el.isConnected&&!el.hidden&&getComputedStyle(el).display!=="none";
  function onOpen(el){
    if(stack.includes(el))return; stack.push(el);
    if(pending>0){pending--;try{history.replaceState({gzm:stack.length},"")}catch(e){}}
    else{try{history.pushState({gzm:stack.length},"")}catch(e){}}
  }
  function onClose(el){
    const i=stack.indexOf(el); if(i<0)return; stack.splice(i,1);
    if(el._gzPop){el._gzPop=false;return} /* durch die Zurück-Taste geschlossen – Eintrag ist schon weg */
    pending++; clearTimeout(timer);
    timer=setTimeout(()=>{if(pending>0){const n=pending;pending=0;ignore++;try{history.go(-n)}catch(e){ignore--}}},60);
  }
  function closeEl(el){
    el._gzPop=true;
    const box=el.querySelector('[role="dialog"]')||el, btn=[...box.querySelectorAll(CLOSE)].find(b=>b.closest(SEL)===el);
    if(btn)btn.click();
    if(isOpen(el)){el.hidden=true;el.setAttribute("aria-hidden","true");if(!stack.some(isOpen))document.body.style.overflow=""}
    if(stack.includes(el))onClose(el);
  }
  window.addEventListener("popstate",()=>{
    if(ignore>0){ignore--;return}
    const top=[...stack].reverse().find(isOpen);
    if(top)closeEl(top);
  });
  new MutationObserver(ms=>{ms.forEach(m=>{
    if(m.type==="attributes"){const el=m.target;if(el.matches&&el.matches(SEL)){if(isOpen(el))onOpen(el);else onClose(el)}}
    else m.removedNodes.forEach(n=>{if(n.nodeType===1&&stack.includes(n))onClose(n)});
  })}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["hidden"],childList:true});
  document.querySelectorAll(SEL).forEach(el=>{if(isOpen(el))onOpen(el)});
})();
/* 1.44.5: Admin-Reiter direkt unter der stehenden Admin-Kopfzeile */
(function(){const h=document.querySelector(".adminBox>.adminModalHead");if(!h||!window.ResizeObserver)return;
  new ResizeObserver(()=>{document.documentElement.style.setProperty("--admHeadH",h.offsetHeight+"px")}).observe(h)})();

/* ===== 1.45.0: Kapitän (C) und Assistenten (A) – nur Rückennummern; gepflegt im Admin-Bereich (Spiele › Kapitäne) ===== */
var capData={on:true,list:[]};
function capGet(){const cd=capData||{on:true,list:[]}, map={};(cd.list||[]).forEach(x=>{if(x&&x.team)map[x.team]={c:String(x.c||""),a:(Array.isArray(x.a)?x.a:[]).map(String).filter(Boolean)}});return {on:cd.on!==false,map}} /* capData kann beim ersten Zeichnen noch fehlen (var weiter unten) */
window.capInfo={get:capGet};
function capRole(team,nr){const m=capGet();if(!m.on)return "";const t=m.map[team];if(!t)return "";nr=String(Number(String(nr).replace(/\D/g,""))||"");if(!nr)return "";return t.c===nr?"C":t.a.includes(nr)?"A":""}
function capBadge(team,nr){const r=capRole(team,nr);return r?`<span class="capB ${r==="C"?"c":"a"}" title="${r==="C"?"Kapitän":"Assistent"}">${r}</span>`:""}
function capLine(team){const m=capGet();const t=m.on&&m.map[team];if(!t||(!t.c&&!t.a.length))return "";
  return `<div class="capLine">${t.c?`<span><span class="capB c">C</span>${esc(t.c)}</span>`:""}${t.a.map(n=>`<span><span class="capB a">A</span>${esc(n)}</span>`).join("")}</div>`}
function capBilanz(team){const m=capGet();const t=m.on&&m.map[team];if(!t||(!t.c&&!t.a.length))return "";
  return `<div class="capBil">${t.c?`<div><span class="capB c">C</span><b>Nr. ${esc(t.c)}</b><small>Kapitän</small></div>`:""}${t.a.map(n=>`<div><span class="capB a">A</span><b>Nr. ${esc(n)}</b><small>Assistent</small></div>`).join("")}</div>`}
/* „C“/„A“ neben „Nr. 17“ bei Torschützen und Live-Toren (nicht im Fließtext des Spielberichts, nie beim Gegner) */
function capApply(root){
  const m=capGet(); if(!m.on||!Object.keys(m.map).length||!root||!root.querySelectorAll)return;
  const skip=n=>n.closest("textarea,input,script,style,.adminModal,#adminModal,.opp,.instaModal,.mdReport,.repText,.capB,.capBil,.capLine,.newsModal,#newsModal");
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:t=>/Nr\.\s?\d/.test(t.nodeValue)&&t.parentElement&&!skip(t.parentElement)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
  const list=[];while(walker.nextNode())list.push(walker.currentNode);
  list.forEach(t=>{const team=myNrTeamOf(t.parentElement); if(!m.map[team])return;
    const host=t.parentElement.matches("mark.myNr")?t.parentElement:null;
    const re=/Nr\.\s?(\d{1,2})(?!\d)/g, v=t.nodeValue; let x, cuts=[];
    while((x=re.exec(v))){const r=capRole(team,x[1]);if(r)cuts.push({end:x.index+x[0].length,r})}
    if(!cuts.length)return;
    if(host){const nx=host.nextSibling;if(nx&&nx.nodeType===1&&nx.classList.contains("capB"))return;const sp=document.createElement("span");sp.className="capB "+(cuts[0].r==="C"?"c":"a");sp.textContent=cuts[0].r;host.after(sp);return}
    const frag=document.createDocumentFragment(); let last=0, changed=false;
    cuts.forEach(c=>{const after=v.slice(c.end), nx=t.nextSibling; if(c.end===v.length&&nx&&nx.nodeType===1&&nx.classList.contains("capB"))return;
      if(/^\s*\(?[CA]\)?\b/.test(after))return;
      frag.appendChild(document.createTextNode(v.slice(last,c.end)));const sp=document.createElement("span");sp.className="capB "+(c.r==="C"?"c":"a");sp.textContent=c.r;frag.appendChild(sp);last=c.end;changed=true});
    if(!changed)return; frag.appendChild(document.createTextNode(v.slice(last))); t.replaceWith(frag)});
}
window.setCaptains=function(d,rerender){capData={on:!d||d.on!==false,list:d&&Array.isArray(d.list)?d.list:[]};
  if(rerender){try{const sv=document.getElementById("statsView");if(sv&&!sv.hidden)renderStats(true)}catch(e){}try{renderTeamTiles()}catch(e){}try{renderLast()}catch(e){}const bz=document.getElementById("bilanzModal");if(bz&&!bz.hidden&&bz.querySelector("#bilanzModalContent")?.dataset.team)openBilanz(bz.querySelector("#bilanzModalContent").dataset.team)}
  capApply(document.body)};
(function(){let q=new Set(),raf=0;
  new MutationObserver(ms=>{const m=capGet();if(!m.on||!Object.keys(m.map).length)return;ms.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1&&!n.classList.contains("capB"))q.add(n);else if(n.nodeType===3&&n.parentElement)q.add(n.parentElement)}));
    if(q.size&&!raf)raf=requestAnimationFrame(()=>{raf=0;const L=[...q];q.clear();L.forEach(n=>{if(n.isConnected)capApply(n)})})}).observe(document.body,{childList:true,subtree:true});
  try{const c=JSON.parse(localStorage.getItem("grizzlysCaptains")||"null");if(c&&c.data)window.setCaptains(c.data,true)}catch(e){}
})();

/* ===== 1.47.0: Saisonbilanz mit Reitern (Überblick · Verlauf · Liga · Nummern) und weiteren Statistiken.
   Alles je Mannschaft, nur Rückennummern, keine Namen. Quelle: eingetragene Ergebnisse + EHV-Daten (functions/standings.js). ===== */
const SB_TABS=[["ov","Überblick"],["flow","Verlauf"],["liga","Liga"],["nr","Nummern"]];
let sbTabLast="ov";
function sbSec(title,small,body,cls){return body?`<div class="sbSec${cls?" "+cls:""}"><h4>${title}${small?` <small>(${small})</small>`:""}</h4>${body}</div>`:""}
function sbSpecial(team){const sc=standings[team]&&standings[team].scorers;return sc&&sc.special&&sc.special.games?sc.special:null}
const sbPct=(a,b)=>b?Math.round(a/b*100):0;
const sbNum=v=>(Math.round(v*10)/10).toLocaleString("de-DE",{maximumFractionDigits:1});
function sbOwnLeague(team){const st=standings[team],own=standRow(team,sbOwn(team));if(!st||!own||!Array.isArray(st.games))return null;
  return st.games.filter(x=>x.h===own.n||x.a===own.n).sort((a,b)=>a.d.localeCompare(b.d)||a.t-b.t)}

/* --- Verlauf --- */
function sbLeadTime(team){const sp=sbSpecial(team);if(!sp)return "";const T=(sp.lead||0)+(sp.tied||0)+(sp.trail||0);if(!T)return "";
  const L=sbPct(sp.lead,T),R=sbPct(sp.trail,T),D=Math.max(0,100-L-R),m=v=>Math.round(v/60/sp.games);
  return sbSec("Zeit in Führung","je Spiel, "+sp.games+" EHV-Spielberichte",
    `<div class="sbStack" role="img" aria-label="Führung ${L} Prozent, Gleichstand ${D} Prozent, Rückstand ${R} Prozent"><i class="w" style="width:${L}%"></i><i class="d" style="width:${D}%"></i><i class="l" style="width:${R}%"></i></div>
    <div class="sbStackLeg"><span><i class="w"></i>Führung<b>${L} %</b><small>Ø ${m(sp.lead)} Min.</small></span><span><i class="d"></i>Gleichstand<b>${D} %</b><small>Ø ${m(sp.tied)} Min.</small></span><span><i class="l"></i>Rückstand<b>${R} %</b><small>Ø ${m(sp.trail)} Min.</small></span></div>`)}
function sbComeback(S){
  const C={w1:[0,0],t1:[0,0],l1:[0,0],w2:[0,0],t2:[0,0],l2:[0,0]};let n=0;
  S.P.forEach(x=>{const p=sbPer(x.g);if(!p)return;n++;const d1=p[0][0]-p[0][1],d2=d1+p[1][0]-p[1][1],won=x.r.o==="w"?1:0,k=(d,s)=>(d>0?"w":d<0?"l":"t")+s;
    C[k(d1,1)][0]++;C[k(d1,1)][1]+=won;C[k(d2,2)][0]++;C[k(d2,2)][1]+=won});
  if(!n)return "";
  const ring=(c,cls)=>{const p=c[0]?c[1]/c[0]:0,R=19,U=2*Math.PI*R;return `<svg viewBox="0 0 48 48" class="cbRing ${cls}" aria-hidden="true"><circle cx="24" cy="24" r="${R}" class="bg"/><circle cx="24" cy="24" r="${R}" class="fg" stroke-dasharray="${(p*U).toFixed(1)} ${U.toFixed(1)}" transform="rotate(-90 24 24)"/><text x="24" y="28">${c[0]?Math.round(p*100)+"%":"–"}</text></svg>`};
  /* 1.50.3: klarer formuliert – Einteilung nach dem Stand nach 2 Dritteln; „kam noch nicht vor“ statt „noch nie“ */
  const sp=n=>n+" "+(n===1?"Spiel":"Spiele");
  const card=(lbl,c,cls,verb)=>`<div class="cbT">${ring(c,cls)}<div><small>${lbl}</small><b>${c[0]?sp(c[0]):"–"}</b><span>${c[0]?"→ "+c[1]+" "+verb:"kam noch nicht vor"}</span></div></div>`;
  const one=(c,verb)=>c[0]?`${sp(c[0])} → ${c[1]} ${verb}`:"kam noch nicht vor";
  return sbSec("Stand nach 2 Dritteln",n+" Spiele mit Dritteln",`<div class="cbGrid">
    ${card("Vorn",C.w2,"w","gewonnen")}${card("Gleich",C.t2,"d","gewonnen")}${card("Hinten",C.l2,"l","gedreht")}</div>
    <div class="cbSub">Nach dem 1. Drittel – vorn: ${one(C.w1,"gewonnen")} · hinten: ${one(C.l1,"gedreht")}</div>`)}
function sbClose(S){
  const close=x=>Math.abs(x.r.gs-x.r.os)<=1||x.r.x==="so"||x.r.x==="ot"||x.r.o==="d";
  const L=S.P.filter(close),O=S.P.filter(x=>!close(x)); if(!L.length&&!O.length)return "";
  const rec=A=>({w:A.filter(x=>x.r.o==="w").length,l:A.filter(x=>x.r.o==="l").length});
  const bar=(lbl,A)=>{const r=rec(A);return `<div class="clRow"><span>${lbl}<small>${A.length} ${A.length===1?"Spiel":"Spiele"}</small></span><div class="clBar">${A.length?`${r.w?`<i class="w" style="flex:${r.w}">${r.w} S</i>`:""}${r.l?`<i class="l" style="flex:${r.l}">${r.l} N</i>`:""}`:'<em>keine</em>'}</div></div>`};
  const chips=L.slice(-8).map(x=>`<span class="clChip ${x.r.o}">${x.r.gs}:${x.r.os}${x.r.x==="so"?" n.P.":""} <small>${esc(shortTeam(opponent(x.g)))}</small></span>`).join("");
  return sbSec("Knappe und deutliche Spiele","",`${bar("Knapp <em>1 Tor oder n.P.</em>",L)}${bar("Deutlich <em>2+ Tore</em>",O)}${chips?`<div class="clChips">${chips}</div>`:""}`)}
function sbPeriods(S){
  if(!S.perN)return "";
  const L=S.P.map(x=>sbPer(x.g)).filter(Boolean),last=L.slice(-5),lp=[0,1,2].map(i=>last.reduce((a,p)=>[a[0]+p[i][0],a[1]+p[i][1]],[0,0]));
  const best=[0,1,2].sort((a,b)=>(S.per[b][0]-S.per[b][1])-(S.per[a][0]-S.per[a][1]))[0], max=Math.max(1,...S.per.flat());
  return sbSec("Tore je Drittel",S.perN+" "+(S.perN===1?"Spiel":"Spiele")+" mit Dritteln",`<div class="sbPer">${S.per.map((v,i)=>{const d=v[0]-v[1],ld=lp[i][0]-lp[i][1];
    return `<div class="${i===best?"best":""}"><span>${i+1}. Drittel</span><b>${v[0]}:${v[1]}</b><div class="perBars"><i class="f" style="width:${(v[0]/max*100).toFixed(0)}%"></i><i class="x" style="width:${(v[1]/max*100).toFixed(0)}%"></i></div>${i===best?"<em>stärkstes</em>":""}${last.length>=3&&L.length>last.length?`<small class="perTr ${ld>0?"up":ld<0?"dn":""}">letzte ${last.length}: ${lp[i][0]}:${lp[i][1]}</small>`:""}</div>`}).join("")}</div>`)}
function sbMinutes(team){
  const sp=sbSpecial(team); if(!sp||!sp.tf||!sp.ta)return "";
  const N=sp.tf[6]+sp.ta[6]>0?7:6, tf=sp.tf.slice(0,N), ta=sp.ta.slice(0,N); if(!tf.some(Boolean)&&!ta.some(Boolean))return "";
  const W=330,H=170,mid=84,cw=W/N,bw=Math.min(30,cw*.58),max=Math.max(1,...tf,...ta),h=v=>v/max*(mid-22);
  const lab=i=>i===6?"n.V.":`${i*10+1}.–${i*10+10}.`;
  const g=tf.map((v,i)=>{const cx=(i+.5)*cw;return `<g><title>${lab(i)} Minute: ${v} Tore, ${ta[i]} Gegentore</title>
    <rect x="${(cx-bw/2).toFixed(1)}" y="${(mid-1-h(v)).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(v?2:0,h(v)).toFixed(1)}" rx="3" class="mnF"/>
    <rect x="${(cx-bw/2).toFixed(1)}" y="${(mid+1).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(ta[i]?2:0,h(ta[i])).toFixed(1)}" rx="3" class="mnA"/>
    ${v?`<text x="${cx.toFixed(1)}" y="${(mid-5-h(v)).toFixed(1)}" class="mnV">${v}</text>`:""}${ta[i]?`<text x="${cx.toFixed(1)}" y="${(mid+13+h(ta[i])).toFixed(1)}" class="mnV a">${ta[i]}</text>`:""}
    <text x="${cx.toFixed(1)}" y="${H-3}" class="mnL">${i===6?"n.V.":i*10+"–"+(i*10+10)}</text></g>`}).join("");
  const d=tf.map((v,i)=>v-ta[i]),bi=d.indexOf(Math.max(...d)),wi=d.indexOf(Math.min(...d));
  return sbSec("Tore nach Spielminute",sp.games+" EHV-Spielberichte",`<div class="mnWrap"><svg class="mnChart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tore und Gegentore je 10 Spielminuten"><line x1="0" x2="${W}" y1="${mid}" y2="${mid}" class="sbAxis"/>${g}</svg></div>
    <div class="scLeg mnLeg"><i class="f"></i>Tore <i class="x"></i>Gegentore · Spielminuten</div>
    <div class="cbSub">Stärkste Phase: <b>${lab(bi)} Min.</b> (${d[bi]>0?"+":""}${d[bi]})${d[wi]<0&&wi!==bi?` · schwächste: <b>${lab(wi)} Min.</b> (${d[wi]})`:""}</div>`)}

/* --- Liga --- */
function sbLeagueStats(team){
  const st=standings[team],own=standRow(team,sbOwn(team)); if(!st||!own||!Array.isArray(st.games)||!Array.isArray(st.rows))return null;
  const T={};st.rows.forEach(r=>T[r.n]={n:r.n,r:r.r,gp:0,gf:0,ga:0});
  st.games.forEach(x=>{const H=T[x.h],A=T[x.a];if(H){H.gp++;H.gf+=x.hs;H.ga+=x.as}if(A){A.gp++;A.gf+=x.as;A.ga+=x.hs}});
  const L=Object.values(T).filter(t=>t.gp).map(t=>({...t,f:t.gf/t.gp,a:t.ga/t.gp})), me=L.find(t=>t.n===own.n);
  return me&&L.length>1?{L,me,own,n:st.rows.length}:null}
function sbStrip(L,me,key,better,label){
  const vals=L.map(t=>t[key]),mn=Math.min(...vals),mx=Math.max(...vals),W=320,px=14,H=52,y=24;
  const pos=v=>{const q=mx===mn?.5:(v-mn)/(mx-mn);return px+(better==="low"?1-q:q)*(W-2*px)};
  const rank=1+L.filter(t=>better==="low"?t[key]<me[key]:t[key]>me[key]).length, avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const dots=L.filter(t=>t!==me).map(t=>`<circle cx="${pos(t[key]).toFixed(1)}" cy="${y}" r="5" class="stO"><title>${esc(shortTeam(t.n))}: ${sbNum(t[key])}</title></circle>`).join("");
  return `<div class="stRow"><div class="stHead"><span>${label}</span><b>${rank}. ${better==="low"?"beste":"bester"} von ${L.length}</b></div>
    <svg class="stChart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}: ${sbNum(me[key])} je Spiel, Platz ${rank} von ${L.length}"><line x1="${px}" x2="${W-px}" y1="${y}" y2="${y}" class="stAx"/><line x1="${pos(avg).toFixed(1)}" x2="${pos(avg).toFixed(1)}" y1="${y-10}" y2="${y+10}" class="stAvg"/>${dots}
    <circle cx="${pos(me[key]).toFixed(1)}" cy="${y}" r="9" class="stMe"/><text x="${pos(me[key]).toFixed(1)}" y="${y-14}" class="stMeT">${sbNum(me[key])}</text>
    <text x="${px}" y="${H-2}" class="stEnd">schwächer</text><text x="${W-px}" y="${H-2}" class="stEnd r">besser</text></svg>
    <div class="stFoot">${sbNum(me[key])} je Spiel · Liga-Schnitt ${sbNum(avg)}</div></div>`}
function sbLeagueCmp(team){const X=sbLeagueStats(team);if(!X)return "";
  return sbSec("Im Ligavergleich","Tore und Gegentore je Spiel, alle Teams",sbStrip(X.L,X.me,"f","high","Angriff")+sbStrip(X.L,X.me,"a","low","Abwehr")+'<div class="stLeg"><i class="me"></i>wir <i class="o"></i>andere Teams <i class="avg"></i>Schnitt</div>')}
function sbHalves(team,S){
  const st=standings[team]; if(!st||!Array.isArray(st.rows)||st.rows.length<4)return "";
  const N=st.rows.length,cut=Math.ceil(N/2),z=()=>({w:0,l:0,gf:0,ga:0,n:0}),A=z(),B=z();
  S.P.forEach(x=>{const r=standRow(team,opponent(x.g));if(!r||!r.r)return;const o=r.r<=cut?A:B;o.n++;if(x.r.o==="w")o.w++;else if(x.r.o==="l")o.l++;o.gf+=x.r.gs;o.ga+=x.r.os});
  if(!A.n&&!B.n)return "";
  const box=(lbl,sub,o)=>`<div><span>${lbl}<small>${sub}</small></span><b>${o.n?`${o.w} S · ${o.l} N`:"–"}</b><small>${o.n?`${o.gf}:${o.ga} Tore`:"noch kein Spiel"}</small>${o.n?`<span class="hvBar"><i class="w" style="flex:${o.w||0}"></i><i class="l" style="flex:${o.l||0}"></i></span>`:""}</div>`;
  return sbSec("Gegen oben und unten","nach aktuellem Tabellenplatz des Gegners",`<div class="sbHA hv">${box("Obere Hälfte","Platz 1–"+cut,A)}${box("Untere Hälfte","Platz "+(cut+1)+"–"+N,B)}</div>`)}
function sbRest(team,S){
  const st=standings[team],now=new Date(); const R=S.all.filter(g=>!g.cancelled&&!resInfo(g)&&dt(g)>=now); if(!R.length)return "";
  const N=st&&Array.isArray(st.rows)?st.rows.length:0, rk=g=>{const r=N?standRow(team,opponent(g)):null;return r&&r.r?r.r:0};
  const tier=r=>!r||!N?"":r<=Math.ceil(N/3)?"hi":r>N-Math.ceil(N/3)?"lo":"mid";
  const rs=R.map(rk).filter(Boolean),ps=S.P.map(x=>rk(x.g)).filter(Boolean),av=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  const rows=R.slice(0,8).map(g=>{const r=rk(g);return `<div class="rpR"><span class="rpD">${esc(g.date.slice(8,10)+"."+g.date.slice(5,7)+".")}</span><span class="rpHA">${isHome(g)?"H":"A"}</span><span class="rpN">${esc(shortTeam(opponent(g)))}</span>${r?`<span class="rpK ${tier(r)}">${r}.</span>`:'<span class="rpK">–</span>'}</div>`}).join("");
  const sum=rs.length?`Ø Gegnerplatz <b>${sbNum(av(rs))}</b>${ps.length?` · bisher ${sbNum(av(ps))}`:""} – ${ps.length&&av(rs)<av(ps)-.4?"es wird schwerer":ps.length&&av(rs)>av(ps)+.4?"es wird leichter":"ähnlich schwer"}`:"";
  return sbSec("Restprogramm",R.length+" "+(R.length===1?"Spiel":"Spiele"),`${sum?`<div class="cbSub" style="margin:0 0 8px">${sum}</div>`:""}<div class="rpList">${rows}</div>${R.length>8?`<div class="cbSub">… und ${R.length-8} weitere</div>`:""}${N?'<div class="stLeg"><i class="hi"></i>oberes Drittel <i class="mid"></i>Mitte <i class="lo"></i>unteres Drittel</div>':""}`)}

/* --- Nummern --- */
function sbNrChips(L){return `<div class="nrChips">${L.map(([nr,v,t])=>`<span class="nrChip"><b>${esc(nr)}</b>${t||v+"×"}</span>`).join("")}</div>`}
function sbSpecialGoals(team){const sc=standings[team]&&standings[team].scorers;if(!sc||!sc.list)return "";
  const pp=sc.list.filter(x=>x.pp).sort((a,b)=>b.pp-a.pp).map(x=>[x.nr,x.pp]),gw=sc.list.filter(x=>x.gw).sort((a,b)=>b.gw-a.gw).map(x=>[x.nr,x.gw]);
  if(!pp.length&&!gw.length)return "";
  return sbSec("Besondere Tore","",`${pp.length?`<div class="nrLbl">Überzahltore</div>${sbNrChips(pp)}`:""}${gw.length?`<div class="nrLbl">Siegtore</div>${sbNrChips(gw)}`:""}`)}
function sbMulti(team){const G=sbOwnLeague(team);if(!G)return "";const H={},D={};
  G.forEach(x=>{if(!x.sc||!x.sc.length)return;const c={};x.sc.forEach(n=>c[n]=(c[n]||0)+1);Object.keys(c).forEach(n=>{if(c[n]>=3)H[n]=(H[n]||0)+1;else if(c[n]===2)D[n]=(D[n]||0)+1})});
  const srt=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]||Number(a[0])-Number(b[0]));
  const h=srt(H),d=srt(D); if(!h.length&&!d.length)return "";
  return sbSec("Mehrere Tore in einem Spiel","",`${h.length?`<div class="nrLbl">Hattricks <small>(3+ Tore)</small></div>${sbNrChips(h)}`:""}${d.length?`<div class="nrLbl">Doppelpacks</div>${sbNrChips(d)}`:""}`)}
function sbStreaks(team){const G=sbOwnLeague(team);if(!G||G.length<2)return "";
  const withAs=G.some(x=>Array.isArray(x.av)), pts=x=>new Set([...(x.sc||[]),...(withAs?(x.av||[]):[])]);
  const all=new Set();G.forEach(x=>pts(x).forEach(n=>all.add(n)));
  const L=[...all].map(nr=>{let n=0;for(let i=G.length-1;i>=0&&pts(G[i]).has(nr);i--)n++;return [nr,n]}).filter(x=>x[1]>=2).sort((a,b)=>b[1]-a[1]||Number(a[0])-Number(b[0])).slice(0,8);
  const word=withAs?"mit Scorerpunkt":"mit Tor";
  return sbSec(withAs?"Scorer-Serien":"Tor-Serien","aktuell, Spiele in Folge "+word,L.length?sbNrChips(L.map(([nr,n])=>[nr,n,n+" Spiele"])):`<div class="cbSub" style="margin:0">Gerade hat keine Nummer mehrere Spiele in Folge ${word}.</div>`)}

/* --- Reiter --- */
function sbTabsHtml(panes){
  const has=SB_TABS.filter(([k])=>panes[k]&&panes[k].trim());
  if(!has.some(([k])=>k===sbTabLast))sbTabLast="ov";
  return `<div class="sbTabs" role="tablist">${has.map(([k,l])=>`<button type="button" role="tab" data-sbtab="${k}" class="${k===sbTabLast?"on":""}" aria-selected="${k===sbTabLast}">${l}</button>`).join("")}</div>`+
    has.map(([k])=>`<div class="sbPane" data-sbpane="${k}"${k===sbTabLast?"":" hidden"}>${panes[k]}</div>`).join("")}
function sbBindTabs(c){
  const tabs=c.querySelector(".sbTabs"); if(!tabs)return;
  const head=c.closest(".matchModalBox")?.querySelector(".matchModalHead"); if(head)tabs.style.top=Math.max(0,head.offsetHeight-18)+"px";
  tabs.querySelectorAll("[data-sbtab]").forEach(b=>b.onclick=()=>{sbTabLast=b.dataset.sbtab;
    tabs.querySelectorAll("[data-sbtab]").forEach(x=>{const on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-selected",on)});
    c.querySelectorAll("[data-sbpane]").forEach(p=>p.hidden=p.dataset.sbpane!==sbTabLast);
    const box=c.closest(".matchModalBox"); if(box){const t=box.scrollTop+tabs.getBoundingClientRect().top-box.getBoundingClientRect().top-(head?head.offsetHeight-18:0); if(box.scrollTop>t)box.scrollTop=t}
    try{trackAnalyticsEvent("saisonbilanz_tab",{tab:sbTabLast})}catch(e){}});
}

/* ===== 1.48.0: Hintergrundbilder fürs Handy (Downloads) – auf dem Gerät erzeugt, passend zur Bildschirmgröße.
   Sperrbildschirm-tauglich: oben ~30 % frei für die Uhr, unten ~13 % frei für die Bedienelemente. Keine Spielernamen. ===== */
const WP_TEAMCOL={A:"#168cff",B:"#ff8a00",U13:"#f2b705"};
function wpSize(){const dpr=Math.min(3,window.devicePixelRatio||2),sw=Math.min(screen.width,screen.height),sh=Math.max(screen.width,screen.height);
  let w=Math.round(sw*dpr),h=Math.round(sh*dpr); if(!w||!h||h/w<1.6||w<640){w=1179;h=2556}
  const s=Math.min(1,1440/w);return [Math.round(w*s),Math.round(h*s)]}
function wpAdventOn(d=new Date()){const m=d.getMonth(),dd=d.getDate();return (m===10&&dd>=20)||m===11||(m===0&&dd<=6)}
function wpRand(seed){let s=seed;return()=>{s=(s*9301+49297)%233280;return s/233280}}
function wpLogo(c,img,cx,cy,w,glow){if(!img)return;const h=w*img.naturalHeight/img.naturalWidth;c.save();c.shadowColor=glow||"rgba(22,140,255,.55)";c.shadowBlur=w*.12;c.drawImage(img,cx-w/2,cy-h/2,w,h);c.restore();return h}
/* 1.50.0: helle Variante – heller Verlauf mit feinen Eis-Linien statt Hallenfoto */
function wpLightBg(c,W,H){const u=W/1080;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#f8fbff");g.addColorStop(.55,"#e6f0fa");g.addColorStop(1,"#cfe1f4");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W/2,H*.5,0,W/2,H*.5,W*.8);g.addColorStop(0,"rgba(22,140,255,.10)");g.addColorStop(1,"rgba(22,140,255,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalAlpha=.05;c.strokeStyle=IC_.navy;c.lineWidth=2*u;for(let x=-H;x<W;x+=46*u){c.beginPath();c.moveTo(x,H);c.lineTo(x+H,0);c.stroke()}c.restore()}
function wpPhoto(c,W,H,rink,bright,L){if(L){wpLightBg(c,W,H);return}c.fillStyle=IC_.bg;c.fillRect(0,0,W,H);
  if(rink){const s=Math.max(W/rink.naturalWidth,H/rink.naturalHeight)*1.02,w=rink.naturalWidth*s,h=rink.naturalHeight*s;c.save();c.filter=`saturate(1.15) brightness(${bright||.75})`;c.drawImage(rink,(W-w)/2,(H-h)/2,w,h);c.restore()}
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,IC_.ov(.55));g.addColorStop(.45,IC_.ov(.35));g.addColorStop(1,IC_.ov(.94));c.fillStyle=g;c.fillRect(0,0,W,H)}
function wpBrand(c,W,y,u,col,L){instaFont(c,0,100*u,true);c.textAlign="center";c.textBaseline="alphabetic";
  c.save();c.shadowColor=L?"rgba(255,255,255,.8)":"rgba(0,0,0,.6)";c.shadowBlur=24*u;const a="YOUNG ",b="GRIZZLYS",wa=c.measureText(a).width,wb=c.measureText(b).width,x0=W/2-(wa+wb)/2;
  c.textAlign="left";c.fillStyle=L?IC_.navy:"#fff";c.fillText(a,x0,y);c.fillStyle=col||IC_.acc;c.fillText(b,x0+wa,y);c.restore();
  instaFont(c,800,30*u);instaSpace(c,12*u);c.textAlign="center";c.fillStyle=L?IC_.navyA(.7):IC_.t2a(.85);c.fillText("ESV GRIZZLYS BERGKAMEN",W/2+6*u,y+62*u);instaSpace(c,0)}

/* 1) Vereinsdesigns */
/* 1.53.0: Logo in Dunkelblau/Weiß (Graustufen → Dunkelblau…Weiß, Kontrast gestreckt, Details bleiben) */
let wpNavyCache=null;
function wpNavyLogo(img){
  if(!img)return img; if(wpNavyCache&&wpNavyCache.src===img.src)return wpNavyCache.cv;
  const w=img.naturalWidth,h=img.naturalHeight,cv=document.createElement("canvas");cv.width=w;cv.height=h;const x=cv.getContext("2d");x.drawImage(img,0,0);
  try{const d=x.getImageData(0,0,w,h),p=d.data;let mn=255,mx=0;
    for(let i=0;i<p.length;i+=4){if(p[i+3]<128)continue;const y=.299*p[i]+.587*p[i+1]+.114*p[i+2];if(y<mn)mn=y;if(y>mx)mx=y}
    const D=[11,42,82],L=[255,255,255],r=Math.max(1,mx-mn);
    for(let i=0;i<p.length;i+=4){let t=(.299*p[i]+.587*p[i+1]+.114*p[i+2]-mn)/r;t=Math.pow(Math.max(0,Math.min(1,t)),1.4);
      p[i]=D[0]+(L[0]-D[0])*t;p[i+1]=D[1]+(L[1]-D[1])*t;p[i+2]=D[2]+(L[2]-D[2])*t}
    x.putImageData(d,0,0)}catch(e){console.warn(e);return img}
  cv.naturalWidth=w;cv.naturalHeight=h;wpNavyCache={src:img.src,cv};return cv}
async function wpDesignBase(c,W,H,o){
  const H0=o.use==="home",WA=o.tone==="light"?.5:.55,A=fn=>{c.save();if(H0)c.globalAlpha=WA;const r=fn();c.restore();return r},LG=(...a)=>A(()=>wpLogo(...a)),BR=(...a)=>A(()=>wpBrand(...a)); /* 1.52.3: Startbildschirm = Logo und Schrift heller (halb durchsichtig) */
  const L=o.tone==="light",u=W/1080;let [logo,rink]=await Promise.all([instaImg(grizzlysLogo),o.style==="eis"?instaImg(L?"img/header-hell.webp":instaRinkSrc()):null]);if(o.logo==="navy")logo=wpNavyLogo(logo);const st=o.style||"eis",ink=L?IC_.navy:"#fff";
  if(st==="eis"&&L&&rink){/* 1.50.1: helles Hallenbild wie im Kopfbereich der hellen App */
    /* Bild so breit, dass die Scheinwerfer links und rechts sichtbar bleiben; oben dunkel, unten Eis weiterführen */
    const w=W*1.4,h=w*rink.naturalHeight/rink.naturalWidth,iy=H*.31-h*.17;
    let g=c.createLinearGradient(0,0,0,iy+2);g.addColorStop(0,"#010409");g.addColorStop(1,"#000000");c.fillStyle=g;c.fillRect(0,0,W,iy+2);
    c.fillStyle="#fefefe";c.fillRect(0,iy+h-2,W,H-iy-h+2);c.drawImage(rink,(W-w)/2,iy,w,h);
    g=c.createLinearGradient(0,iy+h*.8,0,H);g.addColorStop(0,"rgba(254,254,254,0)");g.addColorStop(.35,"#f7fafd");g.addColorStop(1,"#dde9f5");c.fillStyle=g;c.fillRect(0,iy+h*.8,W,H);
    const lh=LG(c,logo,W/2,H*.53,W*.62,"rgba(10,30,60,.45)")||W*.6;BR(c,W,H*.53+lh/2+150*u,u,null,true);return}
  if(st==="eis"){wpPhoto(c,W,H,rink,.7,L);const lh=LG(c,logo,W/2,H*.53,W*.62,L?IC_.navyA(.25):null)||W*.6;BR(c,W,H*.53+lh/2+150*u,u,null,L);return}
  if(st==="nacht"){let g=c.createRadialGradient(W/2,H*.5,0,W/2,H*.5,H*.7);g.addColorStop(0,L?"#ffffff":"#123f75");g.addColorStop(.45,L?"#e3eef9":IC_.bg2);g.addColorStop(1,L?"#bcd5ee":"#030b17");c.fillStyle=g;c.fillRect(0,0,W,H);
    c.save();c.globalAlpha=L?.05:.06;c.strokeStyle=L?IC_.navy:"#fff";c.lineWidth=2*u;for(let x=-H;x<W;x+=46*u){c.beginPath();c.moveTo(x,H);c.lineTo(x+H,0);c.stroke()}c.restore();
    const lh=LG(c,logo,W/2,H*.52,W*.58,L?IC_.navyA(.3):"rgba(70,160,255,.7)")||W*.55;
    A(()=>{const y=H*.52+lh/2+90*u;c.fillStyle=IC_.acc;instaRR(c,W/2-70*u,y,140*u,8*u,4*u);c.fill();
    instaFont(c,900,40*u);instaSpace(c,14*u);c.textAlign="center";c.fillStyle=ink;c.fillText("YOUNG GRIZZLYS",W/2+7*u,y+80*u);instaSpace(c,0);});return}
  if(st==="feld"){c.fillStyle=L?"#f2f7fc":IC_.bg2;c.fillRect(0,0,W,H);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,L?"rgba(255,255,255,.6)":"rgba(255,255,255,.07)");g.addColorStop(1,L?"rgba(160,195,230,.35)":"rgba(0,0,0,.35)");c.fillStyle=g;c.fillRect(0,0,W,H);
    const cy=H*.52,R=W*.36,ln=(y,col,w)=>{c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.strokeStyle=col;c.lineWidth=w;c.stroke()};
    ln(cy,"rgba(214,69,59,.55)",14*u);ln(cy-H*.2,"rgba(22,140,255,.55)",18*u);ln(cy+H*.2,"rgba(22,140,255,.55)",18*u);
    c.strokeStyle=L?"rgba(22,140,255,.45)":"rgba(255,255,255,.22)";c.lineWidth=5*u;c.beginPath();c.arc(W/2,cy,R,0,Math.PI*2);c.stroke();
    [[.22,-.34],[.78,-.34],[.22,.34],[.78,.34]].forEach(([fx,fy])=>{const x=W*fx,y=cy+H*fy;c.beginPath();c.arc(x,y,W*.17,0,Math.PI*2);c.strokeStyle="rgba(214,69,59,.35)";c.lineWidth=5*u;c.stroke();c.beginPath();c.arc(x,y,12*u,0,Math.PI*2);c.fillStyle="rgba(214,69,59,.55)";c.fill()});
    c.beginPath();c.arc(W/2,cy,R*.96,0,Math.PI*2);c.fillStyle=L?"rgba(255,255,255,.75)":IC_.ov(.55);c.fill();
    LG(c,logo,W/2,cy,R*1.5,L?IC_.navyA(.3):"rgba(0,0,0,.6)");
    A(()=>{instaFont(c,0,90*u,true);c.textAlign="center";c.fillStyle=ink;c.save();c.shadowColor=L?"rgba(255,255,255,.8)":"rgba(0,0,0,.6)";c.shadowBlur=20*u;c.fillText("YOUNG GRIZZLYS",W/2,cy+H*.2+150*u);c.restore();});return}
  /* streifen */
  if(L)wpLightBg(c,W,H);else{c.fillStyle=IC_.bg;c.fillRect(0,0,W,H)}
  c.beginPath();c.moveTo(0,H*.62);c.lineTo(W,H*.48);c.lineTo(W,H);c.lineTo(0,H);c.closePath();let g=c.createLinearGradient(0,H*.5,0,H);g.addColorStop(0,L?"rgba(22,140,255,.30)":"rgba(22,140,255,.45)");g.addColorStop(1,L?"rgba(22,140,255,.08)":"rgba(22,140,255,.05)");c.fillStyle=g;c.fill();
  c.save();c.shadowColor=L?IC_.accA(.5):IC_.accA(.85);c.shadowBlur=40*u;c.strokeStyle=IC_.acc;c.lineWidth=14*u;c.beginPath();c.moveTo(-20,H*.62+3*u);c.lineTo(W+20,H*.48-3*u);c.stroke();c.restore();
  LG(c,logo,W/2,H*.43,W*.56,L?IC_.navyA(.3):"rgba(22,140,255,.55)");
  A(()=>{instaFont(c,0,104*u,true);c.textAlign="center";c.save();c.shadowColor=L?"rgba(255,255,255,.8)":"rgba(0,0,0,.6)";c.shadowBlur=20*u;c.fillStyle=ink;c.fillText("YOUNG",W/2,H*.68);c.fillStyle=IC_.acc;c.fillText("GRIZZLYS",W/2,H*.68+110*u);c.restore()});}

async function wpDesign(c,W,H,o){return wpDesignBase(c,W,H,o)}

/* 3) Trikot mit Rückennummer */
/* 1.48.1: Trikot dem Original nachempfunden (hellblau, schwarzer Kragen, schwarze Bruchlinie, geschwungene Streifen unten,
   „Bergkamen“ auf den Ärmeln, gestreifte Bündchen). Ohne Spielernamen und ohne Sponsorenlogos. */
function wpJersey(c,cx,y0,J,white){
  const P=(x,y)=>[cx+x*J,y0+y*J];
  const SH=[[.15,0],[.37,.05],[.63,.29],[.68,.63],[.5,.68],[.39,.42],[.41,1.06],[-.41,1.06],[-.39,.42],[-.5,.68],[-.68,.63],[-.63,.29],[-.37,.05],[-.15,0]];
  const path=()=>{c.beginPath();c.moveTo(...P(-.15,0));c.quadraticCurveTo(...P(0,.11),...P(.15,0));SH.slice(1).forEach(q=>c.lineTo(...P(...q)));c.closePath()};
  const body=white?"#f4f7fb":"#4a93dd",ink="#0d0f14",light=white?"#4a93dd":"#ffffff";
  c.save();c.shadowColor="rgba(0,0,0,.55)";c.shadowBlur=J*.08;c.shadowOffsetY=J*.03;path();c.fillStyle=body;c.fill();c.restore();
  c.save();path();c.clip();
  /* Licht und Falten */
  let g=c.createLinearGradient(cx-J*.7,0,cx+J*.7,0);g.addColorStop(0,"rgba(0,0,0,.28)");g.addColorStop(.3,"rgba(0,0,0,.04)");g.addColorStop(.55,"rgba(255,255,255,.10)");g.addColorStop(1,"rgba(0,0,0,.30)");c.fillStyle=g;c.fillRect(cx-J,y0,J*2,J*1.2);
  /* schwarze Bruchlinie vom Kragen nach rechts */
  c.fillStyle=ink;c.beginPath();c.moveTo(...P(-.005,.09));c.lineTo(...P(.025,.09));c.lineTo(...P(.125,.285));c.lineTo(...P(.7,.33));c.lineTo(...P(.7,.375));c.lineTo(...P(.105,.315));c.closePath();c.fill();
  /* geschwungene Streifen unten (fallen nach rechts ab) */
  const curve=(yl,ym,yr,w,col)=>{c.beginPath();c.moveTo(...P(-.75,yl));c.quadraticCurveTo(...P(0,ym),...P(.75,yr));c.strokeStyle=col;c.lineWidth=w*J;c.stroke()};
  curve(.66,.66,.86,.018,ink);
  [[.76,.80,1.0,.045,ink],[.81,.85,1.05,.014,light],[.85,.89,1.09,.045,ink],[.90,.94,1.14,.014,light],[.945,.985,1.185,.045,ink]].forEach(a=>curve(...a));
  /* Bündchen: Streifen parallel zum Ärmelende, Richtung Schulter versetzt */
  [1,-1].forEach(sd=>{const a=P(sd*.68,.63),b=P(sd*.5,.68),t=P(sd*.5,.17),m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1];
    let ux=t[0]-m[0],uy=t[1]-m[1];const ul=Math.hypot(ux,uy);ux/=ul;uy/=ul;
    [[.03,.012,light],[.055,.022,ink],[.085,.012,light],[.11,.022,ink]].forEach(([off,w,col])=>{const ox=ux*off*J,oy=uy*off*J;c.beginPath();c.moveTo(a[0]+ox-dx*.3,a[1]+oy-dy*.3);c.lineTo(b[0]+ox+dx*.3,b[1]+oy+dy*.3);c.strokeStyle=col;c.lineWidth=w*J;c.stroke()})});
  /* „Bergkamen“ auf den Ärmeln */
  [[-1],[1]].forEach(([sd])=>{const a=P(sd*.43,.12),b=P(sd*.56,.52),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);c.save();c.translate((a[0]+b[0])/2,(a[1]+b[1])/2);c.rotate(ang);
    c.font=`900 ${J*.075}px "Arial Black",Impact,${INSTA_FONT}`;c.textAlign="center";c.textBaseline="middle";c.lineJoin="round";c.lineWidth=J*.016;c.strokeStyle=ink;c.strokeText("Bergkamen",0,0);c.fillStyle="#fff";c.fillText("Bergkamen",0,0);c.restore()});
  c.restore();
  /* Kragen */
  c.save();c.beginPath();c.moveTo(...P(-.155,-.005));c.quadraticCurveTo(...P(0,.115),...P(.155,-.005));c.strokeStyle=ink;c.lineWidth=J*.045;c.lineCap="round";c.stroke();c.restore();
  return {body,ink,light}}
async function wpTrikot(c,W,H,o){
  const u=W/1080,logo=await instaImg(grizzlysLogo),LT=o.tone==="light";
  let g=c.createRadialGradient(W/2,H*.5,0,W/2,H*.5,H*.75);g.addColorStop(0,LT?"#ffffff":"#163a63");g.addColorStop(1,LT?"#b9d2ec":"#03080f");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W/2,H*.28,0,W/2,H*.28,W*.7);g.addColorStop(0,LT?"rgba(255,255,255,.6)":"rgba(255,255,255,.16)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const J=W*.72,y0=H*.335,col=wpJersey(c,W/2,y0,J,o.kit==="away"),nr=String(o.nr||"").replace(/\D/g,"").slice(0,2);
  /* statt Spielername: „GRIZZLYS“ im Bogen wie die Namenszeile */
  {const txt="GRIZZLYS",R=J*1.6,cy=y0+J*.235+R;c.save();c.font=`900 ${J*.085}px Impact,"Arial Narrow",${INSTA_FONT}`;c.textAlign="center";c.textBaseline="alphabetic";c.lineJoin="round";
    const ws=[...txt].map(ch=>c.measureText(ch).width+J*.006),tot=ws.reduce((a,b)=>a+b,0);let ang=-tot/R/2;
    [...txt].forEach((ch,k)=>{const a=ang+ws[k]/R/2;c.save();c.translate(W/2+Math.sin(a)*R,cy-Math.cos(a)*R);c.rotate(a);c.lineWidth=J*.014;c.strokeStyle=col.light;c.strokeText(ch,0,0);c.fillStyle=col.ink;c.fillText(ch,0,0);c.restore();ang+=ws[k]/R});c.restore()}
  if(nr){const fs=J*(nr.length>1?.38:.44);c.font=`900 ${fs}px "Arial Black",Impact,${INSTA_FONT}`;c.textAlign="center";c.textBaseline="middle";c.lineJoin="miter";
    c.lineWidth=J*.03;c.strokeStyle=col.light;c.strokeText(nr,W/2,y0+J*.5);c.fillStyle=col.ink;c.fillText(nr,W/2,y0+J*.5)}
  else{instaFont(c,800,J*.06);c.textAlign="center";c.textBaseline="middle";c.fillStyle=col.ink;c.globalAlpha=.6;c.fillText("Nummer eintragen",W/2,y0+J*.5);c.globalAlpha=1}
  c.textBaseline="alphabetic";
  const ly=y0+J*1.06+170*u; wpLogo(c,logo,W/2-150*u,ly,110*u,LT?IC_.navyA(.25):"rgba(0,0,0,.4)");
  instaFont(c,0,64*u,true);c.textAlign="left";c.fillStyle=LT?IC_.navy:"#fff";c.fillText("YOUNG",W/2-80*u,ly-4*u);c.fillStyle=IC_.acc;c.fillText("GRIZZLYS",W/2-80*u,ly+56*u)}

/* 4) Nächstes Spiel */
function wpNextGame(team){const now=Date.now();return games.filter(g=>(!team||g.team===team)&&window.myTeam(g.team)&&!g.cancelled&&!resInfo(g)&&dt(g).getTime()+2*3600000>now).sort((a,b)=>dt(a)-dt(b))[0]||null}
async function wpNext(c,W,H,o){
  const u=W/1080,LT=o.tone==="light",g=wpNextGame(o.team),rink=LT?null:await instaImg(instaRinkSrc());wpPhoto(c,W,H,rink,.65,LT);
  const T1=LT?IC_.navy:"#fff",T2=LT?"#1d3b5e":IC_.t1,T3=LT?IC_.t4:IC_.t3,T4=LT?IC_.navyA(.6):IC_.t2a(.7);
  if(!g){instaFont(c,800,48*u);c.textAlign="center";c.fillStyle=T1;c.fillText("Gerade kein Spiel geplant",W/2,H*.5);return}
  const [lh,la]=await Promise.all([instaLogos(g.home),instaLogos(g.away)]),d=dt(g),col=WP_TEAMCOL[g.team]||"#168cff",x0=60*u,cw=W-120*u,y0=H*.33,ch=H*.5;
  c.save();c.shadowColor=LT?IC_.navyA(.18):"rgba(0,0,0,.5)";c.shadowBlur=50*u;instaRR(c,x0,y0,cw,ch,48*u);c.fillStyle=LT?"rgba(255,255,255,.9)":IC_.panel(.78);c.fill();c.restore();
  instaRR(c,x0,y0,cw,ch,48*u);c.lineWidth=3*u;c.strokeStyle=LT?IC_.navyA(.10):"rgba(255,255,255,.16)";c.stroke();
  c.textAlign="center";c.textBaseline="alphabetic";
  instaFont(c,900,30*u);instaSpace(c,6*u);const tag=("NÄCHSTES SPIEL · "+teamName(g.team)).toUpperCase(),tw=c.measureText(tag).width+60*u;instaRR(c,W/2-tw/2,y0+50*u,tw,64*u,32*u);c.fillStyle=col;c.fill();c.fillStyle=g.team==="A"?"#fff":IC_.accTx;c.fillText(tag,W/2+3*u,y0+93*u);instaSpace(c,0);
  instaFont(c,0,150*u,true);c.fillStyle=T1;c.fillText(d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".","")+" "+d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}),W/2,y0+300*u);
  instaFont(c,900,70*u);c.fillStyle=IC_.acc;c.fillText(g.time+" Uhr",W/2,y0+395*u);
  const ly=y0+ch*.62,r=Math.min(130*u,cw*.16);instaCircle(c,lh,g.home,W/2-cw*.28,ly,r);instaCircle(c,la,g.away,W/2+cw*.28,ly,r);
  instaFont(c,900,60*u);c.fillStyle=T1;c.textBaseline="middle";c.fillText("VS",W/2,ly);c.textBaseline="alphabetic";
  instaFont(c,800,34*u);c.fillStyle=T2;[[g.home,-1],[g.away,1]].forEach(([n,s])=>{let nm=shortTeam(n);while(c.measureText(nm).width>cw*.42&&nm.length>6)nm=nm.slice(0,-2);c.fillText(nm,W/2+s*cw*.28,ly+r+60*u)});
  instaFont(c,700,32*u);c.fillStyle=T3;c.fillText((isHome(g)?"Heimspiel · ":"Auswärts · ")+g.stadium,W/2,y0+ch-60*u);
  instaFont(c,700,26*u);c.fillStyle=T4;c.fillText("Young Grizzlys App · Stand "+new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}),W/2,y0+ch+70*u)}

/* 5) Spiele des Monats */
function wpMonthGames(team){const now=Date.now();return games.filter(g=>(!team||g.team===team)&&window.myTeam(g.team)&&!g.cancelled&&!resInfo(g)&&dt(g).getTime()+2*3600000>now&&dt(g).getTime()<now+35*864e5).sort((a,b)=>dt(a)-dt(b)).slice(0,7)}
async function wpMonth(c,W,H,o){
  const u=W/1080,LT=o.tone==="light",L=wpMonthGames(o.team),rink=LT?null:await instaImg(instaRinkSrc());wpPhoto(c,W,H,rink,.5,LT);
  const T1=LT?IC_.navy:"#fff",T3=LT?IC_.t4:IC_.t3;
  const y0=H*.31; instaFont(c,0,120*u,true);c.textAlign="left";c.textBaseline="alphabetic";
  const mons=[...new Set(L.map(g=>dt(g).getMonth()))],title=mons.length===1?dt(L[0]).toLocaleDateString("de-DE",{month:"long"}):"Nächste Spiele";
  c.save();c.shadowColor=LT?"rgba(255,255,255,.8)":"rgba(0,0,0,.6)";c.shadowBlur=20*u;c.fillStyle=T1;c.fillText(title,70*u,y0+90*u);c.restore();
  instaFont(c,800,30*u);c.fillStyle=IC_.acc;c.fillText((o.team?teamName(o.team):"Young Grizzlys")+" · "+L.length+(L.length===1?" Spiel":" Spiele"),74*u,y0+145*u);
  if(!L.length){instaFont(c,700,40*u);c.fillStyle=T3;c.fillText("In den nächsten Wochen keine Spiele.",74*u,y0+260*u);return}
  const top=y0+195*u,bottom=H*.86,gap=18*u,rh=Math.min(170*u,(bottom-top-gap*(L.length-1))/L.length);
  L.forEach((g,i)=>{const y=top+i*(rh+gap),d=dt(g),col=WP_TEAMCOL[g.team]||"#168cff",x=60*u,w=W-120*u;
    instaRR(c,x,y,w,rh,26*u);c.fillStyle=LT?"rgba(255,255,255,.9)":IC_.panel(.80);c.fill();c.lineWidth=2*u;c.strokeStyle=LT?IC_.navyA(.10):"rgba(255,255,255,.14)";c.stroke();instaRR(c,x,y,12*u,rh,6*u);c.fillStyle=col;c.fill();
    c.textAlign="center";instaFont(c,800,26*u);c.fillStyle=T3;c.fillText(d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".","").toUpperCase(),x+105*u,y+rh*.38);
    instaFont(c,900,Math.min(46*u,rh*.32));c.fillStyle=T1;c.fillText(d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}),x+105*u,y+rh*.72);
    c.textAlign="left";instaFont(c,800,Math.min(40*u,rh*.27));c.fillStyle=T1;let nm=(isHome(g)?"vs. ":"@ ")+shortTeam(opponent(g));const nm0=nm;while(c.measureText(nm+"…").width>w-420*u&&nm.length>8)nm=nm.slice(0,-1);if(nm!==nm0)nm=nm.trim()+"…";c.fillText(nm,x+200*u,y+rh*.46);
    instaFont(c,700,Math.min(28*u,rh*.2));c.fillStyle=T3;c.fillText((window.MY_TEAMS.length>1&&!o.team?teamName(g.team)+" · ":"")+(isHome(g)?"Heim":g.stadium),x+200*u,y+rh*.78);
    c.textAlign="right";instaFont(c,900,Math.min(44*u,rh*.3));c.fillStyle=IC_.acc;c.fillText(g.time,x+w-34*u,y+rh*.6)});
  c.textAlign="center";instaFont(c,700,26*u);c.fillStyle=LT?IC_.navyA(.6):IC_.t2a(.7);c.fillText("Stand "+new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" · Änderungen in der App",W/2,H*.885)}

/* 7) Advent und Weihnachten */
async function wpAdvent(c,W,H,o){
  const u=W/1080,logo=await instaImg("christmas-logo-gross.png")||await instaImg(grizzlysLogo),rnd=wpRand(17),LT=o.tone==="light";
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,LT?"#bcd7f1":"#020814");g.addColorStop(.55,LT?"#e3effa":IC_.navy);g.addColorStop(1,LT?"#f6faff":"#163f6e");c.fillStyle=g;c.fillRect(0,0,W,H);
  if(!LT)for(let i=0;i<160;i++){const x=rnd()*W,y=rnd()*H*.7,r=(rnd()*2+.6)*u;c.globalAlpha=.35+rnd()*.6;c.fillStyle="#fff";c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}c.globalAlpha=1;
  g=c.createRadialGradient(W/2,H*.5,0,W/2,H*.5,W*.75);g.addColorStop(0,LT?"rgba(255,214,120,.35)":"rgba(255,214,120,.28)");g.addColorStop(1,"rgba(255,214,120,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle="#ffffff";if(LT){c.save();c.shadowColor=IC_.navyA(.15);c.shadowBlur=30*u}c.beginPath();c.moveTo(0,H*.9);for(let x=0;x<=W;x+=W/8)c.quadraticCurveTo(x+W/16,H*(.87+rnd()*.03),x+W/8,H*.9);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();if(LT)c.restore();
  for(let i=0;i<90;i++){const x=rnd()*W,y=rnd()*H*.95,r=(rnd()*5+2)*u;c.globalAlpha=.25+rnd()*.55;c.fillStyle=LT&&y<H*.88?"#7fb0de":"#fff";c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}c.globalAlpha=1;
  const lh=wpLogo(c,logo,W/2,H*.5,W*.62,"rgba(255,214,120,.6)")||W*.6;
  instaFont(c,0,120*u,true);c.textAlign="center";c.save();c.shadowColor=LT?"rgba(255,255,255,.8)":"rgba(0,0,0,.55)";c.shadowBlur=20*u;c.fillStyle=LT?IC_.navy:"#fff";c.fillText("Frohe",W/2,H*.5+lh/2+130*u);c.fillStyle=IC_.acc;c.fillText("Weihnachten",W/2,H*.5+lh/2+250*u);c.restore();
  instaFont(c,800,30*u);instaSpace(c,10*u);c.fillStyle=LT?IC_.navyA(.7):IC_.t2a(.9);c.fillText("YOUNG GRIZZLYS",W/2+5*u,H*.5+lh/2+320*u);instaSpace(c,0)}

/* --- Liste und Fenster --- */
const WP_MOTIFS=[
  {k:"design",t:"Vereinsdesign",s:"Logo in vier Stilen",fn:wpDesign},
  {k:"trikot",t:"Trikot mit Nummer",s:"deine Rückennummer, ohne Namen",fn:wpTrikot},
  {k:"next",t:"Nächstes Spiel",s:"für den Sperrbildschirm",fn:wpNext,live:true},
  {k:"month",t:"Spiele des Monats",s:"die nächsten Spiele als Liste",fn:wpMonth,live:true},
  {k:"advent",t:"Advent & Weihnachten",s:"bis 6. Januar",fn:wpAdvent,season:wpAdventOn}];
const WP_STYLES=[["eis","Eishalle"],["nacht","Nacht"],["feld","Spielfeld"],["streifen","Streifen"]];
function wpDefaults(k){const T=window.MY_TEAMS||["A"],nrs=myNrAll(),t0=T.find(t=>(nrs[t]||[]).length)||T[0];
  let tone="dark";try{tone=localStorage.getItem("grizzlysWpTone")||"dark"}catch(e){}
  return {tone,logo:"color",use:"lock",style:"eis",kit:"home",team:k==="month"&&T.length>1?"":k==="trikot"?t0:(wpNextGame()||{}).team||T[0],nr:k==="trikot"?((nrs[t0]||[])[0]||""):""}}
async function wpRender(m,o,W,H){
  const cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('100px "GrizzlyBrush"'),document.fonts.ready])}catch(e){}
  await m.fn(c,W,H,o);return cv}
async function renderWallpapers(){
  const box=document.getElementById("dlWallList");if(!box)return;
  const L=WP_MOTIFS.filter(m=>!m.season||m.season());
  box.innerHTML=L.map(m=>`<button type="button" class="wpTile" data-wp="${m.k}"><span class="wpThumb"><canvas width="150" height="325" aria-hidden="true"></canvas></span><b>${m.t}</b><small>${m.s}</small></button>`).join("");
  box.querySelectorAll(".wpTile").forEach(b=>b.onclick=()=>wpOpen(b.dataset.wp));
  for(const b of box.querySelectorAll(".wpTile")){const m=WP_MOTIFS.find(x=>x.k===b.dataset.wp);try{const cv=await wpRender(m,wpDefaults(m.k),300,650),t=b.querySelector("canvas");t.width=300;t.height=650;t.getContext("2d").drawImage(cv,0,0)}catch(e){console.warn(e)}}
}
function wpClose(){const m=document.getElementById("wpModal");if(m){m.hidden=true;m.setAttribute("aria-hidden","true")}document.body.style.overflow=""}
async function wpOpen(k){
  const M=WP_MOTIFS.find(x=>x.k===k);if(!M)return;
  let m=document.getElementById("wpModal");
  if(!m){m=document.createElement("div");m.id="wpModal";m.className="matchModal wpModal";m.hidden=true;
    m.innerHTML='<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="wpTitle"><div class="matchModalHead"><div id="wpTitle" class="matchModalTitle">Hintergrundbild</div><button id="wpCloseBtn" class="matchModalClose" type="button" aria-label="Schließen">✕</button></div><div class="wpBody"><div class="wpPhone"><img id="wpImg" alt="Vorschau des Hintergrundbildes"><div class="wpClock" aria-hidden="true"><span id="wpClockD"></span><b>9:41</b></div><div id="wpWait" class="wpWait">Bild wird erstellt …</div></div><div id="wpOpts" class="wpOpts"></div><div class="wpBtns"><button id="wpShare" type="button" class="action">In Fotos sichern / Teilen</button><button id="wpSave" type="button" class="action secondary">Herunterladen</button></div><div id="wpHint" class="small wpHint"></div></div></div>';
    document.body.appendChild(m);m.querySelector("#wpCloseBtn").onclick=wpClose;m.addEventListener("click",e=>{if(e.target===m)wpClose()})}
  const o=wpDefaults(k),img=m.querySelector("#wpImg"),wait=m.querySelector("#wpWait"),opts=m.querySelector("#wpOpts"),bS=m.querySelector("#wpShare"),bD=m.querySelector("#wpSave"),hint=m.querySelector("#wpHint");
  m.querySelector("#wpTitle").textContent=M.t;m.querySelector("#wpClockD").textContent=new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
  /* 1.53.1: Auswahl übersichtlich – je Zeile Überschrift + Segment-Schalter mit Symbolen, Stile als Mini-Vorschau */
  const SI={dark:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',light:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>',
    lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',home:'<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'};
  const sv=x=>SI[x]?`<svg class="wpSi" viewBox="0 0 24 24" aria-hidden="true">${SI[x]}</svg>`:"";
  const seg=(key,label,list)=>`<div class="wpOpt"><span class="wpOptL">${label}</span><div class="wpChips wpSeg" data-key="${key}" role="radiogroup" aria-label="${label}">${list.map(([v,l,ic])=>`<button type="button" role="radio" data-v="${esc(v)}" class="${String(o[key])===String(v)?"on":""}" aria-checked="${String(o[key])===String(v)}">${ic||""}<span>${esc(l)}</span></button>`).join("")}</div></div>`;
  const chips=(key,list)=>seg(key,{tone:"Hintergrund",kit:"Trikot",team:"Mannschaft"}[key]||"",list.map(([v,l])=>[v,l,key==="tone"?sv(v):""]));
  const lg=(v)=>`<span class="wpLg ${v}"><img src="${grizzlysLogo}" alt=""></span>`;
  const T=window.MY_TEAMS||["A"];let h=chips("tone",[["dark","Dunkel"],["light","Hell"]]);
  if(k==="design")h+=`<div class="wpOpt"><span class="wpOptL">Stil</span><div class="wpChips wpStyles" data-key="style" role="radiogroup" aria-label="Stil">${WP_STYLES.map(([v,l])=>`<button type="button" role="radio" data-v="${v}" class="${o.style===v?"on":""}" aria-checked="${o.style===v}"><canvas width="90" height="160" aria-hidden="true"></canvas><span>${l}</span></button>`).join("")}</div></div>`
    +seg("logo","Logo",[["color","Farbig",lg("color")],["navy","Dunkelblau",lg("navy")]])
    +seg("use","Verwendung",[["lock","Sperrbildschirm",sv("lock")],["home","Startbildschirm",sv("home")]]);
  if(k==="trikot")h+=`<label class="wpNr"><span class="wpOptL">Rückennummer</span><input id="wpNrIn" type="text" inputmode="numeric" maxlength="2" value="${esc(o.nr)}" placeholder="z. B. 17"></label>`+chips("kit",[["home","Blau"],["away","Weiß"]]);/* 1.50.2: alle Mannschaften haben dasselbe Trikot – keine Mannschaftsauswahl */
  if(k==="next"&&T.length>1)h+=chips("team",T.map(t=>[t,teamName(t)]));
  if(k==="month"&&T.length>1)h+=chips("team",[["","Alle"],...T.map(t=>[t,teamName(t)])]);
  opts.innerHTML=h;opts.hidden=!h;
  const thumbs=async()=>{if(k!=="design")return;for(const b of opts.querySelectorAll(".wpStyles button")){try{const cv=await wpRender(M,Object.assign({},o,{style:b.dataset.v}),180,320),t=b.querySelector("canvas");t.width=180;t.height=320;t.getContext("2d").drawImage(cv,0,0)}catch(e){}}};
  let url="",file=null,seq=0;
  const draw=async()=>{const my=++seq;wait.hidden=false;bS.disabled=bD.disabled=true;
    try{const [W,H]=wpSize(),cv=await wpRender(M,o,W,H);if(my!==seq)return;const blob=await new Promise(r=>cv.toBlob(r,"image/png"));if(!blob)throw new Error("kein Bild");
      if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);img.src=url;file=new File([blob],"young-grizzlys-hintergrund-"+k+(o.style&&k==="design"?"-"+o.style:"")+(o.tone==="light"?"-hell":"")+(o.use==="home"&&k==="design"?"-start":"")+(o.logo==="navy"&&k==="design"?"-blau":"")+".png",{type:"image/png"});
      const can=!!(navigator.canShare&&navigator.canShare({files:[file]}));bS.hidden=!can;bS.disabled=false;bD.disabled=false;wait.hidden=true;
      hint.textContent=(can?"„In Fotos sichern“ wählen, dann in den Fotos: Teilen → „Als Hintergrund verwenden“. ":"Bild speichern und in den Einstellungen als Hintergrund festlegen. ")+(M.live?"Nach dem Spiel oder bei Änderungen einfach neu herunterladen.":"")}
    catch(e){console.error(e);wait.textContent="Das Bild konnte nicht erstellt werden.";}};
  opts.querySelectorAll(".wpChips").forEach(g=>g.querySelectorAll("button").forEach(b=>b.onclick=()=>{o[g.dataset.key]=b.dataset.v;g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-checked",x===b));if(g.dataset.key!=="style")thumbs();if(g.dataset.key==="tone")try{localStorage.setItem("grizzlysWpTone",b.dataset.v)}catch(e){}g.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
    if(k==="trikot"&&g.dataset.key==="team"){const n=(myNrAll()[o.team]||[])[0];if(n){o.nr=n;const i=opts.querySelector("#wpNrIn");if(i)i.value=n}}draw()}));
  const ni=opts.querySelector("#wpNrIn");if(ni)ni.oninput=()=>{ni.value=ni.value.replace(/\D/g,"").slice(0,2);o.nr=ni.value;clearTimeout(ni._t);ni._t=setTimeout(draw,350)};
  bS.onclick=async()=>{try{await navigator.share({files:[file],title:"Young Grizzlys"});trackAnalyticsEvent("wallpaper_saved",{motif:k,style:k==="design"?o.style:""})}catch(e){}};
  bD.onclick=()=>{const a=document.createElement("a");a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();try{trackAnalyticsEvent("wallpaper_saved",{motif:k,style:k==="design"?o.style:""})}catch(e){}};
  wait.textContent="Bild wird erstellt …";m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  try{trackAnalyticsEvent("wallpaper_opened",{motif:k})}catch(e){}
  draw();thumbs();
}
/* 1.49.0: Downloads in Reitern – Spielplan · Social Media · Hintergründe; Hintergrund-Vorschauen erst beim Öffnen des Reiters */
{let done=false;const run=()=>{const v=document.getElementById("downloadsView"),p=document.querySelector('[data-dlpane="wp"]');if(v&&!v.hidden&&p&&!p.hidden&&!done){done=true;renderWallpapers()}};
 const DL_KEY="grizzlysDlTab";
 function dlSet(t,save){document.querySelectorAll("[data-dltab]").forEach(b=>{const on=b.dataset.dltab===t;b.classList.toggle("on",on);b.setAttribute("aria-selected",on?"true":"false")});
   document.querySelectorAll("[data-dlpane]").forEach(p=>p.hidden=p.dataset.dlpane!==t);if(save)try{localStorage.setItem(DL_KEY,t)}catch(e){}run()}
 window.dlTabBadge=function(){const el=document.getElementById("dlTabCnt");if(!el)return;const n=window.dlInstaFresh||0;el.hidden=!n;el.textContent=String(n)};
 let saved="";try{saved=localStorage.getItem(DL_KEY)||""}catch(e){}
 const start=["plan","social","wp"].includes(saved)?saved:((window.dlInstaFresh||0)>0?"social":"plan");
 document.querySelectorAll("[data-dltab]").forEach(b=>b.onclick=()=>{dlSet(b.dataset.dltab,true);try{trackAnalyticsEvent("downloads_tab",{tab:b.dataset.dltab})}catch(e){}});
 dlSet(start,false);window.dlTabBadge();
 const v=document.getElementById("downloadsView");if(v)new MutationObserver(run).observe(v,{attributes:true,attributeFilter:["hidden"]});}

/* ===== 1.51.0: eigener Knopf „App installieren“ – nutzt den Installationsdialog des Browsers (Chrome, Samsung Internet, Edge);
   wo es den nicht gibt (iPhone, Firefox …), kurze Anleitung für genau diesen Browser. ===== */
(function(){
  const UA=navigator.userAgent, ios=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),
    samsung=/SamsungBrowser/i.test(UA), firefox=/Firefox|FxiOS/i.test(UA), edge=/EdgA?\//.test(UA), android=/Android/i.test(UA),
    iosSafari=ios&&!/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(UA), mobile=ios||android;
  const DISM="grizzlysInstHide";
  const standalone=()=>window.matchMedia("(display-mode: standalone)").matches||window.matchMedia("(display-mode: fullscreen)").matches||navigator.standalone===true;
  function steps(){
    if(ios&&!iosSafari)return ["Auf dem iPhone geht das nur in <b>Safari</b>.","Diese Seite in Safari öffnen (Link kopieren und einfügen).","Dann unten auf <b>Teilen</b> <span class='instK'>⬆︎</span> tippen.","<b>„Zum Home-Bildschirm“</b> wählen und „Hinzufügen“."];
    if(ios)return ["Unten in der Leiste auf <b>Teilen</b> <span class='instK'>⬆︎</span> tippen.","Etwas nach unten wischen und <b>„Zum Home-Bildschirm“</b> wählen.","Oben rechts auf <b>„Hinzufügen“</b> tippen."];
    if(samsung)return ["Unten rechts auf das <b>Menü</b> <span class='instK'>☰</span> tippen.","<b>„Seite hinzufügen zu“</b> wählen.","<b>„Startbildschirm“</b> antippen und bestätigen.","Tipp: Im Geheimmodus geht das nicht."];
    if(firefox)return ["Oben rechts auf das <b>Menü</b> <span class='instK'>⋮</span> tippen.","<b>„Installieren“</b> bzw. „Zum Startbildschirm hinzufügen“ wählen.","Bestätigen."];
    if(android)return ["Oben rechts auf das <b>Menü</b> <span class='instK'>⋮</span> tippen.","<b>„App installieren“</b> bzw. „Zum Startbildschirm hinzufügen“ wählen.","Bestätigen."];
    return ["In der Adressleiste rechts auf das <b>Installieren-Symbol</b> klicken – oder im Browser-Menü <b>„App installieren“</b> wählen.","Auf dem Handy geht es am einfachsten: Seite öffnen und hier auf „App installieren“ tippen."];
  }
  function guide(){
    let m=document.getElementById("instModal");
    if(!m){m=document.createElement("div");m.id="instModal";m.className="matchModal";m.hidden=true;
      m.innerHTML='<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="instTitle"><div class="matchModalHead"><div id="instTitle" class="matchModalTitle">App installieren</div><button class="matchModalClose" type="button" aria-label="Schließen">✕</button></div><div class="instGuide"><img src="icon-192.png" alt="" width="64" height="64"><ol id="instSteps"></ol><div class="small">Danach findest du „Grizzlys“ auf dem Startbildschirm.</div></div></div>';
      document.body.appendChild(m);const close=()=>{m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow=""};
      m.querySelector(".matchModalClose").onclick=close;m.addEventListener("click",e=>{if(e.target===m)close()})}
    m.querySelector("#instSteps").innerHTML=steps().map(t=>"<li>"+t+"</li>").join("");
    m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  }
  async function install(){
    const p=window.__bip;
    try{trackAnalyticsEvent("install_click",{native:p?1:0,browser:samsung?"samsung":firefox?"firefox":ios?"ios":edge?"edge":"chrome"})}catch(e){}
    if(!p){guide();return}
    try{p.prompt();const r=await p.userChoice;window.__bip=null;try{trackAnalyticsEvent("install_result",{outcome:r&&r.outcome||""})}catch(e){}}catch(e){guide()}
    refresh();
  }
  function refresh(){
    const inst=standalone(), home=document.getElementById("instHome"), card=document.getElementById("instCard"), btn=document.getElementById("instCardBtn"), txt=document.getElementById("instCardTxt");
    let hid=0;try{hid=Number(localStorage.getItem(DISM))||0}catch(e){}
    if(home)home.hidden=inst||Date.now()<hid||!(window.__bip||mobile);
    const stt=document.getElementById("instState");if(stt)stt.hidden=!inst;
    if(card){if(inst){if(btn)btn.hidden=true;if(txt)txt.innerHTML="Die App ist auf diesem Gerät installiert ✓<br>Du findest „Grizzlys“ auf dem Startbildschirm. Für ein anderes Gerät: unter Info „App teilen“ oder „QR-Code zeigen“."}else{if(btn)btn.hidden=false}}
  }
  document.querySelectorAll("[data-inst]").forEach(b=>b.addEventListener("click",install));
  document.getElementById("instHomeX")?.addEventListener("click",()=>{try{localStorage.setItem(DISM,String(Date.now()+30*864e5))}catch(e){}refresh()});
  window.addEventListener("grizzlysInstallReady",refresh);
  window.addEventListener("appinstalled",()=>{window.__bip=null;try{trackAnalyticsEvent("app_installed",{})}catch(e){}refresh()});
  refresh();
})();


/* ===== 1.52.0: Einstellungen als gegliederte Liste – je Zeile der aktuelle Wert; Antippen öffnet die bisherige Karte als Fenster von unten.
   Die Karten bleiben dieselben (nur verschoben), alle Schalter und Knöpfe funktionieren unverändert. ===== */
(function(){
  const IC={
    teams:['#1f6fb8','<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 11a3 3 0 1 0 0-6M21 20c0-2-1.5-4-4-4.6"/>'],
    nr:['#0b2a52','<path d="M8 3l-4 3 2 4 2-1v12h8V9l2 1 2-4-4-3c-1 2-2.5 3-4 3S9 5 8 3z"/>'],
    push:['#ff8a00','<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'],
    theme:['#4a5d75','<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/>'],
    season:['#8b5cf6','<path d="M12 2v20M4 6l16 12M20 6L4 18"/>'],
    install:['#16a34a','<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 8v6M9 11l3 3 3-3"/>'],
    privacy:['#64748b','<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'],
    feedback:['#d6453b','<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>']};
  const GROUPS=[["Für mich",["teams","nr","push"]],["Aussehen",["theme","season"]],["App",["install","privacy"]],["Mitmachen",["feedback"]]];
  const TITLE={teams:"Meine Mannschaften",nr:"Meine Rückennummer",push:"Push-Nachrichten",theme:"Darstellung",season:"Saison-Designs",install:"App installieren",privacy:"Datenschutz",feedback:"Feedback & Wunschliste"};
  const standalone=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  let built=false,cards={},open=null;
  function find(view){const kids=[...view.children];const by=f=>kids.find(f);
    return {teams:by(c=>c.id==="myTeamsCard"),nr:by(c=>c.id==="myNrCard"),push:by(c=>c.id==="pushCard"),
      theme:by(c=>c.classList.contains("infoCard")&&c.querySelector("#themeSeg")),season:by(c=>c.classList.contains("seasonCard")),
      install:by(c=>c.id==="instCard"),privacy:by(c=>c.classList.contains("privacyCard")),feedback:by(c=>c.classList.contains("fbCard"))}}
  function value(k){try{
    if(k==="teams"){const T=window.MY_TEAMS||[];return T.length?T.map(teamName).join(", "):"alle"}
    if(k==="nr"){const o=myNrAll(),L=Object.keys(o).filter(t=>(o[t]||[]).length);if(!L.length)return "–";const all=[...new Set(L.flatMap(t=>o[t]))];return all.slice(0,3).join(", ")+(all.length>3?" …":"")}
    if(k==="push"){const st=(cards.push&&cards.push.dataset.state)||"off";return {on:["Aktiv","ok"],off:["Aus","off"],blocked:["Blockiert","off"],unsupported:["Nicht möglich",""]}[st]||["Aus","off"]}
    if(k==="theme"){const m=window.themeMode?window.themeMode():"light";return {light:"Hell",dark:"Dunkel",auto:"Automatisch"}[m]||"Hell"}
    if(k==="season"){const xc=document.getElementById("xmSwitchCard"),hc=document.getElementById("hwSwitchCard");
      if(xc&&!xc.hidden)return "Weihnachten "+(document.getElementById("xmToggle")?.checked?"an":"aus");
      if(hc&&!hc.hidden)return "Halloween "+(document.getElementById("hwToggle")?.checked?"an":"aus");return null}
    if(k==="install")return standalone()?["installiert ✓","ok"]:["nicht installiert",""];
    if(k==="privacy"){let c="";try{c=localStorage.getItem("grizzlysConsent")||""}catch(e){}return c==="granted"?"Statistik erlaubt":"Statistik aus"}
    return "";
  }catch(e){return ""}}
  function render(){
    const list=document.getElementById("stList");if(!list)return;
    let h="";const st=(cards.push&&cards.push.dataset.state)||"off";
    if(cards.push&&st==="off")h+=`<button type="button" class="stAlert" data-st="push"><i>🔔</i><span><b>Push ist aus</b><small>Ergebnisse und Erinnerungen verpassen</small></span><em>Einschalten</em></button>`;
    GROUPS.forEach(([g,keys])=>{const rows=keys.filter(k=>cards[k]).map(k=>{let v=value(k);if(v===null)return "";const [txt,cls]=Array.isArray(v)?v:[v,""];
      return `<button type="button" class="stRow" data-st="${k}"><span class="stIc" style="background:${IC[k][0]}"><svg viewBox="0 0 24 24" aria-hidden="true">${IC[k][1]}</svg></span><span class="stT">${TITLE[k]}</span><span class="stV ${cls}">${esc(txt)}</span><span class="stChev" aria-hidden="true">›</span></button>`}).join("");
      if(rows)h+=`<div class="stGT">${g}</div><div class="stGrp">${rows}</div>`});
    list.innerHTML=h;
    list.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>openSheet(b.dataset.st));
  }
  function openSheet(k){
    const c=cards[k];if(!c)return;const w=document.getElementById("stSheetWrap"),body=document.getElementById("stBody");
    if(open)closeSheet(true);
    open=k;c.classList.add("open");body.appendChild(c);document.getElementById("stTitle").textContent=TITLE[k];
    w.hidden=false;document.body.style.overflow="hidden";body.scrollTop=0;
    try{trackAnalyticsEvent("settings_open",{item:k})}catch(e){}
  }
  function closeSheet(silent){
    const w=document.getElementById("stSheetWrap"),store=document.getElementById("stStore");
    if(open&&cards[open])store.appendChild(cards[open]);open=null;
    if(!silent){w.hidden=true;document.body.style.overflow="";render()}
  }
  function build(){
    if(built)return;const view=document.getElementById("settingsView");if(!view)return;
    const f=find(view);if(!f.teams||!f.push||!f.theme)return; /* noch nicht alles da */
    built=true;cards=f;
    const head=view.querySelector(".settingsHead"),admin=view.querySelector(".adminLinkRow");
    const list=document.createElement("div");list.id="stList";list.className="stList";
    const store=document.createElement("div");store.id="stStore";store.hidden=true;
    const wrap=document.createElement("div");wrap.id="stSheetWrap";wrap.className="stSheetWrap";wrap.hidden=true;
    wrap.innerHTML='<div class="stSheet" role="dialog" aria-modal="true" aria-labelledby="stTitle"><div class="stGrab" aria-hidden="true"></div><div class="stHead"><b id="stTitle"></b><button type="button" class="matchModalClose" aria-label="Schließen">✕</button></div><div id="stBody" class="stBody"></div><button type="button" class="stDone">Fertig</button></div>';
    (head?head.after(list):view.prepend(list));list.after(store);
    Object.values(cards).forEach(c=>{if(c)store.appendChild(c)});
    if(admin)view.appendChild(admin);view.appendChild(wrap);
    view.classList.add("stOn");
    wrap.querySelector(".matchModalClose").onclick=()=>closeSheet();wrap.querySelector(".stDone").onclick=()=>closeSheet();
    wrap.addEventListener("click",e=>{if(e.target===wrap)closeSheet()});
    /* nach unten wischen schließt */
    {const sh=wrap.querySelector(".stSheet");let y0=null,dy=0;
     sh.addEventListener("touchstart",e=>{const b=document.getElementById("stBody");if(b.scrollTop>0&&!e.target.closest(".stGrab,.stHead"))return;y0=e.touches[0].clientY;dy=0},{passive:true});
     sh.addEventListener("touchmove",e=>{if(y0===null)return;dy=e.touches[0].clientY-y0;if(dy>0)sh.style.transform=`translateY(${dy}px)`},{passive:true});
     sh.addEventListener("touchend",()=>{if(y0===null)return;sh.style.transform="";if(dy>110)closeSheet();y0=null})}
    /* Werte aktuell halten */
    new MutationObserver(()=>{if(!open)render()}).observe(cards.push,{attributes:true,attributeFilter:["data-state"]});
    ["grizzlysPushChanged","grizzlysInstallReady","appinstalled","storage"].forEach(ev=>window.addEventListener(ev,()=>{if(!open)render()}));
    render();
  }
  window.settingsListRefresh=()=>{if(built&&!open)render()};
  const tryBuild=()=>{build();if(!built)setTimeout(tryBuild,300)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(tryBuild,50));else setTimeout(tryBuild,50);
  {const v=document.getElementById("settingsView");if(v)new MutationObserver(()=>{if(!v.hidden){build();window.settingsListRefresh()}}).observe(v,{attributes:true,attributeFilter:["hidden"]});}
})();


/* ===== 1.54.0: neues Trikot-Design – Vorschau-Schalter (Admin › Technik). Stufe 1: Farben, Kopfbereich mit Streifen, Navigation unten. ===== */
(function(){const seg=document.getElementById("d27Seg");if(!seg)return;
  const get=()=>{try{const v=localStorage.getItem("grizzlysD27");return v==="on"||v==="e"||v==="v"?"v":"off"}catch(e){return "off"}};
  const paint=v=>seg.querySelectorAll("[data-d27]").forEach(b=>{const on=b.dataset.d27===v;b.classList.toggle("on",on);b.setAttribute("aria-checked",on)});
  paint(get());
  seg.querySelectorAll("[data-d27]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.d27;try{localStorage.setItem("grizzlysD27",v)}catch(e){}
    const H=document.documentElement,on=v!=="off";H.classList.toggle("dv",on);
    if(on)H.classList.remove("xm","hw");else{try{if(window.xmActive&&window.xmActive())H.classList.add("xm");if(window.hwActive&&window.hwActive())H.classList.add("hw")}catch(e){}}
    paint(v);try{window.dispatchEvent(new Event("resize"))}catch(e){}
    try{trackAnalyticsEvent("design27_toggle",{on:on?1:0,variant:v})}catch(e){}}));
})();

/* ===== 1.57.0: Trikot-Design – Saisonbilanz als eigener Bereich in der Navigation (statt Regeln; Regeln in der Info) ===== */
function renderStats(keep){
  const bar=document.getElementById("statsTeams"), body=document.getElementById("statsBody"); if(!bar||!body)return;
  const teams=(window.MY_TEAMS||[]).slice(); if(!teams.length)return;
  let t=""; try{t=localStorage.getItem("grizzlysStatsTeam")||""}catch(e){}
  if(!teams.includes(t))t=teams[0];
  bar.hidden=teams.length<2;
  bar.innerHTML=teams.map(x=>`<button type="button" role="tab" class="team${x}${x===t?" active":""}" aria-selected="${x===t}" data-st="${x}">${esc(teamName(x))}</button>`).join("");
  bar.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{try{localStorage.setItem("grizzlysStatsTeam",b.dataset.st)}catch(e){}sbTabLast="ov";renderStats()});
  if(body.dataset.team!==t&&!keep)sbTabLast=sbTabLast||"ov";
  body.innerHTML=bilanzHtml(t); body.dataset.team=t;
  const S=seasonStats(t);const sub=document.getElementById("statsSub"); if(sub){sub.textContent=S.tot.gp?S.tot.gp+" Spiele gewertet":"noch keine Ergebnisse"}
  body.querySelectorAll("[data-rep]").forEach(b=>b.onclick=()=>{const x=S.reports[Number(b.dataset.rep)];openMatchDetails(x.g,true)});
  body.querySelector("[data-print]")?.addEventListener("click",()=>printReports(t));
  body.querySelector("[data-tabimg]")?.addEventListener("click",()=>instaOpen({team:t},"table",true));
  try{sbBindTabs(body)}catch(e){console.warn(e)}
  if(!keep)try{trackAnalyticsEvent("saisonbilanz_opened",{team:teamName(t),src:"nav"})}catch(e){}
}
document.querySelector(".inRules")?.addEventListener("click",()=>showView("rules"));

/* ===== 1.62.0: neue Designs – Startseite: „Mannschaften“ und „Saisonbilanz“ zusammengefasst, eine Zeile je Mannschaft ===== */
function renderHomeTeams27(){
  const home=document.getElementById("homeView"); if(!home)return;
  let box=document.getElementById("homeTeams27");
  if(!box){box=document.createElement("div");box.id="homeTeams27";box.className="ht27";const sb=home.querySelector(".sbCard,.sbBtns");(sb||home.lastElementChild).insertAdjacentElement("afterend",box);
    const tc=home.querySelector(".teamCards"),st=tc&&tc.previousElementSibling;if(st&&st.classList.contains("sectionTitle"))st.classList.add("teamsTitle");}
  const T=window.MY_TEAMS||[]; if(!T.length){box.hidden=true;return} box.hidden=false;
  const form=f=>f.map(o=>`<i class="fd ${o}"></i>`).join("");
  box.innerHTML=`<div class="ht27Head"><b>Mannschaften</b><span>Antippen für die Saisonbilanz</span></div>`+T.map(t=>{
    const x=sbData[t]||{w:0,d:0,l:0,gf:0,ga:0,n:0,form:[],played:0,total:0,rank:0}, df=x.gf-x.ga, pct=x.total?Math.round(x.played/x.total*100):0;
    const lg=APP_CFG.teams[t]&&APP_CFG.teams[t].league||"";
    const letter=(APP_CFG.teams[t]&&APP_CFG.teams[t].letter)||t;
    return `<button type="button" class="ht27Row team${t}" data-ht="${t}" aria-label="Saisonbilanz ${esc(teamName(t))}">
      <span class="ht27L">${esc(letter)}</span>
      <span class="ht27Mid"><b>${esc(teamName(t))}${x.rank?`<em>Platz ${x.rank}</em>`:""}</b><small>${esc(lg)}${x.total?` · ${x.played}/${x.total} gespielt`:""}</small>${x.form&&x.form.length?`<span class="ht27Form">${form(x.form)}</span>`:""}</span>
      ${x.n?`<span class="ht27R"><b><span class="w">${x.w}</span>–<span class="l">${x.l}</span></b><small>${x.gf}:${x.ga} · <span class="${df>0?"w":df<0?"l":""}">${df>0?"+":""}${df}</span></small></span>`:`<span class="ht27R"><small>noch keine<br>Ergebnisse</small></span>`}
      <i class="ht27Bar"><i style="width:${pct}%"></i></i>
    </button>`}).join("");
  box.querySelectorAll("[data-ht]").forEach(b=>b.onclick=()=>{if(document.documentElement.classList.contains("dv")){try{localStorage.setItem("grizzlysStatsTeam",b.dataset.ht)}catch(e){}showView("stats");window.scrollTo(0,0)}else openBilanz(b.dataset.ht)});
}

/* ===== 1.70.0: Helferdienste ===== 
   Je Heimspiel eine Helferliste aus einer gemeinsamen Vorlage. Sie erscheint automatisch 5 Tage vor dem Spiel
   (Hinweis in der Spielkarte und auf der Startseite) und ist über einen Link auch ohne App erreichbar (#helfer/<Spiel-ID>).
   Eintragen: frei wählbarer Name; jeder löscht nur seinen eigenen Eintrag (anonyme Firebase-Anmeldung), der Admin alle.
   Namen werden 3 Tage nach dem Spiel automatisch gelöscht (Cloud Function helperCleanup). */
function hpGid(g){return g._baseId||(g.date+"_"+String(g.time).replace(/:/g,"")+"_"+g.team)}
function hpTemplate(){const t=HP_CFG.template&&Array.isArray(HP_CFG.template.items)&&HP_CFG.template.items.length?HP_CFG.template.items:HP_DEFAULT;return t}
function hpItems(gid){const hide=((HP_CFG.games||{}).hide||{})[gid]||[];return hpTemplate().filter(x=>!hide.includes(x.id))}
function hpFlag(){try{return localStorage.getItem("grizzlysHelfer")==="on"}catch(e){return false}}
function hpOn(){return (!!window.GRIZZLYS_TEST&&hpFlag())||!!(HP_CFG.games&&HP_CFG.games.live===true)}
function hpEligible(g){if(!g||!isHome(g)||g.cancelled)return false;if(((HP_CFG.games||{}).off||{})[hpGid(g)])return false;const t=dt(g)-Date.now();return t<=HP_DAYS*864e5&&t>=-3*36e5}
function hpStat(gid){const items=hpItems(gid),E=HP_ENTRIES[gid]||[];let need=0,have=0;items.forEach(x=>{const n=Math.max(1,Number(x.n)||1),k=E.filter(e=>e.item===x.id).length;need+=n;have+=Math.min(n,k)});return {need,have,open:need-have}}
function hpBadge(g){if(!hpOn()||!hpEligible(g))return "";const s=hpStat(hpGid(g));return `<span class="hpBadge${s.open?"":" full"}" data-hpb="${esc(hpGid(g))}" data-hp="${esc(hpGid(g))}" role="button" tabindex="0">${s.open?"Helfer gesucht":"Helfer komplett"}</span>`}
function hpTile(g){if(!hpOn()||!hpEligible(g))return "";const gid=hpGid(g),s=hpStat(gid),pct=s.need?Math.round(s.have/s.need*100):0;
  return `<button type="button" class="g3Tile hpTile" data-hp="${esc(gid)}"><span class="hpTxt"><b>Helferdienste</b><small data-hpc="${esc(gid)}">${HP_LOADED?(s.open?`${s.open} von ${s.need} noch offen`:"alles besetzt – danke!"):"wird geladen …"}</small></span><i class="hpBar"><i style="width:${pct}%" data-hpbar="${esc(gid)}"></i></i><span class="hpGo">Eintragen ›</span></button>`}
function hpPaint(){document.querySelectorAll("[data-hpc]").forEach(el=>{const s=hpStat(el.dataset.hpc);el.textContent=s.open?`${s.open} von ${s.need} noch offen`:"alles besetzt – danke!"});
  document.querySelectorAll("[data-hpbar]").forEach(el=>{const s=hpStat(el.dataset.hpbar);el.style.width=(s.need?Math.round(s.have/s.need*100):0)+"%"});
  document.querySelectorAll("[data-hpb]").forEach(el=>{const s=hpStat(el.dataset.hpb);el.classList.toggle("full",!s.open);el.textContent=s.open?"Helfer gesucht":"Helfer komplett"})}
function hpIso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
async function hpRefresh(){if(!window.hpRange)return;try{const now=new Date(),from=hpIso(new Date(now-864e5)),to=hpIso(new Date(+now+(HP_DAYS+1)*864e5));const L=await window.hpRange(from,to);HP_ENTRIES={};L.forEach(e=>(HP_ENTRIES[e.gid]=HP_ENTRIES[e.gid]||[]).push(e));HP_LOADED=true;hpPaint()}catch(e){console.warn("Helfer laden",e);HP_LOADED=true;hpPaint()}}
async function hpInit(){
  for(let k=0;k<40&&!window.hpCfgLoad;k++)await new Promise(r=>setTimeout(r,250));
  if(!window.hpCfgLoad)return;
  HP_CFG=await window.hpCfgLoad();
  if(hpOn()){try{renderNext();renderList()}catch(e){}await hpRefresh();setInterval(hpRefresh,5*60*1000)}
  hpRoute();
}
function hpName(){try{return localStorage.getItem("grizzlysHelferName")||""}catch(e){return ""}}
function hpSetName(v){try{localStorage.setItem("grizzlysHelferName",v)}catch(e){}}
function hpLink(gid){return location.origin+location.pathname.replace(/index\.html$/,"")+"#helfer/"+encodeURIComponent(gid)}
function hpShareText(g,gid,E){const items=hpItems(gid);const open=items.map(x=>{const n=Math.max(1,Number(x.n)||1),k=(E||[]).filter(e=>e.item===x.id).length;return n>k?(n-k>1||n>1?`${x.t} (${n-k})`:x.t):""}).filter(Boolean);
  const d=dt(g),day=d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
  return `🏒 Helfer gesucht – Heimspiel ${teamName(g.team)}\n${day} · ${g.time} · ${shortTeam(g.home)} – ${shortTeam(g.away)}\n\n`+(open.length?`Noch offen: ${open.join(", ")}`:"Alle Dienste sind besetzt – danke! 💙")+`\n\n👉 Eintragen: ${hpLink(gid)}`}
var hpUnsub=null;
function hpClose(){const m=document.getElementById("hpModal");if(m){m.hidden=true;m.setAttribute("aria-hidden","true")}if(hpUnsub){try{hpUnsub()}catch(e){}hpUnsub=null}document.body.style.overflow="";/* 1.70.6: Link-Anker erst entfernen, nachdem die Zurück-Logik ihren Verlaufseintrag aufgeräumt hat – sonst öffnete der Rücksprung die Liste sofort wieder */setTimeout(()=>{const mm=document.getElementById("hpModal");if(location.hash.startsWith("#helfer/")&&(!mm||mm.hidden)){try{history.replaceState(history.state,"",location.pathname+location.search)}catch(e){}}},400);hpRefresh()}
function hpOpen(gid){
  const g=(window.ALL_GAMES||games).find(x=>hpGid(x)===gid)||games.find(x=>hpGid(x)===gid);
  let m=document.getElementById("hpModal");
  if(!m){m=document.createElement("div");m.id="hpModal";m.className="matchModal hpModal";m.hidden=true;m.setAttribute("aria-hidden","true");
    m.innerHTML=`<div class="matchModalBox" role="dialog" aria-modal="true" aria-labelledby="hpTitle"><div class="matchModalHead"><div id="hpTitle" class="matchModalTitle">Helferdienste</div><button class="matchModalClose" type="button" aria-label="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div><div class="matchModalContent hpBody"></div></div>`;
    document.body.appendChild(m);m.querySelector(".matchModalClose").onclick=hpClose;m.addEventListener("click",e=>{if(e.target===m)hpClose()})}
  const body=m.querySelector(".hpBody");
  if(!g){body.innerHTML=`<p class="hpEmpty">Dieses Spiel wurde nicht gefunden. Vielleicht wurde es abgesagt oder der Link ist veraltet.</p>`}
  m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  if(!g)return;
  let E=HP_ENTRIES[gid]||[], busy=false, err="";
  const draw=()=>{
    const items=hpItems(gid), uid=window.hpUid&&window.hpUid(), adm=window.hpIsAdmin&&window.hpIsAdmin(), s=(()=>{HP_ENTRIES[gid]=E;return hpStat(gid)})();
    const d=dt(g),day=d.toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"long"});
    const row=x=>{const n=Math.max(1,Number(x.n)||1),mine=E.filter(e=>e.item===x.id),free=n-mine.length;
      return `<div class="hpRow"><div class="hpRowT"><b>${esc(x.t)}</b>${x.d||n>1?`<small>${x.d?esc(x.d):""}${x.d&&n>1?" · ":""}${n>1?`${Math.min(n,mine.length)} von ${n}`:""}</small>`:""}</div><div class="hpWho">`+
        mine.map(e=>{const own=uid&&e.uid===uid,can=own||adm;return `<span class="hpName${own?" own":""}">${esc(e.name)}${can?`<button type="button" class="hpX" data-del="${esc(e.id)}" aria-label="${esc(e.name)} austragen">✕</button>`:""}</span>`}).join("")+
        (free>0?`<button type="button" class="hpTake" data-take="${esc(x.id)}">${x.s==="v"?"Ich bring's":"Ich mach's"}</button>`:"")+`</div></div>`};
    const secs=Object.keys(HP_SECT).map(k=>{const L=items.filter(x=>(x.s||"g")===k);return L.length?`<div class="hpSec">${HP_SECT[k]}</div>`+L.map(row).join(""):""}).join("");
    body.innerHTML=`<div class="hpHead"><div class="hpKick">Helfer gesucht · ${esc(teamName(g.team))}</div><div class="hpGame">${esc(shortTeam(g.home))} – ${esc(shortTeam(g.away))}</div>
      <div class="hpMeta">${esc(day)} · ${esc(g.time)} Uhr · ${esc(g.stadium)}</div><div class="hpProg"><i style="width:${s.need?Math.round(s.have/s.need*100):0}%"></i></div><div class="hpMeta">${s.open?`${s.open} von ${s.need} Plätzen noch offen`:"Alle Plätze besetzt – danke! 💙"}</div></div>
      <label class="hpNameBox"><span>Dein Name</span><input type="text" maxlength="40" autocomplete="given-name" placeholder="z. B. Sandra oder Familie Meier" value="${esc(hpName())}"></label>
      ${err?`<div class="hpErr">${esc(err)}</div>`:""}${secs}
      <div class="hpActs"><button type="button" class="hpShare"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"/></svg>In WhatsApp teilen</button><button type="button" class="hpCopy">Link kopieren</button><button type="button" class="hpPrint">Aushang drucken</button></div>
      <p class="hpNote">Namen werden 3 Tage nach dem Spiel automatisch gelöscht. Austragen kannst du dich nur auf dem Gerät, mit dem du dich eingetragen hast. Hast du Push-Nachrichten eingeschaltet, erinnert dich die App am Vortag um 18 Uhr an deinen Dienst.</p>`;
    const inp=body.querySelector(".hpNameBox input");inp.addEventListener("change",()=>hpSetName(inp.value.trim()));
    body.querySelectorAll("[data-take]").forEach(b=>b.onclick=async()=>{if(busy)return;const name=inp.value.trim();if(name.length<2){err="Bitte trag zuerst deinen Namen ein.";draw();body.querySelector(".hpNameBox input").focus();return}
      hpSetName(name);busy=true;b.disabled=true;err="";try{await window.hpAdd(g,gid,b.dataset.take,name,(items.find(x=>x.id===b.dataset.take)||{}).t||"");try{trackAnalyticsEvent("helper_signup",{team:teamName(g.team)})}catch(e){}}catch(e){console.warn(e);err=/operation-not-allowed|admin-restricted/.test(String(e&&e.code||e))?"Eintragen ist gerade nicht möglich (Anmeldung bei Firebase noch nicht eingerichtet).":/permission/i.test(String(e&&e.code||e))?"Eintragen ist gerade nicht möglich (keine Berechtigung).":"Das hat nicht geklappt. Bitte Internetverbindung prüfen."}busy=false;draw()});
    body.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{if(busy)return;const e0=E.find(e=>e.id===b.dataset.del);if(!confirm(`„${e0?e0.name:""}“ austragen?`))return;busy=true;try{await window.hpDel(b.dataset.del)}catch(e){console.warn(e);err="Austragen hat nicht geklappt."}busy=false;draw()});
    body.querySelector(".hpShare").onclick=()=>{const t=hpShareText(g,gid,E);try{trackAnalyticsEvent("helper_share",{team:teamName(g.team)})}catch(e){}window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank")};
    body.querySelector(".hpPrint").onclick=()=>hpPrint(g,gid,E);
    body.querySelector(".hpCopy").onclick=async e=>{try{await navigator.clipboard.writeText(hpLink(gid));e.target.textContent="Kopiert ✓"}catch(x){prompt("Link zum Kopieren:",hpLink(gid))}};
  };
  draw();
  if(hpUnsub){try{hpUnsub()}catch(e){}}
  if(window.hpWatch)hpUnsub=window.hpWatch(gid,(L,e)=>{if(L){E=L;draw()}});
}
function hpRoute(){const h=location.hash;if(!h.startsWith("#helfer/"))return;const m=document.getElementById("hpModal");if(m&&!m.hidden)return;const gid=decodeURIComponent(h.slice(8));hpOpen(gid)}
window.addEventListener("hashchange",hpRoute);
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-hp]");if(!b)return;e.stopPropagation();e.preventDefault();hpOpen(b.dataset.hp)},true);
/* Admin: Vorschau-Schalter, Vorlage bearbeiten, Listen je Spiel ein/aus */
function hpAdminBox(){const box=document.getElementById("hpAdmBox");if(!box)return;const sum=document.getElementById("hpAdmSum");if(sum)sum.textContent=hpFlag()?"an":"aus";
  const sw=document.getElementById("hpToggle");if(sw){sw.checked=hpFlag();sw.onchange=()=>{try{localStorage.setItem("grizzlysHelfer",sw.checked?"on":"off")}catch(e){}try{renderNext();renderList()}catch(e){}if(sw.checked)hpRefresh();hpAdminBox()}}
  const list=document.getElementById("hpAdmGames");if(!list)return;
  const now=Date.now(),up=games.filter(g=>isHome(g)&&!g.cancelled&&dt(g)>now-3*36e5).sort((a,b)=>dt(a)-dt(b)).slice(0,8),off=((HP_CFG.games||{}).off)||{};
  list.innerHTML=up.map(g=>{const gid=hpGid(g),d=dt(g),on=!off[gid],vis=dt(g)-now<=HP_DAYS*864e5;return `<div class="hpAdmRow"><div><b>${d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})} · ${esc(teamName(g.team))}</b><small>${esc(shortTeam(opponent(g)))}${vis?" · sichtbar":" · ab "+new Date(+d-HP_DAYS*864e5).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" sichtbar"}</small></div><label class="hpAdmSw"><input type="checkbox" data-hpoff="${esc(gid)}" ${on?"checked":""}> Liste</label><button type="button" class="hpAdmOpen" data-hp="${esc(gid)}">Öffnen</button></div>`}).join("")||"<p class=\"small\">Keine kommenden Heimspiele.</p>";
  list.querySelectorAll("[data-hpoff]").forEach(c=>c.onchange=async()=>{const G=Object.assign({off:{},hide:{}},HP_CFG.games||{});G.off=Object.assign({},G.off);if(c.checked)delete G.off[c.dataset.hpoff];else G.off[c.dataset.hpoff]=true;try{await window.hpCfgSave("games",G);HP_CFG.games=G;try{renderNext();renderList()}catch(e){}}catch(e){alert("Speichern nicht möglich: "+(e.message||e));c.checked=!c.checked}});
  const ed=document.getElementById("hpTplEdit");if(ed)ed.onclick=hpTplEditor;
}
function hpTplEditor(){
  let L=hpTemplate().map(x=>Object.assign({},x));
  let m=document.getElementById("hpTplModal");
  if(!m){m=document.createElement("div");m.id="hpTplModal";m.className="matchModal hpModal";m.innerHTML=`<div class="matchModalBox" role="dialog" aria-modal="true"><div class="matchModalHead"><div class="matchModalTitle">Vorlage Helferdienste</div><button class="matchModalClose" type="button" aria-label="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div><div class="matchModalContent hpTplBody"></div></div>`;document.body.appendChild(m);m.querySelector(".matchModalClose").onclick=()=>{m.hidden=true}}
  const body=m.querySelector(".hpTplBody");
  const draw=()=>{body.innerHTML=`<p class="small">Gilt für alle Mannschaften. Anzahl = wie viele Personen sich eintragen können.</p>`+L.map((x,i)=>`<div class="hpTplRow" data-i="${i}"><select data-k="s"><option value="g"${x.s!=="v"?" selected":""}>Spiel</option><option value="v"${x.s==="v"?" selected":""}>Verpflegung</option></select><input data-k="t" value="${esc(x.t)}" maxlength="60" placeholder="Dienst"><input data-k="d" value="${esc(x.d||"")}" maxlength="80" placeholder="Hinweis (optional)"><input data-k="n" type="number" min="1" max="9" value="${Number(x.n)||1}"><button type="button" data-rm="${i}" aria-label="Entfernen">✕</button></div>`).join("")+
    `<div class="hpActs"><button type="button" class="hpAdd">+ Dienst</button><button type="button" class="hpSave">Speichern</button><button type="button" class="hpReset">Standard</button></div><div class="small hpTplMsg"></div>`;
    body.querySelectorAll(".hpTplRow").forEach(r=>{const i=Number(r.dataset.i);r.querySelectorAll("[data-k]").forEach(f=>f.oninput=()=>{const k=f.dataset.k;L[i][k]=k==="n"?Math.max(1,Math.min(9,Number(f.value)||1)):f.value})});
    body.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{L.splice(Number(b.dataset.rm),1);draw()});
    body.querySelector(".hpAdd").onclick=()=>{L.push({id:"d"+Date.now().toString(36),s:"g",t:"",n:1});draw()};
    body.querySelector(".hpReset").onclick=()=>{if(confirm("Vorlage auf den Standard zurücksetzen?")){L=HP_DEFAULT.map(x=>Object.assign({},x));draw()}};
    body.querySelector(".hpSave").onclick=async()=>{const items=L.filter(x=>String(x.t).trim()).map(x=>({id:x.id,s:x.s==="v"?"v":"g",t:String(x.t).trim(),d:String(x.d||"").trim(),n:Math.max(1,Math.min(9,Number(x.n)||1))}));const msg=body.querySelector(".hpTplMsg");try{await window.hpCfgSave("template",{items});HP_CFG.template={items};msg.textContent="Gespeichert ✓";try{renderNext();renderList()}catch(e){}}catch(e){msg.textContent="Speichern nicht möglich: "+(e.message||e)}};
  };
  draw();m.hidden=false;
}
hpInit();
setTimeout(hpAdminBox,1500);document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest('[data-adm-tab]'))setTimeout(hpAdminBox,50)});

/* 1.71.0: Aushang zum Ausdrucken (A4, schwarz-weiß): alle Dienste mit eingetragenen Namen und freien Linien */
function hpPrint(g,gid,E){
  const items=hpItems(gid),d=dt(g),day=d.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const row=x=>{const n=Math.max(1,Number(x.n)||1),names=(E||[]).filter(e=>e.item===x.id).map(e=>e.name);let cells="";for(let i=0;i<n;i++)cells+=`<span class="slot">${names[i]?esc(names[i]):"&nbsp;"}</span>`;
    return `<tr><td class="t"><b>${esc(x.t)}</b>${x.d?`<br><small>${esc(x.d)}</small>`:""}</td><td class="n">${cells}</td></tr>`};
  const sec=k=>{const L=items.filter(x=>(x.s||"g")===k);return L.length?`<h2>${HP_SECT[k]}</h2><table>${L.map(row).join("")}</table>`:""};
  const html=`<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Helferdienste ${esc(shortTeam(g.home))} – ${esc(shortTeam(g.away))}</title><style>
    @page{size:A4;margin:14mm}body{font:12pt/1.35 Arial,Helvetica,sans-serif;color:#111}h1{font-size:20pt;margin:0 0 2mm;text-transform:uppercase}.meta{margin:0 0 6mm;color:#444}
    h2{font-size:12pt;letter-spacing:.12em;text-transform:uppercase;border-bottom:2px solid #111;padding-bottom:1mm;margin:6mm 0 2mm}table{width:100%;border-collapse:collapse}td{border-bottom:1px solid #bbb;padding:2.2mm 1mm;vertical-align:top}
    td.t{width:46%}small{color:#555}.slot{display:inline-block;min-width:42mm;border-bottom:1px solid #111;padding:0 1mm 1mm;margin:0 3mm 2mm 0}
    .foot{margin-top:8mm;font-size:9pt;color:#666}</style></head><body>
    <h1>Helferdienste · ${esc(teamName(g.team))}</h1><p class="meta"><b>${esc(shortTeam(g.home))} – ${esc(shortTeam(g.away))}</b><br>${esc(day)} · ${esc(g.time)} Uhr · ${esc(g.stadium)}</p>
    ${sec("g")}${sec("v")}<p class="foot">Eintragen auch online: ${esc(hpLink(gid))}</p><script>setTimeout(()=>print(),300)<\/script></body></html>`;
  const w=window.open("","_blank");if(!w){alert("Bitte Pop-ups für diese Seite erlauben, um den Aushang zu drucken.");return}
  w.document.open();w.document.write(html);w.document.close();
  try{trackAnalyticsEvent("helper_print",{team:teamName(g.team)})}catch(e){}
}
