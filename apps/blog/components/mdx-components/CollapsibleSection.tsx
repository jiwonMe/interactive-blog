'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  /**
   * 새로고침 후에도 접기/펼치기 상태를 유지할지 여부
   * - 기본값: true
   */
  persist?: boolean;
  /**
   * 상태 저장 위치
   * - 'session': 탭 단위(새로고침 유지, 탭 닫으면 초기화)
   * - 'local': 브라우저 영구 저장
   * - 기본값: 'session'
   */
  storage?: 'session' | 'local';
  /**
   * 상태 저장 키를 직접 지정하고 싶을 때 사용
   * - 미지정 시: URL 경로 + title 조합으로 자동 생성
   */
  storageKey?: string;
  className?: string;
  children: React.ReactNode;
};

export function CollapsibleSection({
  title,
  defaultOpen = false,
  persist = true,
  storage = 'session',
  storageKey,
  className,
  children,
}: CollapsibleSectionProps) {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const resolvedStorageKey = useMemo(() => {
    if (!persist) return null;
    if (storageKey) return storageKey;
    if (typeof window === 'undefined') return null;
    return `collapsible:${window.location.pathname}:${title}`;
  }, [persist, storageKey, title]);

  useEffect(() => {
    if (!persist) return;
    if (!resolvedStorageKey) return;
    if (typeof window === 'undefined') return;

    const store = storage === 'local' ? window.localStorage : window.sessionStorage;

    try {
      const saved = store.getItem(resolvedStorageKey);
      if (saved === '1') setIsOpen(true);
      if (saved === '0') setIsOpen(false);
    } catch {
      // 스토리지 접근이 막힌 환경(프라이빗/권한 제한 등)에서는 그냥 기본 동작
    }
  }, [persist, resolvedStorageKey, storage]);

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!persist) return next;
      if (!resolvedStorageKey) return next;
      if (typeof window === 'undefined') return next;

      const store = storage === 'local' ? window.localStorage : window.sessionStorage;

      try {
        store.setItem(resolvedStorageKey, next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <section
      className={cn(
        /* Layout */
        'my-6 rounded-xl',
        /* Surface (use luminance only; no borders to avoid "stacked boxes") */
        'bg-zinc-200/60 dark:bg-zinc-900/60',
        /* Padding */
        'px-3 py-3 sm:px-4',
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
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


