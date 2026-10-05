const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`GitHub Secret ${name} fehlt.`);
  return value;
}

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(required("FIREBASE_SERVICE_ACCOUNT"))) });
const db = admin.firestore();
const messaging = admin.messaging();
const STATE_REF = db.doc("system/bugReportNotifier");
const NOTIFY_EMAIL = required("BUG_REPORT_EMAIL");
const ICON_BASE_URL = "https://jazm1309.github.io/grizzlys-u15/";
const TYPE_INFO = {
  "Fehler": {
    file: "grizzlys-bug-icon.png",
    mailLabel: "Fehlermeldung",
    heading: "Neue Fehlermeldung in der Grizzlys-U15-App",
    descLabel: "Fehlerbeschreibung",
    pushTitle: "🏒 Neue Grizzlys-Fehlermeldung",
    alt: "Grizzlys Fehler"
  },
  "Wunsch / Anregung": {
    file: "grizzlys-wunsch-icon.png",
    mailLabel: "Wunsch / Anregung",
    heading: "Neuer Wunsch / neue Anregung zur Grizzlys-U15-App",
    descLabel: "Wunsch / Anregung",
    pushTitle: "💡 Neuer Grizzlys-Wunsch / Neue Anregung",
    alt: "Grizzlys Wunsch und Anregungen"
  },
  "Lob": {
    file: "grizzlys-lob-icon.png",
    mailLabel: "Lob",
    heading: "Neues Lob für die Grizzlys-U15-App",
    descLabel: "Lob",
    pushTitle: "👍 Neues Lob für die Grizzlys-App",
    alt: "Grizzlys Lob"
  }
};
function typeInfo(report) {
  return TYPE_INFO[report.type] || TYPE_INFO["Fehler"];
}
const BUG_BADGE_URL = "https://jazm1309.github.io/grizzlys-u15/badge-96.png";

function smtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.gmx.net",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: required("SMTP_USER"), pass: required("SMTP_PASSWORD") }
  });
}

