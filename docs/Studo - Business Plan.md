# **_Studo \- Business Plan_**

---

# **Visie & Missie**

## **_De Marktcontext:_**

Vlaanderen telt 157.407 hogeschoolstudenten (oktober 2024), een stijging van 6,1% in één jaar. Tel daarbij de universiteitsstudenten en je komt op ruim **270.000 studenten in het Vlaamse hoger onderwijs**. De studentenmarkt groeit dus structureel: de participatiegraad van achttienjarigen in het hoger onderwijs steeg van 62% in 2013 naar bijna 72% in 2024\.

##

## **_De probleemstelling_**

Van het samenvatten van droge theorie tot het blokken van een ellenlang glossarium.  
Voor zowat elke student, waaronder ikzelf, is studeren een tijdrovend en herhalend, maar ook essentieel proces. Niet alleen neemt het leerpakket van studenten toe, de tijd om dit pakket te leren blijft beperkt. De druk op de schouders van studenten neemt dus jaar na jaar toe en burn-outs zijn on the rise. Daar komt nog eens bij dat studenten kampioenen zijn in procrastinatie, zeker als het op beginnen studeren aankomt: slechte planningen en structuurloze studiesessies helpen allesbehalve bij de druk naar beneden halen. Tel daarbovenop nog prestatiedruk en externe stressfactoren en je krijgt bijna zelf stress van deze resultaten te lezen.

##

Gelukkig bestaan er moderne tools zoals binnen de flashcard markt zoals Quizlet, Anki of Brainscape, die proberen dit dagdagelijkse ritueel te versimpelen en die geregelde stress te verminderen. Deze markt groeit naar verwachting van $1,5 miljard (2025) naar $3 miljard in 2032, maar kampt nog steeds met een aantal essentiële tekortkomingen en verlossen studenten slechts gedeeltelijk van de mentale druk. Net als vele medestudenten heb ik een aantal frustraties omtrent het moderne studeren. Wanneer je als student online wenst te studeren bots je namelijk al vrij snel op een aantal obstakels:

1. **Fragmentatie**: Studenten gebruiken gemiddeld 3 tot 5 verschillende tools: Quizlet voor vocabulaire, Anki voor spaced repetition, Notion voor notities en losse PDF’s voor schema’s en visuele leerstof. Een out of the box werkende overkoepelende tool die al deze leermethoden combineert bestaat niet.  

2. **De verkeerde doelgroep:** het merendeel van deze apps zijn niet afgestemd op studenten hoger onderwijs (zoals STEM en medische studenten) . Essentiële tools zoals LaTeX notatie voor wiskundige formules, geen (gratis) ondersteuning voor afbeeldingen die horen bij definities, geen ondersteuning voor complexe schema’s en geen echte spaced repetition algoritmes met een steile leercurve die met de student meegroeien.

3. **Geen oplossing voor visueel leren:** dit is een gigantische tekortkoming in het moderne online studielandschap: voor visueel leren, zoals anatomie of schema’s en dergelijke bestaan er geen online studietools. Bestaande oplossingen (zoals Sketchy of Complete Anatomy) zijn ofwel te duur (€200+/jaar), te niche (alleen specifiek medisch), of niet geïntegreerd in een breder studieplatform.

4. **Agressieve monetisatie & een slechte UX:** Vele tools hebben vaak een matige tot slechte gebruikerservaring, zijn niet aangepast aan individuele leerpatronen, monetizen agressief of inefficiënt, en proberen alle functionaliteit in één generieke leermethode te proppen. Het gevolg is een versnipperd studie-ecosysteem waarin studenten onnodig tijd verliezen. Hier ligt een duidelijke marktopportuniteit voor een geïntegreerde oplossing.

## **_Visie:_**

Studo wil de manier veranderen waarop studenten in het hoger onderwijs studeren: van gefragmenteerd en tijdrovend naar geïntegreerd, adaptief en efficiënt.

## **_Missie:_**

Studo combineert bewezen leermethodes in één platform dat zich aanpast aan de student, niet andersom. We helpen studenten slimmer studeren, niet harder.

## **_De Oplossing: Studo_**

