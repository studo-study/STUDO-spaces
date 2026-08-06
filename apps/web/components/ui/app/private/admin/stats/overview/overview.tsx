"use client";

import { useTranslations } from "next-intl";
import { useAdminStats } from "@/hooks/app/admin/useAdminStats";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import Link from "next/link";
import { TbBook, TbPhoto } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";

function SkeletonRow() {
  return (
    <div className="w-full rounded-2xl h-14 bg-studogrey/10 border border-studoborder/30 animate-pulse" />
  );
}

function ColumnWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 min-h-0 rounded-4xl dark:bg-studogrey/10 bg-studogrey border border-studoborder/30 p-7 flex flex-col gap-1">
      <span className="w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row">
        {title}
      </span>
      <div className="w-full h-full flex flex-col gap-3 py-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default function Overview() {
  const t = useTranslations("admin");
  const { data, isLoading } = useAdminStats();

  if (isLoading || !data) {
    return (
      <div className="w-full h-full grid grid-rows-1 grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <ColumnWrapper key={i} title="">
            {[...Array(5)].map((__, j) => (
              <SkeletonRow key={j} />
            ))}
          </ColumnWrapper>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 w-full grid grid-rows-1 grid-cols-3 gap-5 scroll-hidden">
      {/* Popular sets */}
      <ColumnWrapper title={t("most_pp_set")}>
        {data.popularSets.length === 0 ? (
          <p className="text-sm opacity-40 min-w-0 min-h-0 flex-1 flex items-center justify-center dark:text-white">
            Geen data
          </p>
        ) : (
          data.popularSets.map((set) => (
            <div
              key={set.id}
              className="w-full flex items-center gap-3 rounded-2xl border border-studoborder/20 px-4 py-3"
            >
              <span className="text-lg font-bold opacity-30 w-5 text-right shrink-0">
                {set.rank}
              </span>
              <span className="opacity-40 shrink-0">
                {set.type === "studyset" ? (
                  <TbBook size={16} />
                ) : (
                  <TbPhoto size={16} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{set.title}</p>
                <p className="truncate text-xs opacity-50">{set.displayName}</p>
              </div>
              <p className="shrink-0 text-xs opacity-40">{set.displayName}</p>
            </div>
          ))
        )}
      </ColumnWrapper>

      {/* Recent activity */}
      <ColumnWrapper title={t("activity")}>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm opacity-40 min-w-0 min-h-0 flex-1 flex items-center justify-center dark:text-white">
            Geen activiteit
          </p>
        ) : (
          data.recentActivity.map((act) => (
            <Link
              key={act.id}
              href={`/apps/web/components/ui/app/app/admin/users/${act.userId}`}
              className="w-full flex items-center gap-3 rounded-full bg-studogrey/20 dark:text-white text-studodarkblue border border-studoborder/20 px-4 py-3 hover:border-studoborder transition-colors"
            >
              <Avatar displayName={act.displayName} id={act.userId} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {act.displayName}
                </p>
                <p className="truncate text-xs opacity-50">{act.title}</p>
              </div>
              <p className="shrink-0 text-xs opacity-40">
                {new Date(act.lastSeen).toLocaleDateString("nl-BE")}
              </p>
            </Link>
          ))
        )}
      </ColumnWrapper>

      {/* Recent users */}
      <ColumnWrapper title={t("recently_usrs")}>
        {data.recentUsers.map((user) => (
          <Link
            key={user.id}
            href={`/apps/web/components/ui/app/app/admin/users/${user.id}`}
            className="w-full flex items-center gap-3 rounded-full border border-studoborder/30 bg-studogrey/20 dark:text-white text-studodarkblue px-4 py-3 hover:border-studoborder transition-colors"
          >
            <Avatar displayName={user.displayName} id={user.id} size={32} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.displayName}</p>
              <p className="truncate text-xs opacity-50">{user.publicRole}</p>
            </div>
            <span
              className={`shrink-0 flex items-center text-xs ${
                user.banned ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              <GoDotFill size={14} />
            </span>
          </Link>
        ))}
      </ColumnWrapper>
    </div>
  );
}
