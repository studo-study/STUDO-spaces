"use client"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import SearchHeader from "@/components/marketing/search/searchheader";
import AnimateOnMount from "@/components/overige/ui/AnimateOnMount";
import SearchResultClassroom from "@/components/marketing/search/classrooms/searchresult_classroom";
import SearchResultSets from "@/components/marketing/search/sets/searchresult_sets";
import SearchResultUsers from "@/components/marketing/search/users/searchresult_users";
import SearchResultStudo from "@/components/marketing/search/studo/searchresult_studo";
import NoResult from "@/components/marketing/search/noresult";

interface SetResultProps {
    index: number;
}
function SetResult({index}: SetResultProps) {
    return (<AnimateOnMount delay={index != 0 ? 50 * index : 100}>
        <div className={"w-full h-30 bg-studoblue"}></div>
    </AnimateOnMount>);
}

interface SearchResults {
    "data": [
        {
            "type": "set",
            "data": []
        },
        {
            "type": "profile",
            "data": []
        },
        {
            "type": "classroom",
            "data": []
        },
        {
            "type": "studo",
            "data": []
        },

    ]
}


export default function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')
    const [result, setResult] = useState<SearchResults>()

    useEffect(() => {
        if (!query) return
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/public/${query}`)
            .then(r => r.json())
            .then((data) => {
                setResult(data)
            })
    }, [query])

    const size = result && result.data[0].data.length + result.data[1].data.length + result.data[2].data.length + result.data[3].data.length;
    console.log(result);

    return (
        <div className={"w-1/2 flex flex-col justify-center items-center gap-5"}>
            <div className={"w-full flex flex-col gap-5"}>
                <SearchHeader query={query} size={size}/>
            </div>

            <SearchResultStudo result={result} />
            <SearchResultSets result={result} />
            <SearchResultUsers result={result} />
            <SearchResultClassroom result={result} />
            {size === 0 &&
            <NoResult/>}
        </div>
    )
}