async function sendEmail(report) {
  const info = typeInfo(report);
  const text = [
    info.heading,"",
    `Name: ${report.name || "Nicht angegeben"}`,
    `Art: ${report.type || "Fehler"}`,
    `Bereich: ${report.area || "Sonstiges"}`,
    `Version: ${report.appVersion || "?"}`,
    `Plattform: ${report.platform || "?"}`,
    `Push beim Nutzer: ${report.pushRegistered ? "aktiv" : "nicht registriert"}`,"",
    `${info.descLabel}:`,report.description || "","",
    report.contact ? `Rückfrage-Kontakt: ${report.contact}` : "Kein Rückfrage-Kontakt angegeben."
  ].join("\n");

  const safe = String(report.description || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/\n/g,"<br>");

  await smtpTransport().sendMail({
    from: process.env.SMTP_USER,
    to: NOTIFY_EMAIL,
    subject: `🏒 Grizzlys U15 – ${info.mailLabel} (${report.area || "Sonstiges"})`,
    text,
    attachments: [{
      filename: info.file,
      path: path.join(__dirname, info.file),
      cid: "grizzlys-feedback-icon@grizzlys-u15",
      contentType: "image/png",
      contentDisposition: "inline"
    }],
    html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:700px">
      <img src="cid:grizzlys-feedback-icon@grizzlys-u15" alt="${info.alt}" width="160" height="160" style="display:block;margin:0 0 18px">
      <h2>${info.heading}</h2>
      <p><b>Name:</b> ${report.name || "Nicht angegeben"}<br><b>Art:</b> ${report.type || "Fehler"}<br><b>Bereich:</b> ${report.area || "Sonstiges"}<br><b>Version:</b> ${report.appVersion || "?"}<br><b>Plattform:</b> ${report.platform || "?"}<br><b>Push beim Nutzer:</b> ${report.pushRegistered ? "aktiv" : "nicht registriert"}</p>
      <p><b>${info.descLabel}:</b></p><p>${safe}</p>
      ${report.contact ? `<p><b>Rückfrage-Kontakt:</b> ${report.contact}</p>` : "<p>Kein Rückfrage-Kontakt angegeben.</p>"}
    </div>`
  });
}

async function sendPush(report) {
  const snap = await db.collection("pushTokens").where("admin","==",true).get();
  const byInstallation = new Map();

  for (const doc of snap.docs) {
    const d = doc.data() || {};
    if (!d.token) continue;
    const key = d.installationId || doc.id;
    const previous = byInstallation.get(key);
    const currentMs = d.updatedAt?.toMillis ? d.updatedAt.toMillis() : 0;
    const previousMs = previous?.updatedAt?.toMillis ? previous.updatedAt.toMillis() : 0;
    if (!previous || currentMs >= previousMs) byInstallation.set(key, { data:d });
  }

  const candidates = [...byInstallation.values()].map(x => x.data).filter(d => d.token);
  candidates.sort((a,b) => {
    const am = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
    const bm = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
    return bm - am;
  });

  console.log("Bug-Push: Admin-Token gefunden:", candidates.length, "– sende an alle Admin-Geräte.");
  if (!candidates.length) return false;

  const tokens = [...new Set(candidates.map(c => c.token))];
  const info = typeInfo(report);
  const title = info.pushTitle;
  const body = `${report.area || "Sonstiges"}: ${(report.description || "").slice(0,100)}`;

  // Exakt derselbe FCM/WebPush-Aufbau wie beim funktionierenden 24h-Push.
  // Empfänger bleiben ausschließlich die zuvor ausgewählten Admin-Tokens.
  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon: ICON_BASE_URL + info.file,
        badge: BUG_BADGE_URL
      },
      data: { type: "bugReport", title, body },
      fcmOptions: {
        link: "https://jazm1309.github.io/grizzlys-u15/"
      }
    }
  });

  console.log("Bug-Push Ergebnis:", { successCount: response.successCount, failureCount: response.failureCount });
  return response.successCount > 0;
}

async function main() {
  const stateSnap=await STATE_REF.get();
  let lastProcessedMs=0;

  if (!stateSnap.exists) {
    await STATE_REF.set({
      initializedAt: admin.firestore.FieldValue.serverTimestamp()
    }, {merge:true});
    console.log("Notifier initialisiert.");
  }

  const snap=await db.collection("bugReports").get();
  const reports=[];
  snap.forEach(doc=>{
    const data=doc.data()||{};
    // Wie beim funktionierenden 24h-Dienst wird nicht über ein globales
    // Zeitfenster entschieden. Eine Meldung ist erledigt, sobald Push UND
    // E-Mail erfolgreich versendet wurden.
    if(!data.pushSentAt || !data.emailSentAt) {
      const createdAt=data.createdAt;
      const createdMs=createdAt?.toMillis ? createdAt.toMillis() : 0;
      // Die Cloud Function onBugReportCreated bekommt 3 Minuten Vorsprung;
      // dieser Workflow versendet nur, was dort nicht erfolgreich war.
      if(createdMs && Date.now()-createdMs < 3*60*1000) return;
      reports.push({id:doc.id,...data,_createdMs:createdMs});
    }
  });

  reports.sort((a,b)=>a._createdMs-b._createdMs);
  console.log("Bug-Notifier: offene Fehlermeldungen:", reports.length);

  for(const report of reports){
    console.log("Bug-Notifier: verarbeite Fehlermeldung:", report.id, report.area || "Sonstiges");
    const ref=db.collection("bugReports").doc(report.id);
    let current=(await ref.get()).data()||{};
    let pushSent=Boolean(current.pushSentAt);

    if(!pushSent){
      pushSent=await sendPush(report);
      console.log("Bug-Notifier: Push gesendet:", pushSent);
      if(pushSent) await ref.update({pushSentAt:admin.firestore.FieldValue.serverTimestamp()});
    }

    current=(await ref.get()).data()||{};
    let emailSent=Boolean(current.emailSentAt);

    if(!emailSent){
      try{
        await sendEmail(report);
        await ref.update({emailSentAt:admin.firestore.FieldValue.serverTimestamp()});
        emailSent=true;
        console.log("Bug-Notifier: E-Mail gesendet:", report.id);
      }catch(error){
        console.error("E-Mail-Versand fehlgeschlagen:",error.message);
      }
    }

    if(pushSent && emailSent){
      await STATE_REF.set({
        lastProcessedAt:admin.firestore.Timestamp.fromMillis(report._createdMs),
        lastProcessedReportId:report.id,
        updatedAt:admin.firestore.FieldValue.serverTimestamp()
      },{merge:true});
    }
  }
}

// Wichtig: Prozess ausdrücklich beenden. Die Firebase-Verbindung bleibt sonst offen,
// der GitHub-Job läuft dann bis zum Timeout und spätere Läufe werden abgebrochen
// (= "All jobs were cancelled"-E-Mails alle paar Minuten).
main().then(()=>process.exit(0)).catch(error=>{console.error(error);process.exit(1);});
