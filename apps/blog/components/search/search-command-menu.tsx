'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import type { SearchIndex } from '../../lib/search';

type SearchResult = {
  key: string;
  slug: string;
  title: string;
  description?: string;
  headingId?: string;
  headingText?: string;
  score: number;
};

function normalizeQuery(input: string) {
  return input.trim().toLowerCase();
}

function scoreText(haystack: string, needle: string) {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();

  if (!n) return 0;
  if (h === n) return 100;
  if (h.startsWith(n)) return 70;
  if (h.includes(n)) return 40;
  return 0;
}

function buildResults(index: SearchIndex, query: string): SearchResult[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const entry of index.entries) {
    const titleScore = scoreText(entry.title, q);
    const descScore = entry.description ? scoreText(entry.description, q) : 0;

    const bestHeading = entry.headings
      .map((h) => ({ h, score: scoreText(h.text, q) }))
      .sort((a, b) => b.score - a.score)[0];

    const headingScore = bestHeading?.score ?? 0;

    // 글 자체 매칭이 강하면 글 결과를 우선
    const postScore = Math.max(titleScore, descScore);
    if (postScore > 0) {
      results.push({
        key: `post:${entry.slug}`,
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        score: postScore,
      });
    }

    // 섹션 매칭은 별도 결과로 추가 (너무 약하면 제외)
    if (headingScore >= 40 && bestHeading?.h) {
      results.push({
        key: `heading:${entry.slug}:${bestHeading.h.id}`,
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        headingId: bestHeading.h.id,
        headingText: bestHeading.h.text,
        score: headingScore - 5, // 글 제목보다 살짝 낮게
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
}

function isMacPlatform() {
  if (typeof navigator === 'undefined') return true;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

export type SearchCommandMenuProps = {
  searchIndex: SearchIndex;
};

export function SearchCommandMenu({ searchIndex }: SearchCommandMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const results = React.useMemo(() => buildResults(searchIndex, query), [searchIndex, query]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const openMenu = React.useCallback(() => {
    setOpen(true);
    // 다음 tick에 포커스
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openMenu();
        return;
      }

      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const chosen = results[activeIndex];
        if (!chosen) return;
        const target = chosen.headingId ? `/posts/${chosen.slug}#${chosen.headingId}` : `/posts/${chosen.slug}`;
        close();
        router.push(target);
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, close, open, openMenu, results, router]);

  React.useEffect(() => {
    const onOpenSearch = () => openMenu();
    window.addEventListener('pwnz:open-search', onOpenSearch as EventListener);
    return () => window.removeEventListener('pwnz:open-search', onOpenSearch as EventListener);
  }, [openMenu]);

  // 경로가 바뀌면 닫기 (검색 결과 클릭 후 상태 정리)
  React.useEffect(() => {
    if (!open) return;
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  const isMac = isMacPlatform();
  const shortcutLabel = isMac ? '⌘ K' : 'Ctrl K';

  return (
    <div
      className={cn(
        /* layout */
        'fixed inset-0 z-[100] flex items-start justify-center',
        /* spacing */
        'pt-24 px-4'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <button
        type="button"
        onClick={close}
        className={cn(
          /* overlay */
          'absolute inset-0',
          /* background */
          'bg-black/30 backdrop-blur-[2px]'
        )}
        aria-label="닫기"
      />

      <div
        className={cn(
          /* layout */
          'relative w-full max-w-2xl overflow-hidden rounded-2xl',
          /* border */
          'border border-zinc-200 dark:border-zinc-800',
          /* background */
          'bg-white dark:bg-zinc-950',
          /* shadow */
          'shadow-2xl'
        )}
      >
        <div
          className={cn(
            /* layout */
            'flex items-center gap-3 px-4 py-3',
            /* border */
            'border-b border-zinc-200 dark:border-zinc-800'
          )}
        >
          <span
            className={cn(
              /* typography */
              'text-sm font-medium',
              /* color */
              'text-zinc-700 dark:text-zinc-200'
            )}
          >
            검색
          </span>
          <span
            className={cn(
              /* layout */
              'ml-auto inline-flex items-center rounded-md px-2 py-1',
              /* typography */
              'text-xs font-medium',
              /* color */
              'text-zinc-500 dark:text-zinc-400',
              /* background */
              'bg-zinc-100 dark:bg-zinc-900'
            )}
          >
            {shortcutLabel}
          </span>
        </div>

        <div className={cn(/* layout */ 'px-4 py-3')}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="글 제목 또는 섹션을 검색하세요…"
            className={cn(
              /* layout */
              'w-full rounded-lg px-3 py-2',
              /* border */
              'border border-zinc-200 dark:border-zinc-800',
              /* typography */
              'text-sm',
              /* color */
              'text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600',
              /* background */
              'bg-white dark:bg-zinc-950',
              /* focus */
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
            )}
          />
        </div>

        <div
          className={cn(
            /* layout */
            'max-h-[60vh] overflow-y-auto px-2 pb-2'
          )}
        >
          {results.length === 0 ? (
            <div
              className={cn(
                /* layout */
                'px-3 py-10 text-center',
                /* typography */
                'text-sm',
                /* color */
                'text-zinc-500 dark:text-zinc-400'
              )}
            >
              {query.trim() ? '검색 결과가 없어요.' : '검색어를 입력해보세요.'}
            </div>
          ) : (
            <ul className={cn(/* layout */ 'space-y-1')}>
              {results.map((r, idx) => {
                const active = idx === activeIndex;
                const href = r.headingId ? `/posts/${r.slug}#${r.headingId}` : `/posts/${r.slug}`;

                return (
                  <li key={r.key}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        close();
                        router.push(href);
                      }}
                      className={cn(
                        /* layout */
                        'w-full rounded-lg px-3 py-2 text-left',
                        /* transition */
                        'transition-colors',
                        /* active/inactive */
                        active
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/25 dark:text-blue-100'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
                        /* focus */
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
                      )}
                    >
                      <div
                        className={cn(
                          /* layout */
                          'flex items-center gap-2'
                        )}
                      >
                        <span
                          className={cn(
                            /* typography */
                            'text-sm font-medium',
                            /* color */
                            active ? 'text-inherit' : 'text-zinc-900 dark:text-zinc-100'
                          )}
                        >
                          {r.title}
                        </span>
                        {r.headingText ? (
                          <span
                            className={cn(
                              /* layout */
                              'ml-auto truncate',
                              /* typography */
                              'text-xs',
                              /* color */
                              active ? 'text-inherit/80' : 'text-zinc-500 dark:text-zinc-400'
                            )}
                            title={r.headingText}
                          >
                            #{r.headingText}
                          </span>
                        ) : null}
                      </div>
                      {r.description ? (
                        <div
                          className={cn(
                            /* typography */
                            'mt-1 text-xs',
                            /* color */
                            active ? 'text-inherit/80' : 'text-zinc-500 dark:text-zinc-400'
                          )}
                        >
                          {r.description}
                        </div>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={cn(
            /* layout */
            'flex items-center justify-between px-4 py-3',
            /* border */
            'border-t border-zinc-200 dark:border-zinc-800',
            /* typography */
            'text-xs',
            /* color */
            'text-zinc-500 dark:text-zinc-400'
          )}
        >
          <span>↑↓ 이동 · Enter 선택 · Esc 닫기</span>
          <span>총 {searchIndex.entries.length}개 글</span>
        </div>
      </div>
    </div>
  );
}

