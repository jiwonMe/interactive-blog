import fs from 'fs';
import path from 'path';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';

// const contentDirectory = path.join(process.cwd(), 'content');
const contentDirectory = path.join(process.cwd(), 'apps/blog/articles');

// Check if we are in the monorepo root or in the app directory
if (!fs.existsSync(contentDirectory)) {
  // Fallback for when running from apps/blog directly (e.g. during build sometimes or dev)
  // But process.cwd() usually points to project root in TurboRepo unless configured otherwise?
  // Let's assume the user context provided shows we are in the root.
  // User workspace path: /Users/jiwon/Workspace/jiwonme/interactive-blog
  // If process.cwd() is root, then 'apps/blog/articles' is correct.
  // If process.cwd() is 'apps/blog', then 'articles' is correct.
}

// Let's try to dynamically resolve it to be safe, or stick to one if we are sure.
// Given the previous code was `path.join(process.cwd(), 'content')` and it worked,
// and the file structure showed `apps/blog/content`.
// If cwd was root, `path.join(root, 'content')` would be `/content` which doesn't exist.
// So cwd must be `apps/blog`.
// Thus, we should use 'articles' if cwd is `apps/blog`.

const articlesDirectory = path.join(process.cwd(), 'articles').includes('apps/blog') 
  ? path.join(process.cwd(), 'articles') 
  : path.join(process.cwd(), 'apps/blog/articles'); 

// Better approach: Check if 'articles' exists in cwd, if not try 'apps/blog/articles'
const getArticlesDir = () => {
  const local = path.join(process.cwd(), 'articles');
  if (fs.existsSync(local)) return local;
  return path.join(process.cwd(), 'apps/blog/articles');
};

const targetDirectory = getArticlesDir();

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
  series?: string;
  seriesOrder?: number;
  tags?: string[];
};

export function getPostSlugs() {
  if (!fs.existsSync(targetDirectory)) {
    return [];
  }
  return fs.readdirSync(targetDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => dirent.name);
}

export function getPostBySlug(slug: string): PostData | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(targetDirectory, realSlug, 'content.mdx');
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const toc = extractTOC(content);
  
  return { 
    slug: realSlug, 
    content, 
    toc,
    date: data.date,
    title: data.title,
    series: data.series,
    seriesOrder: data.seriesOrder,
    tags: data.tags,
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

export function getSeriesPosts(seriesName: string): PostData[] {
  const allPosts = getAllPosts().filter((post): post is PostData => post !== null);
  const seriesPosts = allPosts.filter(post => post.series === seriesName);
  
  return seriesPosts.sort((a, b) => {
    return (a.seriesOrder || 0) - (b.seriesOrder || 0);
  });
}

export function getPostsByTag(tag: string): PostData[] {
  const allPosts = getAllPosts().filter((post): post is PostData => post !== null);
  return allPosts.filter(post => post.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts().filter((post): post is PostData => post !== null);
  const tags = new Set<string>();
  allPosts.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
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
