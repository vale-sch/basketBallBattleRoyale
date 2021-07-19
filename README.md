# Prima
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University

[Links-Platzhalter](Link1)

- [Link1](Link1.1)
- [Link2](Link1.2)


## Checkliste für Leistungsnachweis
© Valentin Schmidberger, HFU

| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 | BasketBall - BattleRoyale
|    | Name                  | Schmidberger, Valentin
|    | Matrikelnummer        | 263249, MIB
|  1 | Nutzerinteraktion     | Der Nutzer kann mithilfe von Maus und Tastatur mit dem Spiel interagieren. Sowohl Kamerarotation mit der Maus, als auch Spielerbewegung über die Pfeiltasten/W A S D sollen möglich sein. Desweiteren sollen verschiedene Keys auf der Tastatur für weitere Interaktionen bereitstehen.                                                                                                                                              |
|  2 | Objektinteraktion     | Verschiedenste Objektinteraktionen werden möglich sein: Mithilfe von Collidern am Player und Ball, kann der Spieler zufällig spawnende Bälle aufnehmen, sobald er mit diesem kollidiert. Mit Hilfe von statischen Triggern an den Basketballkörben soll überprüft werden ob der Ball zu einem Treffer oder nicht Treffer wird und wenn möglich eine passende Animation dazu abzuspielen. Mit der Aufnahme von "Essenzen/Abbilities", die zufällig auf dem Spielfeld erscheinen, kann der Endnutzer seine Spielfähigkeiten wie Laufgeschwindigkeit, Treffersicherheit erhöhen oder Gegner verlangsamen/verschlechtern.                                                                                                                                                                           |
|  3 | Objektanzahl variabel | Basketballkörbe, das Spielfeld, der Basketball und die Spieler werden über den Editor erstellt und gleich im ersten Frame generiert. Alle Objekte werden allerdings im Skript referenziert und in einer eigenen Klasse(noch nicht sicher) abgespeichert, da ein Spieler nach einer gewissen Anzahl von "kassierten" Korbschüssen verschwinden sollen. Auch die Basketbälle sollen randomierst weiter gespawnt werden, sodass ein flüssiger Spielablauf ermöglicht wird. Die Abilities werden voraussichtlich in Form von Sprites erst zur Laufzeit des Spiels instanzieert.                                                                                                                                           |
|  4 | Szenenhierarchie      | In der Szenenhierachie werden statische Objekte wie das Spielfeld und die Umgebung in einem eigenen Knoten untergebracht. Alle Basketball relevanten Objekte bekommen einen großen Elternknoten, welcher nochmals unterteilt wird. Innnerhalb dieses Knotens wird es Unterknoten geben, welche alle relevanten Objekte eines Spielers beinhalten: wie der Spieler selbst, dessen Basketballkorb, Score und weiteren relevanten Informationen. Die Basketbälle selbst werden in der selben Hierachiestufe in einem eigenen Knoten untergebracht. Unter "Konzeption/Szenenhierachie.pdf" gibt es auch eine visuelle Darstellung meines Szenegraphens.                                                                                                                                             |
|  5 | Sound                 | Es gibt eine Hintergrundmusik die dauerhaft im Loop für gute und sportliche Atmosphäre sorgt. Parallel wird es verschiedene SFX Sounds geben wie Schusssound, Treffer/Nicht-Treffer Sounds, Verloren und Gewinnen Sounds.                                                            |
|  6 | GUI                   | Ein einleitendes grafisches User Interface ermöglicht es dem Spieler direkt ins Spiel zu starten oder SFX und/oder Hintergrundmusik in ihrer Lautstärke zu verändern. Sobald der Spieler entweder gewinnt oder verliert, wird ein weiteres GUI erscheinen und dem Spieler entweder gratulieren und ihm einen höheren Schwierigkeitsgrad anbieten, oder ihm einen neuen Versuch gestatten, falls das vorherige Spiel scheiterte. Allerdings wird der Gesamtscore bei einem Neuversuch wieder zurückgesetzt.                                                                             |
|  7 | Externe Daten         |  Die Konstanten Laufgeschwindigkeit und Treffsicherheit können auch während dem Spiel durch die "Abilities" verändert werden.                                                                    |
|  8 | Verhaltensklassen     | Die wohl interessantesten Verhaltensklassen sind die der Gegner, welche sich dynamisch zu noch "freien" Basketballen führen und dann durch geschicktes Abfragen der noch vorhandenen Gegner ein verfeindeteten Korb auswählen und darauf werfen. Der Spieler wird ebenfalls eigene Verhaltenklassen haben um die aufnehmbaren "Abbilities" einfacher auf den Spieler anwenden zu können.                                                                                             |
|  9 | Subklassen/Skriptkomponenten            | Es wird voraussichtlich mit vielen ComponentScript Klassen gearbeitet werden die schon eine Subklasse darstellen. Ebenfalls wird voraussichtlich von der Node Klasse abgeleitet werden.|
| 10 | Maße & Positionen     | Die Maßeinheit "1" wird die Spielerhöhe darstellen, darauf bezogen werden die weiteren Assets gebaut. Der Urprung wird die Mitte der runden Spielfläche sein. Die Basketballkörbe werden im lokalen Koordinatensystem jedes einzelnen Spielers der Ursprung der Kinderknoten sein. Jeder Basketball wird, sobald er ein Ziel gefunden und losgeschossen wird, dem Kinderknoten des betroffenen Spielers untergeordnet um eine fehlerfreie Animation zu sichern.                                                             |
| 11 | Event-System          | Sound: der Sound lässt sich über onclick-Events und HTML-Slider und Buttons ausschalten oder in ihrer Lautstärke anpassen. Innerhalb des Spiels wird es ebenfalls mithilfe des EventSystems, Events getriggert oder gestoppt.                                                                                                                                                                        |

