"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const isActive = (link: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, "");
    return (
      pathWithoutLocale === link || pathWithoutLocale.startsWith(link + "/")
    );
  };
  const items = [
    { link: "/admin/stats", label: "stats" },
    { link: "/admin/reports", label: "reports" },
    { link: "/admin/users", label: "users" },
    { link: "/admin/search", label: "search" },
    { link: "/admin/invite", label: "invite" },
  ];
  return (
    <div className={"w-full h-fit flex flex-col gap-3"}>
      <span
        className={
          "w-full h-fit flex items-center text-studodarkblue dark:text-white font-bold text-2xl mb-3"
        }
      >
        {t("title")}
      </span>
      <div className={"w-full flex text-sm flex-row items-center gap-5"}>
        {items.map((item) => (
          <Link
            key={item.label}
            className={`w-fit min-w-20 text-center ${isActive(item.link) ? "font-bold" : null} dark:text-white text-studodarkblue`}
            href={item.link}
          >
            {t(item.label)}
          </Link>
        ))}
      </div>
      <div className={"w-full h-0.5 bg-studogrey rounded-full"} />
    </div>
  );
}
