import Left from "../../../../public/assets/icons/left.svg";
import { useState } from "react";

export default function Flashcard({ Cards }) {
  const cards = Cards;
  let [index, setIndex] = useState(0);
  let [flip, setFlip] = useState(false);
  let CurrentCard = Cards[index];
  const [animate, setAnimate] = useState(false);

  const toggleForward = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 700);
    if (index < Cards.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }

    setFlip(false);
  };

  const toggleBack = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 700);
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(Cards.length - 1);
    }
    setFlip(false);
  };

  const toggleFlip = () => {
    setFlip((prev) => !prev);
  };

  return (
    <div className="w-full h-fit flex flex-col gap-10">
      <div className={`max-w-full flex justify-center items-center
			  bg-studowhite min-h-100 cursor-pointer w-full gap-5 border-1 border-transparent border-studoborder rounded-4xl
			  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-7 pl-5 pr-5 backdrop-blur-xs
			dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
			  border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2] 
  ${animate ? "animate__animated animate__fadeInLeft duration-100" : ""}`}
           onClick={toggleFlip}>
        {flip ? CurrentCard.definition : CurrentCard.term}
      </div>
      <div className="w-full h-fit flex flex-row justify-center items-center gap-5">
        <div className="flex justify-center items-center dark:border-gray-700 min-w-12 h-12 rounded-full
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white font-atrament text-xl">
          <img onClick={toggleBack} src={Left} alt="left"
               className="h-8 dark:invert dark:brightness-0 cursor-pointer" />
        </div>
        <div className="flex justify-center items-center dark:border-gray-700 min-w-25 h-12 rounded-full
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a] pl-8 pr-8
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white font-atrament text-xl">
          <span className="font-sfpro text-base flex flex-row justify-center">
            {index + 1} / {Object.keys(Cards).length}
          </span>
        </div>
        <div className="flex justify-center items-center dark:border-gray-700 w-12 h-12 rounded-full
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white font-atrament text-xl">
          <img onClick={toggleForward} src={Left} alt="left"
               className="h-8 dark:invert dark:brightness-0 cursor-pointer rotate-180" />
        </div>
      </div>
    </div>);
}