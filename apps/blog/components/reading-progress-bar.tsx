'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getScrollProgress() {
  const el = document.documentElement;
  const max = Math.max(1, el.scrollHeight - window.innerHeight);
  return clamp01(window.scrollY / max);
}

export function ReadingProgressBar() {
  const pathname = usePathname();
  const isPost = pathname.startsWith('/posts/');

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!isPost) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      setProgress(getScrollProgress());
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isPost]);

  if (!isPost) return null;

  return (
    <div
      className={cn(
        /* layout */
        'fixed top-0 left-0 right-0 z-[60] h-0.5',
        /* background */
        'bg-transparent'
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          /* layout */
          'h-full origin-left',
          /* color */
          'bg-blue-600/80 dark:bg-blue-400/80'
        )}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

