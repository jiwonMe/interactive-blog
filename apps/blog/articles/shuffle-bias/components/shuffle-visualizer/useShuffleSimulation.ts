'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Algorithm } from '../../lib/algorithms';

type CreateBaseArray = (n: number) => number[];

const createBaseArray: CreateBaseArray = (n) => Array.from({ length: n }, (_, i) => i);

const clampInt = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.floor(value)));

const isPermutation0ToNMinus1 = (arr: unknown, n: number): arr is number[] => {
  if (!Array.isArray(arr)) return false;
  if (arr.length !== n) return false;

  const seen = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const v = arr[i];
    if (typeof v !== 'number') return false;
    if (!Number.isInteger(v)) return false;
    if (v < 0 || v >= n) return false;
    if (seen[v] === 1) return false;
    seen[v] = 1;
  }
  return true;
};

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'error';

export type UseShuffleSimulationParams = {
  algo: Algorithm | null;
  n: number;
  batchSize: number;
  throttleMs: number;
  autoStop: boolean;
  targetTrials: number | null;
};

export type UseShuffleSimulationResult = {
  countsRef: React.MutableRefObject<Uint32Array>;
  totalTrials: number;
  expectedPerCell: number;
  revision: number;
  status: SimulationStatus;
  error: string | null;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
};

export function useShuffleSimulation({
  algo,
  n,
  batchSize,
  throttleMs,
  autoStop,
  targetTrials,
}: UseShuffleSimulationParams): UseShuffleSimulationResult {
  const safeN = useMemo(() => clampInt(n, 2, 200), [n]);
  const safeBatchSize = useMemo(() => clampInt(batchSize, 1, 50_000), [batchSize]);

  const requestRef = useRef<number>(0);
  const lastCommitAtRef = useRef<number>(0);
  const totalTrialsRef = useRef<number>(0);
  const baseArrayRef = useRef<number[]>(createBaseArray(safeN));

  const countsRef = useRef<Uint32Array>(new Uint32Array(safeN * safeN));

  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [totalTrials, setTotalTrials] = useState(0);
  const [revision, setRevision] = useState(0);

  const expectedPerCell = useMemo(
    () => (safeN > 0 ? totalTrials / safeN : 0),
    [safeN, totalTrials],
  );

  const cancelLoop = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = 0;
  }, []);

  const commitUi = useCallback(() => {
    setTotalTrials(totalTrialsRef.current);
    setRevision((r) => r + 1);
  }, []);

  const reset = useCallback(() => {
    cancelLoop();
    countsRef.current = new Uint32Array(safeN * safeN);
    totalTrialsRef.current = 0;
    lastCommitAtRef.current = 0;
    baseArrayRef.current = createBaseArray(safeN);
    setError(null);
    setStatus('idle');
    setTotalTrials(0);
    setRevision((r) => r + 1);
  }, [cancelLoop, safeN]);

  const pause = useCallback(() => {
    cancelLoop();
    setStatus((s) => (s === 'running' ? 'paused' : s));
  }, [cancelLoop]);

  const start = useCallback(() => {
    if (!algo) return;
    if (error) return;
    setStatus('running');
  }, [algo, error]);

  const toggle = useCallback(() => {
    setStatus((s) => {
      if (!algo || error) return s;
      if (s === 'running') return 'paused';
      return 'running';
    });
  }, [algo, error]);

  const animate = useCallback(() => {
    if (!algo) return;
    if (status !== 'running') return;

    const now = performance.now();
    const counts = countsRef.current;
    const base = baseArrayRef.current;

    const target = autoStop && targetTrials && targetTrials > 0 ? targetTrials : null;
    const remaining = target ? Math.max(0, target - totalTrialsRef.current) : null;
    const iterations = remaining === null ? safeBatchSize : Math.min(safeBatchSize, remaining);

    if (iterations <= 0) {
      cancelLoop();
      setStatus('paused');
      commitUi();
      return;
    }

    for (let k = 0; k < iterations; k++) {
      // 커스텀 알고리즘이 입력 배열을 직접 변조하는 경우를 방지하기 위해 복사본을 전달합니다.
      const shuffled = algo.shuffle([...base]);
      if (k === 0 && !isPermutation0ToNMinus1(shuffled, safeN)) {
        cancelLoop();
        setError('셔플 함수는 0..N-1의 순열(중복 없음)을 반환해야 합니다.');
        setStatus('error');
        commitUi();
        return;
      }

      for (let pos = 0; pos < safeN; pos++) {
        const element = shuffled[pos];
        counts[element * safeN + pos] += 1;
      }
    }

    totalTrialsRef.current += iterations;

    if (now - lastCommitAtRef.current >= throttleMs) {
      lastCommitAtRef.current = now;
      commitUi();
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [
    algo,
    autoStop,
    cancelLoop,
    commitUi,
    safeBatchSize,
    safeN,
    status,
    targetTrials,
    throttleMs,
  ]);

  useEffect(() => {
    if (!algo) {
      pause();
      return;
    }
    if (status === 'running') {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelLoop();
    }
    cancelLoop();
    return;
  }, [algo, animate, cancelLoop, pause, status]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeN, algo?.id]);

  useEffect(() => {
    if (!error) return;
    cancelLoop();
  }, [cancelLoop, error]);

  return {
    countsRef,
    totalTrials,
    expectedPerCell,
    revision,
    status,
    error,
    start,
    pause,
    toggle,
    reset,
  };
}


