"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export function useChangeLocale(lang: string) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (locale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error params types kloppen niet bij dynamic segments
        { pathname, params },
        { locale },
      );
    });
  };

  return { changeLocale, isPending };
}
