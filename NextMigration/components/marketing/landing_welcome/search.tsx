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
    const [placeholder, setPlaceholder] = useState("");
    const [query, setQuery] = useState("");
    const inputFieldRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        let titleIdx = 0;
        let charIdx = 0;
        let deleting = false;
        let timer: ReturnType<typeof setTimeout>;

        const tick = () => {
            const current = titles[titleIdx];
            if (!deleting) {
                charIdx++;
                setPlaceholder(current.substring(0, charIdx));
                if (charIdx >= current.length) {
                    deleting = true;
                    timer = setTimeout(tick, holdSpeed);
                } else {
                    timer = setTimeout(tick, typeSpeed);
                }
            } else {
                charIdx--;
                setPlaceholder(current.substring(0, charIdx));
                if (charIdx <= 0) {
                    deleting = false;
                    titleIdx = (titleIdx + 1) % titles.length;
                    timer = setTimeout(tick, 200);
                } else {
                    timer = setTimeout(tick, deleteSpeed);
                }
            }
        };

        timer = setTimeout(tick, 200);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
        rounded-full dark:text-white text-studodarkblue border-2 border-gray-400/30 dark:border-studoborder/20`}>
        <input
            ref={inputFieldRef}
            type="text"
            onKeyDown={(e) => e.key === 'Enter' && toggleSearch()}
            placeholder={placeholder}
            className={"w-full h-full text-xl focus:border-none outline-none"}/>
        <IoMdSearch
            onClick={toggleSearch}
            className="text-2xl cursor-pointer active:scale-95 transition-all duration-200"
        />
    </div>)
}