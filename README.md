# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

## Version 1.9.1

### Neu in Version 1.9.1 (Stand 1.9.1.66)

- **Spielkarten zum Aufklappen:** jede Karte zeigt links einen Datumsblock (blau U15 A, orange U15 B) und rechts die Paarung mit Logos; ein Tipp klappt die Details als Blöcke aus: Tabellenplatz und Form je Team, Halle mit Adresse, Entfernung und Route-Knopf, Termin / Erinnerung / Teilen, bei gespielten Spielen zusätzlich die Drittel. Der Datumsbalken läuft beim Aufklappen bis zum Kartenende durch. Immer nur eine Karte ist offen; im Spielplan ist das nächste Spiel beim Öffnen aufgeklappt
- **Teamfarbe seitlich:** alle Spielkarten haben links einen Streifen in Teamfarbe; die Wasserzeichen A und B bleiben
- **Startseite:** „Nächstes Spiel“ und „Letztes Spiel“ im selben Kartenstil mit Farbband oben (nächstes Spiel in Teamfarbe mit „Heute“ / „Morgen“ / „in x Tagen“, letztes Spiel grün Sieg, rot Niederlage, gelb Unentschieden); beide starten eingeklappt, das Aufklappen der einen klappt die andere zu
- **Kopfbereich:** „Nächstes Spiel in … Tagen“ steht nur noch rechts in der schmalen Leiste beim Scrollen; oben sitzt neu das News-Symbol
- **„Ergebnis teilen“:** teilt bei gespielten Spielen den Endstand mit Dritteln statt der Spielinformationen
- **Bilder für Social Media (Downloads):** für alle Nutzer im Downloadbereich: Spieltagsbild ab 5 Tage vor dem Spiel bis Spielende, Ergebnisbild ab Eintrag des Ergebnisses bis 5 Tage nach dem Spiel; im Admin-Bereich heißt der Abschnitt jetzt „Social-Media-Bilder“
- **News-Bereich:** Symbol oben mit roter Zahl für Ungelesenes; Fenster „Neuigkeiten“ mit Hinweisen (Freitext aus dem Admin-Bereich), Spieländerungen (automatisch aus `scheduleOverrides`, mit altem und neuem Termin) und „Neu in der App“ (Liste `APP_NEWS` in `index.html`). Der neueste ungelesene Hinweis oder die neueste Spieländerung erscheint als Streifen auf der Startseite
- **Hinweise schreiben (Admin):** Abschnitt „Hinweise / News“ mit Überschrift, Text, Mannschaft, „Sichtbar bis“ und Haken „Zusätzlich als Push senden“; veröffentlichte Hinweise können gelöscht werden
- **Neue Cloud Function:** `functions/news.js` (`onNewsCreated`) verschickt den Push zu einem Hinweis, wenn der Haken gesetzt ist (beachtet die Mannschaftsauswahl der Geräte); `functions/index.js` um eine Zeile ergänzt
- **Firestore-Regeln:** neue Sammlung `news` (für alle lesbar, nur Admin schreibt) – Regeln müssen veröffentlicht werden
- **PWA-Cache:** auf `grizzlys-u15-v66` erneuert
- **Dokumentation:** README, `FUNCTIONS-ANLEITUNG.txt` und PDF `Grizzlys-U15-App-Seitenuebersicht.pdf` auf 1.9.1 aktualisiert

## Version 1.9.0

### Neu in Version 1.9.0 (Stand 1.9.0.65)

