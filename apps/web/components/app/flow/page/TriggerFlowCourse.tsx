"use client"
import {useTranslations} from "next-intl";
import {IoIosAdd} from "react-icons/io";

interface TriggerFlowProps {
    togglePopUp: () => void,
}

const TriggerFlowCourse = (props: TriggerFlowProps) => {
    const {togglePopUp} = props;
    return (<button
        type={"button"}
        onClick={togglePopUp}
        className={`hover:bg-studogrey/30 transition-all cursor-pointer duration-300 rounded-3xl px-3 flex items-center justify-center text-studodarkblue dark:text-white`}>
        <IoIosAdd size={20}/>
    </button>);

}

TriggerFlowCourse.displayName = "TriggerFlowCourse"
export default TriggerFlowCourse;