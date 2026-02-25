import {useLocale} from "next-intl";
import {redirect} from "next/navigation";
import SearchHeader from "@/components/marketing/search/searchheader";
import SearchResults from "@/components/marketing/search/searchResults";

export default function Page() {
    return(<main className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-35 h-screen flex flex-col justify-baseline items-center
          bg-gradient-to-b from-transparent via-transparent to-emerald-300/10`}>
        <SearchResults/>
    </main>)
}