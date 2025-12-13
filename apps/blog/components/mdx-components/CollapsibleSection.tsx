'use client';

import React, { useId, useState } from 'react';
import { cn } from '../../lib/utils';

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function CollapsibleSection({
  title,
  defaultOpen = false,
  className,
  children,
}: CollapsibleSectionProps) {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        /* Layout */
        'my-6 rounded-xl',
        /* Surface (use luminance only; no borders to avoid "stacked boxes") */
        'bg-zinc-200/60 dark:bg-zinc-900/60',
        /* Padding */
        'px-4 py-3',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={cn(
          /* Layout */
          'w-full flex items-center justify-between gap-3',
          /* Spacing */
          'px-0 py-1',
          /* Typography */
          'text-left font-semibold',
          /* Color */
          'text-zinc-900 dark:text-zinc-100',
        )}
      >
        <span
          className={cn(
            /* Typography */
            'text-base',
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            /* Typography */
            'text-sm',
            /* Color */
            'text-zinc-500 dark:text-zinc-400',
          )}
        >
          {isOpen ? '접기' : '펼치기'}
        </span>
      </button>

      <div
        id={contentId}
        className={cn(
          /* Layout */
          'grid',
          /* Animation */
          'transition-all duration-200 ease-in-out',
          /* State */
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              /* Layout */
              'pt-3',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}