- **Schreibweise der Version:** Die Version heißt jetzt z. B. `1.9.0.65`: vorn die App-Version, die letzte Zahl ist die Cache-Nummer zum Vergleich von Test und Live (bisher `1.8.0-v51`)
- **Tabellenstand vom EHV NRW:** Platz, Spiele, Punkte und Tordifferenz als kleiner Chip unter jeder Paarung (Startseite, Spielplan, Spieldetails, Gegner-Details) und in der Gegnerübersicht; darunter die Form der letzten fünf Ligaspiele als Punkte (grün Sieg, rot Niederlage, Rand = Entscheidung nach Verlängerung/Penaltyschießen)
- **Drittelergebnisse:** stehen unter jedem Endergebnis, sofern der EHV-Endstand zum eingetragenen Ergebnis passt
- **Neue Spielkacheln:** kommende Spiele kompakt (Kopfzeile mit Team, Heim/Auswärts, Datum und Uhrzeit; Ort und Aktionen als Symbole in einer Fußzeile), gespielte Spiele als flache Ergebniskachel (Tipp öffnet die Spieldetails); gleicher Stil in Spieldetails, Gegner-Details und bei „Nächstes Spiel“
- **Kurznamen in den Kacheln:** U15 A „Grizzlys / Young Cats“, U15 B „Grizzlys B“ (Kalenderdateien, Teilen und PDF behalten den vollen Namen)
- **Schulferien NRW:** im Kalender grün hinterlegt, mit Legende über dem Monat (Termine 2026/27 als Liste `nrwFerien` in `index.html`; für die nächste Saison dort neu eintragen)
- **Ergebnisse automatisch:** Cloud Function `autoResults` trägt beendete Grizzlys-Spiele alle 30 Minuten vom EHV ein; der Ergebnis-Push geht wie bei einem Handeintrag raus (nur für Spiele der letzten 2 Tage), von Hand eingetragene Ergebnisse werden nie überschrieben
- **Spielplan-Abgleich:** Cloud Function `scheduleWatch` vergleicht alle 3 Stunden den Spielplan der App mit dem des EHV und meldet neue Abweichungen per Push an die Admin-Geräte; im Admin-Bereich unter „Spieländerungen“ gibt es den Knopf „Mit EHV-Spielplan abgleichen“ (`scheduleCheck`) mit „Ins Formular übernehmen“
- **Instagram-Bilder (Admin):** neuer Abschnitt im Admin-Bereich: erzeugt pro Spiel ein Bild 1080 × 1350 (Ankündigung oder Ergebnis) mit Hallenfoto, großen Logos und Vorschau; Teilen oder Speichern, es wird nichts automatisch gepostet
- **Ordner `logos`:** alle Gegner-Logos kommen jetzt aus dem Ordner `logos/` (Dateinamen siehe `logos/LIESMICH.txt`); fehlt eine Datei, lädt die App das Logo wie bisher von der alten Adresse, im Instagram-Bild steht dann ein Kürzel
- **Neue Cloud Functions:** `functions/standings.js` (`standings`: Tabelle und beendete Spiele, höchstens alle 30 Minuten vom EHV, nur für `jazm1309.github.io`) und `functions/ehv-sync.js` (`autoResults`, `scheduleCheck`, `scheduleWatch`); `functions/index.js` um vier Zeilen ergänzt. Die App fragt den EHV-Dienst nie direkt ab
- **Unverändert:** Firestore-Regeln, `push.js`, Manifest und App-Symbole
- **PWA-Cache:** auf `grizzlys-u15-v65` erneuert
- **Dokumentation:** README (Abschnitte EHV-Daten, Logos, Instagram-Bilder, Firebase, Push) und die PDF `Grizzlys-U15-App-Seitenuebersicht.pdf` auf 1.9.0 aktualisiert

## Version 1.8.0

### Neu in Version 1.8.0

