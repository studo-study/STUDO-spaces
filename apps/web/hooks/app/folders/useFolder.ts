import { useQuery } from "@tanstack/react-query";
import type { FullFolderResponse } from "@studo/types";

export function useFolder(id: string, enabled = true) {
  return useQuery<FullFolderResponse>({
    queryKey: ["folders", id],
    queryFn: () => fetch(`/api/folders/me/${id}`).then((r) => r.json()),
    enabled,
  });
}
