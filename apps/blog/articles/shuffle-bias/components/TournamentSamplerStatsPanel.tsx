'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import { CycleRatioChart, type CycleRatioPoint } from './CycleRatioChart';

type TournamentSamplerStatsPanelProps = {
  total: number;
  cycles: number;
  cycleRatio: number;
  points: CycleRatioPoint[];
  onSampleOnce: () => void;
  onSampleMany: (n: number) => void;
  onReset: () => void;
};

export function TournamentSamplerStatsPanel({
  total,
  cycles,
  cycleRatio,
  points,
  onSampleOnce,
  onSampleMany,
  onReset,
}: TournamentSamplerStatsPanelProps) {
  return (
    <div
      className={cn(
        /* Layout */
        'flex flex-col gap-3',
      )}
    >
      <div
        className={cn(
          /* Layout */
          'rounded-lg p-3',
          /* Surface */
          'bg-white/70 text-zinc-800',
          /* Dark */
          'dark:bg-zinc-950/40 dark:text-zinc-200',
        )}
      >
        <div
          className={cn(
            /* Typography */
            'text-xs',
            /* Opacity */
            'opacity-80',
          )}
        >
          누적 통계
        </div>

        <div
          className={cn(
            /* Layout */
            'mt-1',
            /* Typography */
            'text-sm',
          )}
        >
          총 샘플:{' '}
          <span
            className={cn(
              /* Typography */
              'font-semibold',
              /* Numbers */
              'tabular-nums',
            )}
          >
            {total.toLocaleString()}
          </span>
        </div>

        <div
          className={cn(
            /* Layout */
            'mt-1',
            /* Typography */
            'text-sm',
          )}
        >
          사이클:{' '}
          <span
            className={cn(
              /* Typography */
              'font-semibold',
              /* Numbers */
              'tabular-nums',
            )}
          >
            {cycles.toLocaleString()}
          </span>
        </div>

        <div
          className={cn(
            /* Layout */
            'mt-1',
            /* Typography */
            'text-sm',
          )}
        >
          비율:{' '}
          <span
            className={cn(
              /* Typography */
              'font-semibold',
              /* Numbers */
              'tabular-nums',
            )}
          >
            {cycleRatio.toFixed(3)}
          </span>
          <span
            className={cn(
              /* Opacity */
              'opacity-70',
            )}
          >
            {' '}
            (이론값 0.250)
          </span>
        </div>

        <div
          className={cn(
            /* Layout */
            'mt-3',
          )}
        >
          <CycleRatioChart points={points} />
        </div>
      </div>

      <div
        className={cn(
          /* Layout */
          'grid grid-cols-2 gap-2',
        )}
      >
        <button
          type="button"
          onClick={onSampleOnce}
          className={cn(
            /* Layout */
            'px-3 py-2 rounded-lg border text-sm font-medium',
            /* Color */
            'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50',
            /* Dark */
            'dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900',
          )}
        >
          1번 샘플
        </button>

        <button
          type="button"
          onClick={() => onSampleMany(100)}
          className={cn(
            /* Layout */
            'px-3 py-2 rounded-lg border text-sm font-medium',
            /* Color */
            'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50',
            /* Dark */
            'dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900',
          )}
        >
          100번 샘플
        </button>

        <button
          type="button"
          onClick={onReset}
          className={cn(
            /* Layout */
            'px-3 py-2 rounded-lg border text-sm font-medium col-span-2',
            /* Color */
            'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800',
            /* Dark */
            'dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
          )}
        >
          리셋
        </button>
      </div>

      <div
        className={cn(
          /* Layout */
          'text-xs leading-5',
          /* Color */
          'text-zinc-600 dark:text-zinc-400',
        )}
      >
        각 버튼은 $(a,b)$, $(b,c)$, $(a,c)$ 비교 방향을 무작위로 정해 토너먼트를 만든다. 세 비교는 독립인 동전 던지기처럼 동작하므로,
        8가지 중 2가지만 사이클 → 이론적으로 $\frac{1}{4}$가 된다.
      </div>
    </div>
  );
}


