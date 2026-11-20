/* Young Grizzlys – Firebase/Daten (Modul, ab 1.39.0 eigene Datei) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, getDocs, onSnapshot, query, where, orderBy, limit, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getMessaging, getToken, deleteToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-Dqjj-vNMYA8QRc3SGeivMDRjEHjwKe0",
  authDomain: "grizzlys-u15.firebaseapp.com",
  projectId: "grizzlys-u15",
  storageBucket: "grizzlys-u15.firebasestorage.app",
  messagingSenderId: "595868074479",
  appId: "1:595868074479:web:2ac44da77d0dc533ac361a"
};
const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";
const FIREBASE_VAPID_KEY = "BBIBjtlQVluCnG3m3WbJsoGV_XWh1AxPyPThCBLbmBeN-CmmV0MT7ViOJua7ImORX-ufpgTdghoJjxP5gMNpMGk";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, "europe-west1");
// Admin: Spielplan der App mit dem EHV-Spielplan vergleichen (Cloud Function scheduleCheck, nur lesend)
document.getElementById("ehvCheckBtn")?.addEventListener("click",async e=>{
  const btn=e.currentTarget, box=document.getElementById("ehvCheckResult");
  btn.disabled=true; box.hidden=false; box.textContent="Abgleich läuft …";
  try{ const r=await httpsCallable(functions,"scheduleCheck")({}); window.renderEhvCheck(r.data,box); }
  catch(err){ console.error(err); box.textContent="Abgleich nicht möglich. Bitte prüfen, ob du als Admin angemeldet bist und die Function „scheduleCheck“ deployt ist."; }
  finally{ btn.disabled=false; }
});
let messaging = null;
let results = {};

window.firebaseReady = false;
window.firebaseResults = results;

function resultKey(g){ return g.date + "_" + g.time.replace(/:/g,"") + "_" + g.team; }
function resultFor(g){ return results[resultKey(g)] || null; }
function resultBadge(g){
  const r=resultFor(g);
  if(!r || r.homeScore===undefined || r.awayScore===undefined || r.homeScore==="" || r.awayScore==="") return "";
  const hs=Number(r.homeScore), as=Number(r.awayScore);
  const homeTeamIsGrizzlys=isHome(g);
  const grizzlysScore=homeTeamIsGrizzlys?hs:as;
  const opponentScore=homeTeamIsGrizzlys?as:hs;
  const ri=resInfo(g), outcome=(ri?outLabel(ri):"").toUpperCase();
  const outcomeClass=ri?{w:"sieg",l:"niederlage",d:"unentschieden"}[ri.o]:"";
  return `<div class="resultBadge">ENDERGEBNIS <strong>${esc(String(hs))}:${esc(String(as))}</strong> · <span class="resultOutcome ${outcomeClass}">${outcome}</span></div>`;
}
window.resultFor=resultFor;
window.resultBadge=resultBadge;

async function loadResults(){
  try{
    const snap=await getDocs(collection(db,"results"));
    results={}; snap.forEach(d=>results[d.id]=d.data());
    window.firebaseResults=results;
  }catch(err){ console.warn("Firestore Ergebnisse konnten nicht geladen werden",err); }
  finally{ window.resultsLoading=false; window.applyResults?.(); }
}

/* 1.26.0: Live-Ticker – Spielstände von heute in Echtzeit (Firestore „live“, geschrieben von der Function liveTicker) */
window.liveGames={};
let liveUnsub=null, liveDay="";
function liveBerlinToday(){return new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Berlin"}).format(new Date())}
function startLive(){
  const day=liveBerlinToday(); if(liveUnsub&&day===liveDay)return;
  try{liveUnsub&&liveUnsub()}catch(e){}
  liveDay=day;
  try{
    liveUnsub=onSnapshot(query(collection(db,"live"),where("date","==",day)),snap=>{
      const m={}; snap.forEach(d=>{m[d.id]=d.data()}); window.liveGames=m;
      try{window.liveRefresh&&window.liveRefresh()}catch(e){console.warn(e)}
    },err=>console.warn("Live-Ticker nicht abrufbar",err));
  }catch(err){console.warn("Live-Ticker nicht gestartet",err)}
}
/* Tageswechsel und Zurückkehren in die App: Abo erneuern */
document.addEventListener("visibilitychange",()=>{if(!document.hidden)startLive()});
setInterval(startLive,10*60*1000);

/* 1.28.0: Fan-Tipp – Zusammenfassung lesen (fanTipStats), eigenen Tipp speichern (fanTips) */
window.ftStats={};
window.ftLoad=async function(key){
  try{const d=await getDoc(doc(db,"fanTipStats",key));window.ftStats[key]=d.exists()?d.data():{n:0,w:0,d:0,l:0,scores:{}}}
  catch(err){console.warn("Fan-Tipps nicht abrufbar",err);window.ftStats[key]=window.ftStats[key]||null}
  return window.ftStats[key];
};
window.ftSave=async function(g,key,hs,as){
  const id=key+"__"+String(getInstallationId()).replace(/[^A-Za-z0-9_-]/g,"").slice(0,64);
  await setDoc(doc(db,"fanTips",id),{gameId:key,team:g.team,hs,as,g:/grizzlys/i.test(g.home)?"h":"a",createdAt:serverTimestamp()});
};
let scheduleOverrides = {};
function scheduleGameId(g){ return g._baseId || (g._baseId = g.date + "_" + g.time.replace(/:/g,"") + "_" + g.team); }
function applyScheduleOverrides(){
  ALL_GAMES.forEach(g=>{
    if(!g._base){ g._base={day:g.day,date:g.date,time:g.time,home:g.home,away:g.away,stadium:g.stadium}; g._baseId=scheduleGameId(g); }
    const o=scheduleOverrides[g._baseId];
    if(o){ Object.assign(g,{day:o.day||g._base.day,date:o.date||g._base.date,time:o.time||g._base.time,home:o.home||g._base.home,away:o.away||g._base.away,stadium:o.stadium||g._base.stadium}); }
    else Object.assign(g,g._base);
    /* 1.40.3: Absage gilt nur für den Tag, an dem sie gesetzt wurde – wird das Spiel verlegt, ist es nicht mehr abgesagt */ g.cancelled=!!(o&&o.cancelled===true&&g.date===(o.cancelDate||o.originalDate||g.date)); /* 1.25.0: Spiel abgesagt – nur Anzeige */ g.postponed=!!(g.cancelled&&o.postponed===true); /* 1.44.2: verlegt, neuer Termin offen – gilt wie eine Absage (kein nächstes Spiel, keine Erinnerung), wird aber als „Verlegt“ angezeigt */
  });
}
async function loadScheduleOverrides(){
  try{
    const snap=await getDocs(collection(db,"scheduleOverrides"));
    scheduleOverrides={}; snap.forEach(d=>scheduleOverrides[d.id]=d.data());
    applyScheduleOverrides();
    renderNext(); renderList(); renderOpponents();
    if(window.applyResults) window.applyResults();
    if(auth.currentUser?.uid===ADMIN_UID){ adminScheduleEditor(); adminNewsEditor(); }
    window.renderNews?.();
  }catch(err){ console.warn("Spielplanänderungen konnten nicht geladen werden",err); }
}
function adminScheduleEditor(){
  const box=document.getElementById("adminSchedule"); if(!box) return;
  const _now=Date.now(), arr=ALL_GAMES.slice().sort((a,b)=>{const x=+dt(a)>=_now-1.5*36e5, y=+dt(b)>=_now-1.5*36e5; return x!==y?(x?-1:1):(x?dt(a)-dt(b):dt(b)-dt(a));});
  box.innerHTML=arr.map(g=>{
    const id=scheduleGameId(g), base=g._base||g, changed=!!scheduleOverrides[id];
    return `<div class="adminScheduleGame" data-schedule-id="${esc(id)}">
      <div><b>${esc(teamName(g.team))}</b> · ${esc(fmtDate(g))} · ${esc(g.time)} Uhr${changed?'<span class="scheduleChanged">GEÄNDERT</span>':''}</div>
      <div class="small" style="margin-top:3px">${esc(g.home)} – ${esc(g.away)}</div>
      <div class="adminScheduleGrid">
        <label>Datum<input class="scheduleDate" type="date" value="${esc(g.date)}"></label>
        <label>Uhrzeit<input class="scheduleTime" type="time" value="${esc(g.time)}"></label>
        <label>Heimteam<input class="scheduleHome" type="text" value="${esc(g.home)}"></label>
        <label>Auswärtsteam<input class="scheduleAway" type="text" value="${esc(g.away)}"></label>
        <label style="grid-column:1 / -1">Spielort<input class="scheduleStadium" type="text" value="${esc(g.stadium)}"></label>
      </div>
      <div class="adminScheduleActions"><button class="action saveSchedule" type="button">💾 Speichern</button>${changed?'<button class="action resetSchedule" type="button">↩️ Original</button>':''}</div>
    </div>`;
  }).join("");
  box.querySelectorAll(".saveSchedule").forEach(btn=>btn.onclick=async()=>{
    const row=btn.closest(".adminScheduleGame"), id=row.dataset.scheduleId, g=ALL_GAMES.find(x=>scheduleGameId(x)===id); if(!g)return;
    const date=row.querySelector(".scheduleDate").value, time=row.querySelector(".scheduleTime").value, home=row.querySelector(".scheduleHome").value.trim(), away=row.querySelector(".scheduleAway").value.trim(), stadium=row.querySelector(".scheduleStadium").value.trim();
    if(!date||!time||!home||!away||!stadium){alert("Bitte Datum, Uhrzeit, Heimteam, Auswärtsteam und Spielort vollständig ausfüllen.");return;}
    btn.disabled=true;
    try{
      const day=new Date(date+"T12:00:00").toLocaleDateString("de-DE",{weekday:"long"});
      await setDoc(doc(db,"scheduleOverrides",id),{gameId:id,team:g.team,originalDate:g._base.date,originalTime:g._base.time,day,date,time,home,away,stadium,updatedAt:serverTimestamp()});
      scheduleOverrides[id]={gameId:id,team:g.team,originalDate:g._base.date,originalTime:g._base.time,day,date,time,home,away,stadium};
      applyScheduleOverrides(); renderNext(); renderList(); renderOpponents(); adminScheduleEditor();
      alert("Spielplanänderung gespeichert und für alle Nutzer übernommen.");
    }catch(e){console.error(e);alert("Änderung konnte nicht gespeichert werden. Bitte prüfen, ob du als Admin angemeldet bist.");} finally{btn.disabled=false;}
  });
  box.querySelectorAll(".resetSchedule").forEach(btn=>btn.onclick=async()=>{
    const row=btn.closest(".adminScheduleGame"), id=row.dataset.scheduleId; if(!confirm("Änderung wirklich zurücksetzen?"))return;
    btn.disabled=true;
    try{ await deleteDoc(doc(db,"scheduleOverrides",id)); delete scheduleOverrides[id]; applyScheduleOverrides(); renderNext(); renderList(); renderOpponents(); adminScheduleEditor(); alert("Originaltermin wiederhergestellt."); }
    catch(e){console.error(e);alert("Änderung konnte nicht zurückgesetzt werden.");} finally{btn.disabled=false;}
  });
}
function adminEditor(){
  const box=document.getElementById("adminResults"); if(!box) return;
  const _now=Date.now(); box.innerHTML=ALL_GAMES.slice().sort((a,b)=>Math.abs(dt(a)-_now)-Math.abs(dt(b)-_now)).map(g=>{
    const r=resultFor(g)||{};
    const id=resultKey(g);
    return `<div class="adminGame" data-result-id="${id}">
      <div class="adminGameHead"><div><b>${teamName(g.team)}</b> · ${esc(fmtDate(g))} · ${esc(g.time)} Uhr</div><div class="small">${esc(g.home)} – ${esc(g.away)}</div></div>
      <div class="adminScore"><input class="scoreHome" inputmode="numeric" min="0" max="99" type="number" value="${r.homeScore??""}" aria-label="Heimtore"><span>:</span><input class="scoreAway" inputmode="numeric" min="0" max="99" type="number" value="${r.awayScore??""}" aria-label="Auswärtstore"><button class="action saveResult">Speichern</button>${r.homeScore!==undefined&&r.awayScore!==undefined?'<button class="action deleteResult">Löschen</button>':''}</div>
    </div>`;
  }).join("");
  box.querySelectorAll(".saveResult").forEach(btn=>btn.onclick=async()=>{
    const row=btn.closest(".adminGame"), g=ALL_GAMES.find(x=>resultKey(x)===row.dataset.resultId);
    const hs=row.querySelector(".scoreHome").value, as=row.querySelector(".scoreAway").value;
    if(hs===""||as===""){alert("Bitte beide Tore eintragen.");return;}
    if(Number(hs)===Number(as)){alert("Ein Unentschieden gibt es nicht. Bei Penaltyschießen bitte den Endstand mit Siegtreffer eintragen (z. B. 4:3) – „n.P.“ lässt sich im Spiel-Fenster anhaken.");return;}
    btn.disabled=true;
    try{
      await setDoc(doc(db,"results",row.dataset.resultId),{gameId:row.dataset.resultId,team:g.team,date:g.date,time:g.time,home:g.home,away:g.away,homeScore:Number(hs),awayScore:Number(as),updatedAt:serverTimestamp()});
      results[row.dataset.resultId]={gameId:row.dataset.resultId,team:g.team,date:g.date,time:g.time,home:g.home,away:g.away,homeScore:Number(hs),awayScore:Number(as)};
      window.applyResults?.(); adminEditor();
      alert("Ergebnis gespeichert.");
    }catch(e){alert("Speichern nicht möglich. Bitte prüfen, ob du als Admin angemeldet bist.");console.error(e)} finally{btn.disabled=false;}
  });
  box.querySelectorAll(".deleteResult").forEach(btn=>btn.onclick=async()=>{
    const row=btn.closest(".adminGame"); if(!confirm("Ergebnis wirklich löschen?"))return;
    btn.disabled=true;
    try{await deleteDoc(doc(db,"results",row.dataset.resultId)); delete results[row.dataset.resultId]; window.applyResults?.(); adminEditor();}catch(e){alert("Löschen nicht möglich.");}finally{btn.disabled=false;}
  });
}

function detectPlatform(){
  const ua=navigator.userAgent||"";
  const platform=navigator.userAgentData?.platform||navigator.platform||"";
  const isApple=/iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints>1);
  const isAndroid=/Android/i.test(ua) || /Android/i.test(platform);
  if(isApple) return "Apple";
  if(isAndroid) return "Android";
  return "Sonstiges";
}

/* 1.44.4: welche App (Test/Live) und Version das Token angelegt hat – für die Geräteliste im Admin-Bereich */
function pushAppInfo(){return {app:window.GRIZZLYS_TEST?"test":"live",ver:String((document.querySelector(".inVer")||{}).textContent||"").slice(0,20)}}
/* Gerät und Browser aus dem gespeicherten User-Agent, z. B. „Android 14 · SM-S918B · Chrome“ */
function devLabel(ua){ua=String(ua||"");let os=/iPhone/.test(ua)?"iPhone":/iPad/.test(ua)?"iPad":/Android/.test(ua)?"Android":/CrOS/.test(ua)?"Chromebook":/Windows/.test(ua)?"Windows":/Mac OS X/.test(ua)?"Mac":/Linux/.test(ua)?"Linux":"Sonstiges";
  const av=/Android (\d+)/.exec(ua);if(av)os+=" "+av[1];const md=/Android [\d.]+; ([^;)]+)[;)]/.exec(ua);const model=md&&md[1]!=="K"&&!/^wv$/.test(md[1])?md[1].trim():"";
  const br=/SamsungBrowser/.test(ua)?"Samsung Internet":/EdgA?\//.test(ua)?"Edge":/Firefox|FxiOS/.test(ua)?"Firefox":/OPR\//.test(ua)?"Opera":/CriOS|Chrome/.test(ua)?"Chrome":/Safari/.test(ua)?"Safari":"";
  return [os,model,br].filter(Boolean).join(" · ")}
function detectPlatformFromStoredUserAgent(ua){
  const value=ua||"";
  if(/iPhone|iPad|iPod/i.test(value)) return "Apple";
  if(/Android/i.test(value)) return "Android";
  return "Sonstiges";
}

function pushPrefs(){let r=true,m=true,ta=true,tb=true,lg=false,lp=false;try{const p=JSON.parse(localStorage.getItem("grizzlysPushPrefs")||"{}");if(p.results===false)r=false;if(p.reminders===false)m=false;if(p.teamA===false)ta=false;if(p.teamB===false)tb=false;if(p.liveGoals===true)lg=true;if(p.livePeriods===true)lp=true;}catch(e){}const o={results:r,reminders:m,teamA:ta,teamB:tb,liveGoals:lg,livePeriods:lp};/* 1.43.0: Spielbericht-Push, „Tore meiner Nummer“ und die Rückennummern je Mannschaft */try{const p=JSON.parse(localStorage.getItem("grizzlysPushPrefs")||"{}");o.reports=p.reports===true;o.liveMyNr=p.liveMyNr===true;o.myNr=window.myNrAll?window.myNrAll():{};}catch(e){}/* 1.35.0: weitere Mannschaften (z. B. teamU13) */try{const p=JSON.parse(localStorage.getItem("grizzlysPushPrefs")||"{}");(window.TEAM_KEYS||[]).forEach(k=>{if(k!=="A"&&k!=="B")o["team"+k]=p["team"+k]===true});}catch(e){}return o;}
window.savePushPrefs=async function(){try{const token=localStorage.getItem("grizzlysPushToken");if(!token)return;await setDoc(doc(db,"pushTokens",token),{token,updatedAt:serverTimestamp(),prefs:pushPrefs()},{merge:true});}catch(e){console.warn("Push-Auswahl konnte nicht gespeichert werden",e);}};
async function registerAdminPushToken(requestPermission=false){
  try{
    if(pushRenewPromise){try{await pushRenewPromise}catch(e){}}
    if(auth.currentUser?.uid!==ADMIN_UID || !FIREBASE_VAPID_KEY) return false;
    if(!("Notification" in window)) return false;
    if(requestPermission && Notification.permission!=="granted"){
      const permission=await Notification.requestPermission();
      if(permission!=="granted") return false;
    }
    if(Notification.permission!=="granted") return false;
    if(!(await isSupported())) return false;
    messaging=messaging||getMessaging(app);
    const reg=await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    const token=await getToken(messaging,{vapidKey:FIREBASE_VAPID_KEY,serviceWorkerRegistration:reg});
    if(!token) return;
    await setDoc(doc(db,"pushTokens",token),{
      token,installationId:getInstallationId(),updatedAt:serverTimestamp(),
      platform:navigator.userAgent||"",admin:true,adminUid:ADMIN_UID,prefs:pushPrefs(),...pushAppInfo()
    },{merge:true});
    try{localStorage.setItem("grizzlysPushRegistered","1");localStorage.setItem("grizzlysPushToken",token);}catch(e){}window.dispatchEvent(new Event("grizzlysPushChanged"));
    console.log("Admin-Push-Token registriert.");
    return true;
  }catch(err){console.warn("Admin-Push-Token konnte nicht registriert werden",err);return false;}
}

