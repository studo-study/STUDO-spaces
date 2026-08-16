import type { Metadata } from "next";
import "./globals.css";
import IcoSwitcher from "@/components/ui/overige/effects/IcoSwitcher";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { Montserrat } from "next/font/google";
import { getLocale } from "next-intl/server";
import { SEO_BASE_URL } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_BASE_URL),
  title: { default: "Studo", template: "%s | Studo" },
  description: "Learn smarter",
  icons: {
    icon: [
      {
        url: "/favicons/favicon-light.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicons/favicon-dark.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={montserrat.variable}
      suppressHydrationWarning
    >
      <head>
        <IcoSwitcher />
      </head>
      <body className="h-screen">
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
