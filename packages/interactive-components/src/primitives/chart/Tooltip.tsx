import * as React from 'react';
import { cx } from '../../utils/cx';
import { tooltipBox } from '../../styles/recipes/chart.css';

export type TooltipRenderArgs = {
  x: number;
  y: number;
};

export interface TooltipProps {
  className?: string;
  x: number;
  y: number;
  children: React.ReactNode;
}

export function Tooltip({ className, x, y, children }: TooltipProps) {
  return (
    <div
      className={cx(tooltipBox, className)}
      style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}
    >
      {children}
    </div>
  );
}


