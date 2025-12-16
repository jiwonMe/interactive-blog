import * as React from 'react';

export interface UseAnimationFrameOptions {
  enabled?: boolean;
  onFrame: (deltaMs: number) => void;
}

export function useAnimationFrame(options: UseAnimationFrameOptions) {
  const { enabled = true, onFrame } = options;

  const rafIdRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const loop = (ts: number) => {
      const last = lastTsRef.current;
      lastTsRef.current = ts;
      if (last != null) onFrame(ts - last);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTsRef.current = null;
    };
  }, [enabled, onFrame]);
}



