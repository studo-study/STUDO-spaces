import { useQuery } from "@tanstack/react-query";
import type { AdminUserDetail } from "@studo/types";

export function useAdminUserDetail(userId: string) {
  return useQuery<AdminUserDetail>({
    queryKey: ["admin_user_detail", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user detail");
      return res.json();
    },
  });
}