Studo is een all-in-one slimme lee app die:

- Actief leren stimuleert
- Revisie automatiseert via spaced repetition
- Verschillende leermethodes specifiek aanbiedt per type leerstof
- Leermethodes combineert voor optimaal studierendement
- Meegroeit met de student
- Motiveert met een streak-systeem

# **Kernfunctionaliteiten (fase 1 \- 4\)**

## **_Het centrale idee_**

Studo is opgebouwd rond één centraal idee: het vak. Een vak bundelt het studiemateriaal (sets) en de opvolging (Flow) van één onderwerp op één plek. Sets zijn het materiaal, Flow is de structuur en opvolging eromheen, en boards groeperen vakken optioneel per semester. Sets blijven los bruikbaar en doorzoekbaar als acquisitie- en SEO-motor, terwijl Flow zorgt voor terugkerend gebruik tussen de examenmaanden.

## **_Gebruikersrollen_**

Twee rollen met verschillende functionaliteiten:

| Rol                    | Beschrijving                                                                       |
| :--------------------- | :--------------------------------------------------------------------------------- |
| Student                | Toegang tot alle leer- en studiefunctionaliteiten                                  |
| Leerkracht / Professor | Extra beheer- en opvolgingsmogelijkheden voor klassen. Enige verschil is de titel. |

## **_Structuur van het platform_**

Drie lagen, van groot naar klein:

- **Boards**: een academische context zoals een semester of studiejaar. Bevatten vakken. Optioneel: een vak hoeft niet in een board te zitten.
- **Vakken** (flowcourses): de centrale eenheid. Eén vak per onderwerp, met daarin zowel sets als Flow-opvolging. Kan los bestaan zonder board, en later via drag-and-drop aan een board worden toegevoegd.
- **Flowrows**: de kleinste eenheid binnen een vak. Concrete leeractiviteiten (les, oefening, samenvatting, taak).

## **_Sets (fase 1):_**

### **Studosets**

Term-definitie paren die op verschillende manieren ondervraagd worden.

#### **Aanmaken**

- Manueel één voor één
- Importeren uit Word, Excel of via copy-paste
- Math Mode voor LaTeX-weergave van formules
- Code-weergave
- Afbeeldingen toevoegen aan termen (getoond in leermodi)
- Toekomstig: afbeeldingsherkenning om termen en definities uit screenshots te halen

Bij creatie wordt een set altijd aan een vak gekoppeld. Je typt een vaknaam: matcht die een bestaand vak, dan wordt de set eraan gelinkt. Matcht die niet, dan wordt automatisch een nieuw vak aangemaakt. De gebruiker merkt het verschil niet en hoeft nooit eerst apart een vak aan te maken.

#### **Leermodi**

- Leren — spaced repetition met queue-systeem dat doorgaat tot alles gekend is. Schaalt mee op het niveau van de student. Bevat Health Mode (20-20-2 regel: elke 20 minuten een herinnering om 2 minuten recht te staan en naar buiten te kijken) en een pomodoro timer
- Tijdstrijd — dynamische tijdslimiet op basis van de lengte van term of definitie. Werkt in rondes waarbij correct beantwoorde kaarten uit de queue verdwijnen. Doel: alles correct in zo weinig mogelijk rondes
- Klassieke Flashcards — simpele term-definitie kaarten die bij klik de andere zijde tonen
- Print (vanaf fase 2\) — fysieke versie van de kaarten in een overzichtelijke lijst

###

### **Visualsets (fase 1\)**

Een leermethode voor visuele vakken zoals anatomie, biologie en aardrijkskunde.

#### **Hoe het werkt**

- Gebruikers uploaden één of meerdere afbeeldingen
- Op elke afbeelding worden pins geplaatst met gekoppelde definities

#### **Leermodi**

- Spotten — het Visualset-equivalent van Leren. Het systeem gaat alle pins af, de student typt de juiste definitie in, foute antwoorden komen in de queue tot alles geleerd is
- Aanwijzen — omgekeerde van Spotten. Het systeem toont een definitie, de gebruiker duidt de juiste pin aan, gaat door tot alle pins correct zijn aangeduid

