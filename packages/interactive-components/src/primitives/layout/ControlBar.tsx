import * as React from 'react';
import { cx } from '../../utils/cx';
import { controlBar, controlGroup } from '../../styles/recipes/layout.css';

export interface ControlBarProps {
  className?: string;
  children: React.ReactNode;
}

function ControlBarRoot(props: ControlBarProps) {
  const { className, children } = props;
  return <div className={cx(controlBar, className)}>{children}</div>;
}

export interface ControlBarGroupProps {
  className?: string;
  children: React.ReactNode;
}

function ControlBarGroup(props: ControlBarGroupProps) {
  const { className, children } = props;
  return <div className={cx(controlGroup, className)}>{children}</div>;
}

export const ControlBar = Object.assign(ControlBarRoot, {
  Group: ControlBarGroup,
});



