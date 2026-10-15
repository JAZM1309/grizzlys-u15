ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Entwickelt von JAZM.

Version 1.9.1

Neu in Version 1.9.1 (Stand 1.9.1.110)
- Spielkarten zum Aufklappen: Datumsblock links (blau U15 A, orange U15 B), Paarung mit Logos; ein Tipp zeigt Tabellenplatz und Form je Team, Halle mit Route, Termin / Erinnerung / Teilen und bei gespielten Spielen die Drittel. Der Datumsbalken läuft beim Aufklappen durch. Immer nur eine Karte offen
- Teamfarbe seitlich an allen Spielkarten; Wasserzeichen A und B bleiben
- Startseite: Nächstes und letztes Spiel mit Farbband (Teamfarbe mit Heute / Morgen / in x Tagen bzw. grün Sieg, rot Niederlage, gelb Unentschieden); beide starten eingeklappt und klappen sich gegenseitig zu
- Kopfbereich: „Nächstes Spiel in … Tagen“ nur noch in der schmalen Leiste beim Scrollen; neu das News-Symbol
- „Ergebnis teilen“ teilt den Endstand mit Dritteln
- Downloads: Bilder für Social Media für alle (Spieltagsbild ab 5 Tage vorher, Ergebnisbild bis 5 Tage danach); Admin-Abschnitt heißt jetzt „Social-Media-Bilder“
- News-Bereich: Hinweise (Freitext aus dem Admin-Bereich), Spieländerungen (automatisch) und „Neu in der App“ (Liste APP_NEWS in index.html); Zähler für Ungelesenes, neuester Hinweis als Streifen auf der Startseite
- Admin: Abschnitt „Hinweise / News“ mit Mannschaft, Sichtbar bis und optionalem Push
- Neue Cloud Function functions/news.js (onNewsCreated) für den optionalen Push; functions/index.js um eine Zeile ergänzt
- Firestore-Regeln: neue Sammlung news – Regeln müssen veröffentlicht werden
- Halloween-Zeitraum jetzt 26.10. bis 2.11. (hwInSeason in index.html); neues Halloween-Logo
- Gameday: an Spieltagen steht oben im Kopfbereich groß „GAME DAY“; der Saison-Chip wird zum Countdown („Bully in 2:15 h“, „Läuft gerade“, danach Sieg/Niederlage/Remis oder „Ergebnis folgt“). Beim ersten Öffnen am Spieltag erscheint ein Startbild mit Logo, Paarung, Uhrzeit und Halle (einmal pro Tag, schließt per Tipp oder nach ca. 3,5 s). Farbe passt sich an: blau normal, orange Halloween, rot Weihnachten
- Halloween mit Bildern: Spielkarten mit Bildhintergründen und eisig leuchtendem Rand, dezente Augen/Krallen/Spinnennetz/Fledermäuse, Eisfläche als Kopfbild, Seitenhintergrund, Bodennebel, gelegentlicher Fledermaus-Schwarm, Mannschafts-Kacheln im Kartenstil; Bilder im Ordner halloween/ (Kleinschreibung beachten)
- Weihnachtsdesign: automatisch im Dezember bis 6. Januar (Schalter in den Einstellungen): Weihnachtslogo (christmas-logo.png, christmas-logo-gross.png), Eisfläche mit Tannenbaum im Kopfbereich, Tannenbaum als Seitenhintergrund, Spielkarten und Mannschafts-Kacheln mit Geschenke-Bildern, einzelne Geschenke als Deko, gelegentlich fliegt der Schlitten über die Seite; folgt der Einstellung Hell/Dunkel. Adventskalender mit 24 unsortierten Türchen und täglichem Quiz zu Regeln und Teamereignissen; Türchen öffnen sich erst ab dem jeweiligen Tag. Bilder im Ordner weihnachten/. Halloween hat Vorrang
- Gameday-Anzeige korrigiert (1.9.1.85): steht das Ergebnis schon fest, zeigt der Kopfbereich das Ergebnis statt „Läuft gerade“
- Tabellenstand schneller aktuell (1.9.1.86): die App fragt den Tabellenstand alle 5 Minuten neu ab (auch bei offener App), die Function standings holt höchstens alle 5 Minuten neu vom EHV (vorher 30 Minuten); functions/standings.js muss neu bereitgestellt werden
- Push-Status im Admin-Bereich (1.9.1.90): neuer Abschnitt „Push-Status“ ganz oben: zeigt, ob dieses Gerät als Admin für Push angemeldet ist (Berechtigung, Token, Eintrag in Firebase, Admin-Markierung, Zahl der Admin-Geräte). „Test-Push sofort senden“ zeigt bei offener App eine grüne Bestätigung, „In 10 Sekunden senden“ die echte Benachrichtigung (vorher zum Startbildschirm wechseln). Ungültige Admin-Einträge räumt der Test-Push selbst auf. Unter „Fehlersuche“: lokale Test-Benachrichtigung (ohne Firebase) und Diagnose (Service Worker, Push-Abo, Token)
- Push-Anmeldung wird erneuert (1.9.1.90): die App holt alle 7 Tage beim Öffnen ein neues Push-Abo und ein neues Token (renewPushRegistration in index.html, Zeitraum PUSH_RENEW_DAYS). Das behebt „tote“ Abos, bei denen Firebase den Versand annimmt, aber auf dem Gerät nichts ankommt. In den Einstellungen gibt es dafür unter dem Push-Knopf zusätzlich „Push kommt nicht an? Neu einrichten“. Alte Token-Einträge entfernt der nächste Push-Versand
- Neue Cloud Function (1.9.1.90): functions/pushtest.js (adminPushTest, nur für den Admin aufrufbar) verschickt den Test-Push an alle Admin-Geräte; functions/index.js um eine Zeile ergänzt
- Dunkles Design (1.9.1.90): aufgeklappte Abschnitte im Admin-Bereich haben wieder einen lesbaren Kopf
- Admin-Bereich neu (1.9.1.91): oben der Kasten „Zu tun“ (fehlende Ergebnisse, offene Rückmeldungen, EHV-Abweichungen, Spiele von heute, fehlender Admin-Push), darunter die Reiter Spiele · News · Feedback · Status. Im Reiter Spiele eine einzige kompakte Spielliste (Kommende / Gespielt / Alle, A/B); ein Tipp öffnet das Spiel-Fenster mit Ergebnis, Termin & Ort, Social-Media-Bildern und „News zu diesem Spiel“. EHV-Abweichungen bleiben stehen, bis sie übernommen oder abgelehnt werden; abgelehnte stehen in ehvSync/dismissed und werden auch vom Push (scheduleWatch) nicht mehr gemeldet. Push-Status (mit Test-Push und Fehlersuche) und App-Statistik liegen im Reiter Status. Neue Firestore-Regel für ehvSync; functions/ehv-sync.js geändert
- Push-Status aufklappbar (1.9.1.92): im Reiter Status ist der Push-Status zugeklappt; die Überschrift zeigt das Ergebnis der Prüfung als Zähler (z. B. „5 von 5 ✓“ grün oder „4 von 5 ✓ · 1 ✗“ rot), aufgeklappt stehen alle Prüfpunkte, Test-Push und Fehlersuche
- Nächste und letzte Spiele beider Mannschaften (1.9.1.94): die Startseite zeigt immer das nächste Spiel von U15 A und von U15 B als „Nächstes Spiel“ (oben das frühere) und ebenso das zuletzt gespielte Spiel beider Mannschaften als „Letztes Spiel“ (oben das neuere, ohne Ergebnis „Ergebnis folgt“), jeweils in Teamfarbe (1.9.1.93 zeigte nur zwei Spiele am selben Tag)
- Übersichtlicher (1.9.1.95): Spielplan zeigt gespielte Spiele zugeklappt („Gespielte Spiele anzeigen“, Zähler); Startseite ohne den alten Hinweis „38 Spiele · chronologisch sortiert“, Mannschafts-Kacheln kompakt nebeneinander (Platz, Bilanz, Form, Fortschritt); Einstellungen: Halloween und Weihnachten in einem Kasten „Saison-Designs“, die Beispiel-Meldungen verschwinden bei aktivem Push, Admin-Bereich nur noch als kleiner Link unten, „Push kommt nicht an? Neu einrichten“ nur bei aktivem Push; Info ohne die sechs Kacheln, die nur die Reiter wiederholten. News-Eintrag 1.9.1.95
- Admin-Fenster fest (1.9.1.96): das Admin-Fenster hat nach der Anmeldung immer die volle Höhe und springt beim Wechsel zwischen den Reitern nicht mehr; ist man nach unten gescrollt, beginnt der neue Reiter direkt unter der Reiterleiste
- Adventskalender-Auswertung (1.9.1.97): Admin-Bereich > Status > „Adventskalender“: Geräte, Antworten, richtig/falsch gesamt sowie getrennt nach Regel- und Mannschaftsfragen, aufklappbar je Türchen. Jedes Gerät überträgt dafür je Türchen nur Fragenart und richtig/falsch (neue Sammlung adventAnswers, keine Namen). Unter dem Kalender steht für jeden Nutzer „Deine Auswertung“. Firestore-Regeln müssen veröffentlicht werden
- Weihnachten und Dunkelmodus (1.9.1.98): Tannenbaum im Hintergrund dezenter; „Gespielte Spiele anzeigen“ im Dunkelmodus und in den Themen-Designs lesbar
- Update-Banner (1.9.1.98): erscheint nur noch, wenn die wartende Version wirklich neuer ist als die angezeigte; gleich neue Versionen werden still übernommen. Live- und Test-App löschen sich nicht mehr gegenseitig den Offline-Speicher
- Wischen (1.9.1.99–1.9.1.100): Wisch nach links/rechts wechselt zwischen Start, Spielplan, Gegner und Downloads; die Seite folgt dem Finger, am Rand erscheint die Zielseite, danach zeigen Punkte die Position. Senkrechtes Scrollen, Bildschirmrand (Android-Zurück-Geste) und offene Fenster lösen nichts aus
- Scroll-Leiste (1.9.1.101–1.9.1.102): beim Scrollen zeigt rechts eine schmale Leiste die Position, im Spielplan mit Monat; der Balken lässt sich anfassen und ziehen
- Zurückwischen (1.9.1.103): in Einstellungen und Info führt ein Wisch nach rechts zurück; das News-Fenster schließt sich mit einem Wisch nach rechts oder unten
- Kennzeichnung (1.9.1.104): „App entwickelt von JAZM“ unten auf der Info-Seite, „APP: JAZM“ klein auf den Social-Media-Bildern, Autor-Angabe im Code
- Halloween lesbar (1.9.1.105): Download-Karten im Halloween-Design (heller Modus) dunkel, damit die Schrift lesbar ist
- Updates sofort (1.9.1.106): der Service Worker holt Seite und Programmdateien immer frisch vom Server (nicht aus dem 10-Minuten-Zwischenspeicher von GitHub Pages)
- Gruselmoment (1.9.1.107): im Halloween-Design lugt höchstens einmal am Tag kurz eine Gestalt von unten herein (halloween/gestalt.webp); nicht anklickbar, nie über offenen Fenstern; eigener Schalter in den Einstellungen
- Kleinere Bilder (1.9.1.108): logo.png (2 MB → 58 KB), App- und Push-Symbole und große Gegner-Logos verkleinert, Dateinamen unverändert; die App lädt beim ersten Öffnen deutlich schneller
- Lesbarkeit (1.9.1.109): von der automatischen Prüfung gefundene Stellen verbessert (JAZM auf der Info-Seite, Plakette und Knöpfe im Weihnachtsdesign, Wochentag U15 B, Admin-Status dunkel)
- Veröffentlichen aus dem Admin-Bereich (1.9.1.110): Admin-Bereich > Status > Veröffentlichen mit den Knöpfen Test-Paket hochladen, Live gehen und Live zurücksetzen (Cloud Function deployControl + GitHub-Abläufe, mit Lesbarkeitsprüfung)
- Veröffentlichen mit dem Grizzlys-Werkzeug: Skripte in der Cloud Shell (~/grizzlys-werkzeug, Anleitung in LIESMICH.txt)
- PWA-Cache: auf grizzlys-u15-v109 erneuert

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
- Halloween-Design in Schwarz und Orange, automatisch vom 20.10. bis 2.11. (seit 1.9.1: ab 26.10.)
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
Sobald eine neue Version bereitsteht, erscheint unten ein Banner. „Aktualisieren“ lädt die neue Version, „×“ blendet den Banner bis zum nächsten App-Start aus. Bei jeder App-Änderung muss der Cache-Name in sw.js erhöht werden (aktuell grizzlys-u15-v86).

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
- news (Hinweise aus dem Admin-Bereich)
- ehvSync (nur Cloud Function)

