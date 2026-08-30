# STUDO Scope:

---

Studo is een all-in-one studeerplatform. Die term zelf is zeer breed en omvangrijk.
Concreet gezien splitst Studo studeren en in het verlengde student zijn op in vier delen:

1. Het voorbereidende aspect
2. Het opvolgende aspect
3. Het leer-aspect
4. Het sociale-aspect

Met deze vier aspecten, waarvan de eerste drie in principe onderdeel zijn van dezelfde routine probeert Studo
elke student te voorzien van voldoende boilerplate om eender welke studie volledig in Studo tot een goed einde te brengen.
Studo is dus zeer flexibel en adaptief en bestaat dus uit een aantal kern-features die die volatiliteit voorzien.
Daarnaast probeert Studo ook zowel casual- als power-users te voorzien van voldoende tools en tools die zowel oppervlakkig als zeer diepgaand gebruikt kunnen worden.
Een andere filosofie is het _"It just works"_ principe. Elke feature moet met minimale moeite opgezet worden en werken op een zo intuïtieve manier,
maar langs de andere kant ook de mogelijkheid bieden om aangevuld te worden tot het echte powertools zijn.
Studo heeft dus features die met minimale user input werken en aangevuld kunnen worden om ze op te schalen.
Hoe meer user input, des te beter de performance.

---

## Vakken

Elke studie bestaat uit vakken. Daarom werd er voor gekozen om vakken als basisentiteit te kiezen die dus als fundering dienen voor alle andere features.
Een gebruiker definieert een vak, wat kan met simpelweg een titel.
Een vak is een verzameling van een aantal zaken,
ook hierbij hebben we ons gespiegeld aan de werkelijkheid:

1. Vak-resources
2. Een kennisdatabank
3. Externe resources

### De vakonboarding

Onder vak-resources verstaan we elke schriftelijke bron gerelateerd aan het vak: cursussen, delen van die cursus, eigen notities, presentaties etc.
Het kernidee zit zo: een gebruiker upload zijn cursus of delen daarvan, deze wordt verwerkt om een kennisdatabank te creëren en blijft natuurlijk ook toegankelijk.
De verwerking verloopt als volgt:

1. Een gebruiker upload één of meerdere resources in de frontend, per upload kunnen er tot 3 bestanden geupload worden van elk max 400 pagina's.
2. Meerdere resources kunnen ook samengevoegd worden tot één resource.
3. De backend ontvangt deze resource(s), schrijft die weg naar object-storage, maakt een record aan in de db en ook een rij in de processing queue.
4. Zodra de resource in object-storage zit is deze toegankelijk voor gebruikers, wat dus een aantal seconden duurt.
5. De processing queue change triggert de parsing pipeline.
6. De parsing pipeline extraheert het document uit object-storage, deelt die op in chunks, die ook naar de db worden geschreven.
7. Na chunking wordt de LLM-gateway verwittigd.
8. De LLM-gateway embedt elke chunk en update elk chunk-record met de verkregen vector.

Die verwerkte chunk groep noemen we de kennisdatabank: een direct toegankelijke pool van chunks leesbaar en doorzoekbaar voor LLM's en in het verlengde ook het gehele systeem.
En dat is juist zo interessant: het vak heeft directe toegang tot alle kennis binnen zijn tegenhanger in de echte wereld.
Hoe meer cursus-documenten ook geüpload worden, des te uitgebreider en gerichter qua werking de kennisdatabank wordt van dat vak.

