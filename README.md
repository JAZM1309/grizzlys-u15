# ESV Grizzlys U15 App – Version 1.3

Installierbare Web-App (PWA) für U15 A und U15 B, Saison 2026/27.

## Neu in 1.3
- Zentrale Ergebnisse über Firebase Firestore
- Ergebnisse öffentlich lesbar
- Ergebnisverwaltung nur für den eingerichteten Admin-Benutzer
- Ergebnisanzeige direkt im Spielplan und in den Spieldetails
- Firebase Authentication mit E-Mail/Passwort
- Push-Infrastruktur über Firebase Cloud Messaging vorbereitet

## Wichtig zu Push
Für echte Web-Push-Nachrichten muss im Firebase-Projekt noch ein Web-Push-Zertifikat (VAPID) erzeugt werden. Der öffentliche VAPID-Schlüssel wird anschließend in `index.html` eingetragen. Das Senden automatischer Push-Nachrichten beim Speichern eines Ergebnisses benötigt zusätzlich einen serverseitigen Auslöser; dafür wird bewusst keine kostenpflichtige Cloud-Functions-Konfiguration vorausgesetzt.

## Firebase
Projekt: `grizzlys-u15`
Firestore-Sammlung für Ergebnisse: `results`

Die Firestore-Regeln erlauben öffentliche Lesezugriffe auf `results` und Schreibzugriffe nur für den eingerichteten Admin-UID.

Die App selbst benötigt keine laufenden Gebühren. Für die Veröffentlichung wird weiterhin HTTPS benötigt, z. B. GitHub Pages.
