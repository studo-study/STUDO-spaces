"use client"
import {useTranslations} from "next-intl";
import {HiLightningBolt} from "react-icons/hi";
import {mockChallenges, mockFullClassrooms} from "@/data/mocks/classroomsMock";
import {useParams} from "next/navigation";
import {ChallengeResponseDTO, ClassroomUser} from "@/types/types";
import {IoHourglassOutline} from "react-icons/io5";
import {GiPodium, GiSwordsEmblem} from "react-icons/gi";
import {useEffect, useRef, useState} from "react";
import {IoIosClose} from "react-icons/io";
import Avatar from "@/components/ui/design_system/avatar/Avatar";

export default function ChallengeGrid() {
    const challenges = mockChallenges;
    const classroom = useParams().id;
    const fullClassroom = mockFullClassrooms;

    const t = useTranslations("classroom.challenges")
    return (
        <div className={"w-full h-full flex flex-col scroll-hidden"}>
            <div className={"w-full h-full flex flex-col"}>
                <div className={"w-full gap-5 flex flex-col"}>
                    <span className={"text-studodarkblue dark:text-white flex items-center gap-2 font-bold"}>
                        <HiLightningBolt />
                        {t("running")}:
                    </span>
                    <div className={"w-full h-fit grid grid-cols-2 grid-rows-3 gap-5"}>
                        {challenges
                            .filter(challenge => challenge.classroom_id === classroom)
                            .map((challenge, i) => <ChallengeItem challenge={challenge} key={i} />)}
                    </div>
                </div>

                <div className={"grid grid-cols-2 min-w-full h-full gap-5 w-full"}>
                    <div className={"min-w-full rounded-3xl bg-studogrey/30 border-studoborder/30 border"} />
                    <div className={"min-w-full rounded-3xl p-5 bg-studogrey/30 border-studoborder/30 border "}>
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
        <div className={"w-full min-h-full relative"}>
            <div
                onClick={() => setPopupChallenge(prev => !prev)}
                className={`w-full h-10 rounded-full bg-studoblue/30 cursor-pointer
                    flex items-center dark:text-white text-studodarkblue justify-center gap-3
                    border border-studoborder/30 hover:border-studoborder transition-all duration-300`}
            >
                {challenge.challengeType === "time attack"
                    ? <IoHourglassOutline />
                    : challenge.challengeType === "mastery tournament"
                        ? <GiPodium />
                        : <GiSwordsEmblem />}
                <span className={"font-bold truncate text-sm max-w-[60%]"}>{challenge.title}</span>
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
    }, [challenge, popupChallenge, setPopupChallenge]);

    useEffect(() => {
        if (popupChallenge) inputRef.current?.focus();
        else inputRef.current?.blur();
    }, [challenge, popupChallenge]);

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
                <Avatar displayName={user.displayName} id={user.user_id} size={40}/>
            <span className={"truncate text-sm lg:text-base"}>{user.displayName}</span>
        </div>
    )
}