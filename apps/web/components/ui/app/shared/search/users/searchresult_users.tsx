"use client";
import { useTranslations } from "next-intl";
import { FaAngleRight } from "react-icons/fa6";
import { Link } from "@/i18n/routing";
import { ProfileSearchResult } from "@studo/types";
import Avatar from "@studo/ui/design_system/avatar/Avatar";
import { useSearchParams } from "next/navigation";
import { useSearchResult } from "@/hooks/app/search/useSearchResult";
import { useUser } from "@/components/providers/auth/UserProvider";

export default function SearchResultUsers() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const result = useSearchResult(query ?? "").data;
  const users = result && result.data[1].data.slice(0, 4);
  const empty = users && users.length === 0;
  const t = useTranslations("landing.search_result.user");
  return (
    <div
      className={`w-full h-full flex flex-col gap-5 ${empty ? "hidden" : "flex"}`}
    >
      <div className={"w-full flex py-1 flex-row justify-between items-center"}>
        <span className={"font-bold"}>{t("users")}</span>
        <Link
          href={"search-result/users?q=" + query}
          className={`flex ${result && users?.length != 0 ? "flex" : "hidden"} flex-row items-center justify-end gap-2`}
        >
          {t("more")}
          <FaAngleRight />
        </Link>
      </div>
      <div className={"w-full min-h-20 h-fit grid grid-cols-4 gap-5"}>
        {result &&
          users?.map((item: ProfileSearchResult, i: number) => (
            <UserResult key={i} item={item} />
          ))}
      </div>
    </div>
  );
}

interface SetResultProps {
  item: ProfileSearchResult;
}

function UserResult({ item }: SetResultProps) {
  const user = useUser().user;
  return (
    <Link
      href={item.id === user?.id ? "/account" : "profile/" + item.id}
      className={`w-full min-h-fit h-fit  p-3 rounded-4xl border flex flex-row gap-3 border-studogrey/30 glass-rgb drop-shadow-3xl`}
    >
      <Avatar size={30} displayName={item.displayName} id={item.id} />
      <span className={"font-bold truncate"}>{item.displayName}</span>
    </Link>
  );
}
