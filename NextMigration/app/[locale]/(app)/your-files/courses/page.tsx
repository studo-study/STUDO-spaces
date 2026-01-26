import {Metadata} from "next";
import {useTranslations} from "next-intl";

export const metadata:Metadata = {
    title:"Courses | Studo"
}
export default function Page() {
    const t = useTranslations("y_f.courses")
    return (
        <div className=" w-full flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit flex items-center justify-end py-5"}>
                <div
                    className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200 flex items-center justify-center flex-row gap-2
                                cursor-pointer w-30 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none">
                    <select  className={"w-fit appearance-none"}>
                        <option value="inactive">{t("inactive")}</option>
                        <option value="away">{t("away")}</option>
                        <option value="active" selected>{t("active")}</option>
                    </select>
                </div>
            </section>
        </div>
    );
}