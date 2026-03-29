import ProgressBar from "@/components/public/profile/(modes)/learn/progressbar";
import {HiSpeakerphone} from "react-icons/hi";
import {SlOptions} from "react-icons/sl";
import LearnCard from "@/components/public/profile/(modes)/learn/card";

export default function LearnPage() {
    return  <div className=" w-full h-full flex flex-col dark:text-white  items-center justify-center gap-10 scroll-hidden">
        <section className={"w-2/3 h-fit gap-5 flex flex-col"}>
            <ProgressBar/>
            <LearnCard/>

        </section>
    </div>
}