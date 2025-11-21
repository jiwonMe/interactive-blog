'use client';

import dynamic from 'next/dynamic';

const TimerAccuracyTester = dynamic(
  () => import('./TimerAccuracyTester').then((mod) => mod.TimerAccuracyTester),
  { ssr: false }
);

export function TimerAccuracyTesterWrapper() {
  return <TimerAccuracyTester />;
}

