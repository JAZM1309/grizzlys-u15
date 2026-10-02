const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

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
const BUG_ICON_URL = "https://jazm1309.github.io/grizzlys-u15/grizzlys-bug-icon.png";
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
  const text = [
    "Neue Fehlermeldung in der Grizzlys-U15-App","",
    `Name: ${report.name || "Nicht angegeben"}`,
    `Bereich: ${report.area || "Sonstiges"}`,
    `Version: ${report.appVersion || "?"}`,
    `Plattform: ${report.platform || "?"}`,
    `Push beim Nutzer: ${report.pushRegistered ? "aktiv" : "nicht registriert"}`,"",
    "Fehlerbeschreibung:",report.description || "","",
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
    subject: `🏒 Grizzlys U15 – neue Fehlermeldung (${report.area || "Sonstiges"})`,
    text,
    attachments: [{
      filename: "grizzlys-bug-icon.png",
      content: "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",
      encoding: "base64",
      cid: "grizzlys-bug-icon@grizzlys-u15",
      contentType: "image/png",
      contentDisposition: "inline"
    }],
    html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:700px">
      <img src="cid:grizzlys-bug-icon@grizzlys-u15" alt="Grizzlys Fehler" width="220" style="display:block;margin:0 0 18px">
      <h2>Neue Fehlermeldung in der Grizzlys-U15-App</h2>
      <p><b>Name:</b> ${report.name || "Nicht angegeben"}<br><b>Bereich:</b> ${report.area || "Sonstiges"}<br><b>Version:</b> ${report.appVersion || "?"}<br><b>Plattform:</b> ${report.platform || "?"}<br><b>Push beim Nutzer:</b> ${report.pushRegistered ? "aktiv" : "nicht registriert"}</p>
      <p><b>Fehlerbeschreibung:</b></p><p>${safe}</p>
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

  console.log("Bug-Push: Admin-Token gefunden:", candidates.length, "– verwende das zuletzt aktualisierte Gerät.");
  if (!candidates.length) return false;

  const tokens = [candidates[0].token];
  const title = "🏒 Neue Grizzlys-Fehlermeldung";
  const body = `${report.area || "Sonstiges"}: ${(report.description || "").slice(0,100)}`;

  // Exakt derselbe FCM/WebPush-Aufbau wie beim funktionierenden 24h-Push.
  // Empfänger bleiben ausschließlich die zuvor ausgewählten Admin-Tokens.
  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon: BUG_ICON_URL,
        badge: BUG_BADGE_URL,
        image: BUG_ICON_URL
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

main().catch(error=>{console.error(error);process.exit(1);});