- **Kopfbereich aufgewertet:** Eis-Atmosphäre (ziehender Eisnebel, funkelnder Eisstaub, leuchtende Bandenlinie unten, Schein ums Logo), „Saison“-Abzeichen mit Puck-Symbol
- **Live-Status im Kopfbereich:** „Nächstes Spiel in x Tagen · U15 A“, am Vortag „Morgen 10:30 Uhr“, am Spieltag pulsierend **„GAMEDAY · 10:30 Uhr“** (bei zwei Spielen beide Zeiten)
- **Mini-Leiste beim Scrollen:** schmale Leiste mit kleinem Logo, Titel und Kurzstatus („Gameday“ / „in 5 Tagen“); die Tabs bleiben darunter sichtbar, die Filterleiste im Spielplan rutscht entsprechend mit; Tipp auf die Leiste scrollt nach oben
- **Halloween-Design** in Schwarz und Orange, automatisch vom 20.10. bis 2.11. (danach schaltet sich die App von selbst wieder auf das normale Design zurück)
- Schalter „Halloween-Design“ in den Einstellungen (nur im Halloween-Zeitraum sichtbar), Auswahl wird auf dem Gerät gemerkt
- Halloween-Bär als Logo im Kopfbereich (`halloween-logo.png`), Kürbis neben dem Titel, Spinnennetz und fliegende Fledermäuse im Header
- Schließbarer Gruß „Happy Halloween – Zeit für Spuk auf dem Eis“ (wünscht das Grizzlys-Team) auf der Startseite
- Abzeichen „Halloween-Spiel“ beim Spiel am 31.10. (Spielliste, Nächstes/Letztes Spiel, Spiel-Details); die Karte dieses Spiels ist besonders gruselig: dunkel mit orange pulsierendem Leuchten, Spinnennetz, Geistern, Kürbis und blinzelnden roten Augen
- Der Button zum Hockey Mini-Spiel wird zum gruseligen „Gruselspiel“-Button (dunkel, pulsierender Rand, Spinnennetz, Geist, blinzelnde Augen). Das Mini-Spiel selbst wird im Halloween-Zeitraum zum **Gruselspiel**: dunkles Spielfeld mit Nebel, Spinne, Fledermaus und leuchtenden Augen, Kürbis gegen Geist, neue Gruseltexte, Gewinnlinie leuchtet, bei einer Niederlage wackelt und blitzt es kurz
- Hockey Mini-Spiel aufgewertet: Eisfläche mit Banden, Werbebanden und Anspielkreis, Anzeigetafel mit Serienstand und Torlampe, Puck- und Schläger-Figuren mit Einrutsch-Animation und Eisspray, Gewinnlinie leuchtet, „TOOOR!“ mit Konfetti und Vibration
- Mini-Spiel mit neuen Regeln: Serie „Best of 5“, drei Schwierigkeitsstufen (Anfänger, Profi, Torwart), drei Strafzeiten pro Runde (sperren ein Feld für den Gegner für 2 Züge) und Pokale (Hattrick, Serie gewonnen, Torwart bezwungen), die lokal auf dem Gerät gespeichert werden
- Gruselspiel im Halloween-Zeitraum mit Hallenlicht aus: Kürbis-Pucks, Geister, orange Torlampe, Fledermaus- und Kürbis-Konfetti
- Button zum Mini-Spiel aufgewertet: Eishallen-Look mit Lichtreflex, wippendem Puck-Symbol, „NEU“-Banderole, Mini-Spielfeld mit leuchtender Gewinnreihe und Pokal-Zähler (z. B. 🏆 1/3)
- Neuer Bereich **Einstellungen** (Zahnrad-Symbol im Kopfbereich neben dem Info-Symbol): Darstellung Hell / Dunkel / Automatisch (folgt dem Handy), Halloween-Schalter, Push-Anmeldung, Feedback & Fehler und Admin-Bereich. Diese Punkte stehen nicht mehr unten auf jeder Seite bzw. in der Info
- Dunkelmodus für alle Seiten, Fenster und das Minispiel; die Auswahl wird auf dem Gerät gespeichert (Standard: Hell). Das Halloween-Design hat Vorrang, solange es aktiv ist
- Slogan „Ein Team – zwei starke Mannschaften“ im Kopfbereich rechts neben dem Titel, in sauberer Pinsel-Handschrift (Schrift Permanent Marker, direkt in der App eingebettet, funktioniert offline) mit blauem Pinselstrich; im Halloween-Design orange; auf sehr schmalen Handys kleiner bzw. ausgeblendet
- Die angezeigte App-Version (Einstellungen/Info und Fehlermeldungen) enthält jetzt die Cache-Nummer, z. B. `1.8.0-v51`; so lassen sich Test- und Live-Stand genau vergleichen. Die Testversion zeigt sie zusätzlich im orangen Balken
- Aufgeräumt: nicht mehr genutzte Dateien entfernt (alte Übersichts-PDFs, ungenutzte Symbole, Mini-Spiel-Banner, `analytics-test.html`); statt der Versions-PDFs gibt es jetzt eine einzige PDF `Grizzlys-U15-App-Seitenuebersicht.pdf` (Aufbau der Seiten und Verknüpfungen, ohne Versionsnummer)
- Der Slogan im Kopfbereich wird beim Start Zeile für Zeile „geschrieben“ (der blaue Pinselstrich zeichnet sich zuletzt); bei aktivierter Bewegungsreduzierung erscheint er sofort
- Bereich „Push aktivieren“ (Einstellungen) neu gestaltet: klingelnde Glocke, Beispiel-Meldungen (Ergebnis und 24-Stunden-Erinnerung), drei Vorteile, großer Button und Statusanzeige (Aus / Aktiv / Blockiert / Nicht möglich) mit passendem Hinweis, auch für Dunkelmodus und Halloween. Die Anmeldung selbst ist unverändert
- PDF-Auswahl (Downloads) im neuen Chip-Design wie die Kalender-Auswahl: Gruppen „Umfang“, „Mannschaft“ (mit blauem/orangem Punkt) und „Spielort“, auch im Dunkelmodus
- Feedback-Bereich überarbeitet: Karte „Deine Meinung zählt“ mit Schnellauswahl (Fehler / Idee / Lob), Meldeformular mit Art-Umschalter, Zeichenzähler und Hinweis zum Datenschutz
- Admin: Ergebnisverwaltung und Spieländerungen zeigen die aktuellen bzw. nächsten Spiele oben (Ergebnisse: nach Nähe zum heutigen Tag, Spieländerungen: kommende zuerst, danach vergangene)
- Info-Seite im App-Stil überarbeitet (Kopfbereich mit Logo und Version, Funktionskacheln, Teamseiten-Karte)
- „Heute“-Button im Spielplan scrollt jetzt so weit, dass die Spielkachel nicht mehr vom Menü verdeckt wird
- Fehlermeldungs-Dienst (GitHub Action): beendet sich jetzt sauber und hat ein Zeitlimit von 4 Minuten – keine „All jobs were cancelled“-E-Mails mehr
- Push getrennt wählbar: Nutzer können in den Einstellungen Ergebnisse und 24-Stunden-Erinnerung sowie U15 A und U15 B einzeln ein-/ausschalten (neues Feld `prefs` in `pushTokens`; Firestore-Regeln und `main.yml` angepasst – Regeln müssen veröffentlicht werden)
- Ergebnis-Push und 24h-Erinnerung als Cloud Functions (`functions/push.js`: `onResultWritten` sofort, `sendGameReminders` alle 10 Minuten); Functions auf Node 22; GitHub-Workflow „Grizzlys Ergebnisdienst“ kann nach erfolgreichem Test abgeschaltet werden (siehe `FUNCTIONS-ANLEITUNG.txt`)
- Fledermäuse im Dankesfenster nach einer Rückmeldung
- Optional: Halloween-App-Symbole im Ordner `halloween-app-symbol` (siehe `ANLEITUNG.txt` darin)
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v51` erneuert
- Dokumentation und Versionsstand auf 1.8.0 aktualisiert

## Version 1.7.2

### Neu in Version 1.7.2

- Startseite: Karte „Nächstes Spiel“ kompakter (weniger Höhe, Adresszeile entfällt, kleinere Aktions-Icons)
- Neue Karte „Letztes Spiel“: zuletzt gespieltes Spiel mit Ergebnis, Sieg/Niederlage/Unentschieden-Label und Farbstreifen; Tipp öffnet die Spiel-Details. Liegt noch kein Ergebnis vor, steht „Ergebnis folgt“
- Mannschaftskacheln überarbeitet: Bilanz (Siege/Unentschieden/Niederlagen/Tore), Formpunkte der letzten 5 Spiele, Fortschrittsbalken „x von y Spielen gespielt“, nächster Gegner mit Logo, Buchstaben-Wasserzeichen und Farbverlauf in der Teamfarbe
- Kachel-Design (Farbverlauf, Buchstaben-Wasserzeichen, Farbstreifen) jetzt auch bei Spielkarten, Gegnerkarten, „Nächstes Spiel“, „Letztes Spiel“ und den Downloads
- Downloads: ein Button „Kalender herunterladen“ mit Auswahl (Mannschaft, Heim/Auswärts, ganze Saison oder nur kommende Spiele) statt drei fester Kalender-Buttons
- Alle Werte werden aus den vorhandenen Ergebnissen berechnet; Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v30` erneuert
- Dokumentation und Versionsstand auf 1.7.2 aktualisiert

