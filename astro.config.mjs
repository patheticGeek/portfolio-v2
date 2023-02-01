import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/edge";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    image(),
    mdx(),
    sitemap(),
    tailwind({ config: { applyBaseStyles: false } }),
  ],
  site: "https://patheticgeek.dev/",
});
