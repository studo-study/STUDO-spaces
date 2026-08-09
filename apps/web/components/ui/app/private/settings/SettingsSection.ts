import { SettingsResponse, UpdateSettings } from "@studo/types";
import { UseMutateFunction } from "@tanstack/react-query";

export interface SettingsSection {
  isVisible: string;
  settings: SettingsResponse | undefined;
  mutate: UseMutateFunction<
    SettingsResponse,
    Error,
    UpdateSettings,
    {
      prev: SettingsResponse | undefined;
    }
  >;
  isSuccess: boolean;
}
