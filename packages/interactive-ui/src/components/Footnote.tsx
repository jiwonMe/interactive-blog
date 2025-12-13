'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useHashHighlight } from './hooks/useHashHighlight';
import { normalizeFootnoteContent } from './FootnoteLinkTitle';

// 각주 데이터 타입
interface FootnoteData {
  id: number;
  content: React.ReactNode;
  customId?: string;
}

// Context 타입
interface FootnoteContextType {
  footnotes: FootnoteData[];
  registerFootnote: (content: React.ReactNode, customId?: string) => number;
  getFootnoteIdByCustomId: (customId: string) => number | undefined;
  getFootnoteById: (id: number) => FootnoteData | undefined;
}

// Context 생성
const FootnoteContext = createContext<FootnoteContextType | null>(null);

// Provider Props
interface FootnoteProviderProps {
  children: React.ReactNode;
}

/**
 * FootnoteProvider: 각주들을 관리하는 Context Provider
 * 모든 각주 컴포넌트를 이 Provider로 감싸야 합니다
 */
export function FootnoteProvider({ children }: FootnoteProviderProps) {
  const [footnotes, setFootnotes] = useState<FootnoteData[]>([]);
  const counterRef = useRef(0);
  const customIdMapRef = useRef<Map<string, number>>(new Map());
  const contentMapRef = useRef<Map<number, React.ReactNode>>(new Map());
  
  const registerFootnote = useCallback((content: React.ReactNode, customId?: string): number => {
    // customId가 이미 등록되어 있으면 기존 ID 반환
    if (customId && customIdMapRef.current.has(customId)) {
      return customIdMapRef.current.get(customId)!;
    }
    
    // 카운터를 증가시키고 새 ID 생성
    counterRef.current += 1;
    const id = counterRef.current;
    
    // customId가 있으면 맵에 저장
    if (customId) {
      customIdMapRef.current.set(customId, id);
    }
    
    // content를 맵에 저장
    contentMapRef.current.set(id, content);
    
    // 각주 추가
    setFootnotes(prev => [...prev, { id, content, customId }]);
    
    return id;
  }, []);
  
  const getFootnoteIdByCustomId = useCallback((customId: string): number | undefined => {
    return customIdMapRef.current.get(customId);
  }, []);
  
  const getFootnoteById = useCallback((id: number): FootnoteData | undefined => {
    const content = contentMapRef.current.get(id);
    if (!content) return undefined;
    return { id, content };
  }, []);

  return (
    <FootnoteContext.Provider value={{ footnotes, registerFootnote, getFootnoteIdByCustomId, getFootnoteById }}>
      {children}
    </FootnoteContext.Provider>
  );
}

// Context Hook
function useFootnoteContext() {
  const context = useContext(FootnoteContext);
  if (!context) {
    throw new Error('Footnote components must be used within FootnoteProvider');
  }
  return context;
}

// Footnote Props
interface FootnoteProps {
  children?: React.ReactNode;
  id?: string;
  refId?: string;
}

/**
 * Footnote: 본문에서 각주 참조를 표시하는 컴포넌트
 * 
 * 기본 사용법: <Footnote>각주 내용</Footnote>
 * ID 지정: <Footnote id="react-docs">React 공식 문서</Footnote>
 * 재사용: <Footnote refId="react-docs" />
 */
