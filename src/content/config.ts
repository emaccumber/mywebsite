import { defineCollection, z } from 'astro:content';

const photographs = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    coverImage: z.string().default('cover.jpg'),
    descriptions: z.record(z.string()).optional(),
    content: z.string().optional(),
  }),
});

export const collections = {
  photographs,
};