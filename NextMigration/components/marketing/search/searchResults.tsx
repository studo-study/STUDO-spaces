"use client"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import SearchHeader from "@/components/marketing/search/searchheader";
import AnimateOnMount from "@/components/overige/ui/AnimateOnMount";

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
        }
    ]
}
export default function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')  // query uit URL halen
    const [result, setResult] = useState<SearchResults>()  // [] ipv null, anders crasht .map()

    useEffect(() => {
        if (!query) return
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/public/${query}`)
            .then(r => r.json())
            .then((data) => {
                setResult(data)  // niet data.json(), al geparsed
            })
    }, [query])  // dependency is query, niet searchParams

    console.log(result);
    return (
        <div className={"w-1/2 flex flex-col justify-center items-center gap-5"}>
            <div className={"w-full flex flex-col gap-5"}>
                <SearchHeader query={query} />
            </div>
            <div className={"w-full h-full flex flex-col gap-5"}>
                <span>Sets</span>
                <div className={"w-full min-h-30 grid grid-cols-4 gap-5"}>
                    {
                        result && result.data[0].data.map((item, i) => (<SetResult key={i}/>))
                    }
                </div>
            </div>

            <div className={"w-full h-full flex flex-col gap-5"}>
                <span>Users</span>
                <div className={"w-full h-full grid grid-cols-4 gap-5"}>
                    {
                        result && result.data[1].data.map((item, i) => (<SetResult key={i} index={i}/>))
                    }
                </div>
            </div>
        </div>
    )
}
