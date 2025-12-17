import * as React from 'react';

export type UseResizeObserverSize = {
  width: number;
  height: number;
};

export interface UseResizeObserverOptions {
  enabled?: boolean;
}

export function useResizeObserver<T extends Element>(options: UseResizeObserverOptions = {}) {
  const { enabled = true } = options;

  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState<UseResizeObserverSize>({ width: 0, height: 0 });

  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const box = entry.contentRect;
      setSize({ width: box.width, height: box.height });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled]);

  return { ref, size };
}




