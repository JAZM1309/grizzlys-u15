ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Version 1.9.0

Neu in Version 1.9.0 (Stand 1.9.0.65)
- Schreibweise der Version: Die Version heißt jetzt z. B. 1.9.0.65: vorn die App-Version, die letzte Zahl ist die Cache-Nummer zum Vergleich von Test und Live (bisher 1.8.0-v51)
- Tabellenstand vom EHV NRW: Platz, Spiele, Punkte und Tordifferenz als kleiner Chip unter jeder Paarung (Startseite, Spielplan, Spieldetails, Gegner-Details) und in der Gegnerübersicht; darunter die Form der letzten fünf Ligaspiele als Punkte (grün Sieg, rot Niederlage, Rand = Entscheidung nach Verlängerung/Penaltyschießen)
- Drittelergebnisse: stehen unter jedem Endergebnis, sofern der EHV-Endstand zum eingetragenen Ergebnis passt
- Neue Spielkacheln: kommende Spiele kompakt (Kopfzeile mit Team, Heim/Auswärts, Datum und Uhrzeit; Ort und Aktionen als Symbole in einer Fußzeile), gespielte Spiele als flache Ergebniskachel (Tipp öffnet die Spieldetails); gleicher Stil in Spieldetails, Gegner-Details und bei „Nächstes Spiel“
- Kurznamen in den Kacheln: U15 A „Grizzlys / Young Cats“, U15 B „Grizzlys B“ (Kalenderdateien, Teilen und PDF behalten den vollen Namen)
- Schulferien NRW: im Kalender grün hinterlegt, mit Legende über dem Monat (Termine 2026/27 als Liste nrwFerien in index.html; für die nächste Saison dort neu eintragen)
- Ergebnisse automatisch: Cloud Function autoResults trägt beendete Grizzlys-Spiele alle 30 Minuten vom EHV ein; der Ergebnis-Push geht wie bei einem Handeintrag raus (nur für Spiele der letzten 2 Tage), von Hand eingetragene Ergebnisse werden nie überschrieben
- Spielplan-Abgleich: Cloud Function scheduleWatch vergleicht alle 3 Stunden den Spielplan der App mit dem des EHV und meldet neue Abweichungen per Push an die Admin-Geräte; im Admin-Bereich unter „Spieländerungen“ gibt es den Knopf „Mit EHV-Spielplan abgleichen“ (scheduleCheck) mit „Ins Formular übernehmen“
- Instagram-Bilder (Admin): neuer Abschnitt im Admin-Bereich: erzeugt pro Spiel ein Bild 1080 × 1350 (Ankündigung oder Ergebnis) mit Hallenfoto, großen Logos und Vorschau; Teilen oder Speichern, es wird nichts automatisch gepostet
- Ordner logos: alle Gegner-Logos kommen jetzt aus dem Ordner logos/ (Dateinamen siehe logos/LIESMICH.txt); fehlt eine Datei, lädt die App das Logo wie bisher von der alten Adresse, im Instagram-Bild steht dann ein Kürzel
- Neue Cloud Functions: functions/standings.js (standings: Tabelle und beendete Spiele, höchstens alle 30 Minuten vom EHV, nur für jazm1309.github.io) und functions/ehv-sync.js (autoResults, scheduleCheck, scheduleWatch); functions/index.js um vier Zeilen ergänzt. Die App fragt den EHV-Dienst nie direkt ab
- Unverändert: Firestore-Regeln, push.js, Manifest und App-Symbole
- PWA-Cache: auf grizzlys-u15-v65 erneuert
- Dokumentation: README und die PDF Grizzlys-U15-App-Seitenuebersicht.pdf auf 1.9.0 aktualisiert

Version 1.8.0

