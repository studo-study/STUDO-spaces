import { useState } from "react";

export default function Flashcard({
                                    question,
                                    answer,
                                    showAnswer,
                                    viewcount,
                                    inQueue,
                                    mastered
                                  }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full relative">

      <div className="absolute -top-2 left-3 flex gap-2 z-10">
        {inQueue && (
          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
            In wachtrij
          </span>
        )}
        {mastered && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            ✓ Beheerst
          </span>
        )}
        <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
          {viewcount}/2
        </span>
      </div>


      <div
        className="w-full min-h-[280px] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer
          bg-[#e7e7e747] hover:bg-[#d7d7d747]
          border-[0.5px] border-solid border-[#8181812f]
          dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors"
        onClick={() => showAnswer && setIsFlipped(!isFlipped)}
      >
        <div className="text-center">
          <p className="text-xs opacity-40 mb-3 uppercase">
            {showAnswer && isFlipped ? "Antwoord" : "Vraag"}
          </p>
          <p className="text-xl font-medium">
            {showAnswer && isFlipped ? answer : question}
          </p>
        </div>

        {showAnswer && (
          <p className="text-xs opacity-30 mt-4">
            Klik om te draaien
          </p>
        )}
      </div>
    </div>
  );
}