EHV-Daten
Tabelle, Form, Drittel, automatische Ergebnisse und Spielplan-Abgleich laufen über die Cloud Functions
standings (functions/standings.js) sowie autoResults, scheduleWatch und scheduleCheck (functions/ehv-sync.js).
Liga-Kennungen: U15 A 21652, U15 B 21656 (zur neuen Saison in standings.js anpassen).
Deploy und Schalter: siehe FUNCTIONS-ANLEITUNG.txt.

Logos
Alle Gegner-Logos liegen im Ordner logos (Dateinamen siehe logos/LIESMICH.txt). Fehlt eine Datei, lädt die
App das Logo von der bisherigen Adresse.

Social-Media-Bilder
Admin-Bereich > Social-Media-Bilder: erzeugt pro Spiel ein Bild 1080 x 1350 (Ankündigung oder Ergebnis) zum
Teilen oder Speichern. Es wird nichts automatisch gepostet. Im Downloadbereich für alle: Spieltagsbild ab
5 Tage vor dem Spiel, Ergebnisbild bis 5 Tage nach dem Spiel.

News
News-Symbol im Kopfbereich mit Zähler. Hinweise (Sammlung news, im Admin-Bereich schreiben, optional mit Push
über onNewsCreated), Spieländerungen (automatisch aus scheduleOverrides) und „Neu in der App“ (APP_NEWS in
index.html, bei jedem Update ergänzen).

Schulferien
NRW-Ferien im Kalender grün hinterlegt; Termine als Liste nrwFerien in index.html (2026/27).

Version
Schreibweise 1.9.1.66: vorn die App-Version, die letzte Zahl ist die Cache-Nummer zum Vergleich von Test und Live.

Veröffentlichung
Kostenlose PWA über GitHub Pages.
Repository: JAZM1309/grizzlys-u15