Neu in Version 1.8.0
- Kopfbereich aufgewertet: Eisnebel, Eisstaub, leuchtende Bandenlinie, Saison-Abzeichen mit Puck
- Live-Status im Kopfbereich: Nächstes Spiel in x Tagen, Morgen 10:30 Uhr, am Spieltag GAMEDAY mit Uhrzeit
- Mini-Leiste beim Scrollen mit kleinem Logo, Titel und Kurzstatus; Tabs bleiben sichtbar
- Halloween-Design in Schwarz und Orange, automatisch vom 20.10. bis 2.11.
- Schalter Halloween-Design in den Einstellungen (nur im Halloween-Zeitraum sichtbar)
- Halloween-Bär als Logo im Kopfbereich (halloween-logo.png), Kürbis am Titel, Spinnennetz und Fledermäuse
- Schließbarer Gruß Happy Halloween – Zeit für Spuk auf dem Eis (wünscht das Grizzlys-Team) auf der Startseite
- Abzeichen Halloween-Spiel beim Spiel am 31.10.; die Karte dieses Spiels ist besonders gruselig (dunkel, pulsierendes Leuchten, Spinnennetz, Geister, Kürbis, blinzelnde Augen)
- Hockey Mini-Spiel wird zum Gruselspiel: dunkles Spielfeld mit Nebel, Spinne, Fledermaus und leuchtenden Augen, Kürbis gegen Geist, Gruseltexte, leuchtende Gewinnlinie, Wackeln und Blitz bei einer Niederlage
- Hockey Mini-Spiel aufgewertet: Eisfläche mit Banden, Werbebanden und Anspielkreis, Anzeigetafel mit Serienstand und Torlampe, Puck- und Schläger-Figuren mit Einrutsch-Animation und Eisspray, Gewinnlinie leuchtet, "TOOOR!" mit Konfetti und Vibration
- Mini-Spiel mit neuen Regeln: Serie "Best of 5", drei Schwierigkeitsstufen (Anfänger, Profi, Torwart), drei Strafzeiten pro Runde (sperren ein Feld für den Gegner für 2 Züge) und Pokale (Hattrick, Serie gewonnen, Torwart bezwungen), die lokal auf dem Gerät gespeichert werden
- Gruselspiel im Halloween-Zeitraum mit Hallenlicht aus: Kürbis-Pucks, Geister, orange Torlampe, Fledermaus- und Kürbis-Konfetti
- Button zum Mini-Spiel aufgewertet: Eishallen-Look mit Lichtreflex, wippendem Puck-Symbol, "NEU"-Banderole, Mini-Spielfeld mit leuchtender Gewinnreihe und Pokal-Zaehler (z. B. 1/3 Pokale)
- Neuer Bereich "Einstellungen" (Zahnrad-Symbol im Kopfbereich neben dem Info-Symbol): Darstellung Hell / Dunkel / Automatisch (folgt dem Handy), Halloween-Schalter, Push-Anmeldung, Feedback & Fehler und Admin-Bereich. Diese Punkte stehen nicht mehr unten auf jeder Seite bzw. in der Info
- Dunkelmodus fuer alle Seiten, Fenster und das Minispiel; die Auswahl wird auf dem Geraet gespeichert (Standard: Hell). Das Halloween-Design hat Vorrang, solange es aktiv ist
- Slogan "Ein Team - zwei starke Mannschaften" im Kopfbereich rechts neben dem Titel, in Pinsel-Handschrift (Schrift Permanent Marker, direkt in der App eingebettet, funktioniert offline) mit blauem Pinselstrich; im Halloween-Design orange; auf sehr schmalen Handys kleiner bzw. ausgeblendet
- Die angezeigte App-Version (Info und Fehlermeldungen) enthaelt jetzt die Cache-Nummer, z. B. 1.8.0-v51; so lassen sich Test- und Live-Stand genau vergleichen. Die Testversion zeigt sie zusaetzlich im orangen Balken
- Aufgeraeumt: nicht mehr genutzte Dateien entfernt (alte Uebersichts-PDFs, ungenutzte Symbole, Mini-Spiel-Banner, analytics-test.html); statt der Versions-PDFs gibt es jetzt eine einzige PDF Grizzlys-U15-App-Seitenuebersicht.pdf (Aufbau der Seiten und Verknuepfungen, ohne Versionsnummer)
- Der Slogan im Kopfbereich wird beim Start Zeile fuer Zeile "geschrieben" (der blaue Pinselstrich zeichnet sich zuletzt); bei aktivierter Bewegungsreduzierung erscheint er sofort
- Bereich "Push aktivieren" (Einstellungen) neu gestaltet: klingelnde Glocke, Beispiel-Meldungen (Ergebnis und 24-Stunden-Erinnerung), drei Vorteile, grosser Button und Statusanzeige (Aus / Aktiv / Blockiert / Nicht moeglich) mit passendem Hinweis, auch fuer Dunkelmodus und Halloween. Die Anmeldung selbst ist unveraendert
- PDF-Auswahl (Downloads) im neuen Chip-Design wie die Kalender-Auswahl: Gruppen "Umfang", "Mannschaft" (mit blauem/orangem Punkt) und "Spielort", auch im Dunkelmodus
- Feedback-Bereich überarbeitet: Karte „Deine Meinung zählt“ mit Schnellauswahl (Fehler / Idee / Lob), Meldeformular mit Art-Umschalter, Zeichenzähler und Hinweis zum Datenschutz
- Admin: Ergebnisverwaltung und Spieländerungen zeigen die aktuellen bzw. nächsten Spiele oben (Ergebnisse: nach Nähe zum heutigen Tag, Spieländerungen: kommende zuerst, danach vergangene)
- Info-Seite im App-Stil überarbeitet (Kopfbereich mit Logo und Version, Funktionskacheln, Teamseiten-Karte)
- „Heute“-Button im Spielplan scrollt jetzt so weit, dass die Spielkachel nicht mehr vom Menü verdeckt wird
- Fehlermeldungs-Dienst (GitHub Action): beendet sich jetzt sauber und hat ein Zeitlimit von 4 Minuten – keine „All jobs were cancelled“-E-Mails mehr
- Push getrennt wählbar: Nutzer können in den Einstellungen Ergebnisse und 24-Stunden-Erinnerung sowie U15 A und U15 B einzeln ein-/ausschalten (neues Feld `prefs` in `pushTokens`; Firestore-Regeln und `main.yml` angepasst – Regeln müssen veröffentlicht werden)
- Ergebnis-Push und 24h-Erinnerung als Cloud Functions (`functions/push.js`: `onResultWritten` sofort, `sendGameReminders` alle 10 Minuten); Functions auf Node 22; GitHub-Workflow „Grizzlys Ergebnisdienst“ kann nach erfolgreichem Test abgeschaltet werden (siehe `FUNCTIONS-ANLEITUNG.txt`)
- Fledermäuse im Dankesfenster nach einer Rückmeldung
- Optional: Halloween-App-Symbole im Ordner halloween-app-symbol (siehe ANLEITUNG.txt)
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf grizzlys-u15-v51 erneuert
- Dokumentation und Versionsstand auf 1.8.0 aktualisiert

