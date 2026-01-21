import { getPostBySlug, getAllPosts, type PostData } from "./posts";

export type SlideData = {
  index: number;
  content: string;
  notes?: string;
};

export type SlideDeckData = {
  slug: string;
  title: string;
  author?: string;
  date?: string;
  slides: SlideData[];
  totalSlides: number;
};

const NOTES_REGEX = /<Notes>([\s\S]*?)<\/Notes>/g;
const SLIDE_SEPARATOR = /\n---\n/;

function extractNotes(slideContent: string): {
  content: string;
  notes?: string;
} {
  let notes: string | undefined;

  const content = slideContent.replace(NOTES_REGEX, (_, notesContent) => {
    notes = notesContent.trim();
    return "";
  });

  return { content: content.trim(), notes };
}

export function parseSlides(content: string): SlideData[] {
  const rawSlides = content.split(SLIDE_SEPARATOR);

  const slides: SlideData[] = [];

  rawSlides.forEach((rawContent) => {
    const { content: slideContent, notes } = extractNotes(rawContent);

    if (slideContent.trim()) {
      slides.push({
        index: slides.length,
        content: slideContent,
        notes,
      });
    }
  });

  return slides;
}

export function getSlideDeck(slug: string): SlideDeckData | null {
  const post = getPostBySlug(slug);

  if (!post || !post.slides) {
    return null;
  }

  const slides = parseSlides(post.content);

  return {
    slug: post.slug,
    title: post.title || post.slug,
    author: post.author,
    date: post.date,
    slides,
    totalSlides: slides.length,
  };
}

export function getAllSlideSlugs(): string[] {
  const posts = getAllPosts(true);
  return posts
    .filter((post): post is PostData => post !== null && post.slides === true)
    .map((post) => post.slug);
}

export function getSlideEnabledPosts(): PostData[] {
  const posts = getAllPosts(true);
  return posts.filter(
    (post): post is PostData => post !== null && post.slides === true,
  );
}