function getInstallationId(){
  const key="grizzlysInstallationId";
  try{
    let id=localStorage.getItem(key);
    if(!id){ id=(crypto?.randomUUID?.() || ("inst_"+Date.now()+"_"+Math.random().toString(36).slice(2))); localStorage.setItem(key,id); }
    return id;
  }catch(e){
    return "inst_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  }
}

/* ===== v90: Push-Anmeldung erneuern (neues Push-Abo + neues Token) =====
   Behebt „tote“ Abos: Firebase nimmt Meldungen an, aber auf dem Gerät kommt nichts an.
   Läuft automatisch alle PUSH_RENEW_DAYS Tage beim Öffnen und per Knopf in den Einstellungen. */
const PUSH_RENEW_KEY="grizzlysPushRenewedAt", PUSH_RENEW_DAYS=7;
let pushRenewPromise=null;
function pushRenewDue(){
  try{
    if(!("Notification" in window)||Notification.permission!=="granted"||navigator.onLine===false) return false;
    if(localStorage.getItem("grizzlysPushRegistered")!=="1") return false;
    return Date.now()-Number(localStorage.getItem(PUSH_RENEW_KEY)||0) > PUSH_RENEW_DAYS*86400000;
  }catch(e){return false;}
}
function renewPushRegistration(){
  if(pushRenewPromise) return pushRenewPromise;
  pushRenewPromise=(async()=>{
    try{
      if(!FIREBASE_VAPID_KEY||!("Notification" in window)||Notification.permission!=="granted") return false;
      if(!(await isSupported())) return false;
      try{await auth.authStateReady?.()}catch(e){}
      messaging=messaging||getMessaging(app);
      const reg=await navigator.serviceWorker.register("./sw.js");
      await navigator.serviceWorker.ready;
      const opts={vapidKey:FIREBASE_VAPID_KEY,serviceWorkerRegistration:reg};
      const oldToken=await getToken(messaging,opts);      // bindet zugleich den Service Worker für deleteToken
      await deleteToken(messaging);                        // löscht das Token und kündigt das alte Push-Abo
      const token=await getToken(messaging,opts);          // neues Abo + neues Token
      if(!token) return false;
      const isAdmin=auth.currentUser?.uid===ADMIN_UID, installationId=getInstallationId();
      await setDoc(doc(db,"pushTokens",token),{
        token,installationId,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
        platform:navigator.userAgent||"",prefs:pushPrefs(),...pushAppInfo(),
        ...(isAdmin?{admin:true,adminUid:ADMIN_UID}:{})
      });
      try{localStorage.setItem("grizzlysPushRegistered","1");localStorage.setItem("grizzlysPushToken",token);localStorage.setItem(PUSH_RENEW_KEY,String(Date.now()));}catch(e){}
      // Alten Eintrag entfernen: darf nur der Admin; bei allen anderen räumt der nächste Push-Versand auf.
      if(isAdmin&&oldToken&&oldToken!==token){try{await deleteDoc(doc(db,"pushTokens",oldToken))}catch(e){}}
      try{await setDoc(doc(db,"appInstallations",installationId),{installationId,platform:detectPlatform(),userAgent:navigator.userAgent||"",pushEnabled:true,pushRegisteredAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});}catch(e){}
      window.dispatchEvent(new Event("grizzlysPushChanged"));
      console.log("Push-Anmeldung erneuert.");
      return true;
    }catch(err){console.warn("Push-Anmeldung konnte nicht erneuert werden",err);return false;}
  })();
  pushRenewPromise.finally(()=>{pushRenewPromise=null});
  return pushRenewPromise;
}
async function syncExistingPushRegistration(){
  if(pushRenewDue()){ if(await renewPushRegistration()) return; }
  try{
    if(!FIREBASE_VAPID_KEY || !("Notification" in window) || Notification.permission!=="granted") return;
    if(!(await isSupported())) return;
    messaging=messaging||getMessaging(app);
    const reg=await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    const token=await getToken(messaging,{vapidKey:FIREBASE_VAPID_KEY,serviceWorkerRegistration:reg});
    if(!token) return;
    const installationId=getInstallationId();
    await setDoc(doc(db,"pushTokens",token),{
      token,
      installationId,
      updatedAt:serverTimestamp(),
      platform:navigator.userAgent,
      prefs:pushPrefs(),
      ...pushAppInfo(),
      ...(auth.currentUser?.uid===ADMIN_UID ? {admin:true,adminUid:ADMIN_UID} : {})
    },{merge:true});
    await setDoc(doc(db,"appInstallations",installationId),{
      installationId,
      platform:detectPlatform(),
      userAgent:navigator.userAgent||"",
      pushEnabled:true,
      pushRegisteredAt:serverTimestamp(),
      updatedAt:serverTimestamp()
    },{merge:true});
    try{
      localStorage.setItem("grizzlysPushRegistered","1");
      trackAnalyticsEvent("push_registration",{platform:detectPlatform()});
      localStorage.setItem("grizzlysPushToken",token);
    }catch(e){}
  }catch(err){
    console.warn("Bestehende Push-Registrierung konnte nicht synchronisiert werden",err);
  }
}

async function registerAppInstallation(){
  try{ if(!(window.GA_OK || localStorage.getItem("grizzlysPushRegistered")==="1")) return; }catch(e){ return; }
  try{
    const installationId=getInstallationId();
    let pushEnabled=false;
    try{
      pushEnabled=localStorage.getItem("grizzlysPushRegistered")==="1" &&
        ("Notification" in window ? Notification.permission==="granted" : true);
    }catch(e){}
    await setDoc(doc(db,"appInstallations",installationId),{
      installationId,
      platform:detectPlatform(),
      userAgent:navigator.userAgent||"",
      pushEnabled,
      updatedAt:serverTimestamp(),
      createdAt:serverTimestamp(),
      ...(pushEnabled ? {pushRegisteredAt:serverTimestamp()} : {})
    },{merge:true});
  }catch(err){
    console.warn("App-Installation konnte nicht registriert werden",err);
  }
}

function setupAdminAccordions(){
  const items=[...document.querySelectorAll(".adminAccordion")];
  items.forEach(x=>x.classList.remove("open"));
  items.forEach(item=>{
    item.querySelector(".adminAccordionHeader")?.addEventListener("click",()=>{
      const wasOpen=item.classList.contains("open");
      items.forEach(x=>x.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    });
  });
}

function closeAdminModal(){
  const modal=document.getElementById("adminModal");
  if(!modal)return;
  modal.hidden=true;
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}

function getPushRegistrationStatus(){
  try{return localStorage.getItem("grizzlysPushRegistered")==="1";}catch(e){return false;}
}

const BUG_TYPES={
  "Fehler":{title:"🐞 Fehler melden",intro:"Beschreibe kurz, was nicht funktioniert. Die Meldung wird zusammen mit App-Version und technischen Basisdaten an die Verwaltung übermittelt.",label:"Fehlerbeschreibung",placeholder:"Was funktioniert nicht? Was hast du gemacht?",emptyMsg:"Bitte beschreibe den Fehler kurz.",thanksTitle:"Danke für deine Meldung! 🐞",thanks:"Ich schaue mir das an und kümmere mich darum.",img:"grizzlys-bug-icon.png",emoji:"🐞"},
  "Wunsch / Anregung":{title:"💡 Wunsch / Anregung",intro:"Was wünschst du dir für die App oder was könnte besser werden? Die Idee wird an die App-Verwaltung übermittelt.",label:"Dein Wunsch / deine Anregung",placeholder:"Was fehlt dir oder was könnte besser sein?",emptyMsg:"Bitte beschreibe deinen Wunsch kurz.",thanksTitle:"Danke für deine Idee! 💡",thanks:"Ich schaue mir deinen Wunsch in Ruhe an und kümmere mich darum.",img:"grizzlys-wunsch-icon.png",emoji:"💡"},
  "Lob":{title:"👍 Lob",intro:"Was gefällt dir an der App? Dein Lob geht direkt an die App-Verwaltung.",label:"Dein Lob",placeholder:"Was gefällt dir besonders?",emptyMsg:"Bitte schreibe kurz, was dir gefällt.",thanksTitle:"Danke, das freut mich riesig! 👍",thanks:"Dein Lob motiviert mich, die App weiter zu verbessern.",img:"grizzlys-lob-icon.png",emoji:"👍"}
};
function currentBugType(){const v=document.getElementById("bugReportType")?.value;return BUG_TYPES[v]?v:"Fehler";}
function updateBugReportType(){
  const t=BUG_TYPES[currentBugType()];
  const set=(id,fn)=>{const el=document.getElementById(id);if(el)fn(el);};
  set("bugReportTitle",el=>el.textContent=t.title);
  set("bugReportIntro",el=>el.textContent=t.intro);
  set("bugReportDescLabel",el=>el.textContent=t.label);
  set("bugReportDescription",el=>el.placeholder=t.placeholder);
}
function showFeedbackThanks(typeInfo){
  const m=document.getElementById("thanksModal"); if(!m){alert(typeInfo.thanksTitle+"\n"+typeInfo.thanks);return;}
  document.getElementById("thanksImg").src=typeInfo.img;
  document.getElementById("thanksTitle").textContent=typeInfo.thanksTitle;
  document.getElementById("thanksText").textContent=typeInfo.thanks;
  m.hidden=false; m.setAttribute("aria-hidden","false");
  document.getElementById("thanksClose")?.focus();
}
function closeFeedbackThanks(){
  const m=document.getElementById("thanksModal"); if(!m)return;
  m.hidden=true; m.setAttribute("aria-hidden","true");
}
function closeBugReport(){
  const modal=document.getElementById("bugReportModal");
  if(!modal)return;
  modal.hidden=true; modal.setAttribute("aria-hidden","true");
}

const FB_DRAFT_KEY="grizzlysFeedbackDraft";
const FB_FIELDS=["bugReportType","bugReportName","bugReportArea","bugReportDescription","bugReportContact"];
function fbReadDraft(){try{return JSON.parse(localStorage.getItem(FB_DRAFT_KEY)||"null")||{};}catch(e){return {};}}
function fbWriteDraft(d){try{localStorage.setItem(FB_DRAFT_KEY,JSON.stringify(d));}catch(e){}}
function fbClearDraft(){try{localStorage.removeItem(FB_DRAFT_KEY);}catch(e){}}
function fbSaveDraft(){
  const d=fbReadDraft();
  FB_FIELDS.forEach(id=>{const el=document.getElementById(id);if(el)d[id]=el.value;});
  fbWriteDraft(d);
}
function fbRestoreDraft(){
  const d=fbReadDraft();
  FB_FIELDS.forEach(id=>{const el=document.getElementById(id);if(el&&typeof d[id]==="string"&&d[id]!=="")el.value=d[id];});
  if(d.bugReportType)updateBugReportType();
  document.getElementById("bugReportDescription")?.dispatchEvent(new Event("input"));
  const btn=document.getElementById("bugReportSend");
  if(btn)btn.textContent=d.pendingId?"Nochmal senden":"Meldung senden";
}
function fbShowError(msg){
  const box=document.getElementById("bugReportError");
  if(!box){alert(msg);return;}
  box.textContent=msg; box.hidden=!msg;
}
async function submitBugReport(){
  const name=document.getElementById("bugReportName")?.value.trim()||"";
  const area=document.getElementById("bugReportArea")?.value||"Sonstiges";
  const description=document.getElementById("bugReportDescription")?.value.trim()||"";
  const contact=document.getElementById("bugReportContact")?.value.trim()||"";
  const type=currentBugType(), typeInfo=BUG_TYPES[type];
  if(name.length<2){alert("Bitte gib deinen Namen an.");document.getElementById("bugReportName")?.focus();return;}
  if(description.length<5){alert(typeInfo.emptyMsg);return;}
  fbShowError("");
  fbSaveDraft();
  if(navigator.onLine===false){
    fbShowError("Du bist gerade offline. Deine Meldung ist auf diesem Gerät gespeichert – sende sie, sobald du wieder Internet hast.");
    const b=document.getElementById("bugReportSend"); if(b)b.textContent="Nochmal senden";
    return;
  }
  // Jede Meldung bekommt einmalig eine feste ID. Ein zweiter Versuch mit derselben ID
  // kann so keine doppelte Meldung erzeugen (die Regeln erlauben nur das Anlegen).
  const draft=fbReadDraft();
  const isRetry=Boolean(draft.pendingId);
  const ref=draft.pendingId?doc(db,"bugReports",draft.pendingId):doc(collection(db,"bugReports"));
  draft.pendingId=ref.id; fbWriteDraft(draft);
  const btn=document.getElementById("bugReportSend"); if(btn){btn.disabled=true;btn.textContent="Wird gesendet …";}
  let ok=false;
  try{
    const report={
      type,
      name,
      area,
      description,
      contact,
      appVersion:"1.46.1.228",
      platform:detectPlatform(),
      userAgent:navigator.userAgent||"",
      pushRegistered:getPushRegistrationStatus(),
      createdAt:serverTimestamp(),
      status:"Neu"
    };
    // Ohne Verbindung wartet Firestore sonst endlos – nach 15 Sekunden geben wir Bescheid.
    let timer;
    const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(new Error("timeout"),{code:"timeout"})),15000);});
    try{await Promise.race([Promise.resolve().then(()=>setDoc(ref,report)),timeout]);}
    finally{clearTimeout(timer);}
    ok=true;
  }catch(err){
    // Bei einem zweiten Versuch heißt "keine Berechtigung": Die Meldung existiert schon,
    // der erste Versuch ist also doch angekommen.
    if(isRetry && err?.code==="permission-denied") ok=true;
    else{
      console.error("Rückmeldung konnte nicht gesendet werden",err);
      fbShowError(err?.code==="timeout"
        ? "Senden dauert zu lange – vermutlich keine Verbindung. Dein Text bleibt gespeichert. Bitte versuche es gleich nochmal."
        : "Senden hat nicht geklappt. Dein Text bleibt gespeichert. Bitte versuche es gleich nochmal.");
    }
  }finally{
    if(btn){btn.disabled=false;btn.textContent=ok?"Meldung senden":"Nochmal senden";}
  }
  if(!ok)return;
  trackAnalyticsEvent("bug_report_submitted",{area,type});
  document.getElementById("bugReportName").value="";
  document.getElementById("bugReportDescription").value="";
  document.getElementById("bugReportContact").value="";
  document.getElementById("bugReportDescription")?.dispatchEvent(new Event("input"));
  closeBugReport();
  const typeSel=document.getElementById("bugReportType"); if(typeSel){typeSel.value="Fehler";updateBugReportType();}
  fbClearDraft();
  showFeedbackThanks(typeInfo);
}

function bugSentBadges(r){
  const created=r.createdAt?.toMillis?r.createdAt.toMillis():0;
  const fresh=created && Date.now()-created<15*60*1000;
  const badge=(sent,label)=>sent
    ?`<span class="ok">✓ ${label} gesendet</span>`
    :fresh?`<span class="wait">… ${label} wird gesendet</span>`:`<span class="fail">✗ ${label} fehlt</span>`;
  return `<div class="adminBugSent">${badge(Boolean(r.pushSentAt),"Push")}${badge(Boolean(r.emailSentAt),"E-Mail")}</div>`;
}
async function loadBugReports(){
  const box=document.getElementById("adminBugReports"), countEl=document.getElementById("adminBugCount"), filterEl=document.getElementById("adminBugFilter");
  if(!box||!countEl)return;
  box.innerHTML='<div class="small">Lade Rückmeldungen …</div>';
  try{
    const snap=await getDocs(collection(db,"bugReports"));
    const reports=[];
    snap.forEach(d=>reports.push({id:d.id,...(d.data()||{})}));
    reports.sort((a,b)=>{
      const ta=a.createdAt?.toMillis?a.createdAt.toMillis():0, tb=b.createdAt?.toMillis?b.createdAt.toMillis():0;
      return tb-ta;
    });

    const openCount=reports.filter(r=>!r.archived && r.status!=="Erledigt").length;
    countEl.textContent=String(openCount); countEl.hidden=openCount===0; window.admBugsChanged?.(openCount);

    const filter=filterEl?.value||"active";
    const typeFilter=document.getElementById("adminBugType")?.value||"all";
    const visible=reports.filter(r=>{
      if(typeFilter!=="all" && (r.type||"Fehler")!==typeFilter) return false;
      if(filter==="archived") return r.archived===true;
      if(filter==="all") return true;
      return r.archived!==true;
    });

    if(!visible.length){
      box.innerHTML='<div class="small">'+(filter==="archived"?"Keine archivierten Rückmeldungen vorhanden.":"Keine aktiven Rückmeldungen vorhanden.")+'</div>';
      return;
    }

    box.innerHTML=visible.map(r=>{
      const ts=r.createdAt?.toMillis?new Date(r.createdAt.toMillis()).toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"}):"Datum unbekannt";
      const status=r.status||"Neu";
      const cls=status==="Erledigt"?"erledigt":status==="In Bearbeitung"?"inarbeit":"neu";
      const archived=Boolean(r.archived);
      return `<div class="adminBugItem ${archived?"archived":""}" data-bug-id="${esc(r.id)}">
        <div class="adminBugHead">
          <div><b>${esc((BUG_TYPES[r.type]||BUG_TYPES["Fehler"]).emoji)} ${esc(r.type||"Fehler")} · ${esc(r.area||"Sonstiges")}</b>${archived?'<span class="adminBugArchivedBadge">ARCHIV</span>':""}
          <div class="adminBugMeta">${esc(ts)} · ${esc(r.appVersion||"?")} · ${esc(r.platform||"?")} · Push: ${r.pushRegistered?"aktiv":"nicht registriert"}</div></div>
          <span class="adminBugStatus ${cls}">${esc(status)}</span>
        </div>
        <div class="adminBugMeta"><b>Name:</b> ${esc(r.name||"Nicht angegeben")}</div>
        <div class="adminBugDesc">${esc(r.description||"")}</div>
        ${r.contact?`<div class="adminBugMeta">Rückfrage: ${esc(r.contact)}</div>`:""}
        ${bugSentBadges(r)}
        <div class="adminBugActions">
          <button class="action bugStatusBtn" data-status="Neu" type="button">Neu</button>
          <button class="action bugStatusBtn" data-status="In Bearbeitung" type="button">In Bearbeitung</button>
          <button class="action bugStatusBtn" data-status="Erledigt" type="button">Erledigt</button>
          ${archived
            ? '<button class="action bugArchiveBtn" data-archive="false" type="button">↩️ Wiederherstellen</button>'
            : '<button class="action bugArchiveBtn" data-archive="true" type="button">📦 Archivieren</button>'}
          <button class="action bugDeleteBtn adminBugDelete" type="button">🗑️ Löschen</button>
        </div>
      </div>`;
    }).join("");

    box.querySelectorAll(".bugStatusBtn").forEach(btn=>btn.addEventListener("click",async()=>{
      const row=btn.closest(".adminBugItem"), id=row?.dataset.bugId, status=btn.dataset.status; if(!id)return;
      btn.disabled=true;
      try{await updateDoc(doc(db,"bugReports",id),{status,updatedAt:serverTimestamp()});await loadBugReports();}
      catch(err){console.error(err);alert("Status konnte nicht gespeichert werden.");btn.disabled=false;}
    }));

    box.querySelectorAll(".bugArchiveBtn").forEach(btn=>btn.addEventListener("click",async()=>{
      const row=btn.closest(".adminBugItem"), id=row?.dataset.bugId, archived=btn.dataset.archive==="true"; if(!id)return;
      btn.disabled=true;
      try{
        await updateDoc(doc(db,"bugReports",id),{
          archived,
          ...(archived ? {archivedAt:serverTimestamp()} : {archivedAt:null}),
          updatedAt:serverTimestamp()
        });
        await loadBugReports();
      }catch(err){console.error(err);alert("Archivierung konnte nicht gespeichert werden.");btn.disabled=false;}
    }));

    box.querySelectorAll(".bugDeleteBtn").forEach(btn=>btn.addEventListener("click",async()=>{
      const row=btn.closest(".adminBugItem"), id=row?.dataset.bugId; if(!id)return;
      if(!confirm("Diese Rückmeldung wirklich endgültig löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden."))return;
      btn.disabled=true;
      try{await deleteDoc(doc(db,"bugReports",id));await loadBugReports();}
      catch(err){console.error(err);alert("Rückmeldung konnte nicht gelöscht werden.");btn.disabled=false;}
    }));
  }catch(err){
    console.error("Fehlermeldungen konnten nicht geladen werden",err);
    countEl.hidden=true; box.innerHTML='<div class="small" style="color:#c62828;font-weight:800">Rückmeldungen konnten nicht geladen werden.</div>';
  }
}

