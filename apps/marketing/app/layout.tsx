import type { Metadata } from "next";
import "./globals.css";
import IcoSwitcher from "@/components/ui/overige/effects/IcoSwitcher";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studo",
  description: "Learn smarter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fmn3jvz.css" />
        <IcoSwitcher />
      </head>
      <body className="h-screen">
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
