"use client";

import { useEffect, useRef } from "react";
import { trackReadingTime, trackArticleStart } from "../../lib/analytics";

/**
 * 읽기 시간 추적 컴포넌트
 * 
 * 사용자가 페이지에 머문 시간을 추적하고,
 * 1분, 3분, 5분, 10분 마일스톤마다 GA4 이벤트를 전송합니다.
 * 
 * @param articleSlug - 현재 아티클의 slug
 * @param articleTitle - 현재 아티클의 제목
 * 
 * @example
 * ```tsx
 * <ReadingTimeTracker
 *   articleSlug="quick-sort"
 *   articleTitle="퀵 정렬 시각화"
 * />
 * ```
 */
export function ReadingTimeTracker({
  articleSlug,
  articleTitle,
}: {
  articleSlug: string;
  articleTitle: string;
}) {
  // 페이지 진입 시간 기록
  const startTime = useRef<number>(Date.now());
  
  // 이미 추적된 시간(분) 저장 (중복 전송 방지)
  const trackedMinutes = useRef(new Set<number>());
  
  useEffect(() => {
    // 아티클 읽기 시작 이벤트 전송
    trackArticleStart(articleSlug, articleTitle);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📖 Article start: ${articleTitle} (${articleSlug})`);
    }
    
    // 30초마다 경과 시간 체크
    const interval = setInterval(() => {
      // 경과 시간 (분 단위)
      const elapsedMs = Date.now() - startTime.current;
      const elapsedMinutes = Math.floor(elapsedMs / 60000);
      
      // 1분, 3분, 5분, 10분 마일스톤
      const timeMilestones = [1, 3, 5, 10];
      
      timeMilestones.forEach((minute) => {
        // 해당 시간에 도달했고, 아직 추적하지 않았다면
        if (elapsedMinutes >= minute && !trackedMinutes.current.has(minute)) {
          trackedMinutes.current.add(minute);
          trackReadingTime(articleSlug, minute);
          
          // 개발 환경에서 디버깅용 로그
          if (process.env.NODE_ENV === 'development') {
            console.log(`⏱️ Reading time: ${minute} min for ${articleSlug}`);
          }
        }
      });
    }, 30000); // 30초마다 체크 (더 자주 체크하면 성능에 영향)
    
    // 클린업
    return () => clearInterval(interval);
  }, [articleSlug, articleTitle]);
  
  // UI 렌더링 없음 (순수 트래킹용)
  return null;
}