## **_Vakken & Flow (fase 1\)_**

Het vak is de plek waar materiaal en opvolging samenkomen. Open je een vak, dan zie je twee dingen samen op één pagina: bovenaan het sets-overzicht (je materiaal), daaronder de Flow-tabel (je opvolging).

### **Flow**

Een gestructureerd opvolgingssysteem dat studenten helpt hun leerproces visueel te beheren. In tegenstelling tot klassieke to-do of notitie-apps is dit ontworpen rond hoe studenten hun opleiding ervaren: per board (semester), per vak, per leeractiviteit. Geïnspireerd op een reële workflow (een Excel met per vak een tab en per rij een leeractiviteit), maar vertaald naar een native ervaring met betere UX, visuele progressie en directe koppeling met Studo-materiaal.  
De sterkte van Flow: het ondersteunt zowel power users met complexe studeermethodes als studenten met minimale planning. Veel is voorgekauwd, daarnaast is er veel ruimte voor vrije input.

#### **Twee kerngedragingen op één scherm, zonder moduswisseling**

- Capture — snel vastleggen in de les. Inline invoerveld onderaan de tabel: titel typen, Enter, rij verschijnt met status "not started." Geen verplichte velden, geen modals. Een item toevoegen mag maximaal vijf seconden duren.
- Organize — structureren achteraf. Thuis herorden je via drag-and-drop, pas je statussen aan (not started → doing → done), voeg je metadata toe (type, prioriteit, geschatte tijd, deadline) en koppel je resources. Dit gebeurt in de expanded state van een rij. Een overzicht van alle taken kan ook in een kanban-bord.

#### **Anatomie van een flowrow**

Een row is een leeractiviteit, geen afgeleide van een set. Een row kan van verschillende types zijn: Lesson, Notes, Summary, Exercise, Sample Exam of Task.

- **Collapsed** (standaard): één horizontale rij die toont wat er al is: status-indicator, titel, type-label, een link-icoon als er resources hangen, en een drag handle. In één oogopslag scanbaar.
- **Expanded** (bij klik): klapt inline open zonder modal. Optionele metadata (prioriteit, type, geschatte tijd, deadline) en een resources-sectie. Alle velden optioneel.

**Kernprincipe: de collapsed rij toont output, de expanded rij is waar je input doet.**

#### **Koppeling met sets**

De resources-sectie van een row kan zowel een externe link (bv. een cursusplatform) als een interne Studoset of visualset bevatten. Zo klikt Flow en materiaal in elkaar zonder dat het geforceerd wordt: een row over een onderwerp kan linken naar de externe les én naar de eigen set over datzelfde onderwerp. Sets worden niet automatisch rows: een row is breder dan een set en de gebruiker bouwt zijn rows zoals hij wil.

#### **Lege staat van een vak**

Open je een vak zonder rows, dan zie je bovenaan een overzicht van je sets en daaronder een skelet-row als CTA om je eerste activiteit toe te voegen. Zo voelt een nieuw vak nooit volledig leeg.

#### **Boards & overzicht**

- Overzichtspagina per board — bij het openen van een board land je op een overzicht met alle vakken als cards. Elke card toont de vaknaam, een icoon en een progress bar (done/totaal). Klik op een card opent dat vak.
- Vakken zonder board — een vak kan los bestaan. Via drag-and-drop kan het later in een board worden geplaatst.

#### **Progressie-tracking**

Voortgang wordt op twee niveaus visueel weergegeven:

- Per vak — bovenaan de tabel-view, afgewerkte items ten opzichte van het totaal
- Per board — op de overzichtspagina, als compacte progress bar op elke vak-card

De bar kan gesegmenteerd worden in drie kleuren (not started, doing, done) voor een genuanceerder beeld.

### **Toekomstige uitbreidingen**

In latere fases komt intelligente planning (rekening houdend met geschatte studietijd en mentale belasting), AI-gesuggereerde metadata op basis van de ingevoerde titel, quicknotes en een summary editor binnen Flow, en gedeelde flowboards binnen Classrooms waar meerdere gebruikers samen werken en rows delen.

