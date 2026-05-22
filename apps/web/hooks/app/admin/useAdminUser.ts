import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserResponse } from "@studo/types";

export function useAdminUser(credential: string) {
  const queryClient = useQueryClient();

  return useQuery<UserResponse[]>({
    queryKey: ["admin_users", credential],
    enabled: !!credential,

    queryFn: async () => {
      const res = await fetch(`/api/admin/cred/${credential}`);

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    },

    placeholderData: () => {
      const list = queryClient.getQueryData<UserResponse[]>([
        "admin_users",
        credential,
      ]);

      return list ?? [];
    },
  });
}
