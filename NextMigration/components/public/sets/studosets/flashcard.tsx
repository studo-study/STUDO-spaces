'use client'
import {Card} from "@/types/types";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useState} from "react";

interface FlashcardProps {
    cards: Card[]
}

interface card   {
    "id": string;
    "term": string;
    "definition": string;
    "number": number;
    "created_at": string;
    "updated_at": string;
    "set_id": string;
    "owner_id": string;
}

interface FlashcardProps {
    cards: Card[];
}

export default function Flashcard({cards}:FlashcardProps) {
    const [index, setIndex] = useState(0);
    const goForward = () => {
        if((index + 1) > cards.length -1) {
            setIndex(0);
        } else setIndex(index+1);

    }
    const goBack = () => {
        if((index - 1) < 0) {
            setIndex(cards.length -1);
        }
        else setIndex(index-1);
    }


    return (<div className={"w-full h-110 flex flex-col gap-5"}>
        <div className={'w-full h-full'}>
            <Card card={cards[index]}/>
        </div>
        <div className={'w-full h-15 gap-5 flex flex-row items-center justify-center'}>
            <div onClick={goBack} className={'w-15 h-12 cursor-pointer border border-studoborder/30  bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center'}>
                <IoIosArrowBack />
            </div>
            <div className={'w-32 h-12 cursor-pointer border border-studoborder/30  bg-studogrey/30 rounded-full flex flex-row items-center justify-center'}>
                <span className={'w-1/3 text-center'}>{index + 1}</span>
                |
                <span className={'w-1/3 text-center'}>{cards.length}</span>
            </div>
            <div onClick={goForward} className={'w-15 h-12 cursor-pointer border border-studoborder/30  bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center'}>
                <IoIosArrowForward />
            </div>
        </div>
    </div>)
}

interface CardProps {
    card: Card;
}
function Card({card}:CardProps) {
    const [front, setFront] = useState(true);
     const handleFlip = () => {
         setFront(prevState => !prevState);
     }
    return (<div onClick={handleFlip} className={'w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30 '}>
        <span className={'text-xl select-none'}>{front ? card.term : card.definition}</span>
    </div>)
}