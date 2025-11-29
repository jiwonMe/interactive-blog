import { MetadataRoute } from 'next';

/**
 * 동적 robots.txt 생성
 * Next.js 13+에서 자동으로 /robots.txt 경로에 노출됨
 * 
 * SEO 최적화:
 * - 검색엔진 크롤러에게 사이트 구조 안내
 * - sitemap 위치 제공
 * - 불필요한 페이지 크롤링 방지
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pwnz.kr';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // API 라우트 (있다면)
          '/api/',
          // 실험적 페이지 (프로덕션에서 숨김)
          '/experiment/',
          // Admin 관련 경로
          '/admin/',
        ],
      },
      {
        // Google 봇 특별 설정
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

