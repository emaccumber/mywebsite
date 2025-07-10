import { defineCollection, z } from 'astro:content';

const photographs = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    coverImage: z.string().default('cover.jpg'),
  }),
});

export const collections = {
  photographs,
};