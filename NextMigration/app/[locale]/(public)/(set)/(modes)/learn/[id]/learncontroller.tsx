'use client'
import ProgressBar from "@/components/public/profile/(modes)/learn/progressbar";
import LearnCard from "@/components/public/profile/(modes)/learn/card";
import {Card, FullStudyset, SessionCard} from "@/types/types";
import {useRef, useState} from "react";
import SettingsTrigger from "@/components/public/profile/(modes)/learn/settings";

interface LearnProps {
    data: FullStudyset
}

interface CurrentCard {
    card: Card;
    sessionCard: SessionCard;
}
export default function LearnController({data}: LearnProps) {
    const [cards, setCards] = useState<Card[]>(data.cards);
    const [sessionCards, setSessionCards] = useState<SessionCard[]>(data?.session.cards);
    const [queue, setQueue] = useState<Card[]>([]);
    const [index, setIndex] = useState(0);
    const [queueIndex, setQueueIndex] = useState(0);
    const [currentCard, setCurrentCard] = useState<CurrentCard>({card: cards[index], sessionCard: sessionCards[index]});
    const [queueMode, setQueueMode] = useState<boolean>(false);
    const [termMode, setTermMode] = useState<boolean>(true);
    const termTaal = data.global_term_language != data.global_definition_language ? "term" : data.global_term_language;
    const defTaal = data.global_term_language != data.global_definition_language ? "definitie" : data.global_definition_language;
    const [correct, setCorrect] = useState<boolean>(false);
    const [incorrect, setIncorrect] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null!);

    const check = (input: string) => {
        inputRef.current.disabled = true;
        if(!queueMode) {
            const currentChecker = termMode ? currentCard.card.definition : currentCard.card.term;
            if(currentChecker === input) {
                console.log("correct")
                setCorrect(true);
                setTimeout(() => {
                    setCorrect(false)
                    upIndex()
                    inputRef.current.value = "";
                    inputRef.current.disabled = false;
                    inputRef.current.focus();
                }, 1000);


            }
            else {
                queue.push(currentCard.card)
                console.log("fout")
                setIncorrect(true);
                setTimeout(() => {
                    setIncorrect(false)
                    setCorrect(true);
                    inputRef.current.value = currentChecker;
                }, 900)

                setTimeout(() => {

                    setCorrect(false)
                    upIndex()
                    inputRef.current.value = "";
                    inputRef.current.disabled = false;
                    inputRef.current.focus();
                }, 2000);

            }
        }


    }


    const upIndex = () => {
        setIndex(prev => {
            const newIndex = prev + 1;

            const finalIndex = newIndex >= cards.length ? 0 : newIndex;

            setCurrentCard({
                card: cards[finalIndex],
                sessionCard: sessionCards[finalIndex]
            });

            return finalIndex;
        });
    }


    return( <section className={"w-full max-w-200 h-full py-20 gap-5 flex items-center justify-baseline flex-col"}>
        <SettingsTrigger/>

        <div className={"w-full h-full flex items-center py-20 justify-baseline flex-col"}>
            <ProgressBar
                cardIndex={index}
                queueMode={queueMode}
                queueIndex={queueIndex}
                queueLength={queue.length}
                cardLength={sessionCards.length}
            />

            <LearnCard
                inputRef={inputRef}
                correct={correct}
                incorrect={incorrect}
                currentCard={currentCard}
                termMode={termMode}
                queueMode={queueMode}
                termLang={termTaal}
                defLang={defTaal}
                check={check}
            />
        </div>
    </section>)
}


