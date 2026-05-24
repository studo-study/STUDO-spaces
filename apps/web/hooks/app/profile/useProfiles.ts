import { useQuery } from "@tanstack/react-query";
import type { ProfileResponse } from "@studo/types";

export function useProfile(id: string) {
  return useQuery<ProfileResponse>({
    queryKey: ["profiles", id],
    queryFn: () => fetch(`/api/profiles/${id}`).then((r) => r.json()),
  });
}
