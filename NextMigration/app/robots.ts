export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    "/welcome",
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
                    "/"
                ],
                disallow: ['/home', '/account', '/login', '/register', '/logout', '/auth/'],
            },
        ],
        sitemap: ['https://www.studo.study/sitemap.xml',],
    };
}