export function Footnote({ children, id: customId, refId }: FootnoteProps) {
  const { registerFootnote, getFootnoteIdByCustomId, getFootnoteById } = useFootnoteContext();
  const idRef = useRef<number | null>(null);
  const [numericId, setNumericId] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ 
    top: number; 
    left: number; 
    transform: string;
    arrowPosition: 'top' | 'bottom' | 'left' | 'right';
    arrowOffset: number;
  } | null>(null);
  const hasRegistered = useRef(false);
  const normalizedChildren = normalizeFootnoteContent(children);
  const [content, setContent] = useState<React.ReactNode>(normalizedChildren);
  const footnoteRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // 이미 등록된 경우 스킵 (strict mode에서 두 번 실행 방지)
    if (hasRegistered.current) {
      return;
    }
    
    hasRegistered.current = true;
    
    // refId로 기존 각주 참조
    if (refId) {
      const existingId = getFootnoteIdByCustomId(refId);
      if (existingId) {
        const existingFootnote = getFootnoteById(existingId);
        if (existingFootnote) {
          idRef.current = existingFootnote.id;
          setNumericId(existingFootnote.id);
          setContent(existingFootnote.content);
          return;
        }
      }
      console.warn(`Footnote with id "${refId}" not found. Make sure it's defined before referencing.`);
      return;
    }
    
    // 새 각주 등록
    const footnoteId = registerFootnote(normalizedChildren, customId);
    idRef.current = footnoteId;
    setNumericId(footnoteId);
    setContent(normalizedChildren);
  }, [registerFootnote, getFootnoteIdByCustomId, getFootnoteById, normalizedChildren, customId, refId]);

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (footnoteRef.current) {
        const rect = footnoteRef.current.getBoundingClientRect();
        const tooltipWidth = 256; // w-64 = 256px
        const tooltipHeight = 100; // 예상 높이 (실제로는 동적)
        const margin = 8;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 기본: 요소 위 중앙
        let top = rect.top - margin;
        let left = rect.left + rect.width / 2;
        let transform = 'translate(-50%, -100%)';
        let arrowPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
        let arrowOffset = 0;
        const elementCenterY = rect.top + rect.height / 2;
        const elementCenterX = rect.left + rect.width / 2;
        
        // 위로 벗어나는지 확인
        if (top - tooltipHeight < 0) {
          // 아래에 표시
          top = rect.bottom + margin;
          left = elementCenterX;
          transform = 'translateX(-50%)';
          arrowPosition = 'top';
          arrowOffset = 0; // 중앙 정렬이므로 offset 불필요
        } else {
          // 왼쪽으로 벗어나는지 확인
          const leftEdge = left - tooltipWidth / 2;
          if (leftEdge < margin) {
            // 오른쪽에 표시
            left = rect.right + margin;
            top = elementCenterY;
            transform = 'translateY(-50%)';
            arrowPosition = 'left';
            arrowOffset = 0; // 중앙 정렬이므로 offset 불필요
          } else {
            // 오른쪽으로 벗어나는지 확인
            const rightEdge = left + tooltipWidth / 2;
            if (rightEdge > viewportWidth - margin) {
              // 왼쪽에 표시
              left = rect.left - margin;
              top = elementCenterY;
              transform = 'translate(-100%, -50%)';
              arrowPosition = 'right';
              arrowOffset = 0; // 중앙 정렬이므로 offset 불필요
            } else {
              // 기본: 위에 표시
              arrowPosition = 'bottom';
              arrowOffset = 0; // 중앙 정렬이므로 offset 불필요
            }
          }
        }
        
        setTooltipPosition({
          top,
          left,
          transform,
          arrowPosition,
          arrowOffset,
        });
      }
    };

    if (showTooltip) {
      // 즉시 위치 계산
      updateTooltipPosition();
      // 다음 프레임에서도 한 번 더 계산 (레이아웃이 안정화된 후)
      requestAnimationFrame(() => {
        updateTooltipPosition();
      });
      window.addEventListener('scroll', updateTooltipPosition, true);
      window.addEventListener('resize', updateTooltipPosition);
    } else {
      setTooltipPosition(null);
    }

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [showTooltip]);

  // 본문 참조 하이라이트
  const isRefHighlighted = useHashHighlight(`footnote-ref-${numericId}`, 2000);

  if (numericId === null) {
    return null;
  }

  return (
    <>
      <span
        ref={footnoteRef}
        className={[
          // 레이아웃
          "relative",
          "inline-block",
          // 하이라이트 트랜지션
          "transition-all duration-500",
          "rounded-sm px-1 -mx-1",
          // 하이라이트 효과 (노란색 형광펜 스타일)
          isRefHighlighted 
            ? "bg-yellow-200/70 dark:bg-yellow-500/30" 
            : ""
        ].filter(Boolean).join(" ")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <sup
          className="
            ml-0.5
            cursor-pointer
            text-blue-600 dark:text-blue-400
            hover:text-blue-800 dark:hover:text-blue-300
            transition-colors
          "
        >
          <a
            href={`#footnote-${numericId}`}
            id={`footnote-ref-${numericId}`}
            aria-describedby={`footnote-${numericId}`}
            className="
              no-underline
              font-medium
              scroll-mt-[35vh]
            "
          >
            [{numericId}]
          </a>
        </sup>
      </span>
      
      {/* Tooltip - Portal로 body에 렌더링 */}
      {showTooltip && typeof window !== 'undefined' && createPortal(
        <div
          role="tooltip"
          className="
            fixed z-[100]
            w-64 max-w-[calc(100vw-2rem)]
            px-3 py-2
            text-sm leading-relaxed
            rounded-lg shadow-lg
            pointer-events-none
            bg-zinc-900 text-zinc-100
            dark:bg-zinc-100 dark:text-zinc-900
            border border-zinc-700 dark:border-zinc-300
            whitespace-normal
            break-words
          "
          style={tooltipPosition ? {
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: tooltipPosition.transform,
          } : {
            visibility: 'hidden',
          }}
        >
          {/* Tooltip 화살표 */}
          {tooltipPosition && (
            <span
              className={
                tooltipPosition.arrowPosition === 'bottom'
                  ? "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-zinc-900 dark:border-t-zinc-100"
                  : tooltipPosition.arrowPosition === 'top'
                  ? "absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-zinc-900 dark:border-b-zinc-100"
                  : tooltipPosition.arrowPosition === 'left'
                  ? "absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-zinc-900 dark:border-r-zinc-100"
                  : "absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-zinc-900 dark:border-l-zinc-100"
              }
              style={
                (tooltipPosition.arrowPosition === 'left' || tooltipPosition.arrowPosition === 'right')
                  ? { top: `calc(50% + ${tooltipPosition.arrowOffset}px)` }
                  : (tooltipPosition.arrowPosition === 'top' || tooltipPosition.arrowPosition === 'bottom')
                  ? { left: `calc(50% + ${tooltipPosition.arrowOffset}px)` }
                  : undefined
              }
            />
          )}
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

/**
 * FootnoteItem: 개별 각주 아이템 컴포넌트
 */
function FootnoteItem({ footnote }: { footnote: FootnoteData }) {
  // 각주 하이라이트
  const isHighlighted = useHashHighlight(`footnote-${footnote.id}`, 2000);

  // 하이라이트 스타일 (노란색 형광펜)
  const highlightClass = isHighlighted
    ? "bg-yellow-200/70 dark:bg-yellow-500/30 transition-all duration-500 rounded-sm px-0.5 -mx-0.5"
    : "transition-all duration-500";

  return (
    <li
      id={`footnote-${footnote.id}`}
      className="
        flex gap-2
        leading-relaxed
        scroll-mt-[35vh]
      "
    >
      {/* 각주 번호 */}
      <span
        className={[
          "flex-shrink-0",
          "font-medium",
          "text-blue-600 dark:text-blue-400",
          highlightClass
        ].join(" ")}
      >
        {footnote.id}.
      </span>
      
      {/* 각주 내용 */}
      <span 
        className={[
          "flex-1",
          "min-w-0",
          "whitespace-normal",
          "break-words",
          highlightClass
        ].join(" ")}
      >
        {footnote.content}
        {/* 본문으로 돌아가기 링크 */}
        <a
          href={`#footnote-ref-${footnote.id}`}
          aria-label="본문으로 돌아가기"
          className="
            ml-2
            text-blue-600 dark:text-blue-400
            hover:text-blue-800 dark:hover:text-blue-300
            no-underline
            transition-colors
          "
        >
          ↩
        </a>
      </span>
    </li>
  );
}

/**
 * Footnotes: 모든 각주를 하단에 표시하는 컴포넌트
 * 글의 맨 아래에 배치하여 사용합니다
 * 사용법: <Footnotes />
 */
export function Footnotes() {
  const { footnotes } = useFootnoteContext();

  // 각주가 없으면 아무것도 렌더링하지 않음
  if (footnotes.length === 0) {
    return null;
  }

  return (
    <div
      className="
        mt-12 pt-8
        border-t
        border-zinc-200 dark:border-zinc-800
      "
    >
      {/* 제목 */}
      <h2
        className="
          mb-6
          text-xl font-bold
          text-zinc-900 dark:text-zinc-50
          text-balance
          break-keep
        "
      >
        참고 및 주석
      </h2>
      
      {/* 각주 목록 */}
      <ol
        className="
          space-y-4
          text-sm
          text-zinc-700 dark:text-zinc-400
        "
      >
        {footnotes.map((footnote) => (
          <FootnoteItem key={footnote.id} footnote={footnote} />
        ))}
      </ol>
    </div>
  );
}

