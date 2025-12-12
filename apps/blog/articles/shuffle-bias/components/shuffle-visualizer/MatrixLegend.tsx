'use client';

import React from 'react';
import { cn } from '../../../../lib/utils';

export function MatrixLegend() {
  return (
    <div
      className={cn(
        /* Layout */
        'w-full flex flex-wrap items-center justify-start gap-x-4 gap-y-1 text-xs',
        /* Color */
        'text-zinc-600',
        /* Dark */
        'dark:text-zinc-400',
      )}
    >
      <span
        className={cn(
          /* Layout */
          'inline-flex items-start gap-2',
        )}
      >
        <span
          className={cn(
            /* Layout */
            'w-3 h-3 rounded-[2px]',
          )}
          style={{ backgroundColor: '#e66101' }}
        />
        <span
          className={cn(
            /* Typography */
            'leading-4',
          )}
        >
          자주 등장 (Positive Bias)
        </span>
      </span>

      <span
        className={cn(
          /* Layout */
          'inline-flex items-start gap-2',
        )}
      >
        <span
          className={cn(
            /* Layout */
            'w-3 h-3 rounded-[2px] bg-white border border-zinc-200',
            /* Dark */
            'dark:bg-zinc-900 dark:border-zinc-700',
          )}
        />
        <span
          className={cn(
            /* Typography */
            'leading-4',
          )}
        >
          기대치 (Unbiased)
        </span>
      </span>

      <span
        className={cn(
          /* Layout */
          'inline-flex items-start gap-2',
        )}
      >
        <span
          className={cn(
            /* Layout */
            'w-3 h-3 rounded-[2px]',
          )}
          style={{ backgroundColor: '#5e3c99' }}
        />
        <span
          className={cn(
            /* Typography */
            'leading-4',
          )}
        >
          드물게 등장 (Negative Bias)
        </span>
      </span>
    </div>
  );
}