Version 1.7.2

Neu in Version 1.7.2
- Startseite: Karte Nächstes Spiel kompakter (ohne Adresszeile, kleinere Icons)
- Neue Karte Letztes Spiel mit Ergebnis, Sieg/Niederlage/Unentschieden und Farbstreifen; Tippen öffnet die Spiel-Details
- Mannschaftskacheln: Bilanz, Tore, Formpunkte der letzten 5 Spiele, Fortschrittsbalken, nächster Gegner mit Logo, Farbverlauf in Teamfarbe
- Kachel-Design auch bei Spielkarten, Gegnerkarten, Nächstes/Letztes Spiel und Downloads
- Downloads: ein Button Kalender herunterladen mit Auswahl (Mannschaft, Heim/Auswärts, ganze Saison oder nur kommende Spiele)
- Werte werden aus den vorhandenen Ergebnissen berechnet; Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf grizzlys-u15-v30 erneuert
- Dokumentation und Versionsstand auf 1.7.2 aktualisiert

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
Sobald eine neue Version bereitsteht, erscheint unten ein Banner. „Aktualisieren“ lädt die neue Version, „×“ blendet den Banner bis zum nächsten App-Start aus. Bei jeder App-Änderung muss der Cache-Name in sw.js erhöht werden (aktuell grizzlys-u15-v51).

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
- results (von Hand oder automatisch vom EHV)
- scheduleOverrides
- pushTokens
- gameReminders
- appInstallations
- bugReports
- ehvSync (nur Cloud Function)

EHV-Daten
Tabelle, Form, Drittel, automatische Ergebnisse und Spielplan-Abgleich laufen über die Cloud Functions
standings (functions/standings.js) sowie autoResults, scheduleWatch und scheduleCheck (functions/ehv-sync.js).
Liga-Kennungen: U15 A 21652, U15 B 21656 (zur neuen Saison in standings.js anpassen).
Deploy und Schalter: siehe FUNCTIONS-ANLEITUNG.txt.

Logos
Alle Gegner-Logos liegen im Ordner logos (Dateinamen siehe logos/LIESMICH.txt). Fehlt eine Datei, lädt die
App das Logo von der bisherigen Adresse.

Instagram-Bilder
Admin-Bereich > Instagram-Bilder: erzeugt pro Spiel ein Bild 1080 x 1350 (Ankündigung oder Ergebnis) zum
Teilen oder Speichern. Es wird nichts automatisch gepostet.

Schulferien
NRW-Ferien im Kalender grün hinterlegt; Termine als Liste nrwFerien in index.html (2026/27).

Version
Schreibweise 1.9.0.65: vorn die App-Version, die letzte Zahl ist die Cache-Nummer zum Vergleich von Test und Live.

Veröffentlichung
Kostenlose PWA über GitHub Pages.
Repository: JAZM1309/grizzlys-u15
