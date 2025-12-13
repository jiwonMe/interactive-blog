'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import katex from 'katex';
import { cn } from '../../../lib/utils';

type Dir = 1 | -1;

type Sample = {
  ab: Dir; // 1: a->b, -1: b->a
  bc: Dir; // 1: b->c, -1: c->b
  ac: Dir; // 1: a->c, -1: c->a
};

type NodeId = 'a' | 'b' | 'c';

type Edge = {
  from: NodeId;
  to: NodeId;
  id: 'ab' | 'bc' | 'ac';
};

function randDir(): Dir {
  return Math.random() < 0.5 ? 1 : -1;
}

function sampleTournament(): Sample {
  return { ab: randDir(), bc: randDir(), ac: randDir() };
}

function isCycle(s: Sample): boolean {
  // a->b, b->c, c->a  or  b->a, c->b, a->c
  return (s.ab === 1 && s.bc === 1 && s.ac === -1) || (s.ab === -1 && s.bc === -1 && s.ac === 1);
}

function edgesOf(s: Sample): Edge[] {
  const ab: Edge = s.ab === 1 ? { id: 'ab', from: 'a', to: 'b' } : { id: 'ab', from: 'b', to: 'a' };
  const bc: Edge = s.bc === 1 ? { id: 'bc', from: 'b', to: 'c' } : { id: 'bc', from: 'c', to: 'b' };
  const ac: Edge = s.ac === 1 ? { id: 'ac', from: 'a', to: 'c' } : { id: 'ac', from: 'c', to: 'a' };
  return [ab, bc, ac];
}

function cmpText(a: NodeId, b: NodeId, dir: Dir): string {
  // Return LaTeX so we can render with KaTeX inside the component.
  // dir=1 means a<b for (a,b) pair
  if (dir === 1) return `${a} \\lt ${b}`;
  return `${a} \\gt ${b}`;
}

function renderInlineKatex(latex: string) {
  return {
    __html: katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
      strict: 'ignore',
    }),
  };
}

