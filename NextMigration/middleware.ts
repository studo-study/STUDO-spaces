
import { auth } from './auth';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Supported locales
const locales = ['en', 'nl', 'fr']; // Pas aan naar jouw locales

export default auth((request) => {
    console.log('MIDDLEWARE HIT:', request.nextUrl.pathname);
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
        "/"];

    // Check of huidige route public is
    const isPublicRoute = publicRoutes.some(route => {
            if (route === '/') {
                return pathWithoutLocale === '/' || pathWithoutLocale === '';
            }
            return pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/');
        })
        || pathWithoutLocale.startsWith('/studoset/')
        || pathWithoutLocale.startsWith('/visualset/')
        || pathWithoutLocale.startsWith('/profile/')
        || pathWithoutLocale.startsWith('/track/');
    if (pathWithoutLocale.includes('classroom')) {
        console.log('CLASSROOM DEBUG:', {
            pathWithoutLocale,
            exactMatch: pathWithoutLocale === '/classroom',
            startsWithSlash: pathWithoutLocale.startsWith('/classroom/'),
            segments,
            locale
        });
    }
    console.log({
        pathname,
        pathWithoutLocale,
        isPublicRoute,
    });
    // Auth routes (login/register) - hier mag je NIET komen als je ingelogd bent
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );


    const isLoggedIn = !!request.auth;


    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
    }

    if (!isPublicRoute && !isLoggedIn) {
        //const loginUrl = new URL(`/${locale}/login`, request.url);
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }
    console.log('PATH:', pathname, 'WITHOUT LOCALE:', pathWithoutLocale, 'PUBLIC:', isPublicRoute, 'LOGGED IN:', isLoggedIn);
    return intlMiddleware(request);

});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
