'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

type TestResult = {
  id: number;
  requested: number;
  actual: number;
  error: number;
  percentage: number;
};

/**
 * 타이머의 실제 정확도를 측정하는 컴포넌트
 * 다양한 지연 시간으로 setTimeout을 실행하여 실제 걸린 시간을 측정
 */
export function TimerAccuracyTester() {
  const [results, setResults] = React.useState<TestResult[]>([]);
  const [testing, setTesting] = React.useState(false);
  const [customDelay, setCustomDelay] = React.useState(100);
  const counterRef = React.useRef(0);

  const runTest = React.useCallback(async (delay: number) => {
    const start = performance.now();
    await new Promise((resolve) => setTimeout(resolve, delay));
    const end = performance.now();
    const actual = end - start;
    const error = actual - delay;
    const percentage = (error / delay) * 100;

    const result: TestResult = {
      id: ++counterRef.current,
      requested: delay,
      actual: Math.round(actual * 100) / 100,
      error: Math.round(error * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
    };

    setResults((prev) => [result, ...prev.slice(0, 19)]);
  }, []);

  const runBatch = React.useCallback(async () => {
    setTesting(true);
    // 다양한 지연 시간으로 테스트
    const delays = [1, 4, 10, 16, 50, 100, 500, 1000];
    for (const delay of delays) {
      await runTest(delay);
      // 각 테스트 사이에 약간의 간격
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    setTesting(false);
  }, [runTest]);

  const runCustom = React.useCallback(async () => {
    setTesting(true);
    await runTest(customDelay);
    setTesting(false);
  }, [customDelay, runTest]);

  const clear = React.useCallback(() => {
    setResults([]);
    counterRef.current = 0;
  }, []);

  // 평균 계산
  const stats = React.useMemo(() => {
    if (results.length === 0) return null;
    const avgError = results.reduce((sum, r) => sum + r.error, 0) / results.length;
    const avgPercentage = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
    return {
      avgError: Math.round(avgError * 100) / 100,
      avgPercentage: Math.round(avgPercentage * 100) / 100,
      count: results.length,
    };
  }, [results]);

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
        타이머 정확도 측정기
      </h3>

      {/* 설명 */}
      <p
        className={cn(
          /* text */ 'text-sm text-zinc-600',
          /* spacing */ 'mb-4',
        )}
      >
        setTimeout의 실제 정확도를 측정합니다. 요청한 지연 시간과 실제 걸린 시간을 비교해보세요.
      </p>

      {/* 컨트롤 */}
      <div
        className={cn(
          /* layout */ 'flex flex-wrap items-center gap-2',
          /* spacing */ 'mb-4',
        )}
      >
        <button
          onClick={runBatch}
          disabled={testing}
          className={cn(
            /* button */ 'rounded-md bg-indigo-500 text-white',
            /* spacing */ 'px-4 py-2',
            /* hover */ 'hover:bg-indigo-600',
            /* disabled */ 'disabled:opacity-50 disabled:cursor-not-allowed',
            /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
          )}
        >
          {testing ? '테스트 중...' : '배치 테스트 실행'}
        </button>

        <div
          className={cn(
            /* layout */ 'flex items-center gap-2',
          )}
        >
          <input
            type="number"
            min={1}
            value={customDelay}
            onChange={(e) => setCustomDelay(Math.max(1, Number(e.target.value)))}
            disabled={testing}
            className={cn(
              /* form */ 'rounded-md border border-zinc-300 bg-transparent',
              /* sizing */ 'w-20',
              /* spacing */ 'px-2 py-2',
              /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
              /* disabled */ 'disabled:opacity-50',
            )}
          />
          <span className={cn(/* text */ 'text-sm text-zinc-500')}>ms</span>
          <button
            onClick={runCustom}
            disabled={testing}
            className={cn(
              /* button */ 'rounded-md border border-indigo-500 text-indigo-600',
              /* spacing */ 'px-3 py-2',
              /* hover */ 'hover:bg-indigo-50',
              /* disabled */ 'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            단일 테스트
          </button>
        </div>

        <button
          onClick={clear}
          className={cn(
            /* button */ 'rounded-md border border-zinc-300 text-zinc-600',
            /* spacing */ 'px-3 py-2',
            /* hover */ 'hover:bg-zinc-50',
          )}
        >
          결과 지우기
        </button>
      </div>

      {/* 통계 */}
      {stats && (
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
            <div className={cn(/* text */ 'text-xs text-zinc-500')}>측정 횟수</div>
            <div className={cn(/* text */ 'text-lg font-semibold text-zinc-800')}>
              {stats.count}
            </div>
          </div>
          <div>
            <div className={cn(/* text */ 'text-xs text-zinc-500')}>평균 오차</div>
            <div className={cn(/* text */ 'text-lg font-semibold text-zinc-800')}>
              {stats.avgError > 0 ? '+' : ''}{stats.avgError} ms
            </div>
          </div>
          <div>
            <div className={cn(/* text */ 'text-xs text-zinc-500')}>평균 오차율</div>
            <div className={cn(/* text */ 'text-lg font-semibold text-zinc-800')}>
              {stats.avgPercentage > 0 ? '+' : ''}{stats.avgPercentage}%
            </div>
          </div>
        </div>
      )}

      {/* 결과 테이블 */}
      {results.length > 0 ? (
        <div className={cn(/* overflow */ 'overflow-x-auto')}>
          <table
            className={cn(
              /* table */ 'w-full text-left text-sm',
            )}
          >
            <thead
              className={cn(
                /* background */ 'bg-zinc-100',
                /* border */ 'border-b border-zinc-200',
              )}
            >
              <tr>
                <th className={cn(/* padding */ 'px-3 py-2', /* text */ 'font-medium text-zinc-700')}>
                  #
                </th>
                <th className={cn(/* padding */ 'px-3 py-2', /* text */ 'font-medium text-zinc-700')}>
                  요청 (ms)
                </th>
                <th className={cn(/* padding */ 'px-3 py-2', /* text */ 'font-medium text-zinc-700')}>
                  실제 (ms)
                </th>
                <th className={cn(/* padding */ 'px-3 py-2', /* text */ 'font-medium text-zinc-700')}>
                  오차 (ms)
                </th>
                <th className={cn(/* padding */ 'px-3 py-2', /* text */ 'font-medium text-zinc-700')}>
                  오차율 (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr
                  key={result.id}
                  className={cn(
                    /* border */ 'border-b border-zinc-100',
                    /* hover */ 'hover:bg-zinc-50',
                  )}
                >
                  <td className={cn(/* padding */ 'px-3 py-2', /* text */ 'text-zinc-600')}>
                    {result.id}
                  </td>
                  <td className={cn(/* padding */ 'px-3 py-2', /* text */ 'text-zinc-800 font-medium')}>
                    {result.requested}
                  </td>
                  <td className={cn(/* padding */ 'px-3 py-2', /* text */ 'text-zinc-800')}>
                    {result.actual}
                  </td>
                  <td
                    className={cn(
                      /* padding */ 'px-3 py-2',
                      /* text */ 'font-medium',
                      result.error > 0 ? 'text-rose-600' : 'text-emerald-600',
                    )}
                  >
                    {result.error > 0 ? '+' : ''}{result.error}
                  </td>
                  <td
                    className={cn(
                      /* padding */ 'px-3 py-2',
                      result.percentage > 0 ? 'text-rose-600' : 'text-emerald-600',
                    )}
                  >
                    {result.percentage > 0 ? '+' : ''}{result.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={cn(
            /* text */ 'text-center text-sm text-zinc-400',
            /* spacing */ 'py-8',
          )}
        >
          테스트를 실행하면 결과가 여기에 표시됩니다.
        </div>
      )}

      {/* 주의사항 */}
      <p
        className={cn(
          /* text */ 'text-xs text-zinc-500',
          /* spacing */ 'mt-3',
        )}
      >
        💡 4ms 미만의 지연은 브라우저가 최소 지연 시간으로 클램핑할 수 있습니다. 
        백그라운드 탭에서는 더 큰 지연이 발생할 수 있습니다.
      </p>
    </div>
  );
}

export default TimerAccuracyTester;

