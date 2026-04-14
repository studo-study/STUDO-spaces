import {IoIosAdd} from "react-icons/io";
import {useTranslations} from "next-intl";
import {useFlowBoard} from "@/components/context/FlowBoardContext";

const CreateFlowCourseButton = () => {
    const t = useTranslations("flow")
    const {toggleFlowBoard} = useFlowBoard();
    return (<button
                type={"button"}
                onClick={toggleFlowBoard}
                className={`w-full min-h-35 cursor-pointer font-bold
                            h-full rounded-3xl dark:text-white/50 active:scale-95 
                            text-studodarkblue transition-all border-studoborder/30 
                            border items-center justify-center gap-1 flex flex-col border-dashed p-5`}>
        <IoIosAdd size={25}/>
        {t("add_course")}
    </button>)
}

CreateFlowCourseButton.displayName = "CreateFlowCourseButton";
export default CreateFlowCourseButton;