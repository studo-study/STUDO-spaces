import PageContainer from "@/components/design_system/page/PageContainer";
import FlowRowSelector from "@/components/app/flow/page/layout/FlowRowSelector";
import {ReactNode} from "react";
import FlowBoardHeader from "@/components/app/flow/page/layout/FlowBoardHeader";
import {auth} from "@/auth";
import FlowBoardProvider from "@/components/providers/FlowBoardProvider";

export default async function FlowOverviewLayout({ params, children }: {
    params: Promise<{ id: string }>;
    children: ReactNode;
}) {
    const { id } = await params;
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

    if (!res.ok) {
        console.error(`Flow fetch failed: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.error("Response body:", text.slice(0, 200));
        throw new Error(`Failed to fetch flowboard: ${res.status}`);
    }

    const data = await res.json();

    return (
        <FlowBoardProvider>
            <PageContainer>
                <FlowBoardHeader data={data} />
                <div className="w-full min-h-full">
                    {children}
                </div>
                <FlowRowSelector id={id} data={data} />
            </PageContainer>
        </FlowBoardProvider>
    );
}
