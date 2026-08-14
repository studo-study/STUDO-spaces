import { auth } from "./auth";
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Supported locales
const locales = ["en", "nl", "fr", "es"]; // Pas aan naar jouw locales

const publicRoutes = [
  "/welcome",
  "/callback",
  "/logout",
  "/about-us",
  "/modes/ai",
  "/tools/flashcards",
  "/tools/identify",
  "/tools/learn",
  "/tools/point",
  "/tools/speedy",
  "/privacy",
  "/modes/studosets",
  "/terms-of-service",
  "/modes/visualsets",
  "/overview",
  "/studo-select",
  "/GDPR",
  "/login",
  "/register",
  "/select",
  "/studo-for-education",
  "/auth/callback",
  "/classes",
  "/communities",
  "/studygroups",
  "/challenges/duel",
  "/waitinglist",
  "/challenges/mastery-tournament",
  "/studo-education",
  "/challenges/time-attack",
  "/search-result",
  "/search-result/all",
  "/search-result/users",
  "/search-result/sets",
  "/search-result/classrooms",
  "/profile",
  "/track",
  "/classroom",
  "/pricing",
  "/faq",
  "/help-center",
  "/contact",
  "/newsroom",
  "/studo",
  "/",
];

const authRoutes = ["/login", "/register"];

// Leidt locale + locale-loos pad af uit het volledige pathname.
function getRouteInfo(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = locales.includes(segments[0]) ? segments[0] : "en";
  const pathWithoutLocale = "/" + segments.slice(1).join("/");

  const isPublicRoute =
    publicRoutes.some((route) => {
      if (route === "/") {
        return pathWithoutLocale === "/" || pathWithoutLocale === "";
      }
      return (
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")
      );
    }) ||
    pathWithoutLocale.startsWith("/studoset/") ||
    pathWithoutLocale.startsWith("/visualset/") ||
    pathWithoutLocale.startsWith("/profile/") ||
    pathWithoutLocale.startsWith("/track/");

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/"),
  );

  return { locale, pathWithoutLocale, isPublicRoute, isAuthRoute };
}

// Draait intl + zet de path-headers. Gedeeld tussen de public fast-path en de
// auth-flow zodat beide dezelfde response-shape teruggeven.
function withIntl(
  request: NextRequest,
  locale: string,
  pathWithoutLocale: string,
) {
  const response = intlMiddleware(request);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  response.headers.set("x-pathname-clean", pathWithoutLocale);
  response.headers.set("x-locale", locale);
  return response;
}

// ── Auth-flow ────────────────────────────────────────────────────────────
// Enkel voor protected/auth/admin routes: hier decrypten we de JWT-session.
// Public routes raken dit nooit → geen crypto-CPU voor anonieme/bot-traffic.
const authMiddleware = auth((request) => {
  const { pathname } = request.nextUrl;
  const { locale, pathWithoutLocale, isAuthRoute } = getRouteInfo(pathname);

  // TOKEN VERLOPEN → uitloggen
  if (
    (request.auth as { error?: string } | null)?.error === "AccessTokenExpired"
  ) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");
    return response;
  }

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");

  if (isAdminRoute) {
    const isModerator =
      request.auth?.user?.publicRole === "admin" ||
      request.auth?.user?.publicRole === "owner";

    if (!isModerator) {
      return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
    }
  }

  const isLoggedIn = !!request.auth;

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  if (!isAuthRoute && !isLoggedIn) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return withIntl(request, locale, pathWithoutLocale);
});

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { locale, pathWithoutLocale, isPublicRoute, isAuthRoute } =
    getRouteInfo(pathname);

  // Public route (en geen login/register): geen session nodig → sla de
  // JWT-decrypt over, draai enkel intl. Dit is de CPU-besparing.
  if (isPublicRoute && !isAuthRoute) {
    return withIntl(request, locale, pathWithoutLocale);
  }

  // Protected / login / register / admin: volledige auth-flow.
  // next-auth typedt de handler voor route-handlers; in middleware-context
  // geven we (request, event) door — cast omdat de types niet overlappen.
  return (
    authMiddleware as unknown as (
      req: NextRequest,
      ev: NextFetchEvent,
    ) => ReturnType<typeof authMiddleware>
  )(request, event);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