const analyticsRangeState={range:"month"};
function analyticsDates(range){
  const now=new Date(); const iso=d=>d.toISOString().slice(0,10);
  const today=iso(now); let start=today;
  if(range==="week"){ const d=new Date(now); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); start=iso(d); }
  else if(range==="month"){ start=today.slice(0,8)+"01"; }
  else if(range==="30d"){ const d=new Date(now); d.setDate(d.getDate()-29); start=iso(d); }
  else if(range==="season"){ start="2026-08-01"; }
  else if(range==="overall"){ start="2026-01-01"; }
  return {startDate:start,endDate:today};
}
function analyticsEsc(v){return esc(String(v??""));}
function analyticsRows(items,labelKey,valueKey,bar=true){
  if(!items?.length) return '<div class="small">Keine Daten für diesen Zeitraum.</div>';
  const max=Math.max(...items.map(x=>Number(x[valueKey]||0)),1);
  return '<div class="analyticsList">'+items.map(x=>'<div class="analyticsRow"><div style="min-width:0;flex:1"><b>'+analyticsEsc(x[labelKey])+'</b>'+(bar?'<div class="analyticsBar"><i style="width:'+Math.max(2,Math.round(Number(x[valueKey]||0)/max*100))+'%"></i></div>':'')+'</div><strong>'+analyticsEsc(x[valueKey])+'</strong></div>').join('')+'</div>';
}
function analyticsRender(data){
  const s=data.summary||{};
  document.getElementById("analyticsSummary").innerHTML=[["Aktive Nutzer",s.activeUsers],["Neue Nutzer",s.newUsers],["Sitzungen",s.sessions],["Events",s.eventCount]].map(x=>'<div class="analyticsStat"><b>'+analyticsEsc(x[1])+'</b><span>'+x[0]+'</span></div>').join('');
  document.getElementById("analyticsRangeLabel").textContent="Zeitraum: "+data.startDate+" bis "+data.endDate;
  const daily=data.daily||[]; const max=Math.max(...daily.map(x=>Number(x.activeUsers||0)),1); const analyticsDayLabel=d=>{const s=String(d||""); const m=s.match(/^(?:\d{4}[-]?)(\d{2})[-]?(\d{2})$/); return m?m[2]+"."+m[1]+".":s;};
  document.getElementById("analyticsDaily").innerHTML='<b>📈 Aktive Nutzer pro Tag</b>'+(daily.length?'<div class="analyticsChart">'+daily.map(x=>'<div class="analyticsCol" title="'+analyticsEsc(x.date)+': '+analyticsEsc(x.activeUsers)+'"><i style="height:'+Math.max(2,Math.round(Number(x.activeUsers||0)/max*105))+'px"></i><small>'+analyticsEsc(analyticsDayLabel(x.date))+'</small></div>').join('')+'</div>':'<div class="small" style="margin-top:8px">Keine Tagesdaten.</div>');
  document.getElementById("analyticsEvents").innerHTML='<b>🎯 Nutzung / Events</b>'+analyticsRows(data.events||[],"name","count");
  document.getElementById("analyticsDevices").innerHTML='<b>📱 Geräte</b>'+analyticsRows(data.devices||[],"name","activeUsers");
  document.getElementById("analyticsOs").innerHTML='<b>💻 Betriebssysteme</b>'+analyticsRows(data.os||[],"name","activeUsers");
  document.getElementById("analyticsPages").innerHTML='<b>📄 Seitenaufrufe</b>'+analyticsRows(data.pages||[],"name","views");
  document.getElementById("analyticsCities").innerHTML='<b>📍 Städte</b>'+analyticsRows(data.cities||[],"name","activeUsers");
}
async function loadPushStats(){
  const box=document.getElementById("pushStats"); if(!box)return;
  box.innerHTML='<b>🔔 Ergebnis-Push</b><div class="small" style="margin-top:6px">Wird geladen …</div>';
  try{
    const [rs,ts]=await Promise.all([getDocs(collection(db,"results")),getDocs(collection(db,"pushTokens"))]);
    const rows=rs.docs.map(d=>d.data()).filter(r=>r.updatedAt);
    const sent=rows.filter(r=>r.pushSentAt).sort((a,b)=>b.pushSentAt.toMillis()-a.pushSentAt.toMillis()).slice(0,8);
    const pending=rows.filter(r=>!r.pushSentAt).length;
    const fmt=t=>t.toDate().toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
    const line=r=>{
      const hasCount=typeof r.pushSentCount==="number";
      const info=hasCount?"an "+r.pushSentCount+" von "+(r.pushTargetCount??"?")+" Geräten"+(r.pushFailedCount?" · "+r.pushFailedCount+" fehlgeschlagen":""):"Anzahl nicht erfasst";
      return '<div style="padding:8px 0;border-top:1px solid var(--border)"><b>'+esc(r.home)+" "+esc(r.homeScore)+":"+esc(r.awayScore)+" "+esc(r.away)+'</b><div class="small">'+fmt(r.pushSentAt)+" · "+info+"</div></div>";
    };
    box.innerHTML='<b>🔔 Ergebnis-Push</b>'
      +'<div class="small" style="margin:6px 0">Registrierte Push-Geräte aktuell: <b>'+ts.size+'</b>'+(pending?" · "+pending+" Ergebnis wartet auf Versand":"")+'</div>'
      +(sent.length?sent.map(line).join(""):'<div class="small">Noch kein Ergebnis-Push versendet.</div>');
  }catch(e){
    console.error(e);
    box.innerHTML='<b>🔔 Ergebnis-Push</b><div class="small analyticsError" style="margin-top:6px">Push-Daten konnten nicht geladen werden.</div>';
  }
}
async function loadAnalyticsDashboard(){
  const status=document.getElementById("analyticsStatus"); if(!auth.currentUser||auth.currentUser.uid!==ADMIN_UID){status.textContent="Admin-Anmeldung erforderlich.";status.className="small analyticsError";return;}
  loadPushStats();
  status.className="small"; status.textContent="Daten werden geladen …";
  try{
    const fn=httpsCallable(functions,"getAnalyticsDashboard");
    const data=(await fn(analyticsDates(analyticsRangeState.range))).data;
    analyticsRender(data); status.textContent="Aktualisiert: "+new Date().toLocaleString("de-DE");
  }catch(e){console.error(e);status.className="small analyticsError";status.textContent="Analytics konnten nicht geladen werden. Bitte Data API, GA4 Property-ID und Berechtigung der Firebase-Funktionsidentität prüfen."}
}
function setupAnalyticsDashboard(){
  document.getElementById("openAnalyticsDashboard")?.addEventListener("click",()=>{const m=document.getElementById("analyticsDashboardModal");m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";loadAnalyticsDashboard();});
  document.getElementById("analyticsDashboardClose")?.addEventListener("click",()=>{const m=document.getElementById("analyticsDashboardModal");m.hidden=true;m.setAttribute("aria-hidden","true");document.body.style.overflow="";});
  document.getElementById("analyticsRefresh")?.addEventListener("click",loadAnalyticsDashboard);
  document.querySelectorAll(".analyticsRangeBtn").forEach(b=>b.addEventListener("click",()=>{analyticsRangeState.range=b.dataset.range;loadAnalyticsDashboard();}));
  document.getElementById("analyticsDashboardModal")?.addEventListener("click",e=>{if(e.target.id==="analyticsDashboardModal"){e.currentTarget.hidden=true;e.currentTarget.setAttribute("aria-hidden","true");document.body.style.overflow="";}});
}
/* ===== v87: Admin – Push-Status dieses Geräts + Test-Push (Cloud Function adminPushTest) ===== */
let adminPushWired=false, adminPushLastTest=0;
function adminPushRow(state,title,detail){return '<div class="apRow '+state+'"><i>'+(state==="ok"?"✓":state==="warn"?"!":"✗")+'</i><div><b>'+esc(title)+'</b>'+(detail?'<span>'+esc(detail)+'</span>':'')+'</div></div>';}
async function refreshAdminPushStatus(){
  const box=document.getElementById("adminPushStatus"), dot=document.getElementById("adminPushDot"), regBtn=document.getElementById("adminPushRegister");
  if(!box||auth.currentUser?.uid!==ADMIN_UID) return;
  box.innerHTML='<div class="small">Wird geprüft …</div>';
  const rows=[]; let verdict="ok", hint="";
  const hasApi=("Notification" in window);
  const perm=hasApi?Notification.permission:"unsupported";
  if(perm==="granted") rows.push(adminPushRow("ok","Benachrichtigungen erlaubt",""));
  else{ verdict="bad"; rows.push(adminPushRow("bad","Benachrichtigungen nicht erlaubt",perm==="denied"?"Im Browser blockiert – in den Handy-/Browser-Einstellungen für diese Seite erlauben.":perm==="default"?"Noch nicht gefragt – unten „als Admin registrieren“ antippen.":"Dieser Browser unterstützt keine Benachrichtigungen.")); }
  let token=""; try{token=localStorage.getItem("grizzlysPushToken")||""}catch(e){}
  if(token) rows.push(adminPushRow("ok","Push-Token auf diesem Gerät vorhanden","…"+token.slice(-8)));
  else{ verdict="bad"; rows.push(adminPushRow("bad","Kein Push-Token auf diesem Gerät","Push wurde hier noch nicht aktiviert.")); }
  let adminDevices=[], mine=null, loadError=false, adminDevicesHtml="";
  try{
    const snap=await getDocs(collection(db,"pushTokens"));
    snap.forEach(d=>{const x=d.data()||{}; if(d.id===token) mine=x; if(x.admin===true&&x.adminUid===ADMIN_UID) adminDevices.push({id:d.id,x});});
  }catch(e){ console.error(e); loadError=true; }
  const fmt=t=>{try{return t.toDate().toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}catch(e){return "unbekannt"}};
  if(loadError){ if(verdict==="ok")verdict="warn"; rows.push(adminPushRow("warn","Firebase konnte nicht gelesen werden","Bitte Verbindung prüfen und „Neu prüfen“ antippen.")); }
  else if(token){
    if(mine) rows.push(adminPushRow("ok","In Firebase registriert","Zuletzt aktualisiert: "+(mine.updatedAt?fmt(mine.updatedAt):"unbekannt")));
    /* 1.24.1: gespeicherte Push-Auswahl dieses Geräts (so entscheiden die Cloud Functions, wer welchen Push bekommt) */
    if(mine){
      const fp=mine.prefs||{}, OPTIN={liveGoals:1,livePeriods:1}, on=(v,k)=>OPTIN[k]?v===true:v!==false, lp=pushPrefs();
      const lbl=(k,t)=>(on(fp[k],k)?"✓ ":"✗ ")+t;
      const txt=[lbl("results","Ergebnisse"),lbl("reminders","Erinnerung am Vortag"),lbl("liveGoals","Live-Tore"),lbl("livePeriods","Bully & Drittel"),lbl("teamA","U15 A"),lbl("teamB","U15 B")].join(" · ");
      const diff=["results","reminders","liveGoals","livePeriods","teamA","teamB"].filter(k=>on(fp[k],k)!==lp[k]);
      const off=[!on(fp.reminders)?"Erinnerungen sind aus":"",(!on(fp.teamA)||!on(fp.teamB))?"nur "+teamName(on(fp.teamA)?"A":"B")+" gewählt":""].filter(Boolean);
      if(diff.length){ if(verdict==="ok")verdict="warn"; rows.push(adminPushRow("warn","Push-Auswahl in Firebase weicht ab",txt+" – auf dem Handy eingestellt ist etwas anderes. Unter Einstellungen › Push die Auswahl einmal umschalten und zurück, dann wird sie neu gespeichert.")); }
      else rows.push(adminPushRow(off.length?"warn":"ok","Push-Auswahl in Firebase",txt+(off.length?" – Hinweis: "+off.join(", ")+".":"")));
    }
    else{ verdict="bad"; rows.push(adminPushRow("bad","Token nicht in Firebase gefunden","Das Token dieses Geräts ist dort nicht (mehr) gespeichert.")); }
    const isAdmin=!!(mine&&mine.admin===true&&mine.adminUid===ADMIN_UID);
    if(isAdmin) rows.push(adminPushRow("ok","Als Admin-Gerät markiert","Rückmeldungen und Admin-Hinweise kommen hier an."));
    else{ verdict="bad"; rows.push(adminPushRow("bad","Nicht als Admin-Gerät markiert",mine?"Das Gerät bekommt nur die normalen Pushs.":"")); }
  }
  if(!loadError){
    const others=adminDevices.filter(d=>d.id!==token).length;
    rows.push(adminPushRow(adminDevices.length?"ok":"bad","Admin-Geräte insgesamt: "+adminDevices.length,adminDevices.length?"Jede Push-Anmeldung zählt einzeln: Test- und Live-App, jeder Browser und jede Neuanmeldung. Liste unten.":"Aktuell ist kein Gerät als Admin registriert."));
    adminDevicesHtml=admDevList(adminDevices,token,fmt);
    if(verdict==="bad"&&others>0) hint=" Auf "+others+" anderen Gerät"+(others===1?"":"en")+" kommt Admin-Push aber an.";
  }
  const vText=verdict==="ok"?"✓ Dieses Gerät ist als Admin für Push angemeldet.":verdict==="warn"?"Status konnte nicht vollständig geprüft werden.":"✗ Dieses Gerät bekommt aktuell keinen Admin-Push."+hint;
  box.innerHTML='<div class="apVerdict '+verdict+'">'+esc(vText)+'</div>'+rows.join("")+adminDevicesHtml;
  admDevBind(box);
  if(dot) dot.textContent=verdict==="ok"?"✓":verdict==="warn"?"":"⚠️";
  {const sum=document.getElementById("adminPushSum");if(sum){const n=rows.length,ok=rows.filter(r=>r.includes('apRow ok')).length,bad=rows.filter(r=>r.includes('apRow bad')).length,warn=n-ok-bad;
    sum.textContent=ok===n?ok+" von "+n+" ✓":ok+" von "+n+" ✓"+(bad?" · "+bad+" ✗":"")+(warn?" · "+warn+" !":"");
    sum.className="admSum "+(bad?"bad":warn?"warn":"ok");}}
  window.admPushVerdict=verdict; window.admRenderAll?.();
  if(regBtn) regBtn.hidden=(verdict==="ok"||perm==="denied"||perm==="unsupported");
}
async function sendAdminTestPush(delaySeconds=0){
  const btn=document.getElementById("adminPushTestBtn"), btn2=document.getElementById("adminPushTestLater"), out=document.getElementById("adminPushTestResult"); if(!btn||!out) return;
  let token=""; try{token=localStorage.getItem("grizzlysPushToken")||""}catch(e){}
  btn.disabled=true; if(btn2)btn2.disabled=true; out.hidden=false; adminPushLastTest=Date.now()+delaySeconds*1000;
  out.textContent=delaySeconds?"Test-Push kommt in "+delaySeconds+" Sekunden – jetzt zum Startbildschirm wechseln (Home-Taste).":"Test-Push wird gesendet …";
  try{
    const r=(await httpsCallable(functions,"adminPushTest")({token,delaySeconds})).data||{};
    const res=Array.isArray(r.results)?r.results:[];
    if(!res.length){ out.textContent="Es ist kein Admin-Gerät registriert – es wurde nichts gesendet."; return; }
    const lines=res.map(x=>(x.ok?"✓ ":"✗ ")+detectPlatformFromStoredUserAgent(x.platform)+(x.thisDevice?" (dieses Gerät)":"")+(x.ok?": gesendet":x.removed?": ungültiges Token – Eintrag entfernt":": fehlgeschlagen"+(x.error?" ("+x.error+")":"")));
    const me=res.find(x=>x.thisDevice);
    if(r.removed) setTimeout(refreshAdminPushStatus,300);
    out.innerHTML='<b>'+esc((r.sent||0)+" von "+res.length+" Admin-Gerät"+(res.length===1?"":"en")+" erreicht")+'</b><br>'+lines.map(esc).join("<br>")
      +'<br><span class="small">'+esc(me?(me.ok?(delaySeconds?"Wenn die App beim Versand nicht sichtbar war, ist die Benachrichtigung jetzt in der Statusleiste.":"Die App ist gerade sichtbar – statt einer Benachrichtigung erscheint unten gleich eine grüne Bestätigung."):"An dieses Gerät konnte nicht zugestellt werden – das Token ist vermutlich veraltet. Bitte neu als Admin registrieren."):"Dieses Gerät war nicht unter den Empfängern.")+'</span>';
  }catch(e){
    console.error(e);
    const code=String(e?.code||"");
    out.textContent=code.includes("not-found")||code.includes("internal")||code.includes("unavailable")?"Test-Push nicht möglich: Die Cloud Function „adminPushTest“ ist noch nicht deployt oder nicht erreichbar.":code.includes("permission-denied")||code.includes("unauthenticated")?"Test-Push nicht möglich: keine Admin-Berechtigung.":"Test-Push fehlgeschlagen: "+(e?.message||code||"unbekannter Fehler");
  }finally{ btn.disabled=false; if(btn2)btn2.disabled=false; }
}
function adminPushTestArrived(){
  const out=document.getElementById("adminPushTestResult"); if(!out) return;
  const secs=adminPushLastTest&&Date.now()>adminPushLastTest?Math.max(1,Math.round((Date.now()-adminPushLastTest)/1000)):0;
  out.hidden=false;
  out.insertAdjacentHTML("beforeend",'<div class="apVerdict ok" style="margin-top:8px">✓ Test-Push ist auf diesem Gerät angekommen'+(secs&&secs<120?" (nach "+secs+" s)":"")+'.</div>');
}
/* v89: Fehlersuche – liest nur aus (Service Worker, Push-Abo, Firebase-Token-Daten) und ändert nichts */
const PUSH_LIVE_PATH="/grizzlys-u15/";
async function adminPushRegs(){
  let regs=[]; try{regs=await navigator.serviceWorker.getRegistrations()}catch(e){}
  const path=r=>{try{return new URL(r.scope).pathname}catch(e){return ""}};
  return {regs,path,live:regs.find(r=>path(r)===PUSH_LIVE_PATH)||null};
}
async function adminPushStoredToken(){
  // Firebase legt Token + zugehöriges Push-Abo in IndexedDB ab. Nur öffnen, wenn die Datenbank schon existiert.
  try{
    if(!indexedDB.databases) return {unknown:true};
    const list=await indexedDB.databases();
    if(!list.some(d=>d.name==="firebase-messaging-database")) return null;
    const db=await new Promise((res,rej)=>{const q=indexedDB.open("firebase-messaging-database");q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});
    try{
      if(!db.objectStoreNames.contains("firebase-messaging-store")) return null;
      return await new Promise((res,rej)=>{const q=db.transaction("firebase-messaging-store","readonly").objectStore("firebase-messaging-store").get(firebaseConfig.appId);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error);});
    }finally{db.close();}
  }catch(e){console.warn(e);return {unknown:true};}
}
async function adminPushDiagnose(){
  const box=document.getElementById("adminPushDiag"); if(!box) return;
  box.innerHTML='<div class="small">Diagnose läuft …</div>';
  const rows=[], tail=v=>"…"+String(v||"").slice(-8);
  const {regs,path,live}=await adminPushRegs();
  if(live) rows.push(adminPushRow(live.active?"ok":"bad","Service Worker der Live-App",live.active?"aktiv ("+live.active.state+")":"vorhanden, aber nicht aktiv"));
  else rows.push(adminPushRow("bad","Service Worker der Live-App fehlt","Auf diesem Gerät ist für die Live-App kein Service Worker registriert – ohne ihn kann kein Push ankommen."));
  let sub=null; try{sub=live?await live.pushManager.getSubscription():null}catch(e){}
  if(live) rows.push(sub?adminPushRow("ok","Push-Abo im Browser vorhanden","Abo "+tail(sub.endpoint)):adminPushRow("bad","Kein Push-Abo im Browser","Der Browser hat für die Live-App kein Push-Abo (mehr). Das gespeicherte Token läuft ins Leere."));
  let token=""; try{token=localStorage.getItem("grizzlysPushToken")||""}catch(e){}
  const td=await adminPushStoredToken();
  if(td&&td.unknown) rows.push(adminPushRow("warn","Firebase-Token-Daten nicht lesbar",""));
  else if(!td) rows.push(adminPushRow("bad","Keine Firebase-Token-Daten auf dem Gerät","Firebase kennt auf diesem Gerät kein Token."));
  else{
    const o=td.subscriptionOptions||{}, diffs=[];
    if(token&&td.token!==token) diffs.push("Token in der App ("+tail(token)+") ≠ Token bei Firebase ("+tail(td.token)+")");
    if(sub&&o.endpoint!==sub.endpoint) diffs.push("Token gehört zu einem anderen Push-Abo ("+tail(o.endpoint)+")");
    if(live&&o.swScope!==live.scope) diffs.push("Token gehört zu einem anderen Bereich: "+(()=>{try{return new URL(o.swScope).pathname}catch(e){return String(o.swScope)}})());
    if(o.vapidKey&&o.vapidKey!==FIREBASE_VAPID_KEY) diffs.push("anderer VAPID-Schlüssel");
    rows.push(diffs.length?adminPushRow("bad","Token und Push-Abo passen nicht zusammen",diffs.join(" · ")):adminPushRow("ok","Token gehört zum Push-Abo der Live-App","Token "+tail(td.token)));
    if(td.createTime) rows.push(adminPushRow("ok","Token erstellt",new Date(td.createTime).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})));
  }
  for(const r of regs){ if(r===live) continue; let s2=null; try{s2=await r.pushManager.getSubscription()}catch(e){}
    rows.push(adminPushRow(s2?"warn":"ok","Weiterer Service Worker: "+path(r),s2?"hat ein eigenes Push-Abo "+tail(s2.endpoint):"ohne Push-Abo")); }
  let perm=""; try{perm=live?await live.pushManager.permissionState({userVisibleOnly:true}):""}catch(e){}
  if(perm) rows.push(adminPushRow(perm==="granted"?"ok":"bad","Push-Berechtigung des Browsers",perm));
  box.innerHTML=rows.join("");
}
async function adminPushLocalTest(){
  const out=document.getElementById("adminPushLocalResult"); if(!out) return; out.hidden=false;
  try{
    const {regs,live}=await adminPushRegs(); const reg=live||regs[0];
    if(!reg){ out.textContent="Kein Service Worker gefunden – lokale Benachrichtigung nicht möglich."; return; }
    await reg.showNotification("Lokaler Test ✓",{body:"Diese Benachrichtigung kommt direkt vom Gerät – ohne Firebase.",icon:"https://jazm1309.github.io/grizzlys-u15/icon-192.png",badge:"https://jazm1309.github.io/grizzlys-u15/badge-96.png",tag:"grizzlys-localtest"});
    out.textContent="Lokale Benachrichtigung ausgelöst"+(live?"":" (über den Test-Service-Worker)")+". Erscheint sie jetzt in der Statusleiste?";
  }catch(e){ console.error(e); out.textContent="Lokale Benachrichtigung fehlgeschlagen: "+(e?.message||e); }
}
function setupAdminPushStatus(){
  if(!adminPushWired){
    adminPushWired=true;
    document.getElementById("adminPushRefresh")?.addEventListener("click",refreshAdminPushStatus);
    document.getElementById("adminPushDiagBtn")?.addEventListener("click",adminPushDiagnose);
    document.getElementById("adminPushLocal")?.addEventListener("click",adminPushLocalTest);
    document.getElementById("adminPushTestBtn")?.addEventListener("click",()=>sendAdminTestPush(0));
    document.getElementById("adminPushTestLater")?.addEventListener("click",()=>sendAdminTestPush(10));
    document.getElementById("adminPushRegister")?.addEventListener("click",async e=>{
      const b=e.currentTarget, out=document.getElementById("adminPushTestResult"); b.disabled=true;
      const ok=await registerAdminPushToken(true); b.disabled=false;
      if(!ok&&out){ out.hidden=false; out.textContent=typeof _testBlock!=="undefined"?"In der Testversion ist die Push-Anmeldung gesperrt. Bitte in der Live-App als Admin anmelden – der Status hier zeigt dann dasselbe Gerät.":"Registrierung hat nicht geklappt. Bitte Benachrichtigungen erlauben und erneut versuchen."; }
      refreshAdminPushStatus();
    });
    window.addEventListener("grizzlysPushChanged",()=>{ if(auth.currentUser?.uid===ADMIN_UID) refreshAdminPushStatus(); });
  }
  refreshAdminPushStatus();
}
/* ===== v97: Adventskalender-Auswertung =====
   Jedes Gerät überträgt je Türchen nur „Regel- oder Mannschaftsfrage“ und „richtig/falsch“ (Sammlung adventAnswers,
   ein Dokument pro Gerät und Saison). Der Admin-Bereich zählt daraus zusammen. */
window.xmSyncAnswers=async function(year,answers){
  try{
    if(!answers||!Object.keys(answers).length) return;
    const id=year+"_"+getInstallationId();
    await setDoc(doc(db,"adventAnswers",id),{id,year,answers,updatedAt:serverTimestamp()});
  }catch(e){console.warn("Adventskalender-Antworten konnten nicht übertragen werden",e);}
};
function advPct(ok,n){return n?Math.round(ok/n*100):0}
function advRow(label,t){
  const n=t.ok+t.no;
  if(!n) return '<div class="advRow"><div class="h">'+label+'<span>noch keine Antworten</span></div></div>';
  return '<div class="advRow"><div class="h">'+label+'<span>'+advPct(t.ok,n)+' % richtig</span></div><div class="advBar" aria-hidden="true">'+(t.ok?'<i class="ok" style="flex:'+t.ok+'"></i>':'')+(t.no?'<i class="no" style="flex:'+t.no+'"></i>':'')+'</div><div class="d">✓ '+t.ok+' richtig · ✗ '+t.no+' falsch · '+n+' Antworten</div></div>';
}
async function loadAdventStats(){
  const box=document.getElementById("admAdvStats"), sum=document.getElementById("admAdvSum"); if(!box) return;
  if(!auth.currentUser||auth.currentUser.uid!==ADMIN_UID) return;
  box.innerHTML='<div class="small">Wird geladen …</div>';
  const year=typeof xmSeasonYear==="function"?xmSeasonYear():new Date().getFullYear();
  let devices=[];
  try{
    const snap=await getDocs(collection(db,"adventAnswers"));
    snap.forEach(d=>{const x=d.data()||{}; if(x.year===year&&x.answers&&typeof x.answers==="object") devices.push(x.answers);});
  }catch(e){
    console.error(e);
    box.innerHTML='<div class="small analyticsError">Auswertung konnte nicht geladen werden. Sind die Firestore-Regeln mit der Sammlung „adventAnswers“ veröffentlicht?</div>';
    if(sum){sum.textContent="Fehler";sum.className="admSum bad";} return;
  }
  let note="";
  if(window.GRIZZLYS_TEST){ let own={}; try{own=window.xmStatAnswers?window.xmStatAnswers():{}}catch(e){}
    if(Object.keys(own).length){devices.push(own);note='<div class="small" style="margin-bottom:8px">Testversion: Die Antworten dieses Geräts sind zur Vorschau mitgezählt, sie werden nicht gespeichert.</div>';} }
  const all={ok:0,no:0}, R={ok:0,no:0}, T={ok:0,no:0}, doors={}; let people=0;
  for(const a of devices){ let any=false;
    for(const k in a){ const d=Number(k), v=a[k]; if(!(d>=1&&d<=23)||!v||typeof v.ok!=="boolean") continue; any=true;
      const kind=v.k==="T"?"T":"R", t=kind==="T"?T:R, key=d+kind;
      doors[key]=doors[key]||{d,kind,ok:0,no:0};
      if(v.ok){all.ok++;t.ok++;doors[key].ok++}else{all.no++;t.no++;doors[key].no++} }
    if(any) people++; }
  const n=all.ok+all.no;
  if(sum){ sum.textContent=n?advPct(all.ok,n)+" % richtig":"noch keine Antworten"; sum.className="admSum"; }
  if(!n){ box.innerHTML=note+'<div class="small">Für die Saison '+year+' gibt es noch keine Antworten. Der Adventskalender läuft vom 1. bis 24. Dezember.</div>'; return; }
  const rows=Object.values(doors).sort((a,b)=>a.d-b.d||a.kind.localeCompare(b.kind));
  box.innerHTML=note
    +'<div class="advTiles"><div><b>'+people+'</b><span>'+(people===1?"Gerät hat":"Geräte haben")+' mitgemacht</span></div><div><b>'+n+'</b><span>Antworten insgesamt</span></div></div>'
    +advRow("Alle Fragen",all)+advRow("📘 Regelfragen",R)+advRow("🏒 Mannschaftsfragen",T)
    +'<details class="advDoors"><summary>Je Türchen</summary><table><tr><th>Türchen</th><th>✓ richtig</th><th>✗ falsch</th><th>Quote</th></tr>'
    +rows.map(r=>'<tr><td>'+r.d+' · '+(r.kind==="T"?"🏒 Mannschaft":"📘 Regel")+'</td><td>'+r.ok+'</td><td>'+r.no+'</td><td>'+advPct(r.ok,r.ok+r.no)+' %</td></tr>').join("")
    +'</table></details>';
}
/* ===== 1.9.1.110: Veröffentlichen aus dem Admin-Bereich (Cloud Function deployControl → GitHub-Abläufe) ===== */
const pubEl=id=>document.getElementById(id);
const pubE=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
let pubData=null, pubWait=null, pubTimer=0, pubPollUntil=0, pubBusy=false, pubFails=0;
function pubAgo(t){ if(!t) return ""; const m=Math.round((Date.now()-new Date(t).getTime())/60000); if(m<1) return "gerade eben"; if(m<60) return "vor "+m+" Min."; const h=Math.round(m/60); return h<24?"vor "+h+" Std.":new Date(t).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}); }
function pubCmp(a,b){ const x=String(a||"").split(".").map(Number), y=String(b||"").split(".").map(Number); for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0); if(d) return d<0?-1:1;} return 0; }
function pubMsg(text,cls){ const m=pubEl("admPubMsg"); if(!m) return; if(!text){m.hidden=true;m.innerHTML="";return;} m.hidden=false; m.innerHTML='<div class="apVerdict '+(cls||"warn")+'">'+text+'</div>'; }
const PUB_NETZ="Keine Verbindung zum Veröffentlichen-Dienst – das Internet war kurz weg oder der Dienst gerade nicht erreichbar. Bitte „↻“ antippen bzw. den Knopf noch einmal drücken.";
function pubErr(e){ const c=String(e?.code||""), msg=String(e?.message||"");
  if(/internal|unavailable|deadline-exceeded/.test(c)&&/^(internal|unavailable|deadline-exceeded|failed to fetch|load failed|)$/i.test(msg.trim())) return PUB_NETZ;
  if(c.includes("not-found")||c.includes("unavailable")||(c.includes("internal")&&!msg)) return "Die Cloud Function „deployControl“ ist noch nicht eingerichtet oder nicht erreichbar (./knoepfe-einrichten.sh in der Cloud Shell).";
  if(c.includes("permission-denied")||c.includes("unauthenticated")) return "Nur für den angemeldeten Admin.";
  return pubE(msg||c||"Unbekannter Fehler"); }
