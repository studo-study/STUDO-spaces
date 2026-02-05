import {useTranslations} from "next-intl";

export default function Members() {
    const t = useTranslations("classroom")
    return(  <div className={"w-1/3 h-full flex flex-col gap-5 min-h-150 rounded-4xl bg-studogrey/10 border border-studoborder/20 shadow-2xl p-7"}>
        <span className={"font-bold text-studodarkblue dark:text-white"}>{t("members")}:</span>
    </div>)
}