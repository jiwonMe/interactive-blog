'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * URL 해시가 타겟 ID와 일치할 때 하이라이트 상태를 반환하는 훅
 * 
 * @param targetId - 감지할 해시 ID (# 제외)
 * @param duration - 하이라이트 지속 시간 (ms), 기본값 2000
 * @returns 하이라이트 상태
 * 
 * @example
 * ```tsx
 * const isHighlighted = useHashHighlight('footnote-1', 2000);
 * // URL이 #footnote-1일 때 2초간 true
 * ```
 */
export function useHashHighlight(targetId: string, duration: number = 2000): boolean {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === `#${targetId}`) {
        // 기존 타이머 정리
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        setIsHighlighted(true);
        
        // duration 후 하이라이트 제거
        timeoutRef.current = setTimeout(() => {
          setIsHighlighted(false);
        }, duration);
      }
    };

    // 초기 체크 (페이지 로드 시 해시가 있는 경우)
    checkHash();

    // hashchange 이벤트 리스닝
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [targetId, duration]);

  return isHighlighted;
}


