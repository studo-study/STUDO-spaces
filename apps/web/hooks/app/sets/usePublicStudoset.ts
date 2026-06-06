import { useQuery } from "@tanstack/react-query";
import type { PublicStudysetResponse } from "@studo/types";

export function usePublicStudoset(id: string) {
  return useQuery<PublicStudysetResponse>({
    queryKey: ["studosets", "public", id],
    queryFn: () => fetch(`/api/studosets/public/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}