### **Retention hack**

Studeerplatformen zien een piek tijdens de examenmaanden en een grote terugval ertussen. Flow is daarvoor de oplossing: gebruikers volgen consistent hun lessen op via Flow en blijven zo regelmatig terugkomen.

### **Statistieken (fase 2\)**

Een uitgebreide kijk in studieprestaties: waar het goed en minder ging, welke kaarten al vlot gekend zijn, gemiddelde tijd tussen kaarten of pins, tijd per studeersessie, en progressie over tijd. Zit je in een Classroom met een leerkracht of professor, dan kan die je voortgang opvolgen.

## **_Classrooms (fase 1\)_**

Gedeelde leeromgevingen om samen te studeren, oefenen en groeien.  
Soorten

1. Classrooms (Official) — officiële klasgroepen gekoppeld aan een school of instelling. Aangemaakt door leerkrachten/professoren, studenten treden toe via uitnodiging of code. Gericht op vakken, cursussen en examens
2. Study Groups — privé of semi-privé groepen, aangemaakt door studenten, voor vrienden of projectgroepen. Flexibel en informeel
3. Community — open, publieke leeromgevingen voor iedereen. Gericht op het delen van studiemateriaal op grote schaal

### **Functionaliteiten**

Alle soorten:

- Studosets en visualsets delen
- Sets pinnen

Alleen Classrooms & Study Groups:

- Voortgang volgen (optioneel en privacy-instelbaar)
- Competities en challenges (een student start, anderen joinen)
- Statistieken vergelijken voor gedeelde sets (volledig uitschakelbaar)

## **_Courses, tracks & Verified Sets (fase 2\)_**

Courses — voorgebouwde leertrajecten samengesteld en beheerd door het Studo-team zelf, voor kwaliteit en betrouwbaarheid. Elke course bestaat uit meerdere tracks (modules) rond een onderwerp, examen of studieprogramma. Binnen tracks vinden studenten alle gerelateerde vakken, met daarin Studosets en visualsets gemaakt door Studo.  
Verified Sets — sets met een kwaliteitsbadge.  
Criteria: aangemaakt of gecontroleerd door het Studo-team, of 95%+ accuracy op examen aangetoond, of goedgekeurd door een docent/professor.  
Voordelen: badge "Verified by Studo", prioriteit in zoekresultaten, featured op vakpagina's.  
Incentive voor creators: Verified creators krijgen Select gratis, een leaderboard van beste creators, en later revenue share bij populaire sets.

## **_Zoeken & Ecosysteem (fase 1\)_**

Een geïntegreerde zoekfunctie laat het platform uitgroeien tot een ecosysteem. Studenten zoeken naar Studosets, visualsets, classrooms, andere gebruikers en courses. Sets kunnen openbaar of privé zijn, alle openbare sets zijn doorzoekbaar. Gebruikers leren van en bouwen voort op bestaande sets. Naarmate het aantal gebruikers groeit ontstaat een zelfversterkend platform met herbruikbare leerinhoud.

## **_Studo Select \- Premium & AI-laag (fase 3-4)_**

Studo Select is de premium tier en de AI-laag boven op alle bestaande functionaliteiten. De AI-assistent heet SVEN. Select voegt AI-gestuurde tools toe om sneller van cursusmateriaal naar studeerbare content te komen.

Set conversie (fase 3\) \- upload een PDF of Word-document en SVEN genereert automatisch een Studoset met termen en definities.  
Course linking (fase 4\) \- een student linkt een geüploade cursus aan een set. Bij elke term verschijnt een "Check cursus"-knop die direct naar de relevante sectie brengt. Daarnaast basic semantic search om door cursussen te zoeken op trefwoorden, zinnen of beschrijvingen.

Technische aanpak

- OpenAI API voor text extraction en set generatie
- Start met documenten tot 100 pagina's, uitbreiden naar 500+ bij stabiliteit
- Embeddings via OpenAI voor semantic search
- Menselijke review-stap: gebruiker controleert en past gegenereerde sets aan voor ze definitief worden
-

Kwaliteitsborging

