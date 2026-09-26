# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

## Version 1.5.1

### Neu in Version 1.5.1

- Alle Funktionen aus Version 1.4 bleiben erhalten
- Gegnerübersicht mit Entfernungen ab der Eissporthalle Bergkamen
- Entfernung beim nächsten Spiel aus derselben Entfernungstabelle wie in der Gegnerübersicht
- „Heute“-Button in der Monatskalenderansicht
- Ergebnisanzeige mit Endergebnis sowie Sieg, Niederlage oder Unentschieden aus Sicht der Grizzlys
- Spielplanfilter für Alle, U15 A, U15 B, Heim und Auswärts
- Aktive Darstellung der ausgewählten Spielplanfilter
- Suchfeld für die Gegnerübersicht
- Spieldetails aus der Kalenderansicht
- PDF-Druck des kompletten Spielplans inklusive vorhandener Ergebnisse und Grizzlys-Logo

## Version 1.4

### Neu in Version 1.4

- Zentrale Ergebnisverwaltung über Firebase Firestore
- Ergebnisse werden öffentlich aus Firestore geladen
- Ergebnisse werden direkt im Spielplan und in den Spieldetails angezeigt
- Geschützte Ergebnisverwaltung für den eingerichteten Admin
- Firebase Authentication mit E-Mail und Passwort
- Push-Benachrichtigungen über Firebase Cloud Messaging
- Automatische Push-Meldung bei neuen Spielergebnissen
- Automatische Erinnerung 24 Stunden vor einem Spiel
- Speicherung der Push-Geräte-Tokens in Firestore
- Ungültige bzw. nicht mehr registrierte Push-Tokens werden automatisch bereinigt
- Gegnerübersicht mit den jeweiligen Spielen
- Gegnerlogos in der App
- Spieldetails aus der Kalenderansicht
- Chronologische Spielplanansicht und Monatskalender
- Kalender-Downloads für U15 A, U15 B sowie U15 A + B
- Spielort und Hallenadresse
- Routenfunktion über Google Maps
- Teilen von Spielen
- Erinnerungen und Kalendertermine
- PDF-Druck des kompletten Spielplans inklusive vorhandener Ergebnisse und Grizzlys-Logo
- Überarbeitete Navigation und Darstellung für Smartphone und Desktop
- PWA-Unterstützung zum Installieren der App auf dem Gerät

## Version 1.3

### Grundlage von Version 1.3

- Spielplan für U15 A und U15 B
- Chronologische Spielplanansicht
- Monatskalender
- Umschaltung zwischen chronologischer Ansicht und Kalender
- Farbige Unterscheidung von U15 A und U15 B
- Gegnerlogos
- Spielort und Adressinformationen
- Kalenderdateien für die Spiele
- PWA für Smartphone und Desktop
- Erste Firebase-Anbindung
- Firebase Firestore für die zentrale Ergebnisverwaltung vorbereitet
- Firebase Authentication vorbereitet
- Push-Infrastruktur vorbereitet

## Versionshistorie

| Version | Inhalt |
|---|---|
| **1.3** | Grundlage mit Spielplan, Kalender, Team-Unterscheidung, Logos, Kalenderdateien und vorbereiteter Firebase-/Push-Anbindung |
| **1.4** | Ergebnisverwaltung, Admin-Bereich, aktive Push-Benachrichtigungen, 24-Stunden-Erinnerungen, Gegnerübersicht, Spieldetails, PDF-Ausgabe und weitere Überarbeitungen |
| **1.5.1** | Entfernungen, Kalender-Heute-Button, Ergebnisstatus, zusätzliche Spielplanfilter, aktive Filterdarstellung und Gegnersuche |

## Firebase

Firebase-Projekt: `grizzlys-u15`

Verwendete Firestore-Sammlungen:

- `results` – Spielergebnisse
- `pushTokens` – registrierte Push-Geräte
- `gameReminders` – Erinnerungsdaten

Die Ergebnisse sind öffentlich lesbar. Schreibzugriffe auf die Ergebnisverwaltung sind auf den eingerichteten Admin-Benutzer beschränkt.

## Push-Benachrichtigungen

Die Push-Funktion ist aktiv.

Sie wird verwendet für:

- neue Spielergebnisse
- automatische Erinnerung 24 Stunden vor einem Spiel

Die automatische Verarbeitung läuft über GitHub Actions. Die Prüfung erfolgt regelmäßig und versendet fällige Benachrichtigungen über Firebase Cloud Messaging.

## Veröffentlichung

Die App wird als kostenlose PWA über GitHub Pages veröffentlicht.

Repository:

`JAZM1309/grizzlys-u15`

Die README dient ausschließlich als Dokumentation des Projekts und ist nicht Bestandteil der sichtbaren App-Oberfläche.
