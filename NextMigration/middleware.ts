
import { auth } from './auth';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Supported locales
const locales = ['en', 'nl', 'fr']; // Pas aan naar jouw locales

export default auth((request) => {
    const { pathname } = request.nextUrl;

    // ========================================
    // SKIP DEZE PATHS
    // ========================================
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // ========================================
    // EXTRACT LOCALE EN PATH
    // ========================================
    const segments = pathname.split('/').filter(Boolean);
    const locale = locales.includes(segments[0]) ? segments[0] : 'en';
    const pathWithoutLocale = '/' + segments.slice(1).join('/');

    // ========================================
    // ROUTE DEFINITIONS
    // ========================================

    // Routes die GEEN login vereisen
    const publicRoutes = [
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
        "/modes/visualsets",
        "/"];

    // Check of huidige route public is
    const isPublicRoute = publicRoutes.some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    // Auth routes (login/register) - hier mag je NIET komen als je ingelogd bent
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    // ========================================
    // AUTH LOGIC
    // ========================================
    const isLoggedIn = !!request.auth;

    console.log({
        pathname,
        pathWithoutLocale,
        isLoggedIn,
        isPublicRoute,
        isAuthRoute,
    });

    // Ingelogd + op login/register pagina → redirect naar home
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
    }

    // Niet ingelogd + NIET public route → redirect naar login
    if (!isPublicRoute && !isLoggedIn) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ========================================
    // DOOR NAAR INTL MIDDLEWARE
    // ========================================
    return intlMiddleware(request);
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
