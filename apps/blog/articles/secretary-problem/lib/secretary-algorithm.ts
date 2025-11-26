import type { Candidate, RankBadge, SimulationResult, CumulativeStats } from './secretary-types';

/**
 * 후보자 생성 함수
 */
export function generateCandidates(numCandidates: number): Candidate[] {
  const newCandidates: Candidate[] = [];
  for (let i = 0; i < numCandidates; i++) {
    newCandidates.push({
      index: i,
      value: Math.random() * 100,
      rank: 0,
    });
  }
  
  // 랭크 계산 (값이 클수록 높은 랭크)
  const sorted = [...newCandidates].sort((a, b) => b.value - a.value);
  sorted.forEach((candidate, idx) => {
    candidate.rank = idx + 1;
  });
  
  return newCandidates;
}

/**
 * 비서문제 알고리즘으로 후보자 선택
 */
export function selectCandidate(
  candidates: Candidate[],
  threshold: number,
  numCandidates: number
): number | null {
  if (candidates.length === 0) return null;
  
  const observeCount = Math.floor(numCandidates * threshold);
  const observePhase = candidates.slice(0, observeCount);
  const selectionPhase = candidates.slice(observeCount);
  
  if (observePhase.length === 0 || selectionPhase.length === 0) {
    return null;
  }

  const maxObserved = Math.max(...observePhase.map(c => c.value));
  // 기준을 넘는 첫 번째 후보를 찾되, 없으면 마지막 후보를 선택
  const selected = selectionPhase.find(c => c.value > maxObserved);
  const finalSelected = selected ?? selectionPhase[selectionPhase.length - 1];
  
  return finalSelected?.index ?? null;
}

/**
 * 선택된 후보자의 등급 계산
 */
export function getSelectedRank(
  candidates: Candidate[],
  selectedIndex: number | null
): { rank: number; percentile: number } | null {
  if (selectedIndex === null || candidates.length === 0) return null;
  
  const selectedValue = candidates[selectedIndex].value;
  const sortedValues = [...candidates].map(c => c.value).sort((a, b) => b - a);
  const rank = sortedValues.findIndex(v => v === selectedValue) + 1;
  const percentile = (rank / candidates.length) * 100;
  
  return { rank, percentile };
}

/**
 * 등급 배지 정보 계산
 */
export function getRankBadge(
  selectedRank: { rank: number; percentile: number } | null
): RankBadge {
  if (!selectedRank) return { text: '-', color: 'text-zinc-500' };
  
  const { percentile } = selectedRank;
  if (percentile <= 1) return { text: 'Top 1%', color: 'text-red-600 dark:text-red-400' };
  if (percentile <= 5) return { text: 'Top 5%', color: 'text-orange-600 dark:text-orange-400' };
  if (percentile <= 10) return { text: 'Top 10%', color: 'text-amber-600 dark:text-amber-400' };
  return { text: `상위 ${percentile.toFixed(0)}%`, color: 'text-zinc-600 dark:text-zinc-400' };
}

/**
 * 최적 선택 여부 확인 (전체 후보 중 최고를 선택했는지)
 */
export function isOptimalSelection(
  candidates: Candidate[],
  selectedIndex: number | null
): boolean {
  if (selectedIndex === null || candidates.length === 0) return false;
  
  const bestCandidate = candidates.reduce(
    (best, c) => c.value > best.value ? c : best,
    candidates[0]
  );
  
  return candidates[selectedIndex] === bestCandidate;
}

/**
 * 시뮬레이션 결과 생성
 */
export function createSimulationResult(
  candidates: Candidate[],
  selectedIndex: number | null,
  threshold: number
): SimulationResult {
  const bestInAll = candidates.reduce(
    (best, c) => c.value > best.value ? c : best,
    candidates[0]
  );
  const isOptimal = selectedIndex !== null && candidates[selectedIndex] === bestInAll;

  let rankInfo = null;
  if (selectedIndex !== null) {
    const selectedValue = candidates[selectedIndex].value;
    const sortedValues = [...candidates].map(c => c.value).sort((a, b) => b - a);
    const rank = sortedValues.findIndex(v => v === selectedValue) + 1;
    const percentile = (rank / candidates.length) * 100;
    rankInfo = { rank, percentile };
  }

  return {
    isOptimal,
    selectedRank: rankInfo?.rank ?? null,
    percentile: rankInfo?.percentile ?? null,
    threshold,
  };
}

/**
 * 누적 통계 계산
 */
export function calculateCumulativeStats(history: SimulationResult[]): CumulativeStats {
  return {
    totalRuns: history.length,
    successRate: history.length > 0 
      ? (history.filter(h => h.isOptimal).length / history.length) * 100 
      : 0,
    top1Rate: history.length > 0
      ? (history.filter(h => h.percentile !== null && h.percentile <= 1).length / history.length) * 100
      : 0,
    top5Rate: history.length > 0
      ? (history.filter(h => h.percentile !== null && h.percentile <= 5).length / history.length) * 100
      : 0,
    top10Rate: history.length > 0
      ? (history.filter(h => h.percentile !== null && h.percentile <= 10).length / history.length) * 100
      : 0,
    avgPercentile: history.length > 0
      ? history.reduce((sum, h) => sum + (h.percentile ?? 100), 0) / history.length
      : 0,
  };
}

