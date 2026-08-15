import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
