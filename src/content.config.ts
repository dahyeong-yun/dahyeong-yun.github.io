import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { blogPostSchema, wikiPageSchema } from 'theme-astro'  // 스키마를 테마에서 가져옴

export const collections = {
  // 포스트: 나의 통찰·경험·생각이 담긴 글
  posts: defineCollection({
    loader: glob({ base: './content/posts', pattern: '**/*.{md,mdx}' }),
    schema: blogPostSchema,
  }),
  // 위키: 정리된 정보 위주의 문서
  wiki: defineCollection({
    loader: glob({ base: './content/wiki', pattern: '**/*.{md,mdx}' }),
    schema: wikiPageSchema,
  }),
}
