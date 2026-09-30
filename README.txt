ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Version 1.6.3

Neu in Version 1.6.3
- Integriertes Google-Analytics-Statistikdashboard direkt im geschützten Admin-Bereich
- Zeiträume: Heute, Diese Woche, Dieser Monat, 30 Tage, Saison und Gesamt
- Aktive Nutzer, neue Nutzer, Sitzungen und Events
- Tagesverlauf der aktiven Nutzer
- Auswertungen zu Events, Geräten, Betriebssystemen, Seitenaufrufen und Städten
- Analytics-Daten über eine geschützte Firebase Cloud Function und die Google Analytics Data API
- Keine Google-Analytics-Zugangsdaten im PWA-Frontend
- Analytics-Tagesbeschriftungen und PWA-Cache für die aktuelle Anzeige korrigiert
- Ergebnis-Push-Dienst und Push-Bilder korrigiert
- Eigenes Bild für die automatische 24-Stunden-Spielerinnerung
- Fehlermeldungen wieder mit verpflichtendem Namen
- Admin-Push-Token wird beim Admin-Login registriert
- Fehler-E-Mail und Fehler-Push inklusive Fehlermeldungsbild
- Dokumentation und Versionsstand auf 1.6.3 aktualisiert

Google Analytics
Das geschützte Statistikdashboard zeigt:
- Aktive Nutzer
- Neue Nutzer
- Sitzungen
- Events
- Tagesverlauf
- App-Events
- Geräte
- Betriebssysteme
- Seitenaufrufe
- Städte

Zeiträume:
- Heute
- Diese Woche
- Dieser Monat
- 30 Tage
- Saison
- Gesamt

Die Daten werden serverseitig über Firebase und die Google Analytics Data API abgefragt. Zugangsdaten werden nicht in der PWA gespeichert.

Vorherige Funktionen
- Zentrale Ergebnisverwaltung über Firebase Firestore
- Ergebnisse im Spielplan und in den Spieldetails
- Geschützter Admin-Bereich
- Firebase Authentication
- Push-Benachrichtigungen für Ergebnisse und 24-Stunden-Erinnerung
- Push-Geräte und Installationen in Firestore
- Gegnerübersicht, Spieldetails, Kalender, Downloads, Routen und PDF-Druck
- Fehler melden und Fehlerverwaltung
- Hockey Tic-Tac-Toe
- PWA-Unterstützung

Firebase-Projekt: grizzlys-u15

Firestore-Sammlungen:
- results
- pushTokens
- gameReminders
- appInstallations
- bugReports

Veröffentlichung
Kostenlose PWA über GitHub Pages.
Repository: JAZM1309/grizzlys-u15
