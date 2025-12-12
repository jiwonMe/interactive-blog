'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export type ShuffleControlsAlgorithm = {
  id: string;
  name: string;
};

export type ShuffleControlsProps = {
  algorithms: ShuffleControlsAlgorithm[];
  selectedAlgoId: string;
  onSelectAlgoId: (id: string) => void;
  hideAlgorithmSelect?: boolean;

  algoDescription: string;
  hideDescription?: boolean;
  afterDescription?: React.ReactNode;

  beforeStats?: React.ReactNode;
  beforeActions?: React.ReactNode;

  canRun: boolean;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;

  totalTrials: number;
  expectedPerCell?: number;

  biasSummaryText?: {
    minRatio: string;
    maxRatio: string;
    chiSquare: string;
    hottestCell: string;
  } | null;

  statusText?: string;
  errorText?: string | null;
};

export function ShuffleControls({
  algorithms,
  selectedAlgoId,
  onSelectAlgoId,
  hideAlgorithmSelect = false,
  algoDescription,
  hideDescription = false,
  afterDescription,
  beforeStats,
  beforeActions,
  canRun,
  isRunning,
  onToggleRunning,
  onReset,
  totalTrials,
  expectedPerCell,
  biasSummaryText,
  statusText,
  errorText,
}: ShuffleControlsProps) {
  return (
    <div
      className={cn(
        /* Layout */
        'flex flex-col gap-4 w-full',
      )}
    >
      <div
        className={cn(
          /* Layout */
          'space-y-3',
        )}
      >
        {!hideAlgorithmSelect && (
          <div
            className={cn(
              /* Layout */
              'flex items-center justify-between gap-3',
            )}
          >
            <h3
              className={cn(
                /* Typography */
                'text-sm font-semibold',
                /* Color */
                'text-zinc-600 dark:text-zinc-400',
              )}
            >
              알고리즘
            </h3>

            <Select.Root value={selectedAlgoId} onValueChange={onSelectAlgoId}>
            <Select.Trigger
              aria-label="셔플 알고리즘 선택"
              className={cn(
                /* Layout */
                'inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md border min-w-[220px]',
                /* Typography */
                'text-sm font-medium',
                /* Color */
                'bg-white border-zinc-200 text-zinc-900',
                /* Hover */
                'hover:bg-zinc-50',
                /* Focus */
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
                /* Dark */
                'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800',
                /* Dark focus */
                'dark:focus-visible:ring-zinc-600',
              )}
            >
              <Select.Value />
              <Select.Icon
                className={cn(
                  /* Color */
                  'text-zinc-500 dark:text-zinc-400',
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={6}
                className={cn(
                  /* Layout */
                  'z-50 overflow-hidden rounded-md border shadow-md',
                  /* Color */
                  'bg-white border-zinc-200',
                  /* Dark */
                  'dark:bg-zinc-900 dark:border-zinc-700',
                )}
              >
                <Select.Viewport
                  className={cn(
                    /* Layout */
                    'p-1',
                  )}
                >
                  {algorithms.map((algo) => (
                    <Select.Item
                      key={algo.id}
                      value={algo.id}
                      className={cn(
                        /* Layout */
                        'relative flex items-center gap-2 select-none rounded px-2 py-2',
                        /* Typography */
                        'text-sm',
                        /* Color */
                        'text-zinc-900',
                        /* Interaction */
                        'cursor-pointer outline-none',
                        /* Hover */
                        'data-[highlighted]:bg-zinc-100',
                        /* Dark */
                        'dark:text-zinc-100 dark:data-[highlighted]:bg-zinc-800',
                      )}
                    >
                      <Select.ItemIndicator
                        className={cn(
                          /* Layout */
                          'inline-flex w-4',
                          /* Color */
                          'text-zinc-700 dark:text-zinc-200',
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </Select.ItemIndicator>
                      <Select.ItemText>{algo.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          </div>
        )}

        {!hideDescription && (
          <p
            className={cn(
              /* Layout */
              'text-sm leading-relaxed p-3 rounded-md border',
              /* Color */
              'bg-zinc-50 border-zinc-200 text-zinc-700',
              /* Dark */
              'dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-300',
            )}
          >
            {algoDescription}
          </p>
        )}
      </div>

      {afterDescription}

      {beforeStats}

      <section
        aria-label="통계"
        className={cn(
          /* Layout */
          'p-3 rounded-md border',
          /* Color */
          'bg-zinc-100 border-zinc-200 text-zinc-500',
          /* Dark */
          'dark:bg-zinc-900/70 dark:border-zinc-800 dark:text-zinc-500',
        )}
      >
        <div
          className={cn(
            /* Layout */
            'flex items-center gap-2',
            /* Typography */
            'text-[11px] leading-5',
            /* One line */
            'whitespace-nowrap',
          )}
        >
          <span>
            총 시도 횟수:{' '}
            <span
              className={cn(
                /* Typography */
                'font-mono',
                /* Color */
                'text-zinc-500 dark:text-zinc-400',
              )}
            >
              {totalTrials.toLocaleString()}
            </span>
          </span>

          {statusText && (
            <span
              className={cn(
                /* Layout */
                'inline-flex items-center gap-2',
              )}
            >
              <span aria-hidden>·</span>
              <span>{statusText}</span>
            </span>
          )}
        </div>

        {errorText && (
          <p
            role="alert"
            className={cn(
              /* Typography */
              'text-[11px] leading-5',
              /* Color */
              'text-red-600 dark:text-red-400',
              /* Layout */
              'mt-2',
            )}
          >
            {errorText}
          </p>
        )}
      </section>

      {beforeActions && (
        <div
          className={cn(
            /* Layout */
            'pt-2',
          )}
        >
          {beforeActions}
        </div>
      )}

      <section
        aria-label="실행"
        className={cn(
          /* Layout */
          'flex flex-wrap gap-3 mt-2',
        )}
      >
        <button
          type="button"
          onClick={onToggleRunning}
          disabled={!canRun}
          className={cn(
            /* Layout */
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            /* Primary */
            'bg-zinc-900 text-white hover:bg-zinc-700',
            /* Disabled */
            'disabled:opacity-50 disabled:cursor-not-allowed',
            /* Dark */
            'dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300',
          )}
        >
          {isRunning ? '일시 정지' : '시뮬레이션 시작'}
        </button>

        <button
          type="button"
          onClick={onReset}
          className={cn(
            /* Layout */
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            /* Secondary */
            'bg-zinc-200 text-zinc-900 hover:bg-zinc-300',
            /* Dark */
            'dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
          )}
        >
          리셋
        </button>
      </section>
    </div>
  );
}


