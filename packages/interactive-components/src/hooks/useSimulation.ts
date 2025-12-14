import * as React from 'react';

export interface UseSimulationOptions<S> {
  initialState: S;
  simulate: (state: S) => S;
  batchSize?: number;
  throttleMs?: number;
}

export type UseSimulationResult<S> = {
  state: S;
  isRunning: boolean;
  revision: number;
  totalIterations: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  reset: () => void;
};

export function useSimulation<S>(options: UseSimulationOptions<S>): UseSimulationResult<S> {
  const { initialState, simulate, batchSize = 100, throttleMs = 60 } = options;

  const [state, setState] = React.useState<S>(initialState);
  const [isRunning, setIsRunning] = React.useState(false);
  const [revision, setRevision] = React.useState(0);

  const totalIterationsRef = React.useRef(0);
  const timerRef = React.useRef<number | null>(null);

  const clear = React.useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stepBatch = React.useCallback(() => {
    setState((prev) => {
      let next = prev;
      for (let i = 0; i < batchSize; i++) {
        next = simulate(next);
      }
      totalIterationsRef.current += batchSize;
      return next;
    });
    setRevision((r) => r + 1);
  }, [batchSize, simulate]);

  const start = React.useCallback(() => setIsRunning(true), []);
  const stop = React.useCallback(() => setIsRunning(false), []);
  const toggle = React.useCallback(() => setIsRunning((v) => !v), []);

  const reset = React.useCallback(() => {
    totalIterationsRef.current = 0;
    setRevision(0);
    setState(initialState);
  }, [initialState]);

  React.useEffect(() => {
    if (!isRunning) {
      clear();
      return;
    }

    stepBatch();
    timerRef.current = window.setInterval(stepBatch, throttleMs);

    return clear;
  }, [clear, isRunning, stepBatch, throttleMs]);

  React.useEffect(() => clear, [clear]);

  return {
    state,
    isRunning,
    revision,
    totalIterations: totalIterationsRef.current,
    start,
    stop,
    toggle,
    reset,
  };
}

