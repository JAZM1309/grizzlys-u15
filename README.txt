# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

## Version 1.6.2

### Änderungen und Funktionen

- Spielplan für U15 A und U15 B
- Chronologische Spielplanansicht und Monatskalender
- U15 A und U15 B farblich getrennt
- Gegnerübersicht mit Spielen, Logos und Routen
- Spieldetails aus Kalender- und Spielplanansicht
- Kalender-Downloads für U15 A, U15 B sowie beide Mannschaften
- PDF-Druck mit Auswahlfiltern für Alle, U15 A, U15 B, Heim und Auswärts; mehrere Filter können kombiniert werden
- Ergebnisse aus Firebase Firestore direkt im Spielplan und in den Spieldetails
- Anzeige „ENDERGEBNIS“ sowie Sieg/Niederlage/Unentschieden
- Geschützte Ergebnisverwaltung im Admin-Bereich
- Spieländerungen zentral über den Admin-Bereich
- Push-Benachrichtigungen über Firebase Cloud Messaging
- Automatische Push-Meldung bei neuen Spielergebnissen
- Automatische Erinnerung 24 Stunden vor einem Spiel
- Eigenes Grizzlys-Bild für Ergebnis-Pushs
- Eigenes Grizzlys-Bild für die 24-Stunden-Spielerinnerung
- Push-Service-Worker verwendet die vom Dienst übergebene Bilddatei und ein Fallback
- Push-Geräte-Tokens werden in Firestore gespeichert und nicht mehr gültige Tokens bereinigt
- Admin-Push-Token wird beim Admin-Login registriert
- Fehler melden direkt aus der App
- Name im Fehlerformular ist verpflichtend
- Fehlermeldungen werden in Firebase gespeichert und im geschützten Admin-Bereich verwaltet
- Fehler-Push und Fehler-E-Mail mit Fehlermeldungsbild
- App-/Gerätestatistik für Installationen und Push-Registrierungen
- Hockey Tic-Tac-Toe als Minispiel
- Teilen der App und einzelner Spiele
- EHV-NRW-Tabellen für U15 A und U15 B
- Teamseiten der Grizzlys U15 A und U15 B
- PWA-Unterstützung für Smartphones und Desktop

## Firebase

Projekt: `grizzlys-u15`

Firestore-Sammlungen:
- `results` – Spielergebnisse
- `pushTokens` – registrierte Push-Geräte
- `gameReminders` – Erinnerungsdaten
- `appInstallations` – technische App-/Geräteregistrierungen
- `bugReports` – Fehlermeldungen

## Automatische Dienste

### Ergebnisdienst
Der GitHub-Actions-Ergebnisdienst prüft regelmäßig die Spielergebnisse und sendet neue Ergebnis-Pushs. Das Ergebnis-Push verwendet das Grizzlys-Ergebnisbild.

### 24-Stunden-Erinnerung
Der Dienst prüft regelmäßig bevorstehende Spiele und sendet 24 Stunden vor dem Spiel eine Push-Erinnerung mit dem eigenen Grizzlys-24-Stunden-Bild.

### Fehlermeldungsdienst
Neue Fehlermeldungen werden über GitHub Actions verarbeitet. Der Dienst kann eine Push-Benachrichtigung und eine E-Mail an die Verwaltung senden.

## Veröffentlichung

Die App wird als kostenlose PWA über GitHub Pages veröffentlicht.

Repository:
`JAZM1309/grizzlys-u15`

Die README-Dateien dienen der Projektdokumentation und sind nicht Bestandteil der sichtbaren App-Oberfläche.
