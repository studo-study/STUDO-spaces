import { useTranslations } from "next-intl";

const BottomCredits = () => {
  const t = useTranslations("studoset");
  const year = new Date().getFullYear();
  return (
    <span
      className={
        "absolute bottom w-full min-h-20 opacity-50 text-sm flex items-center justify-center"
      }
    >
      © 2026 - {year}. Studo inc. - {t("rights")}
    </span>
  );
};

BottomCredits.displayName = "BottomCredits";
export default BottomCredits;
