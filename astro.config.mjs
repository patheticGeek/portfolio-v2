import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    mdx(),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    react()
  ],
  markdown: {
    rehypePlugins: [rehypeHeadingIds],
    shikiConfig: {
      theme: 'github-dark'
    }
  },
  site: 'https://patheticgeek.dev/'
})
