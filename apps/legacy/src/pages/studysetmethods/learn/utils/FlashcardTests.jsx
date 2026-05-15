import {
  checkAnswer,
  getNextCardIndex,
  isLearningComplete,
  initializeSessionCards,
} from "./FlashcardUtils.js";

const mockCards = Array.from({ length: 10 }, (_, i) => ({
  id: `card_${i + 1}`,
  term: `Term ${i + 1}`,
  definition: `Definition ${i + 1}`,
  viewcount: 0,
  inQueue: false,
  mastered: false,
}));

let queue = [];
let cardsAnswered = 0;
let currentIndex = 0;

const answerCard = (index, isCorrect) => {
  const card = mockCards[index];
  card.viewcount++;
  cardsAnswered++;

  if (!isCorrect && !card.inQueue) {
    card.inQueue = true;
    queue.push(card);
  } else if (isCorrect && card.inQueue) {
    card.inQueue = false;
    queue = queue.filter((c) => c.id !== card.id);
    if (card.viewcount >= 2) card.mastered = true;
  } else if (isCorrect) {
    if (card.viewcount >= 2) card.mastered = true;
  }
};

answerCard(0, true);
answerCard(1, false);
answerCard(2, true);
answerCard(3, true);
answerCard(4, false);

currentIndex = 1;
answerCard(1, false);
answerCard(5, true);
answerCard(6, false);
answerCard(7, true);
answerCard(8, true);

currentIndex = 1; // Card 2
answerCard(1, true);
answerCard(9, true);

answerCard(4, true);
answerCard(6, true);

const complete = isLearningComplete(mockCards, queue);

const testCards = Array.from({ length: 5 }, (_, i) => ({
  id: `card_${i + 1}`,
  inQueue: false,
}));

const testQueue = [testCards[1], testCards[3]];

let nextIndex = getNextCardIndex(0, testCards, testQueue, 1);

nextIndex = getNextCardIndex(2, testCards, testQueue, 4);

nextIndex = getNextCardIndex(4, testCards, [], 9);

const apiCards = [
  { id: "card_1", term: "Term 1", definition: "Def 1", number: 1 },
  { id: "card_2", term: "Term 2", definition: "Def 2", number: 2 },
  { id: "card_3", term: "Term 3", definition: "Def 3", number: 3 },
];

const sessionCards = [
  {
    id: "session_card_1",
    card_id: "card_1",
    card_viewcount: 1,
    card_total_viewcount: 5,
    inQueue: false,
    mastered: false,
    times_relearned: 0,
  },
  {
    id: "session_card_2",
    card_id: "card_2",
    card_viewcount: 0,
    card_total_viewcount: 2,
    inQueue: true,
    mastered: false,
    times_relearned: 1,
  },
];

const initialized = initializeSessionCards(apiCards, sessionCards);
