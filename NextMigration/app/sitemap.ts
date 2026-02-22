// app/sitemap.ts
export default function sitemap() {
    const baseUrl = 'https://studo.study';
    const locales = ['en', 'nl', 'fr'];
    const publicPages = [
        '',
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
        "/"];

    return locales.flatMap(locale =>
        publicPages.map(page => ({
            url: `${baseUrl}/${locale}${page}`,
            lastModified: new Date(),
        }))
    );
}