async function pubCall(data){ return (await httpsCallable(functions,"deployControl",{timeout:130000})(data)).data||{}; }
function pubLaeuft(x){ return !!(x && x.status && x.status!=="completed"); }
function pubRow(label, ziel, lauf, pages){
  let html="";
  const wartet=pubWait && pubWait.ziel===ziel && (!lauf || lauf.titel!==pubWait.auftrag);
  if(wartet){ html+='<div class="apRow warn"><i>⏳</i><div><b>'+label+': Auftrag angenommen</b><span>GitHub startet den Ablauf …</span></div></div>'; }
  else if(lauf){
    const run=pubLaeuft(lauf), ok=lauf.ergebnis==="success", cls=run?"warn":ok?"ok":"bad", icon=run?"⏳":ok?"✓":"✗";
    const titel=String(lauf.titel||"").replace(/ · [0-9a-z]+$/,"");
    const msgs=(lauf.meldungen||[]).map(m=>(m.stufe==="failure"?"✗ ":m.stufe==="warning"?"⚠ ":"")+pubE(m.text)).join("<br>");
    let extra="";
    if(!run && !ok){
      const all=(lauf.meldungen||[]).map(m=>m.text).join(" ");
      if(ziel==="test" && /ÄLTER/.test(all)) extra='<div class="apBtns"><button class="action" type="button" data-pub="aelter">Trotzdem hochladen (älteres Paket)</button></div>';
      if(ziel==="live" && /LESBARKEIT/.test(all)) extra='<div class="apBtns"><button class="action" type="button" data-pub="trotzdem">Trotzdem live gehen</button></div>';
    }
    html+='<div class="apRow '+cls+'"><i>'+icon+'</i><div><b>'+label+': '+pubE(titel)+'</b><span>'+(run?"läuft … ("+pubAgo(lauf.zeit)+")":(ok?"fertig":"abgebrochen")+" · "+pubAgo(lauf.zeit))
      +(msgs?'<br>'+msgs:(!run&&!ok?'<br>Keine Meldung – Details bei GitHub.':''))+' · <a href="'+pubE(lauf.url)+'" target="_blank" rel="noopener">Details bei GitHub</a></span>'+extra+'</div></div>';
  }
  if(pages){
    const run=pubLaeuft(pages), ok=pages.ergebnis==="success", cls=run?"warn":ok?"ok":"bad";
    const lang=run && (Date.now()-new Date(pages.zeit).getTime())>8*60000;
    html+='<div class="apRow '+cls+'"><i>'+(run?"⏳":ok?"✓":"✗")+'</i><div><b>'+label+'-App veröffentlichen (GitHub Pages)</b><span>'
      +(run?(pages.status==="queued"?"wartet":"läuft")+" seit "+pubAgo(pages.zeit).replace("vor ",""):ok?"fertig · "+pubAgo(pages.zeit):"fehlgeschlagen · "+pubAgo(pages.zeit))
      +' · <a href="'+pubE(pages.url)+'" target="_blank" rel="noopener">Details</a></span>'
      +((!ok&&!run)||lang?'<div class="apBtns"><button class="action" type="button" data-pub="neu-'+ziel+'">↻ Neu bereitstellen</button></div>':'')+'</div></div>';
  }
  return html;
}
function pubRender(){
  const d=pubData||{}, t=d.test||{}, l=d.live||{};
  const st=pubEl("admPubStand"); if(st) st.innerHTML='<div>Test-App<b>'+pubE(t.version||"–")+'</b></div><div>Live-App<b>'+pubE(l.version||"–")+'</b></div>';
  const hint=pubEl("admPubHint"), cmp=pubCmp(t.version,l.version);
  if(hint) hint.textContent=!t.version||!l.version?"":cmp>0?"Die Test-App ist neuer – bereit für „Live gehen“.":cmp===0?"Test und Live sind auf demselben Stand.":"Live ist neuer als die Test-App.";
  const runs=pubEl("admPubRuns"); if(runs) runs.innerHTML=pubRow("Test","test",t.lauf,t.pages)+pubRow("Live","live",l.lauf,l.pages);
  const sum=pubEl("admPubSum"), busy=pubWait||pubLaeuft(t.lauf)||pubLaeuft(l.lauf)||pubLaeuft(t.pages)||pubLaeuft(l.pages);
  if(sum){ sum.className="admSum"+(busy?" warn":l.version?" ok":""); sum.textContent=busy?"läuft …":l.version?("Live "+l.version):"Test → Live"; }
}
async function pubLoad(){
  try{
    pubData=await pubCall({aktion:"status"});
    if(pubWait){ const z=(pubData[pubWait.ziel]||{}).lauf; if(z && z.titel===pubWait.auftrag) pubWait=null; else if(Date.now()-pubWait.seit>120000){ pubWait=null; pubMsg("GitHub hat den Ablauf nicht gestartet. Bitte „↻“ antippen oder später erneut versuchen.","bad"); } }
    pubRender(); pubFails=0;
    const m=pubEl("admPubMsg"); if(m&&!m.hidden&&m.textContent.startsWith("Keine Verbindung zum Veröffentlichen-Dienst")) pubMsg("");
  }catch(e){ console.warn(e); pubFails++;
    /* Beim automatischen Nachladen kurze Aussetzer (Bildschirm aus, Funkloch) still überbrücken */
    if(!pubData||pubFails>=3) pubMsg(pubErr(e),"bad");
    if(pubData&&Date.now()<pubPollUntil){ clearTimeout(pubTimer); pubTimer=setTimeout(pubLoad,8000); return; } }
  const d=pubData||{}, busy=pubWait||[d.test,d.live].some(x=>x&&(pubLaeuft(x.lauf)||pubLaeuft(x.pages)));
  clearTimeout(pubTimer);
  if(busy && Date.now()<pubPollUntil) pubTimer=setTimeout(pubLoad,6000);
}
function pubFollow(ziel,auftrag){ pubWait={ziel,auftrag,seit:Date.now()}; pubPollUntil=Date.now()+20*60000; pubRender(); clearTimeout(pubTimer); pubTimer=setTimeout(pubLoad,4000); }
async function pubDo(data, ziel, startText){
  if(pubBusy) return; pubBusy=true; document.querySelectorAll("#admPubBox button.action").forEach(b=>b.disabled=true);
  pubMsg(startText,"warn");
  try{ const r=await pubCall(data); pubMsg(""); pubFollow(ziel,r.auftrag); }
  catch(e){ console.warn(e); pubMsg(pubErr(e),"bad"); }
  finally{ pubBusy=false; document.querySelectorAll("#admPubBox button.action").forEach(b=>b.disabled=false); }
}
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&pubEl("admPubBody")&&!pubEl("admPubBody").hidden&&pubData){ pubFails=0; pubLoad(); } });
pubEl("admPubRefresh")?.addEventListener("click",()=>{ pubMsg(""); pubPollUntil=Date.now()+20*60000; pubLoad(); });
document.querySelector("#admPubBox .admFoldHead")?.addEventListener("click",()=>{ if(pubEl("admPubBody")?.hidden){ pubPollUntil=Date.now()+20*60000; pubLoad(); } });
pubEl("admPubTest")?.addEventListener("click",()=>{ const f=pubEl("admPubFile"); if(f){ f.value=""; f.click(); } });
pubEl("admPubFile")?.addEventListener("change",e=>{
  const file=e.target.files&&e.target.files[0]; if(!file) return;
  if(!/\.zip$/i.test(file.name)){ pubMsg("Bitte die Zip-Datei mit der Testversion auswählen.","bad"); return; }
  if(file.size>7*1024*1024){ pubMsg("Das Paket ist zu groß (höchstens 7 MB).","bad"); return; }
  if(!/test/i.test(file.name) && !confirm("„"+file.name+"“ hat kein „test“ im Namen. Trotzdem als Test-Paket hochladen?")) return;
  const rd=new FileReader();
  rd.onload=()=>{ const b64=String(rd.result||"").split(",")[1]||""; pubDo({aktion:"testHochladen",zip:b64,name:file.name},"test","„"+pubE(file.name)+"“ wird hochgeladen …"); };
  rd.onerror=()=>pubMsg("Die Datei konnte nicht gelesen werden.","bad");
  rd.readAsDataURL(file);
});
pubEl("admPubLive")?.addEventListener("click",()=>{
  const t=pubData?.test?.version, l=pubData?.live?.version;
  if(t&&l&&pubCmp(t,l)<0){ pubMsg("Die Test-App ("+pubE(t)+") ist älter als Live ("+pubE(l)+"). Dafür „Live zurücksetzen“ verwenden.","warn"); return; }
  const hinweis=!!pubEl("admPubHinweis")?.checked;
  if(t&&l&&pubCmp(t,l)===0){ if(confirm("Live ist schon auf "+l+".\n\nNur die mitgelieferte Doku (README, Anleitung, PDF) übernehmen, falls es neue gibt?")) pubDo({aktion:"liveGehen",hinweis},"live","Auftrag wird an GitHub übergeben …"); return; }
  if(!confirm("Live gehen: "+(l||"?")+" → "+(t||"aktueller Test-Stand")+"?\n\n"+(hinweis?"Nutzer sehen den Hinweis „Neue Version verfügbar“.":"Ohne Update-Hinweis: Nutzer bekommen die neue Version still beim nächsten Öffnen der App."))) return;
  pubDo({aktion:"liveGehen",hinweis},"live","Auftrag wird an GitHub übergeben …");
});
pubEl("admPubBack")?.addEventListener("click",()=>{
  const box=pubEl("admPubBackBox"); if(!box) return;
  if(!box.hidden){ box.hidden=true; return; }
  const l=pubData?.live?.version, list=(pubData?.staende||[]).filter(v=>v!==l);
  box.hidden=false;
  box.innerHTML=list.length?'<div class="small" style="margin-bottom:6px">Live (jetzt '+pubE(l||"?")+') auf einen früheren Stand zurücksetzen. Firestore-Regeln und Functions bleiben unverändert.</div><select id="admPubBackSel">'+list.map(v=>'<option value="'+pubE(v)+'">'+pubE(v)+'</option>').join("")+'</select><div class="apBtns"><button id="admPubBackGo" class="action" type="button">↩ Zurücksetzen</button><button id="admPubBackNo" class="action" type="button">Abbrechen</button></div>'
    :'<div class="small">Noch keine früheren Stände gespeichert (entstehen bei jedem „Live gehen“).</div>';
  pubEl("admPubBackNo")?.addEventListener("click",()=>{box.hidden=true;});
  pubEl("admPubBackGo")?.addEventListener("click",()=>{ const v=pubEl("admPubBackSel")?.value; if(!v) return;
    if(!confirm("Live wirklich von "+(l||"?")+" auf "+v+" zurücksetzen?")) return;
    box.hidden=true; pubDo({aktion:"zurueck",version:v},"live","Auftrag wird an GitHub übergeben …"); });
});
pubEl("admPubRuns")?.addEventListener("click",e=>{
  const b=e.target.closest("[data-pub]"); if(!b) return; const a=b.dataset.pub;
  if(a==="aelter"){ if(confirm("Das ältere Paket trotzdem in die Test-App übernehmen?")) pubDo({aktion:"testHochladen",nochmal:true,aelter:true,name:"erneut"},"test","Auftrag wird an GitHub übergeben …"); }
  else if(a==="trotzdem"){ if(confirm("Trotz kaum lesbarer Stellen live gehen?")) pubDo({aktion:"liveGehen",trotzdem:true,hinweis:!!pubEl("admPubHinweis")?.checked},"live","Auftrag wird an GitHub übergeben …"); }
  else if(a==="neu-test"||a==="neu-live"){ const z=a.slice(4); pubDo({aktion:"neu",ziel:z},z,"Veröffentlichung wird neu angestoßen …"); }
});
document.getElementById("admAdvRefresh")?.addEventListener("click",loadAdventStats);
document.querySelector("#admAdvBox .admFoldHead")?.addEventListener("click",()=>{ if(document.getElementById("admAdvBody")?.hidden) loadAdventStats(); });
/* 1.27.0: Saisonende-Sicherung – Firestore-Sammlungen + Spielplan als JSON-Datei */
async function admBackup(){
  const btn=document.getElementById("admBackupBtn"), msg=document.getElementById("admBackupMsg"); if(!btn)return;
  const NAMES=["results","reports","news","scheduleOverrides","bugReports","adventAnswers","ehvSync","live","appConfig"];
  const plain=v=>v&&typeof v.toDate==="function"?v.toDate().toISOString():Array.isArray(v)?v.map(plain):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,plain(x)])):v;
  btn.disabled=true; msg.hidden=false; msg.className="apResult"; msg.textContent="Wird gesammelt …";
  const out={app:APP_CFG.appName,season:APP_CFG.season,version:(document.querySelector(".inVer")||{}).textContent||"",created:new Date().toISOString(),games:ALL_GAMES,collections:{}}, cnt=[];
  for(const n of NAMES){try{const snap=await getDocs(collection(db,n));out.collections[n]=snap.docs.map(d=>({id:d.id,data:plain(d.data())}));cnt.push(n+": "+snap.docs.length)}catch(err){out.collections[n]={fehler:String(err&&err.message||err)};cnt.push(n+": nicht lesbar")}}
  const blob=new Blob([JSON.stringify(out,null,1)],{type:"application/json"}), a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download="grizzlys-sicherung-"+APP_CFG.season.replace("/","-")+"-"+new Date().toISOString().slice(0,10)+".json";
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);
  msg.className="apResult ok"; msg.textContent="✓ Sicherung erstellt ("+(blob.size/1024).toFixed(0)+" KB) · "+cnt.join(" · "); btn.disabled=false;
}
document.getElementById("admBackupBtn")?.addEventListener("click",admBackup);
function setAdminUi(user){
  const login=document.getElementById("adminLogin"), panel=document.getElementById("adminPanel"), status=document.getElementById("adminStatus");
  if(user && user.uid===ADMIN_UID){ login.hidden=true; panel.hidden=false; status.textContent="Admin angemeldet"; document.getElementById("adminLogout").hidden=false; loadBugReports(); setupAnalyticsDashboard(); adminNewsEditor(); setupAdminPushStatus(); admStart(); loadSprueche(true).then(()=>adminSpruchEditor()); try{adminWishEditor();adminReactions();loadCaptains(true).then(()=>adminCaptainEditor())}catch(e){console.warn(e)} }
  else { login.hidden=false; panel.hidden=true; document.getElementById("adminLogout").hidden=true; status.textContent=user?"Angemeldet, aber keine Admin-Berechtigung":"Nicht angemeldet"; }
}

