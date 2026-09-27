# ESV Grizzlys U15 App

## Version 1.5.7
- Gegneransicht 3.2 korrigiert: Die Spiele eines Gegners werden wieder vollständig angezeigt.
- Im geschützten Admin-Bereich wird jetzt die Anzahl der aktuell in Firebase gespeicherten Push-/FCM-Registrierungen angezeigt.
- Zusätzlich registriert die App beim Start eine technische Geräte-/Browser-Installation, sodass im Admin-Bereich die registrierten App-Installationen sowie Apple- und Android-Geräte gezählt werden können.
- Zusätzlich wird die letzte bekannte Push-Registrierung mit Datum und Uhrzeit angezeigt.
- Beim Aktivieren wird die Browser-Berechtigung ausdrücklich abgefragt und das von Firebase gelieferte FCM-Token anschließend in `pushTokens` gespeichert.
- Bei einem Fehler wird der konkrete Grund angezeigt, damit fehlende Browser-/Firebase-Berechtigungen leichter erkannt werden.
- Die Push-Statistik zählt gespeicherte FCM-Registrierungen, nicht Personen. Ein Nutzer kann mehrere Geräte registrieren.
- Ein separater Wert „Push deaktiviert“ wird bewusst nicht angezeigt, weil die App keine verlässliche Gesamtzahl aller Nutzer bzw. eine sichere Unterscheidung zwischen deaktivierten Benachrichtigungen und nicht registrierten Geräten kennt.
- Die Installationszahl ist eine technische Geräte-/Browser-Registrierung und keine exakte Zahl physisch installierter Apps. Eine Person kann mehrere Geräte registrieren; bei Löschen von Browserdaten oder Neuinstallation kann eine neue Registrierung entstehen.
- Gegner-Spiele bleiben mit Logos, Heim/Auswärts-Hinweis, U15-A/B-Kennzeichnung, Spielort, Ergebnis und Routenfunktion dargestellt.
- Im Info-Bereich gibt es einen Button „App teilen“. Auf Geräten mit nativer Teilen-Funktion wird der System-Dialog verwendet; andernfalls wird der App-Link zum Kopieren angeboten.
- Der Info-Bereich enthält jetzt eine kurze Beschreibung des App-Zwecks und eine kompakte Übersicht der wichtigsten Funktionen, damit die Seite übersichtlich bleibt.
- Die App-Seitenübersicht ist als PDF Bestandteil der Projekt-Dokumentation.
- Die Seitenübersicht wird bei zukünftigen relevanten App-Versionen gemeinsam mit dieser README aktualisiert.

## App-Seitenübersicht
Die aktuelle Übersicht liegt als PDF im Repository:
`App-Seitenuebersicht-Grizzlys-U15-Version1.5.7.pdf`

Die Nummerierung wird für weitere Änderungen verwendet:
- 1 – Start
- 1.1 – Nächstes Spiel
- 1.2 – Mannschaften
- 2 – Spielplan
- 2.1 – Chronologisch
- 2.2 – Kalender
- 2.3 – Filter
- 3 – Gegner
- 3.1 – Gegnerübersicht
- 3.2 – Spiele eines Gegners
- 3.3 – Spieldetails
- 4 – Downloads
- 4.5 – PDF-Filter
- 5 – Info
- 5.4 – Push
- 5.5 – Admin / Ergebnisverwaltung

## Version 1.5.6
- Gegneransicht überarbeitet.
- Spiele eines Gegners mit Logos, Heim/Auswärts-Hinweis und U15-A/B-Kennzeichnung dargestellt.
- Spielort, Ergebnis, Route und Spieldetails erhalten.

## Version 1.5.5
- Spielplanfilter als kompakte Filter-Schaltfläche umgesetzt.
- Mehrere Filter können gleichzeitig ausgewählt werden, z. B. U15 A + Heim.
- Filter funktionieren sowohl in der chronologischen Spielplanansicht als auch im Monatskalender.
- Filterauswahl wird übersichtlich zusammengefasst angezeigt.
- Filter können jederzeit auf „Alle Spiele“ zurückgesetzt werden.

## Version 1.5.4
- App-Version 1.5.4.
- Buttons zu den offiziellen Grizzlys-Teamseiten für U15 A und U15 B.
- Kompakte EHV-NRW-Links für die Tabellen von U15 A und U15 B.

## Dokumentation
Die README und die PDF-Seitenübersicht gehören zusammen und sollen bei zukünftigen relevanten Änderungen gemeinsam aktualisiert werden.

## Admin-Bereich
- Der geschützte Admin-Bereich ist übersichtlich in drei aufklappbare Bereiche gegliedert: Ergebnisverwaltung, Spieländerungen und App-Statistik.
- Es ist immer nur ein Bereich gleichzeitig geöffnet; beim Öffnen eines anderen Bereichs wird der zuvor geöffnete automatisch geschlossen.
- Die App-Statistik zeigt registrierte App-Installationen, Apple, Android, Push-Registrierungen sowie die jeweils letzte Registrierung.
- Beim Öffnen des Admin-Bereichs sind zunächst alle drei Bereiche eingeklappt. Beim Öffnen eines Bereichs wird ein bereits geöffneter anderer Bereich automatisch geschlossen.

## Firebase-Regel für App-Statistik
Damit der Admin-Bereich die neue App-Statistik lesen kann, muss innerhalb von `match /databases/{database}/documents` zusätzlich dieser Block vorhanden sein. Die bestehenden Regeln für andere Collections bleiben unverändert:

```javascript
match /appInstallations/{installationId} {
  allow create, update:
    if request.resource.data.installationId == installationId;

  allow read:
    if request.auth != null
    && request.auth.uid == "q6AID4Wkp2arQlCTROTKqON6ckk2";

  allow delete: if false;
}
```

Die bereits vorhandene Regel für `pushTokens` muss dem Admin ebenfalls `read` erlauben, damit die Push-Zahl angezeigt werden kann.
