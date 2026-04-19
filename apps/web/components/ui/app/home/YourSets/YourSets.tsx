import Container from "@/components/ui/design_system/container/Container";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import {useTranslations} from "next-intl";
import {BsCollection} from "react-icons/bs";

const YourSets = () => {
    const t = useTranslations("home")
    return (<section className="flex flex-col gap-5 overflow-visible">
        <SectionHeader sectionIcon={<BsCollection />} title={t("set_overview_title")}/>
        <Container></Container>
    </section>)
}

YourSets.displayName = "YourSets"
export default YourSets;