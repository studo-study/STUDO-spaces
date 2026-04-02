import {HiSpeakerphone} from "react-icons/hi";
import {SlOptions} from "react-icons/sl";
import {Card, SessionCard} from "@/types/types";
import {useRef} from "react";

interface CurrentCard {
    card: Card;
    sessionCard: SessionCard;
}

interface LearnCardProps {
    currentCard: CurrentCard;
    queueMode: boolean;
    termMode: boolean;
    termLang: string;
    defLang: string;
    check: (input:string) => void;
    correct: boolean;
    incorrect: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
    disabled: boolean;
}

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "nl", name: "Dutch" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" }
];

export default function LearnCard({currentCard, correct, incorrect, inputRef, disabled, termMode, termLang, defLang, check}: LearnCardProps) {
    console.log(termLang)
    const currentValue = termMode ? currentCard.card.term : currentCard.card.definition;
    const term = getTalen(termLang, defLang, "term");
    const def = getTalen(defLang, termLang, "definition");
    const checkInput = () => {
        if(inputRef.current) {
            check(inputRef.current.value);
        }
    }
    return(<div className={"w-full h-130 rounded-4xl border border-gray-300 dark:border-studoborder/30 bg-studogrey/30 shadow-xl p-5 gap-5 flex flex-col justify-between items-center"}>
        <div className={'w-full min-h-12 gap-2 rounded-2xl flex flex-row items-center'}>
            <div className={'w-full h-12 dark:text-white bg-studogrey/20 shadow-xl font-bold cursor-pointer rounded-2xl flex  items-center px-5'}>
                {termMode ? "Term" : "Definitie"}
            </div>
            <div className={'min-w-12 h-12 dark:text-white cursor-pointer rounded-full shadow-xl bg-studogrey/30 flex  items-center justify-center'}>
                <HiSpeakerphone />
            </div>
            <div className={'min-w-12 h-12 dark:text-white cursor-pointer rounded-full shadow-xl bg-studogrey/30 flex  items-center justify-center'}>
                <SlOptions />
            </div>
        </div>
        <div className={'w-full h-full flex flex-row gap-5'}>
            <div className={'w-2/3 h-full rounded-2xl bg-gray-300/20 dark:bg-studogrey/20 p-5'}>
                {currentValue}
            </div>
            <div className={'w-1/3 h-full rounded-2xl bg-gray-300/20 dark:bg-studogrey/20 p-5'}>
            </div>
        </div>
        <div className={'min-h-20 w-full flex flex-col gap-2'}>
            <div className={"w-full font-bold flex justify-end gap-5 px-5"}>
                <button className={"hover:text-gray-300 cursor-pointer"}>hint</button>
                <button className={"hover:text-gray-300 cursor-pointer"}>ik weet het niet</button>
            </div>
            <div className={`bg-gray-300/20 dark:bg-studogrey/20 px-5 flex items-center rounded-2xl w-full h-full border ${
                correct
                    ? "border-emerald-400"
                    : incorrect
                        ? "border-rose-600"
                        : "border-transparent focus-within:border-gray-300 focus-within:dark:border-studoborder/30"
            }`}>
                <input
                    ref={inputRef}
                    disabled={disabled}  // ← React beheert dit nu
                    autoFocus={true}
                    onKeyDown={e => e.key === "Enter" && !disabled && checkInput()}
                    type="text"
                    placeholder={termMode ? `typ definitie` : `typ term`}
                    className={"w-full group h-full outline-none"}
                />
            </div>
        </div>
    </div>
    )
}

function getTalen(taal: string, vergelijker: string, type: string): string | void {
    if (taal === vergelijker) {
        return type;
    }


    return LANGUAGES.findLast((lang) => lang.code === taal)?.name;
}