import { useTranslations } from "next-intl";

export default function ExcelImport() {
  const t = useTranslations("import");
  return (
    <div className="w-full h-full relative min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
      <div className={"w-full h-full grid grid-cols-2 gap-5 "}>
        <div className={"w-full h-full flex flex-col gap-5"}>
          <div
            className={
              "w-full h-full overflow-hidden rounded-4xl border border-studoborder"
            }
          >
            <textarea
              placeholder="paste your text here"
              className="w-full h-full min-h-full dark:text-white resize-none p-5"
              name=""
              id=""
            ></textarea>
          </div>
          <div>
            <button
              type="button"
              className={`w-full bg-w-full z-10 h-12 uppercase flex rounded-full items-center justify-center bg-gray-700 text-white cursor-not-allowed`}
            >
              {t("import")}
            </button>
          </div>
        </div>
        <div
          className={"w-full h-full rounded-4xl border border-studoborder"}
        ></div>
      </div>
      <div></div>
    </div>
  );
}
