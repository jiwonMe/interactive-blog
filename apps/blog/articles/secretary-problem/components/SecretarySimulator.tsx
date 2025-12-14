'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SimulationPanel,
  Button,
  Slider,
  StatsDisplay,
} from '@repo/interactive-components';
import { cn } from '../../../lib/utils';
import type { Candidate, SimulationResult, CumulativeStats } from '../lib/secretary-types';
import {
  generateCandidates as createCandidates,
  selectCandidate,
  getSelectedRank,
  getRankBadge,
  isOptimalSelection,
  createSimulationResult,
  calculateCumulativeStats,
} from '../lib/secretary-algorithm';
import { SecretaryCandidateChart } from './SecretaryCandidateChart';

interface SecretarySimulatorProps {
  numCandidates?: number;
}

/**
 * 비서문제(Secretary Problem) 시뮬레이터
 * @repo/interactive-components를 사용한 새로운 구현
 */
export function SecretarySimulator({
  numCandidates = 10,
}: SecretarySimulatorProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [threshold, setThreshold] = useState(0.37);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<SimulationResult[]>([]);
  const isInitialMount = useRef(true);
  const shouldRecordRef = useRef(false);

  // 후보자 생성 함수
  const generateCandidates = useCallback(() => {
    const newCandidates = createCandidates(numCandidates);
    setCandidates(newCandidates);
    
    if (!isInitialMount.current) {
      shouldRecordRef.current = true;
    }
  }, [numCandidates]);

  // 히스토리 리셋
  const resetHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // 후보자 초기 생성
  useEffect(() => {
    generateCandidates();
    isInitialMount.current = false;
  }, [generateCandidates]);

  // 선택된 후보 계산
  useEffect(() => {
    if (candidates.length === 0) return;
    
    const selected = selectCandidate(candidates, threshold, numCandidates);
    setSelectedIndex(selected);
  }, [candidates, threshold, numCandidates]);

  // 결과를 히스토리에 기록
  useEffect(() => {
    if (candidates.length === 0 || !shouldRecordRef.current) return;

    const result = createSimulationResult(candidates, selectedIndex, threshold);
    setHistory(prev => [...prev, result]);
    shouldRecordRef.current = false;
  }, [selectedIndex, candidates, threshold]);

  // 통계 계산
  const observeCount = Math.floor(numCandidates * threshold);
  const observePhase = candidates.slice(0, observeCount);
  const maxObserved = observePhase.length > 0 
    ? Math.max(...observePhase.map(c => c.value)) 
    : 0;
  const isOptimal = isOptimalSelection(candidates, selectedIndex);
  const selectedRank = getSelectedRank(candidates, selectedIndex);
  const rankBadge = getRankBadge(selectedRank);
  const stats = calculateCumulativeStats(history);

  // 현재 결과 통계 아이템
  const currentStatsItems = useMemo(() => [
    { key: 'observe-ratio', label: '관찰 비율', value: `${(threshold * 100).toFixed(1)}%` },
    { key: 'observe-count', label: '관찰 인원', value: `${observeCount}명` },
    { key: 'selected', label: '선택 결과', value: selectedIndex !== null ? `${selectedIndex + 1}번` : '선택 실패' },
    { key: 'rank', label: '선택 등급', value: rankBadge.text },
    { key: 'optimal', label: '최적 선택', value: isOptimal ? '성공 ✓' : '실패 ✗' },
  ], [threshold, observeCount, selectedIndex, rankBadge.text, isOptimal]);

  // 누적 통계 아이템
  const cumulativeStatsItems = useMemo(() => {
    if (stats.totalRuns === 0) return [];
    return [
      { key: 'success-rate', label: '최적 선택 성공률', value: `${stats.successRate.toFixed(1)}%` },
      { key: 'top1-rate', label: 'Top 1% 달성률', value: `${stats.top1Rate.toFixed(1)}%` },
      { key: 'top5-rate', label: 'Top 5% 달성률', value: `${stats.top5Rate.toFixed(1)}%` },
      { key: 'top10-rate', label: 'Top 10% 달성률', value: `${stats.top10Rate.toFixed(1)}%` },
      { key: 'avg-percentile', label: '평균 선택 등급', value: `상위 ${stats.avgPercentile.toFixed(1)}%` },
    ];
  }, [stats]);

  return (
    <SimulationPanel
      title="비서문제 시뮬레이터"
      description="최적 멈춤 이론(Optimal Stopping Theory)을 시각화합니다. 슬라이더를 조절하여 관찰 비율을 변경해보세요."
    >
      <SimulationPanel.Visualization>
        <SecretaryCandidateChart
          candidates={candidates}
          selectedIndex={selectedIndex}
          observeCount={observeCount}
          maxObserved={maxObserved}
        />
      </SimulationPanel.Visualization>

      <SimulationPanel.Controls>
        <div
          className={cn(
            /* 레이아웃 */
            'space-y-4',
          )}
        >
          {/* 관찰 비율 슬라이더 */}
          <div
            className={cn(
              /* 레이아웃 */
              'space-y-2',
            )}
          >
            <Slider
              label={`관찰 비율: ${(threshold * 100).toFixed(0)}%`}
              min={10}
              max={90}
              step={1}
              value={threshold * 100}
              onValueChange={(v) => setThreshold(v / 100)}
            />
            <p
              className={cn(
                /* 텍스트 */
                'text-xs',
                'text-zinc-500 dark:text-zinc-400',
              )}
            >
              💡 최적 비율은 약 37% (1/e)입니다
            </p>
          </div>

          {/* 액션 버튼 */}
          <div
            className={cn(
              /* 레이아웃 */
              'flex flex-wrap gap-3',
            )}
          >
            <Button variant="primary" onClick={generateCandidates}>
              새로운 후보자 생성
            </Button>
            <Button variant="secondary" onClick={resetHistory}>
              통계 초기화
            </Button>
          </div>

          {/* 현재 결과 통계 */}
          <StatsDisplay
            title="현재 결과"
            items={currentStatsItems}
          />

          {/* 누적 통계 */}
          {stats.totalRuns > 0 && (
            <StatsDisplay
              title={`누적 통계 (${stats.totalRuns}회)`}
              items={cumulativeStatsItems}
            />
          )}
        </div>
      </SimulationPanel.Controls>

      <SimulationPanel.Stats>
        {/* 색상 범례 */}
        <div
          className={cn(
            /* 레이아웃 */
            'p-3 rounded-md border space-y-2',
            /* 배경 */
            'bg-zinc-50 dark:bg-zinc-900/50',
            /* 테두리 */
            'border-zinc-200 dark:border-zinc-800',
          )}
        >
          <div
            className={cn(
              /* 텍스트 */
              'text-xs font-medium',
              'text-zinc-600 dark:text-zinc-400',
            )}
          >
            색상 범례
          </div>
          <div
            className={cn(
              /* 레이아웃 */
              'flex flex-wrap gap-3 text-xs',
            )}
          >
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-400" />
              <span className="text-zinc-600 dark:text-zinc-400">관찰 단계</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-800" />
              <span className="text-zinc-600 dark:text-zinc-400">관찰 최댓값</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-zinc-300" />
              <span className="text-zinc-600 dark:text-zinc-400">선택 단계</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-lime-500" />
              <span className="text-zinc-600 dark:text-zinc-400">최종 선택</span>
            </span>
          </div>
          <div
            className={cn(
              /* 레이아웃 */
              'flex flex-wrap gap-3 text-xs pt-2 border-t',
              /* 테두리 */
              'border-zinc-200 dark:border-zinc-800',
            )}
          >
            <span className="flex items-center gap-1">
              <span className="w-6 border-t-2 border-red-600 border-dashed" />
              <span className="text-red-600 dark:text-red-400">Top 1%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-6 border-t-2 border-orange-600 border-dashed" />
              <span className="text-orange-600 dark:text-orange-400">Top 5%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-6 border-t-2 border-amber-600 border-dashed" />
              <span className="text-amber-600 dark:text-amber-400">Top 10%</span>
            </span>
          </div>
        </div>
      </SimulationPanel.Stats>
    </SimulationPanel>
  );
}