## Version 1.7.1

### Neu in Version 1.7.1

- Das moderne Layout aus 1.7.0 gilt jetzt auch auf **Spielplan, Gegner, Downloads und Info**
- Spielplan: Umschalter „Chronologisch / Kalender“ als Segment-Schalter mit Icons, Filter- und „Heute“-Button mit Icons, Tabellen-Links als Chips, Monatsüberschriften leiser, Spielkarten mit weichem Schatten und Mannschaftsfarbe am Rand
- Spielkarten: Logos über den Namen, große Uhrzeit, Heim-/Auswärts-Label, Aktionen (Route, Termin, Erinnerung, Teilen) als Icon-Reihe; „Nächstes Spiel“ hervorgehoben
- Spiel-Details (Fenster): Emoji durch Linien-Icons ersetzt
- Gegner: Suchfeld mit Lupe, Gegnerkarten mit Farbstreifen und Route-Button mit Icon
- Downloads: Kalender-/PDF-Einträge mit runden Icons und Pfeil
- Info: weichere Karten, Überschriften mit Icons, Teamseiten als farbige Chips, Buttons mit Icons
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v29` erneuert
- Dokumentation und Versionsstand auf 1.7.1 aktualisiert

## Version 1.7.0

### Neu in Version 1.7.0

- Modernisierte Optik ohne Änderung an Farben, Logos, Menü und Funktionen
- Kopfbereich mit Stadionbild kompakter (kleineres Logo und weniger Höhe), das nächste Spiel steht dadurch höher
- Karte „Nächstes Spiel“: leiserer Titel, Teamlabel oben rechts, Uhrzeit groß, weiche Schatten statt harter Rahmen
- Spielpaarung aufgeräumt: Logos über den Namen, „VS“ in der Mitte, langer SpG-Name bricht nicht mehr über viele Zeilen
- Aktionen (Route, Termin, Erinnerung, Teilen) als einheitliche Linien-Icons in einer Reihe statt Emoji-Chips; Standort-Symbol als Linien-Icon
- Mannschaftskarten mit weicheren Rahmen und Schatten; „Heim · “ / „Auswärts · “ statt Emoji
- Kleine Bewegungen: Karten und Buttons reagieren beim Antippen, Ansichten blenden sanft ein (nicht bei „reduzierte Bewegung“)
- Versandlogik, Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v28` erneuert
- Dokumentation und Versionsstand auf 1.7.0 aktualisiert

