import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

// SPEC (tvoj original)
const spec = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/spec' }),
})

// HOBBIES (novo)
const hobbies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/hobbies' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    cover: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    steps: z
      .array(
        z.object({
          title: z.string(),
          images: z.array(z.string()),
          caption: z.string().optional(),
        }),
      )
      .optional(),
    lesson: z.string().optional(),
    before_image: z.string().optional(),
    goal: z.string().optional(),
    tools: z.string().optional(),
    finish: z.string().optional(),
    fun_fact: z.string().optional(),
  }),
})

export const collections = { spec, hobbies }
