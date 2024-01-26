import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    includeFiles: [
      './src/assets/fira-code-latin-300-normal.woff',
      './src/assets/fira-code-latin-500-normal.woff',
      './src/assets/fira-code-latin-700-normal.woff'
    ]
  }),
  build: {
    inlineStylesheets: 'always'
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed'
    }
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    react(),
    mdx()
  ],
  site: 'https://patheticgeek.dev/'
})