## Version 1.6.7

### Neu in Version 1.6.7

- „Fehler melden“ wurde zu **Feedback & Fehler** erweitert: Auswahl der Art der Meldung (🐞 Fehler, 💡 Wunsch / Anregung, 👍 Lob) mit passenden Texten, Platzhaltern und Dankes-Meldung
- Neuer Bereich „Neue Funktion“ in der Bereichsauswahl
- Admin-Bereich: „Fehlermeldungen“ heißt jetzt **Rückmeldungen** und lässt sich zusätzlich nach Art filtern; jede Meldung zeigt Symbol und Art
- Neue Benachrichtigungsbilder: `grizzlys-wunsch-icon.png` (Wunsch & Anregungen) und `grizzlys-lob-icon.png` (Lob); Fehler behalten `grizzlys-bug-icon.png`
- `bug-report-notify.js`: Push-Titel, Push-Bild, E-Mail-Betreff, E-Mail-Bild und Überschriften richten sich nach der Art der Meldung (Ergebnis- und Erinnerungs-Push in `main.yml` unverändert)
- `firestore.rules`: neues optionales Feld `type` (erlaubt: Fehler, Wunsch / Anregung, Lob); Meldungen ohne `type` zählen als Fehler
- PWA-Cache auf `grizzlys-u15-v28` erneuert
- Dokumentation und Versionsstand auf 1.6.7 aktualisiert

## Version 1.6.6

### Neu in Version 1.6.6

- Statistik im Admin-Bereich zeigt jetzt die Ergebnis-Pushes: Zeitpunkt, Ergebnis, Anzahl erreichter Geräte („an 12 von 14 Geräten“), fehlgeschlagene Zustellungen sowie die aktuell registrierten Push-Geräte
- Der Workflow `main.yml` schreibt Versandzeitpunkt und Zahlen (`pushSentCount`, `pushFailedCount`, `pushTargetCount`) ins Ergebnis-Dokument und gibt sie im GitHub-Actions-Log aus
- Ältere Ergebnis-Pushes ohne gespeicherte Zahlen erscheinen als „Anzahl nicht erfasst“
- Aktualisieren-Button des Update-Hinweises robuster gemacht (Rückmeldung, mehrere Auslöser, automatischer Neustart nach 2,5 Sekunden)
- PWA-Cache auf `grizzlys-u15-v26` erneuert
- Dokumentation und Versionsstand auf 1.6.6 aktualisiert

