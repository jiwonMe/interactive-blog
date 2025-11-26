export interface Candidate {
  index: number;
  value: number;
  rank: number;
}

export interface SimulationResult {
  isOptimal: boolean; // 최적 선택 여부
  selectedRank: number | null; // 선택된 후보의 순위 (1이 최고)
  percentile: number | null; // 선택된 후보의 백분위
  threshold: number; // 사용된 threshold
}

export interface RankBadge {
  text: string;
  color: string;
}

export interface CumulativeStats {
  totalRuns: number;
  successRate: number;
  top1Rate: number;
  top5Rate: number;
  top10Rate: number;
  avgPercentile: number;
}

