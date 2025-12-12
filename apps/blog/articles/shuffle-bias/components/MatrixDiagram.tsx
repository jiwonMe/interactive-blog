'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { cn } from '../../../lib/utils';

interface MatrixDiagramProps {
  n: number;
  counts: Uint32Array;
  totalTrials: number;
  revision: number;
  className?: string;
}

export function MatrixDiagram({ n, counts, totalTrials, revision, className }: MatrixDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const cellSelectionRef = useRef<d3.Selection<SVGRectElement, number, SVGGElement, unknown> | null>(
    null,
  );

  useEffect(() => {
    if (!svgRef.current || n <= 0) return;

    const svg = d3.select(svgRef.current);
    const width = 500; // 내부 좌표계 기준 너비
    const height = 500; // 내부 좌표계 기준 높이
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    // 셀 크기 계산
    const cellSize = Math.min(
      (width - margin.left - margin.right) / n,
      (height - margin.top - margin.bottom) / n
    );

    // 스케일 정의
    const x = d3.scaleLinear().domain([0, n]).range([margin.left, margin.left + n * cellSize]);
    const y = d3.scaleLinear().domain([0, n]).range([margin.top, margin.top + n * cellSize]);

    // n 변경 시에만 전체를 재구성합니다.
    svg.selectAll('*').remove();

    // 그룹 생성
    const g = svg.append('g');

    const indices = d3.range(n * n);

    const cellSelection = g
      .selectAll<SVGRectElement, number>('rect.cell')
      .data(indices)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (d) => x(d % n))
      .attr('y', (d) => y(Math.floor(d / n)))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', 'transparent')
      .attr('stroke', 'none');

    cellSelectionRef.current = cellSelection;

    // 외곽선
    g.append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', n * cellSize)
      .attr('height', n * cellSize)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);

    // 축 레이블 (선택 사항)
    // i: original index (y축)
    // j: new index (x축)
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'currentColor')
      .text('New Position (j)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'currentColor')
      .text('Original Position (i)');

  }, [n]);

  useEffect(() => {
    const cells = cellSelectionRef.current;
    if (!cells) return;
    if (n <= 0) return;
    if (totalTrials <= 0) return;

    const expected = totalTrials / n;
    const colorScale = (value: number) => {
      const ratio = expected > 0 ? value / expected : 0;
      let t = ratio / 2;
      t = Math.max(0, Math.min(1, t));
      return d3.interpolatePuOr(t);
    };

    cells.attr('fill', (d) => colorScale(counts[d] ?? 0));
  }, [counts, n, revision, totalTrials]);

  return (
    <div
      className={cn(
        /* Layout */
        'relative w-full aspect-square',
        className,
      )}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className={cn(
          /* Layout */
          'w-full h-full block',
        )}
        style={{ shapeRendering: 'crispEdges' }} // 픽셀 아트처럼 선명하게
      />

      {totalTrials === 0 && (
        <div
          className={cn(
            /* Layout */
            'absolute inset-0 grid place-items-center',
          )}
        >
          <div
            className={cn(
              /* Layout */
              'px-4 py-3 rounded-lg text-center max-w-[22rem]',
              /* Typography (mobile only) */
              'text-[11px] md:text-sm',
              /* Border (mobile only) */
              'border-0 border-none border-transparent',
              /* Border (desktop+) */
              'md:border md:border-solid md:border-zinc-200 md:dark:border-zinc-700',
              /* Color */
              'bg-white text-zinc-700',
              /* Dark (mobile only) */
              'dark:bg-zinc-900/75 md:dark:bg-zinc-900',
              /* Dark */
              'dark:text-zinc-300',
            )}
          >
            시뮬레이션을 시작하면 매트릭스가 채워집니다.
          </div>
        </div>
      )}
    </div>
  );
}

