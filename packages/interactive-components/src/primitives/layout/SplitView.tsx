import * as React from 'react';
import { cx } from '../../utils/cx';
import { splitView } from '../../styles/recipes/layout.css';

export interface SplitViewProps {
  className?: string;
  variant?: NonNullable<Parameters<typeof splitView>[0]>['variant'];
  children: React.ReactNode;
}

export function SplitView(props: SplitViewProps) {
  const { className, variant, children } = props;
  return <div className={cx(splitView({ variant }), className)}>{children}</div>;
}




