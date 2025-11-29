import { PostData } from '../lib/posts';

/**
 * JSON-LD 구조화 데이터 컴포넌트들
 * 
 * 검색엔진이 콘텐츠를 더 잘 이해하고
 * Rich Snippets (별점, 작성자, 날짜 등)을 표시할 수 있게 함
 */

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
}

/**
 * 웹사이트 전체에 대한 JSON-LD
 * 검색 결과에서 사이트링크 표시에 도움
 */
export function WebsiteJsonLd({ url, name, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'PWNZ',
      url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleJsonLdProps {
  post: PostData;
  url: string;
}

/**
 * 블로그 포스트에 대한 JSON-LD
 * 검색 결과에서 작성자, 날짜, 이미지 등 표시
 */
export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const baseUrl = 'https://pwnz.kr';
  
  // 이미지 URL 처리
  const imageUrl = post.image
    ? (post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`)
    : `${baseUrl}/og-default.png`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title || post.slug.replace(/-/g, ' '),
    description: post.description || '인터랙티브 컴포넌트와 함께하는 기술 블로그',
    image: imageUrl,
    datePublished: post.date || new Date().toISOString(),
    dateModified: post.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || 'PWNZ',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PWNZ INTERACTIVES',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/og-default.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.series || 'Blog',
    inLanguage: 'ko-KR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * 브레드크럼 JSON-LD
 * 검색 결과에서 페이지 경로 표시
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

