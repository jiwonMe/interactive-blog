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
  /** 코드 블록 children (pre 태그가 들어옴) */
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

      {/* Content - 코드 블록 영역 */}
      <div
        className={cn(
          // animation
          'overflow-hidden transition-all duration-300 ease-in-out',
          // conditional height
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div
          className={cn(
            // border top
            'border-t',
            // color
            'border-zinc-200 dark:border-zinc-800'
          )}
        >
          {/* 
            children으로 들어오는 pre 태그의 margin을 제거하기 위해 
            [&>pre]:my-0 클래스 적용 
          */}
          <div className="[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:border-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};



