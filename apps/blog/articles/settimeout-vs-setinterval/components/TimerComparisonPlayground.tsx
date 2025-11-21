'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

type ExecutionRecord = {
  id: number;
  method: string;
  timestamp: number;
  color: string;
};

/**
 * setTimeout, setInterval, requestAnimationFrame을 실시간으로 비교하는 플레이그라운드
 */
export function TimerComparisonPlayground() {
  const [records, setRecords] = React.useState<ExecutionRecord[]>([]);
  const [intervalMs, setIntervalMs] = React.useState(100);
  const [enableSetTimeout, setEnableSetTimeout] = React.useState(false);
  const [enableSetInterval, setEnableSetInterval] = React.useState(false);
  const [enableRAF, setEnableRAF] = React.useState(false);

  const counterRef = React.useRef(0);
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalIdRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rafIdRef = React.useRef<number | null>(null);
  const rafLastRef = React.useRef<number>(0);

  // 기록 추가
  const addRecord = React.useCallback((method: string, color: string) => {
    const record: ExecutionRecord = {
      id: ++counterRef.current,
      method,
      timestamp: performance.now(),
      color,
    };
    setRecords((prev) => [record, ...prev.slice(0, 49)]);
  }, []);

  // setTimeout (재귀)
  const runSetTimeout = React.useCallback(() => {
    addRecord('setTimeout', '#3b82f6');
    timeoutIdRef.current = setTimeout(() => {
      if (enableSetTimeout) {
        runSetTimeout();
      }
    }, intervalMs);
  }, [intervalMs, enableSetTimeout, addRecord]);

  // setInterval
  React.useEffect(() => {
    if (enableSetInterval) {
      intervalIdRef.current = setInterval(() => {
        addRecord('setInterval', '#10b981');
      }, intervalMs);
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [enableSetInterval, intervalMs, addRecord]);

  // requestAnimationFrame
  const runRAF = React.useCallback((now: number) => {
    if (!enableRAF) return;
    if (rafLastRef.current === 0) {
      rafLastRef.current = now;
    }
    const elapsed = now - rafLastRef.current;
    if (elapsed >= intervalMs) {
      addRecord('rAF', '#f59e0b');
      rafLastRef.current = now;
    }
    rafIdRef.current = requestAnimationFrame(runRAF);
  }, [enableRAF, intervalMs, addRecord]);

  React.useEffect(() => {
    if (enableRAF) {
      rafLastRef.current = 0;
      rafIdRef.current = requestAnimationFrame(runRAF);
    } else {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enableRAF, runRAF]);

  // setTimeout 시작/중지
  React.useEffect(() => {
    if (enableSetTimeout) {
      runSetTimeout();
    } else {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [enableSetTimeout, runSetTimeout]);

  // 간격 변경 시 재시작
  React.useEffect(() => {
    rafLastRef.current = 0;
  }, [intervalMs]);

  const clear = React.useCallback(() => {
    setRecords([]);
    counterRef.current = 0;
  }, []);

  // 통계
  const stats = React.useMemo(() => {
    const byMethod = records.reduce((acc, r) => {
      acc[r.method] = (acc[r.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 최근 10초 이내 평균 간격 계산
    const now = performance.now();
    const recent = records.filter((r) => now - r.timestamp < 10000);
    const avgIntervals: Record<string, number> = {};

    ['setTimeout', 'setInterval', 'rAF'].forEach((method) => {
      const methodRecords = recent.filter((r) => r.method === method);
      if (methodRecords.length > 1) {
        const intervals: number[] = [];
        for (let i = 0; i < methodRecords.length - 1; i++) {
          intervals.push(methodRecords[i].timestamp - methodRecords[i + 1].timestamp);
        }
        avgIntervals[method] = intervals.reduce((sum, v) => sum + v, 0) / intervals.length;
      }
    });

    return { byMethod, avgIntervals };
  }, [records]);

  return (
    <div
      className={cn(
        /* layout */ 'w-full',
        /* spacing */ 'my-6',
        /* border */ 'rounded-lg border border-zinc-200',
        /* background */ 'bg-white',
        /* padding */ 'p-4',
      )}
    >
      {/* 제목 */}
      <h3
        className={cn(
          /* text */ 'text-lg font-semibold text-zinc-800',
          /* spacing */ 'mb-3',
        )}
      >
        타이머 메서드 비교 플레이그라운드
      </h3>

      {/* 설명 */}
      <p
        className={cn(
          /* text */ 'text-sm text-zinc-600',
          /* spacing */ 'mb-4',
        )}
      >
        setTimeout, setInterval, requestAnimationFrame의 실제 실행 간격을 실시간으로 비교합니다.
      </p>

      {/* 간격 설정 */}
      <div
        className={cn(
          /* layout */ 'flex items-center gap-2',
          /* spacing */ 'mb-4',
        )}
      >
        <label className={cn(/* text */ 'text-sm text-zinc-600')}>
          목표 간격 (ms)
        </label>
        <input
          type="number"
          min={10}
          max={2000}
          value={intervalMs}
          onChange={(e) => setIntervalMs(Math.max(10, Number(e.target.value)))}
          className={cn(
            /* form */ 'rounded-md border border-zinc-300 bg-transparent',
            /* sizing */ 'w-20',
            /* spacing */ 'px-2 py-1',
            /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
          )}
        />
      </div>

      {/* 메서드 토글 */}
      <div
        className={cn(
          /* layout */ 'flex flex-wrap gap-2',
          /* spacing */ 'mb-4',
        )}
      >
        <button
          onClick={() => setEnableSetTimeout(!enableSetTimeout)}
          className={cn(
            /* button */ 'rounded-md border',
            /* spacing */ 'px-4 py-2',
            /* text */ 'text-sm font-medium',
            enableSetTimeout
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50',
          )}
        >
          <span className={cn(/* display */ 'inline-block w-3 h-3 rounded-full mr-2', /* background */ 'bg-blue-500')} />
          setTimeout (재귀)
        </button>

        <button
          onClick={() => setEnableSetInterval(!enableSetInterval)}
          className={cn(
            /* button */ 'rounded-md border',
            /* spacing */ 'px-4 py-2',
            /* text */ 'text-sm font-medium',
            enableSetInterval
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50',
          )}
        >
          <span className={cn(/* display */ 'inline-block w-3 h-3 rounded-full mr-2', /* background */ 'bg-emerald-500')} />
          setInterval
        </button>

        <button
          onClick={() => setEnableRAF(!enableRAF)}
          className={cn(
            /* button */ 'rounded-md border',
            /* spacing */ 'px-4 py-2',
            /* text */ 'text-sm font-medium',
            enableRAF
              ? 'border-amber-500 bg-amber-50 text-amber-700'
              : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50',
          )}
        >
          <span className={cn(/* display */ 'inline-block w-3 h-3 rounded-full mr-2', /* background */ 'bg-amber-500')} />
          requestAnimationFrame
        </button>

        <button
          onClick={clear}
          className={cn(
            /* button */ 'rounded-md border border-zinc-300 text-zinc-600',
            /* spacing */ 'px-4 py-2',
            /* text */ 'text-sm',
            /* hover */ 'hover:bg-zinc-50',
          )}
        >
          기록 지우기
        </button>
      </div>

      {/* 통계 */}
      <div
        className={cn(
          /* layout */ 'grid grid-cols-3 gap-3',
          /* spacing */ 'mb-4',
          /* border */ 'rounded-md border border-zinc-200',
          /* background */ 'bg-zinc-50',
          /* padding */ 'p-3',
        )}
      >
        {['setTimeout', 'setInterval', 'rAF'].map((method) => (
          <div key={method}>
            <div className={cn(/* text */ 'text-xs text-zinc-500')}>{method}</div>
            <div className={cn(/* text */ 'text-lg font-semibold text-zinc-800')}>
              {stats.byMethod[method] || 0}회
            </div>
            {stats.avgIntervals[method] && (
              <div className={cn(/* text */ 'text-xs text-zinc-600')}>
                평균 {Math.round(stats.avgIntervals[method])}ms
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 실행 기록 */}
      <div
        className={cn(
          /* height */ 'max-h-64 overflow-y-auto',
          /* border */ 'rounded border border-zinc-200',
          /* background */ 'bg-zinc-50',
          /* padding */ 'p-2',
        )}
      >
        {records.length === 0 ? (
          <div
            className={cn(
              /* text */ 'text-center text-sm text-zinc-400',
              /* spacing */ 'py-8',
            )}
          >
            타이머를 활성화하면 실행 기록이 여기에 표시됩니다.
          </div>
        ) : (
          <div className={cn(/* layout */ 'space-y-1')}>
            {records.slice(0, 30).map((record) => (
              <div
                key={record.id}
                className={cn(
                  /* layout */ 'flex items-center gap-2',
                  /* spacing */ 'px-2 py-1',
                  /* border */ 'rounded',
                  /* background */ 'bg-white',
                )}
              >
                <span
                  className={cn(
                    /* display */ 'inline-block w-2 h-2 rounded-full',
                  )}
                  style={{ backgroundColor: record.color }}
                />
                <span className={cn(/* text */ 'text-xs font-mono text-zinc-500')}>
                  #{record.id.toString().padStart(4, '0')}
                </span>
                <span className={cn(/* text */ 'text-xs text-zinc-700 font-medium flex-1')}>
                  {record.method}
                </span>
                <span className={cn(/* text */ 'text-xs text-zinc-500')}>
                  {Math.round(record.timestamp)}ms
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 설명 */}
      <p
        className={cn(
          /* text */ 'text-xs text-zinc-500',
          /* spacing */ 'mt-4',
        )}
      >
        💡 requestAnimationFrame은 브라우저의 리페인트 주기(보통 16.67ms, 60fps)에 맞춰 실행됩니다. 
        애니메이션에는 rAF, 정확한 주기 작업에는 보정된 setTimeout을 사용하세요.
      </p>
    </div>
  );
}

export default TimerComparisonPlayground;

