'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

type Timer = {
  id: number;
  timerId: ReturnType<typeof setTimeout>;
  cleared: boolean;
  createdAt: number;
};

/**
 * 타이머 메모리 누수를 시각화하는 컴포넌트
 * clearTimeout/clearInterval을 호출하지 않았을 때의 영향을 보여줌
 */
export function MemoryLeakVisualizer() {
  const [timers, setTimers] = React.useState<Timer[]>([]);
  const [autoCreate, setAutoCreate] = React.useState(false);
  const counterRef = React.useRef(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머 생성
  const createTimer = React.useCallback(() => {
    const id = ++counterRef.current;
    const timerId = setTimeout(() => {
      // 실제로는 아무것도 안 하지만 타이머는 유지됨
      console.log(`Timer ${id} executed (but not cleaned up)`);
    }, 60000); // 1분 후 실행 (실제로는 정리되기 전에 실행되지 않을 수도 있음)

    setTimers((prev) => [
      ...prev,
      {
        id,
        timerId,
        cleared: false,
        createdAt: Date.now(),
      },
    ]);
  }, []);

  // 타이머 정리
  const clearTimer = React.useCallback((id: number) => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === id && !timer.cleared) {
          clearTimeout(timer.timerId);
          return { ...timer, cleared: true };
        }
        return timer;
      })
    );
  }, []);

  // 모든 타이머 정리
  const clearAllTimers = React.useCallback(() => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (!timer.cleared) {
          clearTimeout(timer.timerId);
        }
        return { ...timer, cleared: true };
      })
    );
  }, []);

  // 모든 타이머 삭제 (시각적으로만)
  const removeAll = React.useCallback(() => {
    clearAllTimers();
    setTimers([]);
    counterRef.current = 0;
  }, [clearAllTimers]);

  // 자동 생성 토글
  React.useEffect(() => {
    if (autoCreate) {
      intervalRef.current = setInterval(() => {
        createTimer();
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoCreate, createTimer]);

  // 컴포넌트 언마운트 시 정리
  React.useEffect(() => {
    return () => {
      timers.forEach((timer) => {
        if (!timer.cleared) {
          clearTimeout(timer.timerId);
        }
      });
    };
  }, [timers]);

  const activeCount = timers.filter((t) => !t.cleared).length;
  const clearedCount = timers.filter((t) => t.cleared).length;
  const totalCount = timers.length;

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
        메모리 누수 시뮬레이터
      </h3>

      {/* 설명 */}
      <p
        className={cn(
          /* text */ 'text-sm text-zinc-600',
          /* spacing */ 'mb-4',
        )}
      >
        clearTimeout을 호출하지 않으면 타이머가 메모리에 계속 남아있습니다. 
        타이머를 생성하고 정리하는 과정을 시각화합니다.
      </p>

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
        <div>
          <div className={cn(/* text */ 'text-xs text-zinc-500')}>생성된 타이머</div>
          <div className={cn(/* text */ 'text-2xl font-bold text-zinc-800')}>
            {totalCount}
          </div>
        </div>
        <div>
          <div className={cn(/* text */ 'text-xs text-zinc-500')}>정리되지 않은 타이머</div>
          <div
            className={cn(
              /* text */ 'text-2xl font-bold',
              activeCount > 10 ? 'text-rose-600' : activeCount > 5 ? 'text-amber-600' : 'text-emerald-600',
            )}
          >
            {activeCount}
          </div>
        </div>
        <div>
          <div className={cn(/* text */ 'text-xs text-zinc-500')}>정리된 타이머</div>
          <div className={cn(/* text */ 'text-2xl font-bold text-emerald-600')}>
            {clearedCount}
          </div>
        </div>
      </div>

      {/* 경고 메시지 */}
      {activeCount > 10 && (
        <div
          className={cn(
            /* layout */ 'flex items-start gap-2',
            /* spacing */ 'mb-4 p-3',
            /* border */ 'rounded-md border border-rose-200',
            /* background */ 'bg-rose-50',
          )}
        >
          <span className={cn(/* text */ 'text-rose-600 text-lg')}>⚠️</span>
          <div>
            <div className={cn(/* text */ 'text-sm font-semibold text-rose-800')}>
              메모리 누수 경고!
            </div>
            <div className={cn(/* text */ 'text-xs text-rose-700')}>
              정리되지 않은 타이머가 {activeCount}개 있습니다. 
              실제 애플리케이션에서는 성능 저하와 메모리 부족을 유발할 수 있습니다.
            </div>
          </div>
        </div>
      )}

      {/* 컨트롤 */}
      <div
        className={cn(
          /* layout */ 'flex flex-wrap items-center gap-2',
          /* spacing */ 'mb-4',
        )}
      >
        <button
          onClick={createTimer}
          className={cn(
            /* button */ 'rounded-md bg-indigo-500 text-white',
            /* spacing */ 'px-4 py-2',
            /* hover */ 'hover:bg-indigo-600',
            /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
          )}
        >
          타이머 생성
        </button>

        <button
          onClick={() => setAutoCreate(!autoCreate)}
          className={cn(
            /* button */ 'rounded-md border',
            /* spacing */ 'px-4 py-2',
            autoCreate
              ? 'border-rose-500 bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'border-indigo-500 text-indigo-600 hover:bg-indigo-50',
          )}
        >
          {autoCreate ? '자동 생성 중지' : '자동 생성 (0.5초마다)'}
        </button>

        <button
          onClick={clearAllTimers}
          disabled={activeCount === 0}
          className={cn(
            /* button */ 'rounded-md border border-emerald-500 text-emerald-600',
            /* spacing */ 'px-4 py-2',
            /* hover */ 'hover:bg-emerald-50',
            /* disabled */ 'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          모든 타이머 정리
        </button>

        <button
          onClick={removeAll}
          className={cn(
            /* button */ 'rounded-md border border-zinc-300 text-zinc-600',
            /* spacing */ 'px-4 py-2',
            /* hover */ 'hover:bg-zinc-50',
          )}
        >
          초기화
        </button>
      </div>

      {/* 타이머 리스트 */}
      <div
        className={cn(
          /* layout */ 'grid gap-2',
          /* height */ 'max-h-64 overflow-y-auto',
        )}
      >
        {timers.length === 0 ? (
          <div
            className={cn(
              /* text */ 'text-center text-sm text-zinc-400',
              /* spacing */ 'py-8',
            )}
          >
            타이머를 생성하면 여기에 표시됩니다.
          </div>
        ) : (
          timers.slice().reverse().map((timer) => (
            <div
              key={timer.id}
              className={cn(
                /* layout */ 'flex items-center justify-between',
                /* spacing */ 'p-2',
                /* border */ 'rounded border',
                timer.cleared
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-rose-200 bg-rose-50',
              )}
            >
              <div className={cn(/* layout */ 'flex items-center gap-2')}>
                <span
                  className={cn(
                    /* text */ 'text-xs font-mono',
                    timer.cleared ? 'text-emerald-700' : 'text-rose-700',
                  )}
                >
                  #{timer.id}
                </span>
                <span
                  className={cn(
                    /* text */ 'text-xs',
                    timer.cleared ? 'text-emerald-600' : 'text-rose-600',
                  )}
                >
                  {timer.cleared ? '✓ 정리됨' : '⚠ 활성'}
                </span>
              </div>
              {!timer.cleared && (
                <button
                  onClick={() => clearTimer(timer.id)}
                  className={cn(
                    /* button */ 'rounded border border-emerald-500 text-emerald-600',
                    /* spacing */ 'px-2 py-1',
                    /* text */ 'text-xs',
                    /* hover */ 'hover:bg-emerald-50',
                  )}
                >
                  정리하기
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 설명 */}
      <p
        className={cn(
          /* text */ 'text-xs text-zinc-500',
          /* spacing */ 'mt-4',
        )}
      >
        💡 SPA에서 컴포넌트가 언마운트될 때 타이머를 정리하지 않으면 메모리 누수가 발생합니다. 
        React에서는 useEffect의 cleanup 함수에서 clearTimeout/clearInterval을 호출하세요.
      </p>
    </div>
  );
}

export default MemoryLeakVisualizer;

