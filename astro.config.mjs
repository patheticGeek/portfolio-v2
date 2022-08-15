import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [image(), mdx(), sitemap(), tailwind()],
  site: "https://patheticgeek.dev",
  output: "server",
  adapter: vercel(),
  markdown: {
    remarkPlugins: [[rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
