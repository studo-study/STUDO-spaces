"use client";

import { useAdminUserDetail } from "@/hooks/app/admin/useAdminUserDetail";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import { GoDotFill } from "react-icons/go";
import { TbFlameFilled } from "react-icons/tb";
import {
  TbBook,
  TbFolder,
  TbPhoto,
  TbSchool,
  TbClock,
  TbTarget,
  TbCalendar,
  TbShield,
  TbUser,
  TbHash,
} from "react-icons/tb";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import SetItem from "@/components/ui/app/private/home/YourSets/SetItem";

interface Props {
  userId: string;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-3xl border bg-studogrey/20 border-studoborder/30 p-4">
      <span className="text-studoborder opacity-60">{icon}</span>
      <p className="text-xs opacity-50">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest opacity-40">
      {children}
    </h2>
  );
}

function SessionRow({
  setId,
  setType,
  accuracy,
  duration,
  startedAt,
}: {
  setId: string;
  setType: string;
  accuracy: number;
  duration: number;
  startedAt: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-xl border border-studoborder/20 px-4 py-3">
      <p className="truncate text-xs font-mono opacity-50">{setId}</p>
      <span className="text-xs opacity-40">{setType}</span>
      <span className="text-xs font-medium text-emerald-500">{accuracy}%</span>
      <span className="text-xs opacity-40">
        {duration}m · {new Date(startedAt).toLocaleDateString("nl-BE")}
      </span>
    </div>
  );
}

