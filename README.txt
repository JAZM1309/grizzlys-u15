ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Version 1.7.1

Neu in Version 1.7.1
- Das moderne Layout aus 1.7.0 gilt jetzt auch auf Spielplan, Gegner, Downloads und Info
- Spielplan: Segment-Schalter Chronologisch / Kalender, Filter- und Heute-Button mit Icons, Tabellen-Links als Chips, leisere Monatsüberschriften, weiche Spielkarten mit Mannschaftsfarbe am Rand
- Spielkarten: Logos über den Namen, große Uhrzeit, Aktionen als Icon-Reihe, Nächstes Spiel hervorgehoben
- Spiel-Details: Emoji durch Linien-Icons ersetzt
- Gegner: Suchfeld mit Lupe, Karten mit Farbstreifen, Route-Button mit Icon
- Downloads: Einträge mit runden Icons und Pfeil
- Info: weichere Karten, Überschriften mit Icons, Teamseiten als farbige Chips
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf grizzlys-u15-v29 erneuert
- Dokumentation und Versionsstand auf 1.7.1 aktualisiert

Version 1.7.0

Neu in Version 1.7.0
- Modernisierte Optik ohne Änderung an Farben, Logos, Menü und Funktionen
- Kompakterer Kopfbereich mit Stadionbild, das nächste Spiel steht höher
- Karte „Nächstes Spiel“: leiserer Titel, Teamlabel oben rechts, Uhrzeit groß, weiche Schatten
- Spielpaarung aufgeräumt: Logos über den Namen, VS in der Mitte
- Aktionen (Route, Termin, Erinnerung, Teilen) als einheitliche Linien-Icons in einer Reihe statt Emoji-Chips
- Mannschaftskarten mit weicheren Rahmen; „Heim · “ / „Auswärts · “ statt Emoji
- Kleine Bewegungen beim Antippen und beim Wechsel der Ansichten (nicht bei „reduzierte Bewegung“)
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf grizzlys-u15-v28 erneuert
- Dokumentation und Versionsstand auf 1.7.0 aktualisiert

Version 1.6.7

Neu in Version 1.6.7
- „Fehler melden“ wurde zu Feedback & Fehler erweitert: Art der Meldung (Fehler, Wunsch / Anregung, Lob) mit passenden Texten und Dankes-Meldung
- Neuer Bereich „Neue Funktion“ in der Bereichsauswahl
- Admin-Bereich: „Rückmeldungen“ statt „Fehlermeldungen“, zusätzlicher Filter nach Art
- Neue Benachrichtigungsbilder: grizzlys-wunsch-icon.png und grizzlys-lob-icon.png; Fehler behalten grizzlys-bug-icon.png
- bug-report-notify.js: Push-Titel/-Bild und E-Mail-Betreff/-Bild richten sich nach der Art der Meldung (main.yml unverändert)
- firestore.rules: neues optionales Feld type (Fehler, Wunsch / Anregung, Lob)
- PWA-Cache auf grizzlys-u15-v28 erneuert
- Dokumentation und Versionsstand auf 1.6.7 aktualisiert

Version 1.6.6

Neu in Version 1.6.6
- Statistik im Admin-Bereich zeigt die Ergebnis-Pushes: Zeitpunkt, Ergebnis, Anzahl erreichter Geräte, fehlgeschlagene Zustellungen und aktuell registrierte Push-Geräte
- Workflow main.yml speichert Versandzeitpunkt und Zahlen im Ergebnis-Dokument und schreibt sie ins GitHub-Actions-Log
- Ältere Ergebnis-Pushes ohne gespeicherte Zahlen erscheinen als „Anzahl nicht erfasst“
- Aktualisieren-Button des Update-Hinweises robuster gemacht
- PWA-Cache auf grizzlys-u15-v26 erneuert
- Dokumentation und Versionsstand auf 1.6.6 aktualisiert

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
Sobald eine neue Version bereitsteht, erscheint unten ein Banner. „Aktualisieren“ lädt die neue Version, „×“ blendet den Banner bis zum nächsten App-Start aus. Bei jeder App-Änderung muss der Cache-Name in sw.js erhöht werden (aktuell grizzlys-u15-v29).

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
