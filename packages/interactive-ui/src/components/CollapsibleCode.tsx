'use client';

import React, { useState } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CollapsibleCodeProps {
  /** 접힌 상태에서 보여줄 제목 */
  title: string;
  /** 코드 블록 children (rehype-pretty-code가 생성한 figure > pre 구조) */
  children: React.ReactNode;
  /** 기본 열림 상태 */
  defaultOpen?: boolean;
}

export const CollapsibleCode = ({
  title,
  children,
  defaultOpen = false,
}: CollapsibleCodeProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        // layout
        'my-6 rounded-lg overflow-hidden',
        // border
        'border',
        // color
        'border-zinc-200 dark:border-zinc-800',
        'bg-zinc-50 dark:bg-zinc-900'
      )}
    >
      {/* Header - 클릭 가능한 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          // layout
          'w-full px-4 py-3 flex items-center justify-between gap-3',
          // typography
          'text-left text-sm font-medium',
          // color
          'text-zinc-700 dark:text-zinc-300',
          // hover
          'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
          // transition
          'transition-colors duration-150'
        )}
      >
        <div className="flex items-center gap-2">
          {/* Code icon */}
          <svg
            className={cn(
              // size
              'w-4 h-4',
              // color
              'text-zinc-500 dark:text-zinc-400'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span>{title}</span>
        </div>

        {/* Chevron icon */}
        <svg
          className={cn(
            // size
            'w-4 h-4',
            // color
            'text-zinc-500 dark:text-zinc-400',
            // transition
            'transition-transform duration-200',
            // rotation
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content - 코드 블록 영역 (CSS Grid 애니메이션 사용) */}
      <div
        className={cn(
          // CSS Grid 기반 애니메이션 (콘텐츠 높이에 상관없이 동작)
          'grid transition-all duration-300 ease-in-out',
          // conditional grid rows
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              // border top
              'border-t',
              // color
              'border-zinc-200 dark:border-zinc-800'
            )}
          >
            {/* 
              rehype-pretty-code가 생성한 구조: figure[data-rehype-pretty-code-figure] > pre > code
              - figure의 margin 제거
              - pre의 margin, border, rounded 제거
            */}
            <div
              className={cn(
                // figure 스타일 초기화 (rehype-pretty-code가 생성)
                '[&>figure]:my-0',
                // figure 내부 pre 스타일 초기화
                '[&>figure>pre]:my-0',
                '[&>figure>pre]:rounded-none',
                '[&>figure>pre]:border-0',
                // fallback: 직접 pre가 children인 경우
                '[&>pre]:my-0',
                '[&>pre]:rounded-none',
                '[&>pre]:border-0',
                // CodeBlock wrapper 스타일 초기화
                '[&>div]:mb-0',
                '[&>div>pre]:my-0',
                '[&>div>pre]:rounded-none',
                '[&>div>pre]:border-0'
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



