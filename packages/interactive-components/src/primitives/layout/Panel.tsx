import * as React from 'react';
import { cx } from '../../utils/cx';
import { panel, panelDescription, panelHeader, panelInner, panelTitle } from '../../styles/recipes/layout.css';

export interface PanelProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export function Panel(props: PanelProps) {
  const { className, title, description, headerRight, children } = props;
  const hasHeader = Boolean(title) || Boolean(description) || Boolean(headerRight);

  return (
    <div className={cx(panel, className)}>
      <div className={panelInner}>
        {hasHeader ? (
          <div className={panelHeader}>
            <div>
              {title ? <div className={panelTitle}>{title}</div> : null}
              {description ? <div className={panelDescription}>{description}</div> : null}
            </div>
            {headerRight ? <div>{headerRight}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}






