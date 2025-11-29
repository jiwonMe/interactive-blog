import { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/posts';

/**
 * 동적 사이트맵 생성
 * Next.js 13+에서 자동으로 /sitemap.xml 경로에 노출됨
 * 
 * SEO 최적화:
 * - 모든 포스트 URL을 검색엔진에 제공
 * - lastModified로 콘텐츠 업데이트 시점 알림
 * - changeFrequency와 priority로 크롤링 우선순위 설정
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pwnz.kr';
  
  // 모든 공개 포스트 가져오기
  const posts = getAllPosts(false);
  
  // 포스트 URL 목록 생성
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // 정적 페이지 URL
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];
  
  return [...staticUrls, ...postUrls];
}

