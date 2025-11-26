/**
 * Google Analytics 이벤트 트래킹 헬퍼 함수
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics
 */

// 타입 정의
export type GAEventParams = {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

/**
 * GA4 이벤트 전송 함수
 */
export const sendGAEvent = (
  eventName: string,
  params?: GAEventParams
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// ============================================
// 1. 콘텐츠 인게이지먼트 이벤트
// ============================================

/**
 * 아티클 읽기 시작
 */
export const trackArticleStart = (articleSlug: string, articleTitle: string) => {
  sendGAEvent('article_start', {
    article_slug: articleSlug,
    article_title: articleTitle,
    category: 'engagement',
  });
};

/**
 * 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
 */
export const trackScrollDepth = (
  articleSlug: string,
  depth: 25 | 50 | 75 | 100
) => {
  sendGAEvent('scroll_depth', {
    article_slug: articleSlug,
    depth: depth,
    category: 'engagement',
  });
};

/**
 * 읽기 시간 추적 (1분, 3분, 5분, 10분 이상)
 */
export const trackReadingTime = (
  articleSlug: string,
  minutes: number
) => {
  sendGAEvent('reading_time', {
    article_slug: articleSlug,
    minutes: minutes,
    category: 'engagement',
  });
};

// ============================================
// 2. 인터랙티브 컴포넌트 이벤트
// ============================================

/**
 * 인터랙티브 컴포넌트 실행
 */
export const trackInteractivePlay = (
  componentName: string,
  articleSlug: string
) => {
  sendGAEvent('interactive_play', {
    component_name: componentName,
    article_slug: articleSlug,
    category: 'interaction',
  });
};

/**
 * 인터랙티브 컴포넌트 설정 변경
 */
export const trackInteractiveConfig = (
  componentName: string,
  configName: string,
  configValue: string | number
) => {
  sendGAEvent('interactive_config', {
    component_name: componentName,
    config_name: configName,
    config_value: String(configValue),
    category: 'interaction',
  });
};

/**
 * 시뮬레이션 실행 횟수
 */
export const trackSimulationRun = (
  componentName: string,
  runCount: number
) => {
  sendGAEvent('simulation_run', {
    component_name: componentName,
    run_count: runCount,
    category: 'interaction',
  });
};

// ============================================
// 3. 목차(TOC) 네비게이션 이벤트
// ============================================

/**
 * 목차 클릭
 */
export const trackTOCClick = (
  articleSlug: string,
  sectionId: string,
  sectionText: string
) => {
  sendGAEvent('toc_click', {
    article_slug: articleSlug,
    section_id: sectionId,
    section_text: sectionText,
    category: 'navigation',
  });
};

// ============================================
// 4. 복사/공유 이벤트
// ============================================

/**
 * 코드 블록 복사
 */
export const trackCodeCopy = (
  articleSlug: string,
  language?: string
) => {
  sendGAEvent('code_copy', {
    article_slug: articleSlug,
    language: language || 'unknown',
    category: 'sharing',
  });
};

/**
 * 인용 복사 (BibTeX, APA 등)
 */
export const trackCitationCopy = (
  articleSlug: string,
  citationType: 'bibtex' | 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee'
) => {
  sendGAEvent('citation_copy', {
    article_slug: articleSlug,
    citation_type: citationType,
    category: 'sharing',
  });
};

/**
 * URL 복사
 */
export const trackURLCopy = (articleSlug: string) => {
  sendGAEvent('url_copy', {
    article_slug: articleSlug,
    category: 'sharing',
  });
};

// ============================================
// 5. UI/UX 상호작용 이벤트
// ============================================

/**
 * 테마 전환 (다크/라이트 모드)
 */
export const trackThemeToggle = (theme: 'light' | 'dark') => {
  sendGAEvent('theme_toggle', {
    theme: theme,
    category: 'ui',
  });
};

/**
 * 외부 링크 클릭
 */
export const trackExternalLink = (
  url: string,
  linkText: string,
  articleSlug?: string
) => {
  sendGAEvent('external_link', {
    url: url,
    link_text: linkText,
    article_slug: articleSlug || 'unknown',
    category: 'navigation',
  });
};

/**
 * 내부 아티클 링크 클릭
 */
export const trackInternalLink = (
  fromSlug: string,
  toSlug: string
) => {
  sendGAEvent('internal_link', {
    from_slug: fromSlug,
    to_slug: toSlug,
    category: 'navigation',
  });
};

// ============================================
// 6. 검색/필터링 이벤트
// ============================================

/**
 * 검색 실행 (검색 기능이 있다면)
 */
export const trackSearch = (query: string, resultsCount: number) => {
  sendGAEvent('search', {
    search_term: query,
    results_count: resultsCount,
    category: 'search',
  });
};

/**
 * 태그/카테고리 필터 클릭
 */
export const trackFilterClick = (filterType: string, filterValue: string) => {
  sendGAEvent('filter_click', {
    filter_type: filterType,
    filter_value: filterValue,
    category: 'navigation',
  });
};

// ============================================
// 7. 에러/성능 이벤트
// ============================================

/**
 * 컴포넌트 로드 실패
 */
export const trackComponentError = (
  componentName: string,
  errorMessage: string
) => {
  sendGAEvent('component_error', {
    component_name: componentName,
    error_message: errorMessage,
    category: 'error',
  });
};

/**
 * 느린 로딩 시간 추적
 */
export const trackSlowLoad = (
  componentName: string,
  loadTime: number
) => {
  sendGAEvent('slow_load', {
    component_name: componentName,
    load_time: loadTime,
    category: 'performance',
  });
};

// ============================================
// Window gtag 타입 정의
// ============================================
declare global {
  interface Window {
    gtag: (
      command: 'event',
      eventName: string,
      params?: { [key: string]: unknown }
    ) => void;
  }
}