## Version 1.6.5

### Neu in Version 1.6.5

- Update-Hinweis in der App: Sobald eine neue Version bereitsteht, erscheint unten ein dezenter Banner „Neue Version verfügbar“ mit den Buttons **Aktualisieren** und **Schließen**
- Die App prüft beim Zurückkehren in den Vordergrund sowie alle 30 Minuten, ob eine neue Version vorliegt
- Der Service Worker aktiviert eine neue Version erst nach Tippen auf „Aktualisieren“ (kein automatisches Umschalten mehr mitten in der Nutzung)
- Schließen blendet den Banner bis zum nächsten App-Start aus
- PWA-Cache auf `grizzlys-u15-v25` erneuert
- Dokumentation und Versionsstand auf 1.6.5 aktualisiert

## Version 1.6.4

### Neu in Version 1.6.4

- U15 A als Spielgemeinschaft „SpG ESV Grizzlys Bergkamen / ESC Rheine Young Cats“ ergänzt, inklusive Young-Cats-Logo in den Spieldarstellungen
- Integriertes Google-Analytics-Statistikdashboard direkt im geschützten Admin-Bereich
- Zeitraum-Auswahl im Statistikdashboard: Heute, Diese Woche, Dieser Monat, 30 Tage, Saison und Gesamt
- Kennzahlen für aktive Nutzer, neue Nutzer, Sitzungen und Events
- Tagesverlauf der aktiven Nutzer
- Auswertungen zu Events, Geräten, Betriebssystemen, Seitenaufrufen und Städten
- Analytics-Daten werden über eine geschützte Firebase Cloud Function aus der Google Analytics Data API geladen
- Google-Analytics-Zugangsdaten werden nicht im PWA-Frontend gespeichert
- Analytics-Tagesbeschriftungen im Diagramm korrigiert
- PWA-Cache für aktualisierte Analytics-Anzeige erneuert
- Ergebnis-Push-Dienst korrigiert und zuverlässig an Firebase Cloud Messaging angebunden
- Eigenes Ergebnis-Push-Bild im Grizzlys-Stil eingebunden
- Eigenes Bild für die automatische 24-Stunden-Spielerinnerung vorbereitet und im Erinnerungsdienst hinterlegt
- Push-Bild und Fallback-Verhalten des Firebase Messaging Service Workers verbessert
- Fehlermeldungen wieder mit verpflichtendem Namen im Formular und in der Verwaltung
- Admin-Push-Token wird beim Admin-Login automatisch registriert, damit Admin-Benachrichtigungen funktionieren
- Fehler-E-Mail und Fehler-Push inklusive passendem Fehlermeldungsbild funktionieren wieder zusammen
- Dokumentation und Versionsstand auf 1.6.4 aktualisiert

## Google Analytics

Google Analytics 4 ist die Datenquelle für das geschützte Statistikdashboard.

Im Admin-Bereich gibt es den Button **📊 App-Statistik**. Dort können die Nutzungsdaten direkt innerhalb der App ausgewertet werden.

Das Dashboard zeigt unter anderem:

- Aktive Nutzer
- Neue Nutzer
- Sitzungen
- Events
- Tagesverlauf der aktiven Nutzer
- Nutzung bzw. wichtige App-Events
- Gerätekategorien
- Betriebssysteme
- Seitenaufrufe
- Städte

Verfügbare Zeiträume:

- Heute
- Diese Woche
- Dieser Monat
- 30 Tage
- Saison
- Gesamt

Die Daten werden serverseitig über eine Firebase Cloud Function und die Google Analytics Data API abgefragt. Zugangsdaten werden nicht in der PWA gespeichert.

## Version 1.6.1

### Neu in Version 1.6.1

- Fehlerbeschreibung im Meldeformular mit größerer Schrift, größerem Zeilenabstand und höherem Eingabefeld
- Robustere Geräte-/Installationsstatistik für Apple und Android
- Ältere Registrierungen können anhand gespeicherter Gerätedaten der passenden Plattform zugeordnet werden

## Version 1.6

### Neu in Version 1.6

