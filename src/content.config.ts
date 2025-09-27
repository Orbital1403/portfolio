import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

// POSTS (tvoj original)
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      modDate: z.coerce.date().optional(),
      categories: z.array(z.string()),
      draft: z.boolean().default(false).optional(),
      description: z.string().optional(),
      customData: z.string().optional(),
      banner: image()
        .refine(img => Math.max(img.width, img.height) <= 4096, {
          message: 'Width and height of the banner must less than 4096 pixels',
        })
        .optional(),
      author: z.string().optional(),
      commentsUrl: z.string().optional(),
      source: z.optional(z.object({ url: z.string(), title: z.string() })),
      enclosure: z.optional(
        z.object({ url: z.string(), length: z.number(), type: z.string() }),
      ),
      pin: z.boolean().default(false).optional(),
    }),
})

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
  }),
})

export const collections = { posts, spec, hobbies }
