'use client';

import React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HighlightProps {
  // 자식 요소
  children: React.ReactNode;
}

export const Highlight = ({ children }: HighlightProps) => {
  return (
    <mark
      className={cn(
        // layout - 인라인 요소
        'px-0.5 rounded-sm',
        // 기본 mark 스타일 제거
        'decoration-clone',
        // 텍스트 색상 유지
        'text-inherit',
        // dashed underline (노란색)
        'border-b border-dashed border-yellow-500 dark:border-yellow-400',
        // background (노란색 형광)
        'bg-yellow-200/60 dark:bg-yellow-500/30',
        // code 태그 내부에서도 보이도록 배경색 강제 적용
        '[&_code]:bg-yellow-200/80 [&_code]:dark:bg-yellow-600/40',
        // code 태그 테두리도 조정
        '[&_code]:border-yellow-400 [&_code]:dark:border-yellow-500'
      )}
    >
      {children}
    </mark>
  );
};





