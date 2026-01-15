import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const publicPaths = [
    "/welcome",
    "/login",
    "/register",
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
    "/modes/visualsets"];

const guestOnlyPaths = ["/login", "/register"];

// Bouw regex dynamisch op basis van routing config
const localesPattern = routing.locales.join("|"); // "en|nl|fr|de|..."
const localeRegex = new RegExp(`^/(${localesPattern})`);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;
    console.log("Middleware hit:", pathname);

    // Extract locale uit path
    const localeMatch = pathname.match(localeRegex);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

    // Strip locale van path
    const pathWithoutLocale = pathname.replace(localeRegex, "") || "/";

    // Helper functie voor redirects MET locale
    const redirectTo = (path: string) => {
        return NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
    };

    // 1. Root van locale → redirect based on auth
    if (pathWithoutLocale === "/") {
        return redirectTo(token ? "/home" : "/welcome");
    }

    // 2. Guest-only routes → redirect naar home als al ingelogd
    if (guestOnlyPaths.includes(pathWithoutLocale) && token) {
        return redirectTo("/home");
    }

    // 3. Protected routes → redirect naar login als niet ingelogd
    const isPublicPath = publicPaths.some(path =>
        pathWithoutLocale === path || pathWithoutLocale.startsWith(path + "/")
    );

    if (!isPublicPath && !token) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Laat next-intl de rest afhandelen
    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};