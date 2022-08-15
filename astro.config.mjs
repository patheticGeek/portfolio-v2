import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  integrations: [image(), mdx(), sitemap(), tailwind()],
  site: "https://patheticgeek.dev",
  markdown: {
    remarkPlugins: [[rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
