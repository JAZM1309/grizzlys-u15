/* Young Grizzlys – Spielbericht-Vorlage (ab 1.37.0)
 *
 * Eine Datei für die App (Admin-Bereich) und die Cloud Function „autoResults“ (automatische Entwürfe).
 * Die Function lädt diese Datei von der Live-Seite – Verbesserungen am Text gelten damit nach dem
 * „Live gehen“ automatisch auch für die automatischen Berichte (Fallback: Kopie im functions-Ordner).
 *
 * Nur Fakten aus dem EHV-Spielbericht, Ergebnis, Tabelle und Spielplan. Spieler nie mit Namen, nur Rückennummer.
 *
 * env = { win, ALL_GAMES, standings(), dt, isHome, shortTeam, teamName, standRow, standPeriodsData, leagues() }
 *   win: Objekt mit resultFor(g) und repDetails {key: Spieldetails}
 */
(function (root) {
function createSpielbericht(env) {
  const window = env.win;
  const ALL_GAMES = env.ALL_GAMES;
  const dt = env.dt, isHome = env.isHome, shortTeam = env.shortTeam, teamName = env.teamName,
        standRow = env.standRow, standPeriodsData = env.standPeriodsData;
  const INSTA_LEAGUE = new Proxy({}, { get: (t, k) => ((env.leagues && env.leagues()) || {})[k] });
/* ===== 1.9.1.128: Spielbericht – Entwurf automatisch aus Ergebnis, Dritteln, Tabelle und Spielplan ===== */
window.gameReports=window.gameReports||{};
const rkey=g=>g.date+"_"+g.time.replace(/:/g,"")+"_"+g.team;
function repEhvGame(g){
  const L=env.standings()[g.team]&&env.standings()[g.team].games; if(!Array.isArray(L))return null;
  const h=standRow(g.team,g.home), a=standRow(g.team,g.away); if(!h||!a)return null;
  const x=L.find(x=>x.d===g.date&&x.h===h.n&&x.a===a.n); if(!x)return null;
  const r=window.resultFor(g); if(!r||Number(r.homeScore)!==x.hs||Number(r.awayScore)!==x.as)return null;
  return {x,h,a,L};
}
const REP_NUM=["","ersten","zweiten","dritten","vierten","fünften","sechsten","siebten","achten","neunten","zehnten"];
const REP_W=["null","ein","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf"];
const repW=n=>REP_W[n]||String(n);
const repMal=n=>n===1?"einmal":n<=12?REP_W[n]+"mal":n+"-mal";
const repMin=t=>Math.floor(t/60)+1;
const repList=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" und "+a[a.length-1];
const repCap=x=>x?x[0].toUpperCase()+x.slice(1):x;
window.repDetails=window.repDetails||{};
/* 1.9.1.130: Spielbericht als Fließtext – Einstieg, Spielverlauf, Mannschaftsleistung, Ausblick */
/* 1.9.1.134: Schlagworte des Admins → passende Sätze (je nach Sieg / Niederlage / Unentschieden) */
/* 1.26.4: kritische Schlagworte („Powerplay schlecht“, „Abwehr schwach“, „zu viele Strafen“) */
const REP_NEG=/schlecht|schwach|mies|harmlos|fehlt|fehlend|zu wenig|zu viele|kaum|nicht gut|ungenutzt|ausbaufähig|ausbaufaehig|verschlafen|enttäusch|enttaeusch|holprig|fahrig|ideenlos|problem|katastroph|unkonzentriert|verbesserungs|luft nach oben/;
const REP_KW=[
 {k:"pp",re:/powerplay|power play|überzahl|ueberzahl|\bpp\b|special teams/,
  w:["Im Powerplay war die Mannschaft brandgefährlich.","Mit einem Mann mehr spielten die Grizzlys ihre Stärke aus."],
  l:["Im Powerplay zeigte die Mannschaft gute Ansätze."],d:["Im Powerplay gab es gute Ansätze."],
  n:["Im Powerplay lief dagegen wenig zusammen – hier gibt es noch Luft nach oben.","Ein Manko war das Überzahlspiel: Die Chancen mit einem Mann mehr blieben weitgehend ungenutzt."]},
 {re:/teamgeist|zusammenhalt|geschlossen|mannschaftsleistung|einheit|füreinander|fuereinander|kollektiv/,
  w:["Der Erfolg war vor allem eine Frage des Teamgeists: Die Mannschaft trat geschlossen auf, jeder kämpfte für jeden.","Die Geschlossenheit war der Schlüssel – hier stand eine echte Einheit auf dem Eis."],
  l:["Trotz der Niederlage stimmte der Zusammenhalt: Die Mannschaft trat bis zum Schluss geschlossen auf.","Auch wenn es nicht gereicht hat – als Team hielt die Mannschaft zusammen."],
  d:["Die Mannschaft trat geschlossen auf und hielt als Team zusammen."],n:["Als Team fand die Mannschaft heute nicht richtig zusammen."]},
 {re:/kampf|einsatz|leidenschaft|wille|moral|biss|herz/,
  w:["Mit großem Kampfgeist warf sich das Team in jeden Zweikampf.","Der unbedingte Wille war in jeder Szene zu spüren."],
  l:["Kämpferisch gab es nichts vorzuwerfen: Bis zur letzten Sekunde wurde alles gegeben.","Am Einsatz lag es nicht – gekämpft wurde bis zum Schluss."],
  d:["Kämpferisch zeigte die Mannschaft eine starke Leistung."],n:["Kämpferisch war heute noch Luft nach oben."]},
 {re:/torh|torwart|goalie|keeper|rückhalt|rueckhalt|parade/,
  w:["Großen Anteil am Erfolg hatte die starke Leistung im Tor.","Hinten war auf den Rückhalt im Tor Verlass."],
  l:["Im Tor gab es eine starke Leistung, die Schlimmeres verhinderte."],
  d:["Ein starker Rückhalt im Tor sicherte das Unentschieden."],n:["Im Tor war es heute nicht der beste Tag."]},
 {re:/defensiv|abwehr|verteidig/,
  w:["Die Defensive stand sicher und ließ kaum etwas zu."],
  l:["Die Defensive bemühte sich nach Kräften, hatte aber viel zu tun."],
  d:["Die Defensive stand über weite Strecken sicher."],n:["Die Defensive ließ heute zu viel zu."]},
 {re:/tempo|schnell|druck|offensiv|angriff/,
  w:["Mit hohem Tempo setzten die Grizzlys den Gegner immer wieder unter Druck."],
  l:["Mit hohem Tempo versuchte die Mannschaft, den Gegner unter Druck zu setzen."],
  d:["Mit viel Tempo ging es immer wieder in Richtung gegnerisches Tor."],n:["Nach vorn fehlte heute das Tempo."]},
 {k:"pim",re:/disziplin|fair/,
  w:["Dazu blieb die Mannschaft diszipliniert und fair."],l:["Die Mannschaft blieb dabei stets diszipliniert und fair."],d:["Die Mannschaft blieb diszipliniert und fair."],n:["Mit der Disziplin haperte es heute."]},
 {re:/chancen|effektiv|kaltschn|abschluss/,
  w:["Vorne nutzten die Grizzlys ihre Chancen eiskalt."],l:["Woran es heute haperte, war die Chancenverwertung."],d:["Mit etwas mehr Glück im Abschluss wäre mehr drin gewesen."],n:["Woran es haperte, war die Chancenverwertung."]},
 {re:/fans|publikum|stimmung|zuschauer|unterstütz|unterstuetz|eltern/,
  w:["Die lautstarke Unterstützung von den Rängen trug die Mannschaft durch das Spiel."],l:["Die Unterstützung von den Rängen war bis zum Schluss großartig."],d:["Von den Rängen gab es lautstarke Unterstützung."],n:["Von den Rängen kam heute nur wenig Unterstützung."]},
 {k:"pim",re:/strafe|strafzeit|unterzahl/,
  w:["Trotz einiger Strafzeiten behielt die Mannschaft die Kontrolle."],l:["Zu viele Strafzeiten brachten die Grizzlys immer wieder in Unterzahl."],d:["Einige Strafzeiten machten das Spiel nicht leichter."],n:["Zu viele Strafzeiten brachten die Grizzlys immer wieder in Unterzahl."]},
 {re:/personal|dünn|duenn|kader|verletz|krank|ersatz|ausfälle|ausfaelle|kurz besetzt/,
  w:["Personell war die Mannschaft dünn besetzt – umso höher ist die Leistung einzuordnen."],l:["Personell dünn besetzt, fehlte am Ende etwas die Kraft."],d:["Personell dünn besetzt, war das Unentschieden ein Erfolg."]},
 {re:/spaß|spass|freude/,
  w:["Vor allem hatten die Grizzlys sichtlich Spaß auf dem Eis."],l:["Den Spaß am Eishockey ließ sich die Mannschaft trotzdem nicht nehmen."],d:["Spaß auf dem Eis hatte die Mannschaft allemal."],n:["Der Spaß blieb heute etwas auf der Strecke."]},
 {re:/entwickl|fortschritt|lernen|steigerung|verbessert/,
  w:["Die Fortschritte der letzten Wochen waren deutlich zu sehen."],l:["Trotz des Ergebnisses waren die Fortschritte der letzten Wochen zu erkennen."],d:["Die Fortschritte der letzten Wochen waren zu sehen."],n:["Die Fortschritte der letzten Wochen waren heute kaum zu sehen."]},
 {re:/aufholjagd|comeback|aufgeben|aufgegeben/,
  w:["Aufgeben war heute keine Option."],l:["Aufgegeben hat sich die Mannschaft nie."],d:["Aufgegeben hat sich die Mannschaft nie."]},
];
function repKeywordSentences(kwText,outcome,pick,ctx){
  const kws=String(kwText||"").split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean).slice(0,6);
  const out=[], used=new Set(), free=[], negFree=[]; out.neg=new Set();
  kws.forEach(k=>{
    const n=k.toLowerCase(), hit=REP_KW.findIndex(e=>e.re.test(n)), neg=REP_NEG.test(n);
    if(hit>=0){if(used.has(hit))return;used.add(hit);const e=REP_KW[hit];
      if(neg){if(e.k)out.neg.add(e.k);
        /* Powerplay mit echten Zahlen, wenn die EHV-Spieldetails da sind */
        if(e.k==="pp"&&ctx&&ctx.ppOpp>0)out.push(ctx.pp===0?pick([`Im Powerplay lief dagegen wenig zusammen: Aus ${ctx.ppOpp} Überzahlsituationen sprang kein Tor heraus.`,`Ein Manko blieb das Überzahlspiel – ${ctx.ppOpp} Gelegenheiten, aber kein Treffer.`]):`Im Powerplay ist noch Luft nach oben: Nur ${ctx.pp===1?"ein Tor":repW(ctx.pp)+" Tore"} aus ${ctx.ppOpp} Überzahlsituationen.`);
        else out.push(pick(e.n||[`Nicht alles lief rund: ${k.replace(/[.!]+$/,"")}.`]))}
      else out.push(pick(e[outcome]))}
    else if(neg)negFree.push(k.replace(/[.!]+$/,""));
    else free.push(k.replace(/[.!]+$/,""));
  });
  if(negFree.length)out.push(pick([`Luft nach oben gibt es noch – ${repList(negFree)}.`,`Daran wird die Mannschaft arbeiten: ${repList(negFree)}.`]));
  /* freie Schlagworte ohne eigene Vorlage */
  const withP=free.filter(k=>/^(mit|ohne|voller|trotz)\s/i.test(k)), nouns=free.filter(k=>!withP.includes(k));
  withP.forEach(k=>out.push(`Die Mannschaft trat ${k.replace(/^./,c=>c.toLowerCase())} auf.`));
  if(nouns.length){const L=repList(nouns);
    out.push(outcome==="w"?pick([`Was das Team heute auszeichnete: ${L}.`,`Stichworte des Spiels aus Grizzlys-Sicht: ${L}.`]):outcome==="l"?`Positiv bleibt trotzdem: ${L}.`:`Was das Spiel prägte: ${L}.`)}
  return out;
}
window.repKeywordSentences=repKeywordSentences;
/* 1.26.4: Auftrag für eine externe KI-App (Claude, ChatGPT …): Fakten + Stilvorgaben, keine Namen */
function repAiPrompt(g,kw,len,use){
  const r=window.resultFor(g); if(!r||r.homeScore===undefined||r.homeScore==="")return "";
  /* 1.26.5: nur die Angaben, die unter „Inhalt anpassen“ abgehakt sind */
  use=use||{}; const D=repDraft(g,0,kw,use,len), FA=(D&&D.facts)||{};
  const on=k=>!!(FA[k]&&FA[k].avail&&(k in use?use[k]:FA[k].def));
  const lbl=k=>String(FA[k].label||"").replace(/^[^\p{L}\p{N}]+/u,"").trim();
  const home=isHome(g), us=Number(home?r.homeScore:r.awayScore), them=Number(home?r.awayScore:r.homeScore), opp=shortTeam(home?g.away:g.home);
  let det=window.repDetails[rkey(g)]||null; if(det&&(det.hs!==Number(r.homeScore)||det.as!==Number(r.awayScore)))det=null;
  const L=[], me=home?"h":"a", mm=t=>Math.floor((Number(t)||0)/60)+1;
  const d=dt(g).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  L.push(`Spiel: ${g.home} gegen ${g.away} (${teamName(g.team)}, ${INSTA_LEAGUE[g.team]||"Liga"})`);
  L.push(`Datum: ${d}, ${g.time} Uhr, Spielort: ${g.stadium} – für die Grizzlys ein ${home?"Heimspiel":"Auswärtsspiel"}`);
  L.push(`Endstand: ${r.homeScore}:${r.awayScore} (Heim:Gast) – aus Grizzlys-Sicht ${us}:${them}, also ${us>them?"Sieg":us<them?"Niederlage":"Gleichstand nach 60 Minuten, Penaltyschießen"}${(det&&det.so)||r.so===true?" (nach Penaltyschießen)":det&&det.ot?" (nach Verlängerung)":""}. Hinweis: Im Eishockey gibt es kein Unentschieden – nie von einem Unentschieden schreiben.`);
  L.push(``);
  const per=standPeriodsData(g), P=per?per.p:det&&det.periods?det.periods.map(v=>v[0]+":"+v[1]):null;
  const verlauf=on("verlauf")||!FA.verlauf||!FA.verlauf.avail, nums=on("scorers")||on("hat");
  if(verlauf&&P&&P.length)L.push(`Drittel (Heim:Gast): ${P.join(", ")}`);
  if(det){
    const goals=!verlauf?[]:(det.goals||[]).map(q=>{const our=q.side===me, who=nums&&q.scorer&&q.scorer.nr?" – Nr. "+q.scorer.nr:"", ast=nums?[q.a1,q.a2].filter(p=>p&&p.nr).map(p=>"Nr. "+p.nr):[];
      const tag=[q.pp?"Überzahl":"",q.sh?"Unterzahl":"",q.en?"ins leere Tor":"",q.ps?"Penalty":""].filter(Boolean);
      return `  ${mm(q.t)}. Min: ${q.score} (Heim:Gast) – Tor ${our?"Grizzlys":opp}${our?who+(ast.length?" (Vorlage "+ast.join(", ")+")":""):""}${tag.length?" – "+tag.join(", "):""}`});
    if(goals.length)L.push("Torfolge:\n"+goals.join("\n"));
    const mine=det[home?"home":"away"], other=det[home?"away":"home"];
    const kwPP=/powerplay|power play|überzahl|ueberzahl/i.test(String(kw||""));
    if(mine&&other){const ppG=(det.goals||[]).filter(q=>q.side===me&&q.pp).length;
      if(on("pim"))L.push(`Strafminuten: Grizzlys ${mine.pim}, ${opp} ${other.pim}`);
      if(on("pp")||kwPP)L.push(`Powerplay Grizzlys: ${ppG} Tor(e) aus ${mine.ppOpp} Überzahlsituationen`);
      if(on("pk"))L.push(`Unterzahl: alle ${mine.pkSit} Unterzahlsituationen ohne Gegentor überstanden`);
      const k=(mine.keepers||[]).filter(q=>q.min>0).map(q=>"Nr. "+q.nr+" ("+q.min+" Min.)");if(on("shutout")&&k.length)L.push("Torhüter Grizzlys (zu null): "+k.join(", "));}
    if(on("att")&&det.attendance>0)L.push(`Zuschauer: ${det.attendance}`);
  }
  const me2=standRow(g.team,home?g.home:g.away); if(on("table")&&me2&&me2.gp)L.push(`Tabelle danach: Platz ${me2.r}, ${me2.p} Punkte aus ${me2.gp} Spielen`);
  if(on("streak"))L.push("Serie: "+lbl("streak"));
  if(on("duel"))L.push("Vergleich mit dem letzten Duell: "+lbl("duel"));
  const HL=["start","dbl","late","sh","comeback","lc","lateEq","hat","blitz","en"].filter(on).map(lbl);
  if(HL.length)L.push("Besonders erwähnen: "+HL.join("; "));
  const nx=on("next")?ALL_GAMES.filter(y=>y.team===g.team&&dt(y)>dt(g)).sort((a,b)=>dt(a)-dt(b))[0]:null;
  if(nx)L.push(`Nächstes Spiel: ${dt(nx).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})}, ${nx.time} Uhr, ${isHome(nx)?"zu Hause gegen":"auswärts bei"} ${shortTeam(isHome(nx)?nx.away:nx.home)}`);
  const kws=String(kw||"").trim();
  return [
`Schreibe einen Spielbericht für die Vereins-App und Instagram der ESV Grizzlys Bergkamen (Eishockey-Nachwuchs, ${String(teamName(g.team)).split(" ")[0]} – Spieler sind ${g.team==="U13"?"Kinder":"Jugendliche"}).`,
``,
`So soll er sein:`,
`- flüssiger, lebendiger Fließtext auf Deutsch, ${len==="kurz"?"2 kurze Absätze, 50 bis 80 Wörter":"3 bis 4 Absätze, 150 bis 230 Wörter"}`,
(verlauf?`- erzählt den Spielverlauf, nicht nur Zahlen; abwechslungsreiche Sätze, typische Eishockey-Sprache, aber nicht übertrieben`:`- ohne Spielverlauf im Detail (keine Drittel, keine Torfolge); abwechslungsreiche Sätze, typische Eishockey-Sprache, aber nicht übertrieben`),
`- fair gegenüber dem Gegner und wertschätzend gegenüber den Jugendlichen`,
`- Spieler NUR mit Rückennummer nennen (z. B. „die Nr. 17“), niemals Namen`,
`- nichts erfinden: nur die Fakten unten verwenden, keine Zitate, keine erfundenen Szenen`,
`- die Stichworte des Trainers inhaltlich genau so wiedergeben, wie sie gemeint sind – Kritik bleibt Kritik (konstruktiv formuliert), Lob bleibt Lob`,
`- nur das erwähnen, was unten unter Fakten steht – was dort fehlt, bewusst weglassen`,
(on("table")||on("next")?`- am Ende kurz ${on("table")&&on("next")?"die Tabelle und das nächste Spiel":on("table")?"die Tabelle":"das nächste Spiel"} erwähnen`:`- keine Tabelle und keinen Ausblick aufs nächste Spiel`),
(on("fazit")?`- mit einem kurzen, passenden Fazit-Satz schließen`:`- kein Fazit-Satz am Ende`),
`- keine Hashtags, keine Emojis`,
``,
`Ausgabe: zuerst eine Überschrift (höchstens 70 Zeichen) in einer eigenen Zeile, dann eine Leerzeile, dann der Text. Sonst nichts.`,
``,
`Fakten:`,
...L.map(x=>"- "+x),
``,
`Stichworte des Trainers: ${kws||"(keine)"}`
  ].join("\n");
}
window.repAiPrompt=repAiPrompt;
/* 1.9.1.136: Auswahl, welche Angaben in den Bericht kommen (use = {schlüssel:true/false}, sonst Vorgabe) und Länge (len = "kurz" | "") */
const REP_ATT_MIN=100;
function repDraft(g,variant=0,kw="",use={},len=""){
  const r=window.resultFor(g); if(!r||r.homeScore===undefined||r.homeScore==="")return null;
  use=use||{};
  const home=isHome(g), us=Number(home?r.homeScore:r.awayScore), them=Number(home?r.awayScore:r.homeScore);
  const opp=shortTeam(home?g.away:g.home), T=teamName(g.team), sc=us+":"+them, diff=us-them;
  let det=window.repDetails[rkey(g)]||null; if(det&&(det.hs!==Number(r.homeScore)||det.as!==Number(r.awayScore)))det=null;
  let seed=variant; for(const c of rkey(g))seed=(seed*31+c.charCodeAt(0))>>>0; seed+=variant*7;
  /* 1.37.1: Formulierungen zufällig (fester Startwert je Spiel) und ohne die Bausteine der letzten Berichte dieser Mannschaft */
  const recent=(env.recent&&env.recent(g))||{}, used={};
  let rs=(seed>>>0)||1; const rnd=()=>{rs=(Math.imul(rs,1103515245)+12345)>>>0;return (rs>>>8)/16777216};
  const slotOf=arr=>{let t=String(arr[0]);[opp,T,sc].forEach(x=>{if(x)t=t.split(x).join("")});return t.replace(/[0-9]+/g,"").replace(/\s+/g," ").slice(0,30)+"#"+arr.length};
  const pick=(arr,slot)=>{if(arr.length===1)return arr[0];const k=slot||slotOf(arr), bad=new Set(recent[k]||[]);
    let ok=arr.map((_,i)=>i).filter(i=>!bad.has(i)); if(!ok.length)ok=arr.map((_,i)=>i);
    const i=ok[Math.floor(rnd()*ok.length)]; used[k]=i; return arr[i]};
  const oppN=home?"die Gäste":"die Gastgeber", oppD=home?"den Gästen":"den Gastgebern";
  const city=home?"Bergkamen":g.stadium, inCity="in "+city;
  const e=repEhvGame(g), x=e&&e.x;
  const so=(x?x.so:!!(det&&det.so))||r.so===true, ot=x?x.ot:!!(det&&det.ot), xtra=so?"im Penaltyschießen":ot?"in der Verlängerung":"";
  const rawP=x&&x.p&&x.p.length>=3?x.p.slice(0,3).map(v=>v.split(":").map(Number)):det&&det.periods&&det.periods.length>=3?det.periods.slice(0,3):null;
  const per=rawP?rawP.map(([a,b])=>home?[a,b]:[b,a]):null;
  let st=null; if(per){let cu=0,ct=0;st=per.map(([a,b])=>{cu+=a;ct+=b;return [cu,ct]})}
  const behind=st&&st.some(([a,b])=>a<b), ahead=st&&st.some(([a,b])=>a>b);
  const me=home?"h":"a", G=det?(det.goals||[]).map(q=>{const [h,a]=String(q.score).split(":").map(Number);return {...q,our:q.side===me,s:home?h+":"+a:a+":"+h}}):[];
  const ours=G.filter(q=>q.our), theirs=G.filter(q=>!q.our);
  const mine=det?det[home?"home":"away"]:null, other=det?det[home?"away":"home"]:null;
  const nm=p=>p&&p.nr?"die Nr. "+p.nr:""; /* 1.26.0: nur Rückennummern, keine Namen */

  /* ---------- Fakten: verfügbar? automatisch an? ---------- */
  const att=det&&det.attendance>0?det.attendance:0;
  const f0=G[0];
  let dbl=null; for(let i=1;i<ours.length;i++){const gap=ours[i].t-ours[i-1].t;if(gap<=60&&(!dbl||gap<dbl.gap))dbl={gap,t:ours[i].t}}
  let dd=0,leadAt=null; G.forEach(q=>{const was=dd;dd+=q.our?1:-1;if(was<=0&&dd>0)leadAt=q.t;if(dd<=0)leadAt=null});
  const lateWin=diff>0&&!xtra&&leadAt!==null&&leadAt>=3600-180, honor=!lateWin&&diff>=3&&them===1&&!!theirs[0];
  const pp=ours.filter(q=>q.pp).length, sh=ours.filter(q=>q.sh).length, ppA=theirs.filter(q=>q.pp).length, pk=mine?(mine.pkSit||mine.penalties):0;
  const by={}; ours.forEach(q=>{const k=q.scorer&&q.scorer.nr;if(k)by[k]=(by[k]||0)+1}); const nS=Object.keys(by).length;
  /* 1.26.1: weitere Spielmomente – Führungswechsel, Aufholjagd, später Ausgleich, Hattrick, Torflut, leeres Tor */
  let lc=0,lastLd=0,maxDef=0,defAt=""; G.forEach(q=>{const [a,b]=q.s.split(":").map(Number),ld=Math.sign(a-b);if(ld&&lastLd&&ld!==lastLd)lc++;if(ld)lastLd=ld;if(b-a>maxDef){maxDef=b-a;defAt=q.s}});
  const lastG=G[G.length-1], lastS=lastG?lastG.s.split(":").map(Number):null;
  const lateEq=lastG&&lastG.our&&lastS[0]===lastS[1]&&lastG.t>=3600-180&&lastG.t<=3600&&(diff===0||!!xtra)?lastG:null;
  const hatNr=Object.keys(by).filter(k=>by[k]>=3).sort((p,q)=>by[q]-by[p])[0]||""; /* 1.37.0: Spieler mit den meisten Toren, nicht die kleinste Nummer */
  let blitz=null; for(let i=2;i<ours.length;i++){const span=ours[i].t-ours[i-2].t;if(span<=180&&G.indexOf(ours[i])-G.indexOf(ours[i-2])===2&&(!blitz||span<blitz.span))blitz={span,from:ours[i-2],to:ours[i]}}
  if(blitz){const i0=G.indexOf(blitz.from);blitz.before=i0>0?G[i0-1].s:"0:0"}
  const enLast=lastG&&lastG.our&&lastG.en&&diff>0?lastG:null;
  let tab=null; if(e){const meR=home?e.h:e.a, L=e.L.filter(y=>y.h===meR.n||y.a===meR.n).sort((p,q)=>p.t-q.t);
    if(L.length&&L[L.length-1]===x){const won=y=>(y.h===meR.n?y.hs>y.as:y.as>y.hs);let n=0;const w=won(x);for(let i=L.length-1;i>=0&&won(L[i])===w;i--)n++;
      tab={meR,w,n,drought:w&&n===1&&L.length>=3&&!won(L[L.length-2])&&!won(L[L.length-3])}}}
  const oppRaw=home?g.away:g.home;
  const prev=ALL_GAMES.filter(y=>y.team===g.team&&dt(y)<dt(g)&&(y.home===oppRaw||y.away===oppRaw)).sort((p,q)=>dt(q)-dt(p))[0];
  const pr0=prev&&window.resultFor(prev), pr=pr0&&pr0.homeScore!==undefined&&pr0.homeScore!==""?pr0:null;
  const prU=pr?Number(isHome(prev)?pr.homeScore:pr.awayScore):0, prT=pr?Number(isHome(prev)?pr.awayScore:pr.homeScore):0;
  const nx=ALL_GAMES.filter(y=>y.team===g.team&&dt(y)>dt(g)).sort((p,q)=>dt(p)-dt(q))[0];
  const F={
    att:{avail:att>0,def:att>=REP_ATT_MIN,label:`👥 ${att} Zuschauer`},
    verlauf:{avail:!!st,def:true,label:"⏱ Spielverlauf"},
    start:{avail:!!f0,def:!!f0&&f0.t<300,label:f0?(f0.our?`🚀 1:0 in der ${repMin(f0.t)}. Min.`:`🥶 Gegner trifft zuerst (${repMin(f0.t)}. Min.)`):""},
    dbl:{avail:!!dbl,def:true,label:dbl?`⚡ Doppelschlag (${dbl.gap} s)`:""},
    late:{avail:lateWin||honor,def:true,label:lateWin?`⏰ Siegtor ${repMin(leadAt)}. Min.`:"⏰ Ehrentreffer"},
    pp:{avail:pp>0,def:pp>=2,label:`🎯 Überzahl (${pp} von ${mine?mine.ppOpp:pp})`},
    sh:{avail:sh>0,def:true,label:"🦸 Tor in Unterzahl"},
    pk:{avail:pk>=2&&ppA===0,def:pk>=3,label:`🛡 Unterzahl (${pk} von ${pk} überstanden)`},
    pim:{avail:!!mine&&(mine.pim===0||(mine.pim<=4&&mine.pim<other.pim)),def:true,label:mine?`🧘 ${mine.pim} Strafminuten`:""},
    scorers:{avail:det&&det.names?nS>0:(us>=4&&nS>=3),def:det&&det.names?true:nS>=5,label:det&&det.names?"🏒 Torschützen (Namen)":`🔟 ${nS} Torschützen`},
    shutout:{avail:them===0,def:true,label:"🧤 Zu null"},
    table:{avail:!!(tab&&tab.meR.gp),def:true,label:tab?`📊 Tabelle (Platz ${tab.meR.r})`:""},
    streak:{avail:!!tab&&((tab.w&&tab.n>=2)||tab.drought),def:!!tab&&(tab.drought||tab.n>=3),label:tab&&tab.w&&tab.n>=2?`🔥 ${tab.n}. Sieg in Folge`:"🔥 Durststrecke beendet"},
    duel:{avail:!!pr,def:true,label:pr?(diff>0&&prU<prT?"🔁 Revanche":`🔁 Erstes Duell (${prU}:${prT})`):""},
    next:{avail:!!nx,def:true,label:"📅 Ausblick"},
    comeback:{avail:maxDef>=2&&diff>=0,def:true,label:`💪 Aufholjagd nach ${defAt}`},
    lc:{avail:lc>=2,def:true,label:`🔄 ${lc} Führungswechsel`},
    lateEq:{avail:!!lateEq,def:true,label:lateEq?`😮 Ausgleich ${repMin(lateEq.t)}. Min.`:""},
    hat:{avail:!!hatNr,def:true,label:`🎩 Hattrick Nr. ${hatNr}`},
    blitz:{avail:!!blitz,def:true,label:blitz?`🌪 3 Tore in ${Math.max(1,Math.ceil(blitz.span/60))} Min.`:""},
    en:{avail:!!enLast,def:true,label:"🥅 Schlusspunkt ins leere Tor"},
    fazit:{avail:true,def:true,label:"💬 Fazit"},
  };
  const on=k=>F[k]&&F[k].avail&&(k in use?!!use[k]:F[k].def);
  const kurz=len==="kurz";
  const vorAtt=on("att")?`vor ${att} Zuschauern `:"";

  /* ---------- Aufbau: wechselt zwischen klassisch, Mannschaft zuerst, Aufhänger, Zahlen ---------- */
  const hookAvail=on("hat")||(on("blitz")&&diff>0)||(on("shutout")&&diff>0);
  const aufbau=pick(["klassisch","team","haken","zahlen"],"aufbau");
  const useHook=aufbau==="haken"&&hookAvail;
  let hookUsed="";
  const resP=diff>0?`gewinnt ${vorAtt}${inCity} ${xtra?xtra+" ":""}mit ${sc} gegen ${opp}`:diff===0?`spielt ${vorAtt}${inCity} ${sc} gegen ${opp}`:`unterliegt ${opp} ${vorAtt}${inCity} ${xtra?xtra+" ":"trotzdem "}mit ${sc}`;
  const OppN=oppN.replace(/^d/,"D");

  /* ---------- 1. Einstieg ---------- */
  let lead;
  if(useHook&&on("hat")){const n=by[hatNr];hookUsed="hat";lead=pick([`${repCap(repW(n))} Tore der Nr. ${hatNr} – und die ${T} ${resP}.`,`Hattrick-Tag für die Nr. ${hatNr}: Die ${T} ${resP}.`,`Die Nr. ${hatNr} trifft ${repMal(n)}, die ${T} ${resP}.`,`Im Mittelpunkt stand die Nr. ${hatNr} mit ${repW(n)} Treffern – die ${T} ${resP}.`],"haken-hat")}
  else if(useHook&&on("blitz")&&diff>0){const m=Math.max(1,Math.ceil(blitz.span/60));hookUsed="blitz";lead=pick([`Drei Tore in ${m} Minute${m===1?"":"n"}: Die ${T} ${resP}.`,`Ein Drei-Tore-Lauf binnen ${m} Minute${m===1?"":"n"} ebnete den Weg – die ${T} ${resP}.`,`Aus ${blitz.before} wurde in ${m} Minute${m===1?"":"n"} ${blitz.to.s}: Die ${T} ${resP}.`],"haken-blitz")}
  else if(useHook&&on("shutout")&&diff>0){hookUsed="shutout";lead=pick([`Zu null: Die ${T} ${resP}.`,`Kein Gegentor, ${repW(us)} eigene Treffer: Die ${T} ${resP}.`,`Die Defensive stand, vorne klingelte es ${repMal(us)}: Die ${T} ${resP}.`],"haken-null")}
  else if(on("comeback")&&!xtra&&diff>0)lead=pick([`Was für eine Aufholjagd: Schon mit ${defAt} hinten, kämpft sich die ${T} ${vorAtt}${inCity} zurück und gewinnt am Ende mit ${sc} gegen ${opp}.`,`Nie aufgegeben: Beim Stand von ${defAt} glaubte kaum noch jemand an die ${T} – am Ende jubelt sie ${vorAtt}${inCity} über einen ${sc}-Sieg gegen ${opp}.`,`Comeback ${inCity}: Die ${T} macht ${vorAtt}aus einem ${defAt}-Rückstand einen ${sc}-Sieg gegen ${opp}.`,`${defAt} hinten, ${sc} gewonnen: Die ${T} zeigt ${vorAtt}${inCity} gegen ${opp} große Moral.`,`Aus ${defAt} wird ${sc}: Die ${T} dreht ${vorAtt}${inCity} das Spiel gegen ${opp} komplett.`,`Die ${T} liegt ${inCity} gegen ${opp} schon mit ${defAt} zurück – und gewinnt ${vorAtt}am Ende doch noch mit ${sc}.`],"lead-comeback-s");
  else if(on("lateEq")&&diff===0)lead=pick([`Last-Minute-Punkt ${inCity}: Kurz vor der Schlusssirene rettet sich die ${T} ${vorAtt}gegen ${opp} noch zum ${sc}.`,`Spannung bis zur letzten Minute: Die ${T} gleicht ${vorAtt}${inCity} gegen ${opp} spät aus – ${sc} heißt es am Ende.`,`Ausgleich in letzter Minute: Die ${T} holt sich ${vorAtt}${inCity} gegen ${opp} spät noch ein ${sc}.`,`Der Punkt kam spät, aber er kam: ${sc} spielt die ${T} ${vorAtt}${inCity} gegen ${opp}.`,`Bis zur Schlusssirene drangeblieben: Die ${T} rettet sich ${vorAtt}${inCity} gegen ${opp} zum ${sc}.`],"lead-spaet-u");
  else if(on("comeback")&&!xtra&&diff===0)lead=pick([`Moral bewiesen: Nach ${defAt}-Rückstand holt sich die ${T} ${vorAtt}${inCity} gegen ${opp} noch ein ${sc}.`,`Zurückgekämpft: Die ${T} liegt gegen ${opp} schon ${defAt} hinten und erkämpft sich ${vorAtt}${inCity} doch noch ein ${sc}.`,`Aufgeholt und belohnt: Nach ${defAt} erkämpft sich die ${T} ${vorAtt}${inCity} ein ${sc} gegen ${opp}.`,`Aus ${defAt} wird ${sc}: Die ${T} gibt sich ${vorAtt}${inCity} gegen ${opp} nicht geschlagen.`,`Ein Punkt mit Moral: Die ${T} macht ${vorAtt}${inCity} einen ${defAt}-Rückstand gegen ${opp} wett – ${sc}.`],"lead-comeback-u");
  else if(diff>0&&xtra)lead=pick([`Nervenkrimi ${inCity}: Erst ${xtra} sichert sich die ${T} ${vorAtt}den ${sc}-Sieg gegen ${opp}.`,`Was für ein Spiel: Die ${T} gewinnt ${vorAtt}${inCity} gegen ${opp} erst ${xtra} mit ${sc}.`,`Herzschlagfinale ${inCity}: 60 Minuten reichen nicht, erst ${xtra} bejubelt die ${T} ${vorAtt}den ${sc}-Erfolg gegen ${opp}.`,`Die Entscheidung fiel ${xtra}: Die ${T} gewinnt ${vorAtt}${inCity} mit ${sc} gegen ${opp}.`,`Extraschicht mit Happy End: Die ${T} setzt sich ${vorAtt}${inCity} ${xtra} mit ${sc} gegen ${opp} durch.`,`Mehr Spannung geht nicht: ${repCap(xtra)} holt sich die ${T} ${vorAtt}${inCity} den ${sc}-Sieg gegen ${opp}.`],"lead-sieg-x");
  else if(diff>0&&behind)lead=pick([`Moral bewiesen: Nach Rückstand dreht die ${T} ${vorAtt}${inCity} das Spiel gegen ${opp} und gewinnt mit ${sc}.`,`Aufholjagd mit Happy End: Die ${T} liegt gegen ${opp} zurück, kämpft sich aber ${vorAtt}${inCity} zu einem ${sc}-Sieg.`,`Erst gezittert, dann gejubelt: Die ${T} dreht ${vorAtt}${inCity} einen Rückstand gegen ${opp} und gewinnt ${sc}.`,`Spiel gedreht: Die ${T} lag gegen ${opp} zurück und gewinnt ${vorAtt}${inCity} doch noch mit ${sc}.`,`Rückstand? Kein Problem: Die ${T} antwortet ${vorAtt}${inCity} gegen ${opp} und siegt mit ${sc}.`,`Die ${T} beweist ${vorAtt}${inCity} Comeback-Qualitäten und gewinnt nach Rückstand mit ${sc} gegen ${opp}.`],"lead-sieg-gedreht");
  else if(diff>=5)lead=pick([`Klare Sache ${inCity}: Die ${T} gewinnt ${vorAtt}mit ${sc} gegen ${opp} und lässt ${oppD} keine Chance.`,`Torfestival ${inCity}: ${vorAtt?`Vor ${att} Zuschauern feiert die ${T}`:`Die ${T} feiert`} einen ${sc}-Kantersieg gegen ${opp}.`,`Deutlicher geht es kaum: Die ${T} schlägt ${opp} ${vorAtt}${inCity} mit ${sc}.`,`Die Torlampe hatte Dauerbetrieb: Mit ${sc} fegt die ${T} ${vorAtt}${inCity} über ${opp} hinweg.`,`Eine Machtdemonstration ${inCity}: Die ${T} gewinnt ${vorAtt}mit ${sc} gegen ${opp}.`,`${sc} – die ${T} lässt ${vorAtt}${inCity} gegen ${opp} nichts anbrennen.`,`Mit ${sc} setzt die ${T} ${vorAtt}${inCity} gegen ${opp} ein deutliches Zeichen.`],"lead-sieg-hoch");
  else if(diff===1)lead=pick([`Zittersieg ${inCity}: Die ${T} setzt sich ${vorAtt}knapp mit ${sc} gegen ${opp} durch.`,`Bis zum Schluss spannend: Mit ${sc} behält die ${T} ${vorAtt}${inCity} gegen ${opp} knapp die Oberhand.`,`Ein Tor macht den Unterschied: Die ${T} gewinnt ${vorAtt}${inCity} mit ${sc} gegen ${opp} – und alle atmen bei der Schlusssirene durch.`,`Ganz eng ging es zu ${inCity}: Am Ende gewinnt die ${T} ${vorAtt}mit ${sc} gegen ${opp}.`,`Mit einem Tor Vorsprung behält die ${T} ${vorAtt}${inCity} gegen ${opp} die Punkte: ${sc}.`,`Nervenstark: Die ${T} bringt ${vorAtt}${inCity} einen ${sc}-Sieg gegen ${opp} über die Zeit.`],"lead-sieg-knapp");
  else if(diff>0)lead=pick([`Starker Auftritt ${inCity}: Die ${T} gewinnt ${vorAtt}mit ${sc} gegen ${opp}.`,`Mit einem verdienten ${sc}-Erfolg gegen ${opp} hat die ${T} ${vorAtt}${inCity} überzeugt.`,`Daumen hoch: Die ${T} holt sich ${vorAtt}${inCity} mit ${sc} gegen ${opp} die Punkte.`,`Sieg ${inCity}: Die ${T} schlägt ${opp} ${vorAtt}mit ${sc}.`,`Die ${T} bleibt ${vorAtt}${inCity} gegen ${opp} die bessere Mannschaft und gewinnt mit ${sc}.`,`Erfolgreicher Tag ${inCity}: Mit ${sc} gegen ${opp} holt sich die ${T} ${vorAtt}den Sieg.`,`${sc} gegen ${opp}: Die ${T} feiert ${vorAtt}${inCity} einen gelungenen Sieg.`],"lead-sieg");
  else if(diff===0)lead=pick([`Punkteteilung ${inCity}: Die ${T} und ${opp} trennen sich ${vorAtt}${sc}.`,`Keinen Sieger gab es ${inCity}: Das Spiel der ${T} gegen ${opp} endet ${vorAtt}${sc}.`,`Auf Augenhöhe: Die ${T} und ${opp} schenken sich ${vorAtt}${inCity} nichts – ${sc} heißt es nach 60 Minuten.`,`Ein Punkt für beide: Die ${T} spielt ${vorAtt}${inCity} gegen ${opp} ${sc}.`,`${sc} nach 60 Minuten: Die ${T} und ${opp} teilen sich ${vorAtt}${inCity} die Punkte.`],"lead-unentschieden");
  else if(xtra)lead=pick([`Bitter ${inCity}: Die ${T} unterliegt ${opp} ${vorAtt}erst ${xtra} mit ${sc}.`,`Ganz knapp vorbei: Erst ${xtra} muss sich die ${T} ${vorAtt}${opp} mit ${sc} geschlagen geben.`,`So nah dran: Die ${T} rettet sich ${vorAtt}${inCity} in die Entscheidung, verliert ${xtra} aber mit ${sc} gegen ${opp}.`,`Nur knapp geschlagen: Die ${T} verliert ${vorAtt}${inCity} ${xtra} mit ${sc} gegen ${opp}.`,`${repCap(xtra)} hatte ${opp} das bessere Ende: Die ${T} unterliegt ${vorAtt}${inCity} mit ${sc}.`],"lead-niederlage-x");
  else if(ahead)lead=pick([`Führung aus der Hand gegeben: Die ${T} verliert ${vorAtt}${inCity} mit ${sc} gegen ${opp}.`,`Lange sah es gut aus, am Ende verliert die ${T} ${vorAtt}${inCity} aber mit ${sc} gegen ${opp}.`,`Der Sieg schien greifbar – doch am Ende steht die ${T} ${vorAtt}${inCity} mit einer ${sc}-Niederlage gegen ${opp} da.`,`Die ${T} führte bereits gegen ${opp}, muss sich ${vorAtt}${inCity} am Ende aber mit ${sc} geschlagen geben.`,`Am Ende ohne Punkte, obwohl die ${T} zwischenzeitlich vorn lag: ${sc} gegen ${opp} ${vorAtt}${inCity}.`],"lead-niederlage-fuehrung");
  else if(diff===-1)lead=pick([`Knapp vorbei: Die ${T} verliert ${vorAtt}${inCity} mit ${sc} gegen ${opp}.`,`Unglücklich ${inCity}: Mit ${sc} muss sich die ${T} ${vorAtt}${opp} knapp geschlagen geben.`,`Ein Tor fehlte: Die ${T} unterliegt ${opp} ${vorAtt}${inCity} mit ${sc}.`,`Ganz eng, aber ohne Punkte: Die ${T} verliert ${vorAtt}${inCity} mit ${sc} gegen ${opp}.`,`Nur ein Treffer fehlte zum Ausgleich: Die ${T} unterliegt ${opp} ${vorAtt}${inCity} mit ${sc}.`],"lead-niederlage-knapp");
  else if(diff<=-5)lead=pick([`Gebrauchter Tag ${inCity}: Die ${T} unterliegt ${opp} ${vorAtt}deutlich mit ${sc}.`,`Gegen ${opp} war ${inCity} nichts zu holen: Die ${T} verliert ${vorAtt}mit ${sc}.`,`Lehrstunde ${inCity}: Die ${T} muss sich ${opp} ${vorAtt}mit ${sc} geschlagen geben.`,`Ein Spiel zum Abhaken: Die ${T} verliert ${vorAtt}${inCity} mit ${sc} gegen ${opp}.`,`${opp} war ${inCity} eine Nummer zu groß: Die ${T} unterliegt ${vorAtt}mit ${sc}.`],"lead-niederlage-hoch");
  else lead=pick([`Die ${T} hat ${vorAtt}${inCity} gegen ${opp} mit ${sc} verloren.`,`Keine Punkte ${inCity}: Die ${T} unterliegt ${opp} ${vorAtt}mit ${sc}.`,`Nichts zu holen ${inCity}: Gegen ${opp} verliert die ${T} ${vorAtt}mit ${sc}.`,`Niederlage ${inCity}: Die ${T} muss sich ${opp} ${vorAtt}mit ${sc} geschlagen geben.`,home?`${opp} nimmt die Punkte aus Bergkamen mit: Die ${T} verliert ${vorAtt}mit ${sc}.`:`Ohne Punkte zurück aus ${city}: Die ${T} unterliegt ${opp} ${vorAtt}mit ${sc}.`],"lead-niederlage");
  lead=lead.replace(/\s+/g," ").replace(/ ([.,:–])/g,"$1");
  const KS=repKeywordSentences(kw,diff>0?"w":diff<0?"l":"d",pick,{pp:det&&mine?ours.filter(q=>q.pp).length:0,ppOpp:det&&mine?mine.ppOpp:0});
  const nextTxt=()=>{const d=dt(nx).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"}), nh=isHome(nx), no=shortTeam(nh?nx.away:nx.home), tm=nx.time.replace(/^0/,"").replace(/:00$/,"");
    return pick([`Weiter geht es am ${d}, um ${tm} Uhr ${nh?"zu Hause gegen":"auswärts bei"} ${no}.`,`Die nächste Aufgabe wartet am ${d}: Um ${tm} Uhr geht es ${nh?"in Bergkamen gegen":"auswärts zu"} ${no}.`,`Schon am ${d}, steht das nächste Spiel an – ${nh?"zu Hause gegen":"auswärts bei"} ${no}, Bully ist um ${tm} Uhr.`,`Am ${d}, um ${tm} Uhr geht es weiter – ${nh?"in Bergkamen gegen":"auswärts bei"} ${no}.`,`Nächster Termin: ${d}, ${tm} Uhr, ${nh?"Heimspiel gegen":"auswärts bei"} ${no}.`,`${nh?"Zu Hause":"Auswärts"} geht es am ${d}, um ${tm} Uhr gegen ${no} weiter.`],"ausblick")};
  const NUMN=n=>REP_NUM[n]?REP_NUM[n].replace(/n$/,""):n+".";

  /* ---------- Kurzfassung ---------- */
  if(kurz){
    const K1=[lead];
    if(on("verlauf")&&per)K1.push(pick([`Die Drittel: ${per.map(v=>v.join(":")).join(", ")}.`,`Drittel für Drittel: ${per.map(v=>v.join(":")).join(", ")}.`,`Die Drittelergebnisse lauteten ${repList(per.map(v=>v.join(":")))}.`],"kurz-drittel"));
    K1.push(...KS);
    const K2=[]; if(on("table"))K2.push(pick([`${tab.w&&on("streak")&&tab.n>=2?`Mit dem ${REP_NUM[tab.n]||tab.n+"."} Sieg in Folge`:"Damit"} steht die ${T} auf Platz ${tab.meR.r}.`,`In der Tabelle bedeutet das Platz ${tab.meR.r}.`,`Die ${T} belegt damit Platz ${tab.meR.r}.`],"kurz-tabelle"));
    if(on("next"))K2.push(nextTxt());
    const title=repTitle(g,diff,sc,opp,xtra,behind,pick);
    return {title,text:[K1.join(" "),K2.join(" ")].filter(Boolean).join("\n\n"),facts:F,bausteine:used};
  }

  /* ---------- 2. Spielverlauf ---------- */
  let VERLAUF="";
  if(on("verlauf")){
    const V=[];
    const inP=(q,i)=>q.t>=i*1200&&q.t<(i+1)*1200;
    const dblTxt=i=>on("dbl")&&dbl&&inP(dbl,i)&&!(on("blitz")&&dbl.t>=blitz.from.t&&dbl.t<=blitz.to.t)?pick([` – darunter ein Doppelschlag innerhalb von ${dbl.gap} Sekunden`,`, zweimal davon innerhalb von nur ${dbl.gap} Sekunden`,` – zwei Treffer fielen binnen ${dbl.gap} Sekunden`],"doppel"):"";
    const f=on("start")?f0:null;
    if(f){
      const m=repMin(f.t), who=nm(f.scorer);
      if(f.our)V.push(f.t<300?pick([`Die Grizzlys erwischten einen Traumstart: ${who?who+" traf":"Der Puck lag"} schon in der ${m}. Minute zum ${f.s}${who?"":" im Netz"}.`,`Der Start hätte kaum besser laufen können – nach ${f.t%60>=30?"knapp ":""}${Math.max(1,Math.round(f.t/60))} Minuten stand es bereits ${f.s}${who?` durch ${who}`:""}.`,`Früh jubelten die Grizzlys: ${who?`${repCap(who)} traf`:"Das 1:0 fiel"} bereits in der ${m}. Minute${who?` zum ${f.s}`:""}.`,`Kaum hatte das Spiel begonnen, ${who?`sorgte ${who}`:"sorgten die Grizzlys"} in der ${m}. Minute für das ${f.s}.`,`Schneller Start: In der ${m}. Minute führten die Grizzlys ${who?`durch ${who} `:""}mit ${f.s}.`],"start-frueh")
        :pick([`In der ${m}. Minute ${who?`brachte ${who} die Grizzlys mit ${f.s} in Führung`:`gingen die Grizzlys mit ${f.s} in Führung`}.`,`Das erste Tor des Spiels gehörte den Grizzlys: ${who?`${repCap(who)} traf`:"Es fiel"} in der ${m}. Minute zum ${f.s}.`,`In der ${m}. Minute war der Bann gebrochen – ${who?`${who} erzielte das ${f.s}`:`die Grizzlys gingen mit ${f.s} in Führung`}.`,`Für das ${f.s} sorgte${who?` ${who}`:"n die Grizzlys"} in der ${m}. Minute.`],"start"));
      else V.push(f.t<300?pick([`Der Start ging daneben: Schon in der ${m}. Minute gingen ${oppN} in Führung.`,`Ein früher Dämpfer: Bereits in der ${m}. Minute lagen die Grizzlys zurück.`,`Der Auftakt gehörte ${oppD}: In der ${m}. Minute fiel das ${f.s}.`,`Kalte Dusche in der ${m}. Minute: ${OppN} gingen in Führung.`],"start-gegner-frueh")
        :pick([`In der ${m}. Minute gingen ${oppN} mit ${f.s} in Führung.`,`Das erste Tor erzielten ${oppN} – in der ${m}. Minute stand es ${f.s}.`,`In der ${m}. Minute lagen die Grizzlys mit ${f.s} hinten.`],"start-gegner"));
    }
    const PL=per.map(v=>v.join(":"));
    const compact=aufbau==="zahlen";
    if(compact){
      V.push(pick([`Die Drittel endeten ${repList(PL)}.`,`Drittel für Drittel: ${PL.join(", ")}.`,`Die Drittelergebnisse lauteten ${repList(PL)}.`,`Zu den Pausen stand es ${st[0].join(":")} und ${st[1].join(":")}${xtra?`, nach 60 Minuten ${st[2].join(":")}`:""}.`],"zahlen-drittel"));
    }else{
    const [p1a]=per[0],[c1a,c1b]=st[0];
    if(f&&f.our&&p1a>1&&c1a>c1b)V.push(pick([`Bis zur ersten Pause legten die Grizzlys bis zum ${c1a}:${c1b} nach${dblTxt(0)}.`,`Danach ging es Schlag auf Schlag – nach 20 Minuten hieß es ${c1a}:${c1b}${dblTxt(0)}.`,`Die Grizzlys blieben dran und führten zur ersten Pause mit ${c1a}:${c1b}${dblTxt(0)}.`,`Und es ging so weiter: Nach dem ersten Drittel stand es ${c1a}:${c1b}${dblTxt(0)}.`],"p1-ausbau"));
    else if(c1a>c1b)V.push(pick([`Mit ${c1a}:${c1b} ging es in die erste Pause${dblTxt(0)}.`,`Nach 20 Minuten führten die Grizzlys mit ${c1a}:${c1b}${dblTxt(0)}.`,`Zur ersten Pause lagen die Grizzlys mit ${c1a}:${c1b} vorn${dblTxt(0)}.`,`Das erste Drittel ging mit ${c1a}:${c1b} an die Grizzlys${dblTxt(0)}.`],"p1-fuehrung"));
    else if(c1a<c1b)V.push(pick([`Zur ersten Pause lagen die Grizzlys mit ${c1a}:${c1b} hinten.`,`Nach dem ersten Drittel hieß es ${c1a}:${c1b} – die Grizzlys mussten einem Rückstand hinterherlaufen.`,`Nach 20 Minuten stand ein ${c1a}:${c1b} auf der Anzeigetafel – die Grizzlys mussten aufholen.`,`Das erste Drittel ging an ${oppN}, ${c1a}:${c1b} hieß es zur Pause.`],"p1-rueckstand"));
    else V.push(c1a===0?pick(["Das erste Drittel blieb torlos.","Im ersten Drittel neutralisierten sich beide Teams, Tore fielen keine.","Torlos ging es in die erste Pause.","Nach 20 Minuten stand es noch 0:0."],"p1-null"):pick([`Mit ${c1a}:${c1b} ging es in die erste Pause.`,`Nach dem ersten Drittel war alles offen: ${c1a}:${c1b}.`,`Ausgeglichen ging es in die Kabinen – ${c1a}:${c1b} nach 20 Minuten.`],"p1-gleich"));
    for(const i of [1,2]){
      const [pa,pb]=per[i],[ca,cb]=st[i],[qa,qb]=st[i-1], name=i===1?"Im Mitteldrittel":"Im Schlussdrittel", after=i===1?"nach 40 Minuten":"am Ende", sl="p"+(i+1)+"-";
      if(i===2&&xtra){V.push(pa+pb?`${name} ${pa>pb?"kamen die Grizzlys zurück":pa<pb?"glichen "+oppN+" aus":"blieb es spannend"} – nach 60 Minuten stand es ${ca}:${cb}, die Entscheidung musste ${xtra} fallen.`:pick([`Auch im Schlussdrittel fiel keine Entscheidung, nach 60 Minuten stand es ${ca}:${cb}. So musste es ${xtra} weitergehen.`,`Im Schlussdrittel blieben beide Teams ohne Treffer – beim Stand von ${ca}:${cb} ging es ${xtra}.`],"p3-x"));continue}
      if(pa===0&&pb===0){V.push(pick([`${name} fielen keine Tore${i===2?"":`, es blieb beim ${ca}:${cb}`}.`,i===1?`Das Mitteldrittel blieb torlos, es blieb beim ${ca}:${cb}.`:`Im Schlussdrittel änderte sich am Ergebnis nichts mehr.`,`${name} blieben beide Torhüter ohne Gegentreffer${i===1?` – weiter ${ca}:${cb}`:""}.`],sl+"null"));continue}
      if(qa<=qb&&ca>cb)V.push(pick([`${name} kam die Wende: Mit ${pa}:${pb} in diesem Abschnitt drehten die Grizzlys das Spiel zum ${ca}:${cb}${dblTxt(i)}.`,`${name} schlug dann die große Stunde des Teams: ${pa}:${pb} hieß es in diesem Drittel, ${after} ${ca}:${cb}${dblTxt(i)}.`,`${name} drehten die Grizzlys die Partie: ${pa}:${pb} in diesem Abschnitt, ${after} ${ca}:${cb}${dblTxt(i)}.`],sl+"wende"));
      else if(qa<qb&&ca===cb)V.push(pick([`${name} glichen die Grizzlys zum ${ca}:${cb} aus.`,`${name} gelang den Grizzlys der Ausgleich – ${after} stand es ${ca}:${cb}.`,`${name} holten die Grizzlys den Rückstand auf (${pa}:${pb}), ${after} ${ca}:${cb}.`],sl+"ausgleich"));
      else if(qa>=qb&&ca<cb)V.push(pick([`${name} kippte das Spiel: ${OppN} gewannen den Abschnitt mit ${pb}:${pa}, ${after} stand es ${ca}:${cb}.`,`${name} drehte sich das Spiel: ${OppN} entschieden den Abschnitt mit ${pb}:${pa} für sich, ${after} ${ca}:${cb}.`,`${name} lief es nicht mehr rund – ${pb}:${pa} für ${oppN}, ${after} ${ca}:${cb}.`],sl+"kippt"));
      else if(pa>pb&&ca>cb)V.push(i===1?pick([`${name} legten die Grizzlys nach und schraubten das Ergebnis auf ${ca}:${cb}${dblTxt(i)}.`,`Auch im zweiten Abschnitt blieb die Mannschaft am Drücker: ${pa}:${pb} in diesem Drittel, ${ca}:${cb} nach 40 Minuten${dblTxt(i)}.`,`${name} bauten die Grizzlys ihren Vorsprung aus – ${ca}:${cb} nach 40 Minuten${dblTxt(i)}.`,`Im zweiten Abschnitt ging es im gleichen Stil weiter: ${pa}:${pb}, damit ${ca}:${cb}${dblTxt(i)}.`],sl+"ausbau"):pick([`${name} ließ das Team nicht nach und traf noch ${repMal(pa)}${dblTxt(i)}.`,`Und auch im letzten Drittel ging es so weiter: ${pa}:${pb} hieß es hier${dblTxt(i)}.`,`${name} legte das Team noch ${repMal(pa)} nach${dblTxt(i)}.`,`Auch nach der zweiten Pause blieben die Grizzlys gefährlich und trafen noch ${repMal(pa)}${dblTxt(i)}.`],sl+"ausbau"));
      else if(pa<pb&&ca>cb)V.push(pick([`${name} kamen ${oppN} ${pb-pa>=2?"noch einmal":"etwas"} heran (${pa}:${pb}), ${after} ${i===2?"reichte es aber":"lagen die Grizzlys aber weiter"} ${i===2?`zum ${ca}:${cb}`:`mit ${ca}:${cb} vorn`}.`,`${name} verkürzten ${oppN} (${pa}:${pb} in diesem Abschnitt), ${after} hieß es ${ca}:${cb}.`,`${name} gehörte der Abschnitt ${oppD} (${pa}:${pb}), die Führung hielt aber – ${after} ${ca}:${cb}.`],sl+"verkuerzt"));
      else if(pa>pb&&ca<cb)V.push(pick([`${name} kämpften sich die Grizzlys heran (${pa}:${pb}), ${i===2?"zum Ausgleich reichte es aber nicht":`nach 40 Minuten stand es ${ca}:${cb}`}.`,`${name} verkürzten die Grizzlys (${pa}:${pb}), ${i===2?"für mehr reichte es nicht":`nach 40 Minuten hieß es ${ca}:${cb}`}.`],sl+"heran"));
      else if(ca===cb)V.push(pick([`${name} ging es hin und her (${pa}:${pb}), ${after} stand es ${ca}:${cb}.`,`${name} wurde es turbulent: ${pa}:${pb} hieß es in diesem Abschnitt, ${after} ${ca}:${cb}.`,...(pa>0&&pb>0?[`${name} trafen beide Teams (${pa}:${pb}), ${after} ${ca}:${cb}.`]:[])],sl+"hinher"));
      else if(pa<pb)V.push(pick([`${name} bauten ${oppN} ihre Führung auf ${ca}:${cb} aus.`,`${name} legten ${oppN} nach, ${after} stand es ${ca}:${cb}.`,`${name} zogen ${oppN} weiter davon, ${after} ${ca}:${cb}.`],sl+"gegner"));
      else V.push(pick([`${name} ging es hin und her (${pa}:${pb}), ${after} stand es ${ca}:${cb}.`,`${name} fielen auf beiden Seiten Tore (${pa}:${pb}), ${after} ${ca}:${cb}.`],sl+"rest"));
    }
    }
    if(on("blitz")&&hookUsed!=="blitz"){const m=Math.max(1,Math.ceil(blitz.span/60));V.push(pick([`Dann ging alles ganz schnell: Innerhalb von nur ${m} Minute${m===1?"":"n"} schraubten die Grizzlys das Ergebnis von ${blitz.before} auf ${blitz.to.s}.`,`Ein Wirbelsturm auf dem Eis: Zwischen der ${repMin(blitz.from.t)}. und der ${repMin(blitz.to.t)}. Minute klingelte es dreimal im gegnerischen Kasten – aus ${blitz.before} wurde ${blitz.to.s}.`,`Drei Treffer in nur ${m} Minute${m===1?"":"n"}: Zwischen der ${repMin(blitz.from.t)}. und der ${repMin(blitz.to.t)}. Minute stellten die Grizzlys von ${blitz.before} auf ${blitz.to.s}.`],"blitz"))}
    if(on("lc"))V.push(pick([`Ein echtes Hin und Her: ${repCap(repMal(lc))} wechselte die Führung.`,`Für Spannung war gesorgt – die Führung wechselte ${repMal(lc)} die Seiten.`,`Die Führung wechselte ${repMal(lc)} – ein Spiel mit vielen Wendungen.`],"wechsel"));
    if(on("lateEq")){const w=nm(lateEq.scorer);V.push(pick([`Dann der Moment des Spiels: In der ${repMin(lateEq.t)}. Minute ${w?`traf ${w} zum umjubelten ${lateEq.s}-Ausgleich`:`fiel der umjubelte Ausgleich zum ${lateEq.s}`}.`,`Und dann die ${repMin(lateEq.t)}. Minute: ${w?`${repCap(w)} erzielte`:"Die Grizzlys erzielten"} den Ausgleich zum ${lateEq.s} – die Bank stand Kopf.`,`In der ${repMin(lateEq.t)}. Minute kam der Ausgleich: ${w?`${repCap(w)} traf`:"Die Grizzlys trafen"} zum ${lateEq.s}.`],"spaet-ausgleich"))}
    if(on("late")&&lateWin){const w2=nm(G.find(q=>q.t===leadAt).scorer);V.push(pick([`Den entscheidenden Treffer erzielten die Grizzlys erst in der ${repMin(leadAt)}. Minute${w2?` durch ${w2}`:""}.`,`Die Entscheidung fiel spät: In der ${repMin(leadAt)}. Minute ${w2?`traf ${w2} zum Siegtreffer`:"fiel das Siegtor für die Grizzlys"}.`,`Erst in der ${repMin(leadAt)}. Minute gingen die Grizzlys entscheidend in Führung${w2?` – Torschütze war ${w2}`:""}.`],"spaet-sieg"))}
    else if(on("late")&&honor)V.push(pick([`Den Ehrentreffer für ${oppN} gab es in der ${repMin(theirs[0].t)}. Minute.`,`In der ${repMin(theirs[0].t)}. Minute gelang ${oppD} der Ehrentreffer.`,`${OppN} kamen in der ${repMin(theirs[0].t)}. Minute zu ihrem einzigen Treffer.`],"ehrentreffer"));
    if(on("en")){const w=nm(enLast.scorer);V.push(pick([`Den Schlusspunkt setzte ${w||"die Mannschaft"} in der ${repMin(enLast.t)}. Minute mit einem Treffer ins verwaiste Tor.`,`Als ${oppN} ihren Torhüter für einen sechsten Feldspieler vom Eis nahmen, machte ${w||"die Mannschaft"} mit einem Schuss ins leere Tor alles klar.`,`In der ${repMin(enLast.t)}. Minute traf ${w||"die Mannschaft"} ins leere Tor und setzte den Schlusspunkt.`],"leeres-tor"))}
    VERLAUF=V.join(" ");
  }

  /* ---------- 3. Mannschaftsleistung ---------- */
  let LEIST="";
  {
    const M=[];
    if(det){
      const X=repW(pp)==="ein"?"eine":repW(pp), Y=repW(mine.ppOpp)==="ein"?"einer":repW(mine.ppOpp);
      const ppTxt=on("pp")&&!KS.neg.has("pp")?(mine.ppOpp>=pp?pick([`in Überzahl nutzten die Grizzlys ${X} von ${Y} Gelegenheit${mine.ppOpp===1?"":"en"}`,`im Powerplay trafen die Grizzlys ${repMal(pp)} bei ${Y} Gelegenheit${mine.ppOpp===1?"":"en"}`],"pp"):`in Überzahl schlug die Mannschaft ${repMal(pp)} zu`):"";
      const pkTxt=on("pk")?pick([`alle ${repW(pk)} Unterzahlsituationen überstanden sie ohne Gegentor`,`in ${repW(pk)} Unterzahlsituationen ließen sie kein Gegentor zu`],"pk"):"";
      if(ppTxt&&pkTxt)M.push(pick([`Auch die Special Teams überzeugten: ${repCap(ppTxt)}, und ${pkTxt}.`,`Stark in den Special Teams: ${repCap(ppTxt)}, ${pkTxt}.`,`Überzahl und Unterzahl passten: ${repCap(ppTxt)}, und ${pkTxt}.`],"special"));
      else if(ppTxt)M.push(pick([`${repCap(ppTxt)}.`,`Ein Pluspunkt war das Powerplay: ${ppTxt}.`],"pp-satz"));
      else if(pkTxt)M.push(pick([`In Unterzahl stand die Defensive sicher – ${pkTxt}.`,`Auch in Unterzahl war Verlass auf die Defensive: ${pkTxt}.`,`Das Penaltykilling funktionierte – ${pkTxt}.`],"pk-satz"));
      if(on("sh"))M.push(sh===1?pick(["Sogar in Unterzahl gelang ein Treffer.","Bemerkenswert: Ein Tor fiel sogar in Unterzahl.","Selbst mit einem Spieler weniger auf dem Eis trafen die Grizzlys einmal."],"unterzahl-tor"):`Sogar in Unterzahl gelangen ${repW(sh)} Treffer.`);
      if(on("pim")&&!KS.neg.has("pim"))M.push(mine.pim===0?pick(M.length?["Dazu blieb die Mannschaft ganz ohne Strafminuten.","Dazu kam die Mannschaft ganz ohne Strafe aus."]:["Die Mannschaft blieb ganz ohne Strafminuten.","Kein einziges Mal mussten die Grizzlys auf die Strafbank.","Strafminuten? Fehlanzeige – die Grizzlys spielten komplett ohne Strafe."],"pim0"):pick(M.length?[`Dazu blieb sie mit nur ${mine.pim} Strafminuten diszipliniert.`,`Dazu kamen nur ${mine.pim} Strafminuten.`]:[`Die Mannschaft blieb mit nur ${mine.pim} Strafminuten diszipliniert.`,`Auf der Strafbank saßen die Grizzlys nur ${mine.pim} Minuten – eine disziplinierte Leistung.`,`Mit nur ${mine.pim} Strafminuten zeigte das Team viel Disziplin.`],"pim"));
      if(on("scorers")){
        if(ours.some(q=>q.scorer&&q.scorer.nr)){
          const N={}; ours.forEach(q=>[q.scorer,q.a1,q.a2].forEach(p=>{if(p&&p.nr)N[p.nr]="die Nr. "+p.nr}));
          const pts={}; ours.forEach(q=>{if(q.scorer)(pts[q.scorer.nr]=pts[q.scorer.nr]||{g:0,a:0}).g++;[q.a1,q.a2].forEach(p=>{if(p)(pts[p.nr]=pts[p.nr]||{g:0,a:0}).a++})});
          const top=Object.entries(pts).filter(([k])=>N[k]).map(([k,v])=>({k,...v,p:v.g+v.a})).sort((p,q)=>q.p-p.p||q.g-p.g)[0];
          if(top&&top.p>=3&&!(on("hat")&&top.k===hatNr)){const parts=[];if(top.g)parts.push(`${top.g===1?"einem":repW(top.g)} ${top.g===1?"Tor":"Toren"}`);if(top.a)parts.push(`${top.a===1?"einer":repW(top.a)} ${top.a===1?"Vorlage":"Vorlagen"}`);
            M.push(pick([`Erfolgreichster Scorer war ${N[top.k]} mit ${parts.join(" und ")}.`,`Herausragend: ${N[top.k]} war an ${repW(top.p)==="ein"?"einem":repW(top.p)} Toren beteiligt (${parts.join(", ")}).`,`Besonders auffällig: ${N[top.k]} mit ${parts.join(" und ")}.`,`${repCap(N[top.k])} sammelte ${repW(top.p)} Scorerpunkte (${parts.join(", ")}).`],"topscorer"))}
          const list=Object.entries(by).sort((p,q)=>q[1]-p[1]).filter(([k])=>N[k]).map(([k,n])=>N[k]+(n>1?` (${n})`:""));
          if(list.length)M.push(list.length===1?(us>1?`Alle ${repW(us)} Tore erzielte ${list[0].replace(/ \(\d+\)$/,"")}.`:pick([`Das Tor erzielte ${list[0]}.`,`Getroffen hat ${list[0]}.`],"ein-tor")):pick([`Die Tore erzielten ${repList(list)}.`,`Für die Grizzlys trafen ${repList(list)}.`,`Torschützen: ${repList(list)}.`],"torliste"));
        }else M.push(pick([`Bemerkenswert: Die ${repW(us)} Tore verteilten sich auf ${repW(nS)} verschiedene Schützen – ein echter Mannschaftserfolg.`,`Gefährlich war dabei die ganze Mannschaft: ${repCap(repW(nS))} verschiedene Spieler trugen sich in die Torschützenliste ein.`,`${repCap(repW(nS))} verschiedene Torschützen – die Tore verteilten sich auf viele Schultern.`],"schuetzen"));
      }
    }
    if(on("hat")&&hookUsed!=="hat")M.push(pick([`Ein ganz besonderes Spiel erlebte die Nr. ${hatNr}: Sie traf ${by[hatNr]===3?"dreimal":repMal(by[hatNr])} und schnürte damit einen Hattrick.`,`Hut ab vor der Nr. ${hatNr}: ${by[hatNr]===3?"Drei":repCap(repW(by[hatNr]))} Tore – ein Hattrick${by[hatNr]>3?" und mehr":""}!`,`Die Nr. ${hatNr} durfte ${repMal(by[hatNr])} jubeln – Hattrick!`],"hattrick"));
    if(on("shutout")){
      const k=mine?(mine.keepers||[]).filter(q=>q.min>0):[];
      if(k.length===1&&k[0].nr)M.push(pick([`Hinten hielt die Nr. ${k[0].nr} den Kasten sauber.`,`Die Nr. ${k[0].nr} blieb im Tor ohne Gegentreffer.`,`Shutout für die Nr. ${k[0].nr} im Tor der Grizzlys.`],"null-keeper"));
      else if(k.length===2&&k.every(q=>q.nr))M.push(`Im Tor teilten sich die Nr. ${k[0].nr} und die Nr. ${k[1].nr} die Spielzeit und blieben ohne Gegentor.`);
      else if(hookUsed!=="shutout")M.push(pick(["Hinten blieb das Tor der Grizzlys sauber – kein einziges Gegentor.","Die Defensive ließ keinen Gegentreffer zu.","Zu null – kein Gegentor für die Grizzlys."],"null"));
    }
    LEIST=M.join(" ");
  }

  /* ---------- 4. Tabelle, Duell, Ausblick ---------- */
  const A=[];
  if(on("table")){const what=tab.w?"dem Sieg":diff===0?"dem Unentschieden":"der Niederlage", R=tab.meR, sp=`${R.p} Punkte aus ${R.gp} ${R.gp===1?"Spiel":"Spielen"}`;
    A.push(pick([`Nach ${what} steht die ${T} auf Platz ${R.r} der Tabelle (${sp}).`,`In der Tabelle bedeutet das Platz ${R.r} – ${sp}.`,`Mit ${sp} belegt die ${T} Platz ${R.r}.`,`Platz ${R.r} mit ${sp} – so steht die ${T} nach ${what} da.`],"tabelle"))}
  if(on("streak")&&tab.w&&tab.n>=2)A.push(pick([`Es ist bereits der ${NUMN(tab.n)} Sieg in Folge.`,`Damit hält die Serie: ${repCap(NUMN(tab.n))} Sieg nacheinander.`,`${repCap(repW(tab.n))} Siege in Serie – die Mannschaft ist in Form.`],"serie"));
  if(on("streak")&&tab.drought)A.push(pick(["Damit ist auch die kleine Durststrecke beendet.","Nach zwei Spielen ohne Sieg ist der Bann gebrochen.","Endlich wieder ein Sieg."],"durststrecke"));
  if(on("duel")){
    if(diff>0&&prU<prT)A.push(pick([`Damit gelang auch die Revanche für die ${prU}:${prT}-Niederlage im ersten Duell.`,`Revanche geglückt: Das erste Duell hatten die Grizzlys noch ${prU}:${prT} verloren.`,`Die ${prU}:${prT}-Niederlage aus dem ersten Aufeinandertreffen ist damit wettgemacht.`],"revanche"));
    else if(diff>0&&prU>prT)A.push(pick([`Schon das erste Duell hatten die Grizzlys mit ${prU}:${prT} gewonnen.`,`Auch im ersten Aufeinandertreffen hatten die Grizzlys mit ${prU}:${prT} die Nase vorn.`],"duell-zwei-siege"));
    else if(diff<0&&prU>prT)A.push(pick([`Im ersten Duell hatte es noch einen ${prU}:${prT}-Sieg gegeben.`,`Das erste Aufeinandertreffen hatten die Grizzlys noch mit ${prU}:${prT} gewonnen.`],"duell-damals-sieg"));
    else A.push(pick([`Das erste Duell war ${prU}:${prT} ausgegangen.`,`Im ersten Aufeinandertreffen hatte es ${prU}:${prT} gestanden.`],"duell"));
  }
  if(on("fazit")){
    const FZ=diff>0?(on("comeback")?["Wer so zurückkommt, hat Charakter bewiesen.","Dieser Sieg zeigt, was in dieser Mannschaft steckt.","Aufgeben gibt es nicht – das hat die Mannschaft eindrucksvoll gezeigt.","Ein Sieg mit ganz viel Herz.","Moral und Zusammenhalt haben sich ausgezahlt."]
      :xtra||diff===1?["Ein Sieg für die Nerven – und einer, der zusammenschweißt.","Solche Spiele gewinnt man als Team.","Am Ende zählen die Punkte – und die gehören den Grizzlys.","Knappe Siege sind manchmal die schönsten.","Starke Nerven in der entscheidenden Phase."]
      :diff>=5?["Ein Auftritt, an den man sich gern erinnert.","So macht Eishockey Spaß.","Ein Spiel, das Selbstvertrauen gibt.","Ein rundum gelungener Auftritt.","Davon darf es gern mehr geben."]
      :["Ein Sieg, der Lust auf mehr macht.","Die Mannschaft darf stolz auf diesen Auftritt sein.","So darf es gerne weitergehen.","Ein gelungener Auftritt der ganzen Mannschaft.","Mit diesem Sieg im Rücken geht es ins nächste Spiel."])
      :diff===0?(on("lateEq")?["Ein Punkt, der sich wie ein Sieg anfühlt.","Wer bis zur letzten Minute an sich glaubt, wird belohnt.","Moral, die mit einem Punkt belohnt wurde.","Bis zum Schluss gekämpft – und belohnt."]:["Ein Punkt, mit dem man leben kann.","Am Ende ein gerechtes Unentschieden.","Beide Teams begegneten sich auf Augenhöhe.","Ein Punkt, auf dem sich aufbauen lässt."])
      :ahead?["Bitter, eine Führung so aus der Hand zu geben – daraus wird die Mannschaft lernen.","Ärgerlich, aber die starken Phasen machen Mut.","Die gute Phase zeigt, was möglich ist.","Aus solchen Spielen lernt man am meisten."]
      :diff>=-2?["Ärgerlich, aber auf dieser Leistung lässt sich aufbauen.","Knapp daneben ist auch vorbei – beim nächsten Mal springt die Scheibe hoffentlich auf die andere Seite.","Der Abstand war klein – beim nächsten Mal soll es für Punkte reichen.","Die Mannschaft war dran, am Ende fehlte das letzte Quäntchen."]
      :["Abhaken, Mund abputzen, weitermachen.","Ein Spiel zum Lernen – der Blick geht nach vorn.","Kopf hoch – das nächste Spiel kommt bestimmt.","Solche Tage gibt es – wichtig ist, was man daraus mitnimmt.","Weiter arbeiten, weiter lernen."];
    A.push(pick(FZ,"fazit-"+(diff>0?(on("comeback")?"cb":xtra||diff===1?"knapp":diff>=5?"hoch":"sieg"):diff===0?(on("lateEq")?"spaet":"remis"):ahead?"fuehrung":diff>=-2?"knapp-n":"hoch-n")));
  }
  if(on("next"))A.push(nextTxt());

  /* ---------- Zusammensetzen je nach Aufbau ---------- */
  const P=[lead];
  const teamFirst=aufbau==="team"&&LEIST.length>=140&&!!VERLAUF; /* nur wenn es zur Mannschaftsleistung genug zu erzählen gibt */
  if(teamFirst){P.push(LEIST);P.push(VERLAUF);if(KS.length)P.push(KS.join(" "))}else{P.push(VERLAUF);if(KS.length)P.push(KS.join(" "));P.push(LEIST)}
  if(A.length)P.push(A.join(" "));
  return {title:repTitle(g,diff,sc,opp,xtra,behind,pick),text:P.filter(Boolean).join("\n\n"),facts:F,bausteine:used};
}
function repTitle(g,diff,sc,opp,xtra,behind,pick){
  const T=teamName(g.team); pick=pick||(a=>a[0]);
  if(diff>0){
    if(diff>=5)return pick([`Kantersieg: ${T} gewinnt ${sc} gegen ${opp}`,`Torfestival: ${T} schlägt ${opp} ${sc}`,`${T} feiert ${sc}-Kantersieg gegen ${opp}`,`Deutlicher ${sc}-Erfolg der ${T} gegen ${opp}`,`${sc}! ${T} lässt ${opp} keine Chance`],"titel-hoch");
    if(xtra)return pick([`${T} gewinnt ${xtra} ${sc}`,`${repCap(xtra)}: ${T} schlägt ${opp} ${sc}`,`Krimi gegen ${opp}: ${T} siegt ${xtra}`,`Extraschicht zahlt sich aus: ${T} gewinnt ${sc}`],"titel-x");
    if(behind)return pick([`${T} dreht das Spiel und gewinnt ${sc}`,`Comeback: ${T} schlägt ${opp} ${sc}`,`Nach Rückstand: ${T} siegt ${sc} gegen ${opp}`,`${T} kämpft sich zum ${sc} gegen ${opp}`],"titel-gedreht");
    return pick([`${T}: ${sc}-Sieg gegen ${opp}`,`${T} schlägt ${opp} ${sc}`,`Sieg gegen ${opp}: ${T} gewinnt ${sc}`,`${sc} – ${T} holt die Punkte gegen ${opp}`,`${T} setzt sich ${sc} gegen ${opp} durch`],"titel-sieg");
  }
  if(diff===0)return pick([`${T}: ${sc} gegen ${opp}`,`Punkteteilung zwischen ${T} und ${opp}`,`${sc}: ${T} holt einen Punkt gegen ${opp}`,`Unentschieden: ${T} und ${opp} trennen sich ${sc}`],"titel-remis");
  if(xtra)return pick([`${T} unterliegt ${opp} ${xtra}`,`Knapp: ${T} verliert ${xtra} ${sc}`,`${repCap(xtra)}: ${T} unterliegt ${opp} ${sc}`],"titel-niederlage-x");
  return pick([`${T} unterliegt ${opp} ${sc}`,`${sc}-Niederlage der ${T} gegen ${opp}`,`${T} verliert gegen ${opp} ${sc}`,`Keine Punkte gegen ${opp}: ${T} verliert ${sc}`],"titel-niederlage");
}
window.repDraft=repDraft;

  return { rkey, repEhvGame, repDraft, repTitle, repAiPrompt, repKeywordSentences };
}
if (typeof module === "object" && module.exports) module.exports = createSpielbericht;
else root.createSpielbericht = createSpielbericht;
})(typeof globalThis !== "undefined" ? globalThis : this);
