import { useTranslations } from "next-intl";

interface QuickstatsProps {
  t: ReturnType<typeof useTranslations>;
}

const users = [
  {
    link: "user1",
    date: new Date().toISOString(),
    name: "user1",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
  {
    link: "user1",
    date: new Date().toISOString(),
    name: "user1",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
  {
    link: "user1",
    date: new Date().toISOString(),
    name: "user1",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
  {
    link: "user1",
    date: new Date().toISOString(),
    name: "user1",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
  {
    link: "user1",
    date: new Date().toISOString(),
    name: "user1",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
];

const activity = [{}];

const popular_sets = [{}];

export default function Overview({ t }: QuickstatsProps) {
  return (
    <div
      className={
        "w-full h-full grid grid-rows-1 grid-cols-3 gap-5 scroll-hidden"
      }
    >
      <div
        className={
          "w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border  border-studoborder/30 p-7 flex flex-col gap-1"
        }
      >
        <span
          className={
            "w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row"
          }
        >
          {t("most_pp_set")}:
        </span>
        <div
          className={
            "w-full h-full flex flex-col gap-5 scroll-hidden py-5 overflow-y-scroll"
          }
        >
          {popular_sets.map(() => puplarsets())}
        </div>
      </div>
      <div
        className={
          "w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border border-studoborder/30 p-7 flex flex-col gap-1"
        }
      >
        <span
          className={
            "w-full font-bold dark:text-white/50  text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row"
          }
        >
          {t("activity")}:
        </span>
        <div
          className={
            "w-full h-full flex flex-col gap-5 scroll-hidden py-5 overflow-y-scroll"
          }
        >
          {activity.map(() => other_activity())}
        </div>
      </div>
      <div
        className={
          "w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border border-studoborder/30 p-7 flex flex-col gap-1"
        }
      >
        <span
          className={
            "w-full font-bold dark:text-white/50  text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row"
          }
        >
          {t("recently_usrs")}:
        </span>
        <div
          className={
            "w-full h-full flex flex-col gap-5 scroll-hidden py-5 overflow-y-scroll"
          }
        >
          {users.map(() => recently_usrs())}
        </div>
      </div>
    </div>
  );
}

function recently_usrs() {
  return (
    <div
      className={
        "w-full rounded-full h-15 bg-studogrey/10 border shadow-2xl border-studoborder/50"
      }
    ></div>
  );
}

function other_activity() {
  return (
    <div
      className={
        "w-full rounded-full h-15 bg-studogrey/10 border shadow-2xl border-studoborder/50"
      }
    ></div>
  );
}

function puplarsets() {
  return (
    <div
      className={
        "w-full rounded-full h-15 bg-studogrey/10 border shadow-2xl border-studoborder/50"
      }
    ></div>
  );
}
