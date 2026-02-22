import { MetadataRoute } from 'next'

const baseUrl = 'https://www.studo.study'; // kies één canonical domain
const locales = ['en', 'nl', 'fr'];

const publicPages = [
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
];

export default function sitemap(): MetadataRoute.Sitemap {
    return publicPages.flatMap(page =>
        locales.map(locale => ({
            url: `${baseUrl}/${locale}${page}`,
            lastModified: new Date(),
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}${page}`])
                ),
            },
        }))
    );
}