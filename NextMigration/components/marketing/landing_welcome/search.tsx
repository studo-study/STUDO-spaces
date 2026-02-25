"use client"
import {useLocale, useTranslations} from "next-intl";
import {IoMdSearch} from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useLoadingStore} from "@/store/loadingStore";

export default function SearchSets() {
    const t = useTranslations('landing.welcome');
    const titles = [
        t("search_sets"),
        t("search_visuals"),
        t("search_people"),
        t("search_classroom")
    ];
    const typeSpeed = 200;
    const deleteSpeed = 50;
    const holdSpeed = 400;
    const locale = useLocale();
    const router = useRouter()
    const setLoading = useLoadingStore(s => s.setLoading)
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [titleIndex, setTitleIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null)
    const [query, setQuery] = useState("");
    const inputFieldRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const currentTitle = titles[titleIndex];

        const handleType = () => {
            if (!isDeleting && timeoutRef.current) {
                // Typing
                if (text.length < currentTitle.length) {
                    setText(currentTitle.substring(0, text.length + 1));
                    timeoutRef.current = setTimeout(handleType, typeSpeed);
                } else {
                    // Finished typing, hold before deleting
                    timeoutRef.current = setTimeout(() => {
                        setIsDeleting(true);
                    }, holdSpeed);
                }
            } else {
                // Deleting
                if (text.length > 0 && timeoutRef.current) {
                    setText(currentTitle.substring(0, text.length - 1));
                    timeoutRef.current = setTimeout(handleType, deleteSpeed);
                } else {
                    // Finished deleting, move to next title
                    setIsDeleting(false);
                    setTitleIndex((prev) => (prev + 1) % titles.length);
                }
            }
        };

        timeoutRef.current = setTimeout(handleType, 200);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [text, isDeleting, titleIndex, titles, typeSpeed, deleteSpeed, holdSpeed]);

    const toggleSearch = () => {
        if (inputFieldRef.current?.value) {
            setQuery(inputFieldRef.current.value)
        }
        setLoading(true)
    }

    useEffect(() => {
        if (!query) return
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/public/${query}`)
            .then(r => r.json())
            .then(() => {
                setLoading(false)
                router.push(`/${locale}/search-result?q=${query}`)
            })
    }, [query])



    return(<div className={`min-w-1/3 lg:w-2/3 w-full h-18 flex flex-row items-center  px-7 bg-gray-300/30 dark:bg-gray-500/10
        rounded-full dark:text-white text-studodarkblue backdrop-blur-2xl border-2 border-gray-400/30 dark:border-studoborder/20`}>
        <input
            ref={inputFieldRef}
            type="text"
            onKeyDown={(e) => e.key === 'Enter' && toggleSearch()}
            placeholder={text}
            className={"w-full h-full text-xl focus:border-none outline-none"}/>
        <IoMdSearch
            onClick={toggleSearch}
            className="text-2xl cursor-pointer active:scale-95 transition-all duration-200"
        />
    </div>)
}