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
const DEFAULT_LOCALE = 'ko';
const CONTENT_FILE_REGEX = /^content(?:\.([a-z0-9-]+))?\.mdx$/i;

type LocaleFile = {
  locale: string;
  filePath: string;
};

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
  description?: string;
  author?: string;
  affiliate?: string;
  image?: string;
  series?: string;
  seriesOrder?: number;
  tags?: string[];
  hidden?: boolean;
  locale: string;
  defaultLocale: string;
  availableLocales: string[];
};

export function getPostSlugs() {
  if (!fs.existsSync(targetDirectory)) {
    return [];
  }
  return fs.readdirSync(targetDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => dirent.name);
}

export function getPostBySlug(slug: string, requestedLocale?: string): PostData | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const articleDir = path.join(targetDirectory, realSlug);

  if (!fs.existsSync(articleDir)) {
    return null;
  }

  const localeFiles = getLocaleFiles(articleDir);

  if (localeFiles.length === 0) {
    return null;
  }

  const uniqueLocales = Array.from(new Set(localeFiles.map((file) => file.locale)));
  const defaultLocale = uniqueLocales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : uniqueLocales[0];
  const availableLocales = sortLocales(uniqueLocales, defaultLocale);
  const resolvedLocale = resolveLocale(requestedLocale, availableLocales, defaultLocale);
  const activeFile = localeFiles.find((file) => file.locale === resolvedLocale) ?? localeFiles[0];

  const fileContents = fs.readFileSync(activeFile.filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const toc = extractTOC(content);
  
  return { 
    slug: realSlug, 
    content, 
    toc,
    date: data.date,
    title: data.title,
    description: data.description,
    author: data.author,
    affiliate: data.affiliate,
    image: data.image,
    series: data.series,
    seriesOrder: data.seriesOrder,
    tags: data.tags,
    hidden: data.hidden ?? false,
    locale: resolvedLocale,
    defaultLocale,
    availableLocales,
  };
}

type GetAllPostsOptions = {
  includeHidden?: boolean;
  locale?: string;
};

export function getAllPosts(optionsOrIncludeHidden?: boolean | GetAllPostsOptions): PostData[] {
  const options = typeof optionsOrIncludeHidden === 'boolean'
    ? { includeHidden: optionsOrIncludeHidden }
    : (optionsOrIncludeHidden ?? {});
  const { includeHidden = false, locale }: GetAllPostsOptions = options;

  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is PostData => post !== null);
  
  // 개발 모드이거나 includeHidden이 true인 경우 hidden 포스트 포함
  const isDev = process.env.NODE_ENV === 'development';
  const filteredPosts = (isDev || includeHidden) 
    ? posts 
    : posts.filter(post => !post.hidden);
  
  // 날짜순 정렬 (최신순)
  return filteredPosts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getSeriesPosts(seriesName: string, locale?: string): PostData[] {
  const allPosts = getAllPosts({ locale }).filter((post): post is PostData => post !== null);
  const seriesPosts = allPosts.filter(post => post.series === seriesName);
  
  return seriesPosts.sort((a, b) => {
    return (a.seriesOrder || 0) - (b.seriesOrder || 0);
  });
}

export function getPostsByTag(tag: string, locale?: string): PostData[] {
  const allPosts = getAllPosts({ locale }).filter((post): post is PostData => post !== null);
  return allPosts.filter(post => post.tags?.includes(tag));
}

export function getAllTags(locale?: string): string[] {
  const allPosts = getAllPosts({ locale }).filter((post): post is PostData => post !== null);
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

function getLocaleFiles(articleDir: string): LocaleFile[] {
  if (!fs.existsSync(articleDir)) {
    return [];
  }

  return fs
    .readdirSync(articleDir)
    .filter((file) => CONTENT_FILE_REGEX.test(file))
    .map((file) => ({
      locale: extractLocaleFromFilename(file),
      filePath: path.join(articleDir, file),
    }));
}

function extractLocaleFromFilename(fileName: string): string {
  const match = fileName.match(CONTENT_FILE_REGEX);
  const rawLocale = match?.[1]?.toLowerCase();
  return rawLocale || DEFAULT_LOCALE;
}

function resolveLocale(requested: string | undefined, available: string[], fallback: string): string {
  if (requested && available.includes(requested)) {
    return requested;
  }
  if (available.includes(fallback)) {
    return fallback;
  }
  return available[0];
}

function sortLocales(locales: string[], defaultLocale: string): string[] {
  return [...locales].sort((a, b) => {
    if (a === defaultLocale) return -1;
    if (b === defaultLocale) return 1;
    return a.localeCompare(b);
  });
}
