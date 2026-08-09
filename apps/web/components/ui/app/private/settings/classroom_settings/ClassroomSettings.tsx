"use client";
import { useTranslations } from "next-intl";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";

export default function ClassroomSettings(props: SettingsSection) {
  const { isVisible } = props;
  const t = useTranslations("settings");

  if (isVisible != "app") {
    return;
  }

  return (
    <section className={"flex flex-col gap-5 w-full min-h-fit"}>
      <span className={"w-full text-base font-bold h-fit"}>
        {t("class_settings")}
      </span>
      <div
        className={
          "w-full min-h-40 h-fit rounded-3xl border border-studoborder"
        }
      >
        <div
          className={
            "w-full border-b gap-4 border-studoborder px-10 py-8 flex flex-col"
          }
        >
          <div className={"w-full flex flex-row justify-between items-center"}>
            <span className={"w-full text-base font-bold h-fit"}>
              {t("share_progress")}
            </span>
            <div className="checkbox-wrapper-2">
              <input type="checkbox" checked className="sc-gJwTLC ikxBAC" />
            </div>
          </div>
        </div>
        <div
          className={
            "w-full border-b gap-4 border-studoborder px-10 py-8 flex flex-col"
          }
        >
          <div className={"w-full flex flex-row justify-between items-center"}>
            <span className={"w-full text-base font-bold h-fit"}>
              {t("classroom_invite")}
            </span>
            <div className="checkbox-wrapper-2">
              <input type="checkbox" className="sc-gJwTLC ikxBAC" />
            </div>
          </div>
        </div>
        <div
          className={
            "w-full border-b gap-4 border-studoborder px-10 py-8 flex flex-col"
          }
        >
          <div className={"w-full flex flex-row justify-between items-center"}>
            <div className={"w-full h-fit flex flex-col gap-3"}>
              <span className={"w-full text-base font-bold h-fit"}>
                {t("auto_participate")}
              </span>
            </div>
            <div className="checkbox-wrapper-2">
              <input type="checkbox" className="sc-gJwTLC ikxBAC" />
            </div>
          </div>
        </div>
        <div className={"w-full gap-4 px-10 py-8 flex flex-col"}>
          <div className={"w-full flex flex-row justify-between items-center"}>
            <div className={"w-full h-fit flex flex-col gap-3"}>
              <span className={"w-full text-base font-bold h-fit"}>
                {t("experimental")}
              </span>
            </div>
            <div className="checkbox-wrapper-2">
              <input type="checkbox" className="sc-gJwTLC ikxBAC" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
