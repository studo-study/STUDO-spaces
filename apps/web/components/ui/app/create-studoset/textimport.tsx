import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

export default function Textimport() {
  const t = useTranslations("import");
  return (
    <div className="w-full h-full relative min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
      <div className={"w-full h-full grid grid-cols-2 gap-10 "}>
        <div className={"w-full h-full flex flex-col gap-5"}>
          <div
            className={
              "w-full h-full overflow-hidden rounded-4xl border border-studoborder"
            }
          >
            <textarea
              placeholder="paste your text here"
              className="w-full h-full min-h-full dark:text-white resize-none p-5 bg-studogrey/30 scroll-hidden"
              name=""
              id=""
            ></textarea>
          </div>
          <div>
            <BaseButton
              variant={"submit"}
              type={"button"}
              className={"min-w-full"}
              label={t("import")}
            />
          </div>
        </div>
        <div className={"w-full h-full rounded-4xl"}>
          <span>{t("text_import_title")}</span>
        </div>
      </div>
      <div></div>
    </div>
  );
}
