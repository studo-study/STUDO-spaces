import { useQuery } from "@tanstack/react-query";
import type { SettingsResponse } from "@studo/types";
import { settingsKeys } from "./settingsKeys";

export function useSettings() {
  return useQuery<SettingsResponse>({
    queryKey: settingsKeys.all,
    staleTime: 5 * 60 * 1000, // 5 min
    queryFn: () =>
      fetch("/api/settings").then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load settings"), {
            status: r.status,
          });
        return r.json();
      }),
  });
}

export const useTheme = () => useSettings().data?.theme;

//dev
export const useDevMode = () => useSettings().data?.devMode ?? false;
export const useDebugMode = () => useSettings().data?.debugMode ?? false;
export const useReprocessMode = () =>
  useSettings().data?.showReprocessing ?? false;
