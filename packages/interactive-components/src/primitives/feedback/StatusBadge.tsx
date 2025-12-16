import * as React from 'react';
import { cx } from '../../utils/cx';
import { badge } from '../../styles/recipes/feedback.css';

export type StatusBadgeVariant = NonNullable<Parameters<typeof badge>[0]>['variant'];

export interface StatusBadgeProps {
  className?: string;
  variant?: StatusBadgeVariant;
  children: React.ReactNode;
}

export function StatusBadge({ className, variant, children }: StatusBadgeProps) {
  return <span className={cx(badge({ variant }), className)}>{children}</span>;
}


