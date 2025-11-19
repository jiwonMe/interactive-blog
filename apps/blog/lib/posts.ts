import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'content');

export function getPostSlugs() {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  return fs.readdirSync(contentDirectory).filter((file) => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return { slug: realSlug, content: fileContents };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => getPostBySlug(slug));
}

