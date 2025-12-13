/* eslint-disable no-console */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { KNOWN_CITATIONS } from '../lib/known-citations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const titleCache = new Map<string, string>();
const citationCache = new Map<string, { apa?: string; harvard?: string }>();

function extractText(children: React.ReactNode): string | null {
  if (children == null) return null;
  if (typeof children === 'string' || typeof children === 'number') return String(children);

  if (React.isValidElement(children)) {
    // MDX/JSX가 텍스트를 감싼 경우(희귀)까지 커버
    return extractText((children as any).props?.children);
  }

  if (Array.isArray(children)) {
    const parts: string[] = [];
    for (const c of children) {
      if (typeof c === 'string' || typeof c === 'number') {
        parts.push(String(c));
        continue;
      }
      // MDX에서 텍스트가 여러 조각으로 들어오는 케이스만 처리(그 외는 그대로 둠)
      return null;
    }
    return parts.join('');
  }

  return null;
}

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

async function fetchLinkMeta(url: string, signal: AbortSignal) {
  const res = await fetch(`/api/link-title?url=${encodeURIComponent(url)}`, { signal });
  if (!res.ok) {
    return null;
  }
  const json = (await res.json()) as {
    title?: string | null;
    citationApa?: string | null;
    citationHarvard?: string | null;
  };
  const title = typeof json.title === 'string' && json.title.trim() ? json.title.trim() : null;
  const citationApa = typeof json.citationApa === 'string' && json.citationApa.trim() ? json.citationApa.trim() : undefined;
  const citationHarvard =
    typeof json.citationHarvard === 'string' && json.citationHarvard.trim() ? json.citationHarvard.trim() : undefined;
  return { title, citationApa, citationHarvard };
}

export function normalizeFootnoteContent(children: React.ReactNode) {
  const text = extractText(children);
  if (typeof text !== 'string') return children;
  const trimmed = text.trim();
  if (!isLikelyUrl(trimmed)) return children;
  return <FootnoteLinkTitle url={trimmed} />;
}

export function normalizeFootnoteContentWithStyle(
  children: React.ReactNode,
  style?: 'apa' | 'harvard'
) {
  const text = extractText(children);
  if (typeof text !== 'string') return children;
  const trimmed = text.trim();
  if (!isLikelyUrl(trimmed)) return children;
  return <FootnoteLinkTitle url={trimmed} style={style} />;
}

export function FootnoteLinkTitle({ url, style }: { url: string; style?: 'apa' | 'harvard' }) {
  const cached = titleCache.get(url);
  const cachedCite = citationCache.get(url);
  const known = KNOWN_CITATIONS[url];

  if (known && !titleCache.has(url)) {
    titleCache.set(url, known.title);
    citationCache.set(url, { apa: known.apa, harvard: known.harvard });
  }

  const initialTitle = useMemo(() => cached ?? fallbackTitleFromUrl(url), [cached, url]);
  const [title, setTitle] = useState(initialTitle);
  const [citation, setCitation] = useState<{ apa?: string; harvard?: string } | null>(
    cachedCite ?? (known ? { apa: known.apa, harvard: known.harvard } : null)
  );

  useEffect(() => {
    if (titleCache.has(url) && citationCache.has(url)) return;

    const controller = new AbortController();
    fetchLinkMeta(url, controller.signal)
      .then((meta) => {
        if (!meta) return;

        if (meta.title) {
          titleCache.set(url, meta.title);
          setTitle(meta.title);
        }

        const nextCitation = { apa: meta.citationApa, harvard: meta.citationHarvard };
        if (nextCitation.apa || nextCitation.harvard) {
          citationCache.set(url, nextCitation);
          setCitation(nextCitation);
        }
      })
      .catch((e) => {
        // Abort는 무시
        if (e instanceof DOMException && e.name === 'AbortError') return;
        console.warn('Failed to fetch link title', e);
      });

    return () => controller.abort();
  }, [url]);

  const renderedText =
    style === 'harvard'
      ? (citation?.harvard ?? citation?.apa ?? title)
      : (citation?.apa ?? citation?.harvard ?? title);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        /* link */
        'underline underline-offset-4',
        /* color - 본문과 조화롭게 */
        'text-zinc-700 hover:text-zinc-900',
        'dark:text-zinc-400 dark:hover:text-zinc-200',
        /* wrap */
        'break-words'
      )}
    >
      {renderedText}
    </a>
  );
}


