import { PostData } from './posts';

/**
 * Post 데이터로부터 BibTeX 형식의 인용 문자열을 생성합니다.
 */
export function generateBibTeX(post: PostData): string {
  const citationKey = post.slug.replace(/-/g, '_');
  const author = post.author || 'JIWON';
  const title = post.title || post.slug.replace(/-/g, ' ');
  const year = post.date ? new Date(post.date).getFullYear() : new Date().getFullYear();
  const url = `https://jiwon.me/posts/${post.slug}`;
  
  return `@misc{${citationKey},
  author = {${author}},
  title = {${title}},
  year = {${year}},
  url = {${url}}
}`;
}

export type CitationFormat = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee';

/**
 * Post 데이터로부터 다양한 Plain Text 인용 형식을 생성합니다.
 */

// APA 형식: Author, A. A. (Year). Title. URL
export function generateAPA(post: PostData): string {
  const author = post.author || 'JIWON';
  const title = post.title || post.slug.replace(/-/g, ' ');
  const year = post.date ? new Date(post.date).getFullYear() : new Date().getFullYear();
  const url = `https://jiwon.me/posts/${post.slug}`;
  
  return `${author}. (${year}). ${title}. ${url}`;
}

// MLA 형식: Author. "Title." Year. Web. Date Accessed. URL
export function generateMLA(post: PostData): string {
  const author = post.author || 'JIWON';
  const title = post.title || post.slug.replace(/-/g, ' ');
  const year = post.date ? new Date(post.date).getFullYear() : new Date().getFullYear();
  const url = `https://jiwon.me/posts/${post.slug}`;
  const accessDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `${author}. "${title}." ${year}. Web. ${accessDate}. ${url}`;
}

// Chicago 형식: Author. "Title." Year. Accessed Date. URL
export function generateChicago(post: PostData): string {
  const author = post.author || 'JIWON';
  const title = post.title || post.slug.replace(/-/g, ' ');
  const year = post.date ? new Date(post.date).getFullYear() : new Date().getFullYear();
  const url = `https://jiwon.me/posts/${post.slug}`;
  const accessDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `${author}. "${title}." ${year}. Accessed ${accessDate}. ${url}`;
}

// Harvard 형식: Author (Year) Title. Available at: URL (Accessed: Date)
export function generateHarvard(post: PostData): string {
  const author = post.author || 'JIWON';
  const title = post.title || post.slug.replace(/-/g, ' ');
  const year = post.date ? new Date(post.date).getFullYear() : new Date().getFullYear();
  const url = `https://jiwon.me/posts/${post.slug}`;
  const accessDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `${author} (${year}) ${title}. Available at: ${url} (Accessed: ${accessDate})`;
}

// IEEE 형식: Author. "Title," Year. [Online]. Available: URL. [Accessed: Date]
export function generateIEEE(post: PostData): string {
  const author = post.author || 'JIWON';
  const title = post.title || post.slug.replace(/-/g, ' ');
  const year = post.date ? new Date(post.date).getFullYear() : new Date().getFullYear();
  const url = `https://jiwon.me/posts/${post.slug}`;
  const accessDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `${author}. "${title}," ${year}. [Online]. Available: ${url}. [Accessed: ${accessDate}]`;
}

/**
 * 포맷 타입에 따라 적절한 인용 문자열을 생성합니다.
 */
export function generateCitation(post: PostData, format: CitationFormat): string {
  switch (format) {
    case 'apa':
      return generateAPA(post);
    case 'mla':
      return generateMLA(post);
    case 'chicago':
      return generateChicago(post);
    case 'harvard':
      return generateHarvard(post);
    case 'ieee':
      return generateIEEE(post);
    default:
      return generateAPA(post);
  }
}

