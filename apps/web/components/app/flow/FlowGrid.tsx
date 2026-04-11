import {getTranslations} from "next-intl/server";
import {auth} from "@/auth";
import FlowGridItem from "@/components/app/flow/FlowGridItem";
import {FlowBoardOverview} from "@studo/types";

export default async function FlowGrid() {
    const t = await getTranslations("flows");
    const session = await auth();
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/flows/me`,
        {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
            next: { revalidate: 60 },
        }
    ).then(res => res.json());
    return (<div className={"grid grid-cols-3 min-h-full h-full w-full pt-15 gap-5"}>
        {data?.map((flow: FlowBoardOverview) => (<FlowGridItem item={flow} key={flow.id}/>))}
    </div>)
}