document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("adminLoginForm");
  form?.addEventListener("submit",async e=>{e.preventDefault();const email=document.getElementById("adminEmail").value.trim(),pw=document.getElementById("adminPassword").value;try{const cred=await signInWithEmailAndPassword(auth,email,pw);document.getElementById("adminPassword").value="";if(cred.user?.uid===ADMIN_UID) await registerAdminPushToken(true);}catch(err){alert("Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.");}});
  document.getElementById("openAdmin")?.addEventListener("click",()=>{const m=document.getElementById("adminModal");if(m){m.hidden=false;m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";document.getElementById("adminEmail")?.focus();}});
  document.getElementById("adminModalClose")?.addEventListener("click",closeAdminModal);
  document.getElementById("adminModal")?.addEventListener("click",e=>{if(e.target.id==="adminModal")closeAdminModal();});
  document.getElementById("adminLogout")?.addEventListener("click",()=>signOut(auth));
  document.getElementById("openBugReport")?.addEventListener("click",()=>{const m=document.getElementById("bugReportModal");if(m){m.hidden=false;m.setAttribute("aria-hidden","false");document.getElementById("bugReportName")?.focus();}});
  document.getElementById("bugReportClose")?.addEventListener("click",closeBugReport);
  document.getElementById("bugReportCancel")?.addEventListener("click",closeBugReport);
  document.getElementById("bugReportSend")?.addEventListener("click",submitBugReport);
  FB_FIELDS.forEach(id=>{const el=document.getElementById(id);el?.addEventListener("input",fbSaveDraft);el?.addEventListener("change",fbSaveDraft);});
  document.getElementById("openBugReport")?.addEventListener("click",fbRestoreDraft);
  document.getElementById("adminBugFilter")?.addEventListener("change",loadBugReports);
  document.getElementById("adminBugType")?.addEventListener("change",loadBugReports);
  document.getElementById("thanksClose")?.addEventListener("click",closeFeedbackThanks);
  document.getElementById("thanksModal")?.addEventListener("click",e=>{if(e.target.id==="thanksModal")closeFeedbackThanks();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeFeedbackThanks();});
  document.getElementById("bugReportType")?.addEventListener("change",updateBugReportType);
  document.getElementById("bugReportModal")?.addEventListener("click",e=>{if(e.target.id==="bugReportModal")closeBugReport();});
  document.getElementById("pushRenew")?.addEventListener("click",async e=>{
    const b=e.currentTarget, note=document.getElementById("pushRenewNote"), label=b.textContent;
    b.disabled=true; b.textContent="Push wird neu eingerichtet …";
    const ok=await renewPushRegistration();
    b.disabled=false; b.textContent=label;
    if(note){note.hidden=false;note.textContent=ok?"Push wurde auf diesem Gerät neu eingerichtet ✓":(typeof _testBlock!=="undefined"?"In der Testversion ist die Push-Anmeldung gesperrt.":"Das hat nicht geklappt. Bitte Internetverbindung prüfen und noch einmal versuchen.");}
  });
  document.getElementById("enablePush")?.addEventListener("click",async()=>{
    if(!FIREBASE_VAPID_KEY){alert("Push ist vorbereitet. Es fehlt noch der Web-Push-Schlüssel (VAPID) aus Firebase.");return;}
    try{
      const supported=await isSupported();
      if(!supported) throw new Error("Dieser Browser unterstützt Web-Push nicht.");
      if(!('Notification' in window)) throw new Error("Benachrichtigungen werden von diesem Browser nicht unterstützt.");
      if(Notification.permission !== "granted"){
        const permission=await Notification.requestPermission();
        if(permission !== "granted") throw new Error(permission === "denied" ? "Benachrichtigungen wurden im Browser blockiert." : "Benachrichtigungs-Berechtigung wurde nicht erteilt.");
      }
      messaging=messaging||getMessaging(app);
      const reg=await navigator.serviceWorker.register("./sw.js");
      await navigator.serviceWorker.ready;
      const token=await getToken(messaging,{vapidKey:FIREBASE_VAPID_KEY,serviceWorkerRegistration:reg});
      if(!token) throw new Error("Firebase hat kein Push-Token geliefert.");
      await setDoc(doc(db,"pushTokens",token),{
        token,
        installationId:getInstallationId(),
        createdAt:serverTimestamp(),
        updatedAt:serverTimestamp(),
        platform:navigator.userAgent,
        prefs:pushPrefs(),
        admin:auth.currentUser?.uid===ADMIN_UID,
        adminUid:auth.currentUser?.uid===ADMIN_UID?ADMIN_UID:null
      });
      try{localStorage.setItem("grizzlysPushRegistered","1");localStorage.setItem("grizzlysPushToken",token);}catch(e){}window.dispatchEvent(new Event("grizzlysPushChanged"));
      await setDoc(doc(db,"appInstallations",getInstallationId()),{
        installationId:getInstallationId(),
        platform:detectPlatform(),
        userAgent:navigator.userAgent||"",
        pushEnabled:true,
        pushRegisteredAt:serverTimestamp(),
        updatedAt:serverTimestamp()
      },{merge:true});
      alert("Push-Benachrichtigungen sind auf diesem Gerät aktiviert und registriert.");
    }catch(e){
      console.error("Push-Aktivierung fehlgeschlagen:",e);
    }
  });
  onAuthStateChanged(auth,user=>{setAdminUi(user);if(user?.uid===ADMIN_UID){registerAdminPushToken(true);loadReports();}});
  registerAppInstallation();
  syncExistingPushRegistration().then(()=>registerAppInstallation());
  loadResults();
  startLive();
  loadScheduleOverrides();
  loadNews();
  loadSprueche();
  loadCaptains();
  loadWeather();
  loadReports();
  isSupported().then(ok=>{
  if(ok && FIREBASE_VAPID_KEY){
    messaging=getMessaging(app);
    onMessage(messaging,payload=>{
      
      const n=payload.notification||{};
      if(payload.data&&payload.data.type==="bugReport"){
        // Rückmeldungen: kein Systemhinweis im Vordergrund, Admin-Liste still aktualisieren
        try{if(auth.currentUser&&auth.currentUser.uid===ADMIN_UID)loadBugReports();}catch(e){}
        return;
      }
      if(payload.data&&payload.data.type==="adminTest"){try{adminPushTestArrived()}catch(e){}return;}
      if(payload.data&&payload.data.type==="news"){try{loadNews()}catch(e){}}
      // 1.9.1.125: Ist die App gerade offen, zeigt Firebase selbst nichts an. Darum hier eine echte Systemmeldung
      // (wie bei geschlossener App) statt nur eines Hinweisfensters – sonst geht z. B. der Ergebnis-Push unter.
      const d=payload.data||{}, typ=d.type||"";
      const title=n.title||d.title||"🏒 ESV Grizzlys U15", body=n.body||d.body||"";
      if(typ==="result"){try{loadResults()}catch(e){}}
      if(typ==="report"){try{loadReports()}catch(e){}} /* 1.43.0 */
      if(!title&&!body) return;
      const SITE="https://jazm1309.github.io/grizzlys-u15/";
      const icon=typ==="result"||typ==="report"||/^live/.test(typ)?SITE+"grizzlys-result-icon.png":typ==="gameReminder"?SITE+"grizzlys-24h-icon-192.png":SITE+"icon-192.png";
      (async()=>{
        try{
          if(Notification.permission!=="granted") throw new Error("keine Erlaubnis");
          const reg=await navigator.serviceWorker.ready;
          await reg.showNotification(title,{body,icon,badge:SITE+"badge-96.png",tag:d.tag||("fg-"+(typ||"push")+"-"+Date.now()),renotify:!!d.tag,data:d});
        }catch(e){ alert(title+"\n"+body); }
      })();
    });
  }
}).catch(e=>{
  alert("FCM Fehler: " + (e?.code || e?.message || String(e)));
});
});

/* ===== v66: News – Freitext-Hinweise (Firestore-Sammlung "news") ===== */
window.getScheduleOverrides=()=>scheduleOverrides;
window.registerAppInstallation=registerAppInstallation;
window.adminNewsEditor=()=>adminNewsEditor();
window.admNewsPrefill=g=>{const f=document.getElementById("newsFormBox");if(!f)return;f.hidden=false;const opp=shortTeam(isHome(g)?g.away:g.home);const t=document.getElementById("newsTitle");t.value=teamName(g.team)+" gegen "+opp+" ("+new Date(g.date+"T12:00:00").toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+"): ";document.getElementById("newsTeam").value=g.team;const u=document.getElementById("newsUntil");if(u&&g.date>=new Date().toLocaleDateString("sv-SE"))u.value=g.date;t.focus();t.setSelectionRange(t.value.length,t.value.length)};
/* 1.9.1.128: Spielberichte (Firestore-Sammlung "reports", Dokument-ID = Ergebnis-Schlüssel) */
async function loadReports(){
  try{
    const isAdm=auth.currentUser?.uid===ADMIN_UID;
    const snap=await getDocs(isAdm?collection(db,"reports"):query(collection(db,"reports"),where("published","==",true))), m={};
    snap.forEach(d=>{const x=d.data()||{};m[d.id]={title:String(x.title||""),text:String(x.text||""),keywords:String(x.keywords||""),use:x.use&&typeof x.use==="object"?x.use:{},len:x.len==="kurz"?"kurz":"",published:x.published===true,publishedAt:x.publishedAt?.toMillis?x.publishedAt.toMillis():0,auto:x.auto===true,autoPublishAt:x.autoPublishAt?.toMillis?x.autoPublishAt.toMillis():0,autoPublished:x.autoPublished===true,bausteine:x.bausteine&&typeof x.bausteine==="object"?x.bausteine:null}});
    Object.keys(window.gameReports||{}).forEach(k=>{if(window.gameReports[k]._local)m[k]=window.gameReports[k]});
    window.gameReports=m;
  }catch(err){ console.warn("Spielberichte konnten nicht geladen werden",err); }
  try{renderNext();renderList()}catch(e){console.warn(e)}
  window.renderNews?.(); if(adm.sheet)admRenderSheet();
}
/* 1.37.0: automatische Freigabe eines Auto-Entwurfs stoppen (Entwurf bleibt erhalten) */
async function admRepHold(g){
  const k=resultKey(g);
  try{await updateDoc(doc(db,"reports",k),{auto:false,autoPublishAt:null,updatedAt:serverTimestamp()});
    if(window.gameReports[k])Object.assign(window.gameReports[k],{auto:false,autoPublishAt:0});return true}
  catch(err){if(String(err.message||err).startsWith("Testversion")){if(window.gameReports[k])Object.assign(window.gameReports[k],{auto:false,autoPublishAt:0,_local:true});alert("Testversion: nur auf diesem Gerät geändert.");return true}
    console.error(err);alert("Konnte nicht gespeichert werden.");return false}
}
async function admRepSave(g,title,text,published){
  const k=resultKey(g), old=window.gameReports[k]||{}, keywords=String(admRepKwGet(g)||"").slice(0,200), use=admRepUseGet(g), len=admRepLenGet(g)==="kurz"?"kurz":"";
  const pubAt=published?(old.published&&old.publishedAt?old.publishedAt:Date.now()):0;
  const loc={title,text,published,publishedAt:pubAt,keywords,use,len,bausteine:(window.__repBs&&window.__repBs[k])||old.bausteine||null};
  try{
    const bs=(window.__repBs&&window.__repBs[k])||old.bausteine||null;
    await setDoc(doc(db,"reports",k),{gameId:k,team:g.team,date:g.date,title:title.slice(0,120),text:text.slice(0,2000),keywords,use,len,bausteine:bs,published,publishedAt:published?(old.published&&old.publishedAt?new Date(old.publishedAt):serverTimestamp()):null,updatedAt:serverTimestamp()});
    window.gameReports[k]=loc;
    return true;
  }catch(err){
    if(String(err.message||err).startsWith("Testversion")){window.gameReports[k]={...loc,_local:true};alert("Testversion: Bericht nur auf diesem Gerät übernommen, nicht gespeichert.");return true}
    console.error(err);alert("Speichern nicht möglich: "+(err.message||err));return false;
  }
}
/* 1.9.1.129: Spieldetails vom EHV (Function gameReport) für den Bericht holen */
const REP_NAMES_KEY="grizzlysRepNames";
const admRepNames=()=>false; /* 1.26.0: Spielberichte nie mit Namen – nur Rückennummern */
const admRepState={};
async function admRepLoad(g,force=false){
  const k=resultKey(g), names=admRepNames(), st=admRepState[k];
  if(!force&&st&&(st.busy||(st.ok&&st.names===names)||st.err))return;
  admRepState[k]={busy:true,names};
  const r=resultFor(g)||{};
  try{
    const res=(await httpsCallable(functions,"gameReport")({team:g.team,date:g.date,home:g.home,away:g.away,ehvGameId:r.ehvGameId||"",names})).data||{};
    if(res.ok&&res.report){window.repDetails[k]=res.report;admRepState[k]={ok:true,names}}
    else admRepState[k]={err:res.reason||"Keine Spieldetails gefunden."};
  }catch(err){console.warn("gameReport",err);admRepState[k]={err:/not-found|NOT_FOUND/i.test(String(err.code||err.message))?"Function „gameReport“ ist noch nicht deployt.":"Spieldetails vom EHV gerade nicht abrufbar."}}
  if(adm.sheet&&admGame(adm.sheet)===g){
    const w=document.getElementById("admSheet"), tx=w&&w.querySelector("#admRepText"), ti=w&&w.querySelector("#admRepTitle"), h=w&&w.querySelector("#admRepEhv");
    if(tx&&tx.dataset.auto==="1"){const d=admRepGen(g,Number(tx.dataset.v)||0);if(d){ti.value=d.title;tx.value=d.text;admRepRemember(g)}}
    admRepChipsRefresh(g);
    if(h)h.innerHTML=admRepEhvHint(k);
  }
}
function admRepEhvHint(k){
  const st=admRepState[k]||{};
  if(st.busy)return "⏳ Spieldetails vom EHV werden geladen …";
  if(st.ok)return "✓ EHV-Spieldetails eingerechnet";
  if(st.err)return "ℹ️ "+esc(st.err)+" Der Entwurf nutzt nur Ergebnis, Drittel und Tabelle.";
  return "";
}
const admRepKw={}; /* Schlagworte je Spiel (bis zum Speichern im Speicher) */
const admRepForm={}; /* 1.9.1.135: Formularstand je Spiel (Überschrift, Text, Entwurf-Variante, unverändert ja/nein) – übersteht das Neuzeichnen des Fensters */
const admRepKwGet=g=>{const k=resultKey(g);return k in admRepKw?admRepKw[k]:((window.gameReports[k]||{}).keywords||"")};
/* 1.9.1.136: Auswahl der Angaben (use) und Länge (len) je Spiel */
const admRepSel={};
const admRepUseGet=g=>{const k=resultKey(g);return admRepSel[k]?admRepSel[k].use:Object.assign({},(window.gameReports[k]||{}).use||{})};
const admRepLenGet=g=>{const k=resultKey(g);return admRepSel[k]?admRepSel[k].len:((window.gameReports[k]||{}).len||"")};
const admRepSelSet=(g,use,len)=>{admRepSel[resultKey(g)]={use,len}};
const admRepGen=(g,v,kw)=>{const d=window.repDraft(g,v||0,kw!==undefined?kw:admRepKwGet(g),admRepUseGet(g),admRepLenGet(g));if(d&&d.bausteine)(window.__repBs=window.__repBs||{})[resultKey(g)]=d.bausteine;return d}; /* 1.37.1: Bausteine merken */
function admRepChipsHtml(g){
  const d=admRepGen(g,0); if(!d||!d.facts)return "";
  const use=admRepUseGet(g), len=admRepLenGet(g);
  /* 1.26.2: Angaben als kompakte Häkchen-Liste statt Chips */
  const rows=Object.entries(d.facts).filter(([k,f])=>f.avail).map(([k,f])=>{const on=k in use?!!use[k]:f.def;
    return `<label class="admUse"><input type="checkbox" data-use="${k}"${on?" checked":""}><span>${esc(f.label)}</span></label>`}).join("");
  const MOM={comeback:"Aufholjagd",lc:"Führungswechsel",lateEq:"später Ausgleich",hat:"Hattrick",blitz:"Torflut",en:"leeres Tor"};
  const det=!!window.repDetails[resultKey(g)];
  const na=Object.keys(MOM).filter(k=>d.facts[k]&&!d.facts[k].avail).map(k=>MOM[k]);
  return `<div class="admUseTop"><span>Länge</span><div class="admRepLen" role="group" aria-label="Länge"><button type="button" data-len=""${len?"":' class="on"'}>Normal</button><button type="button" data-len="kurz"${len==="kurz"?' class="on"':""}>Kurz</button></div></div>
    <div class="admUseList">${rows}</div>${na.length?`<div class="admUseNa">${det?"Nicht in diesem Spiel":"Erst mit EHV-Spieldetails"}: ${esc(na.join(" · "))}</div>`:""}`;
}
function admRepMoreSum(g){
  const d=admRepGen(g,0); if(!d||!d.facts)return "";
  const use=admRepUseGet(g), n=Object.entries(d.facts).filter(([k,f])=>f.avail&&(k in use?!!use[k]:f.def)).length;
  const kw=String(admRepKwGet(g)||"").split(/[,;\n]+/).filter(x=>x.trim()).length;
  return (admRepLenGet(g)==="kurz"?"Kurz":"Normal")+" · "+n+" Angaben"+(kw?" · "+kw+" Schlagwort"+(kw===1?"":"e"):"");
}
function admRepChipsBind(g){
  const w=document.getElementById("admSheet"), box=w&&w.querySelector("#admRepUse"); if(!box)return;
  box.querySelectorAll("[data-use]").forEach(b=>b.onchange=()=>{
    const use=admRepUseGet(g), d=admRepGen(g,0), f=d&&d.facts[b.dataset.use]; if(!f)return;
    const cur=b.dataset.use in use?!!use[b.dataset.use]:f.def; use[b.dataset.use]=!cur;
    admRepSelSet(g,use,admRepLenGet(g)); admRepRegen(g,true); admRepChipsRefresh(g);
  });
  box.querySelectorAll("[data-len]").forEach(b=>b.onclick=()=>{admRepSelSet(g,admRepUseGet(g),b.dataset.len);admRepRegen(g,true);admRepChipsRefresh(g)});
}
function admRepChipsRefresh(g){const w=document.getElementById("admSheet"),box=w&&w.querySelector("#admRepUse");if(box){box.innerHTML=admRepChipsHtml(g);admRepChipsBind(g)}const sm=w&&w.querySelector("#admRepMoreSum");if(sm)sm.textContent=admRepMoreSum(g)}
/* Text neu erzeugen (mit Rückfrage, wenn er von Hand geändert wurde) */
function admRepRegen(g,ask){
  const c=admRepCur(); if(!c.tx)return false;
  if(c.tx.dataset.auto!=="1"){if(!ask)return false;if(!confirm("Text neu erzeugen? Deine eigenen Änderungen am Text gehen dabei verloren."))return false}
  const d=admRepGen(g,Number(c.tx.dataset.v)||0,c.kw?c.kw.value:undefined);
  if(d){c.ti.value=d.title;c.tx.value=d.text;c.tx.dataset.auto="1";admRepRemember(g)}
  return true;
}
/* 1.26.2: Kurzinfo für den eingeklappten Spielbericht */
/* 1.46.0: einheitliche Linien-Symbole statt gemischter Emojis */
const ADM_IC={"puck": "<ellipse cx=\"12\" cy=\"10\" rx=\"8\" ry=\"3\"/><path d=\"M4 10v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4\"/>", "cal": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>", "ban": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M5.6 5.6l12.8 12.8\"/>", "news": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3\"/><path d=\"M8 9h8M8 13h8M8 16.5h4\"/>", "doc": "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M14 3v5h5M9 13h7M9 17h5\"/>"};
const admIc=k=>'<svg class="admFi" viewBox="0 0 24 24" aria-hidden="true">'+(ADM_IC[k]||"")+'</svg>';
function admRepSum(g,has){
  if(!has)return "nach dem Spiel";
  const r=window.gameReports[resultKey(g)];
  return r&&r.published?'<span class="admSt ok">veröffentlicht</span>':r&&r.text?'<span class="admSt chg">Entwurf gespeichert</span>':"automatischer Entwurf";
}
function admRepBox(g,has){
  if(!has)return `<div class="admBox"><h5>${admIc("doc")}Spielbericht</h5><div class="admHint">Sobald ein Ergebnis da ist, erstellt die App hier einen Entwurf.</div></div>`;
  const k=resultKey(g), r=window.gameReports[k], F=admRepForm[k];
  const d=F?F:r&&r.text?r:(admRepGen(g,0)||{title:"",text:""});
  /* 1.37.0: Entwürfe der Cloud Function (auto) – erscheinen nach Frist von selbst */
  const autoAt=r&&r.auto&&!r.published&&r.autoPublishAt?new Date(r.autoPublishAt).toLocaleString("de-DE",{weekday:"short",hour:"2-digit",minute:"2-digit"}):"";
  const st=r&&r.published?`<span class="admSt ok">${r.autoPublished?"automatisch veröffentlicht":"veröffentlicht"}</span>`:autoAt?`<span class="admSt chg">Auto-Entwurf · erscheint ${esc(autoAt)} Uhr</span>`:r&&r.text?'<span class="admSt chg">Entwurf gespeichert</span>':'<span class="admSt">automatischer Entwurf</span>';
  const auto=F?F.auto:!(r&&r.text);
  adm.fold=adm.fold||{}; const more=!!adm.fold.repMore;
  const btns=r&&r.published?'<button type="button" class="admBtn pri" data-rep="pub">💾 Änderung veröffentlichen</button><button type="button" class="admBtn no" data-rep="off">Zurückziehen</button>':'<button type="button" class="admBtn pri" data-rep="pub">📰 Veröffentlichen</button><button type="button" class="admBtn" data-rep="save">Als Entwurf speichern</button>'+(autoAt?'<button type="button" class="admBtn no" data-rep="hold">⏸ Nicht automatisch veröffentlichen</button>':'');
  return `<div class="admBox"><h5>${admIc("doc")}Spielbericht ${st}</h5><div class="admForm admRepForm">
    <label class="full">Überschrift<input id="admRepTitle" maxlength="120" value="${esc(d.title)}"></label>
    <div class="full admRepTxtHead"><span>Text</span><button type="button" class="admTxtBtn" data-rep="new" title="Neuen Entwurf erzeugen">↻ Neu</button><button type="button" class="admTxtBtn" data-rep="copy" title="Text kopieren">📋 Kopieren</button></div>
    <label class="full admRepTxt"><textarea id="admRepText" aria-label="Text" rows="8" maxlength="2000"${auto?' data-auto="1"':""} data-v="${F?F.v||0:0}">${esc(d.text)}</textarea></label></div>
    <div class="admBtns admRepBtns">${btns}</div>
    <div class="admAiRow"><span>🤖 Mit KI-App schreiben</span><button type="button" class="admTxtBtn" data-rep="ai">1 · Auftrag kopieren</button><button type="button" class="admTxtBtn" data-rep="paste">2 · Antwort einfügen</button></div>
    <details class="admRepMore"${more?" open":""}><summary><b>⚙️ Inhalt anpassen</b><span id="admRepMoreSum">${esc(admRepMoreSum(g))}</span><i class="admChev" aria-hidden="true">⌄</i></summary>
      <div class="admForm admRepForm"><label class="full">Schlagworte<span class="admRepKwRow"><input id="admRepKw" maxlength="200" placeholder="z. B. Teamgeist, Kampfgeist, starker Torhüter" value="${esc(admRepKwGet(g))}"><button type="button" class="admBtn" data-rep="kw">Übernehmen</button></span><small class="admRepKwHint">Mit Komma trennen – die App macht daraus passende Sätze.</small></label>
      <div class="full"><div id="admRepUse">${admRepChipsHtml(g)}</div></div></div></details>
    <div class="admRepFoot"><span id="admRepEhv">${admRepEhvHint(resultKey(g))}</span> · Spieler nur mit Rückennummer, nie mit Namen.</div></div>`;
}
function admRepCur(){const w=document.getElementById("admSheet");return w?{ti:w.querySelector("#admRepTitle"),tx:w.querySelector("#admRepText"),kw:w.querySelector("#admRepKw"),hint:w.querySelector(".admRepKwHint")}:{}}
function admRepRemember(g){const c=admRepCur();if(!c.tx||!c.ti)return;admRepForm[resultKey(g)]={title:c.ti.value,text:c.tx.value,auto:c.tx.dataset.auto==="1",v:Number(c.tx.dataset.v)||0}}
function admRepApplyKw(g,ask){
  const c=admRepCur(); if(!c.tx)return;
  if(c.kw)admRepKw[resultKey(g)]=c.kw.value;
  if(c.tx.dataset.auto!=="1"){
    if(!ask){if(c.hint)c.hint.textContent="Du hast den Text selbst geändert – tippe „Übernehmen“, um ihn mit den Schlagworten neu zu erzeugen.";return}
    if(!confirm("Text mit den Schlagworten neu erzeugen? Deine eigenen Änderungen am Text gehen dabei verloren."))return;
  }
  const d=admRepGen(g,Number(c.tx.dataset.v)||0,c.kw?c.kw.value:"");
  if(d){c.ti.value=d.title;c.tx.value=d.text;c.tx.dataset.auto="1";admRepRemember(g)}
  if(c.hint)c.hint.textContent=(c.kw&&c.kw.value.trim())?"✓ Schlagworte sind im Text eingebaut.":"Mit Komma trennen – die App macht daraus passende Sätze.";
}
function admRepBind(box,g){
  const tx0=box.querySelector("#admRepText"), ti0=box.querySelector("#admRepTitle");
  if(tx0)tx0.addEventListener("input",()=>{delete tx0.dataset.auto;admRepRemember(g)});
  if(ti0)ti0.addEventListener("input",()=>admRepRemember(g));
  const nc=box.querySelector("#admRepNames");
  if(nc)nc.onchange=()=>{try{localStorage.setItem(REP_NAMES_KEY,nc.checked?"1":"0")}catch(e){}
    const c=admRepCur();
    if(c.tx&&!c.tx.dataset.auto&&!confirm("Text mit dem neuen Entwurf ersetzen? Eigene Änderungen gehen dabei verloren.")){admRepLoad(g,true);return}
    if(c.tx){c.tx.dataset.auto="1";admRepRemember(g)} admRepLoad(g,true)};
  if(box.querySelector("#admRepText"))admRepLoad(g);
  admRepChipsBind(g);
  const kwIn=box.querySelector("#admRepKw");
  if(kwIn){
    kwIn.addEventListener("input",()=>{admRepKw[resultKey(g)]=kwIn.value;clearTimeout(window.__repKwT);window.__repKwT=setTimeout(()=>admRepApplyKw(g,false),600)});
    kwIn.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();admRepApplyKw(g,true)}});
  }
  box.querySelectorAll("[data-rep]").forEach(b=>b.onclick=async()=>{
    const a=b.dataset.rep, ti=box.querySelector("#admRepTitle"), tx=box.querySelector("#admRepText"); if(!ti||!tx)return;
    if(a==="kw"){admRepApplyKw(g,true);return}
    if(a==="new"){if(tx.value.trim()&&!tx.dataset.auto&&!confirm("Text durch einen neuen automatischen Entwurf ersetzen?"))return;const v=(Number(tx.dataset.v)||0)+1;tx.dataset.v=v;const d=admRepGen(g,v);if(d){ti.value=d.title;tx.value=d.text;tx.dataset.auto="1";admRepRemember(g)}return}
    if(a==="ai"){const t=repAiPrompt(g,admRepKwGet(g),admRepLenGet(g),admRepUseGet(g));try{await navigator.clipboard.writeText(t);b.textContent="✓ Kopiert – jetzt in Claude oder ChatGPT einfügen"}catch(e){prompt("Auftrag kopieren:",t)}return}
    if(a==="paste"){let t="";try{t=await navigator.clipboard.readText()}catch(e){t=prompt("Antwort der KI hier einfügen:")||""}
      t=String(t||"").replace(/\r/g,"").trim(); if(t.length<20){alert("In der Zwischenablage steht noch keine Antwort. Erst in der KI-App den Text kopieren.");return}
      if(tx.value.trim()&&tx.dataset.auto!=="1"&&!confirm("Deinen Text durch die Antwort der KI ersetzen?"))return;
      const lines=t.split("\n"), first=(lines[0]||"").replace(/^[#*\s]+|[*\s]+$/g,"").replace(/^(Überschrift|Titel)\s*:\s*/i,"");
      const body=lines.slice(1).join("\n").replace(/^\s+/,"").replace(/\*\*/g,"");
      if(first&&first.length<=120&&body.length>=20){ti.value=first;tx.value=body.slice(0,2000)}else tx.value=t.replace(/\*\*/g,"").slice(0,2000);
      delete tx.dataset.auto; admRepRemember(g); b.textContent="✓ Eingefügt"; return}
    if(a==="hold"){b.disabled=true;if(await admRepHold(g)){try{renderNext();renderList()}catch(e){}admRenderSheet()}b.disabled=false;return}
    if(a==="copy"){const t=ti.value.trim()+"\n\n"+tx.value.trim();try{await navigator.clipboard.writeText(t);b.textContent="✓ Kopiert"}catch(e){prompt("Text kopieren:",t)}return}
    const title=ti.value.trim(), text=tx.value.trim();
    if(a!=="off"&&text.length<20){alert("Der Bericht ist noch zu kurz.");return}
    if(a==="pub"&&!confirm("Spielbericht für alle in den News und im Spiel anzeigen?"))return;
    if(a==="off"&&!confirm("Bericht zurückziehen? Er bleibt als Entwurf erhalten."))return;
    b.disabled=true;
    const wasAuto=tx.dataset.auto==="1", v0=Number(tx.dataset.v)||0;
    if(await admRepSave(g,title,text,a==="pub")){admRepForm[resultKey(g)]={title,text,auto:wasAuto,v:v0};try{renderNext();renderList()}catch(e){}window.renderNews?.();admRenderSheet()}
    b.disabled=false;
  });
}
async function loadNews(){
  try{
    const snap=await getDocs(collection(db,"news"));
    const arr=[]; snap.forEach(d=>{const x=d.data()||{};arr.push({id:d.id,title:String(x.title||""),text:String(x.text||""),team:String(x.team||""),until:String(x.until||""),push:x.push===true,created:x.createdAt?.toMillis?x.createdAt.toMillis():0})});
    window.newsNotes=arr.sort((a,b)=>b.created-a.created);
  }catch(err){ console.warn("Hinweise konnten nicht geladen werden",err); window.newsNotes=window.newsNotes||[]; }
  window.renderNews?.();
  if(auth.currentUser?.uid===ADMIN_UID) adminNewsEditor();
}
/* 1.9.1.127: Spieländerungen im Admin-News-Reiter – pro Änderung entscheiden, ob sie für alle in den News steht */
function admChgList(){
  const t=newsToday().getTime()-86400000, shown=new Set(newsChanges().map(c=>c.g));
  return ALL_GAMES.filter(g=>scheduleOverrides[scheduleGameId(g)]&&g._base&&dt(g).getTime()>=t).sort((a,b)=>dt(a)-dt(b)).map(g=>{
    const o=scheduleOverrides[scheduleGameId(g)], b=g._base, f=chgFields(b,g);
    const raw=["date","time","stadium","home","away"].filter(k=>(b[k]||"")!==(g[k]||""));
    return {g,id:scheduleGameId(g),o,f,raw,on:shown.has(g),auto:typeof o.news!=="boolean"};
  }).filter(x=>x.raw.length);
}
function admChgSection(e){
  const L=admChgList(); if(!L.length)return `<div class="admSec">Spieländerungen</div><div class="small">Keine kommenden Spieländerungen.</div>`;
  const lbl={date:"Datum",time:"Uhrzeit",stadium:"Spielort",home:"Heimteam",away:"Gastteam"};
  const row=x=>{const g=x.g,b=g._base,day=dt(g).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
    const was=x.raw.map(k=>k==="date"||k==="time"?null:`${lbl[k]}: ${e(b[k])} → ${e(g[k])}`).filter(Boolean);
    if(x.raw.includes("date")||x.raw.includes("time"))was.unshift(`Termin: ${e(admFd(b.date))} · ${e(b.time)} → ${e(admFd(g.date))} · ${e(g.time)} Uhr`);
    const why=x.auto?(x.f.length?"automatisch: echte Änderung":"automatisch: nur Schreibweise"):"von dir festgelegt";
    return `<div class="adminGame newsAdminItem admChg${x.on?"":" off"}" data-team="${e(g.team)}"><div class="adminGameHead"><div><b>${e(teamName(g.team))} · ${e(shortTeam(g.home))} – ${e(shortTeam(g.away))}</b><div class="small">${e(day)} · ${e(g.time)} Uhr · ${e(g.stadium)}</div></div>
      <label class="admSw" title="In den News für alle anzeigen"><input type="checkbox" data-chg="${e(x.id)}"${x.on?" checked":""}><span></span></label></div>
      <div class="small admChgWas">${was.join("<br>")}</div>
      <div class="admChgSt"><b>${x.on?"📰 In den News für alle":"🙈 Nicht in den News"}</b> · ${why}${x.auto?"":` · <button type="button" class="admChgAuto" data-auto="${e(x.id)}">automatisch</button>`}</div></div>`};
  return `<div class="admSec">Spieländerungen</div><div class="small" style="margin:-2px 2px 8px">Schalter an = alle Nutzer sehen die Änderung in den News.</div>${L.map(row).join("")}`;
}
async function admChgSet(id,val){
  const o=scheduleOverrides[id]; if(!o)return;
  const local=()=>{if(val===null)delete o.news;else o.news=val};
  try{
    const {deleteField}=await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
    await setDoc(doc(db,"scheduleOverrides",id),{news:val===null?deleteField():val,updatedAt:serverTimestamp()},{merge:true});
    local();
  }catch(err){
    if(String(err.message||err).startsWith("Testversion")){local();alert("Testversion: nur auf diesem Gerät umgestellt, nicht gespeichert.")}
    else{console.error(err);alert("Speichern nicht möglich: "+(err.message||err))}
  }
  window.renderNews?.(); adminNewsEditor(); if(adm.sheet)admRenderSheet();
}
function admChgBind(box){
  box.querySelectorAll("[data-chg]").forEach(c=>c.onchange=()=>{c.disabled=true;admChgSet(c.dataset.chg,c.checked)});
  box.querySelectorAll("[data-auto]").forEach(b=>b.onclick=()=>admChgSet(b.dataset.auto,null));
}
function adminNewsEditor(){
  const box=document.getElementById("adminNews"); if(!box) return;
  const e=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const d=new Date(Date.now()+14*86400000), p=n=>String(n).padStart(2,"0"), def=d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());
  const list=(window.newsNotes||[]);
  const today=new Date().toLocaleDateString("sv-SE"), vis=list.filter(n=>!n.until||n.until>=today), old=list.filter(n=>n.until&&n.until<today);
  const item=n=>`<div class="adminGame newsAdminItem"${old.includes(n)?' style="opacity:.6"':""}><div class="adminGameHead"><div><b>${e(n.title||"(ohne Überschrift)")}</b><div class="small">${n.team?e(teamName(n.team)):"Beide Mannschaften"} · bis ${n.until?e(n.until.split("-").reverse().join(".")):"unbegrenzt"}${n.push?" · mit Push":""}</div></div><button class="action newsDel" data-id="${e(n.id)}" type="button">Löschen</button></div>${n.text?`<div class="small" style="white-space:pre-line;margin-top:6px">${e(n.text)}</div>`:""}</div>`;
  box.innerHTML=`<button id="newsNewBtn" class="admNewsBtn" type="button">＋ Neuen Hinweis schreiben</button><div class="newsForm admNewsForm" id="newsFormBox" hidden>
    <input id="newsTitle" maxlength="80" placeholder="Überschrift (z. B. Treffpunkt geändert)">
    <textarea id="newsText" maxlength="600" rows="4" placeholder="Text des Hinweises"></textarea>
    <div class="newsFormRow"><label>Mannschaft<select id="newsTeam"><option value="">Alle</option><option value="A">U15 A</option><option value="B">U15 B</option><option value="U13">U13</option></select></label><label>Sichtbar bis<input id="newsUntil" type="date" value="${def}"></label></div>
    <label class="newsPushChk"><input id="newsPush" type="checkbox"> Zusätzlich als Push senden</label>
    <button id="newsSave" class="action" type="button">📰 Hinweis veröffentlichen</button>
  </div>
  ${admChgSection(e)}
  <div class="admSec">Hinweise · sichtbar</div>${vis.length?vis.map(item).join(""):'<div class="small">Gerade kein Hinweis sichtbar.</div>'}
  ${old.length?`<div class="admSec">Abgelaufen</div>${old.map(item).join("")}`:""}`;
  box.querySelector("#newsNewBtn").onclick=()=>{const f=box.querySelector("#newsFormBox");f.hidden=!f.hidden;if(!f.hidden)box.querySelector("#newsTitle").focus()};
  box.querySelector("#newsSave").onclick=async()=>{
    const title=box.querySelector("#newsTitle").value.trim(), text=box.querySelector("#newsText").value.trim();
    const team=box.querySelector("#newsTeam").value, until=box.querySelector("#newsUntil").value, push=box.querySelector("#newsPush").checked;
    if(title.length<3){alert("Bitte eine Überschrift mit mindestens 3 Zeichen eingeben.");return}
    if(push&&!confirm("Den Hinweis jetzt auch als Push an alle angemeldeten Geräte senden?"))return;
    try{
      await addDoc(collection(db,"news"),{title:title.slice(0,80),text:text.slice(0,600),team,until,push,createdAt:serverTimestamp()});
      alert(push?"Hinweis veröffentlicht. Der Push wird gleich verschickt.":"Hinweis veröffentlicht.");
      await loadNews();
    }catch(err){console.error(err);alert("Speichern fehlgeschlagen: "+(err.message||err))}
  };
  admChgBind(box);
  box.querySelectorAll(".newsDel").forEach(b=>b.onclick=async()=>{
    if(!confirm("Diesen Hinweis löschen?"))return;
    try{await deleteDoc(doc(db,"news",b.dataset.id));await loadNews()}catch(err){alert("Löschen fehlgeschlagen: "+(err.message||err))}
  });
}
/* ===== Admin-Bereich 2.0: „Zu tun“, Reiter, eine Spielliste, Spiel-Fenster, EHV bestätigen/ablehnen ===== */
const adm={tab:"games",filter:"todo",teams:{A:true,B:true,U13:true},ehv:null,ehvAt:0,ehvBusy:false,ehvErr:"",dismissed:[],showDismissed:false,bugs:0,sheet:null,edit:false};
const admNorm=s=>String(s||"").toLowerCase().replace(/[^a-z0-9äöüß]/g,"");
const admKey=d=>{const e=d.ehv||{};return [d.id,(d.what||[]).join("+"),e.date||"",e.time||"",e.stadium||""].join("|")};
const ADM_WHAT={date:"Datum",time:"Uhrzeit",stadium:"Spielort",open:"beim EHV ohne Termin",missing:"beim EHV nicht gefunden",extra:"fehlt in der App"};
const admFd=d=>d?new Date(d+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}):"";
const admLine=x=>x?(x.open?"ohne Termin (n.n.)":(x.date?esc(admFd(x.date))+" · "+esc(x.time)+" Uhr":"–"))+(x.stadium?" · "+esc(x.stadium):""):"–";
function admAll(){
  if(!adm.ehv)return [];
  const diffs=(adm.ehv.diffs||[]).map(d=>({...d}));
  const extra=(adm.ehv.extra||[]).map(x=>({id:"extra_"+x.team+"_"+admNorm(x.home)+"_"+admNorm(x.away),team:x.team,home:x.home,away:x.away,app:{date:"",time:"",stadium:""},ehv:x.ehv,what:["extra"]}));
  /* 1.44.3: „beim EHV ohne Termin“ nicht melden, wenn das Spiel in der App schon abgesagt oder „verlegt – Termin offen“ ist – setzt der EHV später einen Termin, kommt die Abweichung wieder */
  return diffs.concat(extra).filter(d=>{if(!(d.what||[]).includes("open"))return true;const g=admGame(d.id);return !(g&&g.cancelled)}).map(d=>({...d,key:admKey(d)}));
}
const admOpen=()=>{const s=new Set(adm.dismissed);return admAll().filter(d=>!s.has(d.key))};
const admRejected=()=>{const s=new Set(adm.dismissed);return admAll().filter(d=>s.has(d.key))};
const admDiffFor=g=>admOpen().find(d=>d.id===scheduleGameId(g))||null;
function admHasRes(g){const r=resultFor(g);return !!r&&r.homeScore!==undefined&&r.homeScore!==""&&r.awayScore!==undefined&&r.awayScore!==""}
const admPast=g=>Date.now()>+dt(g)+2.5*36e5;
function admDays(g){const a=new Date(dt(g)),b=new Date();a.setHours(0,0,0,0);b.setHours(0,0,0,0);return Math.round((a-b)/864e5)}
function admStatus(g){
  if(admHasRes(g)){const r=resultFor(g);return ["ok",r.homeScore+":"+r.awayScore+" ✓"]}
  if(g.cancelled)return ["chg",g.postponed?"Termin offen":"abgesagt"]; /* 1.44.3: kein „Ergebnis fehlt“ für abgesagte/verlegte Spiele */
  if(admPast(g))return ["miss","Ergebnis fehlt"];
  if(Date.now()>=+dt(g))return ["live","läuft"];
  if(admDiffFor(g))return ["chg","EHV ⚠"];
  const n=admDays(g);return ["up",n===0?"Heute":n===1?"Morgen":"in "+n+" T."];
}
function admDate(g){const d=dt(g);return `<span class="admD"><small>${esc(d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".","").toUpperCase())}</small><b>${d.getDate()}.</b><small>${esc(d.toLocaleDateString("de-DE",{month:"short"}).replace(".","").toUpperCase())}</small></span>`}
const admPair=g=>esc(shortTeam(g.home))+" – "+esc(shortTeam(g.away));
/* 1.26.2: In der Liste steht der Gegner vorn (die Grizzlys sind ja immer dabei), davor Heim/Auswärts */
function admRow(g){
  const [c,t]=admStatus(g), mod=admOvChanged(g), h=isHome(g);
  return `<button type="button" class="admRow team${esc(g.team)}" data-gid="${esc(scheduleGameId(g))}" title="${esc(g.home+" – "+g.away)}">${admDate(g)}<span class="admM"><b><i class="admHA${h?"":" aw"}">${h?"HEIM":"AUSW."}</i><span>${esc(shortTeam(h?g.away:g.home))}</span></b><small>${esc(teamName(g.team))} · ${esc(g.time)} · ${esc(g.stadium)}${mod?'<span class="admMod">geändert</span>':""}${g.cancelled?'<span class="admMod admCx">'+(g.postponed?'Termin offen':'abgesagt')+'</span>':""}</small></span><span class="admSt ${c}">${esc(t)}</span></button>`;
}
/* Monats-Zwischenüberschriften für längere Listen */
function admRowsByMonth(arr){let m="",h="";arr.forEach(g=>{const k=dt(g).toLocaleDateString("de-DE",{month:"long",year:"numeric"});if(k!==m){m=k;h+=`<div class="admMonth">${esc(k)}</div>`}h+=admRow(g)});return h}
const admGame=id=>ALL_GAMES.find(x=>scheduleGameId(x)===id);
/* 1.25.0: echte Terminänderung (nicht nur Absage) */
function admOvChanged(g){const o=scheduleOverrides[scheduleGameId(g)],b=g._base||g;return !!o&&["date","time","home","away","stadium"].some(k=>o[k]&&o[k]!==b[k]);}
const admTeamOk=g=>adm.teams[g.team]!==false;

