import * as React from 'react';

export type PlaybackAutoStop = {
  afterTicks?: number;
  afterMs?: number;
};

export interface UsePlaybackOptions {
  tickInterval: number;
  onTick: (info: { ticks: number; elapsedMs: number }) => void;
  autoStop?: PlaybackAutoStop;
}

export function usePlayback(options: UsePlaybackOptions) {
  const { tickInterval, onTick, autoStop } = options;

  const [isPlaying, setIsPlaying] = React.useState(false);
  const ticksRef = React.useRef(0);
  const startTimeRef = React.useRef<number | null>(null);
  const timerRef = React.useRef<number | null>(null);

  const clear = React.useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tickOnce = React.useCallback(() => {
    ticksRef.current += 1;
    if (startTimeRef.current == null) startTimeRef.current = Date.now();
    const elapsedMs = Date.now() - startTimeRef.current;
    onTick({ ticks: ticksRef.current, elapsedMs });

    const shouldStopByTicks = autoStop?.afterTicks != null && ticksRef.current >= autoStop.afterTicks;
    const shouldStopByTime = autoStop?.afterMs != null && elapsedMs >= autoStop.afterMs;

    return shouldStopByTicks || shouldStopByTime;
  }, [autoStop?.afterMs, autoStop?.afterTicks, onTick]);

  const play = React.useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
  }, [isPlaying]);

  const pause = React.useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsPlaying((v) => !v);
  }, []);

  const reset = React.useCallback(() => {
    ticksRef.current = 0;
    startTimeRef.current = null;
  }, []);

  const step = React.useCallback(() => {
    const shouldStop = tickOnce();
    if (shouldStop) setIsPlaying(false);
  }, [tickOnce]);

  React.useEffect(() => {
    if (!isPlaying) {
      clear();
      return;
    }

    // 즉시 1틱 실행하고, 이후 interval로 진행
    const shouldStopImmediately = tickOnce();
    if (shouldStopImmediately) {
      setIsPlaying(false);
      return;
    }

    timerRef.current = window.setInterval(() => {
      const shouldStop = tickOnce();
      if (shouldStop) setIsPlaying(false);
    }, tickInterval);

    return clear;
  }, [clear, isPlaying, tickInterval, tickOnce]);

  React.useEffect(() => clear, [clear]);

  return {
    isPlaying,
    play,
    pause,
    toggle,
    reset,
    step,
    get ticks() {
      return ticksRef.current;
    },
  };
}

