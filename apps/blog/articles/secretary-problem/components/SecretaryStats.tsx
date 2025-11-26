'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import type { RankBadge } from '../lib/secretary-types';

interface SecretaryStatsProps {
  threshold: number;
  observeCount: number;
  selectedIndex: number | null;
  rankBadge: RankBadge;
  isOptimal: boolean;
}

/**
 * 현재 선택 결과 통계 표시 컴포넌트
 */
export function SecretaryStats({
  threshold,
  observeCount,
  selectedIndex,
  rankBadge,
  isOptimal,
}: SecretaryStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
      {/* 관찰 비율 */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="text-zinc-500 dark:text-zinc-400 mb-1">관찰 비율</div>
        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {(threshold * 100).toFixed(1)}%
        </div>
      </div>
      
      {/* 관찰 인원 */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="text-zinc-500 dark:text-zinc-400 mb-1">관찰 인원</div>
        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {observeCount}명
        </div>
      </div>
      
      {/* 선택 결과 */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="text-zinc-500 dark:text-zinc-400 mb-1">선택 결과</div>
        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {selectedIndex !== null ? `${selectedIndex + 1}번` : '선택 실패'}
        </div>
      </div>
      
      {/* 선택 등급 */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="text-zinc-500 dark:text-zinc-400 mb-1">선택 등급</div>
        <div className={cn(
          "text-lg font-bold",
          rankBadge.color
        )}>
          {rankBadge.text}
        </div>
      </div>
      
      {/* 최적 선택 */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="text-zinc-500 dark:text-zinc-400 mb-1 text-xs">
          최적 선택
          <span className="block text-[10px] mt-0.5 opacity-70">(전체 중 최고)</span>
        </div>
        <div className={cn(
          "text-lg font-bold",
          isOptimal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )}>
          {isOptimal ? '성공 ✓' : '실패 ✗'}
        </div>
      </div>
    </div>
  );
}

