import {TotalStats} from "@studo/types";
import {useTranslations} from "next-intl";
import StatItem from "@/components/ui/app/home/quick_stats/StatItem";
import Image from "next/image";
import {LuTimer} from "react-icons/lu";
import {FaCheck, FaRegEye} from "react-icons/fa";

interface QuickStatsProps {
    stats: TotalStats;
}

const QuickStats = (props: QuickStatsProps) => {
    const {stats} = props;
    const t = useTranslations("home")
    return (<section className="grid grid-cols-4 gap-2 overflow-visible w-full">
        <StatItem
            image={<Image src={"/icons/studyset.svg"} alt={"sets"} width={10} height={10} className={"w-4 dark:invert dark:brightness-0"}/>}
            title={stats.totalsets + " " + (stats.totalsets === 1 ? t("set_studied") : t("sets_studied"))}
        />
        <StatItem
            icon={<FaRegEye />}
            title={stats.totalCards + " " + (stats.totalCards === 1 ? t("card") : t("cards"))} />
        <StatItem
            icon={<FaCheck />}
            title={stats.cardsLearned.toString() + " " + (stats.cardsLearned === 1 ? t("card_learned") : t("cards_learned"))} />
        <StatItem
            icon={<LuTimer />}
            title={TimeParser(stats.timeLearned)}
        />
    </section>)
}


function TimeParser(time: number) {
    const t = useTranslations("home");

    if (time < 60) {
        return `${time} ${time === 1 ? t("minute") : t("minutes")} ${t("studied")}`;
    }

    const hours = Math.floor(time / 60);

    if (hours < 24) {
        return `${hours} ${hours === 1 ? t("hour") : t("hours")} ${t("studied")}`;
    }

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? t("day") : t("days")} ${t("studied")}`;
}

QuickStats.displayName = "QuickStats";
export default QuickStats;