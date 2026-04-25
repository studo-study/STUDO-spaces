import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import {useTranslations} from "next-intl";
import {FaPlus} from "react-icons/fa";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

const GetStarted = () => {
    const t = useTranslations("home")
    return (
        <section className="flex flex-col gap-5 overflow-visible">
            <SectionHeader sectionIcon={<FaPlus />} title={t("getstarted_overview_title")} />
            <Container height={"fit"}>
                <div className={"grid grid-cols-2 gap-5"}>
                    <BaseButton className={"rounded-xl"} label={t("studoset_btn_lbl")}/>
                    <BaseButton label={t("visualset_btn_lbl")}/>
                </div>
            </Container>
        </section>
    )
}

GetStarted.displayName = "GetStarted"
export default GetStarted