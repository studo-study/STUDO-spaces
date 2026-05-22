import { useQuery } from "@tanstack/react-query";
import type { AdminStatsResponse } from "@studo/types";

export function useAdminStats() {
  return useQuery<AdminStatsResponse>({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    staleTime: 60_000,
  });
}
