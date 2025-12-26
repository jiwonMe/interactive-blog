import * as React from 'react';
import { cx } from '../../utils/cx';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { chartRoot, chartSvg } from '../../styles/recipes/chart.css';

export type ChartMargin = { top: number; right: number; bottom: number; left: number };

export interface ChartContainerProps {
  className?: string;
  height: number;
  margin?: ChartMargin;
  children: (ctx: {
    width: number;
    height: number;
    margin: ChartMargin;
    innerWidth: number;
    innerHeight: number;
  }) => React.ReactNode;
}

const DEFAULT_MARGIN: ChartMargin = { top: 16, right: 16, bottom: 36, left: 44 };

export function ChartContainer({ className, height, margin, children }: ChartContainerProps) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  const width = Math.max(0, size.width);
  const m = margin ?? DEFAULT_MARGIN;

  const innerWidth = Math.max(0, width - m.left - m.right);
  const innerHeight = Math.max(0, height - m.top - m.bottom);

  return (
    <div ref={ref} className={cx(chartRoot, className)}>
      <svg className={chartSvg} width={width} height={height}>
        {width > 0 ? (
          <g transform={`translate(${m.left}, ${m.top})`}>
            {children({ width, height, margin: m, innerWidth, innerHeight })}
          </g>
        ) : null}
      </svg>
    </div>
  );
}






