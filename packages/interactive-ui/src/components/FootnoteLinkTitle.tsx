/* eslint-disable no-console */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const titleCache = new Map<string, string>();

function isLikelyUrl(input: string) {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function fallbackTitleFromUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const path = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '';
    return `${url.hostname}${path}`;
  } catch {
    return urlString;
  }
}

async function fetchTitle(url: string, signal: AbortSignal) {
  const res = await fetch(`/api/link-title?url=${encodeURIComponent(url)}`, { signal });
  if (!res.ok) {
    return null;
  }
  const json = (await res.json()) as { title?: string | null };
  return typeof json.title === 'string' && json.title.trim() ? json.title.trim() : null;
}

export function normalizeFootnoteContent(children: React.ReactNode) {
  if (typeof children !== 'string') return children;
  const trimmed = children.trim();
  if (!isLikelyUrl(trimmed)) return children;
  return <FootnoteLinkTitle url={trimmed} />;
}

export function FootnoteLinkTitle({ url }: { url: string }) {
  const cached = titleCache.get(url);
  const initialTitle = useMemo(() => cached ?? fallbackTitleFromUrl(url), [cached, url]);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (titleCache.has(url)) return;

    const controller = new AbortController();
    fetchTitle(url, controller.signal)
      .then((t) => {
        if (!t) return;
        titleCache.set(url, t);
        setTitle(t);
      })
      .catch((e) => {
        // Abort는 무시
        if (e instanceof DOMException && e.name === 'AbortError') return;
        console.warn('Failed to fetch link title', e);
      });

    return () => controller.abort();
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        /* link */
        'underline underline-offset-4',
        /* color */
        'text-blue-600 hover:text-blue-800',
        'dark:text-blue-400 dark:hover:text-blue-300',
        /* wrap */
        'break-words'
      )}
    >
      {title}
    </a>
  );
}


