import * as React from 'react';
import { cx } from '../utils/cx';
import { simulationCard, statLabel, statRow, statValue, statsList } from '../styles/recipes/simulation.css';

export type StatItem = {
  key: string;
  label: string;
  value: string | number;
};

export interface StatsDisplayProps {
  className?: string;
  title?: React.ReactNode;
  items: StatItem[];
}

export function StatsDisplay(props: StatsDisplayProps) {
  const { className, title, items } = props;
  return (
    <div className={cx(simulationCard, className)}>
      {title ? <div style={{ fontWeight: 700, marginBottom: 12 }}>{title}</div> : null}
      <div className={statsList}>
        {items.map((it) => (
          <div key={it.key} className={statRow}>
            <div className={statLabel}>{it.label}</div>
            <div className={statValue}>{String(it.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}






