'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export type CodeTabProps = {
  title: string;
  children: React.ReactNode;
};

export function CodeTab({ children }: CodeTabProps) {
  return <>{children}</>;
}

type CodeTabsProps = {
  children: React.ReactNode;
};

export function CodeTabs({ children }: CodeTabsProps) {
  const tabs = React.Children.toArray(children).filter(React.isValidElement) as Array<
    React.ReactElement<CodeTabProps>
  >;

  const [activeIndex, setActiveIndex] = React.useState(0);

  if (tabs.length <= 1) {
    return <>{tabs[0] ?? null}</>;
  }

  const activeTab = tabs[Math.min(activeIndex, tabs.length - 1)];

  return (
    <div
      className={cn(
        /* layout */
        'my-6 overflow-hidden rounded-lg',
        /* border */
        'border border-zinc-200 dark:border-zinc-800',
        /* background */
        'bg-zinc-50 dark:bg-zinc-900'
      )}
    >
      <div
        className={cn(
          /* layout */
          'flex items-center gap-1 px-2 py-2',
          /* border */
          'border-b border-zinc-200 dark:border-zinc-800',
          /* background */
          'bg-zinc-100/70 dark:bg-zinc-950/40'
        )}
        role="tablist"
        aria-label="Code tabs"
      >
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`${tab.props.title}-${idx}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                /* layout */
                'px-3 py-1.5 rounded-md',
                /* typography */
                'text-xs font-medium',
                /* transition */
                'transition-colors',
                /* active/inactive */
                isActive
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/60',
                /* focus */
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
              )}
            >
              {tab.props.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className={cn(
          /* layout */
          'px-0'
        )}
      >
        <div
          className={cn(
            /* reset figure/pre spacing inside tabs */
            '[&>figure]:my-0',
            '[&>figure>pre]:my-0',
            '[&>figure>pre]:rounded-none',
            '[&>figure>pre]:border-0',
            /* fallback: directly rendered pre */
            '[&>pre]:my-0',
            '[&>pre]:rounded-none',
            '[&>pre]:border-0'
          )}
        >
          {activeTab}
        </div>
      </div>
    </div>
  );
}