- Beta-fase met 50-100 studenten over verschillende vakgebieden
- Feedback loop via duimpjes
- Geen automatische publicatie, expliciete goedkeuring vereist
- Duidelijke disclaimer: controleer altijd de AI-gegenereerde content

Select bevat concreet: 8 GB file upload, course linking, semantic search, 100 set credits voor SVEN set-generatie.

## **_Visie: een homogeen geheel_**

Studo wordt een extensie van het brein van de student. Een heel semester lang neemt de student notities via SVEN capture, een listening mode die de les meevolgt. Bij de blok opent de student een vak, uploadt de cursus, en SVEN verwerkt die: per hoofdstuk een samenvatting, waar nodig een set of visualset, alles gegoten in een planning via Flow. Het bord groeit en verandert mee met de student, Studo suggereert aangepaste planning afhankelijk van hoe vlot het gaat. Vragen beantwoordt SVEN vanuit de cursus zelf. Op basis van waar de student vaak op klikt bouwt Studo een heatmap die terugkeert in Flow als extra oefenrijen. Bij dreigende overbelasting suggereert het systeem pauze (20-20-2 of pomodoro). Voor het examen genereert SVEN oefenvragen uit de patronen in voorbeeldexamens, inclusief verbetering. De ochtend van het examen doet de student een laatste opvraging via SVEN's voice mode. Wil een student een bepaalde kaart bekijken in een set dan opent die met één klik de exacte sectie in de cursus.  
Na de blok blijft Studo draaien: het volgende semester, de volgende cursus, het volgende jaar. De boards stapelen zich op, de knowledge graph groeit, en SVEN kent de student steeds beter.

### **Beslissingen vastgelegd**

- Vak \= flowcourse: één object, geen dubbeling. Heeft zowel sets als flowrows.
- Vak verplicht bij set-creatie. Naam typen linkt aan bestaand vak of maakt een nieuw aan.
- Board optioneel: boardId op de course is nullable. Vak kan los bestaan en later in een board worden gesleept.
- Boards groeperen vakken per semester.
- Op de vakpagina staan sets en Flow samen: sets bovenaan, Flow-tabel daaronder.
- Een row is een leeractiviteit (Lesson, Notes, Summary, Exercise, Sample Exam, Task), geen afgeleide van een set.
- Een row kan optioneel resources hebben: externe link en/of Studo-set of visualset.
- Mappen vervallen: vak en Flow dekken het groeperings- en opvolgingsprobleem dat mappen probeerden op te lossen. Uit de navigatie en uit set-creatie gehaald. Code mag sluimeren voor een eventuele latere cross-vak use case.

# **Doelgroepen**

**Primair:**

1. Studenten Hoger Onderwijs

- Focus in de eerste jaren na launch:
  - geneeskunde
  - biomedische wetenschappen
  - kinesitherapie
  - STEM-richtingen  

- Complexe, inhoud rijke leerstof is waar Studo maximale impact levert

  → studenten die vooral veel visuele zaken zoals schema’s, anatomie, processen en classificaties van buiten moeten leren

- Talen Markt is verzadigd, dit wordt onze secundaire doelgroep.
- In plaats van ons direct als een speler op de markt te plaatsen met onze Studosets laten we dit organisch groeien via word-of-mouth en marketing. Zo kan deze markt geleidelijk aan benaderd worden.

2. Laatste Jaren Middelbaar Onderwijs

- Beperkt budget: betaalde tools vaak geen optie
- Studo biedt een toegankelijk alternatief met sterke gratis versie
- Authenticatie met Smartschool

3. Zelfstudie / Examens

- Voorbereiding op toelatingsproeven, herexamens of externe certificeringen

* Vanaf de launch is Studo vertaald in het Engels, Nederlands, Frans en Duits,
* Dit wordt gezien als multiplier, onze hoofdmarkt blijft de eerste jaren België en dan specifieker de Nederlandstalige markt.
* wanneer een student hooked is, is die ook direct voor minstens 30 \- 45 minuten. Mensen nemen echt hun tijd om te studeren en openen en sluiten de app ook niet zonder na te denken na 5 minuten. Studeren is iets wat mensen zeer bewust en actief doen.

