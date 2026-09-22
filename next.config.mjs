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
};

export default withMDX(nextConfig);
