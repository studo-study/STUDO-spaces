import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = createBundleAnalyzer({
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
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "wallpaperaccess.com",
            }

        ],
    },
    compiler: {
        //removeConsole: process.env.NODE_ENV === "production",
    },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));