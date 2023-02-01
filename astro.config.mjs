import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    mdx(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
  ],
  site: "https://patheticgeek.dev/",
});
