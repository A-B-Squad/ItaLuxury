import type { DocumentNode } from 'graphql';
import { print } from 'graphql';

export async function fetchGraphQLData(
  query: string | DocumentNode,
  variables: { [key: string]: any } = {},
  options: {
    revalidate?: number;
    cache?: 'force-cache' | 'no-store';
    tags?: string[];
  } = {}
) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const { revalidate, cache, tags } = options;

  const queryString = typeof query === 'string' ? query : print(query);
  const init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: queryString, variables }),
  };

  if (cache) {
    init.cache = cache;
  } else if (typeof revalidate === 'number') {
    init.next = { ...(init.next || {}), revalidate };
  }

  if (tags && tags.length > 0) {
    init.next = { ...(init.next || {}), tags };
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, init);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    console.error('GraphQL Errors:', errors);
    throw new Error('GraphQL query failed');
  }

  return data;
}