### **Waardepropositie**

**Voor Studenten:**

- Minder studietijd, betere resultaten
- Overzicht en structuur
- Motiverende gebruikservaring

**Voor Adverteerders:**

- Zeer gerichte doelgroep (studenten)
- Contextuele advertenties gekoppeld aan leerinhoud
- Hoge engagement-graad

# **Verdienmodel ook in fases**

**Fase 0 & 1: Launch**

- Geen inkomsten
- Puur gefocust op userbase opbouwen en database seeden met sets

**Fase 2: Freemium \+ Abonnement**

| Gratis           | Select (€5,99/maand of €39,95/jaar) |
| :--------------- | :---------------------------------- |
| Basis study sets | Alle functionaliteit van Select     |
| Beperkte revisie | SVEN ai                             |
| Advertenties     | Geen Advertenties                   |

**Select pricing:**

- 100 SVEN set-generaties
- 8 GB uploads
- Semantic search
- Course linking

  **Extra credits:**

- 50 credits → €5
- 100 credits → €8

**Fase 2: Studo Ads**  
Integratie:

- Eigen advertentieplatform
- Native placements (niet storend)
- Contextueel relevant (studieboeken, cursussen, tools)

Voordelen:

- Directe inkomsten
- Schaalbaar

Risico's:

- UX-verstoring (wordt beperkt gehouden in gratis versie)
- Lagere inkomsten per gebruiker
- Beperkt aantal adverteerders
- Dedicated sales team in het begin
- Userbase van boven de 10k

**Fase 3: B2B / Education (Lange Termijn)**

- Schoollicenties
- Klassenbeheer
- Teacher dashboards
- White-label mogelijkheden

### **Roadmap**

#### **Fase 1: Foundation en growth**

- Maand 1 \- 24
- Dit is de launchperiode, we gaan voor zo veel mogelijk nieuwe users

- **Kenmerken**:
  - Studosets, Visualsets & Classrooms.
  - Platform seeden met \~200 sets van populaire vakken.
  - Alles gratis, geen advertenties.

- **Opbrengst**: €0  
  → ik ben student en woon thuis, dus mijn maandelijkse kosten zijn virtueel 0  
  → ik kan dit zelf financieren

#### **Fase 2: Monetisatie Start**

- Maand 22 \- 40
- 5000 MAU

- **Kenmerken**:
  - Advertenties op alle pagina's behalve leermodi (wel bij flashkaarten en leren).
  - Start ontwikkeling Studo Select

- **Gebruikersgedrag aannames:**
  - Gemiddeld 3 studeersessies per week per actieve gebruiker
  - Elke sessie \= 60 minuten
  - Ad impressions: 6 per uur (conservatief: 2× homepagina, 2× overzicht, 2× flashcards)
  - Totaal: 3 sessies × 6 ads × 4 weken \= 72 impressions per gebruiker/maand

- **Opbrengsten van ad revenue berekening:**
  - 5.000 MAU × 72 impressions \= 360.000 impressions/maand
  - CPM (cost per mille) voor studenten niche: €2,50 (conservatief, kan €3-5 zijn)
  - Ad revenue: (360.000 / 1.000) × €2,50 \= €900/maand

#### **Fase 3:**

- Maand 40 \- 52
- 20.000 MAU

- **Kenmerken**:
  - Introductie van Studo Select.  
    _(industry standard is conversieratio van 2 \- 5%, wij nemen hier nu 3,5% \= 700 gebruikers)_

- **Opbrengsten (maandelijks):**
  - Premium subscriptions:

  → 700 gebruikers × €5,99/maand \= €4.193

  → Jaarabonnementen (30% kiest jaar, 15% korting):

* 210 gebruikers × €39,95/jaar ÷ 12 \= €699
  - Totaal Select MRR: €4.892

  Ad revenue (gratis users):

- 19.300 gratis users × 72 impressions \= 1.389.600 impressions/maand
- CPM €2,50 → €3.474/maand

  Extra credits (10% van Select users koopt bij):

