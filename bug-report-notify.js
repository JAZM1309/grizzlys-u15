const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`GitHub Secret ${name} fehlt.`);
  return value;
}

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(required("FIREBASE_SERVICE_ACCOUNT"))
  )
});

const db = admin.firestore();
const messaging = admin.messaging();
const STATE_REF = db.doc("system/bugReportNotifier");
const NOTIFY_EMAIL = required("BUG_REPORT_EMAIL");

function smtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.gmx.net",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASSWORD")
    }
  });
}

async function sendEmail(report) {
  const text = [
    "Neue Fehlermeldung in der Grizzlys-U15-App",
    "",
    `Bereich: ${report.area || "Sonstiges"}`,
    `Version: ${report.appVersion || "?"}`,
    `Plattform: ${report.platform || "?"}`,
    `Push beim Nutzer: ${report.pushRegistered ? "aktiv" : "nicht registriert"}`,
    "",
    "Fehlerbeschreibung:",
    report.description || "",
    "",
    report.contact
      ? `Rückfrage-Kontakt: ${report.contact}`
      : "Kein Rückfrage-Kontakt angegeben."
  ].join("\n");

  await smtpTransport().sendMail({
    from: process.env.SMTP_USER,
    to: NOTIFY_EMAIL,
    subject: `🐛 Grizzlys U15 – neue Fehlermeldung (${report.area || "Sonstiges"})`,
    text
  });
}

async function sendPush(report) {
  const snap = await db.collection("pushTokens")
    .where("admin", "==", true)
    .get();

  const tokens = [];
  snap.forEach(doc => {
    const data = doc.data() || {};
    if (data.token) tokens.push(data.token);
  });

  const uniqueTokens = [...new Set(tokens)];

  if (!uniqueTokens.length) {
    console.log("Kein Admin-Push-Token registriert.");
    return false;
  }

  const response = await messaging.sendEachForMulticast({
    tokens: uniqueTokens,
    notification: {
      title: "🐛 Neue Fehlermeldung",
      body: `${report.area || "Sonstiges"}: ${(report.description || "").slice(0, 100)}`
    },
    data: {
      type: "bugReport",
      reportId: report.id || ""
    },
    webpush: {
      fcmOptions: {
        link: "https://jazm1309.github.io/grizzlys-u15/"
      }
    }
  });

  const invalidTokens = [];

  response.responses.forEach((result, index) => {
    if (!result.success) {
      const code = result.error?.code || "";
      if (
        code.includes("registration-token-not-registered") ||
        code.includes("invalid-registration-token")
      ) {
        invalidTokens.push(uniqueTokens[index]);
      }
      console.warn("Push fehlgeschlagen:", code);
    }
  });

  for (const token of invalidTokens) {
    await db.collection("pushTokens").doc(token).delete().catch(() => {});
  }

  return response.successCount > 0;
}

async function main() {
  const stateSnap = await STATE_REF.get();
  let lastProcessedMs = 0;

  if (stateSnap.exists && stateSnap.data().lastProcessedAt) {
    const ts = stateSnap.data().lastProcessedAt;
    lastProcessedMs = ts.toMillis ? ts.toMillis() : Date.parse(ts);
  } else {
    await STATE_REF.set({
      lastProcessedAt: admin.firestore.Timestamp.now(),
      initializedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log("Notifier initialisiert.");
    return;
  }

  const snap = await db.collection("bugReports").get();
  const reports = [];

  snap.forEach(doc => {
    const data = doc.data() || {};
    const createdAt = data.createdAt;
    const createdMs = createdAt?.toMillis ? createdAt.toMillis() : 0;

    if (createdMs > lastProcessedMs) {
      reports.push({ id: doc.id, ...data, _createdMs: createdMs });
    }
  });

  reports.sort((a, b) => a._createdMs - b._createdMs);

  if (!reports.length) {
    console.log("Keine neuen Fehlermeldungen.");
    return;
  }

  for (const report of reports) {
    const ref = db.collection("bugReports").doc(report.id);
    const currentSnap = await ref.get();
    const current = currentSnap.data() || {};

    // pushSentAt schützt dauerhaft vor einem zweiten Push.
    let pushSent = Boolean(current.pushSentAt);

    if (pushSent) {
      console.log("Push bereits gesendet – kein erneuter Push:", report.id);
    } else {
      pushSent = await sendPush(report);
      if (pushSent) {
        await ref.update({
          pushSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("Push als gesendet markiert:", report.id);
      }
    }

    const afterPush = (await ref.get()).data() || {};
    let emailSent = Boolean(afterPush.emailSentAt);

    if (!emailSent) {
      try {
        await sendEmail(report);
        await ref.update({
          emailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        emailSent = true;
        console.log("E-Mail als gesendet markiert:", report.id);
      } catch (error) {
        console.error("E-Mail-Versand fehlgeschlagen:", error.message);
      }
    } else {
      console.log("E-Mail bereits gesendet:", report.id);
    }

    if (pushSent && emailSent) {
      await STATE_REF.set({
        lastProcessedAt: admin.firestore.Timestamp.fromMillis(report._createdMs),
        lastProcessedReportId: report.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log("Fehlermeldung vollständig verarbeitet:", report.id);
    } else {
      console.log("Fehlermeldung bleibt für den nächsten Lauf offen:", report.id);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});