- Fehler melden direkt aus der App
- Fehlerformular mit Bereich und Fehlerbeschreibung
- Verpflichtende Namensangabe bei einer Fehlermeldung
- Optionales Feld für eine E-Mail-Adresse zur Rückfrage
- Automatische Übermittlung der App-Version und technischer Gerätedaten
- Push-Status kann bei einer Fehlermeldung mitübermittelt werden
- Zentrale Speicherung der Fehlermeldungen in Firebase
- Fehlermeldungen im geschützten Admin-Bereich
- Anzeige der Anzahl offener Fehlermeldungen
- Statusverwaltung: Neu, In Bearbeitung, Erledigt
- Hockey Tic-Tac-Toe als Minispiel
- Push-Registrierungen und App-Installationen im Admin-Bereich

## Vorherige Funktionen

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

## Update-Hinweis

Wenn eine neue App-Version veröffentlicht wurde, lädt der Service Worker sie im Hintergrund und wartet. Die App zeigt dann unten den Banner „Neue Version verfügbar“.

- **Aktualisieren** aktiviert die neue Version und lädt die App neu
- **×** blendet den Banner bis zum nächsten App-Start aus

Technisch: `index.html` erkennt eine wartende Version über den Service-Worker-Status, `sw.js` aktiviert sie erst nach der Nachricht `SKIP_WAITING`. Bei jeder App-Änderung muss der Cache-Name in `sw.js` erhöht werden (aktuell `grizzlys-u15-v66`).

Die angezeigte Version hat die Form `1.9.1.66`: vorn die App-Version, die letzte Zahl ist die Cache-Nummer. Test- und Live-Stand mit derselben letzten Zahl sind inhaltlich gleich. Die Testversion (`grizzlys-u15-test`) zeigt die Nummer zusätzlich im orangen Balken und sperrt Speichern, Senden und Push-Anmeldung.

## Firebase

Firebase-Projekt: `grizzlys-u15`

Verwendete Firestore-Sammlungen:

- `results` – Spielergebnisse (von Hand oder automatisch vom EHV, dann mit `source: "ehv"`)
- `scheduleOverrides` – zentral geänderte Spieltermine
- `pushTokens` – registrierte Push-Geräte
- `gameReminders` – Erinnerungsdaten
- `appInstallations` – technische App-/Geräteregistrierungen
- `bugReports` – Fehlermeldungen aus der App
- `news` – Hinweise aus dem Admin-Bereich (Überschrift, Text, Mannschaft, sichtbar bis, Push ja/nein)
- `ehvSync` – merkt sich, welche Spielplan-Abweichungen schon gemeldet wurden (nur Cloud Function, kein Zugriff aus der App)

Ergebnisse und Fehlermeldungen werden über die vorgesehenen Firebase-Regeln geschützt. Schreib- und Verwaltungszugriffe im Admin-Bereich sind auf den eingerichteten Admin-Benutzer beschränkt.

## EHV-Daten (Tabelle, Ergebnisse, Spielplan)

Die App zeigt Tabellenplatz, Spiele, Punkte, Tordifferenz, die Form der letzten fünf Ligaspiele und Drittelergebnisse. Die Daten stammen vom Eishockeyverband NRW. Die App fragt den Dienst des Verbands nie direkt ab, sondern nur die eigenen Cloud Functions:

| Function | Datei | Aufgabe |
|---|---|---|
| `standings` | `functions/standings.js` | liefert Tabelle und beendete Spiele beider Ligen; holt sie höchstens alle 30 Minuten, antwortet nur `jazm1309.github.io` |
| `autoResults` | `functions/ehv-sync.js` | trägt alle 30 Minuten beendete Grizzlys-Spiele als Ergebnis ein (Ergebnis-Push nur für Spiele der letzten 2 Tage; Handeinträge werden nie überschrieben) |
| `scheduleWatch` | `functions/ehv-sync.js` | vergleicht alle 3 Stunden den Spielplan der App mit dem des EHV und meldet neue Abweichungen per Push an die Admin-Geräte |
| `scheduleCheck` | `functions/ehv-sync.js` | derselbe Vergleich auf Knopfdruck im Admin-Bereich („Mit EHV-Spielplan abgleichen“) |

