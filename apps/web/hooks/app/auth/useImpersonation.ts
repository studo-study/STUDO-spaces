"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { startImpersonation } from "@/app/actions/impersonate";

/**
 * Impersonatie-controls voor de UI.
 *
 * - `start(userId)` — vraagt een backend-token (admin-only) en swapt de sessie
 *   naar die user. De admin-identiteit blijft server-side bewaard.
 * - `stop()` — keert terug naar de admin-sessie.
 * - `impersonating` — of de huidige sessie een user impersoneert.
 */
export function useImpersonation() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // na een identity-swap: session updaten, alle per-user caches wissen en de
  // server components herrenderen zodat alles voor de nieuwe user herlaadt.
  const swap = async (payload: Record<string, unknown>) => {
    await update(payload);
    queryClient.clear();
    router.refresh();
  };

  const start = async (userId: string) => {
    setIsPending(true);
    try {
      const token = await startImpersonation(userId);
      await swap({ impersonate: { token } });
    } finally {
      setIsPending(false);
    }
  };

  const stop = async () => {
    setIsPending(true);
    try {
      await swap({ stopImpersonate: true });
    } finally {
      setIsPending(false);
    }
  };

  return {
    impersonating: session?.impersonating ?? false,
    isPending,
    start,
    stop,
  };
}
