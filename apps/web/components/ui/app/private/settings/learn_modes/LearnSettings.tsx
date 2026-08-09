"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";

export default function LearnSettings(props: SettingsSection) {
  const { isVisible } = props;
  const t = useTranslations("settings");
  const [streak, setStreak] = useState(true);
  const [pomodoro, setPomodoro] = useState(false);
  const [twentytwenty, setTwentytwenty] = useState(false);

  if (isVisible != "app") {
    return;
  }

  const togglePomodoro = () => {
    setPomodoro((prev) => {
      const newValue = !prev;
      if (newValue) setTwentytwenty(false);
      return newValue;
    });
  };

  const toggleTwenty = () => {
    setTwentytwenty((prev) => {
      const newValue = !prev;
      if (newValue) setPomodoro(false);
      return newValue;
    });
  };

  return (
    <section className={"flex flex-col gap-5 w-full min-h-fit"}>
      <span className={"w-full text-base font-bold h-fit"}>
        {t("learn_settings")}
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
              {t("limit_tracking")}
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
              {t("streak")}
            </span>
            <div className="checkbox-wrapper-2">
              <input
                type="checkbox"
                onClick={() => setStreak(!streak)}
                checked={streak}
                className="sc-gJwTLC ikxBAC"
              />
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
                {t("healthy_learn_title")}
              </span>
              <span className={"text-sm"}>{t("healthy_learn_exp")}</span>
            </div>
            <div className="checkbox-wrapper-2">
              <input
                type="checkbox"
                onClick={toggleTwenty}
                checked={twentytwenty}
                className="sc-gJwTLC ikxBAC"
              />
            </div>
          </div>
        </div>
        <div className={"w-full gap-4 px-10 py-8 flex flex-col"}>
          <div className={"w-full flex flex-row justify-between items-center"}>
            <div className={"w-full h-fit flex flex-col gap-3"}>
              <span className={"w-full text-base font-bold h-fit"}>
                {t("pomodoro")}
              </span>
              <span className={"text-sm"}>{t("pomodoro_exp")}</span>
            </div>
            <div className="checkbox-wrapper-2">
              <input
                type="checkbox"
                onClick={togglePomodoro}
                checked={pomodoro}
                className="sc-gJwTLC ikxBAC"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
