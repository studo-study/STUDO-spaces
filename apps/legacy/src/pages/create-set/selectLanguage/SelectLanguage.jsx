import { useTranslation } from "react-i18next";

export default function SelectLanguage({ Selected }) {
  const { t, i18n } = useTranslation();
  const Default = t("Language");

  let selected = Default;

  return (
    <div className="flex flex-row justify-end items-center cursor-pointer w-full overflow-hidden">
      <span className="font-atrament text-studodarkblue dark:text-white font-semibold text-sm pr-4">
        {selected}
      </span>
    </div>
  );
}
