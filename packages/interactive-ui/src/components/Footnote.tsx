'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

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
  const [copied, setCopied] = useState(false);
  const hasRegistered = useRef(false);
  const [content, setContent] = useState<React.ReactNode>(children);

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
    const footnoteId = registerFootnote(children, customId);
    idRef.current = footnoteId;
    setNumericId(footnoteId);
    setContent(children);
  }, [registerFootnote, getFootnoteIdByCustomId, getFootnoteById, children, customId, refId]);

  // 딥링크 복사 핸들러
  const handleCopyLink = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (numericId === null) return;
    
    const url = `${window.location.origin}${window.location.pathname}#footnote-${numericId}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  }, [numericId]);

  if (numericId === null) {
    return null;
  }

  return (
    <span
      className="
        relative
        inline-block
      "
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
          "
        >
          [{numericId}]
        </a>
      </sup>
      
      {/* 딥링크 복사 버튼 */}
      <button
        onClick={handleCopyLink}
        aria-label="각주 링크 복사"
        className="
          ml-1
          inline-flex
          items-center
          justify-center
          w-3.5 h-3.5
          text-[10px]
          opacity-0 hover:opacity-100
          transition-opacity
          text-zinc-500 dark:text-zinc-400
          hover:text-blue-600 dark:hover:text-blue-400
          cursor-pointer
          align-super
        "
        style={{ verticalAlign: 'super' }}
      >
        {copied ? '✓' : '🔗'}
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <span
          role="tooltip"
          className="
            absolute z-50
            left-0 bottom-full mb-2
            w-64 max-w-xs
            px-3 py-2
            text-sm leading-relaxed
            rounded-lg shadow-lg
            pointer-events-none
            bg-zinc-900 text-zinc-100
            dark:bg-zinc-100 dark:text-zinc-900
            border border-zinc-700 dark:border-zinc-300
          "
        >
          {/* Tooltip 화살표 */}
          <span
            className="
              absolute top-full left-2
              w-0 h-0
              border-l-4 border-l-transparent
              border-r-4 border-r-transparent
              border-t-4 border-t-zinc-900
              dark:border-t-zinc-100
            "
          />
          {content}
        </span>
      )}
      
      {/* 복사 완료 피드백 */}
      {copied && (
        <span
          className="
            absolute z-50
            left-0 -top-8
            px-2 py-1
            text-xs
            rounded
            bg-green-600 text-white
            dark:bg-green-500 dark:text-zinc-900
            whitespace-nowrap
            animate-fade-in
          "
        >
          링크 복사됨!
        </span>
      )}
    </span>
  );
}

/**
 * FootnoteItem: 개별 각주 아이템 컴포넌트
 */
function FootnoteItem({ footnote }: { footnote: FootnoteData }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#footnote-${footnote.id}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  }, [footnote.id]);

  return (
    <li
      id={`footnote-${footnote.id}`}
      className="
        flex gap-2
        leading-relaxed
        group
      "
    >
      {/* 각주 번호 */}
      <span
        className="
          flex-shrink-0
          font-medium
          text-blue-600 dark:text-blue-400
        "
      >
        {footnote.id}.
      </span>
      
      {/* 각주 내용 */}
      <div className="flex-1">
        {footnote.content}
        
        {/* 액션 버튼들 */}
        <span className="inline-flex items-center gap-1 ml-2">
          {/* 본문으로 돌아가기 링크 */}
          <a
            href={`#footnote-ref-${footnote.id}`}
            aria-label="본문으로 돌아가기"
            className="
              text-blue-600 dark:text-blue-400
              hover:text-blue-800 dark:hover:text-blue-300
              no-underline
              transition-colors
            "
          >
            ↩
          </a>
          
          {/* 딥링크 복사 버튼 */}
          <button
            onClick={handleCopyLink}
            aria-label="각주 링크 복사"
            className="
              relative
              inline-flex
              items-center
              text-xs
              opacity-0 group-hover:opacity-100
              transition-opacity
              text-zinc-500 dark:text-zinc-400
              hover:text-blue-600 dark:hover:text-blue-400
              cursor-pointer
            "
          >
            {copied ? '✓' : '🔗'}
            
            {/* 복사 완료 피드백 */}
            {copied && (
              <span
                className="
                  absolute
                  left-0 -top-6
                  px-2 py-1
                  text-xs
                  rounded
                  bg-green-600 text-white
                  dark:bg-green-500 dark:text-zinc-900
                  whitespace-nowrap
                "
              >
                링크 복사됨!
              </span>
            )}
          </button>
        </span>
      </div>
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