/* 1.46.0: offene Spieltag-Aufgaben – für Zähler am Reiter und Filter „Zu tun“ */
function admRepOpen(g){const r=window.gameReports&&window.gameReports[resultKey(g)];return admPast(g)&&admHasRes(g)&&!g.cancelled&&!(r&&r.published)&&Date.now()-dt(g)<10*864e5}
function admTodoGames(){
  const diffIds=new Set(admOpen().map(d=>d.id).filter(Boolean)), out=[];
  ALL_GAMES.forEach(g=>{const id=scheduleGameId(g),why=[];
    if(admPast(g)&&!admHasRes(g)&&!g.cancelled)why.push("miss");
    if(diffIds.has(id))why.push("ehv");
    if(admRepOpen(g))why.push("rep");
    if(why.length)out.push({g,why})});
  return out;
}
function admSetBadge(id,n,txt){const el=document.getElementById(id);if(!el)return;el.hidden=!n;el.textContent=txt||String(n)}
function admRenderTodo(){
  const box=document.getElementById("admTodo"); if(!box)return;
  const miss=ALL_GAMES.filter(g=>admPast(g)&&!admHasRes(g)&&!g.cancelled).sort((a,b)=>dt(a)-dt(b));
  const today=ALL_GAMES.filter(g=>admDays(g)===0&&!admHasRes(g)&&!admPast(g)).sort((a,b)=>dt(a)-dt(b));
  const diffs=admOpen(), items=[];
  if(miss.length)items.push(`<button type="button" class="admTi" data-todo="miss"><i class="r">🏒</i><span>${miss.length===1?"1 Ergebnis fehlt":miss.length+" Ergebnisse fehlen"}</span><em>Eintragen ›</em></button>`);
  if(adm.bugs)items.push(`<button type="button" class="admTi" data-todo="bugs"><i class="o">💬</i><span>${adm.bugs===1?"1 offene Rückmeldung":adm.bugs+" offene Rückmeldungen"}</span><em>Ansehen ›</em></button>`);
  if(diffs.length)items.push(`<button type="button" class="admTi" data-todo="ehv"><i class="y">📅</i><span>EHV: ${diffs.length===1?"1 Abweichung":diffs.length+" Abweichungen"}</span><em>Prüfen ›</em></button>`);
  else if(adm.ehvBusy)items.push(`<div class="admTi wait"><i class="y">🔎</i><span>EHV-Spielplan wird geprüft …</span></div>`);
  today.forEach(g=>items.push(`<button type="button" class="admTi" data-todo="game" data-gid="${esc(scheduleGameId(g))}"><i class="b">🏟️</i><span>Heute: ${esc(teamName(g.team))} gegen ${esc(shortTeam(isHome(g)?g.away:g.home))} · ${esc(g.time)}</span><em>Öffnen ›</em></button>`));
  if(window.admPushVerdict==="bad")items.push(`<button type="button" class="admTi" data-todo="push"><i class="r">🔔</i><span>Dieses Gerät bekommt keinen Admin-Push</span><em>Prüfen ›</em></button>`);
  if(!items.length)items.push(`<div class="admTi ok"><i class="g">✓</i><span>Alles erledigt – nichts zu tun</span></div>`);
  box.innerHTML=`<h4>Zu tun</h4>${items.join("")}`;
  try{const t=admTodoGames();admSetBadge("admTabCnt_games",t.length+diffs.filter(d=>!d.id||!admGame(d.id)).length);admSetBadge("admTabCnt_stats",window.admPushVerdict==="bad"?1:0,"!")}catch(e){console.warn(e)}
  box.querySelectorAll("[data-todo]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.todo;
    if(k==="bugs")return admSetTab("bugs");
    if(k==="push")return admSetTab("stats");
    if(k==="game")return admOpenGame(b.dataset.gid);
    admSetTab("games");
    if(k==="miss"){ if(miss.length===1)return admOpenGame(scheduleGameId(miss[0])); adm.filter="todo";adm.teams={A:true,B:true,U13:true};admRenderGames(); }
    document.getElementById(k==="ehv"?"admEhv":"admGameList")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
}

function admRenderEhv(){
  const box=document.getElementById("admEhv"); if(!box)return;
  const open=admOpen(), rej=admRejected(), na=(adm.ehv&&adm.ehv.unavailable)||[];
  const time=adm.ehvAt?new Date(adm.ehvAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):"";
  let h="";
  if(adm.ehvBusy&&!adm.ehv)h=`<div class="admEhvHead"><b>🔎 EHV-Abgleich läuft …</b></div>`;
  else if(adm.ehvErr)h=`<div class="admEhvHead"><b>⚠️ ${esc(adm.ehvErr)}</b><button type="button" class="admLink" data-ehv="reload">Erneut prüfen</button></div>`;
  else if(!open.length)h=`<div class="admEhvHead"><span>✓ Spielplan stimmt mit dem EHV überein${time?" · geprüft "+time:""}</span><button type="button" class="admLink" data-ehv="reload">${adm.ehvBusy?"prüft …":"Neu prüfen"}</button></div>`;
  else h=`<div class="admEhvHead"><b>📅 ${open.length===1?"1 Abweichung":open.length+" Abweichungen"} zum EHV</b><button type="button" class="admLink" data-ehv="reload">${adm.ehvBusy?"prüft …":"Neu prüfen"}</button></div>`+open.map(admDiffHtml).join("");
  if(na.length)h+=`<div class="admHint">EHV-Spielplan für ${na.map(t=>esc(teamName(t))).join(" und ")} gerade nicht abrufbar.</div>`;
  if(rej.length){
    h+=`<div style="margin-top:6px"><button type="button" class="admLink" data-ehv="toggle">${adm.showDismissed?"Abgelehnte ausblenden":"Abgelehnt ("+rej.length+") anzeigen"}</button></div>`;
    if(adm.showDismissed)h+=rej.map(d=>admDiffHtml(d,true)).join("");
  }
  box.className="admEhv"+(open.length||adm.ehvErr?" warn":"");
  box.innerHTML=h;
  admBindDiffs(box);
  box.querySelectorAll("[data-ehv]").forEach(b=>b.onclick=()=>{if(b.dataset.ehv==="reload")admLoadEhv();else{adm.showDismissed=!adm.showDismissed;admRenderEhv()}});
}
function admDiffHtml(d,rejected=false){
  const g=admGame(d.id), canAdopt=!rejected&&g&&d.ehv&&!d.ehv.open&&!d.what.includes("extra")&&!d.what.includes("missing");
  return `<div class="admDiff" data-key="${esc(d.key)}"><div class="t">${esc(teamName(d.team))} · ${esc(shortTeam(d.home))} – ${esc(shortTeam(d.away))}</div>
    <div class="admTags">${(d.what||[]).map(w=>`<span>${esc(ADM_WHAT[w]||w)}</span>`).join("")}</div>
    <div class="admCmp">${d.what.includes("extra")?"":`<i>App</i><span>${admLine(d.app)}</span>`}<i>EHV</i><span class="ehv">${d.ehv?admLine(d.ehv):"nicht gefunden"}</span></div>
    <div class="admBtns">${rejected?`<button type="button" class="admBtn" data-act="undo">↩️ Wieder anzeigen</button>`:`${canAdopt?`<button type="button" class="admBtn ok" data-act="adopt">✓ EHV übernehmen</button>`:""}${g&&d.ehv&&d.ehv.open&&!g.cancelled?`<button type="button" class="admBtn ok" data-act="pp">⏸ Als „Termin offen“ markieren</button>`:""}<button type="button" class="admBtn no" data-act="reject">✕ Ablehnen</button>`}${g&&!adm.sheet?`<button type="button" class="admBtn" data-act="open">Spiel öffnen</button>`:""}</div></div>`;
}
function admBindDiffs(root){
  root.querySelectorAll(".admDiff [data-act]").forEach(b=>b.onclick=()=>{
    const key=b.closest(".admDiff").dataset.key, d=admAll().find(x=>x.key===key); if(!d)return;
    const a=b.dataset.act;
    if(a==="adopt")admAdopt(d);
    else if(a==="reject"){if(confirm("Diese Abweichung ablehnen?\n\nDie App bleibt unverändert. Ändert der EHV den Termin später noch einmal, wird das wieder gemeldet."))admSetDismissed([...new Set(adm.dismissed.concat(key))])}
    else if(a==="undo")admSetDismissed(adm.dismissed.filter(k=>k!==key));
    else if(a==="open")admOpenGame(d.id);
    else if(a==="pp"){const g=admGame(d.id);if(!g||!confirm("Spiel als „Verlegt – Termin offen“ markieren?\n\nEs bleibt am alten Datum im Spielplan, gilt aber nicht mehr als zu spielen. Setzt der EHV später einen Termin, wird das wieder gemeldet."))return;
      b.disabled=true;admSetCancelled(g,true,true).then(()=>admRenderAll()).catch(err=>{alert("Speichern nicht möglich: "+(err.message||err));b.disabled=false})}
  });
}

function admRenderGames(){
  const fl=document.getElementById("admFilters"), box=document.getElementById("admGameList"); if(!fl||!box)return;
  const f=(k,t)=>`<button type="button" data-f="${k}" class="${adm.filter===k?"on":""}">${t}</button>`, tm=t=>`<button type="button" data-t="${t}" class="${adm.teams[t]?"on":""}" aria-label="${teamName(t)}">${t}</button>`;
  fl.innerHTML=f("todo","Zu tun")+f("next","Kommende")+f("played","Gespielt")+f("all","Alle")+'<span class="sep"></span>'+window.TEAM_KEYS.map(tm).join("");
  fl.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{adm.filter=b.dataset.f;admRenderGames()});
  fl.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{const t=b.dataset.t;adm.teams[t]=!adm.teams[t];if(!window.TEAM_KEYS.some(k=>adm.teams[k]))adm.teams[t]=true;admRenderGames()});
  const list=ALL_GAMES.filter(admTeamOk), asc=(a,b)=>dt(a)-dt(b), desc=(a,b)=>dt(b)-dt(a);
  let h="";
  if(adm.filter==="todo"){
    const t=admTodoGames().filter(x=>admTeamOk(x.g)), sec=(k,title)=>{const l=t.filter(x=>x.why.includes(k)).map(x=>x.g).sort(asc);return l.length?`<div class="admSec">${title}</div>`+l.map(admRow).join(""):""};
    const now=list.filter(g=>!admPast(g)&&(admDays(g)===0||Date.now()>=+dt(g))).sort(asc);
    h=sec("miss","Ergebnis fehlt")+sec("ehv","EHV-Abweichung")+sec("rep","Bericht wartet auf Freigabe")+(now.length?`<div class="admSec">Heute</div>`+now.map(admRow).join(""):"");
    if(!h){const up=list.filter(g=>!admPast(g)).sort(asc).slice(0,3);h=`<div class="admEmpty">✓ Nichts zu tun – alles eingetragen.</div>`+(up.length?`<div class="admSec">Als Nächstes</div>`+up.map(admRow).join(""):"")}
  }else if(adm.filter==="next"){
    const miss=list.filter(g=>admPast(g)&&!admHasRes(g)&&!g.cancelled).sort(asc);
    const last=list.filter(g=>admPast(g)&&admHasRes(g)).sort(desc)[0];
    const up=list.filter(g=>!admPast(g)).sort(asc);
    const live=up.filter(g=>Date.now()>=+dt(g)), soon=up.filter(g=>!live.includes(g)), N=5;
    if(miss.length)h+=`<div class="admSec">Ergebnis fehlt</div>`+miss.map(admRow).join("");
    if(live.length)h+=`<div class="admSec">Läuft gerade</div>`+live.map(admRow).join("");
    if(last)h+=`<div class="admSec">Zuletzt gespielt</div>`+admRow(last);
    h+=`<div class="admSec">Als Nächstes</div>`+(soon.length?(adm.upAll?admRowsByMonth(soon):soon.slice(0,N).map(admRow).join(""))
      +(soon.length>N?`<button type="button" class="admMore" data-more>${adm.upAll?"Weniger anzeigen":`Alle ${soon.length} kommenden Spiele anzeigen`}</button>`:""):'<div class="admEmpty">Keine kommenden Spiele.</div>');
  }else if(adm.filter==="played"){
    const p=list.filter(admPast).sort(desc);
    h=p.length?admRowsByMonth(p):'<div class="admEmpty">Noch keine gespielten Spiele.</div>';
  }else h=admRowsByMonth(list.slice().sort(asc));
  box.innerHTML=h;
  box.querySelector("[data-more]")?.addEventListener("click",()=>{adm.upAll=!adm.upAll;admRenderGames()});
  box.querySelectorAll(".admRow").forEach(b=>b.onclick=()=>admOpenGame(b.dataset.gid));
}

