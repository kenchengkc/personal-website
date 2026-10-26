import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  // Deliver styles with the first document so a fresh tab needs no CSS round trip.
  experimental: { inlineCss: true },
  webpack(config, { dev, config: resolvedConfig }) {
    if (!dev && config.cache && typeof config.cache === "object") {
      // Font CSS embeds the deployment ID. Include it in webpack's cache key so
      // restored CSS and the new document's font preloads use identical URLs.
      const deploymentId = resolvedConfig.deploymentId ?? "";
      config.cache.version = `${config.cache.version ?? ""}|deployment:${deploymentId}`;
    }
    return config;
  },
  async headers() {
    // Only versioned directories are immutable; change their version when the
    // generated artwork changes. Mutable public assets keep normal revalidation.
    return ["/images/brain/v2/:path*", "/images/icons/v1/:path*"].map(source => ({
      source,
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }));
  },
};

export default withMDX(nextConfig);
