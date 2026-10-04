# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

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

Technisch: `index.html` erkennt eine wartende Version über den Service-Worker-Status, `sw.js` aktiviert sie erst nach der Nachricht `SKIP_WAITING`. Bei jeder App-Änderung muss der Cache-Name in `sw.js` erhöht werden (aktuell `grizzlys-u15-v30`).

## Firebase

Firebase-Projekt: `grizzlys-u15`

Verwendete Firestore-Sammlungen:

- `results` – Spielergebnisse
- `pushTokens` – registrierte Push-Geräte
- `gameReminders` – Erinnerungsdaten
- `appInstallations` – technische App-/Geräteregistrierungen
- `bugReports` – Fehlermeldungen aus der App

Ergebnisse und Fehlermeldungen werden über die vorgesehenen Firebase-Regeln geschützt. Schreib- und Verwaltungszugriffe im Admin-Bereich sind auf den eingerichteten Admin-Benutzer beschränkt.

## Push-Benachrichtigungen

Die Push-Funktion ist aktiv.

Sie wird verwendet für:

- neue Spielergebnisse
- automatische Erinnerung 24 Stunden vor einem Spiel

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
