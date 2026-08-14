import { useQuery } from "@tanstack/react-query";
import { AllUserChatsResponse } from "@studo/types";
import { useUser } from "@/components/providers/auth/UserProvider";

export function useChats() {
  const id = useUser().user?.id;
  return useQuery<AllUserChatsResponse>({
    queryKey: ["chats", id],
    queryFn: () =>
      fetch(`/api/chats`).then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load"), {
            status: r.status,
          });
        return r.json();
      }),
  });
}
