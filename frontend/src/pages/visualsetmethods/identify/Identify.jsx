import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import LeftArrow from "../../../../public/assets/icons/left.svg";
import PinIcon from "../../../../public/assets/icons/pin.svg";
import WrongPinIcon from "../../../../public/assets/icons/wrongPin.svg";
import HalfCorrectPinIcon from "../../../../public/assets/icons/halfcorrectPin.svg";
import CorrectPinIcon from "../../../../public/assets/icons/correctPin.svg";
import CardsEndImage from "../../../../public/assets/icons/icon.png";
import { put } from "../../../api/index.js";

export default function Identify() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { data: visualset, isLoading, error } = useSWR(`visualsets/${id}`);

  const [pins, setPins] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queueIndex, setQueueIndex] = useState(0);
  const [queueMode, setQueueMode] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [answerState, setAnswerState] = useState(null);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hintText, setHintText] = useState("");
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    if (visualset?.images && visualset?.session) {
      const allPins = visualset.images.flatMap((img, imgIndex) =>
        (img.pins?.pins || img.pins || []).map((pin) => {
          const sessionPin = visualset.session.pins?.find(
            (sp) => sp.pin_id === pin.id
          );
          return {
            ...pin,
            imageIndex: imgIndex,
            imageUrl: img.url,
            seen: sessionPin?.pin_viewcount || 0,
            x: pin.x || 0,
            y: pin.y || 0
          };
        })
      );

      setPins(allPins);

      const initialQueue = allPins.filter((pin) => {
        const sessionPin = visualset.session.pins?.find(
          (sp) => sp.pin_id === pin.id
        );
        return sessionPin?.inQueue;
      });
      setQueue(initialQueue);

      setCurrentIndex(visualset.session?.index || 0);

      const allStudied = allPins.every((pin) => pin.seen >= 2);
      if (allStudied && initialQueue.length > 0) {
        setQueueMode(true);
      }

      if (allStudied && initialQueue.length === 0) {
        setIsComplete(true);
      }
    }
  }, [visualset]);

  useEffect(() => {
    if (!showingAnswer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showingAnswer, currentIndex, queueIndex, queueMode]);

  const getCurrentPin = () => {
    if (queueMode) {
      return queue[queueIndex];
    }
    return pins[currentIndex];
  };

  const currentPin = getCurrentPin();

  const handleSubmit = (answer) => {
    if (!currentPin || showingAnswer) return;

    const isCorrect =
      answer.trim().toLowerCase() ===
      currentPin.definition.trim().toLowerCase();

    setAnswerState(isCorrect ? "correct" : "wrong");
    setDisplayedAnswer(answer);
    setShowingAnswer(true);

    if (queueMode) {
      handleQueueAnswer(isCorrect);
    } else {
      handleNormalAnswer(isCorrect);
    }
  };

  const handleNormalAnswer = (isCorrect) => {
    const updatedPins = [...pins];
    const pin = updatedPins[currentIndex];

    if (pin.seen < 2) {
      pin.seen++;

      if (!isCorrect) {
        if (!queue.find((p) => p.id === pin.id)) {
          setQueue([...queue, pin]);
        }
      }
    }

    setPins(updatedPins);

    setTimeout(() => {
      if (answerState === "wrong") {
        setDisplayedAnswer(currentPin.definition);
        setTimeout(() => {
          moveToNextPin();
        }, 1800);
      } else {
        moveToNextPin();
      }
    }, isCorrect ? 1500 : 1800);
  };

  const handleQueueAnswer = (isCorrect) => {
    setTimeout(() => {
      if (answerState === "wrong") {
        setDisplayedAnswer(currentPin.definition);
        setTimeout(() => {
          moveToNextQueuePin(isCorrect);
        }, 1800);
      } else {
        moveToNextQueuePin(isCorrect);
      }
    }, isCorrect ? 1500 : 1800);
  };

  const moveToNextPin = async () => {
    setShowingAnswer(false);
    setAnswerState(null);
    setDisplayedAnswer("");
    setUserInput("");
    setHintText("");
    setShowHint(false);

    const allStudied = pins.every((p) => p.seen >= 2);

    if (allStudied) {
      if (queue.length > 0) {
        setQueueMode(true);
        setQueueIndex(0);
      } else {
        await saveToDatabase();
        setIsComplete(true);
      }
    } else {
      const nextIndex = (currentIndex + 1) % pins.length;
      setCurrentIndex(nextIndex);
      await saveToDatabase();
    }
  };

  const moveToNextQueuePin = async (wasCorrect) => {
    setShowingAnswer(false);
    setAnswerState(null);
    setDisplayedAnswer("");
    setUserInput("");
    setHintText("");
    setShowHint(false);

    if (wasCorrect) {
      const newQueue = queue.filter((p, i) => i !== queueIndex);
      setQueue(newQueue);

      if (newQueue.length === 0) {
        await saveToDatabase();
        setIsComplete(true);
      } else {
        if (queueIndex >= newQueue.length) {
          setQueueIndex(0);
        }
        await saveToDatabase();
      }
    } else {
      const nextIndex = (queueIndex + 1) % queue.length;
      setQueueIndex(nextIndex);
      await saveToDatabase();
    }
  };

  const saveToDatabase = async () => {
    if (!visualset?.session?.id) return;

    try {
      const sessionPins = pins.map((pin) => ({
        id: visualset.session.pins?.find((sp) => sp.pin_id === pin.id)?.id,
        pin_id: pin.id,
        pin_viewcount: pin.seen,
        inQueue: queue.some((q) => q.id === pin.id),
        session_id: visualset.session.id,
        owner_id: visualset.user_id
      }));

      await put(`studysessions/${visualset.session.id}`, {
        arg: {
          pins: sessionPins,
          index: queueMode ? queueIndex : currentIndex,
          user_id: visualset.user_id
        }
      });
    } catch (error) {
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !showingAnswer) {
      e.preventDefault();
      if (userInput.trim()) {
        handleSubmit(userInput);
      }
    }
  };

  const handleHint = () => {
    if (currentPin?.definition) {
      setHintText(`The first letter is ${currentPin.definition[0].toUpperCase()}`);
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
      }, 4000);
    }
  };

  const handleIDontKnow = () => {
    handleSubmit(" ");
  };

  const handleReset = async () => {
    const resetPins = pins.map((p) => ({ ...p, seen: 0 }));
    setPins(resetPins);
    setQueue([]);
    setQueueMode(false);
    setCurrentIndex(0);
    setQueueIndex(0);
    setIsComplete(false);

    try {
      await put(`studysessions/${visualset.session.id}/reset`, {
        arg: {
          user_id: visualset.user_id
        }
      });
    } catch (error) {
    }
  };

  const getPinIcon = (pin) => {
    const isInQueue = queue.some((q) => q.id === pin.id);
    if (isInQueue) return WrongPinIcon;
    if (pin.seen === 1) return HalfCorrectPinIcon;
    if (pin.seen >= 2) return CorrectPinIcon;
    return PinIcon;
  };

  const getProgress = () => {
    if (!pins.length) return { current: 0, total: 0, percentage: 0 };

    if (queueMode) {
      return {
        current: queueIndex + 1,
        total: queue.length,
        percentage: Math.floor(((queueIndex + 1) / queue.length) * 100)
      };
    }

    const totalSeen = pins.reduce((sum, p) => sum + p.seen, 0);
    const totalRequired = pins.length * 2;
    return {
      current: totalSeen,
      total: totalRequired,
      percentage: Math.round((totalSeen / totalRequired) * 100)
    };
  };

  const progress = getProgress();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl">{t("Loading...")}</div>
      </div>
    );
  }

  if (error || !visualset) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{t("Error loading set")}</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-bg-white dark:bg-bg-dark transition-colors duration-300">
      <header className="w-full h-fit px-[3vw] py-[2vh]">
        <div className="flex flex-row items-center gap-[2vw] bg-transparent">
          <Link to={`/visualset/${id}`} className="w-[5vh] pb-[1.3vh] cursor-pointer">
            <img src={LeftArrow} alt="back" className="w-full dark:invert dark:brightness-0" />
          </Link>
          <Link to="/" className="no-underline">
            <span
              className="font-atrament text-[3vh] font-bold text-studodarkblue dark:text-white transition-colors duration-300">
              STUDO
            </span>
          </Link>
        </div>
      </header>

      <main className="w-full h-[calc(100vh-10vh)]">
        <div className="w-full h-full flex flex-row pt-[1%]">
          <div className="w-1/4 h-full flex relative">
            {[...Array(5)].map((_, i) => (
              <div
                key={`left-${i}`}
                className="firework"
                style={{ display: isComplete ? "flex" : "none" }}
              />
            ))}
          </div>

          <div className="w-1/2 h-full flex gap-[3vh] flex-col items-center">
            <div className="h-[6vh] w-full flex justify-end flex-col gap-[0.5vh]">
              <div className="flex w-full h-fit flex-row justify-between">
                <span
                  className="text-[1vh] font-light text-studodarkblue dark:text-gray-300 transition-colors duration-300">
                  {queueMode ? t("Revision") : t("Progress")}
                </span>
                <span
                  className="text-[1vh] font-light text-studodarkblue dark:text-gray-300 transition-colors duration-300">
                  <span>{progress.current}</span> / <span>{progress.total}</span>
                </span>
              </div>
              <div
                className="w-full h-[1.5vh] rounded-full flex justify-start overflow-hidden bg-white/40 dark:bg-gray-700/40 backdrop-blur-md relative transition-colors duration-300">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#98c0cd] to-[#abd7c1] dark:from-[#6a9fb5] dark:to-[#7db896] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3)] transition-all duration-500 ease-in-out flex items-center justify-center"
                  style={{ width: `${progress.percentage}%` }}
                >
                  <div className="progressbar-glow" />
                </div>
              </div>
            </div>

            {isComplete ? (
              <div className="w-full flex justify-center items-center h-full">
                <div
                  className="w-2/5 rounded-[50px] p-[5%] gap-[1vh] flex flex-col items-center justify-center animate-[fadeInLeft_1s] bg-studodark dark:bg-gray-800/30 backdrop-blur-md border border-studoborder dark:border-gray-700 rounded-[30px] shadow-[3px_3px_8px_#bebebe,-3px_-3px_8px_#d1e0ec80] dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#2a2a3a] transition-all duration-300">
                  <div className="w-full h-full flex flex-col justify-center items-center gap-[3vh]">
                    <img src={CardsEndImage} alt="" className="w-[25vh] dark:brightness-90" />
                    <span
                      className="text-[3vh] font-atrament text-studodarkblue dark:text-white text-center transition-colors duration-300">
                      {t("The set is fully studied")}
                    </span>
                    <div className="flex justify-center items-center w-full gap-[5vh]">
                      <span
                        onClick={handleReset}
                        className="inline-flex flex-row items-center gap-[0.6em] h-[4.5vh] px-[2em] font-atrament font-normal text-[1.8vh] text-studodarkblue dark:text-white rounded-[50px] bg-[#cccccc47] dark:bg-gray-700/50 cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 border-[0.5px] border-solid border-[#8181812f] dark:border-gray-600 border-t-white dark:border-t-gray-500 border-l-[#f2f2f2] dark:border-l-gray-500 shadow-[2px_2px_4px_#35557120,-2px_-2px_4px_#ffffff30] dark:shadow-[3px_3px_6px_#1a1a2a,-3px_-3px_6px_#2a2a3a] hover:bg-studogreen dark:hover:bg-studogreen/80"
                      >
                        {t("Revise")}
                      </span>
                      <Link
                        to={`/visualset/${id}`}
                        className="inline-flex flex-row items-center gap-[0.6em] h-[4.5vh] px-[2em] font-atrament font-normal text-[1.8vh] text-studodarkblue dark:text-white rounded-[50px] bg-[#cccccc47] dark:bg-gray-700/50 cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 border-[0.5px] border-solid border-[#8181812f] dark:border-gray-600 border-t-white dark:border-t-gray-500 border-l-[#f2f2f2] dark:border-l-gray-500 shadow-[2px_2px_4px_#35557120,-2px_-2px_4px_#ffffff30] dark:shadow-[3px_3px_6px_#1a1a2a,-3px_-3px_6px_#2a2a3a] hover:bg-[#a1acd9] dark:hover:bg-[#a1acd9]/80 no-underline"
                      >
                        {t("Back")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full flex justify-center items-center">
                  <div
                    className="relative h-fit w-fit overflow-hidden p-5 h-[55vh] bg-studodark dark:bg-gray-800/30 backdrop-blur-md border border-studoborder dark:border-gray-700 rounded-[30px] shadow-[3px_3px_8px_#bebebe,-3px_-3px_8px_#ffffff30] dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#2a2a3a] animate-[bounceIn_1s] transition-all duration-300">
                    <img
                      src={currentPin?.imageUrl}
                      alt="study"
                      className="w-full h-auto max-h-[calc(55vh-40px)] rounded-[10px] block bg-transparent object-contain"
                    />
                    <div
                      className="absolute top-5 left-5 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] w-[calc(100%-40px)] h-[calc(100%-40px)] z-10 pointer-events-none">
                      {pins.map((pin, index) => {
                        const isCurrentPin = queueMode
                          ? queue[queueIndex]?.id === pin.id
                          : pins[currentIndex]?.id === pin.id;

                        return (
                          <div
                            key={`${pin.x}-${pin.y}-${index}`}
                            className="aspect-square w-full bg-transparent box-border cursor-pointer relative pointer-events-auto rounded-[50px] p-0 overflow-visible"
                            style={{
                              gridColumn: pin.x + 1,
                              gridRow: pin.y + 1
                            }}
                          >
                            <img
                              src={getPinIcon(pin)}
                              alt="pin"
                              className={`absolute w-full h-full top-1/2 left-1/2 transition-all duration-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:scale-150 ${
                                isCurrentPin ? "animate-[bigTada_1.5s_infinite]" : ""
                              }`}
                              style={{
                                transform: "translate(-50%, -50%)"
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div
                    className="w-full p-[2%] h-fit flex flex-col items-start gap-[2vh] bg-studodark dark:bg-gray-800/30 backdrop-blur-md border border-studoborder dark:border-gray-700 rounded-[30px] shadow-[3px_3px_8px_#bebebe,-3px_-3px_8px_#ffffff30] dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#2a2a3a] animate-[bounceIn_1s] transition-all duration-300">
                    <div className="w-full px-[3%] flex gap-[3vh] justify-between items-center">
                      <span
                        className="flex items-center h-[5vh] rounded-[15px] border-none text-[1.2vh] text-studodarkblue dark:text-gray-300 bg-transparent cursor-pointer transition-opacity duration-1000"
                        style={{ opacity: showHint ? 1 : 0 }}
                      >
                        {hintText}
                      </span>
                      <div className="w-fit flex gap-[3vh] justify-end">
                        <button
                          onClick={handleHint}
                          className="h-[3vh] rounded-[15px] border-none text-[1.2vh] text-studodarkblue dark:text-gray-300 bg-transparent cursor-pointer transition-all duration-1000 whitespace-nowrap hover:opacity-70 active:scale-90"
                        >
                          {t("hint")}
                        </button>
                        <button
                          onClick={handleIDontKnow}
                          className="h-[3vh] rounded-[15px] border-none text-[1.2vh] text-studodarkblue dark:text-gray-300 bg-transparent cursor-pointer transition-all duration-1000 whitespace-nowrap hover:opacity-70 active:scale-90"
                        >
                          {t("I don't know the answer")}
                        </button>
                      </div>
                    </div>

                    <div className="w-full">
                      {showingAnswer ? (
                        <span
                          className={`flex items-center w-full h-[4.5vh] px-[3%] rounded-[50px] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_3px_5px_rgba(0,0,0,0.3)] text-[1.6vh] text-studodarkblue dark:text-white transition-colors duration-300 ${
                            answerState === "correct"
                              ? "border border-[#47bf81] dark:border-[#5fd99b] bg-inputcolor dark:bg-gray-700/50 transition-all duration-1000"
                              : "border border-[#bf4747] dark:border-[#d95f5f] bg-inputcolor dark:bg-gray-700/50 transition-[border] duration-1000"
                          }`}
                        >
                          {displayedAnswer}
                        </span>
                      ) : (
                        <input
                          ref={inputRef}
                          type="text"
                          autoComplete="off"
                          placeholder={t("answer with term")}
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full h-[4.5vh] px-[3%] rounded-[50px] border-none bg-inputcolor dark:bg-gray-700/50 shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_3px_5px_rgba(0,0,0,0.3)] border border-studodark dark:border-gray-600 border-b-[1.3px] border-b-white/35 dark:border-b-gray-500/35 text-[1.6vh] text-studodarkblue dark:text-white placeholder:text-studodarkblue/45 dark:placeholder:text-gray-400 focus:outline-none focus:border-[1.3px] focus:border-studodarkblue/20 dark:focus:border-gray-500/50 transition-colors duration-300"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-1/4 h-full flex flex-col pl-[5%] pr-[5%] gap-[3vh] relative overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={`right-${i}`}
                className="firework"
                style={{ display: isComplete ? "flex" : "none" }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}