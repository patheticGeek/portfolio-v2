import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'zod'

const blogCollection = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string().transform((str) => new Date(str)),
    updatedDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().optional()
  })
})

export const collections = {
  blog: blogCollection
}
