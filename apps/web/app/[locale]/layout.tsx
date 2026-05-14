// app/[locale]/layout.tsx

import type { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ConsoleEasterEgg from "@/components/ui/overige/easteregg/console";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
    title: "Studo",
    description: "Learn smarter",
};

export default async function LocaleLayout({
                                               children,
                                           }: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <SessionProvider>
                {children}
            </SessionProvider>
            <ConsoleEasterEgg />
        </NextIntlClientProvider>
    );
}