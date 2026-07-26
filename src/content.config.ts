import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { blogPostSchema } from 'theme-astro'  // 스키마를 테마에서 가져옴

export const collections = {
  posts: defineCollection({
    loader: glob({ base: './content/posts', pattern: '**/*.{md,mdx}' }),
    schema: blogPostSchema,
  }),
}
