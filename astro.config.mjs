import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    image(),
    mdx(),
    tailwind({ config: { applyBaseStyles: false } }),
  ],
  site: "https://patheticgeek.dev/",
});
