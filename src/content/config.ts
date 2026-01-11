import { defineCollection, z } from 'astro:content';

const quotesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string().nullish(),
    source: z.string().nullish(),
    note: z.string().nullish(),
    chapter: z.string().nullish(),
    layout: z.string().nullish(), // from Jekyll, optional now
  }),
});

export const collections = {
  'quotes': quotesCollection,
};
