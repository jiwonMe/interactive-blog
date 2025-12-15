'use client';

import React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CalloutType = 'info' | 'tip' | 'warning' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutStyles: Record<CalloutType, {
  container: string;
  icon: string;
  title: string;
  content: string;
}> = {
  info: {
    container: 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg shadow-sm',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    content: 'text-blue-800 dark:text-blue-200',
  },
  tip: {
    container: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 dark:border-emerald-400 rounded-r-lg shadow-sm',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-900 dark:text-emerald-100',
    content: 'text-emerald-800 dark:text-emerald-200',
  },
  warning: {
    container: 'bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 dark:border-amber-400 rounded-r-lg shadow-sm',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-100',
    content: 'text-amber-800 dark:text-amber-200',
  },
  danger: {
    container: 'bg-red-50/50 dark:bg-red-950/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg shadow-sm',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-100',
    content: 'text-red-800 dark:text-red-200',
  },
};

const calloutIcons: Record<CalloutType, React.ReactNode> = {
  info: (
    <svg
      className={cn(
        /* Size */
        "w-5 h-5"
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tip: (
    <svg
      className={cn(
        /* Size */
        "w-5 h-5"
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  warning: (
    <svg
      className={cn(
        /* Size */
        "w-5 h-5"
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  danger: (
    <svg
      className={cn(
        /* Size */
        "w-5 h-5"
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const Callout = ({ type = 'info', title, children }: CalloutProps) => {
  const styles = calloutStyles[type];
  const icon = calloutIcons[type];

  return (
    <div
      className={cn(
        /* Spacing */
        "my-6",
        "px-3 py-4",
        "sm:p-5",
        /* Style */
        styles.container
      )}
    >
      <div
        className={cn(
          /* Layout */
          "flex",
          "flex-col sm:flex-row",
          /* Spacing */
          "gap-4"
        )}
      >
        <div
          className={cn(
            /* Layout */
            "flex-shrink-0",
            /* Color */
            styles.icon
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            /* Layout */
            "flex-1 min-w-0"
          )}
        >
          {title && (
            <h4
              className={cn(
                /* Typography */
                "text-base font-semibold",
                /* Spacing */
                "mb-3",
                /* Color */
                styles.title
              )}
            >
              {title}
            </h4>
          )}
          <div
            className={cn(
              /* Typography */
              "leading-relaxed",
              /* Color */
              styles.content
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

