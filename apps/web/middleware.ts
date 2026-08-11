import { auth } from "./auth";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Supported locales
const locales = ["en", "nl", "fr", "es"]; // Pas aan naar jouw locales

export default auth((request) => {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  const segments = pathname.split("/").filter(Boolean);
  const locale = locales.includes(segments[0]) ? segments[0] : "en";
  const pathWithoutLocale = "/" + segments.slice(1).join("/");

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

  // Check of huidige route public is
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
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/"),
  );

  // ========================================
  // TOKEN VERLOPEN → uitloggen
  // ========================================
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

  if (!isPublicRoute && !isLoggedIn) {
    //const loginUrl = new URL(`/${locale}/login`, request.url);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  const response = intlMiddleware(request);
  response.headers.set("x-pathname", pathname);
  response.headers.set("x-pathname-clean", pathWithoutLocale);
  response.headers.set("x-locale", locale);
  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
