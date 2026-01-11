import { getCollection } from 'astro:content';

export async function GET() {
  const quotes = await getCollection('quotes');
  
  const body = JSON.stringify(
    quotes.map((quote) => ({
      id: quote.slug,
      title: quote.data.title,
      author: quote.data.author,
      source: quote.data.source,
      path: `/${quote.slug}`
    }))
  );

  return new Response(body);
}
