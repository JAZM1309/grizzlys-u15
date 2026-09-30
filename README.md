# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

## Version 1.6.3

### Neu in Version 1.6.3

- Ergebnis-Push-Dienst korrigiert und zuverlässig an Firebase Cloud Messaging angebunden
- Eigenes Ergebnis-Push-Bild im Grizzlys-Stil eingebunden
- Eigenes Bild für die automatische 24-Stunden-Spielerinnerung vorbereitet und im Erinnerungsdienst hinterlegt
- Push-Bild und Fallback-Verhalten des Firebase Messaging Service Workers verbessert
- Fehlermeldungen wieder mit verpflichtendem Namen im Formular und in der Verwaltung
- Admin-Push-Token wird beim Admin-Login automatisch registriert, damit Admin-Benachrichtigungen funktionieren
- Fehler-E-Mail und Fehler-Push inklusive passendem Fehlermeldungsbild funktionieren wieder zusammen
- Direkter 📊 Analytics-Zugang im geschützten Admin-Bereich ergänzt; auf Android wird die installierte Google-Analytics-App bevorzugt geöffnet, alternativ die Analytics-Webseite
- Dokumentation und Versionsstand auf 1.6.3 aktualisiert

## Google Analytics

Google Analytics 4 ist für die App eingerichtet. Im geschützten Admin-Bereich gibt es den Button **📊 Analytics**, der auf Android bevorzugt die installierte Google-Analytics-App öffnet. Falls das direkte Öffnen nicht möglich ist, wird die Analytics-Webseite als Fallback geöffnet.

Im GA4-Dashboard werden unter anderem ausgewertet:

- Aktive Nutzer und neue Nutzer
- Wiederkehrende Nutzer
- Durchschnittliche Interaktionsdauer
- Sitzungen und Ereignisanzahl
- Betriebssystem und Gerätekategorie
- Stadt
- Seitenaufrufe
- App-Funktionen über eigene Ereignisse, z. B. Spielplan, Gegner, Downloads, Push und Hockey-Mini-Spiel

Der Zeitraum kann im Analytics-Dashboard z. B. auf Woche, Monat oder einen benutzerdefinierten Gesamtzeitraum gestellt werden.

## Version 1.6.1

### Neu in Version 1.6.1

- Fehlerbeschreibung im Meldeformular mit größerer Schrift, größerem Zeilenabstand und höherem Eingabefeld
- Robustere Geräte-/Installationsstatistik für Apple und Android
- Ältere Registrierungen können anhand gespeicherter Gerätedaten der passenden Plattform zugeordnet werden

## Version 1.6

### Neu in Version 1.6

- Fehler melden direkt aus der App
- Fehlerformular mit Bereich und Fehlerbeschreibung
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

- Bereich
- Beschreibung des Fehlers
- optional E-Mail-Adresse
- App-Version
- technische Geräte-/Browserinformationen
- Push-Registrierungsstatus, sofern verfügbar

Die Meldungen werden im Admin-Bereich angezeigt und können dort mit einem Status versehen werden.

## Veröffentlichung

Die App wird als kostenlose PWA über GitHub Pages veröffentlicht.

Repository:

`JAZM1309/grizzlys-u15`

Die README dient ausschließlich als Dokumentation des Projekts und ist nicht Bestandteil der sichtbaren App-Oberfläche.

### Neu in Version 1.6.3

- Eigenes Analytics-Dashboard direkt im geschützten Admin-Bereich
- Zeitraum-Auswahl: Heute, Woche, Monat, 30 Tage, Saison und Gesamt
- Kennzahlen für aktive/neue Nutzer, Sitzungen und Events
- Auswertung der wichtigsten App-Events, Geräte, Betriebssysteme, Seitenaufrufe und Städte
- Tagesverlauf der aktiven Nutzer
- Google Analytics bleibt die Datenquelle; Zugangsdaten werden nicht in der PWA gespeichert
