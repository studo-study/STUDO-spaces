import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";
import { SwitchToggle } from "@/components/ui/design_system/toggle/Toggle";
import {
  DEFAULT_LEARN_SETTINGS,
  useLearnStore,
} from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";
import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { Tabs } from "@/components/ui/design_system/tabs/Tabs";
import SimpleSlider from "@/components/ui/design_system/slider/SimpleSlider";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useResetSession } from "@/hooks/app/session/useResetSession";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { ReactNode } from "react";

type Tab = {
  label: string;
  key: string;
};

type LearnSettingsType = {
  label: string;
  subItems: {
    icon?: ReactNode;
    label: string;
    toggle: string;
    defaultToggle?: boolean;
    description?: string;
    changeSection?: string;
    value?: string | number;
    options?: Tab[];
    onchange: (input: never) => void;
  }[];
};
const LearnSettings = () => {
  const t = useTranslations("learnsettings");
  const learnSettings = useLearnStore((state) => state.learnSettings);
  const toast = useToast();
  const handleReset = () => {
    learnSettings.setAnswerType("typing");
    learnSettings.setAnswerWith("term");
    learnSettings.setPomodoro(false);
    learnSettings.setTwentyMode(false);
    learnSettings.setTwentyCount("");
    learnSettings.setTwentyMode(false);
    learnSettings.setRevisionCount(2);
    learnSettings.setStrictnessLevel(2);
    learnSettings.setFlaggedMode(false);
  };

  const isDifferent = learnSettings != DEFAULT_LEARN_SETTINGS;
  const LearnSettingsSections: LearnSettingsType[] = [
    {
      label: "learning",
      subItems: [
        {
          label: "answer_with",
          toggle: "tabs",
          description: "term_def_description",
          value: learnSettings.answerWith,
          changeSection: "twentyMode",
          options: [
            { key: "term", label: "term" },
            { key: "definition", label: "definition" },
          ],
          onchange: useLearnStore((state) => state.learnSettings.setAnswerWith),
        },
        {
          label: "answer_type",
          toggle: "tabs",
          description: "type_description",
          value: learnSettings.answerType,
          changeSection: "pomodoro",
          options: [
            { key: "both", label: "All" },
            { key: "multiplechoice", label: "Multiple Choice" },
            { key: "typing", label: "Typing" },
          ],
          onchange: useLearnStore((state) => state.learnSettings.setAnswerType),
        },
        {
          label: "revision_count",
          toggle: "slider",
          description: "revision_count_description",
          value: learnSettings.revisionCount,
          changeSection: "pomodoro",
          onchange: useLearnStore(
            (state) => state.learnSettings.setRevisionCount,
          ),
        },
        {
          label: "flagged_mode",
          toggle: "toggle",
          description: "flagged_description",
          defaultToggle: learnSettings.flaggedMode,
          changeSection: "flagged",
          onchange: useLearnStore(
            (state) => state.learnSettings.setFlaggedMode,
          ),
        },
      ],
    },
    {
      label: "health",
      subItems: [
        {
          label: "twenty_twenty_two",
          toggle: "toggle",
          description: "twenty_description",
          defaultToggle: learnSettings.twentyMode,
          changeSection: "twentyMode",
          onchange: useLearnStore((state) => state.learnSettings.setTwentyMode),
        },
        {
          label: "pomodoro_timer",
          toggle: "toggle",
          description: "pomodoro_description",
          defaultToggle: learnSettings.pomodoro,
          changeSection: "pomodoro",
          onchange: useLearnStore((state) => state.learnSettings.setPomodoro),
        },
      ],
    },
  ];

  const id = useLearnStore((state) => state.setId);
  const sessionId = useStudoset(id ?? "")?.data?.session?.id;
  const { mutate: resetSession, isPending: isResetting } = useResetSession(
    sessionId ?? "",
    id ?? "",
  );

  const toggleResetProgress = () => {
    if (!sessionId) return;
    resetSession(undefined, {
      onSuccess: () => toast.success(t("reset_success")),
      onError: () => toast.error(t("submit_error")),
    });
  };

  return (
    <div className={"min-h-0 w-full flex flex-col flex-1 gap-2"}>
      <ContextMenuHeader t={"settings"} />
      <div className={"flex-1 min-h-0 px-8"}>
        {LearnSettingsSections.map((section, index) => {
          return (
            <div key={section.label + index} className={"flex flex-col mb-10"}>
              <span
                className={"w-full font-bold font-georgia dark:text-white mb-1"}
              >
                {t(section.label)}:
              </span>
              <hr className={"border-studoborder/30 h-px w-full mb-3"} />
              {section.subItems.map((subItem) => {
                return (
                  <div
                    key={subItem.label}
                    className={
                      "w-full flex flex-row mb-2 items-center justify-between"
                    }
                  >
                    <div className={"flex flex-col"}>
                      <span
                        className={
                          " gap-2 flex flex-row items-center text-base dark:text-white"
                        }
                      >
                        {subItem.icon}
                        {t(subItem.label)}
                      </span>
                      {subItem.description && (
                        <p
                          className={
                            "text-studogrey/30 text-xs dark:text-white/30"
                          }
                        >
                          {t(subItem.description)}
                        </p>
                      )}
                    </div>
                    {subItem.toggle === "toggle" && (
                      <SwitchToggle
                        isChecked={subItem.defaultToggle as boolean}
                        onChange={(input) =>
                          (subItem.onchange as (v: boolean) => void)(input)
                        }
                      />
                    )}
                    {subItem.toggle === "slider" && (
                      <SimpleSlider
                        min={1}
                        max={5}
                        value={[subItem.value as number]}
                        onValueChange={(value) =>
                          (subItem.onchange as (v: number) => void)(value[0])
                        }
                      />
                    )}
                    {subItem.toggle === "tabs" && (
                      <Tabs
                        size={"sm"}
                        tabs={subItem.options as Tab[]}
                        value={subItem.value as string}
                        onChange={(value) =>
                          (subItem.onchange as (v: string) => void)(value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className={"flex p-8 flex-1 min-h-0 flex-col items-end justify-end"}>
        <div className={"flex flex-row"}>
          <BaseButton
            disabled={isResetting}
            variant={"danger"}
            label={t("reset_progress")}
            onClick={toggleResetProgress}
          />
          <BaseButton
            disabled={!isDifferent}
            variant={"ghost"}
            label={t("reset_settings")}
            onClick={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

LearnSettings.displayName = "LearnSettings";
export default LearnSettings;
