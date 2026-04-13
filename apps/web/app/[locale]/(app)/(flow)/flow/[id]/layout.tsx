import PageContainer from "@/components/design_system/page/PageContainer";
import FlowRowSelector from "@/components/app/flow/page/layout/FlowRowSelector";
import {ReactNode} from "react";
import FlowBoardHeader from "@/components/app/flow/page/layout/FlowBoardHeader";
import {auth} from "@/auth";

export default async function FlowOverviewLayout({
                                             params,
                                             children,
                                         }: {
    params: Promise<{ id: string }>;
    children: ReactNode;
}) {
    const {id} = await params;
    const session = await auth();
    const token = session?.accessToken;
    const res = await fetch(
        `${process.env.AUTH_API_URL}/flows/board/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
            next: { revalidate: 60 },
        }
    );

    const data = await res.json();
    console.log(data);

    return (
        <PageContainer>
            <FlowBoardHeader data={data}/>
            <div className={"w-full min-h-full"}>
                {children}
            </div>
            <FlowRowSelector id={id} />
        </PageContainer>
    );
}