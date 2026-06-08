"use client";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { ClassroomUser } from "@/types/types";
import { useTranslations } from "next-intl";
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import UserSearch from "@/components/ui/app/private/classroom/users/UserSearch";
import { JoinRequest } from "@studo/types";

interface ClassroomUserGridProps {
  users: ClassroomUser[];
  requests?: JoinRequest[];
}

export default function ClassroomUserGrid(props: ClassroomUserGridProps) {
  const { users, requests } = props;
  const [filteredSets, setFilteredSets] = useState(users);
  const t = useTranslations("classroom");
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(requests!);

  return (
    <>
      <div className="w-full flex flex-row gap-5 items-center justify-end py-3">
        <UserSearch users={users} setFilteredUsers={setFilteredSets} />
      </div>
      <div className="w-full h-full flex flex-col">
        {requests && joinRequests.length != 0 && (
          <div className="w-full flex flex-col gap-5 mb-10">
            <span className="font-bold text-lg dark:text-white text-studodarkblue">
              {t("requests")}:
            </span>
            {joinRequests.map((item, i) => (
              <JoinRequestItem
                key={i}
                t={t}
                request={item}
                joinRequests={joinRequests}
                setJoinRequests={setJoinRequests}
              />
            ))}
          </div>
        )}

        <div className="relative w-full flex-1 min-h-0 overflow-y-auto scroll-hidden flex flex-col gap-5 pb-30">
          <span className="font-bold text-lg dark:text-white text-studodarkblue">
            {t("users")}:
          </span>
          {filteredSets.map((user, i) => (
            <UserItem key={i} t={t} user={user} />
          ))}
          <div className="fixed z-10 bottom-15 h-25 min-w-1/2 bg-linear-0 dark:from-bg-dark from-bg-white to-transparent" />
        </div>
      </div>
    </>
  );
}

interface UserItemProps {
  t: ReturnType<typeof useTranslations>;
  user: ClassroomUser;
}

interface JoinRequestProps {
  t: ReturnType<typeof useTranslations>;
  request: JoinRequest;
  joinRequests: JoinRequest[];
  setJoinRequests: React.Dispatch<React.SetStateAction<JoinRequest[]>>;
}

function JoinRequestItem({
  t,
  request,
  joinRequests,
  setJoinRequests,
}: JoinRequestProps) {
  const toggleRemove = () => {
    const i = joinRequests.indexOf(request);
    setJoinRequests(joinRequests.splice(i, 0));
  };

  return (
    <div
      className={`max-h-15 h-15 px-3 max-w-full min-w-full cursor-pointer justify-between
                 flex gap-3 items-center w-full rounded-full bg-studogrey/30 border border-studoborder/30 hover:border-studoborder transition-all duration-300 overflow-hidden`}
    >
      <div className={"w-fit flex flex-row gap-5 items-center"}>
        <Avatar id={request.id} displayName={request.displayName} />
        <Link
          href={"/apps/web/components/ui/app/shared/profile" + request.id}
          className={"dark:text-white hover:underline text-studodarkblue"}
        >
          {" "}
          {request.displayName} {t("w_l_t_j")}
        </Link>
      </div>
      <div
        className={
          "w-fit flex flex-row items-center gap-5 dark:text-white text-studodarkblue"
        }
      >
        <button
          onClick={toggleRemove}
          className={
            "cursor-pointer hover:bg-emerald-400 active:scale-95 transition-all duration-300 w-10 h-10 rounded-full bg-studogrey items-center justify-center flex"
          }
        >
          <FaCheck size={18} />
        </button>
        <button
          onClick={toggleRemove}
          className={
            "cursor-pointer hover:bg-rose-400  active:scale-95 transition-all duration-300 w-10 h-10 rounded-full bg-studogrey items-center justify-center flex"
          }
        >
          <IoClose size={25} />
        </button>
      </div>
    </div>
  );
}

function UserItem({ t, user }: UserItemProps) {
  return (
    <Link
      href={"/apps/web/components/ui/app/shared/profile" + user.user_id}
      className={`max-h-15 min-h-15 flex-col sm:flex-row px-3 py-4 sm:py-0 max-w-full min-w-full cursor-pointer
                 flex gap-3 items-center w-full rounded-full bg-studogrey/30 border border-studoborder/30 
                 hover:border-studoborder transition-all duration-300 overflow-hidden`}
    >
      <Avatar id={user.user_id} displayName={user.displayName} />
      <div className={"w-full flex flex-col"}>
        <div
          className={
            "w-fit flex items-center text-studodarkblue dark:text-white gap-3"
          }
        >
          <span className={"w-fit flex items-center"}>{user.displayName}</span>•
          {user.streak >= 5 && (
            <div className={"w-fit flex flex-row items-center gap-0.5"}>
              <span className={"text-studodarkblue dark:text-white"}>
                {user.streak}{" "}
              </span>
              <Image
                src={"/icons/streak2.svg"}
                alt="streak"
                width={20}
                height={20}
                className="h-5"
              />
            </div>
          )}
        </div>
      </div>
      <div className={"flex items-center gap-3 min-w-fit"}>
        {user.role === "teacher" ? (
          <span
            className={
              "w-fit text-studodarkblue/30 border-2 border-studoborder bg-studogrey/20 px-3 py-1 rounded-full dark:text-white/30"
            }
          >
            {user.role}
          </span>
        ) : (
          <span
            className={"text-studodarkblue/30 dark:text-white/30 text-sm pr-3"}
          >
            {t("joined")} {new Date(user.joined_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </Link>
  );
}