## To-Do`s
* Fasse die Konzeption als ein wohlformatiertes Designdokument in PDF zusammen!
* Platziere einen Link in der Readme-Datei deines PRIMA-Repositories auf Github auf die fertige und in Github-Pages lauffähige Anwendung.
* Platziere ebenso Links zu den Stellen in deinem Repository, an denen der Quellcode und das Designdokument zu finden sind.
* Stelle zudem auf diese Art dort auch ein gepacktes Archiv zur Verfügung, welches folgende Daten enthält
  * Das Designdokument 
  * Die Projektordner inklusive aller erforderlichen Dateien, also auch Bild- und Audiodaten
  * Eine kurze Anleitung zur Installation der Anwendung unter Berücksichtigung erforderlicher Dienste (z.B. Heroku, MongoDB etc.) 
  * Eine kurze Anleitung zur Interaktion mit der Anwendung

## GameZone
Wenn Du dein Spiel bei der Dauerausstellung "GameZone" am Tag der Medien sehen möchtest, ergänze folgendes  
* Einen Ordner mit zwei Screenshots der laufenden Applikation in den Größen 250x100 und 1920x400 pixel sowie ein Textdokument mit den Informationen:
* Titel
* Autor
* Jahr und Semester der Entwicklung (Sose, Wise)
* Studiensemester
* Lehrplansemester
* Studiengang
* Veranstaltung im Rahmen derer die Entwicklung durchgeführt wurde
* betreuender Dozent
* Genre des Spiels
* ggf. passende Tags/ Schlagwörter zu dem Spiel
* Untertitel (max 40 Zeichen), der Menschen zum Spielen animiert
* Kurzbeschreibung (max 250 Zeichen), die kurz erklärt wie zu spielen ist
* Erklärung, dass die Fakultät Digitale Medien die Anwendung bei Veranstaltungen, insbesondere am Tag der Medien, mit einem expliziten Verweis auf den Autor, vorführen darf.
