import { useQuery } from "@tanstack/react-query";
import type { ProfileResponse } from "@studo/types";

export function usePublicProfile(id: string) {
  return useQuery<ProfileResponse>({
    queryKey: ["profiles", "public", id],
    queryFn: () =>
      fetch(`/api/profiles/public/${id}`).then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load profile"), {
            status: r.status,
          });
        return r.json();
      }),
    enabled: !!id,
  });
}