function admOpenGame(id){if(adm.sheet!==id)adm.fold={};adm.sheet=id;adm.edit=false;admRenderSheet()}
/* 1.26.2: Kasten im Spiel-Fenster als aufklappbarer Bereich mit Kurzinfo rechts; Zustand bleibt beim Neuzeichnen erhalten */
function admFold(key,html,defOpen,sum){
  const m=/^\s*<div class="(admBox[^"]*)">\s*<h5>([\s\S]*?)<\/h5>([\s\S]*)<\/div>\s*$/.exec(html); if(!m)return html;
  adm.fold=adm.fold||{}; const open=key in adm.fold?adm.fold[key]:defOpen;
  const head=m[2].replace(/<span class="admSt[^>]*>[\s\S]*?<\/span>/g,"").replace(/<span class="admRepState"[^>]*>[\s\S]*?<\/span>/g,"").trim();
  return `<details class="${m[1]} admFoldBox" data-fold="${key}"${open?" open":""}><summary><h5>${head}</h5><span class="admSum">${sum||""}</span><i class="admChev" aria-hidden="true">⌄</i></summary><div class="admFoldIn">${m[3]}</div></details>`;
}
function admCloseSheet(){adm.sheet=null;const w=document.getElementById("admSheet");if(w)w.hidden=true}
function admRenderSheet(){
  const w=document.getElementById("admSheet"); if(!w)return;
  const g=adm.sheet&&admGame(adm.sheet); if(!g){admCloseSheet();return}
  const box=w.querySelector(".admSheet"), r=resultFor(g)||{}, has=admHasRes(g), id=scheduleGameId(g), mod=admOvChanged(g), d=admDiffFor(g), base=g._base||g;
  const ts=x=>x&&x.toMillis?new Date(x.toMillis()).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
  let hint="";
  if(has){
    const src=r.source==="ehv"?"Automatisch vom EHV übernommen":"Von Hand eingetragen";
    const push=r.pushSkipped?" · ohne Push (älteres Spiel)":r.pushSentAt?` · Push an ${Number(r.pushSentCount)||0} Gerät${Number(r.pushSentCount)===1?"":"e"} gesendet`:"";
    hint=`<div class="admHint good">✓ ${src}${push}${ts(r.updatedAt)?" · "+ts(r.updatedAt):""}</div>`;
  }else if(admPast(g))hint=`<div class="admHint">Noch kein Ergebnis. Der EHV-Endstand wird automatisch übernommen, sobald er vorliegt – oder hier von Hand eintragen.</div>`;
  const cmp=d?admDiffHtml(d):"";
  box.innerHTML=`<div class="admGrab"></div>
   <div class="admSh team${esc(g.team)}">${admDate(g)}<div class="admM"><b>${esc(shortTeam(g.home))} – ${esc(shortTeam(g.away))}</b><small>${esc(teamName(g.team))} · ${esc(g.time)} Uhr · ${esc(g.stadium)}</small></div><button type="button" class="admX" data-x aria-label="Schließen">×</button></div>
   ${admFold("res",`<div class="admBox"><h5>${admIc("puck")}Ergebnis</h5>
     <div class="admScore"><div><input id="admHs" type="number" inputmode="numeric" min="0" max="99" value="${has?esc(r.homeScore):""}" aria-label="Tore Heim"><div class="lbl">Heim</div></div><b>:</b><div><input id="admAs" type="number" inputmode="numeric" min="0" max="99" value="${has?esc(r.awayScore):""}" aria-label="Tore Gast"><div class="lbl">Gast</div></div><label class="admSo"><input id="admSo" type="checkbox"${has&&r.so===true?" checked":""}><span>n.P.</span></label>
     <div class="admBtns"><button type="button" class="admBtn pri" data-res="save">Speichern</button>${has?'<button type="button" class="admBtn del" data-res="del">Löschen</button>':""}</div></div>${has?'<div class="admBtns" style="margin-top:8px"><button type="button" class="admBtn" data-img="result">📸 Ergebnis-Bild</button></div>':""}<div class="admHint">Kein Unentschieden: Bei Penaltyschießen den Endstand mit Siegtreffer eintragen (z. B. 4:3) und „n.P.“ anhaken.</div>${hint}</div>`,!has||!admPast(g)?true:false,has?`<span class="admSt ok">${esc(r.homeScore+":"+r.awayScore)} ✓</span>`:admPast(g)?'<span class="admSt miss">fehlt</span>':"noch nicht gespielt")}
   ${admFold("sch",`<div class="admBox"><h5>${admIc("cal")}Termin &amp; Ort ${d?'<span class="admSt chg">EHV weicht ab</span>':adm.ehv&&!adm.ehvErr?'<span class="admSt ok">stimmt mit EHV</span>':""}</h5>${cmp}
     <div class="admKv"><div><small>Datum</small>${esc(fmtDate(g))}</div><div><small>Uhrzeit</small>${esc(g.time)} Uhr</div><div style="grid-column:span 2"><small>Spielort</small>${esc(g.stadium)}</div></div>
     ${mod?`<div class="admHint">Geändert – ursprünglich ${esc(admFd(base.date))} · ${esc(base.time)} Uhr · ${esc(base.stadium)}<br>${admNewsState(g)}</div>`:""}
     ${adm.edit?`<div class="admForm"><label>Datum<input id="admFDate" type="date" value="${esc(g.date)}"></label><label>Uhrzeit<input id="admFTime" type="time" value="${esc(g.time)}"></label><label class="full">Heimteam<input id="admFHome" value="${esc(g.home)}"></label><label class="full">Gastteam<input id="admFAway" value="${esc(g.away)}"></label><label class="full">Spielort<input id="admFStad" value="${esc(g.stadium)}"></label><label class="full admNewsChk"><span><input id="admFNews" type="checkbox"${scheduleOverrides[id]&&typeof scheduleOverrides[id].news==="boolean"?(scheduleOverrides[id].news?" checked":"")+' data-man="1"':""}> In den News als Spieländerung melden</span><small id="admFNewsHint"></small></label><label class="full admNewsChk admPushChk"><span><input id="admFPush" type="checkbox"> 📲 Push an alle senden</span><small id="admFPushHint"></small></label></div>
       <div class="admBtns" style="margin-top:8px"><button type="button" class="admBtn pri" data-sch="save">💾 Für alle speichern</button><button type="button" class="admBtn no" data-sch="cancel">Abbrechen</button></div>`
      :`<div class="admBtns" style="margin-top:8px"><button type="button" class="admBtn" data-sch="edit">✏️ Termin ändern</button>${mod?'<button type="button" class="admBtn no" data-sch="reset">↩️ Original</button>':""}</div>`}
   </div>`,!!(adm.edit||d),(d?'<span class="admSt chg">EHV weicht ab</span> ':mod?'<span class="admSt chg">geändert</span> ':"")+esc(new Date(g.date+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})+" · "+g.time+" · "+g.stadium))}
   ${admFold("rep",admRepBox(g,has),has&&!(window.gameReports&&window.gameReports[rkey(g)]&&window.gameReports[rkey(g)].published),admRepSum(g,has))}
   ${admFold("cx",`<div class="admBox admCxBox${g.cancelled?" on":""}"><h5>${admIc("ban")}Absage / Termin offen</h5>${g.cancelled?(g.postponed?`<div class="admHint">Dieses Spiel ist als <b>verlegt – neuer Termin offen</b> markiert. Steht der neue Termin fest, einfach oben unter „Termin &amp; Ort“ ändern – dann gilt das Spiel automatisch wieder.</div><div class="admBtns"><button type="button" class="admBtn" data-cx="off">↩️ Zurücknehmen</button><button type="button" class="admBtn no" data-cx="on">🚫 Doch abgesagt</button></div>`:`<div class="admHint">Dieses Spiel ist als <b>abgesagt</b> markiert. Ergebnisse vom EHV werden trotzdem übernommen.</div><div class="admBtns"><button type="button" class="admBtn" data-cx="off">↩️ Absage zurücknehmen</button><button type="button" class="admBtn" data-cx="pp">⏸ Nur verlegt – Termin offen</button></div>`):`<div class="small" style="margin-bottom:8px">Nur Anzeige: „Abgesagt“ oder „Verlegt – Termin offen“ steht dann überall (Spielkarten, Kalender, News, Social-Media-Bilder). Das Spiel ist kein nächstes Spiel mehr und bekommt keine Erinnerung. Ergebnisse vom EHV werden weiter übernommen.</div><label class="full admNewsChk admPushChk"><span><input id="admCxPush" type="checkbox"> 📲 Push an alle senden</span><small>„Spiel gegen ${esc(shortTeam(/grizzlys/i.test(g.home)?g.away:g.home))} am ${esc(new Date(g.date+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}))} ist abgesagt.“ bzw. „… ist verlegt – neuer Termin folgt.“</small></label><div class="admBtns" style="margin-top:8px"><button type="button" class="admBtn no" data-cx="on">🚫 Spiel absagen</button><button type="button" class="admBtn" data-cx="pp">⏸ Verlegt – Termin offen</button></div>`}</div>`,!!g.cancelled,g.cancelled?'<span class="admSt miss">'+(g.postponed?'verlegt, Termin offen':'abgesagt')+'</span>':"nicht abgesagt")}
   ${admFold("news",`<div class="admBox"><h5>${admIc("news")}Hinweis zu diesem Spiel</h5><button type="button" class="admBtn" style="width:100%" data-news>＋ News schreiben (z. B. Hallenwechsel)</button></div>`,false,"News schreiben")}`;
  box.querySelectorAll("details[data-fold]").forEach(x=>x.addEventListener("toggle",()=>{adm.fold=adm.fold||{};adm.fold[x.dataset.fold]=x.open}));
  box.querySelector(".admRepMore")?.addEventListener("toggle",e=>{adm.fold=adm.fold||{};adm.fold.repMore=e.currentTarget.open});
  w.hidden=false;
  box.querySelector("[data-x]").onclick=admCloseSheet;
  w.onclick=e=>{if(e.target===w)admCloseSheet()};
  admBindDiffs(box);
  admBindNewsChk(box,g);
  admRepBind(box,g);
  box.querySelector('[data-res="save"]').onclick=async e=>{
    const hs=box.querySelector("#admHs").value, as=box.querySelector("#admAs").value, so=!!box.querySelector("#admSo")?.checked;
    if(hs===""||as===""){alert("Bitte beide Tore eintragen.");return}
    if(Number(hs)===Number(as)){alert("Ein Unentschieden gibt es nicht. Bei Penaltyschießen bitte den Endstand mit Siegtreffer eintragen (z. B. 4:3) und „n.P.“ anhaken.");return}
    if(so&&Math.abs(Number(hs)-Number(as))!==1){alert("Nach Penaltyschießen liegt der Sieger genau ein Tor vorn (z. B. 4:3). Bitte prüfen.");return}
    e.currentTarget.disabled=true;
    try{const k=resultKey(g),data={gameId:k,team:g.team,date:g.date,time:g.time,home:g.home,away:g.away,homeScore:Number(hs),awayScore:Number(as),so};
      await setDoc(doc(db,"results",k),{...data,updatedAt:serverTimestamp()});results[k]=data;window.applyResults?.();alert("Ergebnis gespeichert.")}
    catch(err){console.error(err);alert("Speichern nicht möglich: "+(err.message||err))}
    admRenderAll();
  };
  const del=box.querySelector('[data-res="del"]');
  if(del)del.onclick=async()=>{if(!confirm("Ergebnis wirklich löschen?"))return;try{const k=resultKey(g);await deleteDoc(doc(db,"results",k));delete results[k];window.applyResults?.()}catch(err){alert("Löschen nicht möglich: "+(err.message||err))}admRenderAll()};
  box.querySelectorAll("[data-sch]").forEach(b=>b.onclick=async()=>{
    const a=b.dataset.sch;
    if(a==="edit"||a==="cancel"){adm.edit=a==="edit";return admRenderSheet()}
    if(a==="reset"){if(!confirm("Änderung zurücksetzen und den Originaltermin wiederherstellen?"))return;
      try{await deleteDoc(doc(db,"scheduleOverrides",id));delete scheduleOverrides[id];applyScheduleOverrides();renderNext();renderList();renderOpponents();window.applyResults?.()}catch(err){alert("Zurücksetzen nicht möglich: "+(err.message||err))}
      return admRenderAll()}
    const v={date:box.querySelector("#admFDate").value,time:box.querySelector("#admFTime").value,home:box.querySelector("#admFHome").value.trim(),away:box.querySelector("#admFAway").value.trim(),stadium:box.querySelector("#admFStad").value.trim()};
    const nc=box.querySelector("#admFNews"); if(nc)v.news=nc.checked;
    const pc=box.querySelector("#admFPush"), sendPush=!!(pc&&pc.checked&&!pc.disabled), pushText=sendPush?admChangeText(g,v):"";
    if(!v.date||!v.time||!v.home||!v.away||!v.stadium){alert("Bitte alle Felder ausfüllen.");return}
    b.disabled=true;
    try{await admSaveOverride(g,v);adm.edit=false;
      let pushMsg="";
      if(sendPush){try{await admSendChangePush(g,pushText);pushMsg="\n\nPush an alle Geräte ("+teamName(g.team)+") wird verschickt."}catch(err){console.error(err);pushMsg="\n\nAchtung: Push konnte nicht verschickt werden ("+(err.message||err)+")."}}
      alert("Gespeichert – gilt sofort für alle Nutzer."+pushMsg)}catch(err){console.error(err);alert("Speichern nicht möglich: "+(err.message||err))}
    admRenderAll();
  });
  box.querySelectorAll("[data-img]").forEach(b=>b.onclick=()=>{if(typeof instaOpen==="function")instaOpen(g,b.dataset.img)});
  box.querySelectorAll("[data-cx]").forEach(b=>b.onclick=async()=>{
    const pp=b.dataset.cx==="pp", on=b.dataset.cx==="on"||pp, pushIt=on&&!!box.querySelector("#admCxPush")?.checked;
    if(!confirm(pp?"Spiel als verlegt markieren – neuer Termin noch offen?\n\nDas Spiel bleibt am alten Datum im Spielplan, wird aber überall als „Verlegt – Termin offen“ angezeigt."+(pushIt?"\n\nAlle Geräte mit Push für "+teamName(g.team)+" bekommen eine Nachricht.":""):on?"Spiel als abgesagt markieren?\n\nDas Spiel bleibt im Spielplan, wird aber überall als „Abgesagt“ angezeigt."+(pushIt?"\n\nAlle Geräte mit Push für "+teamName(g.team)+" bekommen eine Nachricht.":""):"Zurücknehmen?"))return;
    b.disabled=true;
    try{await admSetCancelled(g,on,pp);let msg=pp?"Als verlegt (Termin offen) markiert – gilt sofort für alle Nutzer.":on?"Als abgesagt markiert – gilt sofort für alle Nutzer.":"Zurückgenommen.";
      if(pushIt){try{const opp=shortTeam(/grizzlys/i.test(g.home)?g.away:g.home),wd=new Date(g.date+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
        await admSendChangePush(g,"Spiel gegen "+opp+" am "+wd+" ("+g.time+" Uhr) ist "+(pp?"verlegt – neuer Termin folgt.":"abgesagt."));msg+="\n\nPush an alle Geräte ("+teamName(g.team)+") wird verschickt."}catch(err){msg+="\n\nAchtung: Push konnte nicht verschickt werden ("+(err.message||err)+")."}}
      alert(msg)}catch(err){console.error(err);alert("Speichern nicht möglich: "+(err.message||err))}
    admRenderAll();
  });
  box.querySelector("[data-news]").onclick=()=>{admCloseSheet();admSetTab("news");window.admNewsPrefill?.(g)};
}
/* 1.9.1.126: News-Häkchen beim Termin ändern – folgt automatisch der Erkennung, bis man es selbst anfasst */
const CHG_LBL={date:"Datum",time:"Uhrzeit",stadium:"Spielort",home:"Heimteam",away:"Gastteam"};
function admNewsState(g){
  const o=scheduleOverrides[scheduleGameId(g)]; if(!o)return "";
  if(o.news===false)return "📰 Nicht in den News (als Korrektur gespeichert)";
  if(o.news===true)return "📰 Steht in den News";
  return chgFields(g._base||g,g).length?"📰 Steht in den News":"📰 Nicht in den News – nur Schreibweise korrigiert";
}
function admBindNewsChk(box,g){
  const c=box.querySelector("#admFNews"), h=box.querySelector("#admFNewsHint"); if(!c)return;
  const ids={date:"#admFDate",time:"#admFTime",home:"#admFHome",away:"#admFAway",stadium:"#admFStad"};
  const upd=()=>{
    const v={};Object.keys(ids).forEach(k=>v[k]=(box.querySelector(ids[k])||{}).value?.trim?.()??"");
    const b=g._base||g, f=chgFields(b,v), typo=!f.length&&Object.keys(ids).some(k=>(b[k]||"")!==v[k]);
    if(!c.dataset.man)c.checked=f.length>0;
    h.textContent=f.length?"Erkannt: "+f.map(k=>CHG_LBL[k]).join(", ")+" geändert":typo?"Erkannt: nur Schreibweise korrigiert – keine News":"Keine Änderung zum Originaltermin";
  };
  const pc=box.querySelector("#admFPush"), ph=box.querySelector("#admFPushHint");
  const updPush=()=>{ if(!pc)return;
    const v={};Object.keys(ids).forEach(k=>v[k]=(box.querySelector(ids[k])||{}).value?.trim?.()??"");
    const f=chgFields(g,v).filter(k=>k==="date"||k==="time"||k==="stadium");
    pc.disabled=!f.length; if(!f.length)pc.checked=false;
    ph.textContent=f.length?(pc.checked?"Geht an alle Geräte mit Push für "+teamName(g.team)+": „"+admChangeText(g,v)+"“":"Ohne Haken wird kein Push verschickt"):"Push nur bei geändertem Datum, Uhrzeit oder Spielort möglich";
  };
  Object.values(ids).forEach(q=>{const el=box.querySelector(q);if(el){el.addEventListener("input",upd);el.addEventListener("input",updPush)}});
  c.addEventListener("change",()=>{c.dataset.man="1"});
  pc?.addEventListener("change",updPush);
  upd(); updPush();
}
/* 1.21.0: Push bei manueller Spieländerung – nur mit Haken „Push an alle senden“.
   Nutzt den bestehenden News-Push (Function onNewsCreated, beachtet die Mannschaftsauswahl der Geräte).
   „Sichtbar bis“ = gestern: der Hinweis erscheint nicht doppelt in den News (die Spieländerung steht dort schon),
   bleibt aber im Admin-Bereich unter den abgelaufenen Hinweisen als Nachweis sichtbar. */
function admChangeText(g,v){
  const own=s=>/grizzlys/i.test(s||""), opp=own(v.home)?v.away:v.home, f=chgFields(g,v);
  const wd=d=>new Date(d+"T12:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
  const parts=[];
  if(f.includes("date"))parts.push("neu am "+wd(v.date)+" (statt "+wd(g.date)+")");
  if(f.includes("time"))parts.push("neu um "+v.time+" Uhr (statt "+g.time+" Uhr)");
  if(f.includes("stadium"))parts.push("neuer Spielort: "+v.stadium);
  const head=(typeof shortTeam==="function"?shortTeam(opp):opp);
  return "Spiel gegen "+head+(f.includes("date")?"":" am "+wd(g.date))+": "+parts.join(", ");
}
async function admSendChangePush(g,text){
  const y=new Date(Date.now()-86400000).toLocaleDateString("sv-SE");
  await addDoc(collection(db,"news"),{title:"Spieländerung",text:text.slice(0,600),team:g.team,until:y,push:true,createdAt:serverTimestamp()});
  try{await loadNews()}catch(e){}
}
/* 1.25.0: Absage speichern – im selben Dokument wie Terminänderungen (scheduleOverrides), Feld „cancelled“.
   Gab es nur die Absage (keine Terminänderung), wird das Dokument beim Zurücknehmen wieder gelöscht. */
async function admSetCancelled(g,on,pp){
  const id=scheduleGameId(g), base=g._base||g, o=scheduleOverrides[id];
  if(on){
    const data=o?{...o,cancelled:true,cancelDate:o.date||base.date}:{gameId:id,team:g.team,originalDate:base.date,originalTime:base.time,day:base.day,date:base.date,time:base.time,home:base.home,away:base.away,stadium:base.stadium,cancelled:true,cancelDate:base.date,news:true};
    if(pp)data.postponed=true;else delete data.postponed; /* 1.44.2: verlegt, neuer Termin offen */
    await setDoc(doc(db,"scheduleOverrides",id),{...data,cancelledAt:serverTimestamp(),updatedAt:serverTimestamp()});
    scheduleOverrides[id]=data;
  }else if(o){
    if(admOvChanged(g)){const data={...o,cancelled:false};delete data.cancelledAt;delete data.postponed;await setDoc(doc(db,"scheduleOverrides",id),{...data,updatedAt:serverTimestamp()});scheduleOverrides[id]=data;}
    else{await deleteDoc(doc(db,"scheduleOverrides",id));delete scheduleOverrides[id];}
  }
  applyScheduleOverrides(); renderNext(); renderList(); renderOpponents(); window.applyResults?.(); window.renderNews?.(); adminNewsEditor();
}
async function admSaveOverride(g,v){
  const id=scheduleGameId(g), base=g._base||g, day=new Date(v.date+"T12:00:00").toLocaleDateString("de-DE",{weekday:"long"});
  const data={gameId:id,team:g.team,originalDate:base.date,originalTime:base.time,day,date:v.date,time:v.time,home:v.home,away:v.away,stadium:v.stadium};
  if(typeof v.news==="boolean")data.news=v.news; /* fehlt = automatisch erkennen */
  {const oc=scheduleOverrides[id]; if(oc&&oc.cancelled===true){const cd=oc.cancelDate||oc.originalDate; if(v.date===cd){data.cancelled=true;data.cancelDate=cd;if(oc.postponed===true)data.postponed=true}}} /* verlegt = nicht mehr abgesagt; neuer Termin = nicht mehr „Termin offen“ */
  await setDoc(doc(db,"scheduleOverrides",id),{...data,updatedAt:serverTimestamp()});
  scheduleOverrides[id]=data; applyScheduleOverrides(); renderNext(); renderList(); renderOpponents(); window.applyResults?.(); window.renderNews?.(); adminNewsEditor();
}
async function admAdopt(d){
  const g=admGame(d.id); if(!g||!d.ehv||d.ehv.open)return;
  const v={date:d.ehv.date||g.date,time:d.ehv.time||g.time,home:g.home,away:g.away,stadium:(d.what.includes("stadium")&&d.ehv.stadium)?d.ehv.stadium:g.stadium};
  if(!confirm(`EHV-Termin übernehmen?\n\n${shortTeam(g.home)} – ${shortTeam(g.away)}\nneu: ${admFd(v.date)} · ${v.time} Uhr · ${v.stadium}\n\nDie Änderung gilt sofort für alle Nutzer und erscheint in den Neuigkeiten.`))return;
  try{await admSaveOverride(g,v);if(adm.ehv)adm.ehv.diffs=(adm.ehv.diffs||[]).filter(x=>x.id!==d.id);alert("Übernommen – gilt sofort für alle Nutzer.")}
  catch(err){console.error(err);alert("Speichern nicht möglich: "+(err.message||err))}
  admRenderAll();
}
async function admSetDismissed(keys){
  const prev=adm.dismissed; adm.dismissed=keys; admRenderAll();
  try{await setDoc(doc(db,"ehvSync","dismissed"),{keys,updatedAt:serverTimestamp()})}
  catch(err){console.error(err);adm.dismissed=prev;admRenderAll();alert("Konnte nicht gespeichert werden: "+(err.message||err))}
}
async function admLoadEhv(){
  if(adm.ehvBusy)return; adm.ehvBusy=true; adm.ehvErr=""; admRenderAll();
  try{
    const [r,snap]=await Promise.all([httpsCallable(functions,"scheduleCheck")({}),getDocs(collection(db,"ehvSync")).catch(e=>{console.warn(e);return null})]);
    adm.ehv=(r&&r.data)||{}; adm.ehvAt=Date.now();
    if(snap)snap.forEach(x=>{if(x.id==="dismissed"){const k=(x.data()||{}).keys;adm.dismissed=Array.isArray(k)?k:[]}});
  }catch(err){console.warn(err);adm.ehvErr="EHV-Abgleich gerade nicht möglich"}
  adm.ehvBusy=false; admRenderAll();
}
function admSetTab(t){
  if(t==="social"){t="news";setTimeout(()=>admOpenFold("admSocBox"),0)}
  adm.tab=t;
  document.querySelectorAll("[data-adm-tab]").forEach(b=>{const on=b.dataset.admTab===t;b.classList.toggle("on",on);b.setAttribute("aria-selected",on?"true":"false")});
  document.querySelectorAll("[data-adm-pane]").forEach(p=>p.hidden=p.dataset.admPane!==t);
  if(t==="stats"){/* 1.46.0: Saisonsachen nur zur passenden Zeit – Adventskalender 20.11.–15.1., Saisonende-Sicherung März–August */
    const d=new Date(),m=d.getMonth(),dd=d.getDate(), adv=(m===10&&dd>=20)||m===11||(m===0&&dd<=15), bak=m>=2&&m<=7;
    const a=document.getElementById("admAdvBox"),b=document.getElementById("admBackupBox"),sg=document.getElementById("admSeasonGrp");
    if(a)a.hidden=!adv; if(b)b.hidden=!bak; if(sg)sg.hidden=!(adv||bak);}
  /* Beim Reiterwechsel Inhalt oben beginnen lassen – Kopf und Reiter bleiben, das Fenster behält seine Größe */
  const box=document.querySelector(".adminBox"), tabs=document.querySelector(".admTabs"), pane=document.querySelector('[data-adm-pane="'+t+'"]');
  if(box&&tabs&&pane){const target=box.scrollTop+pane.getBoundingClientRect().top-(box.getBoundingClientRect().top+tabs.offsetHeight+10); if(box.scrollTop>target)box.scrollTop=Math.max(0,target);}
}
function admRenderAll(){
  if(auth.currentUser?.uid!==ADMIN_UID)return;
  try{admRenderTodo();admRenderEhv();admRenderGames();if(adm.sheet)admRenderSheet()}catch(e){console.warn(e)}
}
window.admBugsChanged=n=>{adm.bugs=n;try{admRenderTodo()}catch(e){}};
window.admRenderAll=admRenderAll;
document.querySelectorAll("[data-adm-tab]").forEach(b=>b.onclick=()=>admSetTab(b.dataset.admTab));
/* 1.46.0: aufgeklappte Bereiche merken (pro Gerät) */
const ADM_FOLD_KEY="grizzlysAdmFolds";
function admFoldMem(){try{return JSON.parse(localStorage.getItem(ADM_FOLD_KEY)||"[]")}catch(e){return[]}}
function admFoldSet(f,o){const h=f.querySelector(".admFoldHead"),b=f.querySelector(".admFoldBody");if(!h||!b)return;b.hidden=!o;f.classList.toggle("open",o);h.setAttribute("aria-expanded",o?"true":"false");
  if(o&&f.id==="admSocBox")try{window.renderAdmSocial&&window.renderAdmSocial()}catch(e){console.warn(e)}}
function admOpenFold(id){const f=document.getElementById(id);if(!f)return;admFoldSet(f,true);try{const m=admFoldMem();if(!m.includes(id)){m.push(id);localStorage.setItem(ADM_FOLD_KEY,JSON.stringify(m))}}catch(e){}f.scrollIntoView({behavior:"smooth",block:"start"})}
{const mem=admFoldMem();
document.querySelectorAll(".admFold").forEach(f=>{const h=f.querySelector(".admFoldHead"),b=f.querySelector(".admFoldBody");if(!h||!b)return; /* 1.44.1: Link-Kästen (App-Statistik, Tipp-Fenster) haben keinen Inhalt zum Aufklappen */
  if(f.id&&mem.includes(f.id))admFoldSet(f,true);
  h.addEventListener("click",()=>{const o=b.hidden;admFoldSet(f,o);if(!f.id)return;try{const m=admFoldMem().filter(x=>x!==f.id);if(o)m.push(f.id);localStorage.setItem(ADM_FOLD_KEY,JSON.stringify(m))}catch(e){}})});}
{const prev=window.applyResults;window.applyResults=function(){prev&&prev.apply(this,arguments);admRenderAll()};}
function admStart(){admSetTab(adm.tab);admRenderAll();if(!adm.ehv||Date.now()-adm.ehvAt>10*60000)admLoadEhv();
  /* 1.46.0: gemerkte offene Bereiche brauchen ihre Daten auch ohne Antippen */
  const L={admPubBox:()=>{pubPollUntil=Date.now()+20*60000;pubLoad()},admAdvBox:loadAdventStats,admErrBox:loadAppErrors,admSocBox:()=>window.renderAdmSocial&&window.renderAdmSocial()};
  Object.keys(L).forEach(id=>{const f=document.getElementById(id),b=f&&f.querySelector(".admFoldBody");if(b&&!b.hidden&&!f.hidden)try{L[id]()}catch(e){console.warn(e)}});}

/* ===== 1.40.0: anonyme Fehlerzählung (Sammlung appErrors) + Admin-Karte „App-Fehler“ ===== */
const APPERR_IGNORE=/Failed to fetch|NetworkError|Load failed|ResizeObserver|Script error|AbortError|offline|Importing a module script failed|extension:/i;
const appErrSent=new Set();
function appErrHash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36)}
async function appErrSend(e){
  try{
    if(window.GRIZZLYS_TEST||appErrSent.size>=5)return;
    const msg=String(e.msg||"").slice(0,160), src=String(e.src||"").replace(/[?#][^:]*/,"").replace(location.origin,"").slice(0,100);
    if(!msg||APPERR_IGNORE.test(msg))return;
    const day=new Date().toISOString().slice(0,10), id=day+"_"+appErrHash(msg+"|"+src);
    if(appErrSent.has(id))return; appErrSent.add(id);
    const ua=navigator.userAgent||"", plat=/Android/i.test(ua)?"android":/iPhone|iPad|iPod/i.test(ua)?"ios":"desktop", v=String((document.querySelector(".inVer")||{}).textContent||"").slice(0,20);
    await setDoc(doc(db,"appErrors",id),{day,msg,src,v,n:1,last:serverTimestamp(),plat},{merge:true});
  }catch(err){}
}
window.__appErrHook=appErrSend; (window.__appErrQ||[]).splice(0).forEach(appErrSend);
async function loadAppErrors(){
  const list=document.getElementById("admErrList"), sum=document.getElementById("admErrSum"); if(!list)return;
  if(auth.currentUser?.uid!==ADMIN_UID){list.innerHTML='<div class="small">Admin-Anmeldung erforderlich.</div>';return}
  list.innerHTML='<div class="small">Wird geladen …</div>';
  try{
    const snap=await getDocs(query(collection(db,"appErrors"),orderBy("last","desc"),limit(40))), rows=[]; snap.forEach(d=>rows.push({id:d.id,...d.data()}));
    sum.textContent=rows.length?rows.length+(rows.length===1?" Meldung":" Meldungen"):"keine";
    list.innerHTML=rows.length?rows.map(r=>'<div class="apRow warn"><i>!</i><div><b>'+esc(r.msg||"")+'</b><span>'+esc(r.day||"")+' · '+(Number(r.n)||1)+'× · '+esc(r.v||"?")+' · '+esc(r.plat||"")+(r.src?' · '+esc(r.src):'')+'</span></div></div>').join(""):'<div class="small">Keine Fehler gemeldet – gut so.</div>';
  }catch(e){console.error(e);sum.textContent="Fehler";list.innerHTML='<div class="small analyticsError">Konnte nicht geladen werden (Firestore-Regeln für appErrors veröffentlicht?).</div>'}
}
async function clearAppErrors(){
  if(auth.currentUser?.uid!==ADMIN_UID)return;
  try{const cut=new Date(Date.now()-14*864e5).toISOString().slice(0,10), snap=await getDocs(collection(db,"appErrors")); let n=0;
    for(const d of snap.docs){ if(String((d.data()||{}).day||"")<cut){await deleteDoc(d.ref);n++} }
    alert(n+" alte Meldungen gelöscht.");}catch(e){alert("Löschen nicht möglich: "+(e.message||e))}
  loadAppErrors();
}
document.querySelector("#admErrBox .admFoldHead")?.addEventListener("click",()=>setTimeout(()=>{ if(!document.getElementById("admErrBody")?.hidden) loadAppErrors(); },0));
document.getElementById("admErrRefresh")?.addEventListener("click",loadAppErrors);
document.getElementById("admErrClear")?.addEventListener("click",clearAppErrors);

/* ===== 1.41.0: Spruch des Tages – Liste in Firestore (appConfig/sprueche), nur der Admin schreibt =====
   Nutzer lesen das Dokument höchstens alle 3 Stunden (sonst aus dem Gerätespeicher), der Admin immer frisch.
   Fehlt das Dokument, gilt die Standardliste aus sprueche.js. */
async function loadSprueche(force){
  try{
    let c=null; try{c=JSON.parse(localStorage.getItem("grizzlysSprueche")||"null")}catch(e){}
    if(!force&&c&&c.ts&&Date.now()-c.ts<3*3600000)return;
    const s=await getDoc(doc(db,"appConfig","sprueche"));
    if(s.exists()){const x=s.data()||{};window.setSprueche?.({on:x.on!==false,list:Array.isArray(x.list)?x.list:null})}
    else window.setSprueche?.({on:true,list:null});
  }catch(err){console.warn("Sprüche konnten nicht geladen werden",err)}
}
const spr={on:true,list:[],dirty:false,filter:"alle",edit:-1,form:false};
function sprFromApp(){const c=window.spruchInfo?.cur()||{on:true,list:[]};spr.on=c.on;spr.list=c.list.map(x=>({...x}));spr.dirty=false;spr.edit=-1;spr.form=false}
function adminSpruchEditor(){
  const box=document.getElementById("adminSprueche"); if(!box||!window.spruchInfo)return;
  if(!spr.dirty&&spr.edit<0&&!spr.form)sprFromApp();
  const I=window.spruchInfo, K=I.KINDS, e=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const sum=document.getElementById("admSprSum"); if(sum)sum.textContent=spr.list.length+" Sprüche · "+(spr.on?"an":"aus")+(spr.dirty?" · nicht gespeichert":"");
  const cnt=k=>spr.list.filter(x=>x.k===k).length;
  const today=I.pick(spr.list), sit=I.situation();
  const have=new Set(spr.list.map(x=>x.t.toLowerCase())), missing=I.clean(window.SPRUECHE_STANDARD).filter(x=>!have.has(x.t.toLowerCase()));
  const opts=v=>Object.keys(K).map(k=>`<option value="${k}"${k===v?" selected":""}>${e(K[k])}</option>`).join("");
  const form=(x,i)=>`<div class="admSprForm" data-i="${i}"><textarea maxlength="200" rows="3" placeholder="Spruch (keine Spielernamen)">${e(x.t)}</textarea>
    <div class="newsFormRow"><label>Urheber<input maxlength="60" value="${e(x.a)}" placeholder="z. B. Wayne Gretzky oder leer"></label><label>Anlass<select>${opts(x.k)}</select></label></div>
    <div class="apBtns"><button type="button" class="action" data-spr-ok>${i<0?"＋ Hinzufügen":"✓ Übernehmen"}</button><button type="button" class="action" data-spr-cancel>Abbrechen</button></div></div>`;
  const rows=spr.list.map((x,i)=>({x,i})).filter(o=>spr.filter==="alle"||o.x.k===spr.filter);
  box.innerHTML=`<div class="small" style="margin:0 2px 10px">Auf der Startseite steht jeden Tag ein anderer Spruch – für alle derselbe. Am Spieltag und nach Sieg oder Niederlage (am selben und am nächsten Tag) kommt ein passender Spruch, sonst einer aus „Allgemein“.</div>
  <div class="adminGame newsAdminItem"><div class="adminGameHead"><div><b>Auf der Startseite zeigen</b><div class="small">${spr.on?"Sichtbar für alle":"Ausgeblendet"}</div></div><label class="admSw"><input type="checkbox" id="sprOn"${spr.on?" checked":""}><span></span></label></div></div>
  <div class="admSprToday"><small>Heute zu sehen · ${e(K[sit.k]||"Allgemein")}</small>${today?`<q>${e(today.t)}</q>${today.a?`<span>– ${e(today.a)}</span>`:""}`:"<span>Kein Spruch vorhanden.</span>"}</div>
  <div class="rlChips admSprChips">${["alle",...Object.keys(K)].map(k=>`<button type="button" data-spr-f="${k}" class="${spr.filter===k?"on":""}">${k==="alle"?"Alle":e(K[k])} <small>${k==="alle"?spr.list.length:cnt(k)}</small></button>`).join("")}</div>
  ${spr.form?form({t:"",a:"",k:spr.filter==="alle"?"allgemein":spr.filter},-1):`<button type="button" class="admNewsBtn" data-spr-new>＋ Neuen Spruch hinzufügen</button>`}
  <div class="admSprList">${rows.length?rows.map(({x,i})=>i===spr.edit?form(x,i):`<div class="adminGame newsAdminItem admSprItem"><div class="admSprTx"><q>${e(x.t)}</q><div class="small">${x.a?e(x.a)+" · ":""}${e(K[x.k])}</div></div><div class="admSprAct"><button type="button" class="action" data-spr-edit="${i}" aria-label="Bearbeiten"><svg class="admSprIc" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg></button><button type="button" class="action" data-spr-del="${i}" aria-label="Löschen"><svg class="admSprIc" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button></div></div>`).join(""):'<div class="small">In diesem Anlass gibt es noch keinen Spruch.</div>'}</div>
  <div class="admSprBar"><button type="button" class="action admSprSave" data-spr-save${spr.dirty?"":" disabled"}>Speichern</button>${missing.length?`<button type="button" class="action" data-spr-merge>＋ ${missing.length} neue Standard-Sprüche</button>`:""}<button type="button" class="action" data-spr-reset>↺ Standardliste</button>${spr.dirty?`<button type="button" class="action" data-spr-undo>Verwerfen</button>`:""}</div>`;
  const redo=()=>adminSpruchEditor(), changed=()=>{spr.dirty=true;redo()};
  box.querySelector("#sprOn").onchange=ev=>{spr.on=ev.target.checked;changed()};
  box.querySelectorAll("[data-spr-f]").forEach(b=>b.onclick=()=>{spr.filter=b.dataset.sprF;redo()});
  box.querySelector("[data-spr-new]")?.addEventListener("click",()=>{spr.form=true;spr.edit=-1;redo();box.querySelector(".admSprForm textarea")?.focus()});
  box.querySelectorAll("[data-spr-edit]").forEach(b=>b.onclick=()=>{spr.edit=Number(b.dataset.sprEdit);spr.form=false;redo()});
  box.querySelectorAll("[data-spr-del]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.sprDel);if(!confirm("Diesen Spruch löschen?\n\n„"+spr.list[i].t+"“"))return;spr.list.splice(i,1);spr.edit=-1;changed()});
  box.querySelectorAll(".admSprForm").forEach(f=>{
    const i=Number(f.dataset.i);
    f.querySelector("[data-spr-cancel]").onclick=()=>{spr.form=false;spr.edit=-1;redo()};
    f.querySelector("[data-spr-ok]").onclick=()=>{
      const t=f.querySelector("textarea").value.replace(/\s+/g," ").trim(), a=f.querySelector("input").value.trim(), k=f.querySelector("select").value;
      if(t.length<3){alert("Bitte einen Spruch mit mindestens 3 Zeichen eingeben.");return}
      if(spr.list.some((x,j)=>j!==i&&x.t.toLowerCase()===t.toLowerCase())){alert("Diesen Spruch gibt es schon.");return}
      const x={t:t.slice(0,200),a:a.slice(0,60),k};
      if(i<0)spr.list.unshift(x);else spr.list[i]=x;
      spr.form=false;spr.edit=-1;changed();
    };
  });
  box.querySelector("[data-spr-undo]")?.addEventListener("click",()=>{if(confirm("Änderungen verwerfen?")){sprFromApp();redo()}});
  box.querySelector("[data-spr-merge]")?.addEventListener("click",()=>{if(!confirm(missing.length+" Standard-Sprüche ergänzen, die noch nicht in der Liste stehen? Deine eigenen Sprüche bleiben erhalten."))return;spr.list=spr.list.concat(missing);spr.edit=-1;spr.form=false;changed()});
  box.querySelector("[data-spr-reset]").onclick=()=>{if(!confirm("Die Liste durch die Standard-Sprüche ersetzen? Eigene Sprüche gehen dabei verloren (erst beim Speichern)."))return;spr.list=I.clean(window.SPRUECHE_STANDARD);spr.edit=-1;spr.form=false;changed()};
  box.querySelector("[data-spr-save]").onclick=async ev=>{
    const b=ev.currentTarget; b.disabled=true;
    const list=I.clean(spr.list), local=()=>{window.setSprueche?.({on:spr.on,list});spr.dirty=false;spr.edit=-1;spr.form=false};
    try{
      await setDoc(doc(db,"appConfig","sprueche"),{on:spr.on,list,updatedAt:serverTimestamp()});
      local(); alert("Gespeichert. Die Startseite zeigt die neue Liste ab sofort (bei anderen Geräten spätestens nach 3 Stunden).");
    }catch(err){
      if(String(err.message||err).startsWith("Testversion")){local();alert("Testversion: nur auf diesem Gerät übernommen, nicht gespeichert.")}
      else{console.error(err);alert("Speichern nicht möglich: "+(err.message||err));b.disabled=false;return}
    }
    redo();
  };
}
window.adminSpruchEditor=adminSpruchEditor;

/* ===== 1.43.0: Wetter am Spielort – Firestore weather/{Spiel-ID}, geschrieben von der Cloud Function weatherForecast =====
   Höchstens stündlich neu laden (sonst aus dem Gerätespeicher). Die Geräte fragen keinen Wetterdienst selbst. */
async function loadWeather(force){
  try{
    let c=null; try{c=JSON.parse(localStorage.getItem("grizzlysWeather")||"null")}catch(e){}
    if(c&&c.data){window.weatherData=c.data;window.renderWeather?.()}
    if(!force&&c&&c.ts&&Date.now()-c.ts<3600000)return;
    const snap=await getDocs(collection(db,"weather")), data={};
    snap.forEach(d=>{const x=d.data()||{};data[d.id]={t:x.t,tMin:x.tMin,pp:x.pp,txt:String(x.txt||""),warn:String(x.warn||""),ice:!!x.ice,frost:!!x.frost,code:x.code,at:x.at&&x.at.toMillis?x.at.toMillis():0}});
    window.weatherData=data; try{localStorage.setItem("grizzlysWeather",JSON.stringify({ts:Date.now(),data}))}catch(e){}
    window.renderWeather?.();
  }catch(err){console.warn("Wetter konnte nicht geladen werden",err)}
}

/* ===== 1.44.0: Ein-Tipp-Feedback (reactions) und Wunschliste (appConfig/wuensche, wishVotes, wishStats) ===== */
const fbDevId=()=>String(getInstallationId()).replace(/[^A-Za-z0-9_-]/g,"").slice(0,64);
window.fbReact=async function(target,v){
  if(!/^(rep|neu)_[A-Za-z0-9._-]{3,60}$/.test(target))return false;
  try{await setDoc(doc(db,"reactions",target+"__"+fbDevId()),{target,v:v>0?1:-1,createdAt:serverTimestamp()});return true}
  catch(err){if(String(err.message||err).startsWith("Testversion"))return true;console.warn("Reaktion nicht gespeichert",err);return false}
};
window.wishLoad=async function(){
  const out={list:null,on:true,counts:{},voters:0};
  try{const s=await getDoc(doc(db,"appConfig","wuensche"));if(s.exists()){const x=s.data()||{};out.on=x.on!==false;out.list=Array.isArray(x.list)?x.list:null}}catch(e){console.warn("Wunschliste nicht ladbar",e)}
  try{const s=await getDoc(doc(db,"wishStats","all"));if(s.exists()){const x=s.data()||{};out.counts=x.counts||{};out.voters=x.voters||0}}catch(e){console.warn("Wunsch-Stimmen nicht ladbar",e)}
  return out;
};
window.wishVote=async function(ids){
  try{await setDoc(doc(db,"wishVotes",fbDevId()),{v:ids.slice(0,3),updatedAt:serverTimestamp()});return true}
  catch(err){if(String(err.message||err).startsWith("Testversion"))return true;console.warn("Stimme nicht gespeichert",err);return false}
};
/* Admin: Wunschliste bearbeiten und Reaktionen ansehen (Reiter Rückmeldungen) */
async function adminWishEditor(){
  const box=document.getElementById("adminWishes"); if(!box||!window.wishInfo)return;
  const I=window.wishInfo, e=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  if(!box._st){const d=await window.wishLoad();box._st={on:d.on,list:I.clean(d.list||window.WUENSCHE_STANDARD),counts:d.counts,voters:d.voters,dirty:false,edit:-2}}
  const st=box._st, sum=document.getElementById("admWishSum"); if(sum)sum.textContent=st.list.filter(w=>!w.done).length+" offen · "+st.voters+" abgestimmt"+(st.dirty?" · nicht gespeichert":"");
  const max=Math.max(1,...st.list.map(w=>st.counts[w.id]||0));
  const form=(w,i)=>`<div class="admSprForm" data-i="${i}"><input maxlength="60" placeholder="Titel, z. B. Fahrgemeinschaften" value="${e(w.t)}"><textarea maxlength="180" rows="2" placeholder="Kurze Beschreibung">${e(w.d)}</textarea><label class="pubChk"><input type="checkbox"${w.done?" checked":""}> umgesetzt (erscheint unter „Umgesetzt dank euch“)</label><div class="apBtns"><button type="button" class="action" data-w-ok>${i<0?"＋ Hinzufügen":"✓ Übernehmen"}</button><button type="button" class="action" data-w-cancel>Abbrechen</button></div></div>`;
  const sorted=st.list.map((w,i)=>({w,i})).sort((a,b)=>(a.w.done-b.w.done)||((st.counts[b.w.id]||0)-(st.counts[a.w.id]||0)));
  box.innerHTML=`<div class="small" style="margin:0 2px 10px">Nutzer geben bis zu 3 Stimmen (News › App und Startseite). Reihenfolge nach Stimmen. Umgesetzte Wünsche bleiben sichtbar unter „Umgesetzt dank euch“.</div>
    <div class="adminGame newsAdminItem"><div class="adminGameHead"><div><b>Wunschliste anzeigen</b><div class="small">${st.on?"Sichtbar für alle":"Ausgeblendet"}</div></div><label class="admSw"><input type="checkbox" id="wishOn"${st.on?" checked":""}><span></span></label></div></div>
    ${st.edit===-1?form({t:"",d:"",done:false},-1):`<button type="button" class="admNewsBtn" data-w-new>＋ Neuen Wunsch hinzufügen</button>`}
    <div class="admSprList">${sorted.map(({w,i})=>i===st.edit?form(w,i):`<div class="adminGame newsAdminItem admSprItem"><div class="admSprTx"><b>${e(w.t)}</b>${w.done?' <span class="wishDoneTag">umgesetzt</span>':""}<div class="small">${e(w.d)}</div><div class="wishBar"><i style="width:${((st.counts[w.id]||0)/max*100).toFixed(0)}%"></i></div><div class="small">${st.counts[w.id]||0} ${st.counts[w.id]===1?"Stimme":"Stimmen"}</div></div><div class="admSprAct"><button type="button" class="action" data-w-edit="${i}" aria-label="Bearbeiten">✎</button><button type="button" class="action" data-w-del="${i}" aria-label="Löschen">✕</button></div></div>`).join("")}</div>
    <div class="admSprBar"><button type="button" class="action admSprSave" data-w-save${st.dirty?"":" disabled"}>Speichern</button></div>`;
  const redo=()=>adminWishEditor(), changed=()=>{st.dirty=true;redo()};
  box.querySelector("#wishOn").onchange=ev=>{st.on=ev.target.checked;changed()};
  box.querySelector("[data-w-new]")?.addEventListener("click",()=>{st.edit=-1;redo()});
  box.querySelectorAll("[data-w-edit]").forEach(b=>b.onclick=()=>{st.edit=Number(b.dataset.wEdit);redo()});
  box.querySelectorAll("[data-w-del]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.wDel);if(!confirm("Wunsch „"+st.list[i].t+"“ löschen? Seine Stimmen zählen dann nicht mehr."))return;st.list.splice(i,1);st.edit=-2;changed()});
  box.querySelectorAll(".admSprForm").forEach(f=>{const i=Number(f.dataset.i);
    f.querySelector("[data-w-cancel]").onclick=()=>{st.edit=-2;redo()};
    f.querySelector("[data-w-ok]").onclick=()=>{const t=f.querySelector("input:not([type])").value.trim(),d=f.querySelector("textarea").value.trim(),done=f.querySelector("input[type=checkbox]").checked;
      if(t.length<3){alert("Bitte einen Titel eingeben.");return}
      if(i<0){let id=I.slug(t),n=2;while(st.list.some(w=>w.id===id))id=I.slug(t)+"-"+(n++);st.list.push({id,t,d,done})}else Object.assign(st.list[i],{t,d,done});
      st.edit=-2;changed()}});
  box.querySelector("[data-w-save]").onclick=async ev=>{ev.currentTarget.disabled=true;const list=I.clean(st.list);
    try{await setDoc(doc(db,"appConfig","wuensche"),{on:st.on,list,updatedAt:serverTimestamp()});st.dirty=false;alert("Wunschliste gespeichert.")}
    catch(err){if(String(err.message||err).startsWith("Testversion")){st.dirty=false;alert("Testversion: nicht gespeichert.")}else{alert("Speichern nicht möglich: "+(err.message||err))}}
    redo()};
}
async function adminReactions(){
  const box=document.getElementById("adminReactions"); if(!box)return;
  box.innerHTML='<div class="small">Lädt …</div>';
  try{const snap=await getDocs(collection(db,"reactionStats")), L=[];snap.forEach(d=>{const x=d.data()||{};L.push({id:d.id,up:x.up||0,down:x.down||0,at:x.updatedAt&&x.updatedAt.toMillis?x.updatedAt.toMillis():0})});
    L.sort((a,b)=>b.at-a.at);
    const name=id=>{if(id.startsWith("neu_"))return "Neu in der App · Version "+id.slice(4);const g=ALL_GAMES.find(x=>("rep_"+resultKey(x))===id);return g?"Spielbericht · "+teamName(g.team)+" · "+fmtDate(g)+" · "+shortTeam(g.home)+" – "+shortTeam(g.away):"Spielbericht · "+id.slice(4)};
    const sum=document.getElementById("admReactSum"); if(sum)sum.textContent=L.reduce((a,x)=>a+x.up,0)+" 👍 · "+L.reduce((a,x)=>a+x.down,0)+" 👎";
    box.innerHTML=L.length?L.slice(0,40).map(x=>`<div class="adminGame newsAdminItem reactRow"><div class="admSprTx"><b>${name(x.id).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</b></div><div class="reactCnt"><span>👍 ${x.up}</span><span>👎 ${x.down}</span></div></div>`).join(""):'<div class="small">Noch keine Reaktionen.</div>';
  }catch(err){box.innerHTML='<div class="small">Konnte nicht geladen werden.</div>';console.warn(err)}
}
window.adminWishEditor=adminWishEditor;window.adminReactions=adminReactions;

/* ===== 1.44.4: Admin-Geräte – Liste mit Test/Live, Gerät, zuletzt aktiv; einzeln oder alle alten entfernen ===== */
const ADM_DEV_OLD=30*864e5;
function admDevList(list,token,fmt){
  if(!list.length)return "";
  const ms=d=>{try{return d.x.updatedAt.toMillis()}catch(e){return 0}};
  const L=list.slice().sort((a,b)=>(b.id===token)-(a.id===token)||ms(b)-ms(a)), old=L.filter(d=>d.id!==token&&Date.now()-ms(d)>ADM_DEV_OLD);
  const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  return `<div class="admDevList"><div class="admDevHead">Admin-Geräte</div>${L.map(d=>{const me=d.id===token,age=Date.now()-ms(d),app=d.x.app==="test"?"Test-App":d.x.app==="live"?"Live-App":"App unbekannt";
    return `<div class="admDev${me?" me":""}${!me&&age>ADM_DEV_OLD?" old":""}"><div class="admDevTx"><b>${e(devLabel(d.x.platform))}${me?' <span class="admDevMe">dieses Gerät</span>':""}</b><small><span class="admDevApp ${e(d.x.app||"")}">${app}</span>${d.x.ver?" · "+e(d.x.ver):""} · zuletzt aktiv ${ms(d)?e(fmt(d.x.updatedAt)):"unbekannt"}${!me&&age>ADM_DEV_OLD?" · länger als 30 Tage inaktiv":""}</small></div>${me?"":`<button type="button" class="admBtn no" data-devdel="${e(d.id)}">Entfernen</button>`}</div>`}).join("")}
    ${old.length?`<button type="button" class="admBtn" data-devold="1">🧹 ${old.length} alte ${old.length===1?"Anmeldung":"Anmeldungen"} entfernen (über 30 Tage inaktiv)</button>`:""}
    <div class="admHint">„Entfernen“ löscht nur die Push-Anmeldung. Wird das Gerät noch benutzt, meldet es sich beim nächsten Öffnen von selbst wieder an – als Admin aber nur, solange dort noch jemand im Admin-Bereich angemeldet ist. Fremde Geräte also dort auch „Abmelden“.</div></div>`;
}
function admDevBind(box){
  const del=async ids=>{let n=0;for(const id of ids){try{await deleteDoc(doc(db,"pushTokens",id));n++}catch(err){if(String(err.message||err).startsWith("Testversion")){alert("Testversion: nichts gelöscht.");return -1}console.warn(err)}}return n};
  box.querySelectorAll("[data-devdel]").forEach(b=>b.onclick=async()=>{if(!confirm("Diese Push-Anmeldung entfernen?\n\nDas Gerät bekommt dann keine Admin-Pushs mehr – bis es sich beim nächsten Öffnen der App neu anmeldet."))return;
    b.disabled=true;const n=await del([b.dataset.devdel]);if(n===0)alert("Entfernen nicht möglich.");refreshAdminPushStatus()});
  box.querySelector("[data-devold]")?.addEventListener("click",async ev=>{const b=ev.currentTarget,ids=[...box.querySelectorAll(".admDev.old [data-devdel]")].map(x=>x.dataset.devdel);
    if(!ids.length||!confirm(ids.length+" alte Push-Anmeldung(en) entfernen?"))return;b.disabled=true;const n=await del(ids);if(n>=0)alert(n+" entfernt.");refreshAdminPushStatus()});
}

/* ===== 1.45.0: Kapitän (C) und Assistenten (A) je Mannschaft – nur Rückennummern, Firestore appConfig/kapitaene =====
   Format: { on:true, list:[{team:"A", c:"17", a:["9","23"]}, …] } – Nutzer lesen höchstens alle 6 Stunden neu. */
async function loadCaptains(force){
  try{
    let c=null; try{c=JSON.parse(localStorage.getItem("grizzlysCaptains")||"null")}catch(e){}
    if(c&&c.data){window.setCaptains?.(c.data,false)}
    if(!force&&c&&c.ts&&Date.now()-c.ts<6*3600000)return;
    const s=await getDoc(doc(db,"appConfig","kapitaene")); const x=s.exists()?(s.data()||{}):{};
    const data={on:x.on!==false,list:Array.isArray(x.list)?x.list:[]};
    try{localStorage.setItem("grizzlysCaptains",JSON.stringify({ts:Date.now(),data}))}catch(e){}
    window.setCaptains?.(data,true);
  }catch(err){console.warn("Kapitäne konnten nicht geladen werden",err)}
}
function adminCaptainEditor(){
  const box=document.getElementById("adminCaptains"); if(!box||!window.capInfo)return;
  const cur=window.capInfo.get(), e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const sum=document.getElementById("admCapSum"); if(sum)sum.textContent=window.TEAM_KEYS.filter(t=>cur.map[t]&&(cur.map[t].c||cur.map[t].a.length)).length+" von "+window.TEAM_KEYS.length+" Mannschaften";
  box.innerHTML=`<div class="small" style="margin:0 2px 10px">Nur Rückennummern, keine Namen. „C“ und „A“ erscheinen auf den Mannschafts-Kacheln, in der Saisonbilanz und neben den Rückennummern der Torschützen.</div>
    ${window.TEAM_KEYS.map(t=>{const m=cur.map[t]||{c:"",a:[]};return `<div class="adminGame newsAdminItem capRow" data-team="${e(t)}"><b class="capTeam">${e(teamName(t))}</b><label><span class="capB c">C</span><input inputmode="numeric" maxlength="2" data-k="c" value="${e(m.c)}" placeholder="Nr."></label><label><span class="capB a">A</span><input inputmode="numeric" maxlength="2" data-k="a0" value="${e(m.a[0]||"")}" placeholder="Nr."></label><label><span class="capB a">A</span><input inputmode="numeric" maxlength="2" data-k="a1" value="${e(m.a[1]||"")}" placeholder="Nr."></label></div>`}).join("")}
    <div class="adminGame newsAdminItem"><div class="adminGameHead"><div><b>In der App anzeigen</b><div class="small">${cur.on?"Sichtbar für alle":"Ausgeblendet"}</div></div><label class="admSw"><input type="checkbox" id="capOn"${cur.on?" checked":""}><span></span></label></div></div>
    <div class="admSprBar"><button type="button" class="action admSprSave" id="capSave">Speichern</button></div>`;
  box.querySelector("#capSave").onclick=async ev=>{const b=ev.currentTarget;b.disabled=true;
    const nr=v=>{v=String(v||"").replace(/\D/g,"");return v?String(Number(v)):""};
    const list=[...box.querySelectorAll(".capRow")].map(r=>{const g=k=>nr(r.querySelector(`[data-k="${k}"]`).value);return {team:r.dataset.team,c:g("c"),a:[g("a0"),g("a1")].filter(Boolean)}}).filter(x=>x.c||x.a.length);
    const dup=list.find(x=>[x.c,...x.a].filter(Boolean).length!==new Set([x.c,...x.a].filter(Boolean)).size); if(dup){alert(teamName(dup.team)+": eine Nummer ist doppelt vergeben.");b.disabled=false;return}
    const data={on:box.querySelector("#capOn").checked,list};
    try{await setDoc(doc(db,"appConfig","kapitaene"),{...data,updatedAt:serverTimestamp()});alert("Kapitäne gespeichert.")}
    catch(err){if(!String(err.message||err).startsWith("Testversion")){alert("Speichern nicht möglich: "+(err.message||err));b.disabled=false;return}alert("Testversion: nur auf diesem Gerät übernommen.")}
    try{localStorage.setItem("grizzlysCaptains",JSON.stringify({ts:Date.now(),data}))}catch(e){}
    window.setCaptains?.(data,true); adminCaptainEditor();};
}
window.adminCaptainEditor=adminCaptainEditor;
