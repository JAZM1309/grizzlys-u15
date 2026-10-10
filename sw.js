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

const CACHE = "grizzlys-u15-v86";

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
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
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
