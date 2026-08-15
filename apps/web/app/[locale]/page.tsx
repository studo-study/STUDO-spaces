// app/[locale]/layout.tsx

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { auth } from "./../../auth";

export default async function LocalePage() {
  const [locale, session] = await Promise.all([getLocale(), auth()]);

  if (session) {
    redirect(`/${locale}/home`);
  } else {
    // Marketing/landing leeft nu op studo.study; de app start op login.
    redirect(`/${locale}/login`);
  }
}
