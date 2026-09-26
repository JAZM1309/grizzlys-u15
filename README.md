# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die **ESV Grizzlys Bergkamen U15**, Saison 2026/27.

## Funktionen

- Spielplan für **U15 A und U15 B**
- Farbliche Unterscheidung: U15 A blau, U15 B orange
- Chronologische Spielplanansicht
- Monatskalender
- Spieldetails beim Antippen eines Spiels
- Gegnerübersicht mit allen Spielen gegen einen Gegner
- Gegner- und Vereinslogos
- Spielort und Adresse
- Route über Google Maps
- Kalender-Downloads für U15 A, U15 B sowie U15 A + B
- PDF-Spielplan zum Ausdrucken
  - alle Spiele
  - vorhandene Ergebnisse werden übernommen
  - Grizzlys-Logo im PDF
- Teilen einzelner Spiele
- Kalendertermin und 24-Stunden-Erinnerung
- Zentrale Ergebnisverwaltung über Firebase
- Ergebnisse direkt im Spielplan und in den Spieldetails
- Push-Benachrichtigungen für neue Ergebnisse
- Automatische 24-Stunden-Erinnerung vor Spielen
- PWA für die Installation auf Smartphone/Tablet

## Ergebnisverwaltung

Die Ergebnisse werden zentral in **Firebase Firestore** gespeichert.

- Ergebnisse sind öffentlich lesbar.
- Änderungen an Ergebnissen sind nur für den eingerichteten Admin-Benutzer möglich.
- Nach dem Speichern eines neuen Ergebnisses kann automatisch eine Push-Nachricht versendet werden.

## Push-Benachrichtigungen

Die Web-Push-Funktion ist aktiv und verwendet **Firebase Cloud Messaging (FCM)**.

Der automatische Ergebnisdienst läuft über **GitHub Actions** und prüft den aktuellen Stand regelmäßig. Der Workflow ist derzeit auf einen Lauf **alle 5 Minuten** eingestellt.

Zusätzlich kann etwa 24 Stunden vor einem Spiel eine Erinnerung versendet werden.

Ungültige oder nicht mehr registrierte Push-Tokens werden vom Ergebnisdienst erkannt und aus der Token-Sammlung entfernt.

## Firebase

Firebase-Projekt:

`grizzlys-u15`

Verwendete Bereiche:

- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging

Wichtige Firestore-Sammlungen:

- `results` – Spielergebnisse
- `pushTokens` – registrierte Push-Geräte
- `gameReminders` – bereits versendete Spiel-Erinnerungen

## GitHub Actions

Der automatische Ergebnis- und Erinnerungsdienst befindet sich unter:

`.github/workflows/main.yml`

Der Workflow wird automatisch ausgeführt und kann zusätzlich manuell gestartet werden.

## App-Dateien

Die wichtigsten Dateien im Repository sind unter anderem:

- `index.html` – eigentliche App
- `sw.js` – Service Worker für PWA und Hintergrund-Push
- `manifest.webmanifest` – PWA-Installation
- `logo.png` – Grizzlys-Logo
- `icon-192.png` / weitere App-Icons – App-Symbole
- `.github/workflows/main.yml` – automatischer Ergebnis-/Push-Dienst

## Veröffentlichung

Die App kann kostenlos über **GitHub Pages** bereitgestellt werden.

Für die PWA ist eine HTTPS-Adresse erforderlich.

Die App selbst benötigt keine laufenden Hosting-Gebühren, solange die verwendeten kostenlosen Dienste innerhalb ihrer jeweiligen kostenlosen Kontingente bleiben.

## Hinweis

Die README-Datei dient ausschließlich als **Dokumentation des GitHub-Projekts**. Sie ist kein Bestandteil der sichtbaren App und wird in der App nicht angezeigt.
