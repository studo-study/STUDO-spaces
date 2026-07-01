export const mockDocument = {
  id: "doc_4471",
  fileName: "cursus_statistiek.pdf",
  r2Key: "documents/doc_4471.pdf",
  pageCount: 8,
  status: "ready",
  uploadedAt: "2026-07-01T14:00:00Z",
};

export const mockPages = [
  {
    id: "page_4471_1",
    documentId: "doc_4471",
    pageNumber: 1,
    rawText: `Hoofdstuk 1: Inleiding tot Statistiek

Statistiek is de wetenschap die zich bezighoudt met het verzamelen, analyseren, interpreteren en presenteren van data. Het vakgebied wordt onderverdeeld in twee grote takken: beschrijvende statistiek en inferentiële statistiek.

1.1 Beschrijvende Statistiek

Beschrijvende statistiek omvat methoden om data samen te vatten aan de hand van maten zoals het gemiddelde, de mediaan, de modus en de standaardafwijking. Deze maten geven een eerste indruk van de centrale tendens en de spreiding binnen een dataset.

1.2 Inferentiële Statistiek

Inferentiële statistiek laat toe om op basis van een steekproef uitspraken te doen over een volledige populatie. Dit gebeurt via hypothesetoetsing en betrouwbaarheidsintervallen, technieken die in latere hoofdstukken aan bod komen. Een centraal begrip is de steekproef, een deelverzameling van een populatie die representatief moet zijn.`,
    extractedAt: "2026-07-01T14:02:11Z",
    embeddingStatus: "ready",
  },
  {
    id: "page_4471_2",
    documentId: "doc_4471",
    pageNumber: 2,
    rawText: `Hoofdstuk 2: Variabelen en Data

2.1 Soorten Variabelen

Binnen de statistiek onderscheiden we verschillende types variabelen. Categorische variabelen kunnen nominaal zijn, categorieën zonder natuurlijke volgorde zoals geslacht, of ordinaal, categorieën met een natuurlijke volgorde zoals opleidingsniveau. Numerieke variabelen zijn ofwel discreet, telbare waarden zoals aantal kinderen, ofwel continu, meetbare waarden zoals lengte of gewicht.

2.2 Data Verzamelen

Data kan op verschillende manieren verzameld worden via enquêtes, experimenten, observationele studies of bestaande databronnen. De keuze van methode hangt af van de onderzoeksvraag en de beschikbare middelen. Een veelgemaakte fout bij beginnende studenten is het toepassen van technieken voor numerieke data op categorische variabelen.`,
    extractedAt: "2026-07-01T14:02:14Z",
    embeddingStatus: "ready",
  },
];

