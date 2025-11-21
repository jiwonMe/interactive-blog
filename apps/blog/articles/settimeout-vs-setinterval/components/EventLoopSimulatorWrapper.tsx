'use client';

import dynamic from 'next/dynamic';

const EventLoopSimulator = dynamic(
  () => import('./EventLoopSimulator').then(mod => mod.EventLoopSimulator),
  { ssr: false }
);

export function EventLoopSimulatorWrapper(props: any) {
  return <EventLoopSimulator {...props} />;
}

export default EventLoopSimulatorWrapper;

