import {useTranslations} from "next-intl";

export default function SettingsPage() {
    const t = useTranslations("settings")
    return(
        <div className="w-full h-full py-15 flex flex-col gap-10 scroll-hidden">
            <section></section>
        </div>
    )
}