export const normalizeString = (str, removeParentheses = false) => {
  let normalized = str.toLowerCase().trim();

  if (removeParentheses) {
    normalized = normalized.replace(/\s*\([^)]*\)/g, "");
  }

  normalized = normalized.replace(/\s+/g, " ");

  return normalized;
};

export const checkAnswer = (userAnswer, expectedAnswer) => {
  const normalizedUser = normalizeString(userAnswer);
  const normalizedExpected = normalizeString(expectedAnswer);

  if (normalizedUser === normalizedExpected) {
    return true;
  }

  if (expectedAnswer.includes("(") && !userAnswer.includes("(")) {
    const userCleaned = normalizeString(userAnswer, true);
    const expectedCleaned = normalizeString(expectedAnswer, true);

    return userCleaned === expectedCleaned;
  }

  return false;
};

export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Formats duration in minutes to human readable string
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Determines if a card should be marked as mastered
 */
export const shouldBeMastered = (card) => {
  return card.viewcount >= 2 && !card.inQueue && card.lastAnswerCorrect;
};

/**
 * Gets the next card index based on queue and progression logic
 */
export const getNextCardIndex = (
  currentIndex,
  sessionCards,
  queue,
  cardsAnswered,
) => {
  if ((cardsAnswered + 1) % 5 === 0 && queue.length > 0) {
    const nextQueueCard = queue[0];
    return sessionCards.findIndex((c) => c.id === nextQueueCard.id);
  }

  return (currentIndex + 1) % sessionCards.length;
};

export const isLearningComplete = (sessionCards, queue) => {
  if (sessionCards.length === 0) return false;

  const allCardsViewed = sessionCards.every((card) => card.viewcount >= 2);

  // Queue must be empty
  const queueEmpty = queue.length === 0;

  return allCardsViewed && queueEmpty;
};

/**
 * Prepares session cards from API data
 */
export const initializeSessionCards = (apiCards, sessionCards) => {
  return apiCards.map((card) => {
    const sessionCard = sessionCards?.find((sc) => sc.card_id === card.id);

    return {
      id: card.id,
      term: card.term,
      definition: card.definition,
      number: card.number,
      // Session tracking
      sessionCardId: sessionCard?.id || null,
      viewcount: sessionCard?.card_viewcount || 0,
      totalViewcount: sessionCard?.card_total_viewcount || 0,
      inQueue: sessionCard?.inQueue || false,
      mastered: sessionCard?.mastered || false,
      timesRelearned: sessionCard?.times_relearned || 0,
      // Local state
      attempts: 0,
      lastAnswerCorrect: null,
    };
  });
};

export const createSessionUpdateBody = (
  sessionId,
  currentIndex,
  stats,
  currentCardId,
  sessionCards,
) => {
  return {
    index: currentIndex,
    accuracy: stats.accuracy,
    duration_min: Math.floor((Date.now() - stats.startTime) / 60000),
    last_studied: new Date().toISOString(),
    last_seen: currentCardId,
    cards: sessionCards.map((card) => ({
      id: card.sessionCardId,
      card_id: card.id,
      number: card.number,
      card_viewcount: card.viewcount,
      card_total_viewcount: card.totalViewcount,
      inQueue: card.inQueue,
      mastered: card.mastered,
      times_relearned: card.timesRelearned,
    })),
  };
};
