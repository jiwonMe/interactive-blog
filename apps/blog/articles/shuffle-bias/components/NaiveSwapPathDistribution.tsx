'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '../../../lib/utils';

type PermEntry = {
  perm: number[];
  count: number;
  ratio: number; // (P(perm) / (1/n!)) = count * n! / n^n
};

function factorial(n: number) {
  let v = 1;
  for (let i = 2; i <= n; i += 1) v *= i;
  return v;
}

function powInt(base: number, exp: number) {
  let v = 1;
  for (let i = 0; i < exp; i += 1) v *= base;
  return v;
}

function swapInPlace<T>(arr: T[], i: number, j: number) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

function enumerateNaiveSwapCounts(n: number) {
  const perm = Array.from({ length: n }, (_, i) => i);
  const counts = new Map<string, number>();

  const rec = (i: number) => {
    if (i >= n) {
      const key = perm.join(',');
      counts.set(key, (counts.get(key) ?? 0) + 1);
      return;
    }

    for (let j = 0; j < n; j += 1) {
      swapInPlace(perm, i, j);
      rec(i + 1);
      swapInPlace(perm, i, j);
    }
  };

  rec(0);
  return counts;
}

function parsePermKey(key: string) {
  return key.split(',').map((v) => Number(v));
}

function formatPerm(perm: number[]) {
  return `[${perm.join(' ')}]`;
}

function makeHistogram(ratios: number[], bins: number) {
  if (ratios.length === 0) return { min: 0, max: 1, counts: Array.from({ length: bins }, () => 0) };

  const min = Math.min(...ratios);
  const max = Math.max(...ratios);
  const pad = (max - min) * 0.05 || 0.05;
  const lo = Math.max(0, min - pad);
  const hi = max + pad;
  const width = (hi - lo) / bins || 1;

  const counts = Array.from({ length: bins }, () => 0);
  for (const r of ratios) {
    const raw = Math.floor((r - lo) / width);
    const idx = Math.max(0, Math.min(bins - 1, raw));
    counts[idx] += 1;
  }

  return { min: lo, max: hi, counts };
}

