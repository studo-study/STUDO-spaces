"use client"
import {useTranslations} from "next-intl";
import {HiLightningBolt} from "react-icons/hi";
import {mockChallengeMembers, mockChallenges, mockFullClassrooms} from "@/data/mocks/classroomsMock";
import {useParams} from "next/navigation";
import {ChallengeResponseDTO, ClassroomUser, FullClassroomSet} from "@/types/types";
import {IoHourglassOutline} from "react-icons/io5";
import {GiPodium, GiSwordsEmblem} from "react-icons/gi";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {IoIosClose} from "react-icons/io";

export default function ChallengeGrid() {
    const members = mockChallengeMembers;
    const challenges = mockChallenges;
    const classroom = useParams().id;
    const fullClassroom = mockFullClassrooms;

    const t = useTranslations("classroom.challenges")
    return (
        <div className={"w-full h-full flex flex-col gap-3 overflow-y-auto pt-5"}>
            <div className={"w-full h-full flex flex-col lg:grid lg:grid-cols-6 lg:grid-rows-5 gap-5"}>

                {/* Running challenges — full width, horizontal scroll */}
                <div className={"w-full lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-2"}>
                    <span className={"text-studodarkblue dark:text-white flex items-center gap-2 font-bold"}>
                        <HiLightningBolt />
                        {t("running")}:
                    </span>
                    <div className={"w-full h-28 flex flex-row overflow-x-auto scroll-hidden overflow-y-visible gap-5 py-3"}>
                        {challenges
                            .filter(challenge => challenge.classroom_id === classroom)
                            .map((challenge, i) => <ChallengeItem challenge={challenge} key={i} />)}
                    </div>
                </div>

                {/* Bottom 3 panels — horizontal scroll on tablet, grid on desktop */}
                <div className={"flex flex-row overflow-x-auto gap-5 lg:contents"}>

                    {/* Left panel */}
                    <div className={"min-w-[340px] lg:min-w-0 flex-shrink-0 h-64 lg:h-full rounded-2xl bg-studogrey/30 border-studoborder/10 border lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-6"} />

                    {/* Middle panel */}
                    <div className={"min-w-[340px] lg:min-w-0 flex-shrink-0 h-64 lg:h-full rounded-2xl bg-studogrey/30 border-studoborder/10 border lg:col-start-3 lg:col-end-5 lg:row-start-2 lg:row-end-6"} />

                    {/* Leaderboard */}
                    <div className={"min-w-[280px] lg:min-w-0 flex-shrink-0 h-64 lg:h-full rounded-2xl p-5 bg-studogrey/30 border-studoborder/10 border lg:col-start-5 lg:col-end-7 lg:row-start-2 lg:row-end-6"}>
                        <span className={"text-studodarkblue dark:text-white font-bold"}>
                            {t("current_leaderboard")}:
                        </span>
                        <div className={"w-full h-full overflow-y-auto flex flex-col gap-3 py-4"}>
                            {fullClassroom
                                .filter(cs => cs.id === classroom)
                                .flatMap(cs => cs.users)
                                .sort((a, b) => a.position - b.position)
                                .map((user, i) => <UserItem key={i} user={user} />)
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

interface ChallengeItemProps {
    challenge: ChallengeResponseDTO;
}

function ChallengeItem({challenge}: ChallengeItemProps) {
    const [popupChallenge, setPopupChallenge] = useState(false);

    return (
        <div className={"w-48 md:w-56 lg:w-1/4 h-full relative flex-shrink-0"}>
            <div
                onClick={() => setPopupChallenge(prev => !prev)}
                className={`w-full h-20 rounded-3xl bg-studogrey/10 cursor-pointer
                    flex items-center dark:text-white text-studodarkblue justify-center gap-3
                    border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 shadow-2xl`}
            >
                {challenge.challengeType === "time attack"
                    ? <IoHourglassOutline />
                    : challenge.challengeType === "mastery tournament"
                        ? <GiPodium />
                        : <GiSwordsEmblem />}
                <span className={"font-bold truncate max-w-[60%]"}>{challenge.title}</span>
            </div>
            <ChallengePopup
                challenge={challenge}
                popupChallenge={popupChallenge}
                setPopupChallenge={setPopupChallenge}
            />
        </div>
    )
}

interface ChallengePopupProps {
    popupChallenge: boolean;
    setPopupChallenge: React.Dispatch<React.SetStateAction<boolean>>;
    challenge: ChallengeResponseDTO;
}

function ChallengePopup({challenge, popupChallenge, setPopupChallenge}: ChallengePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations("classroom.addset")
    const [importedClassrooms, setImportedClassrooms] = useState<FullClassroomSet[]>([]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setPopupChallenge(false);
            }
        };
        if (challenge) {
            setTimeout(() => document.addEventListener("mousedown", handleClickOutside), 0);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popupChallenge, setPopupChallenge]);

    useEffect(() => {
        if (popupChallenge) inputRef.current?.focus();
        else inputRef.current?.blur();
    }, [challenge]);

    return (
        <div className={`fixed inset-0 flex items-start justify-center pt-24 md:pt-32 lg:pt-50 w-full bg-black/50 h-full z-[9999] px-4 md:px-8 lg:px-0
            ${popupChallenge ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <div
                ref={popupRef}
                className={`w-full md:w-4/5 lg:w-2/3 min-h-48 lg:min-h-200 z-[9999] rounded-2xl relative
                    bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                    border border-white/50 dark:border-white/10
                    shadow-xl shadow-black/10 dark:shadow-black/30
                    transition-all duration-100 ease-out origin-top px-5 md:px-7 py-10
                    flex flex-col gap-3 justify-between items-center
                    ${popupChallenge ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
            >
                <div className={"w-full flex px-2 py-2 dark:text-white text-4xl text-studodarkblue items-center justify-end absolute top-0 left-0 z-10"}>
                    <div className={"h-8 w-8 rounded-full hover:bg-studogrey transition-all duration-300 justify-center items-center cursor-pointer active:scale-95 flex"}>
                        <IoIosClose onClick={() => setPopupChallenge(false)} />
                    </div>
                </div>
                <div className={"w-full h-fit flex flex-col gap-7"}>
                    {/* popup content */}
                </div>
            </div>
        </div>
    );
}

interface UserItemProps {
    user: ClassroomUser;
}

function UserItem({user}: UserItemProps) {
    return (
        <div className={`w-full h-16 lg:h-20 rounded-3xl bg-studogrey/10 px-4 lg:px-5
            flex items-center dark:text-white text-studodarkblue justify-start gap-3
            border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 shadow-2xl`}>
            <span className={"text-sm lg:text-base font-medium w-5 text-center shrink-0"}>{user.position}</span>
            <div className={"w-10 h-10 shrink-0 rounded-full bg-studogrey overflow-hidden"}>
                <Image src={user.img_url} width={40} height={40} alt={"pfp"} className={"object-cover w-10 h-10"} />
            </div>
            <span className={"truncate text-sm lg:text-base"}>{user.displayName}</span>
        </div>
    )
}