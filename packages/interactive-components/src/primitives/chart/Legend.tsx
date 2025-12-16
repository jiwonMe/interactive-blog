import * as React from 'react';
import { cx } from '../../utils/cx';
import { legendItem, legendLabel, legendRow, legendSwatch } from '../../styles/recipes/chart.css';

export type LegendItem = {
  key: string;
  label: string;
  color: string;
};

export interface LegendProps {
  className?: string;
  items: LegendItem[];
}

export function Legend({ className, items }: LegendProps) {
  return (
    <div className={cx(legendRow, className)}>
      {items.map((it) => (
        <div key={it.key} className={legendItem}>
          <span className={legendSwatch} style={{ backgroundColor: it.color }} />
          <span className={legendLabel}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}


