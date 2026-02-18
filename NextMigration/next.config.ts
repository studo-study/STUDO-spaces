import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "studo.study",
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
            },
        ],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));