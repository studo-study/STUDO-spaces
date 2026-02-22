// app/robots.ts
export default function robots() {
    return {
        rules: { userAgent: '*', allow: '/' },
        sitemap: 'https://studo.study/sitemap.xml',
    };
}