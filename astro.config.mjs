import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    image(),
    mdx(),
    sitemap(),
    tailwind({ config: { applyBaseStyles: false } }),
  ],
  site: "https://patheticgeek.dev",
});