- Die App speichert den Tabellenstand 15 Minuten auf dem Gerät und holt ihn nach jedem App-Update sofort neu.
- Fällt der Abruf aus, bleiben Chips, Form und Drittel weg; der Spielplan funktioniert unverändert.
- Liga-Kennungen: U15 A `21652` (Landesliga NRW), U15 B `21656` (Bezirksliga NRW). Sie stehen in `functions/standings.js` und müssen zur neuen Saison angepasst werden.
- Der Zugriffsschlüssel in `standings.js` ist der öffentliche Schlüssel der EHV-Seite.
- Deploy und Schalter: siehe `FUNCTIONS-ANLEITUNG.txt`.

## Logos

Alle Gegner-Logos liegen als Dateien im Ordner `logos/`. Die erwarteten Dateinamen stehen in `logos/LIESMICH.txt` und in `index.html` (`LOGO_FILES`). Fehlt eine Datei, lädt die App das Logo von der bisherigen Adresse (`logoUrls`); im Social-Media-Bild steht dann ein Kürzel. Ein Logo wird ersetzt, indem eine Datei mit demselben Namen hochgeladen wird.

## Social-Media-Bilder

Im Admin-Bereich erzeugt der Abschnitt „Social-Media-Bilder“ pro Spiel ein Bild im Beitragsformat 4:5 (1080 × 1350): „Ankündigung“ (Spieltag, Datum, Uhrzeit, Tabellen-Chips) oder „Ergebnis“ (Heimsieg / Auswärtssieg / Endstand, Drittel). Das Bild entsteht im Browser, wird in einer Vorschau gezeigt und kann geteilt oder gespeichert werden. Es wird nichts automatisch gepostet.

Im Downloadbereich stehen dieselben Bilder allen Nutzern zur Verfügung: das Spieltagsbild ab 5 Tage vor dem Spiel bis Spielende, das Ergebnisbild ab Eintrag des Ergebnisses bis 5 Tage nach dem Spiel (`INSTA_DAYS` in `index.html`).

## News

Das News-Symbol im Kopfbereich zeigt die Zahl ungelesener Einträge. Das Fenster „Neuigkeiten“ hat drei Abschnitte:

- **Hinweise:** Freitexte aus dem Admin-Bereich (Sammlung `news`); abgelaufene Hinweise („Sichtbar bis“) werden nicht mehr angezeigt
- **Spieländerungen:** kommen automatisch aus `scheduleOverrides` (neuer Termin bzw. Ort, dazu der alte); ein Tipp öffnet das Spiel
- **Neu in der App:** die Liste `APP_NEWS` in `index.html` – bei jedem Update dort die für Nutzer sichtbaren Neuerungen eintragen (neueste Version oben)

Was gelesen wurde, merkt sich jedes Gerät selbst. Der Push zu einem Hinweis kommt von der Cloud Function `onNewsCreated` (`functions/news.js`) und nur, wenn der Haken gesetzt ist.

## Schulferien

Die NRW-Ferien sind in der Kalenderansicht grün hinterlegt. Die Termine stehen als Liste `nrwFerien` in `index.html` (Schuljahr 2026/27) und müssen zur neuen Saison ersetzt werden.

## Push-Benachrichtigungen

Die Push-Funktion ist aktiv.

Sie wird verwendet für:

- neue Spielergebnisse
- automatische Erinnerung 24 Stunden vor einem Spiel
- Meldung an die Admin-Geräte bei einer neuen Abweichung zwischen App- und EHV-Spielplan
- Hinweise aus dem Admin-Bereich, wenn „Zusätzlich als Push senden“ gesetzt ist

Im Admin-Bereich werden die registrierten Push-Geräte gezählt. Zusätzlich werden App-Installationen nach Plattform angezeigt.

## Fehlermeldungen

Nutzer können einen Fehler direkt über **Info → Fehler melden** melden.

Eine Meldung kann enthalten:

- Name
- Bereich
- Beschreibung des Fehlers
- optional E-Mail-Adresse
- App-Version
- technische Geräte-/Browserinformationen
- Push-Registrierungsstatus, sofern verfügbar

Die Meldungen werden im Admin-Bereich angezeigt und können dort mit einem Status versehen werden. Fehler können zusätzlich per E-Mail und Push an den Admin gemeldet werden.

## Veröffentlichung

Die App wird als kostenlose PWA über GitHub Pages veröffentlicht.

Repository:

`JAZM1309/grizzlys-u15`

Die README dient ausschließlich als Dokumentation des Projekts und ist nicht Bestandteil der sichtbaren App-Oberfläche.
