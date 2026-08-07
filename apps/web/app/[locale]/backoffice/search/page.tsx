import { Metadata } from "next";
import { useTranslations } from "next-intl";
import AdminSearch from "@/components/ui/app/private/admin/search/AdminSearch";

export const metadata: Metadata = {
  title: "Admin Dashboard | Studo",
};

export default function SearchPage() {
  const t = useTranslations("admin");
  return (
    <div className={"w-full h-full flex flex-col gap-5"}>
      <div className={"w-full flex items-center justify-center"}>
        <AdminSearch />
      </div>
      <div className={"w-full h-full flex items-center justify-center"}>
        <span className={"dark:text-white/30 font-bold"}>
          {t("not_searched")}
        </span>
      </div>
    </div>
  );
}
