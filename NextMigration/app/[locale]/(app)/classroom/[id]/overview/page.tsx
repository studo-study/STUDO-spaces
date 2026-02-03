import {useTranslations} from "next-intl";

export default function ClassroomOverviewPage() {
    const t = useTranslations("classroom")
    return (
        <div className={"w-full min-h-full h-full flex flex-row gap-5 py-10"}>
            <div className={"w-2/3 min-h-full h-full flex flex-col bg-amber-300 p-5 rounded-4xl"}>
                <span>{t("recent_sets")}</span>
            </div>
            <div className={"w-1/3 h-full min-h-150 rounded-4xl bg-emerald-500 p-5"}>
                <span>{t("members")}</span>
            </div>
        </div>)
}