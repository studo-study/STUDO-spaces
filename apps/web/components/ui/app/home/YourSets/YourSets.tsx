import Container from "@/components/ui/design_system/container/Container";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import {useTranslations} from "next-intl";
import {BsCollection} from "react-icons/bs";
import {LastStudied} from "@studo/types";
import HomePageSetItem from "@/components/ui/app/home/YourSets/SetItem";

interface YourSetProps {
    items: LastStudied[]
}
const YourSets = (props: YourSetProps) => {
    const {items} = props;

    const t = useTranslations("home")
    return (<section className="flex flex-col gap-5 overflow-visible">
        <SectionHeader sectionIcon={<BsCollection />} title={t("set_overview_title")} linkText={t('all_sets')} href={'/your-files/sets'}/>
        <Container>
            <div className={"w-full grid grid-cols-2 gap-5"}>
                {items?.map((item, index) => (<HomePageSetItem key={index} item={item}/>))}
            </div>
        </Container>
    </section>)
}

YourSets.displayName = "YourSets"
export default YourSets;