'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

type LineRange = { start: number; end: number } | null;
type LineNode = {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  getBoundingClientRect(): { top: number; bottom: number };
  scrollIntoView(options?: ScrollIntoViewOptions): void;
};

function parseHashToLineRange(hash: string): LineRange {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;

  // #L10 또는 #L10-L20
  const match = raw.match(/^L(\d+)(?:-L(\d+))?$/i);
  if (!match) return null;

  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : start;

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start <= 0 || end <= 0) return null;

  return { start: Math.min(start, end), end: Math.max(start, end) };
}

function applyLineHighlight(range: LineRange) {
  const nodes = Array.from(document.querySelectorAll('[data-line-number]')) as unknown as LineNode[];

  nodes.forEach((node) => {
    node.removeAttribute('data-url-highlighted-line');
  });

  if (!range) return;

  let first: LineNode | null = null;

  nodes.forEach((node) => {
    const n = Number(node.getAttribute('data-line-number'));
    if (!Number.isFinite(n)) return;
    if (n < range.start || n > range.end) return;

    node.setAttribute('data-url-highlighted-line', '');
    if (!first) first = node;
  });

  // 첫 라인으로 스크롤 (이미 화면 안이면 굳이 강제하지 않음)
  const firstLine = first;
  if (firstLine) {
    const rect = (firstLine as any).getBoundingClientRect() as { top: number; bottom: number };
    const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!inView) {
      (firstLine as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

export function CodeUrlLineHighlighter() {
  const pathname = usePathname();

  React.useEffect(() => {
    const update = () => {
      applyLineHighlight(parseHashToLineRange(window.location.hash));
    };

    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [pathname]);

  return null;
}

