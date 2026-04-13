import FlowHeader from "@/components/app/flow/overview/FlowHeader";
import PageContainer from "@/components/design_system/page/PageContainer";
import FlowGrid from "@/components/app/flow/overview/FlowGrid";
import {auth} from "@/auth";

export default async function FlowPage() {
    const session = await auth();
    const token = session?.accessToken;

    const res = await fetch(
        `${process.env.AUTH_API_URL}/flows/me`,
        {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
            next: { revalidate: 60 },
        }
    );

    const data = res.ok ? await res.json() : [];

    return (
        <PageContainer>
            <FlowHeader />
            <FlowGrid initialBoards={data} />
        </PageContainer>
    );
}