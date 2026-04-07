"use client"
import {useTranslations} from "next-intl";
import {useEffect, useRef, useState} from "react";
import SetImporter from "@/components/app/create-studoset/SetImporter";
import CardItem from "@/components/app/create-studoset/CardItem";
import Sortable from "sortablejs";
import ImportButton from "@/components/app/create-studoset/importButton";
import {useRouter} from "@/i18n/routing";
import {CardData} from "@/types/types";
import {useKeyboardShortcut} from "@/hooks/useKeyboardShortcut";
import {FiCommand} from "react-icons/fi";

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "nl", name: "Dutch" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" }
];


export default function CreateStudosetForm() {
    const t = useTranslations("createstudoset");
    const [showImporter, setShowImporter] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [folders, setFolders] = useState<Array<any>>([]);
    const [isMac, setIsMac] = useState(false);

    //ref values
    const titleRef = useRef<HTMLInputElement>(null);
    const courseRef = useRef<HTMLInputElement>(null);
    const folderRef = useRef<HTMLSelectElement>(null);
    const termLangRef = useRef<HTMLSelectElement>(null);
    const defLangRef = useRef<HTMLSelectElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const isMutating = false;

    const firstCard = {
        id: crypto.randomUUID(),
        index: 0,
        term: '',
        definition: '',
        image: '',
        isDouble: false
    }
    const [cardArray, setCardArray] = useState<Array<CardData>>([firstCard]);

    //handlers

    const validate = (body: any) => {
        const newErrors: Record<string, string> = {};

        if (!body.title) newErrors.title = "title_error";
        if (!body.course) newErrors.course = "course_error";
        if (!body.folder_id) newErrors.folder = "folder_error";
        if (!body.global_term_language) newErrors.term_lang = "term_lang_error";
        if (!body.global_definition_language) newErrors.def_lang = "def_lang_error";

        body.cardlist.forEach((card) => {
            if (!card.term || !card.definition) {
                newErrors.cards = "card_error";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const handleForm =  async (e) => {
        e.preventDefault();
        const body = {
            title: titleRef.current && titleRef.current.value,
            course: courseRef.current && courseRef.current.value,
            global_term_language: termLangRef.current && termLangRef.current.value,
            global_definition_language: defLangRef.current && defLangRef.current.value,
            folder_id: folderRef.current && folderRef.current.value,
            cardlist: cardArray.map((card: CardData) => ({
                term: card.term,
                definition: card.definition,
                number: card.index,
                image: card.image,
            }))
        }

        console.log(body);

        if (!validate(body)) return;
        const res = await fetch("/api/studysets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log(data);

        router.push(`/studoset/${data.id}`);
    };


    const addCard = () => {
            setCardArray(prev => [...prev, {
                id: crypto.randomUUID(),
                index: prev.length,
                term: '',
                definition: '',
                image: '',
                isDouble: false
            }]);
    }

    const deleteCard = (id: string) => {
        setCardArray(prev => prev.filter(card => card.id != id));
        updateIndex()
    }

    const updateIndex = () => {
        setCardArray(prev => prev.map((card, index) => ({ ...card, index })))
    }

    const updateCard = (id: string, field: string, value: string) => {
        setCardArray(prev => prev.map(card =>
            card.id === id ? { ...card, [field]: value } : card
        ));
    }

    const getDuplicateIds = () => {
        return cardArray.filter((card, i) =>
            cardArray.some((other, j) =>
                i !== j && (card.term === other.term && card.definition === other.definition && card.term != '')
            )
        ).map(card => card.id);
    }

    const duplicates = getDuplicateIds();

    //useEffects
    useEffect(() => {
        if (!cardsContainerRef.current) return;

        const sortable = new Sortable(cardsContainerRef.current, {
            animation: 300,
            handle: ".handle",
            onEnd: event => {
                setCardArray(prev => {
                    const newArr = [...prev];
                    const [moved] = newArr.splice(event.oldIndex, 1);
                    newArr.splice(event.newIndex, 0, moved);
                    return newArr.map((card, index) => ({ ...card, index }));
                });
            }
        });


        return () => sortable.destroy();
    }, [cardsContainerRef]);

    useEffect(() => {
        const fetchFolders = async () => {
            const res = await fetch("/api/folders");
            const data = await res.json();
            setFolders(data);
        };
        fetchFolders();
    }, []);

    useEffect(() => {
        setIsMac(navigator.platform.includes("Mac"));
    }, []);
    //console.log("folders", folders);


    useKeyboardShortcut("i", () => setShowImporter(true), {ctrl:true, always: true});
    return (
        <>
            <form onSubmit={handleForm}
                className="w-full scroll-hidden h-fit mt-10 md:mt-0 flex text-sm sm:text-base flex-col items-center justify-baseline pt-20 px-10"
                data-cy="studyset_form">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                  <span className="w-full text-2xl sm:text-3xl flex flex-col justify-center items-baseline
                    text-studodarkblue font-bold dark:text-white">
                    {t("title")}
                  </span>

                    <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
                        <div className="flex flex-col gap-1">
                            <input
                                ref={titleRef}
                                type="text"
                                className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                                autoComplete="off"
                                placeholder={t("title_placeholder")}
                                data-cy="title_input"
                            />
                            <div className="h-5">
                                <span className={`w-full h-fit text-rose-500 px-5 ${error ? 'flex' : 'hidden pointer-events-none'}`}>{errors.title && t(errors.title)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
                            <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                                <input
                                    ref={courseRef}
                                    type="text"
                                    autoComplete="off"
                                    placeholder={t("course_placeholder")}
                                    className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                                    data-cy="course_input"
                                />
                                <div className="h-5">
                                    <span className={`w-full h-fit text-rose-500 px-5 ${error ? 'flex' : 'hidden pointer-events-none'}`}>{errors.course && t(errors.course)}</span>
                                </div>
                            </div>

                            <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                                    <select
                                        ref={folderRef}
                                        className={"h-12 px-5 gap-5 text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"}
                                        data-cy="folder_select">
                                        <option value="">{t("folder_placeholder")}</option>
                                        {folders?.folders?.map((item, index) => (
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))}
                                    </select>

                                <div className="h-5">
                                    <span className={`w-full h-fit text-rose-500 px-5 ${error ? 'flex' : 'hidden pointer-events-none'}`}>{errors.folder && t(errors.folder)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
                            <div className="w-full sm:w-1/2 gap-1 flex flex-col">
                                    <select
                                        ref={termLangRef}
                                        className={"h-12 px-5 gap-5 text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"}
                                        data-cy="term_language_select">
                                        <option value="">{t("term_language")}</option>
                                        {LANGUAGES.map((lang) => (
                                            <option value={lang.code} key={lang.code}>{lang.name}</option>
                                        ))}
                                    </select>
                                <div className="h-5">
                                    <span className={`w-full h-fit text-rose-500 px-5 ${error ? 'flex' : 'hidden pointer-events-none'}`}>{errors.term_lang && t(errors.term_lang)}</span>
                                </div>
                            </div>

                            <div className="w-full sm:w-1/2 gap-1 flex flex-col">
                                    <select
                                        ref={defLangRef}
                                        className={"h-12 px-5 gap-5 text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"}
                                        data-cy="definition_language_select">
                                        <option value="">{t("def_language")}</option>
                                        {LANGUAGES.map((lang) => (
                                            <option value={lang.code} key={lang.code}>{lang.name}</option>
                                        ))}
                                    </select>
                                <div className="h-5">
                                    <span className={`w-full h-fit text-rose-500 px-5 ${error ? 'flex' : 'hidden pointer-events-none'}`}>{errors.def_lang && t(errors.def_lang)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-end mt-4">
                        <ImportButton
                        setShowImporter={setShowImporter}/>

                        <button
                            type="submit"
                            className="px-10 w-fit flex flex-row items-center shadow-2xl cursor-pointer justify-center gap-2 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold border border-studoborder active:scale-95 transition-transform"
                            data-cy="submit_studyset_top">
                            {isMutating ? t("saving..."): t("create")}
                        </button>
                    </div>
                    <div className="h-5">
                        <span className={`w-full h-fit text-rose-500 px-5 ${error ? 'flex' : 'hidden pointer-events-none'}`}>{errors.cards && t(errors.cards)}</span>
                    </div>

                    <div ref={cardsContainerRef}
                         className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 pt-6 sm:pt-8 md:pt-10"
                         data-cy="cards_container">
                        {cardArray.map((card) => (
                            <CardItem
                                key={card.id}
                                id={card.id}
                                index={card.index}
                                term={card.term}
                                definition={card.definition}
                                isDouble={duplicates.includes(card.id)}
                                deleteCard={deleteCard}
                                updateCard={updateCard}
                                length={cardArray.length}
                            />
                        ))}
                    </div>

                    <div className="flex w-full mb-3 sm:mb-4 md:mb-5 group relative">
                        <button
                            onClick={addCard}
                            type="button"
                            className="w-full h-12 rounded-full bg-gradient-to-br cursor-pointer shaodw-2xl from-emerald-400 to-emerald-500 text-white font-bold border border-studoborder active:scale-98 transition-transform"
                            data-cy="add_card_button">
                            {t("add_card")}
                        </button>
                    </div>

                    <div className="flex w-full mb-6 sm:mb-8 md:mb-10 flex-row justify-end">
                        <button
                            type="submit"
                            className="px-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-row items-center shadow-2xl cursor-pointer justify-center gap-2 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold border border-studoborder active:scale-95 transition-transform"
                            data-cy="submit_studyset_bottom">
                            {isMutating ? t("saving...") : t("create")}
                        </button>
                    </div>
                </div>

                {showImporter && (
                    <SetImporter
                        cardArray={cardArray}
                        setCardArray={setCardArray}
                        onClose={() => setShowImporter(false)}
                    />
                )}
            </form>
        </>
    )
}

interface CreateStudosetBody {
    title: string | null;
    course: string | null;
    global_term_language: string | null;
    global_definition_language: string | null;
    folder_id: string | null;
    cardlist: [{
        term:string;
        definition: string;
        number: number;
        image: string;
    }];
}