const AdminUserDetail = ({ userId }: Props) => {
  const { data, isLoading, isError } = useAdminUserDetail(userId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center opacity-40">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center opacity-40">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4 rounded-3xl bg-studogrey/20 border border-studoborder/30 p-6 sm:flex-row sm:items-center sm:gap-6">
        <Avatar displayName={data.displayName} id={data.id} size={72} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{data.displayName}</h1>
            <span
              className={`flex items-center rounded-full border px-2 py-0.5 text-xs ${
                data.banned
                  ? "border-rose-400/30 bg-rose-300/20 text-rose-500"
                  : "border-emerald-400/30 bg-emerald-300/20 text-emerald-500"
              }`}
            >
              <GoDotFill size={15} />
              {data.banned ? "banned" : "active"}
            </span>
            {data.verified && (
              <RiVerifiedBadgeFill className={"text-blue-500"} />
            )}
          </div>
          <p className="text-sm opacity-50">{data.email}</p>
          <div className="mt-1 flex flex-wrap gap-4 text-xs opacity-40">
            <span className="flex items-center gap-1">
              <TbHash size={12} />
              {data.joinNumber}
            </span>
            <span className="flex items-center gap-1">
              <TbCalendar size={12} />
              {new Date(data.join_date).toLocaleDateString("nl-BE")}
            </span>
            <span className="flex items-center gap-1">
              <TbUser size={12} />
              {data.publicRole}
            </span>
            {data.streak_count !== null && (
              <span className="flex items-center gap-1 text-orange-400">
                <TbFlameFilled size={12} />
                {data.streak_count} dag streak
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <SectionTitle>Stats</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <StatCard
            icon={<TbBook size={18} />}
            label="studysets"
            value={data.stats.totalStudysets}
          />
          <StatCard
            icon={<TbPhoto size={18} />}
            label="visualsets"
            value={data.stats.totalVisualsets}
          />
          <StatCard
            icon={<TbFolder size={18} />}
            label="folders"
            value={data.stats.totalFolders}
          />
          <StatCard
            icon={<TbSchool size={18} />}
            label="klassen"
            value={data.stats.totalClassrooms}
          />
          <StatCard
            icon={<TbClock size={18} />}
            label="sessies (recent)"
            value={data.stats.totalSessions}
          />
          <StatCard
            icon={<TbClock size={18} />}
            label="min geleerd"
            value={data.stats.totalTimeLearned}
          />
          <StatCard
            icon={<TbTarget size={18} />}
            label="gem. accuracy"
            value={`${data.stats.averageAccuracy}%`}
          />
        </div>
      </div>

      {/* Persoonlijke info */}
      <div>
        <SectionTitle>Account info</SectionTitle>
        <div className="mt-3 grid grid-cols-1 gap-2 rounded-3xl bg-studogrey/20 border border-studoborder/20 p-4 sm:grid-cols-2">
          {[
            { label: "ID", value: data.id },
            { label: "Email", value: data.email },
            { label: "Roles", value: data.roles.join(", ") },
            {
              label: "Laatste login",
              value: new Date(data.last_login).toLocaleString("nl-BE"),
            },
            {
              label: "Streak gestart",
              value: data.streak_started
                ? new Date(data.streak_started).toLocaleDateString("nl-BE")
                : "—",
            },
            {
              label: "Streak laatste update",
              value: data.streak_last_update
                ? new Date(data.streak_last_update).toLocaleDateString("nl-BE")
                : "—",
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 py-1">
              <p className="text-xs opacity-40">{label}</p>
              <p className="text-sm font-medium break-all">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recente studysets */}
        <div>
          <SectionTitle>Laatste 10 studysets</SectionTitle>
          <div className="mt-3 flex flex-col gap-2 flex-1 h-full">
            {data.recentStudysets.length === 0 ? (
              <p className="text-sm opacity-40 h-10 flex items-center justify-center">
                No studosets
              </p>
            ) : (
              data.recentStudysets.map((s, key) => (
                <SetItem
                  key={key}
                  item={{
                    set_id: s.id,
                    last_studied: s.last_studied ?? s.created_at,
                    title: s.title,
                    Course: "",
                    type: "studoset",
                    progress: s.card_count ?? 0,
                    length: s.card_count ?? 0,
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Recente visualsets */}
        <div>
          <SectionTitle>Laatste 10 visualsets</SectionTitle>
          <div className="mt-3 flex flex-col gap-2 flex-1 h-full">
            {data.recentVisualsets.length === 0 ? (
              <p className="text-sm opacity-40 w-full h-10 flex items-center justify-center">
                No visualsets
              </p>
            ) : (
              data.recentVisualsets.map((v, key) => (
                <SetItem
                  key={key}
                  item={{
                    set_id: v.id,
                    last_studied: v.last_studied ?? v.created_at,
                    title: v.title,
                    Course: "",
                    type: "visualset",
                    progress: v.pin_count ?? 0,
                    length: v.pin_count ?? 0,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recente sessies */}
      <div>
        <SectionTitle>Recente sessies</SectionTitle>
        <div className="mt-3 flex flex-col gap-2">
          {data.recentSessions.length === 0 ? (
            <p className="text-sm opacity-40">Geen sessies</p>
          ) : (
            data.recentSessions.map((s) => (
              <SessionRow
                key={s.id}
                setId={s.set_id}
                setType={s.set_type}
                accuracy={s.accuracy}
                duration={s.duration_min}
                startedAt={s.started_at}
              />
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Folders */}
        <div>
          <SectionTitle>Folders</SectionTitle>
          <div className="mt-3 flex flex-col gap-2">
            {data.folders.length === 0 ? (
              <p className="text-sm opacity-40">Geen folders</p>
            ) : (
              data.folders.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-xl border border-studoborder/20 px-4 py-3"
                >
                  <TbFolder size={16} className="shrink-0 opacity-40" />
                  <p className="text-sm font-medium">{f.name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Klassen */}
        <div>
          <SectionTitle>Klassen</SectionTitle>
          <div className="mt-3 flex flex-col gap-2">
            {data.classrooms.length === 0 ? (
              <p className="text-sm opacity-40">Geen klassen</p>
            ) : (
              data.classrooms.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-studoborder/20 px-4 py-3"
                >
                  <TbSchool size={16} className="shrink-0 opacity-40" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs opacity-50">
                      {c.school} · {c.role}
                    </p>
                  </div>
                  {c.verified && (
                    <TbShield size={14} className="shrink-0 text-blue-400" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Studo profile */}
      {data.studoprofile && (
        <div>
          <SectionTitle>Studo profiel</SectionTitle>
          <div className="mt-3 rounded-2xl border border-studoborder/20 p-4">
            <div className="flex items-center gap-3">
              <Avatar
                displayName={data.studoprofile.displayName}
                id={data.id}
                size={40}
              />
              <div>
                <p className="font-semibold">{data.studoprofile.displayName}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.studoprofile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-studoborder/30 px-2 py-0.5 text-xs opacity-60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {data.studoprofile.tracks.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {data.studoprofile.tracks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 text-sm opacity-70"
                  >
                    <span className="font-medium">{t.trackName}</span>
                    <span className="opacity-50">·</span>
                    <span className="opacity-50">{t.grade}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

AdminUserDetail.displayName = "AdminUserDetail";
export default AdminUserDetail;
