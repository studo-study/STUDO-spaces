import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";
import path from "path";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: [
    "@studo/ui",
    "@studo/utils",
    "@studo/i18n",
    "@studo/types",
  ],
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "studo.study" },
      { protocol: "https", hostname: "*" },
    ],
  },
};

export default withNextIntl(nextConfig);
