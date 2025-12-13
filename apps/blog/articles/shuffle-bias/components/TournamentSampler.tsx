'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { cn } from '../../../lib/utils';
import { TournamentDiagram } from './TournamentDiagram';
import { TournamentSamplerStatsPanel } from './TournamentSamplerStatsPanel';
import { type CycleRatioPoint } from './CycleRatioChart';
import { cmpLatex, edgesOf, isCycle, sampleTournament, type Sample } from './tournamentSamplerUtils';

function renderInlineKatex(latex: string) {
  return {
    __html: katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
      strict: 'ignore',
    }),
  };
}

// SSR/CSR hydration mismatch 방지:
// - 이 컴포넌트는 Client Component지만 Next가 SSR을 수행할 수 있음
// - useState initializer에서 Math.random()을 호출하면 서버/클라이언트 초기 렌더가 달라져 hydration mismatch 발생
const INITIAL_SAMPLE: Sample = { ab: 1, bc: 1, ac: 1 }; // a<b, b<c, a<c (추이적)

export function TournamentSampler() {
  const [state, setState] = useState<{
    last: Sample;
    total: number;
    cycles: number;
    points: CycleRatioPoint[];
  }>(() => {
    const first = INITIAL_SAMPLE;
    const c = isCycle(first) ? 1 : 0;
    return {
      last: first,
      total: 1,
      cycles: c,
      points: [{ total: 1, ratio: c }],
    };
  });

  const lastIsCycle = useMemo(() => isCycle(state.last), [state.last]);
  const lastEdges = useMemo(() => edgesOf(state.last), [state.last]);

  const cycleRatio = useMemo(() => {
    if (state.total <= 0) return 0;
    return state.cycles / state.total;
  }, [state.cycles, state.total]);

  const trimPoints = (points: CycleRatioPoint[], max: number) => {
    return points.length > max ? points.slice(points.length - max) : points;
  };

  const appendPoints = (points: CycleRatioPoint[], added: CycleRatioPoint[], max: number) => {
    return trimPoints([...points, ...added], max);
  };

  const applyDelta = (nextLast: Sample, addTotal: number, addCycles: number, perSampleAdds?: number[]) => {
    setState((prev) => {
      const maxPoints = 200;

      let total = prev.total;
      let cycles = prev.cycles;

      const addedPoints: CycleRatioPoint[] = [];

      if (perSampleAdds && perSampleAdds.length > 0) {
        for (let i = 0; i < perSampleAdds.length; i += 1) {
          total += 1;
          cycles += perSampleAdds[i] ?? 0;
          addedPoints.push({ total, ratio: cycles / total });
        }
      } else {
        total += addTotal;
        cycles += addCycles;
        addedPoints.push({ total, ratio: total > 0 ? cycles / total : 0 });
      }

      return {
        last: nextLast,
        total,
        cycles,
        points: appendPoints(prev.points, addedPoints, maxPoints),
      };
    });
  };

  const sampleOnce = () => {
    const s = sampleTournament();
    applyDelta(s, 1, isCycle(s) ? 1 : 0, [isCycle(s) ? 1 : 0]);
  };

  const sampleMany = (n: number) => {
    if (n <= 0) return;

    let lastLocal = state.last;
    const perSampleAdds: number[] = [];

    for (let i = 0; i < n; i += 1) {
      const s = sampleTournament();
      lastLocal = s;
      perSampleAdds.push(isCycle(s) ? 1 : 0);
    }

    const addCycles = perSampleAdds.reduce((acc, v) => acc + v, 0);
    applyDelta(lastLocal, n, addCycles, perSampleAdds);
  };

  const reset = () => {
    const first = sampleTournament();
    const c = isCycle(first) ? 1 : 0;
    setState({
      last: first,
      total: 1,
      cycles: c,
      points: [{ total: 1, ratio: c }],
    });
  };

  return (
    <div
      className={cn(
        /* Layout */
        'p-4 rounded-xl',
        /* Surface (prefer luminance over borders) */
        lastIsCycle ? 'bg-rose-50/50' : 'bg-zinc-50',
        /* Dark */
        lastIsCycle ? 'dark:bg-rose-950/20' : 'dark:bg-zinc-900/40',
      )}
    >
      <div
        className={cn(
          /* Layout */
          'grid grid-cols-1 gap-4 items-start',
          /* Responsive */
          'md:grid-cols-[minmax(0,1fr)_16rem]',
        )}
      >
        <div
          className={cn(
            /* Layout */
            'w-full',
          )}
        >
          <TournamentDiagram
            edges={lastEdges}
            title={lastIsCycle ? '이번 샘플: 사이클(비추이적)' : '이번 샘플: 추이적'}
          />

          <div
            className={cn(
              /* Layout */
              'mt-3 text-sm',
              /* Color */
              'text-zinc-700 dark:text-zinc-300',
            )}
          >
            <div
              className={cn(
                /* Typography */
                'font-medium',
              )}
            >
              <span dangerouslySetInnerHTML={renderInlineKatex(cmpLatex('a', 'b', state.last.ab))} />
              <span className={cn(/* Spacing */ 'mx-1')}> , </span>
              <span dangerouslySetInnerHTML={renderInlineKatex(cmpLatex('b', 'c', state.last.bc))} />
              <span className={cn(/* Spacing */ 'mx-1')}> , </span>
              <span dangerouslySetInnerHTML={renderInlineKatex(cmpLatex('a', 'c', state.last.ac))} />
            </div>
          <div
            className={cn(
              /* Layout */
              'mt-1',
              /* Color (use hue only when necessary) */
              lastIsCycle ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-600 dark:text-zinc-400',
            )}
          >
            {lastIsCycle ? '→ 3-사이클이 생겨서 추이성이 깨짐' : '→ 사이클이 없어 전순서로 일관되게 정렬 가능'}
          </div>
          </div>
        </div>

        <div
          className={cn(
            /* Layout */
            'flex flex-col gap-3',
          )}
        >
          <TournamentSamplerStatsPanel
            total={state.total}
            cycles={state.cycles}
            cycleRatio={cycleRatio}
            points={state.points}
            onSampleOnce={sampleOnce}
            onSampleMany={sampleMany}
            onReset={reset}
          />
        </div>
      </div>
    </div>
  );
}


