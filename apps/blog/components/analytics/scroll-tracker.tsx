"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "../../lib/analytics";

/**
 * 스크롤 깊이 추적 컴포넌트
 * 
 * 사용자가 페이지를 25%, 50%, 75%, 100% 스크롤할 때마다
 * GA4 이벤트를 전송합니다.
 * 
 * @param articleSlug - 현재 아티클의 slug
 * 
 * @example
 * ```tsx
 * <ScrollTracker articleSlug="quick-sort" />
 * ```
 */
export function ScrollTracker({ articleSlug }: { articleSlug: string }) {
  // 이미 추적된 깊이를 저장 (중복 전송 방지)
  const trackedDepths = useRef(new Set<number>());
  
  useEffect(() => {
    const handleScroll = () => {
      // 전체 스크롤 가능한 높이
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // 현재 스크롤 위치
      const scrolled = window.scrollY;
      
      // 스크롤 비율 계산 (0~100)
      const scrollPercent = scrollHeight > 0
        ? Math.floor((scrolled / scrollHeight) * 100)
        : 0;
      
      // 25%, 50%, 75%, 100% 지점에서 이벤트 전송
      const depthMilestones = [25, 50, 75, 100] as const;
      
      depthMilestones.forEach((depth) => {
        // 해당 깊이에 도달했고, 아직 추적하지 않았다면
        if (scrollPercent >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackScrollDepth(articleSlug, depth);
          
          // 개발 환경에서 디버깅용 로그
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Scroll depth: ${depth}% for ${articleSlug}`);
          }
        }
      });
    };
    
    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // 초기 스크롤 위치 체크 (이미 스크롤된 상태에서 시작할 수 있음)
    handleScroll();
    
    // 클린업
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleSlug]);
  
  // UI 렌더링 없음 (순수 트래킹용)
  return null;
}

