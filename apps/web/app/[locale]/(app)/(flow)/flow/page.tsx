import FlowHeader from "@/components/app/flow/FlowHeader";
import PageContainer from "@/components/design_system/page/PageContainer";
import FlowGrid from "@/components/app/flow/FlowGrid";

export default function FlowPage() {
    return (<PageContainer>
        <FlowHeader/>
        <FlowGrid/>
    </PageContainer>)
}