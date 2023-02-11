import { defineCollection } from 'astro:content'
import { z } from 'zod'

const blogCollection = defineCollection({
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
