import { useQuery } from "@tanstack/react-query";
import type { FolderListResponse } from "@studo/types";

export function useFolders() {
  return useQuery<FolderListResponse>({
    queryKey: ["folders"],
    queryFn: () => fetch("/api/folders/me").then((r) => r.json()),
  });
}
