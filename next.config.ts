import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    // Two root layouts — (archive) and (plain) — means there is no single
    // layout a global 404 can compose from, which is the documented reason
    // this flag exists. See src/app/global-not-found.tsx.
    globalNotFound: true,
  },
};

// Plugin names are strings, not imported functions: Turbopack cannot pass
// JavaScript functions to its Rust core. See next docs, guides/mdx.
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
