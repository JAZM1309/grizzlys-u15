ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Version 1.6.5

Neu in Version 1.6.5
- Update-Hinweis in der App: Banner „Neue Version verfügbar“ mit den Buttons Aktualisieren und Schließen
- Prüfung auf neue Versionen beim Zurückkehren in die App und alle 30 Minuten
- Neue Version wird erst nach Tippen auf „Aktualisieren“ aktiviert
- Schließen blendet den Banner bis zum nächsten App-Start aus
- PWA-Cache auf grizzlys-u15-v25 erneuert
- Dokumentation und Versionsstand auf 1.6.5 aktualisiert

Version 1.6.4

Neu in Version 1.6.4
- U15 A als Spielgemeinschaft „SpG ESV Grizzlys Bergkamen / ESC Rheine Young Cats“ ergänzt, inklusive Young-Cats-Logo in den Spieldarstellungen
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
- Dokumentation und Versionsstand auf 1.6.4 aktualisiert

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

Update-Hinweis
Sobald eine neue Version bereitsteht, erscheint unten ein Banner. „Aktualisieren“ lädt die neue Version, „×“ blendet den Banner bis zum nächsten App-Start aus. Bei jeder App-Änderung muss der Cache-Name in sw.js erhöht werden (aktuell grizzlys-u15-v25).

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
