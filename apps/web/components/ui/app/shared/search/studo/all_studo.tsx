"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { StudoProfileSearchResult } from "@studo/types";
import { useSearchParams } from "next/navigation";
import { useSearchResult } from "@/hooks/app/search/useSearchResult";
import NoResult from "@/components/ui/app/shared/search/noresult";

export default function AllStudoResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const result = useSearchResult(query ?? "").data;
  const users = result && result.data[3].data;
  const empty = users && users.length === 0;

  if (empty) return <NoResult />;

  return (
    <div className={"w-full h-full flex flex-col gap-5"}>
      <div className={"w-full min-h-30 h-fit grid grid-cols-3 gap-5"}>
        {result &&
          users?.map((item: StudoProfileSearchResult, i: number) => (
            <UserResult key={i} item={item} />
          ))}
      </div>
    </div>
  );
}

interface SetResultProps {
  item: StudoProfileSearchResult;
}

function UserResult({ item }: SetResultProps) {
  return (
    <Link
      href={`/track/${item.id}`}
      className="relative w-full h-40 rounded-2xl hover:scale-102 transition-transform duration-500 overflow-hidden border border-studogrey/30 drop-shadow-3xl"
    >
      {/* Banner */}
      <Image
        src={item.banner_url}
        alt={`${item.displayName} banner`}
        fill
        className="object-cover opacity-75"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-linear-to-t from-gray-900/90 to-transparent" />

      {/* Profile info */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-row items-center gap-3 px-4 pb-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image
            src="/icons/icon2.png"
            alt="pfp"
            fill
            className="object-cover"
          />
        </div>
        <span className="font-bold truncate text-white flex flex-row">
          Studo {item.displayName}
        </span>
        <Image
          src="/icons/verified.svg"
          alt="verified"
          width={20}
          height={20}
          className="shrink-0"
        />
      </div>
    </Link>
  );
}
