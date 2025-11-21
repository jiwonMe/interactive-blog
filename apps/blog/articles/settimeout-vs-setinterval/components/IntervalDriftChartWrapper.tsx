'use client';

import dynamic from 'next/dynamic';

const IntervalDriftChart = dynamic(
  () => import('./IntervalDriftChart').then(mod => mod.IntervalDriftChart),
  { ssr: false }
);

export function IntervalDriftChartWrapper(props: any) {
  return <IntervalDriftChart {...props} />;
}

export default IntervalDriftChartWrapper;