Elke geüploade vak-resource blijft toegankelijk via dedicated viewers, kan getagd worden met verschillende, voor- en user-defined tags en is uitbreidbaar.
Met uitbreidbaar wordt bedoeld dat een gebruiker aan een al geüploade resource extra delen (pagina's) kan toevoegen.
Dit kan natuurlijk alleen als de gewenste toe te voegen resources hetzelfde datatype hebben.

Die resources leven dus binnen het vak binnen een specifieke pagina. Op deze pagina kunnen documenten gezocht, gesorteerd en geordend worden.
Ook is het mogelijk resources te groeperen in mappen.

Die eerste stap vinkt direct alle functionaliteit van het voorbereidende aspect af: het samenbrengen en ordenen van alle informatie binnen het vak.
Het idee is dat een gebruiker aan het begin van het academiejaar al zijn vakken spiegelt binnen Studo. Dit kan handmatig of door het uploaden van een screenshot van het lessenrooster
en vervolgens al het leermateriaal binnen elk vak systematisch doorheen het jaar upload of ook aan het begin van het jaar.

Elk vak kan zoals eerder vermeld aangemaakt worden met enkel een naam, maar een vak bevat natuurlijk ook een hoop aanvulbare metadatavelden:

1. Examendatum
2. Lesdag(en) en lesuren
3. Semester (optioneel) en academiejaar
4. Studiepunten/prioriteit
5. Externe resource link (bv link naar vakpagina binnen de schoolmanagementsoftware van de student's leerinstelling)

Deze kunnen achteraf of bij het aanmaken van het vak aangevuld worden en voorzien de kennisdatabank ook weer van extra context.

### Flow

Nadat het gehele voorbereidende aspect achter de rug is,
begint het opvolgende aspect, nadat een gebruiker alle structuur heeft voorzien, kan die nu ook zijn lessen beginnen opvolgen binnen Studo.
Hiervoor is een concrete feature voorzien: Flow.

Flow is een geavanceerd opvolgbord dat op een aantal manieren kan worden weergegeven:

1. Spreadsheet
2. Kanban board
3. Kalender
4. Tijdlijn

Deze vier weergaves zijn geen aparte entiteiten, maar louter een andere rendering van dezelfde onderliggende rijen en kolommen.
Een gebruiker kan op elk moment wisselen van weergave zonder dataverlies of -transformatie, spreadsheet toont alle rijen met kolommen
als tabelkoppen, kanban groepeert rijen per status-kolom, kalender en tijdlijn positioneren rijen op basis van hun deadline.

Elk bord is op dezelfde manier opgebouwd:
Er zijn een aantal standaard kolommen (status, prioriteit, deadline, gelinkte entiteiten) en users kunnen er zelf ook toevoegen.
Custom kolommen voorzien de volgende bouwblokken: dropdown, list, links (naar externe URL's), tags, tekst, en links naar andere rijen binnen hetzelfde of een ander Flow-bord.

Dan zijn er ook rijen. Elke rij stelt één entiteit binnen het bord voor. Die entiteiten kunnen een aantal zaken zijn:

1. Documenten
2. Taken
3. Proefexamens
4. Studosets
5. Visualsets
6. Notities
7. Samenvattingen

Dit is een gesloten lijst voor v1. Een rij kan ook een "kale" taak zijn zonder gelinkte entiteit, puur tekst plus metadata, dat is het minimale geval.
Elke rij krijgt ook zijn eigen status (to do, in progress, done), prioriteit (no priority, low, medium, high), beschrijving en deadline.
Daarnaast kunnen aan elke rij ook entiteiten worden gelinkt.

Een rij "is" dus niet noodzakelijk een Studoset of Document, ze kan er een aan koppelen. Het onderscheid is belangrijk:
een rij van het type "taak" kan gelinkt zijn aan een Studoset (bv "leer hoofdstuk 3") zonder dat de rij zelf een Studoset is.
Een rij van het type "Studoset" daarentegen verwijst rechtstreeks naar een bestaande Studoset binnen het vak, en toont diens eigen voortgang mee op het bord.

Bovenaan elk bord staat ook een progressbar, berekend als het percentage rijen met status "done" over alle rijen binnen het bord.

Elk Flow-bord hoort bij exact één vak. Er is geen globaal Flow-bord over alle vakken heen in v1, wel kan een gebruiker via Boards (zie hierboven) tussen de Flow-borden van zijn vakken navigeren.

Flow staat ook in verbinding met de kennisdatabank van het vak. Zodra vak-resources verwerkt zijn (zie vakonboarding),
kan het systeem op basis van de gedetecteerde structuur in de kennisdatabank (hoofdstukken, secties) automatisch Flow-rijen voorstellen aan de gebruiker,
bijvoorbeeld een taak per hoofdstuk. Dit is een suggestie, geen automatische aanmaak: de gebruiker beslist welke voorgestelde rijen effectief worden toegevoegd aan zijn bord.

Dit is een directe toepassing van het "it just works, meer input geeft meer diepgang" principe uit de scope:
hoe meer en beter gestructureerde documenten een vak heeft, hoe accurater en vollediger de voorgestelde Flow-structuur wordt.

### Notes

Notities zijn native, binnen Studo geschreven tekst-resources, in tegenstelling tot geüploade documenten.
Ze delen dezelfde basisstructuur als andere vak-resources: ze leven op de resources-pagina, kunnen getagd en in mappen geordend worden
en kunnen optioneel gekoppeld worden aan specifieke chunks of hoofdstukken uit de kennisdatabank.

Een notitie wordt niet apart geëmbed of verwerkt via de volledige vakonboarding pipeline (geen chunking van een groot document),
maar kan zelf wel als input dienen voor de kennisdatabank als de gebruiker dat expliciet aangeeft, bijvoorbeeld eigen samenvattingen die net zo doorzoekbaar moeten zijn als de officiële cursus.
Voor v1: platte tekst met basis markdown-opmaak (koppen, lijsten, bold/italic), geen rich media, wel versiegeschiedenis, geen collaboratieve bewerking.

### De kennisdatabank als centrale AI-laag

De kennisdatabank (zie vakonboarding) is geen geïsoleerde feature binnen "vak-resources",
maar een fundament dat meerdere onderdelen van Studo doorheen het hele systeem voedt.
Elke feature die hieronder vermeld wordt, leunt op dezelfde onderliggende pool van chunks en hun vectoren
en wordt sterker naarmate die pool groeit en beter gestructureerd raakt.
Dit is de meest directe toepassing van het "hoe meer user input, des te beter de performance"-principe uit de scope.

#### Structuurherkenning, niet enkel chunking

Naast het opdelen in chunks voor embeddings (stap 6 van de vakonboarding pipeline), detecteert de parsing pipeline ook de structuur van een document:
hoofdstukken, secties, titels. Deze structuur wordt apart bijgehouden naast de losse chunks
en dient als basis voor alle features hieronder die "per hoofdstuk" of "per sectie" werken.

#### Flow-integratie

- **Rij-suggesties**: op basis van gedetecteerde structuur kan het systeem Flow-rijen voorstellen, bijvoorbeeld een taak per hoofdstuk. Dit blijft een suggestie, de gebruiker beslist welke rijen effectief worden toegevoegd.
- **Automatische voortgang**: als een Flow-rij gelinkt is aan een Studoset of Visualset die op zijn beurt aan specifieke chunks gekoppeld is, kan de voortgang van die rij automatisch worden afgeleid uit leerdata (spaced repetition scores, quizresultaten) in plaats van manueel bijgehouden te worden.
- **Gap-detectie**: doorlopend, niet enkel bij onboarding, detecteert het systeem welke delen van de kennisdatabank nog geen enkele Flow-rij, Studoset, of Visualset hebben, en signaleert dit proactief.
- **Deadline-suggesties**: op basis van de omvang van een hoofdstuk (aantal chunks, geschatte leestijd) en de examendatum van het vak, kan Flow een realistische spreiding van deadlines voorstellen.
- **Automatische content-generatie bij gaps**: waar gap-detectie een leegte signaleert, kan het systeem niet enkel een lege taak voorstellen, maar meteen een samenvatting of proefexamen genereren als startpunt.

#### Chat-integratie

Elke Flow-rij, ook een "kale" taak zonder expliciet gelinkte entiteit, kan als context dienen voor een AI-chatgesprek.
De chat haalt automatisch relevante chunks uit de kennisdatabank van het vak op, zonder dat de gebruiker die link zelf hoeft te leggen.

#### Studoset- en Visualset-generatie

Studosets en Visualsets kunnen (deels) automatisch gegenereerd worden op basis van geselecteerde chunks of een volledig hoofdstuk uit de kennisdatabank,
in plaats van dat een gebruiker alle content manueel invoert. Dit is de kern van het "minimale input, opschaalbaar tot powertool"-principe toegepast op het leer-aspect.

#### Doorlopende verrijking

Elke nieuwe upload binnen een vak (zie vakonboarding, stap 2: uitbreidbaarheid) verrijkt niet enkel de kennisdatabank zelf, maar triggert opnieuw de bovenstaande processen: nieuwe structuurherkenning, nieuwe gap-detectie, nieuwe rij-suggesties. De kennisdatabank is dus geen eenmalig gegenereerd geheel, maar groeit en werkt door doorheen het volledige academiejaar.

---

## Boards

Dit zijn simpele entiteiten die een verzameling van vakken voorstellen en gemodelleerd zijn op academiejaren.
Deze kunnen ook worden aangemaakt met enkel een titel, maar bevatten ook metadatavelden over het academiejaar, leerinstelling en richting.
Als vakken binnen een board met ingevuld academiejaar zitten wordt dit verplicht gesynchroniseerd.
Gebruikers zijn vrij om boards aan te maken. Vakken kunnen perfect zonder board bestaan. Het is een simpele overzichtelijke manier om vakken te groeperen.
Vanaf dat er drie of meer vakken met hetzelfde academiejaar bestaan wordt het aanmaken van een board ook automatisch gesuggereerd door het systeem mocht er nog geen board bestaan.

Elk board heeft twee tabs:

1. Overzicht: een sorteerbare, doorzoekbare grid of lijst van alle vakken binnen het bord
2. Planner: een kalender waarin elk vak weergegeven wordt afhankelijk of deze al een lesdag en lesuren heeft meegekregen

Hiermee is ook het gehele opvolg-aspect afgerond. Het kernidee: een gebruiker maakt per vak een Flow-board aan, waarin al zijn/haar lessen leven en opgevolgd worden.
De gebruiker heeft altijd een duidelijk overzicht wat er nog moet gebeuren voor een vak.

---

## Studosets

Een Studoset is een verzameling kaartjes,
het klassieke flashcard-concept, maar uitgebreid met rijke content types: tekst, wiskundige notatie (KaTeX), code met syntax highlighting (Shiki) en afbeeldingen.
Elke kaart heeft een voor- en achterkant, en kan vrij gecombineerd worden uit deze content types.

Studosets kunnen op drie manieren ontstaan:

1. **Manueel**: een gebruiker maakt kaarten zelf aan, kaart per kaart.
2. **(Semi-)automatisch via de kennisdatabank**: op basis van geselecteerde chunks of een volledig hoofdstuk genereert het systeem een voorstel van kaarten, die de gebruiker kan aanpassen, aanvullen of verwijderen voor hij de set bevestigt.
3. **Import**: bestaande sets (bv Quizlet-formaat), lijsten of documenten kunnen geïmporteerd worden.

Het leren van een Studoset gebeurt via spaced repetition (FSRS),
waarbij elke kaart een eigen leerstatus krijgt op basis van herhaling en correctheid.
Deze leerstatus is exact de data die de automatische Flow-voortgang (zie hierboven) voedt.

Een Studoset hoort altijd bij een vak, en kan optioneel publiek gedeeld worden (zie public set search), zonder dat de onderliggende kennisdatabank-koppeling wordt meegedeeld.

Elke kaart is ook voorzien van een hotlink naar de cursus en opent dus de cursus op de plek waar de info in de kaart staat.
Daarnaast kan er in de chat ook direct verwezen worden naar kaarten om daar specifiekere vragen over te stellen.

---

## Visualsets

Waar een Studoset kennis opdeelt in tekstuele kaarten, koppelt een Visualset kennis aan een afbeelding.
Een Visualset bestaat uit een of meerdere afbeeldingen, waarop de gebruiker pins (punten) of vectoren (uitgetekende vormen,
bijvoorbeeld de omtrek van een orgaan of structuur) plaatst. Aan elke pin of vector wordt een definitie of stuk tekst gelinkt.

Dit maakt Visualsets geschikt voor leerstof waar visuele identificatie centraal staat, anatomie, kaarten, diagrammen, plantdelen,
elk vakgebied waar "wat is dit, en wat doet het" belangrijker is dan een pure tekstuele definitie.

Zoals Studosets kunnen Visualsets:

1. **Manueel** opgebouwd worden: de gebruiker uploadt een afbeelding, plaatst zelf pins/vectoren, en voegt per pin/vector een definitie toe.
2. **(Semi-)automatisch gegenereerd** worden: op basis van een geüploade afbeelding en de kennisdatabank van het vak, herkent het systeem relevante structuren op de afbeelding en stelt pins/vectoren met bijhorende definities voor, die de gebruiker kan aanpassen voor hij bevestigt.

Het leren van een Visualset gebeurt door de gebruiker een pin of vector te tonen zonder de definitie
en te toetsen of hij weet wat het is, vergelijkbaar met het kaart-omdraai-mechanisme van een Studoset, maar dan visueel.
Dit kan op dezelfde spaced-repetition logica (FSRS) draaien als Studosets, aangezien het onderliggende leerprincipe hetzelfde is:
een eenheid tonen, antwoord toetsen, herhaling plannen op basis van correctheid.

Een Visualset hoort altijd bij een vak en kan optioneel publiek gedeeld worden.

---

## Studeer-mechanismen en leersessies

Naast het aanmaken en beheren van Studosets en Visualsets, voorziet Studo verschillende manieren om ze effectief te leren.

### Studoset leermodi

1. **Learn**: adaptieve leermodus op basis van FSRS, kaarten worden getoond volgens hun geplande herhalingsmoment.
2. **Speedy**: snelle, tijdsgebonden herhaling, gericht op vlotheid eerder dan diepgaande spaced repetition.
3. **Classic flashcards**: het klassieke, manuele omdraai-mechanisme zonder algoritmische sturing, de gebruiker bepaalt zelf het tempo en of een kaart gekend was.

### Visualset leermodi

1. **Pin**: de gebruiker moet de juiste locatie op de afbeelding aanduiden bij een gegeven definitie.
2. **Point**: de gebruiker krijgt een pin/vector getoond en moet de bijhorende definitie geven.

### Kaarten flaggen

Binnen elke leermodus kan een gebruiker een kaart of pin/vector flaggen (vergelijkbaar met een ster), om ze later terug te vinden of apart te herhalen, onafhankelijk van de FSRS-planning.

### Focus-tools tijdens het leren

Tijdens een leersessie kan de gebruiker optioneel:

- een **pomodoro timer** activeren, die de leersessie opdeelt in werk- en pauze-intervallen.
- **20/20/20** activeren voor gezondere ogen.

### Printen

Zowel Studosets als Visualsets zijn exporteerbaar naar een printbaar formaat.

- Een Studoset print als **woordenlijst**: term en definitie onder elkaar, in een compact, overzichtelijk formaat.
- Een Visualset print als **schema**: de afbeelding met de pins/vectoren en (optioneel) hun definities, zoals een echt anatomisch of technisch schema.

### AI-opvolging: automatische remediëring

Naast gap-detectie op het niveau van de kennisdatabank (welke leerstof heeft nog geen set),
houdt Studo ook bij welke individuele kaarten of pins binnen bestaande Studosets en Visualsets nog niet voldoende gekend zijn,
op basis van de FSRS-leerstatus (lage correctheidsscore, herhaaldelijk fout, of nog nooit voldoende herhaald).

Remediëring gebeurt als suggestie, niet als automatisch aangemaakte set of rij. Na het afronden van een leersessie op een Studoset of Visualset,
krijgt de gebruiker een melding met een voorstel om de nog niet voldoende gekende kaarten/pins beter op te volgen, bijvoorbeeld door er een aparte Studoset
of Flow-rij van te maken. De gebruiker beslist zelf of hij deze suggestie effectief aanneemt, net zoals bij de Flow rij-suggesties vanuit de kennisdatabank.

Deze twee features definiëren het studeer-aspect van Studo: studenten studeren hun leerstof ook direct binnen het systeem.
Hierdoor is het ook direct meetbaar hoe goed een student ergens voor staat.

---

## Vak-samenwerking en toegangsrechten

Dit is het laatste aspect dat Studo probeert aan te pakken: het sociale aspect.
Een vak kan namelijk gedeeld worden met andere gebruikers, met drie toegangsniveaus, naar analogie met Google Drive:

1. **Viewer**: kan alle vak-resources, de kennisdatabank, en de bestaande Studosets/Visualsets bekijken en leren, maar niets wijzigen aan de gedeelde content.
2. **Editor**: kan daarnaast resources uploaden, de kennisdatabank verrijken, en Studosets/Visualsets aanmaken of aanpassen.
3. **Owner**: volledige controle, inclusief het beheren van wie toegang heeft en het verwijderen van het vak.

Delen van een vak geeft dus toegang tot de content-laag: vak-resources, de kennisdatabank en Studosets/Visualsets.
Flow is en blijft altijd persoonlijk.
Elke gebruiker met toegang tot een vak, ongeacht zijn rol, bouwt zijn eigen Flow-bord op met eigen rijen, eigen planning en eigen tempo.
Een Flow-rij kan wel verwijzen naar gedeelde content (bv "leer hoofdstuk 3" linkt naar een gedeelde Studoset),
maar de rij zelf, zijn status, deadline en voortgang, is nooit gedeeld tussen gebruikers.

Leren blijft, zoals de FSRS-leerstatus al impliceert, sowieso individueel: elke gebruiker heeft zijn eigen leerstand op een gedeelde Studoset of Visualset.

Als de owner een vak verwijdert, verdwijnt de toegang voor alle gebruikers,
inclusief hun Flow-rijen die naar dat vak of zijn content linken,
analoog aan hoe een verwijderd Google Doc ook voor alle gedeelde gebruikers verdwijnt.
Dit wijkt af van de eerdere regel voor los verwijderde entiteiten binnen een vak (waar een Flow-rij als "entity deleted" blijft bestaan):
het verwijderen van het volledige vak is een fundamenteel andere, drastischere actie dan het verwijderen van een individuele resource of set erbinnen.
