# 📊 Google Analytics 이벤트 트래킹 가이드

## 추천 이벤트 목록

블로그의 특성에 맞춰 다음 7가지 카테고리의 이벤트를 추천합니다:

### 1. 콘텐츠 인게이지먼트 📖
사용자가 얼마나 깊이 있게 콘텐츠를 소비하는지 측정

- ✅ **아티클 읽기 시작** - 사용자가 글을 읽기 시작
- ✅ **스크롤 깊이** - 25%, 50%, 75%, 100% 지점
- ✅ **읽기 시간** - 1분, 3분, 5분, 10분 이상 체류
- ✅ **아티클 완독률** - 끝까지 스크롤한 비율

### 2. 인터랙티브 컴포넌트 상호작용 🎮
인터랙티브 요소가 얼마나 사용되는지 측정

- ✅ **컴포넌트 실행** - Play/Start 버튼 클릭
- ✅ **설정 변경** - 슬라이더, 드롭다운 등 조작
- ✅ **시뮬레이션 실행 횟수** - 반복 실행 추적
- ✅ **컴포넌트별 체류 시간** - 얼마나 오래 사용하는지

### 3. 목차(TOC) 네비게이션 🗺️
독자가 어떤 섹션에 관심이 있는지 파악

- ✅ **목차 클릭** - 어떤 섹션으로 이동했는지
- ✅ **가장 많이 클릭된 섹션** - 인기 있는 주제 파악

### 4. 복사/공유 이벤트 📋
콘텐츠의 가치를 측정하는 중요한 지표

- ✅ **코드 복사** - 어떤 언어의 코드를 복사하는지
- ✅ **인용 복사** - BibTeX, APA, MLA 등
- ✅ **URL 복사** - 공유 의도 파악

### 5. UI/UX 상호작용 💡
사용자 선호도 파악

- ✅ **테마 전환** - 다크/라이트 모드 선호도
- ✅ **외부 링크 클릭** - 어떤 외부 링크가 인기있는지
- ✅ **내부 링크 클릭** - 아티클 간 연결성 파악

### 6. 검색/필터링 🔍
(검색 기능 추가 시)

- ✅ **검색어** - 사용자가 무엇을 찾는지
- ✅ **검색 결과 클릭** - 검색 품질 측정
- ✅ **태그/카테고리 필터** - 관심 분야 파악

### 7. 에러/성능 ⚠️
사용자 경험 품질 모니터링

- ✅ **컴포넌트 로드 실패** - 기술적 문제 감지
- ✅ **느린 로딩** - 성능 이슈 파악

---

## 📝 실제 적용 예시

### 1. 목차(TOC) 클릭 트래킹

```tsx
// components/toc.tsx
"use client";

import { trackTOCClick } from "../lib/analytics";

export function TableOfContents({ toc, articleSlug }: Props) {
  // ... 기존 코드 ...
  
  return (
    <nav>
      {toc.map((item) => (
        <a
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            setActiveId(item.id);
            
            // 🎯 GA4 이벤트 전송
            trackTOCClick(articleSlug, item.id, item.text);
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
```

### 2. 테마 전환 트래킹

```tsx
// components/theme-toggle.tsx
"use client";

import { trackThemeToggle } from "../lib/analytics";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // 🎯 GA4 이벤트 전송
    trackThemeToggle(newTheme);
  };
  
  return (
    <button onClick={handleThemeToggle}>
      {/* 아이콘 */}
    </button>
  );
}
```

### 3. 인용 복사 트래킹

```tsx
// components/bibtex-copy-button.tsx
"use client";

import { trackCitationCopy } from "../lib/analytics";

export function BibTeXCopyButton({ post }: Props) {
  const copyToClipboard = async (
    text: string,
    type: 'bibtex' | 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee'
  ) => {
    await navigator.clipboard.writeText(text);
    
    // 🎯 GA4 이벤트 전송
    trackCitationCopy(post.slug, type);
  };
  
  // ... 기존 코드 ...
}
```

### 4. 스크롤 깊이 트래킹 (새 컴포넌트)

```tsx
// components/scroll-tracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "../lib/analytics";

export function ScrollTracker({ articleSlug }: { articleSlug: string }) {
  const trackedDepths = useRef(new Set<number>());
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercent = Math.floor((scrolled / scrollHeight) * 100);
      
      // 25%, 50%, 75%, 100% 지점에서 이벤트 전송
      [25, 50, 75, 100].forEach((depth) => {
        if (scrollPercent >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackScrollDepth(articleSlug, depth as 25 | 50 | 75 | 100);
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleSlug]);
  
  return null; // UI 없음, 이벤트만 추적
}
```

### 5. 읽기 시간 트래킹 (새 컴포넌트)

```tsx
// components/reading-time-tracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { trackReadingTime, trackArticleStart } from "../lib/analytics";

export function ReadingTimeTracker({
  articleSlug,
  articleTitle,
}: {
  articleSlug: string;
  articleTitle: string;
}) {
  const startTime = useRef<number>(Date.now());
  const trackedMinutes = useRef(new Set<number>());
  
  useEffect(() => {
    // 읽기 시작 이벤트
    trackArticleStart(articleSlug, articleTitle);
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 60000); // 분 단위
      
      // 1분, 3분, 5분, 10분 마다 이벤트 전송
      [1, 3, 5, 10].forEach((minute) => {
        if (elapsed >= minute && !trackedMinutes.current.has(minute)) {
          trackedMinutes.current.add(minute);
          trackReadingTime(articleSlug, minute);
        }
      });
    }, 30000); // 30초마다 체크
    
    return () => clearInterval(interval);
  }, [articleSlug, articleTitle]);
  
  return null;
}
```

