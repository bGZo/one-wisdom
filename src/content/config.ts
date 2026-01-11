import { defineCollection, z } from 'astro:content';

const quotesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    source: z.string().optional(),
    note: z.string().optional(),
    chapter: z.string().optional(),
    layout: z.string().optional(), // from Jekyll, optional now
    // author: z.string().nullish(),
    // source: z.string().nullish(),
    // note: z.string().nullish(),
    // chapter: z.string().nullish(),
    // layout: z.string().nullish(), // from Jekyll, optional now
  }),
});

export const collections = {
  'quotes': quotesCollection,
};
