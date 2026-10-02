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
const BUG_ICON_URL = "https://raw.githubusercontent.com/JAZM1309/grizzlys-u15/main/grizzlys-bug-icon.png";

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
      path: "grizzlys-bug-icon.png",
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
  console.log("Bug-Push: Admin-Token gefunden:", candidates.length);
  if (!candidates.length) return false;

  const tokens = candidates.map(d => d.token);
  const title = "🏒 Neue Grizzlys-Fehlermeldung";
  const body = `${report.area || "Sonstiges"}: ${(report.description || "").slice(0,100)}`;

  const response = await messaging.sendEachForMulticast({
    tokens,
    data: {
      type: "bugReport",
      reportId: report.id || "",
      title,
      body,
      image: BUG_ICON_URL
    }
  });

  for (let i=0;i<response.responses.length;i++) {
    const result=response.responses[i];
    if (!result.success) {
      const code=result.error?.code || "";
      if (code.includes("registration-token-not-registered") || code.includes("invalid-registration-token")) {
        await db.collection("pushTokens").doc(tokens[i]).delete().catch(()=>{});
      }
    }
  }

  console.log("Bug-Push Ergebnis:", { successCount: response.successCount, failureCount: response.failureCount });
  return response.successCount > 0;
}

async function main() {
  const stateSnap=await STATE_REF.get();
  let lastProcessedMs=0;

  if (stateSnap.exists && stateSnap.data().lastProcessedAt) {
    const ts=stateSnap.data().lastProcessedAt;
    lastProcessedMs=ts.toMillis ? ts.toMillis() : Date.parse(ts);
  } else {
    await STATE_REF.set({lastProcessedAt:admin.firestore.Timestamp.now(),initializedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    console.log("Notifier initialisiert – bestehende Fehlermeldungen werden nicht nachträglich versendet.");
    return;
  }

  const snap=await db.collection("bugReports").get();
  const reports=[];
  snap.forEach(doc=>{
    const data=doc.data()||{};
    const createdAt=data.createdAt;
    const createdMs=createdAt?.toMillis ? createdAt.toMillis() : 0;
    if(createdMs>lastProcessedMs) reports.push({id:doc.id,...data,_createdMs:createdMs});
  });

  reports.sort((a,b)=>a._createdMs-b._createdMs);
  console.log("Bug-Notifier: neue Fehlermeldungen:", reports.length);

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
