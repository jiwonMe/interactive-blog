import { cache } from 'react';
import { getAllPosts, type TOCItem } from './posts';

export type SearchHeading = {
  id: string;
  text: string;
  level: number;
};

export type SearchEntry = {
  slug: string;
  title: string;
  description?: string;
  headings: SearchHeading[];
};

export type SearchIndex = {
  generatedAt: string;
  entries: SearchEntry[];
};

function normalizeHeadings(toc: TOCItem[]): SearchHeading[] {
  return toc.map((h) => ({
    id: h.id,
    text: h.text,
    level: h.level,
  }));
}

function normalizeTitle(slug: string, title?: string) {
  return title?.trim() || slug.replace(/-/g, ' ');
}

export const getSearchIndex = cache((): SearchIndex => {
  const posts = getAllPosts(/* includeHidden */ false);

  return {
    generatedAt: new Date().toISOString(),
    entries: posts.map((p) => ({
      slug: p.slug,
      title: normalizeTitle(p.slug, p.title),
      description: p.description,
      headings: normalizeHeadings(p.toc),
    })),
  };
});

