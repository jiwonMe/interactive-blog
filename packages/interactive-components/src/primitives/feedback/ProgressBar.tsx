import * as React from 'react';
import { cx } from '../../utils/cx';
import { progressFill, progressTrack } from '../../styles/recipes/feedback.css';

export interface ProgressBarProps {
  className?: string;
  value: number;
  min?: number;
  max?: number;
}

export function ProgressBar({ className, value, min = 0, max = 1 }: ProgressBarProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const pct = max === min ? 0 : ((clamped - min) / (max - min)) * 100;

  return (
    <div className={cx(progressTrack, className)} role="progressbar" aria-valuemin={min} aria-valuemax={max} aria-valuenow={clamped}>
      <div className={progressFill} style={{ width: `${pct}%` }} />
    </div>
  );
}