export const mockSummary = {
  id: "sum_8f2a1c",
  documentId: "doc_4471",
  documentHash: "a3f9e2c8b1d4",
  status: "ready",
  overallSummary:
    "Dit document behandelt de volledige basiscursus statistiek: van beschrijvende statistiek en kansrekening tot hypothesetoetsing en regressie-analyse.",
  chapters: [
    {
      id: "ch_1",
      title: "Hoofdstuk 1: Inleiding tot Statistiek",
      order: 1,
      sourcePages: [1, 1],
      summary:
        "Introductie van statistiek als vakgebied, met de twee hoofdtakken: beschrijvend en inferentieel.",
      subchapters: [
        {
          id: "ch_1_1",
          title: "1.1 Beschrijvende Statistiek",
          order: 1,
          sourcePages: [1, 1],
          summary:
            "Behandelt centrale tendens en spreiding via gemiddelde, mediaan, modus en standaardafwijking.",
        },
        {
          id: "ch_1_2",
          title: "1.2 Inferentiële Statistiek",
          order: 2,
          sourcePages: [1, 1],
          summary:
            "Introduceert steekproeven, hypothesetoetsing en betrouwbaarheidsintervallen om uitspraken over een populatie te doen.",
        },
      ],
    },
    {
      id: "ch_2",
      title: "Hoofdstuk 2: Variabelen en Data",
      order: 2,
      sourcePages: [2, 2],
      summary:
        "Overzicht van variabeletypes en manieren om data te verzamelen.",
      subchapters: [
        {
          id: "ch_2_1",
          title: "2.1 Soorten Variabelen",
          order: 1,
          sourcePages: [2, 2],
          summary:
            "Onderscheid tussen categorische (nominaal, ordinaal) en numerieke (discreet, continu) variabelen.",
        },
        {
          id: "ch_2_2",
          title: "2.2 Data Verzamelen",
          order: 2,
          sourcePages: [2, 2],
          summary:
            "Bespreekt enquêtes, experimenten, observationele studies en secundaire databronnen als verzamelmethoden.",
        },
      ],
    },
    {
      id: "ch_3",
      title: "Hoofdstuk 3: Kansrekening",
      order: 3,
      sourcePages: [3, 4],
      summary:
        "Basisprincipes van kansrekening als fundament voor inferentiële statistiek.",
      subchapters: [
        {
          id: "ch_3_1",
          title: "3.1 Kansruimte en Gebeurtenissen",
          order: 1,
          sourcePages: [3, 3],
          summary:
            "Definitie van kansruimte, uitkomstenruimte en de axioma's van Kolmogorov.",
        },
        {
          id: "ch_3_2",
          title: "3.2 Voorwaardelijke Kans",
          order: 2,
          sourcePages: [3, 4],
          summary:
            "Voorwaardelijke kans, onafhankelijkheid en de regel van Bayes.",
        },
        {
          id: "ch_3_3",
          title: "3.3 Combinatoriek",
          order: 3,
          sourcePages: [4, 4],
          summary:
            "Permutaties, combinaties en toepassingen bij het tellen van uitkomsten.",
        },
      ],
    },
    {
      id: "ch_4",
      title: "Hoofdstuk 4: Kansverdelingen",
      order: 4,
      sourcePages: [4, 5],
      summary:
        "Overzicht van discrete en continue kansverdelingen en hun eigenschappen.",
      subchapters: [
        {
          id: "ch_4_1",
          title: "4.1 Discrete Verdelingen",
          order: 1,
          sourcePages: [4, 5],
          summary:
            "Binomiale verdeling, Poisson-verdeling en hun toepassingen.",
        },
        {
          id: "ch_4_2",
          title: "4.2 Continue Verdelingen",
          order: 2,
          sourcePages: [5, 5],
          summary:
            "Normale verdeling, standaardnormaalverdeling en de centrale limietstelling.",
        },
      ],
    },
    {
      id: "ch_5",
      title: "Hoofdstuk 5: Hypothesetoetsing",
      order: 5,
      sourcePages: [5, 6],
      summary:
        "Formele procedure voor het toetsen van statistische hypothesen.",
      subchapters: [
        {
          id: "ch_5_1",
          title: "5.1 Nulhypothese en Alternatieve Hypothese",
          order: 1,
          sourcePages: [5, 6],
          summary: "Formulering van H0 en H1, type I- en type II-fouten.",
        },
        {
          id: "ch_5_2",
          title: "5.2 P-waarde en Significantieniveau",
          order: 2,
          sourcePages: [6, 6],
          summary:
            "Interpretatie van p-waarden en keuze van significantieniveau alfa.",
        },
        {
          id: "ch_5_3",
          title: "5.3 T-toets en Z-toets",
          order: 3,
          sourcePages: [6, 7],
          summary:
            "Toepassing van t-toets voor kleine steekproeven en z-toets voor grote steekproeven.",
        },
      ],
    },
    {
      id: "ch_6",
      title: "Hoofdstuk 6: Regressie-analyse",
      order: 6,
      sourcePages: [7, 8],
      summary:
        "Lineaire regressie als methode om verbanden tussen variabelen te modelleren.",
      subchapters: [
        {
          id: "ch_6_1",
          title: "6.1 Enkelvoudige Lineaire Regressie",
          order: 1,
          sourcePages: [7, 7],
          summary: "Kleinste-kwadratenmethode, regressielijn en residuanalyse.",
        },
        {
          id: "ch_6_2",
          title: "6.2 Meervoudige Regressie",
          order: 2,
          sourcePages: [7, 8],
          summary:
            "Uitbreiding naar meerdere voorspellers, multicollineariteit en modelselectie.",
        },
        {
          id: "ch_6_3",
          title: "6.3 Correlatie vs. Causaliteit",
          order: 3,
          sourcePages: [8, 8],
          summary:
            "Waarom correlatie geen causaliteit impliceert en veelgemaakte interpretatiefouten.",
        },
      ],
    },
  ],
  model: "gemini-2.5-flash",
  generatedAt: "2026-07-01T14:32:00Z",
};
