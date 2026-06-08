"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ProfileSearchResult } from "@studo/types";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import { useSearchParams } from "next/navigation";
import { useSearchResult } from "@/hooks/app/search/useSearchResult";
import NoResult from "@/components/ui/app/shared/search/noresult";

export default function AllUsers() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const result = useSearchResult(query ?? "").data;
  const users = result && result.data[1].data;
  const empty = users && users.length === 0;

  if (empty) return <NoResult />;

  return (
    <div className={"w-full h-full flex flex-col gap-5"}>
      <div className={"w-full min-h-20 h-fit grid grid-cols-4 gap-5"}>
        {result &&
          users?.map((item: ProfileSearchResult, i: number) => (
            <UserResult key={i} item={item} />
          ))}
      </div>
    </div>
  );
}

interface UserResultProps {
  item: ProfileSearchResult;
}

function UserResult({ item }: UserResultProps) {
  return (
    <Link
      href={"profile/" + item.id}
      className={`w-full min-h-fit h-fit p-3 rounded-4xl border flex flex-row gap-3 border-studogrey/30 glass-rgb drop-shadow-3xl`}
    >
      <Avatar size={30} displayName={item.displayName} id={item.id} />
      <span className={"font-bold truncate"}>{item.displayName}</span>
    </Link>
  );
}
