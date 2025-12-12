'use client';

export type BiasSummary = {
  expectedPerCell: number;
  minRatio: number;
  maxRatio: number;
  chiSquare: number;
  maxCell: {
    element: number;
    position: number;
    count: number;
    ratio: number;
  };
};

export const computeBiasSummary = (params: {
  counts: Uint32Array;
  n: number;
  totalTrials: number;
}): BiasSummary | null => {
  const { counts, n, totalTrials } = params;
  if (n <= 0) return null;
  if (totalTrials <= 0) return null;
  if (counts.length < n * n) return null;

  const expected = totalTrials / n;
  if (expected <= 0) return null;

  let minRatio = Number.POSITIVE_INFINITY;
  let maxRatio = Number.NEGATIVE_INFINITY;
  let chiSquare = 0;
  let maxIdx = 0;
  let maxCount = -1;

  const cellCount = n * n;
  for (let idx = 0; idx < cellCount; idx++) {
    const c = counts[idx] ?? 0;
    const diff = c - expected;
    chiSquare += (diff * diff) / expected;

    const ratio = c / expected;
    if (ratio < minRatio) minRatio = ratio;
    if (ratio > maxRatio) maxRatio = ratio;
    if (c > maxCount) {
      maxCount = c;
      maxIdx = idx;
    }
  }

  const element = Math.floor(maxIdx / n);
  const position = maxIdx % n;

  return {
    expectedPerCell: expected,
    minRatio,
    maxRatio,
    chiSquare,
    maxCell: {
      element,
      position,
      count: maxCount,
      ratio: maxCount / expected,
    },
  };
};



