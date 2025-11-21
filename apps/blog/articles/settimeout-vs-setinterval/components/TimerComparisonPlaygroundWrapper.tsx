'use client';

import dynamic from 'next/dynamic';

const TimerComparisonPlayground = dynamic(
  () => import('./TimerComparisonPlayground').then((mod) => mod.TimerComparisonPlayground),
  { ssr: false }
);

export function TimerComparisonPlaygroundWrapper() {
  return <TimerComparisonPlayground />;
}

