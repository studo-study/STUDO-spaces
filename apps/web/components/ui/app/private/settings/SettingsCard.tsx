"use client";

import { ReactNode } from "react";
import CheckBox from "@/components/ui/design_system/input/CheckBox";
import Select from "@/components/ui/design_system/select/Select";
import BaseButton, {
  BaseButtonVariant,
} from "@/components/ui/design_system/button/BaseButton";

interface ICheckboxItem {
  label: string;
  description?: string;
  type: "checkbox";
  value: boolean;
  onChange: (input: boolean) => void;
}

interface ISelectItem {
  label: string;
  description?: string;
  type: "select";
  value: string;
  onChange: (input: string) => void;
  options: { value: string; label: string; icon?: ReactNode }[];
}

interface IButtonItem {
  label: string;
  description?: string;
  type: "button";
  onClick: () => void;
  btnLabel: string;
  btnVariant?: BaseButtonVariant;
}

export type SettingsMenuOption = ICheckboxItem | ISelectItem | IButtonItem;

type SettingsCardProps = {
  title: string;
  items: SettingsMenuOption[];
};

/**
 * Config-driven settings card. Each section just declares its rows as data; the
 * layout (section title, bordered card, divided rows, control per row type) lives
 * here so every settings section looks and behaves identically.
 */
export function SettingsCard({ title, items }: SettingsCardProps) {
  return (
    <section className={"flex flex-col gap-5 w-full min-h-fit"}>
      <span className={"w-full text-base font-bold h-fit"}>{title}</span>

      <div
        className={
          "w-full min-h-40 h-fit rounded-3xl border border-studoborder/30 divide-y divide-studoborder/30"
        }
      >
        {items.map((option, index) => (
          <div
            key={option.label + index}
            className={"flex flex-row p-5 justify-between items-center gap-10"}
          >
            <div className={"flex flex-col gap-1 min-w-0 flex-1"}>
              <span className={"w-full text-base font-bold h-fit"}>
                {option.label}
              </span>
              {option.description && (
                <p className={"text-sm text-studogrey/75 w-full"}>
                  {option.description}
                </p>
              )}
            </div>

            {option.type === "checkbox" && (
              <CheckBox checked={option.value} onChange={option.onChange} />
            )}

            {option.type === "select" && (
              <Select
                size={"sm"}
                align={"end"}
                value={option.value}
                onChange={(v) => option.onChange(String(v))}
                options={option.options}
              />
            )}

            {option.type === "button" && (
              <BaseButton
                onClick={option.onClick}
                variant={option.btnVariant ?? ("outline" as BaseButtonVariant)}
                label={option.btnLabel}
                className={"max-h-10"}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