export function NaiveSwapPathDistribution() {
  const [n, setN] = useState(5);
  const topK = 10;
  const bins = 18;

  const computed = useMemo(() => {
    const fact = factorial(n);
    const totalPaths = powInt(n, n);
    const expectedProb = 1 / fact;

    const counts = enumerateNaiveSwapCounts(n);
    const entries: PermEntry[] = [];

    counts.forEach((count, key) => {
      const perm = parsePermKey(key);
      const ratio = (count * fact) / totalPaths;
      entries.push({ perm, count, ratio });
    });

    entries.sort((a, b) => b.ratio - a.ratio);

    const ratios = entries.map((e) => e.ratio);
    const minRatio = ratios.length ? Math.min(...ratios) : 0;
    const maxRatio = ratios.length ? Math.max(...ratios) : 0;

    const expectedCountPerPerm = totalPaths / fact;
    const chiSquare = entries.reduce((acc, e) => {
      const diff = e.count - expectedCountPerPerm;
      return acc + (diff * diff) / expectedCountPerPerm;
    }, 0);

    const top = entries.slice(0, Math.min(topK, entries.length));
    const bottom = [...entries].reverse().slice(0, Math.min(topK, entries.length));

    const hist = makeHistogram(ratios, bins);

    return {
      fact,
      totalPaths,
      expectedProb,
      expectedCountPerPerm,
      chiSquare,
      minRatio,
      maxRatio,
      top,
      bottom,
      hist,
    };
  }, [n]);

  const histMax = Math.max(...computed.hist.counts, 1);

  return (
    <div
      className={cn(
        /* Layout */
        'my-8 p-4 rounded-xl border',
        /* Color */
        'bg-zinc-50 border-zinc-200',
        /* Dark */
        'dark:bg-zinc-900/50 dark:border-zinc-800',
      )}
    >
      <div
        className={cn(
          /* Layout */
          'flex flex-col gap-3',
        )}
      >
        <div
          className={cn(
            /* Layout */
            'flex flex-col gap-2',
            /* Responsive */
            'md:flex-row md:items-center md:justify-between',
          )}
        >
          <div
            className={cn(
              /* Typography */
              'font-semibold',
              /* Color */
              'text-zinc-900 dark:text-zinc-50',
            )}
          >
            Naive Swap: 작은 N에서 “정확한” 순열 확률(경로 전수조사)
          </div>

          <label
            className={cn(
              /* Layout */
              'flex items-center gap-2',
              /* Typography */
              'text-sm',
              /* Color */
              'text-zinc-700 dark:text-zinc-300',
            )}
          >
            <span className={cn(/* Typography */ 'font-medium')}>N</span>
            <select
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className={cn(
                /* Layout */
                'px-2 py-1 rounded-md border',
                /* Color */
                'bg-white border-zinc-200',
                /* Dark */
                'dark:bg-zinc-950 dark:border-zinc-800',
              )}
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
            </select>
          </label>
        </div>

        <div
          className={cn(
            /* Layout */
            'grid grid-cols-1 gap-3',
            /* Responsive */
            'md:grid-cols-3',
          )}
        >
          <div
            className={cn(
              /* Layout */
              'md:col-span-2',
            )}
          >
            <div
              className={cn(
                /* Typography */
                'text-sm font-medium',
                /* Color */
                'text-zinc-800 dark:text-zinc-200',
              )}
            >
              확률 비율 히스토그램 (기대값 대비 \(P(\pi) / (1/N!)\))
            </div>
            <div
              className={cn(
                /* Layout */
                'mt-2 w-full overflow-hidden rounded-lg border',
                /* Color */
                'bg-white border-zinc-200',
                /* Dark */
                'dark:bg-zinc-950 dark:border-zinc-800',
              )}
            >
              <svg viewBox="0 0 360 120" className={cn(/* Layout */ 'w-full h-auto')}>
                {computed.hist.counts.map((c, i) => {
                  const x = (360 / bins) * i;
                  const w = 360 / bins - 1;
                  const h = (c / histMax) * 100;
                  const y = 110 - h;
                  return <rect key={i} x={x} y={y} width={w} height={h} fill="currentColor" opacity={0.75} />;
                })}
                <line x1={0} y1={110} x2={360} y2={110} stroke="currentColor" opacity={0.2} />
              </svg>
            </div>
            <div
              className={cn(
                /* Layout */
                'mt-1 flex items-center justify-between',
                /* Typography */
                'text-xs',
                /* Color */
                'text-zinc-600 dark:text-zinc-400',
              )}
            >
              <span>
                min≈{computed.minRatio.toFixed(3)} (lo≈{computed.hist.min.toFixed(2)})
              </span>
              <span>
                max≈{computed.maxRatio.toFixed(3)} (hi≈{computed.hist.max.toFixed(2)})
              </span>
            </div>
          </div>

          <div>
            <div
              className={cn(
                /* Typography */
                'text-sm font-medium',
                /* Color */
                'text-zinc-800 dark:text-zinc-200',
              )}
            >
              요약
            </div>
            <div
              className={cn(
                /* Layout */
                'mt-2 text-sm space-y-1',
                /* Color */
                'text-zinc-700 dark:text-zinc-300',
              )}
            >
              <div>
                - 경로 수: {n}^{n} = <span className={cn(/* Typography */ 'font-mono')}>{computed.totalPaths}</span>
              </div>
              <div>
                - 순열 수: {n}! = <span className={cn(/* Typography */ 'font-mono')}>{computed.fact}</span>
              </div>
              <div>
                - 기대(균일) 확률: 1/{n}! ≈{' '}
                <span className={cn(/* Typography */ 'font-mono')}>{computed.expectedProb.toFixed(6)}</span>
              </div>
              <div>
                - (참고) 기대 경로수/순열: {n}^{n}/{n}! ≈{' '}
                <span className={cn(/* Typography */ 'font-mono')}>{computed.expectedCountPerPerm.toFixed(3)}</span>
              </div>
              <div>
                - χ²(균일 대비): <span className={cn(/* Typography */ 'font-mono')}>{computed.chiSquare.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            /* Layout */
            'grid grid-cols-1 gap-4',
            /* Responsive */
            'md:grid-cols-2',
          )}
        >
          <div>
            <div
              className={cn(
                /* Typography */
                'text-sm font-medium',
                /* Color */
                'text-zinc-800 dark:text-zinc-200',
              )}
            >
              가장 “자주” 나오는 순열 Top {topK}
            </div>
            <div
              className={cn(
                /* Layout */
                'mt-2 overflow-hidden rounded-lg border',
                /* Color */
                'bg-white border-zinc-200',
                /* Dark */
                'dark:bg-zinc-950 dark:border-zinc-800',
              )}
            >
              <table className={cn(/* Layout */ 'w-full text-sm')}>
                <thead>
                  <tr
                    className={cn(
                      /* Color */
                      'bg-zinc-50 text-zinc-700',
                      /* Dark */
                      'dark:bg-zinc-900/60 dark:text-zinc-300',
                    )}
                  >
                    <th className={cn(/* Layout */ 'text-left px-3 py-2')}>순열</th>
                    <th className={cn(/* Layout */ 'text-right px-3 py-2')}>ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.top.map((e, idx) => (
                    <tr key={idx} className={cn(/* Color */ 'border-t border-zinc-100 dark:border-zinc-900')}>
                      <td className={cn(/* Layout */ 'px-3 py-2 font-mono')}>{formatPerm(e.perm)}</td>
                      <td className={cn(/* Layout */ 'px-3 py-2 text-right font-mono')}>{e.ratio.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div
              className={cn(
                /* Typography */
                'text-sm font-medium',
                /* Color */
                'text-zinc-800 dark:text-zinc-200',
              )}
            >
              가장 “드물게” 나오는 순열 Bottom {topK}
            </div>
            <div
              className={cn(
                /* Layout */
                'mt-2 overflow-hidden rounded-lg border',
                /* Color */
                'bg-white border-zinc-200',
                /* Dark */
                'dark:bg-zinc-950 dark:border-zinc-800',
              )}
            >
              <table className={cn(/* Layout */ 'w-full text-sm')}>
                <thead>
                  <tr
                    className={cn(
                      /* Color */
                      'bg-zinc-50 text-zinc-700',
                      /* Dark */
                      'dark:bg-zinc-900/60 dark:text-zinc-300',
                    )}
                  >
                    <th className={cn(/* Layout */ 'text-left px-3 py-2')}>순열</th>
                    <th className={cn(/* Layout */ 'text-right px-3 py-2')}>ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.bottom.map((e, idx) => (
                    <tr key={idx} className={cn(/* Color */ 'border-t border-zinc-100 dark:border-zinc-900')}>
                      <td className={cn(/* Layout */ 'px-3 py-2 font-mono')}>{formatPerm(e.perm)}</td>
                      <td className={cn(/* Layout */ 'px-3 py-2 text-right font-mono')}>{e.ratio.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          className={cn(
            /* Typography */
            'text-xs leading-relaxed',
            /* Color */
            'text-zinc-600 dark:text-zinc-400',
          )}
        >
          각 비교/교환 선택(경로)은 확률이 정확히 \(1/N^N\)로 동일합니다. 따라서 각 순열의 확률은 “그 순열로 가는 경로 수”에 의해
          결정되고, 이 경로 수가 순열마다 다르면(대부분의 N에서) 편향이 생깁니다.
        </div>
      </div>
    </div>
  );
}


