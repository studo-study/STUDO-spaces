import { useTranslations } from "next-intl";

const BottomCredits = () => {
  const t = useTranslations("studoset");
  const startYear = 2026;
  const year = new Date().getFullYear();
  const yearRange = year == startYear ? `${year}` : `${startYear} - ${year}`;
  return (
    <span
      className={
        " w-full min-h-20 opacity-50 text-sm flex items-center justify-center"
      }
    >
      © {yearRange}. Studo inc. - {t("rights")}
    </span>
  );
};

BottomCredits.displayName = "BottomCredits";
export default BottomCredits;
