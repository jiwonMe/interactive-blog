import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import StitchesRegistry from "../components/stitches-registry";
import { cn } from "../lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * 폰트 최적화를 위한 상수들
 * - preconnect: DNS, TCP, TLS 핸드셰이크를 미리 수행
 * - preload: 중요한 리소스를 미리 로드
 */
const FONT_PRECONNECT_ORIGINS = [
  // JSDelivr CDN (Pretendard 폰트)
  "https://cdn.jsdelivr.net",
] as const;

const FONT_PRELOAD_URLS = {
  // Pretendard Variable CSS - 렌더링 차단 방지를 위해 preload
  pretendardCss: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css",
  // Pretendard Variable WOFF2 - 가장 큰 폰트 파일을 preload
  pretendardWoff2: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/woff2/PretendardVariable.woff2",
  // KaTeX CSS - 수학 수식 렌더링용
  katexCss: "https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css",
} as const;

export const metadata: Metadata = {
  // 기본 메타데이터
  title: {
    // 기본 제목
    default: "PWNZ INTERACTIVES",
    // 템플릿: 각 페이지 제목 | 사이트 이름
    template: "%s | PWNZ INTERACTIVES",
  },
  description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
  authors: [{ name: "PWNZ", url: "https://pwnz.kr" }],
  
  // Open Graph 기본 설정
  openGraph: {
    // 사이트 타입
    type: "website",
    // 사이트 URL
    url: "https://pwnz.kr",
    // 사이트 이름
    siteName: "PWNZ INTERACTIVES",
    // 기본 제목
    title: "PWNZ INTERACTIVES",
    // 기본 설명
    description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
    // 기본 이미지
    images: [
      {
        url: "https://pwnz.kr/og-default.png",
        width: 1200,
        height: 630,
        alt: "PWNZ INTERACTIVES",
      },
    ],
    // 로케일
    locale: "ko_KR",
  },
  
  // Twitter Card 기본 설정
  twitter: {
    // Card 타입
    card: "summary_large_image",
    // 사이트 핸들
    site: "@pwnz",
    // 작성자 핸들
    creator: "@pwnz",
    // 기본 제목
    title: "PWNZ INTERACTIVES",
    // 기본 설명
    description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
    // 기본 이미지
    images: ["https://pwnz.kr/og-default.png"],
  },
  
  // 메타 viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  
  // 로봇 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* DNS prefetch & preconnect - 외부 CDN 연결 사전 수립 */}
        {FONT_PRECONNECT_ORIGINS.map((origin) => (
          <link
            key={origin}
            rel="preconnect"
            href={origin}
            crossOrigin="anonymous"
          />
        ))}
        
        {/* Pretendard CSS preload - 렌더링 차단 방지 */}
        <link
          rel="preload"
          href={FONT_PRELOAD_URLS.pretendardCss}
          as="style"
        />
        
        {/* Pretendard 폰트 파일 preload - LCP 개선 */}
        <link
          rel="preload"
          href={FONT_PRELOAD_URLS.pretendardWoff2}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Pretendard CSS 비동기 로드 - 렌더링 차단 방지 */}
        <link
          rel="stylesheet"
          href={FONT_PRELOAD_URLS.pretendardCss}
          fetchPriority="high"
        />
        
        {/* KaTeX CSS - 수학 수식 렌더링용 (낮은 우선순위로 로드) */}
        <link
          rel="stylesheet"
          href={FONT_PRELOAD_URLS.katexCss}
          fetchPriority="low"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          // base
          "bg-zinc-100 text-zinc-800 antialiased min-h-screen flex flex-col",
          // selection
          "selection:bg-blue-100 selection:text-blue-900",
          // dark mode
          "dark:bg-zinc-950 dark:text-zinc-50 dark:selection:bg-blue-900 dark:selection:text-blue-100"
        )}
      >
        <StitchesRegistry>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            
            <div
              className={cn(
                /* Layout */
                "flex-1",
                /* Mobile padding for fixed bottom header */
                "pb-16 sm:pb-0"
              )}
            >
              {children}
            </div>
            
            <Footer />
          </ThemeProvider>
        </StitchesRegistry>
        
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
