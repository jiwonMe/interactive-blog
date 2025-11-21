'use client';

import dynamic from 'next/dynamic';

const MemoryLeakVisualizer = dynamic(
  () => import('./MemoryLeakVisualizer').then((mod) => mod.MemoryLeakVisualizer),
  { ssr: false }
);

export function MemoryLeakVisualizerWrapper() {
  return <MemoryLeakVisualizer />;
}

