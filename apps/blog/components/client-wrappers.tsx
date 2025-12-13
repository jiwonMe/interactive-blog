"use client";

import dynamic from 'next/dynamic';
import { TOCItem } from '../lib/posts';

/**
 * 클라이언트 컴포넌트 Lazy Loading 래퍼
 * 
 * Next.js 15에서 서버 컴포넌트에서 dynamic({ ssr: false })를 사용할 수 없으므로
 * 클라이언트 컴포넌트에서 dynamic import를 수행
 * 
 * SEO 최적화:
 * - 초기 HTML에는 포함되지 않음 (검색엔진에 불필요한 요소)
 * - 클라이언트에서만 로드되어 TTFB, FCP 개선
 */

// TableOfContents - 클라이언트 사이드에서만 렌더링
const LazyTableOfContents = dynamic(
  () => import('./toc').then(mod => ({ default: mod.TableOfContents })),
  { 
    ssr: false,
    loading: () => (
      <nav className="hidden xl:block w-64 ml-12 flex-shrink-0">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded"
                style={{ width: `${60 + Math.random() * 40}%` }}
              />
            ))}
          </div>
        </div>
      </nav>
    )
  }
);

// ScrollTracker - 순수 트래킹용, UI 없음
const LazyScrollTracker = dynamic(
  () => import('./analytics/scroll-tracker').then(mod => ({ default: mod.ScrollTracker })),
  { ssr: false }
);

// ReadingTimeTracker - 순수 트래킹용, UI 없음
const LazyReadingTimeTracker = dynamic(
  () => import('./analytics/reading-time-tracker').then(mod => ({ default: mod.ReadingTimeTracker })),
  { ssr: false }
);

// ArticleFeedback - 피드백 UI, 클라이언트 사이드에서만 렌더링
const LazyArticleFeedback = dynamic(
  () => import('./analytics/article-feedback').then(mod => ({ default: mod.ArticleFeedback })),
  { ssr: false }
);

// Props 타입 정의
interface TableOfContentsWrapperProps {
  toc: TOCItem[];
  articleSlug?: string;
}

interface ScrollTrackerWrapperProps {
  articleSlug: string;
}

interface ReadingTimeTrackerWrapperProps {
  articleSlug: string;
  articleTitle: string;
}

interface ArticleFeedbackWrapperProps {
  articleSlug: string;
  articleTitle: string;
}

/**
 * TableOfContents 래퍼 컴포넌트
 */
export function TableOfContentsWrapper({ toc, articleSlug }: TableOfContentsWrapperProps) {
  return <LazyTableOfContents toc={toc} articleSlug={articleSlug} />;
}

/**
 * ScrollTracker 래퍼 컴포넌트
 */
export function ScrollTrackerWrapper({ articleSlug }: ScrollTrackerWrapperProps) {
  return <LazyScrollTracker articleSlug={articleSlug} />;
}

/**
 * ReadingTimeTracker 래퍼 컴포넌트
 */
export function ReadingTimeTrackerWrapper({ articleSlug, articleTitle }: ReadingTimeTrackerWrapperProps) {
  return <LazyReadingTimeTracker articleSlug={articleSlug} articleTitle={articleTitle} />;
}

/**
 * ArticleFeedback 래퍼 컴포넌트
 */
export function ArticleFeedbackWrapper({ articleSlug, articleTitle }: ArticleFeedbackWrapperProps) {
  return <LazyArticleFeedback articleSlug={articleSlug} articleTitle={articleTitle} />;
}

