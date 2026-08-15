import createMiddleware from "next-intl/middleware";
import { routing } from "@studo/i18n/routing";

// Marketing is volledig publiek → enkel locale-routing, geen auth.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
