importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC-Dqjj-vNMYA8QRc3SGeivMDRjEHjwKe0",
  authDomain: "grizzlys-u15.firebaseapp.com",
  projectId: "grizzlys-u15",
  storageBucket: "grizzlys-u15.firebasestorage.app",
  messagingSenderId: "595868074479",
  appId: "1:595868074479:web:2ac44da77d0dc533ac361a"
});

const messaging = firebase.messaging();
const BUG_ICON_URL = "https://jazm1309.github.io/grizzlys-u15/grizzlys-bug-icon.png";
const RESULT_ICON_URL = "https://jazm1309.github.io/grizzlys-u15/grizzlys-result-icon.png";
const REMINDER_ICON_URL = "https://jazm1309.github.io/grizzlys-u15/grizzlys-24h-icon-192.png";

messaging.onBackgroundMessage(payload => {
  // FCM notification-Payloads werden bei Hintergrundempfang bereits vom
  // Browser/FCM angezeigt. Nicht noch einmal selbst anzeigen.
  if (payload.notification) return;

  const n = payload.notification || {};
  const data = payload.data || {};
  const type = data.type || "";
  let icon = "./icon-192.png";
  let badge = "https://jazm1309.github.io/grizzlys-u15/badge-96.png";
  let image = null;

  if (type === "bugReport") {
    icon = BUG_ICON_URL;
  } else if (type === "result") {
    icon = RESULT_ICON_URL;
  } else if (type === "gameReminder") {
    icon = REMINDER_ICON_URL;
  }

  const options = {
    body: data.body || n.body || "Neue Grizzlys-Meldung",
    icon,
    badge,
    data
  };
  if (image) options.image = image;
  self.registration.showNotification(data.title || n.title || "ESV Grizzlys U15", options);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});

const CACHE = "grizzlys-u15-v149";
// Update-Hinweis („Neue Version verfügbar“) für diese Version zeigen? false = Nutzer bekommen sie still beim nächsten Öffnen.
// In Live wird der Wert beim „Live gehen“ aus dem Häkchen im Admin-Bereich gesetzt.
const UPDATE_HINWEIS = false;

const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./grizzlys-bug-icon.png",
  "./halloween-logo.png?v=2",
  "./christmas-logo.png",
  "./christmas-logo-gross.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
  );
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  // Die Seite fragt, welche Version hier wartet (Update-Banner nur bei wirklich neuerer Version).
  if (event.data && event.data.type === "GET_VERSION" && event.ports && event.ports[0]) event.ports[0].postMessage({ cache: CACHE, hinweis: UPDATE_HINWEIS });
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      // Nur eigene alte Caches löschen: Live- und Test-App teilen sich den Speicher und löschten sich sonst gegenseitig.
      .then(keys => Promise.all(keys.filter(key => key !== CACHE && key.startsWith(CACHE.replace(/\d+$/, ""))).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Datenschutz (1.21.0): Google-Analytics-Dateien nur laden, wenn in der App „Nutzungsstatistik erlauben“ an ist.
const ANALYTICS_HOST = /(^|\.)(googletagmanager|google-analytics)\.com$/;
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (ANALYTICS_HOST.test(new URL(event.request.url).hostname)) {
    event.respondWith(
      caches.open("grizzlys-consent").then(c => c.match("consent")).then(r => r ? r.text() : "")
        .then(v => v === "granted" ? fetch(event.request) : new Response("", { status: 204 }))
        .catch(() => new Response("", { status: 204 }))
    );
    return;
  }
  // Seite und Programmdateien immer beim Server nachfragen (nicht aus dem 10-Minuten-Zwischenspeicher
  // des Browsers), damit ein Update sofort ankommt. Bilder dürfen weiter aus dem Zwischenspeicher kommen.
  const req = event.request, url = new URL(req.url);
  const fresh = url.origin === self.location.origin && (req.mode === "navigate" || /\.(html|js|json|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/"));
  const load = fresh ? fetch(req.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(req);
  event.respondWith(
    load
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
