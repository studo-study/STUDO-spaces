import { useQuery } from "@tanstack/react-query";
import type { MyBoardsResponse } from "@studo/types";

export function useBoards() {
  return useQuery<MyBoardsResponse>({
    queryKey: ["boards"],
    queryFn: () => fetch("/api/flows/me").then((r) => r.json()),
  });
}
