'use client'
import ProgressBar from "@/components/public/profile/(modes)/learn/progressbar";
import LearnCard from "@/components/public/profile/(modes)/learn/card";
import {Card, FullStudyset, SessionCard} from "@/types/types";
import {useState} from "react";

interface LearnProps {
    data: FullStudyset
}

interface CurrentCard {
    card: Card;
    sessionCard: SessionCard;
}
export default function LearnController({data}: LearnProps) {
    const [cards, setCards] = useState<Card[]>([data.cards]);
    const [sessionCards, setSessionCards] = useState<SessionCard[]>(data?.session.cards);
    const [queue, setQueue] = useState<Card[]>([]);
    const [index, setIndex] = useState(0);
    const [queueIndex, setQueueIndex] = useState(0);
    const [currentCard, setCurrentCard] = useState<CurrentCard>({card: cards[index], sessionCard: sessionCards[index]});
    const [queueMode, setQueueMode] = useState<boolean>(false);
    const [termMode, setTermMode] = useState<boolean>(false);

    return( <section className={"w-full max-w-200 h-fit gap-5 flex flex-col"}>
        <ProgressBar cardIndex={index} queueMode={queueMode} queueIndex={queueIndex} queueLength={queue.length} cardLength={sessionCards.length} />
        <LearnCard currentCard={currentCard} termMode={termMode} queueMode={queueMode}/>
    </section>)
}