- 70 gebruikers × €6,50 gemiddeld \= €455

  Totaal opbrengsten: €4.892 \+ €3.474 \+ €455 \= €8.821/maand

#### **Fase 4:**

- Maand 52+
- 50.000+ MAU
- **Kenmerken**:
  - afwerking van Course linking
  - B2B voor scholen (500 scholen)

- Opbrengsten:
  - Premium subscriptions (4% conversie bij schaling):
    - 50.000 × 4% \= 2.000 Select gebruikers
    - Monthly: 1.400 × €5,99 \= €8.386
    - Jaarlijks: 600 × €39,95 ÷ 12 \= €1.998
    - Totaal Select MRR: €10.384

  - Ad revenue (gratis users):
    - 48.000 gratis × 72 impressions \= 3.456.000 impressions
    - CPM €2,50 → €8.640/maand

  - Extra credits (12% koopt bij bij grotere base):
    - 240 gebruikers × €7 gemiddeld \= €1.680

  - B2B schoollicenties:
    - Pricing: €499/jaar per school (tot 500 studenten)
    - 50 scholen in jaar 1 \= €24.950/jaar ÷ 12 \= €2.079/maand

    (Conservative: sales cycle 6-12 maanden, start revenue maand 60\)

- Totaal opbrengsten: €10.384 \+ €8.640 \+ €1.680 \+ €2.079 \= €22.783/maand

# **Concurrentieanalyse**

| Tool    | Sterktes        | Zwaktes            |
| :------ | :-------------- | :----------------- |
| Anki    | Sterk algoritme | Slechte UX         |
| Quizlet | Groot bereik    | Agressieve paywall |
| Notion  | Flexibel        | Niet leergericht   |
| RemNote | Diep            | Complex            |

**Studo's Competitief Voordeel:**

- UX first
- Slimme defaults
- Combineert meerdere tools in één platform

# **Kostenstructuur**

**Hosting:**

- front-end, back-end, database: €14–€23 / maand via Railway
- afbeeldingen storage: €1–€5 / maand via Scaleway voor 3 TB (groeit ook mee)

**AI-kosten (later):**  
Voor 5000 samenvattingen per maand:

| Component       | Maandkost                            |
| --------------- | ------------------------------------ |
| Generatie       | \~$300                               |
| Embeddings      | \~$8                                 |
| Semantic search | \~$100–150                           |
| Extra sets      | \~$2                                 |
| **Totaal**      | **\~$410–460 / maand (\~€380–€430)** |

Marketing:

- €2.000 bij start (groeit mee)

Ontwikkeling:

- solodevelopoment (gratis)
- Vanaf 50.000 gebruikers neem ik 1 iemand anders aan \- groeit uiteindelijk ook mee  


## **_Schaalbaarheid_**

- SaaS-model met lage marginale kosten
- Ads \+ subscriptions \= stabiele inkomstenmix
- Technologie groeit mee met gebruikersbestand

## **_Risico's & Mitigatie_**

| Risico                | Mitigatie                     |
| :-------------------- | :---------------------------- |
| Te veel advertenties  | Duidelijke scheiding free/pro |
| Concurrentie          | UX-focus, niche, snelheid     |
| Burn-out solo founder | Gefaseerde roadmap            |
| AI kosten te hoog     |                               |

- Op dit moment ben ik bezig aan een next js migratie
- 90% van fase 1 bestaat (classrooms, studosets, visualsets)

**Lange Termijn Visie**

- Studo als volledig leer-ecosysteem
- AI-gestuurde personalisatie
- Standaardtool voor studenten
- Mogelijke overname of spin-off

# **Marketing:**

Naast een student in videografie te zijn heb ik ook een achtergrond in videografie op vrij hoog niveau. Ik kan dus zeer simpel aan een productie setup van 50.000 euro voor 0\. Voor effectieve marketing kosten heb ik een budget van 2000 euro max.

### **Core Aanpak: relatability-driven (Upfront Model)**

Strategie: Relatable, humor-gedreven content die student pain points raakt  
→ organische viraliteit  
→ product introductie tijdens exam stress piek.

#### **Waarom dit werkt:**

