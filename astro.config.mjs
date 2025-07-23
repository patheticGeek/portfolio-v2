import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    includeFiles: [
      './src/assets/fira-code-latin-300-normal.woff',
      './src/assets/fira-code-latin-500-normal.woff',
      './src/assets/fira-code-latin-700-normal.woff'
    ],
    webAnalytics: { enabled: true }
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
  site: 'https://patheticgeek.dev/',
  redirects: {
    '/r': { destination: '/resume', status: 307 }
  }
})
