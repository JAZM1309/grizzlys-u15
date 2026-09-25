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

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(list => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }

      if (clients.openWindow) {
        return clients.openWindow("./");
      }
    })
  );
});

const CACHE = "grizzlys-u15-v14";

const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE)
          .then(cache => cache.put(event.request, copy));

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
