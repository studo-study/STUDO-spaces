import {useState} from "react";
import {IoIosArrowDown} from "react-icons/io";
import { MdOutlineRoute } from "react-icons/md";
import {useTranslations} from "next-intl";
import {GoProjectRoadmap} from "react-icons/go";
import Image from "next/image";
import {FaArrowRightLong} from "react-icons/fa6";
import {Link} from "@/i18n/routing";
import {StudysetResponse, Track, VisualsetResponse} from "@studo/types";

interface GroupedTrack {
    grade: string;
    tracks: Track[];
}

interface TracksProps {
    tracks: Track[];
}
export default function Tracks({tracks}: TracksProps) {
    const trackGrades = new Set<string>();
    const filteredTracks: GroupedTrack[] = [];

    tracks.forEach((track) => {
        trackGrades.add(track.grade);
    });

    trackGrades.forEach((grade) => {
        filteredTracks.push({
            grade: grade,
            tracks: tracks.filter(track => track.grade === grade)
        });
    });

    return (<div className={"w-full h-fit flex flex-col gap-5"}>
        {filteredTracks.map((group, index) => (<TrackContainer key={index} index={index} group={group} />))}
    </div>)
}

interface TrackContainerProps {
    index: number;
    group: GroupedTrack;
}

function TrackContainer({group}: TrackContainerProps) {
    const t = useTranslations("trackview");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    }

    return(<div className={"w-full h-fit flex flex-col gap-5 pl-5"}>
        <div   onClick={toggleOpen}
            className={"w-full h-fit flex cursor-pointer flex-row justify-between items-center gap-3 pr-3"}>
            <div className="flex items-center gap-2 font-bold text-lg">
                <MdOutlineRoute />
            <span>{group.grade}:</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={"text-xs opacity-50 truncate"}>{group.tracks.length} {group.tracks.length === 1 ? t("vak") : t("vakken")}</span>
                <button
                    className="w-10 h-10 cursor-pointer rounded-full hover:bg-studogrey transition-colors duration-300 flex items-center justify-center"
                >
                    <IoIosArrowDown
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>
            </div>
        </div>
        {isOpen && (
        <div className={"w-full h-fit flex flex-col gap-5 pl-5 mb-5"}>
            {group.tracks.map((track, index) => (<TrackItem track={track} key={index}/>))}
        </div>)}

    </div>)
}

interface TrackItemProps {
    track: Track;
}

function TrackItem({track}: TrackItemProps) {
    const t = useTranslations("trackview");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    }

    return (
        <div className="w-full flex flex-col px-3 pl-5 py-3 min-h-15 rounded-4xl glass-rgb  transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-2 min-h-10">
                <div className="flex items-center gap-2">
                    <GoProjectRoadmap />
                    <span className={"font-bold"}>{track.trackName}</span>
                </div>
                {track.studysets.length > 0 || track.visualsets.length > 0 ? (
                    <button
                        onClick={toggleOpen}
                        className="w-10 h-10 cursor-pointer rounded-full hover:bg-studogrey transition-colors duration-300 flex items-center justify-center"
                    >
                        <IoIosArrowDown
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                ) : (
                    <span className="text-sm text-gray-400 pr-2">{t("empty")}</span>
                )}
            </div>

            {isOpen && (
                <div className="w-full px-5 pr-8 flex flex-col gap-1 mt-2">
                    {track.studysets.length > 0 || track.visualsets.length > 0 ?
                        <hr className={"w-full h-0.5 border-studoborder"}/>
                        :
                        null
                    }

                    {track.studysets.length != 0 && (<div className={"flex flex-col mb-5 gap-2"}>
                        <span className="font-bold">{t("studosets")}:</span>
                    <div>
                        {track.studysets.map((studoset) => (
                            <SetItem key={studoset.id} set={studoset} type={"ss"}/>
                        ))}
                    </div></div>)}

                    {track.visualsets.length != 0 && (<div className={"flex flex-col mb-5 gap-2"}>
                        <span className="font-bold">{t("visualsets")}:</span>
                    <div>
                        {track.visualsets.map((visualset) => (
                            <SetItem key={visualset.id} set={visualset} type={"vs"}/>
                        ))}
                    </div></div>)}



                </div>
            )}
        </div>
    );

    interface SetItemProps {
        type: string;
        set: StudysetResponse | VisualsetResponse;
    }

    function SetItem({type, set}: SetItemProps) {
        return (
            <Link className={"w-full flex gap-3 flex-row items-center hover:bg-gray-200 dark:hover:bg-studogrey/30 group justify-between h-fit min-h-10 px-5 border border-b-gray-300 last:border-b-transparent border-transparent rounded-4xl"}
                href={type === "ss" ? "/studoset/" + set.id : "/visualset/" + set.id}>
                <div className={"w-full flex flex-col justify-center gap-2"}>
                    <div className={"w-full flex items-center gap-3"}>
                        <Image src={type === "ss" ? "/icons/studyset.svg" : "/icons/visualset.svg"}
                               width={15}
                               height={15}
                               alt={"item_icon"}
                               className={"dark:invert dark:brightness-0"}/>
                        <span className={"truncate"}>{set.title}</span>
                        <span></span>
                    </div>
                </div>

                <FaArrowRightLong
                    className={"group-hover:opacity-100 transition-opacity duration-300 opacity-0"}
                />
        </Link>)

    }
}

