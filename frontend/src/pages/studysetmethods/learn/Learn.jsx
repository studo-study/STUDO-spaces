import Progressbar from "./components/Progressbar.jsx";
import Flashcard from "./components/Flashcard.jsx";
import AnswerInput from "./components/Answerinput.jsx";
import QueueIndicator from "./components/QueueIndicator.jsx";
import CompletionScreen from "./components/CompletionScreen.jsx";
import { useTranslation } from "react-i18next";
import useSWR, { mutate } from "swr";
import { put } from "../../../api/index.js";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  checkAnswer,
  getNextCardIndex,
  isLearningComplete as checkComplete,
  initializeSessionCards,
  createSessionUpdateBody
} from "./utils/FlashcardUtils.js";

export default function Learn() {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    data: studyset,
    isLoading,
    error
  } = useSWR(`studysets/${id}`);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCards, setSessionCards] = useState([]);
  const [queue, setQueue] = useState([]);
  const [cardsAnswered, setCardsAnswered] = useState(0);
  const [termAsQuestion, setTermAsQuestion] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    accuracy: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    startTime: Date.now()
  });

  useEffect(() => {
    if (!studyset?.session?.cards || !studyset?.cards) return;

    const initializedCards = initializeSessionCards(
      studyset.cards,
      studyset.session.cards
    );

    setSessionCards(initializedCards);

    const initialQueue = initializedCards.filter(card => card.inQueue);
    setQueue(initialQueue);

    if (studyset.session.index) {
      setCurrentIndex(studyset.session.index);
    }
  }, [studyset]);

  const currentCard = useMemo(() => {
    if (sessionCards.length === 0) return null;
    return sessionCards[currentIndex];
  }, [sessionCards, currentIndex]);


  const isComplete = useMemo(() => {
    return checkComplete(sessionCards, queue);
  }, [sessionCards, queue]);


  const handleCheckAnswer = () => {
    if (!currentCard || userAnswer.trim() === "") return;

    const expectedAnswer = termAsQuestion ? currentCard.definition : currentCard.term;
    const isCorrect = checkAnswer(userAnswer, expectedAnswer);

    const updatedCards = sessionCards.map(card => {
      if (card.id === currentCard.id) {
        const newViewcount = card.viewcount + 1;
        const updatedCard = {
          ...card,
          viewcount: newViewcount,
          totalViewcount: card.totalViewcount + 1,
          attempts: card.attempts + 1,
          lastAnswerCorrect: isCorrect
        };

        if (!isCorrect && !card.inQueue) {
          updatedCard.inQueue = true;
          setQueue(prev => [...prev, updatedCard]);
        } else if (isCorrect && card.inQueue) {
          updatedCard.inQueue = false;
          updatedCard.mastered = newViewcount >= 2;
          setQueue(prev => prev.filter(c => c.id !== card.id));
        } else if (isCorrect && newViewcount >= 2) {
          updatedCard.mastered = true;
        }

        return updatedCard;
      }
      return card;
    });

    setSessionCards(updatedCards);
    setShowAnswer(true);

    setSessionStats(prev => ({
      ...prev,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      accuracy: Math.round(((prev.correctAnswers + (isCorrect ? 1 : 0)) / (prev.totalAnswers + 1)) * 100)
    }));

    setCardsAnswered(prev => prev + 1);
  };

  const handleNextCard = async () => {
    setShowAnswer(false);
    setUserAnswer("");

    const nextIndex = getNextCardIndex(currentIndex, sessionCards, queue, cardsAnswered);
    setCurrentIndex(nextIndex);

    await saveProgress();
  };

  const saveProgress = async () => {
    if (!studyset?.session?.id) return;

    const updateBody = createSessionUpdateBody(
      studyset.session.id,
      currentIndex,
      sessionStats,
      currentCard?.id,
      sessionCards
    );

    try {
      await put(`studysessions/${studyset.session.id}`, updateBody);
      mutate(`studysets/${id}`);
    } catch (error) {
    }
  };

  const toggleQuestionMode = () => {
    setTermAsQuestion(prev => !prev);
    setShowAnswer(false);
    setUserAnswer("");
  };

  useEffect(() => {
    if (isComplete) {
      saveProgress();
      // TODO: suckt
    }
  }, [isComplete]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl opacity-70">{t("loading")}</div>
      </div>
    );
  }

  if (error || !studyset) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{t("error_loading_set")}</div>
      </div>
    );
  }

  if (isComplete) {
    const sessionDuration = Math.floor((Date.now() - sessionStats.startTime) / 60000);

    return (
      <CompletionScreen
        studysetId={id}
        stats={sessionStats}
        totalCards={sessionCards.length}
        sessionDuration={sessionDuration}
      />
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-baseline pt-35">
      <div
        className="flex w-full sm:w-1/2 md:w-5/12 lg:w-5/12 xl:w-2/5 2xl:w-2/5 max-w-[700px] flex-col items-center justify-center gap-6 px-4">

        <div className="w-full flex flex-row items-center justify-between">
          <span className="text-2xl font-semibold truncate">
            {studyset.title || t("Untitled Set")}
          </span>

          <button
            onClick={toggleQuestionMode}
            className="px-4 py-2 text-sm rounded-xl bg-[#e7e7e747] opacity-70 hover:opacity-100
              border-[0.5px] border-solid border-[#8181812f]
              dark:bg-gray-700 dark:text-white transition-opacity"
          >
            {termAsQuestion ? "Term → Definitie" : "Definitie → Term"}
          </button>
        </div>

        <Progressbar
          current={cardsAnswered}
          total={sessionCards.length * 2}
          accuracy={sessionStats.accuracy}
        />

        <QueueIndicator
          queueLength={queue.length}
          nextCheckIn={5 - (cardsAnswered % 5)}
        />

        {currentCard && (
          <Flashcard
            question={termAsQuestion ? currentCard.term : currentCard.definition}
            answer={termAsQuestion ? currentCard.definition : currentCard.term}
            showAnswer={showAnswer}
            viewcount={currentCard.viewcount}
            inQueue={currentCard.inQueue}
            mastered={currentCard.mastered}
          />
        )}

        {!showAnswer ? (
          <AnswerInput
            value={userAnswer}
            onChange={setUserAnswer}
            onSubmit={handleCheckAnswer}
            disabled={!currentCard}
          />
        ) : (
          <div className="w-full flex flex-col gap-3">
            <div className={`w-full p-3 rounded-xl text-center font-medium
              ${currentCard.lastAnswerCorrect
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}>
              {currentCard.lastAnswerCorrect ? "✓ Correct" : "✗ Fout"}
            </div>

            <button
              onClick={handleNextCard}
              className="w-full px-6 py-3 rounded-xl font-medium
                bg-[#e7e7e747] hover:bg-[#d7d7d747]
                border-[0.5px] border-solid border-[#8181812f]
                dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors"
            >
              Volgende kaart
            </button>
          </div>
        )}

        <div className="w-full flex justify-between text-sm opacity-50 mt-2">
          <span>Nauwkeurigheid: {sessionStats.accuracy}%</span>
          <span>Over: {sessionCards.filter(c => !c.mastered).length}</span>
        </div>

        <Link
          to={`/studysets/${id}`}
          className="text-sm opacity-50 hover:opacity-100 transition-opacity"
        >
          ← Terug naar set
        </Link>
      </div>
    </div>
  );
}