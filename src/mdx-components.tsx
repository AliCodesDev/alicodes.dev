import type { MDXComponents } from "mdx/types";

// Required by @next/mdx with the App Router. Global element overrides for
// every MDX file live here; per-page components are passed at render time.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
