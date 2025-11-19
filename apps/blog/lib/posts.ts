import fs from 'fs';
import path from 'path';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export type TOCItem = {
  id: string;
  text: string;
  level: number;
};

export type PostData = {
  slug: string;
  content: string;
  toc: TOCItem[];
  date?: string;
  title?: string;
};

export function getPostSlugs() {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  return fs.readdirSync(contentDirectory).filter((file) => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): PostData | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const toc = extractTOC(content);
  
  return { 
    slug: realSlug, 
    content, // frontmatter가 제거된 순수 콘텐츠
    toc,
    date: data.date,
    title: data.title,
  };
}

export function getAllPosts(): (PostData | null)[] {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug)).filter((post): post is PostData => post !== null);
  
  // 날짜순 정렬 (최신순)
  return posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function extractTOC(content: string): TOCItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    toc.push({ id, text, level });
  }

  return toc;
}