export function TournamentSampler() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [last, setLast] = useState<Sample>(() => sampleTournament());
  const [total, setTotal] = useState(1);
  const [cycles, setCycles] = useState(() => (isCycle(last) ? 1 : 0));

  const lastIsCycle = useMemo(() => isCycle(last), [last]);
  const lastEdges = useMemo(() => edgesOf(last), [last]);

  const cycleRatio = useMemo(() => {
    if (total <= 0) return 0;
    return cycles / total;
  }, [cycles, total]);

  const sampleOnce = () => {
    const s = sampleTournament();
    setLast(s);
    setTotal((t) => t + 1);
    setCycles((c) => c + (isCycle(s) ? 1 : 0));
  };

  const sampleMany = (n: number) => {
    if (n <= 0) return;

    let lastLocal = last;
    let addCycles = 0;
    for (let i = 0; i < n; i += 1) {
      const s = sampleTournament();
      lastLocal = s;
      if (isCycle(s)) addCycles += 1;
    }

    setLast(lastLocal);
    setTotal((t) => t + n);
    setCycles((c) => c + addCycles);
  };

  const reset = () => {
    const s = sampleTournament();
    setLast(s);
    setTotal(1);
    setCycles(isCycle(s) ? 1 : 0);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 520;
    const height = 260;

    svg.selectAll('*').remove();

    const g = svg.append('g');

    // --- defs (arrow marker)
    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'currentColor');

    // --- layout
    const nodes: Record<NodeId, { x: number; y: number; label: string }> = {
      a: { x: 140, y: 80, label: 'a' },
      b: { x: 380, y: 80, label: 'b' },
      c: { x: 260, y: 200, label: 'c' },
    };

    const edgeStyle = {
      strokeWidth: 2.5,
      nodeR: 20,
    };

    const edgePathClipped = (from: NodeId, to: NodeId, bend: number) => {
      const p1 = nodes[from];
      const p2 = nodes[to];
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;

      // perpendicular unit vector
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      const ux = -dy / len;
      const uy = dx / len;

      const cx = mx + ux * bend;
      const cy = my + uy * bend;

      // Quadratic Bézier: P0=p1, P1=(c), P2=p2
      // Clip endpoints to node circles so the arrow touches the perimeter.
      const sdx = cx - p1.x;
      const sdy = cy - p1.y;
      const sl = Math.max(1, Math.hypot(sdx, sdy));
      const sx = p1.x + (sdx / sl) * edgeStyle.nodeR;
      const sy = p1.y + (sdy / sl) * edgeStyle.nodeR;

      const edx = p2.x - cx;
      const edy = p2.y - cy;
      const el = Math.max(1, Math.hypot(edx, edy));
      const ex = p2.x - (edx / el) * edgeStyle.nodeR;
      const ey = p2.y - (edy / el) * edgeStyle.nodeR;

      return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
    };

    // --- edges
    const bends: Record<Edge['id'], number> = {
      ab: -22,
      bc: 22,
      ac: -22,
    };

    g
      .selectAll('path.edge')
      .data(lastEdges)
      .join('path')
      .attr('class', 'edge')
      .attr('d', (d) => edgePathClipped(d.from, d.to, bends[d.id]))
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', edgeStyle.strokeWidth)
      .attr('marker-end', 'url(#arrow)')
      .attr('opacity', 0.9);

    // --- nodes
    const nodeG = g
      .selectAll('g.node')
      .data(Object.entries(nodes) as Array<[NodeId, { x: number; y: number; label: string }]>)
      .join('g')
      .attr('class', 'node')
      .attr('transform', ([, n]) => `translate(${n.x},${n.y})`);

    nodeG
      .append('circle')
      .attr('r', edgeStyle.nodeR)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.12);

    nodeG
      .append('circle')
      .attr('r', edgeStyle.nodeR)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    nodeG
      .append('text')
      .text(([, n]) => n.label)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .attr('font-family', 'KaTeX_Math, KaTeX_Main, ui-serif, serif')
      .attr('font-style', 'italic')
      .attr('fill', 'currentColor');

    // --- title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.8)
      .text(lastIsCycle ? '이번 샘플: 사이클(비추이적)' : '이번 샘플: 추이적');
  }, [lastEdges, lastIsCycle]);

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
          <svg
            ref={svgRef}
            viewBox="0 0 520 260"
            className={cn(
              /* Layout */
              'w-full h-auto block',
              /* Color */
              'text-zinc-900',
              /* Dark */
              'dark:text-zinc-100',
            )}
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
              <span dangerouslySetInnerHTML={renderInlineKatex(cmpText('a', 'b', last.ab))} />
              <span className={cn(/* Spacing */ 'mx-1')}> , </span>
              <span dangerouslySetInnerHTML={renderInlineKatex(cmpText('b', 'c', last.bc))} />
              <span className={cn(/* Spacing */ 'mx-1')}> , </span>
              <span dangerouslySetInnerHTML={renderInlineKatex(cmpText('a', 'c', last.ac))} />
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
          </div>

          <div
            className={cn(
              /* Layout */
              'grid grid-cols-2 gap-2',
            )}
          >
            <button
              type="button"
              onClick={sampleOnce}
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
              onClick={() => sampleMany(100)}
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
              onClick={() => sampleMany(1000)}
              className={cn(
                /* Layout */
                'px-3 py-2 rounded-lg border text-sm font-medium',
                /* Color */
                'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50',
                /* Dark */
                'dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900',
              )}
            >
              1000번 샘플
            </button>
            <button
              type="button"
              onClick={reset}
              className={cn(
                /* Layout */
                'px-3 py-2 rounded-lg border text-sm font-medium',
                /* Color */
                'bg-zinc-900 border-zinc-900 text-white',
                /* Hover */
                'hover:bg-zinc-800',
                /* Dark */
                'dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900',
                /* Dark hover */
                'dark:hover:bg-zinc-200',
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
      </div>
    </div>
  );
}


