// app/[locale]/layout.tsx

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { auth } from "./../../auth";

export default async function LocalePage() {
  const [locale, session] = await Promise.all([getLocale(), auth()]);

  if (session) {
    redirect(`/${locale}/home`);
  } else {
    redirect(`/${locale}/welcome`); // Of waar je marketing pagina staat
  }
}