### 6. 인터랙티브 컴포넌트 트래킹 예시

```tsx
// articles/quick-sort/components/QuickSortVisualizer.tsx
"use client";

import { trackInteractivePlay, trackInteractiveConfig } from "@/lib/analytics";

export function QuickSortVisualizer() {
  const [arraySize, setArraySize] = useState(10);
  
  const handlePlay = () => {
    // 시뮬레이션 실행
    startSort();
    
    // 🎯 GA4 이벤트 전송
    trackInteractivePlay("QuickSortVisualizer", "quick-sort");
  };
  
  const handleArraySizeChange = (size: number) => {
    setArraySize(size);
    
    // 🎯 GA4 이벤트 전송
    trackInteractiveConfig("QuickSortVisualizer", "array_size", size);
  };
  
  // ... 컴포넌트 로직 ...
}
```

### 7. 외부 링크 클릭 트래킹 (전역 적용)

```tsx
// components/mdx-components/base-components.tsx
import { trackExternalLink } from "@/lib/analytics";

export const components = {
  a: ({ href, children, ...props }: ComponentProps<"a">) => {
    const isExternal = href?.startsWith("http");
    
    return (
      <a
        href={href}
        onClick={() => {
          if (isExternal && href) {
            // 🎯 GA4 이벤트 전송
            trackExternalLink(href, String(children));
          }
        }}
        {...props}
      >
        {children}
      </a>
    );
  },
};
```

---

## 🚀 적용 방법

### 1단계: 트래커 컴포넌트 추가

아티클 페이지에 트래커 컴포넌트를 추가하세요:

```tsx
// app/posts/[slug]/page.tsx
import { ScrollTracker } from "@/components/scroll-tracker";
import { ReadingTimeTracker } from "@/components/reading-time-tracker";

export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      {/* 기존 콘텐츠 */}
      <article>...</article>
      
      {/* 이벤트 트래커 */}
      <ScrollTracker articleSlug={params.slug} />
      <ReadingTimeTracker
        articleSlug={params.slug}
        articleTitle={post.title}
      />
    </>
  );
}
```

### 2단계: 기존 컴포넌트에 이벤트 추가

위 예시를 참고하여 기존 컴포넌트에 `track*` 함수를 추가하세요.

### 3단계: GA4 대시보드 확인

1. [Google Analytics](https://analytics.google.com/) 접속
2. **보고서** > **참여도** > **이벤트** 클릭
3. 커스텀 이벤트 확인

---

## 📊 GA4 대시보드에서 확인 가능한 인사이트

### 콘텐츠 분석
- 어떤 아티클이 가장 많이 읽히는가?
- 평균 읽기 시간은?
- 완독률은 얼마나 되는가?

### 인터랙티브 분석
- 어떤 인터랙티브 컴포넌트가 인기있는가?
- 사용자들이 얼마나 많이 조작하는가?
- 어떤 설정 값을 선호하는가?

### 사용자 행동 분석
- 다크 모드 vs 라이트 모드 비율
- 목차를 통한 네비게이션 패턴
- 외부 링크 클릭 패턴

### 콘텐츠 가치 분석
- 코드 복사가 많은 = 실용적인 콘텐츠
- 인용 복사가 많은 = 학술적 가치가 높은 콘텐츠
- URL 공유가 많은 = 공유 가치가 높은 콘텐츠

---

## 🎯 우선순위별 적용 추천

### 🥇 1순위 (즉시 적용 추천)
1. **인용 복사 트래킹** - 이미 버튼이 있어 쉽게 적용 가능
2. **테마 전환 트래킹** - 한 줄 추가로 적용 가능
3. **목차 클릭 트래킹** - 사용자 네비게이션 패턴 파악

### 🥈 2순위 (다음 단계)
4. **스크롤 깊이 트래킹** - 새 컴포넌트 생성 필요
5. **읽기 시간 트래킹** - 새 컴포넌트 생성 필요
6. **외부 링크 클릭** - 전역 설정 필요

### 🥉 3순위 (여유가 있을 때)
7. **인터랙티브 컴포넌트** - 각 컴포넌트마다 개별 작업 필요
8. **성능 모니터링** - 고급 설정 필요

---

## ⚠️ 주의사항

### 프라이버시
- 개인 식별 정보는 절대 수집하지 마세요
- IP 익명화가 GA4에서 기본 활성화되어 있는지 확인하세요

### 성능
- 이벤트를 너무 자주 전송하지 마세요 (debounce/throttle 사용)
- 스크롤 이벤트는 특히 주의가 필요합니다

### 데이터 정확성
- 봇 트래픽 필터링 확인
- 개발 환경에서는 이벤트를 보내지 않도록 설정 가능:

```typescript
export const sendGAEvent = (eventName: string, params?: GAEventParams) => {
  // 프로덕션 환경에서만 전송
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};
```

---

## 📚 참고 자료

- [GA4 이벤트 가이드](https://support.google.com/analytics/answer/9322688)
- [Next.js + GA4 통합](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
- [추천 이벤트 목록](https://support.google.com/analytics/answer/9267735)

