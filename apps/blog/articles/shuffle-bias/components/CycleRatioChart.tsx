'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { cn } from '../../../lib/utils';

export type CycleRatioPoint = {
  total: number;
  ratio: number;
};

type CycleRatioChartProps = {
  points: CycleRatioPoint[];
  theoryRatio?: number;
  className?: string;
};

export function CycleRatioChart({ points, theoryRatio = 0.25, className }: CycleRatioChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    // Guard: need at least 2 points to draw a line.
    if (points.length === 0) return [{ total: 1, ratio: 0 }];
    return points;
  }, [points]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 340;
    const height = 180;
    const margin = { top: 16, right: 12, bottom: 26, left: 38 };

    svg.selectAll('*').remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.total) as [number, number])
      .range([margin.left, width - margin.right]);

    // For this experiment, cycle ratio converges around 0.25.
    // Fix a stable Y range for readability (no noisy rescaling).
    const y = d3.scaleLinear().domain([0, 0.5]).range([height - margin.bottom, margin.top]);

    // background grid (luminance only)
    const grid = svg.append('g').attr('opacity', 0.25);
    grid
      .selectAll('line.h')
      .data([0, 0.25, 0.5])
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (t) => y(t))
      .attr('y2', (t) => y(t))
      .attr('stroke', 'currentColor')
      .attr('opacity', (t) => (t === theoryRatio ? 0.5 : 0.25))
      .attr('stroke-dasharray', (t) => (t === theoryRatio ? '4 3' : null));

    // axes (minimal)
    const axisColor = 'currentColor';

    const yAxis = d3.axisLeft(y).tickValues([0, 0.25, 0.5]).tickFormat((d) => d3.format('.2f')(d as number));
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .call((g) => g.selectAll('path').attr('stroke', axisColor).attr('opacity', 0.35))
      .call((g) => g.selectAll('line').attr('stroke', axisColor).attr('opacity', 0.35))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('opacity', 0.75).attr('font-size', 10));

    const xAxis = d3.axisBottom(x).ticks(3).tickFormat((d) => d3.format('~s')(d as number));
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .call((g) => g.selectAll('path').attr('stroke', axisColor).attr('opacity', 0.35))
      .call((g) => g.selectAll('line').attr('stroke', axisColor).attr('opacity', 0.35))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('opacity', 0.75).attr('font-size', 10));

    // line
    const line = d3
      .line<CycleRatioPoint>()
      .x((d) => x(d.total))
      .y((d) => y(d.ratio))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('opacity', 0.85);

    // latest point marker
    const last = data[data.length - 1];
    svg
      .append('circle')
      .attr('cx', x(last.total))
      .attr('cy', y(last.ratio))
      .attr('r', 5)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.85);

    // label for theory line
    svg
      .append('text')
      .attr('x', width - margin.right)
      .attr('y', y(theoryRatio) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text(`이론값 ${theoryRatio.toFixed(2)}`);
  }, [data, theoryRatio]);

  return (
    <div
      className={cn(
        /* Layout */
        'w-full',
        className,
      )}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 340 180"
        className={cn(
          /* Layout */
          'w-full h-auto block',
          /* Color */
          'text-zinc-900 dark:text-zinc-100',
        )}
      />
    </div>
  );
}


