# © Valentin Schmidberger, HFU
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University
# Prima
- [Zum Spiel](https://vale-sch.github.io/basketBallBattleRoyale/BasketBall_BattleRoyale.html)
- [Zum Designdokument](Link1.1)
- [Zu den Skripen](https://github.com/vale-sch/basketBallBattleRoyale/tree/main/Scripts)
- [Gepacktes Archiv](Link1)

# how to play it locally
download zip or clone repository via HTTPS/SSH
run console command: "npm update"
open repository via vs code and run live server
follow the instructions in game

## Checkliste für Leistungsnachweis

| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 | BasketBall - BattleRoyale
|    | Name                  | Schmidberger, Valentin
|    | Matrikelnummer        | 263249, MIB
|  1 | Nutzerinteraktion     | Der Nutzer kann mithilfe von Maus und Tastatur mit dem Spiel interagieren. Sowohl Kamerarotation mit der Maus, als auch Spielerbewegung über die Pfeiltasten/"W" "S"  sollen möglich sein. Desweiteren sollen verschiedene Keys auf der Tastatur für weitere Interaktionen bereitstehen.                                                                                                                                              |
|  2 | Objektinteraktion     | Verschiedenste Objektinteraktionen werden möglich sein: Mithilfe von Collidern am Player und Ball, kann der Spieler zufällig spawnende Bälle aufnehmen, sobald er mit diesem kollidiert. Mit Hilfe von statischen Triggern an den Basketballkörben soll überprüft werden ob der Ball zu einem Treffer oder nicht Treffer wird und wenn möglich eine passende Animation dazu abzuspielen.                                                                                                                        |
|  3 | Objektanzahl variabel | Basketballkörbe, das Spielfeld, der Basketball und die Spieler werden über den Editor erstellt und gleich im ersten Frame generiert. Alle Objekte werden allerdings im Skript referenziert und in einer eigenen Klasse abgespeichert, da ein Spieler nach einer gewissen Anzahl von "kassierten" Korbschüssen verschwinden sollen. Auch die Basketbälle sollen randomierst weiter gespawnt werden, sodass ein flüssiger Spielablauf ermöglicht wird (Graph Instanzierung). |
|  4 | Szenenhierarchie      | In der Szenenhierachie werden statische Objekte wie das Spielfeld und die Umgebung in einem eigenen Knoten untergebracht. Alle Basketball relevanten Objekte bekommen einen großen Elternknoten, welcher nochmals unterteilt wird. Innnerhalb dieses Knotens wird es Unterknoten geben, welche alle relevanten Objekte eines Spielers beinhalten: wie der Spieler selbst, dessen Basketballkorb, Score und weiteren relevanten Informationen. Die Basketbälle selbst werden in der selben Hierachiestufe in einem eigenen Knoten untergebracht. Unter "Konzeption/Szenenhierachie.pdf" gibt es auch eine visuelle Darstellung meines Szenegraphens.                                                                                                                                             |
|  5 | Sound                 | Es gibt eine Hintergrundmusik die dauerhaft im Loop für gute und sportliche Atmosphäre sorgt. Parallel wird es verschiedene SFX Sounds geben wie Schusssound, Treffer/Nicht-Treffer Sounds, Verloren und Gewinnen Sounds.                                                            |
|  6 | GUI                   | Ein einleitendes grafisches User Interface ermöglicht es dem Spieler direkt ins Spiel zu starten oder die Lautstärke des Spiels zu verändern. Sobald der Spieler entweder gewinnt oder verliert, wird ein weiteres GUI erscheinen und dem Spieler entweder gratulieren und ihm einen höheren Schwierigkeitsgrad anbieten, oder ihm einen neuen Versuch gestatten, falls das vorherige Spiel scheiterte. Allerdings wird der Gesamtscore bei einem Neuversuch wieder zurückgesetzt.                                                                             |
|  7 | Externe Daten         |  Die Konstanten: Laufgeschwindigkeit, Anzahl der Leben, Volllaufen der Powerbar werden über den Local Storage in den verschiedenen Schwierigkeitsgraden angepasst                                                                |
|  8 | Verhaltensklassen     | Die wohl interessantesten Verhaltensklassen sind die der Gegner, welche sich dynamisch zu noch "freien" Basketballen führen und dann durch Abfragen der noch vorhandenen Gegner ein verfeindeteten Korb auswählen und darauf werfen. Sowohl der Spieler als auch die Korbtrigger werden ebenfalls eigene Verhaltenklassen benötigen.                                                                                           |
|  9 | Subklassen/Skriptkomponenten            | Es wird voraussichtlich mit vielen ComponentScript Klassen gearbeitet werden, die schon eine Subklasse darstellen. Ebenfalls wird voraussichtlich von der Node Klasse abgeleitet werden.|
| 10 | Maße & Positionen     | Die Maßeinheit "1" wird die Spielerhöhe darstellen, darauf bezogen werden die weiteren Assets gebaut. Der Urprung wird die Mitte der runden Spielfläche sein. Die Basketballkörbe werden im lokalen Koordinatensystem jedes einzelnen Spielers der Ursprung der Kinderknoten sein. Jeder Basketball wird, sobald er ein Ziel gefunden und losgeschossen wird, dem Kinderknoten des betroffenen Spielers untergeordnet um eine fehlerfreie Animation zu sichern.                                                             |
| 11 | Event-System          | Sound: der Sound lässt sich über onclick-Events und HTML-Slider ausschalten oder in ihrer Lautstärke anpassen. Innerhalb des Spiels wird es ebenfalls mithilfe des EventSystems, Events getriggert oder gestoppt.                                                                                                                                                                        |


