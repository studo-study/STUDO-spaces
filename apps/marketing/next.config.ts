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
      { protocol: "https", hostname: "**.studo.study" },
      // TODO: add the studoset image CDN host here when the public
      // set-detail pages ship (see Linear programmatic-SEO ticket).
    ],
  },
};

export default withNextIntl(nextConfig);
