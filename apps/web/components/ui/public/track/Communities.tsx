import { Link } from "@/i18n/routing";
import Image from "next/image";
import { FaUniversity, FaUserFriends } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { useTranslations } from "next-intl";
import { Community } from "@studo/types";

interface CommunitiesProps {
  communities: Community[];
}

export default function Communities({ communities }: CommunitiesProps) {
  const klassen = communities && communities;
  const empty = klassen && klassen.length === 0;
  const t = useTranslations("landing.search_result.classroom");
  return (
    <div
      className={`w-full h-full flex flex-col gap-5 ${empty ? "hidden" : "flex"}`}
    >
      <div
        className={
          "w-full min-h-30 h-fit grid xl:grid-cols-3 grid-cols-2 gap-5"
        }
      >
        {communities &&
          klassen.map((item: Community, i: number) => (
            <SetResult t={t} key={i} item={item} />
          ))}
      </div>
    </div>
  );
}

interface SetResultProps {
  item: Community;
  t: ReturnType<typeof useTranslations>;
}

function SetResult({ item, t }: SetResultProps) {
  const isColOrUn = item.type === "university" || item.type === "college";
  return (
    <Link
      href={"/classroom/" + item.id}
      className={`w-full min-h-40 rounded-2xl border-1  border-gray-300 dark:border-studogrey dark:bg-transparent 
                 bg-studogrey/30 drop-shadow-4xl drop-shadow-4xl drop-shadow-black p-5 flex flex-col gap-2`}
    >
      <div className={"w-full h-fit flex items-center justify-baseline gap-2"}>
        {getClassroomIcon(item.type)}
        <span className={"font-bold truncate"}>{item.name}</span>
        {item.verified && (
          <Image
            width={0}
            height={0}
            src={"/icons/verified.svg"}
            className={"w-4"}
            alt={""}
          />
        )}
      </div>
      <div className={"w-full h-full flex flex-row"}>
        <span
          className={
            "px-3 py-1 flex items-center justify-center h-fit w-fit text-white dark:text-studodarkblue rounded-full bg-studoblue text-xs"
          }
        >
          {t(getClassroomType(item.type))}
        </span>
      </div>
      {!isColOrUn && (
        <div
          className={
            "w-full h-fit flex items-center justify-between opacity-50 text-sm"
          }
        >
          <span>
            {t("started_by")} {item.owner}
          </span>
        </div>
      )}
    </Link>
  );
}

function getClassroomType(type: string) {
  switch (type) {
    case "university":
      return "univeristy";
    case "class_group":
      return "classroom_group";
    case "study_group":
      return "study_group";
    case "community_group":
      return "community";
  }
}

function getClassroomIcon(type: string) {
  switch (type) {
    case "university":
      return <FaUniversity />;
    case "class_group":
      return <IoSchoolOutline />;
    case "study_group":
      return <FaUserFriends />;
    case "community_group":
      return <TbWorld />;
  }
}
