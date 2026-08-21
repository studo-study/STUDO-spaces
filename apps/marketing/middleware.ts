import createMiddleware from "next-intl/middleware";
import { routing } from "@studo/i18n/routing";

// Marketing is volledig publiek → enkel locale-routing, geen auth.
export default createMiddleware(routing);

export const config = {
  // `og` = dynamic OG image route; must bypass locale routing.
  // Paths with a dot (llms.txt, sitemap.xml, robots.txt) already bypass.
  matcher: ["/((?!api|og|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
