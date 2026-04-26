import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import {useTranslations} from "next-intl";
import {FaPlus} from "react-icons/fa";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import Image from "next/image";

const GetStarted = () => {
    const t = useTranslations("home")
    return (
        <section className="flex flex-col gap-5 overflow-visible">
            <SectionHeader sectionIcon={<FaPlus />} title={t("getstarted_overview_title")} />
            <Container height={"fit"}>
                <div className={"grid grid-cols-2 gap-5"}>
                    <BaseButton rounded={"xl"}
                                label={t("studoset_btn_lbl")}
                                iconLeft={<Image src={"/icons/studyset.svg"} alt={"icon"} width={0} height={0} className={"w-5 invert brightness-0"}/>}/>
                    <BaseButton rounded={"xl"}
                                label={t("visualset_btn_lbl")}
                                iconLeft={<Image src={"/icons/visualset.svg"} alt={"icon"} width={0} height={0} className={"w-5 invert brightness-0"}/>}/>
                </div>
            </Container>
        </section>
    )
}

GetStarted.displayName = "GetStarted"
export default GetStarted