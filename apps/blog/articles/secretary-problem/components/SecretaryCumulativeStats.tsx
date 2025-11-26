'use client';

import React from 'react';
import type { CumulativeStats } from '../lib/secretary-types';

interface SecretaryCumulativeStatsProps {
  stats: CumulativeStats;
}

/**
 * 누적 통계 표시 컴포넌트
 */
export function SecretaryCumulativeStats({ stats }: SecretaryCumulativeStatsProps) {
  if (stats.totalRuns === 0) return null;

  return (
    <div
      className="
        /* 레이아웃 */
        p-6 rounded-xl
        /* 배경 */
        bg-gradient-to-br from-blue-50 to-indigo-50 
        dark:from-blue-950/30 dark:to-indigo-950/30
        /* 테두리 */
        border border-blue-200 dark:border-blue-900
      "
    >
      <h3
        className="
          /* 레이아웃 */
          flex items-center gap-2 mb-4
          /* 텍스트 */
          text-lg font-bold text-zinc-900 dark:text-zinc-100
        "
      >
        📊 누적 통계
        <span
          className="
            /* 텍스트 */
            text-sm font-normal text-zinc-500 dark:text-zinc-400
          "
        >
          ({stats.totalRuns}회 실행)
        </span>
      </h3>

      <div
        className="
          /* 레이아웃 */
          grid grid-cols-2 md:grid-cols-3 gap-4
          /* 텍스트 */
          text-sm
        "
      >
        {/* 최적 선택 성공률 */}
        <div
          className="
            /* 레이아웃 */
            p-4 rounded-lg
            /* 배경 */
            bg-white/80 dark:bg-zinc-900/80
          "
        >
          <div
            className="
              /* 텍스트 */
              text-zinc-500 dark:text-zinc-400 mb-1 text-xs
            "
          >
            최적 선택 성공률
            <span
              className="
                /* 레이아웃 */
                block mt-0.5
                /* 텍스트 */
                text-[10px] opacity-70
              "
            >
              (전체 중 최고 선택)
            </span>
          </div>
          <div
            className="
              /* 텍스트 */
              text-2xl font-bold text-green-600 dark:text-green-400
            "
          >
            {stats.successRate.toFixed(1)}%
          </div>
        </div>

        {/* Top 1% 달성률 */}
        <div
          className="
            /* 레이아웃 */
            p-4 rounded-lg
            /* 배경 */
            bg-white/80 dark:bg-zinc-900/80
          "
        >
          <div
            className="
              /* 텍스트 */
              text-zinc-500 dark:text-zinc-400 mb-1
            "
          >
            Top 1% 달성률
          </div>
          <div
            className="
              /* 텍스트 */
              text-2xl font-bold text-red-600 dark:text-red-400
            "
          >
            {stats.top1Rate.toFixed(1)}%
          </div>
        </div>

        {/* Top 5% 달성률 */}
        <div
          className="
            /* 레이아웃 */
            p-4 rounded-lg
            /* 배경 */
            bg-white/80 dark:bg-zinc-900/80
          "
        >
          <div
            className="
              /* 텍스트 */
              text-zinc-500 dark:text-zinc-400 mb-1
            "
          >
            Top 5% 달성률
          </div>
          <div
            className="
              /* 텍스트 */
              text-2xl font-bold text-orange-600 dark:text-orange-400
            "
          >
            {stats.top5Rate.toFixed(1)}%
          </div>
        </div>

        {/* Top 10% 달성률 */}
        <div
          className="
            /* 레이아웃 */
            p-4 rounded-lg
            /* 배경 */
            bg-white/80 dark:bg-zinc-900/80
          "
        >
          <div
            className="
              /* 텍스트 */
              text-zinc-500 dark:text-zinc-400 mb-1
            "
          >
            Top 10% 달성률
          </div>
          <div
            className="
              /* 텍스트 */
              text-2xl font-bold text-amber-600 dark:text-amber-400
            "
          >
            {stats.top10Rate.toFixed(1)}%
          </div>
        </div>

        {/* 평균 선택 등급 */}
        <div
          className="
            /* 레이아웃 */
            p-4 rounded-lg col-span-2 md:col-span-2
            /* 배경 */
            bg-white/80 dark:bg-zinc-900/80
          "
        >
          <div
            className="
              /* 텍스트 */
              text-zinc-500 dark:text-zinc-400 mb-1
            "
          >
            평균 선택 등급
          </div>
          <div
            className="
              /* 텍스트 */
              text-2xl font-bold text-zinc-900 dark:text-zinc-100
            "
          >
            상위 {stats.avgPercentile.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

