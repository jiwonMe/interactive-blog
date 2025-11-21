import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/header";
import StitchesRegistry from "../components/stitches-registry";
import { cn } from "../lib/utils";

export const metadata: Metadata = {
  // 기본 메타데이터
  title: {
    // 기본 제목
    default: "JIWON's Interactive Blog",
    // 템플릿: 각 페이지 제목 | 사이트 이름
    template: "%s | JIWON's Blog",
  },
  description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
  authors: [{ name: "JIWON", url: "https://jiwon.me" }],
  
  // Open Graph 기본 설정
  openGraph: {
    // 사이트 타입
    type: "website",
    // 사이트 URL
    url: "https://jiwon.me",
    // 사이트 이름
    siteName: "JIWON's Interactive Blog",
    // 기본 제목
    title: "JIWON's Interactive Blog",
    // 기본 설명
    description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
    // 기본 이미지
    images: [
      {
        url: "https://jiwon.me/og-default.png",
        width: 1200,
        height: 630,
        alt: "JIWON's Interactive Blog",
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
    site: "@jiwonme",
    // 작성자 핸들
    creator: "@jiwonme",
    // 기본 제목
    title: "JIWON's Interactive Blog",
    // 기본 설명
    description: "인터랙티브 컴포넌트와 함께하는 기술 블로그",
    // 기본 이미지
    images: ["https://jiwon.me/og-default.png"],
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
            
            <footer className="border-t border-zinc-100 py-12 mt-20 dark:border-zinc-800">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">PWNZ INTERACTIVES</span>
                  <span>© {new Date().getFullYear()} All rights reserved.</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <a href="https://github.com/jiwonMe" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors dark:hover:text-white">
                    GitHub
                  </a>
                  {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors dark:hover:text-white">
                    Twitter
                  </a> */}
                  <span className="w-px h-3 bg-zinc-200 hidden md:block dark:bg-zinc-700"></span>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </StitchesRegistry>
      </body>
    </html>
  );
}
