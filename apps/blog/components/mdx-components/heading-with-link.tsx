'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

type HeadingTag = 'h1' | 'h2' | 'h3';

type HeadingWithLinkProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as: HeadingTag;
};

function buildUrl(pathname: string, id: string) {
  if (typeof window === 'undefined') return `${pathname}#${id}`;
  return `${window.location.origin}${pathname}#${id}`;
}

export function HeadingWithLink({ as, id, className, children, ...rest }: HeadingWithLinkProps) {
  const pathname = usePathname();
  const [copied, setCopied] = React.useState(false);

  const Tag = as as any;
  const canCopy = typeof id === 'string' && id.length > 0;

  return (
    <Tag
      id={id}
      className={cn(
        /* base */
        'group relative',
        className
      )}
      {...rest}
    >
      {children}

      {canCopy ? (
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const url = buildUrl(pathname, id);
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              window.history.replaceState(null, '', `#${id}`);
              window.setTimeout(() => setCopied(false), 1200);
            } catch {
              window.history.replaceState(null, '', `#${id}`);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }
          }}
          className={cn(
            /* layout */
            'absolute -right-8 top-1/2 -translate-y-1/2',
            /* size */
            'h-7 w-7 rounded-md',
            /* border */
            'border border-zinc-200 dark:border-zinc-800',
            /* background */
            'bg-white/80 dark:bg-zinc-950/70',
            /* color */
            'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
            /* interaction */
            'opacity-0 group-hover:opacity-100 transition-opacity',
            /* focus */
            'focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
          )}
          aria-label="섹션 링크 복사"
          title={copied ? '복사됨!' : '링크 복사'}
        >
          {copied ? (
            <span
              className={cn(
                /* typography */
                'text-xs font-semibold'
              )}
            >
              ✓
            </span>
          ) : (
            <svg
              className={cn(
                /* layout */
                'mx-auto',
                /* size */
                'h-4 w-4'
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0 0-7.07 5 5 0 0 0-7.07 0L10.5 4.5" />
              <path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.43a5 5 0 0 0 0 7.07 5 5 0 0 0 7.07 0L13.5 19.5" />
            </svg>
          )}
        </button>
      ) : null}
    </Tag>
  );
}