- Authentiek (ik ben de doelgroep)
- Lage productiekosten (memes \> gepolijste ads)
- Hoge shareability (studenten taggen elkaar)
- Perfect timing (exam periodes \= max engagement)

## **_Content Pillars_**

**1\. Relatable Study Pain (Week 1-4)**

- Memes over studenten-struggles (geen product mentions)
- Doel: Volgers opbouwen, trust creëren
- Formaat: 15-30 sec TikTok/Reels
- Voorbeelden: "POV: 3 dagen voor examen beginnen", "Anatomy students explaining their pain"

**2\. Product Integration (Week 5-8)**

- Zelfde humor vibe \+ casual Studo intro
- Tone: "Ik bouwde dit voor mezelf, might help you"
- Niet salesy, peer recommendation
- Voorbeelden: "How I fixed my study problem", "Study app tier list"

**3\. Exam Season Blitz (Week 9-12)**

- FOMO \+ urgency content
- Direct CTAs tijdens peak stress
- Voorbeelden: "It's exam week and you're fucked", "I studied using only Studo \- results"

## **_Productie & Kosten_**

Unique Advantage: Professionele videografie setup

- Equipment: Ursa Mini, BMPCC 6K/4K, 25 lenzen, kraan, pro lighting
- Skills: Videografie, editing (Premiere/AE), color grading
- Productiekosten: €0-20 (props zoals koffie, stationery)

Content mix:

- 70% phone/lo-fi (authentieke meme vibes)
- 30% cinematic (standout quality wanneer nodig)
- Volume: 2-3 posts per week

### **Budget Breakdown (€2.000 totaal):**

| Categorie         | Bedrag | Details                                         |
| :---------------- | :----- | :---------------------------------------------- |
| Content Productie | €50    | Music licenses (Artlist), props, incidentals    |
| Micro-Influencers | €150   | 1-2 student creators (credibility boost)        |
| Campus Guerrilla  | €400   | 5 ambassadeurs @ €50 \+ flyers (2000 stuks)     |
| Paid Ads          | €1.200 | TikTok Spark (€600), Meta (€500), Google (€100) |
| Contingency       | €200   | A/B tests, emergencies                          |

## **_Distributie_**

**Organic (primair):**

- TikTok (70% effort): Study content is massive, algoritme favors quality
- Instagram Reels (20%): Crosspost \+ slightly gepolijste versies
- YouTube Shorts (10%): SEO lange termijn

**Paid (secondary):**

- Boost alleen organisch succesvolle content (\>10k views)
- TikTok Spark Ads: behoudt authenticiteit \+ engagement
- Target: Studenten 18-25, België/NL, education interests

**Campus Activaties:**

- Ambassadeurs posten in study groups, flyeren in biblio's
- Guerrilla tactics: geen budget, max impact
- Target: 100 signups per ambassadeur

## **_Timeline & Metrics_**

**Pre-Launch (Week 1-6):**

- Seed platform met 20 perfect Studosets/Visualsets
- Build content library (10-15 videos klaar)
- Recruit ambassadeurs

**Launch (Week 7-9):**

- Organic content blitz: 3x posts per week
- Campus activaties starten
- Monitor: welke content werkt? (\>10k views \= winner)

**Exam Period (Week 10-12):**

- Paid ads activeren (boost winners)
- Conversion push: "Exam Pack" upsells
- Max visibility tijdens peak stress

**Success Metrics:**

- Signups: 1.500 (realistisch doel)
- D7 Retention: \>25%
- Active Users (D30): 400+
- Paid Conversions: 50+ @ €7,99 \= €400+ revenue
- CAC: \<€5 per signup

## **_Competitief Voordeel_**

**vs Standaard Startup Marketing:**

- Zij: €5k+ aan agencies/stock footage
- Ik: €50 productie, professionele kwaliteit

**vs Andere Study Apps:**

- Zij: Generic ads, corporate tone
- Ik: Memes, student voice, authentic

**Resultaat**: Content die eruit ziet als €50k budget, kost €50. Algoritme boost door kwaliteit \+ **relatability** \= organische viraliteit zonder ad spend.
