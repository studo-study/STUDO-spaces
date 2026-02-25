import {useTranslations} from "next-intl";
import { FaAngleRight } from "react-icons/fa6";

interface ResultClassroomProps {
    result: any
}
export default function SearchResultClassroom({result}: ResultClassroomProps) {
    const klassen = result.data[2].data;
    const t = useTranslations("landing.search_result.classroom")
    return(<div className={"w-full h-full flex flex-col gap-5"}>
        <div className={"w-full flex py-1 flex-row justify-between items-center"}>
            <span className={"font-bold"}>{t("classroom")}</span>
            <span className={`flex ${klassen.length != 0 ? "flex" : "hidden"} flex-row items-center justify-end gap-2`}>
                {t("more")}
                <FaAngleRight />
            </span>
        </div>
        {result && klassen != 0 ? <div className={"w-full min-h-30 grid grid-cols-4 gap-5"}>
            {
                result && klassen.map((item, i) => (<SetResult key={i}/>))
            }
        </div>
        :
            <div className={"w-full h-full min-h-30 flex justify-center items-center"}>
                {t("not_found")}
            </div>
        }
    </div>)
}