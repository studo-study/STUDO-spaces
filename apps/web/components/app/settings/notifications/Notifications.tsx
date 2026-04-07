import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";

export default function Notifications() {
    const t = useTranslations("settings")
    return (<section className={"flex flex-col gap-5 w-full h-fit"}>
        <span className={"w-full text-base font-bold h-fit"}>{t("notifications")}</span>
        <div className={"w-full h-fit rounded-3xl border border-studoborder"}>
            <div className={"w-full gap-4 px-10 py-8 flex flex-col border-b border-studoborder"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <div className={"w-full h-fit flex flex-col gap-3"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("progress_notifications")}</span>
                    </div>
                    <div className="checkbox-wrapper-2">
                        <input type="checkbox"  className="sc-gJwTLC ikxBAC"/>
                    </div>
                </div>
            </div>
            <div className={"w-full gap-4 px-10 py-8 flex flex-col border-b  border-studoborder"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <div className={"w-full h-fit flex flex-col gap-3"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("streak_notifications")}</span>
                    </div>
                    <div className="checkbox-wrapper-2">
                        <input type="checkbox"  className="sc-gJwTLC ikxBAC"/>
                    </div>
                </div>
            </div>
            <div className={"w-full gap-4 px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <div className={"w-full h-fit flex flex-col gap-3"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("classroom_notifications")}</span>
                    </div>
                    <div className="checkbox-wrapper-2">
                        <input type="checkbox"  className="sc-gJwTLC ikxBAC"/>
                    </div>
                </div>
            </div>
        </div>
    </section>)
}