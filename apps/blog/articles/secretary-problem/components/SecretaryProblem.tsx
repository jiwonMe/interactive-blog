'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import type { Candidate, SimulationResult } from '../lib/secretary-types';
import {
  generateCandidates as createCandidates,
  selectCandidate,
  getSelectedRank,
  getRankBadge,
  isOptimalSelection,
  createSimulationResult,
  calculateCumulativeStats,
} from '../lib/secretary-algorithm';
import { SecretaryVisualization } from './SecretaryVisualization';
import { SecretaryStats } from './SecretaryStats';
import { SecretaryCumulativeStats } from './SecretaryCumulativeStats';

interface SecretaryProblemProps {
  numCandidates?: number;
  speed?: number;
  autoPlay?: boolean;
}

/**
 * 비서문제(Secretary Problem) 시각화 컴포넌트
 * 최적 멈춤 이론(Optimal Stopping Theory)을 d3.js로 인터랙티브하게 시각화합니다.
 */
export function SecretaryProblem({
  numCandidates = 10,
  speed = 1000,
  autoPlay = false,
}: SecretaryProblemProps) {
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
    
    // 초기 마운트가 아닐 때만 기록
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
  const isOptimal = isOptimalSelection(candidates, selectedIndex);
  const selectedRank = getSelectedRank(candidates, selectedIndex);
  const rankBadge = getRankBadge(selectedRank);
  const stats = calculateCumulativeStats(history);

  return (
    <div
      className="
        /* 레이아웃 */
        w-full flex flex-col items-center gap-6 p-6 rounded-lg
        /* 배경 */
        bg-white dark:bg-zinc-900
        /* 테두리 */
        border border-zinc-200 dark:border-zinc-800
      "
    >
      {/* D3 시각화 */}
      <SecretaryVisualization
        candidates={candidates}
        selectedIndex={selectedIndex}
        threshold={threshold}
        numCandidates={numCandidates}
        onThresholdChange={setThreshold}
      />
      
      <div className="w-full max-w-3xl space-y-4">
        {/* 현재 결과 통계 */}
        <SecretaryStats
          threshold={threshold}
          observeCount={observeCount}
          selectedIndex={selectedIndex}
          rankBadge={rankBadge}
          isOptimal={isOptimal}
        />

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={generateCandidates}
            className={cn(
              /* 레이아웃 */
              "py-3 px-6 rounded-lg",
              /* 배경 */
              "bg-blue-600 dark:bg-blue-500",
              /* 텍스트 */
              "text-white font-semibold text-sm",
              /* 인터랙션 */
              "hover:bg-blue-700 dark:hover:bg-blue-600",
              "active:scale-[0.98]",
              /* 애니메이션 */
              "transition-all duration-150",
              /* 포커스 */
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            )}
          >
            🔄 새로운 후보자 생성
          </button>

          <button
            onClick={resetHistory}
            className={cn(
              /* 레이아웃 */
              "py-3 px-6 rounded-lg",
              /* 배경 */
              "bg-zinc-200 dark:bg-zinc-700",
              /* 텍스트 */
              "text-zinc-700 dark:text-zinc-200 font-semibold text-sm",
              /* 인터랙션 */
              "hover:bg-zinc-300 dark:hover:bg-zinc-600",
              "active:scale-[0.98]",
              /* 애니메이션 */
              "transition-all duration-150",
              /* 포커스 */
              "focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            )}
          >
            🔄 통계 초기화
          </button>
        </div>

        {/* 누적 통계 */}
        <SecretaryCumulativeStats stats={stats} />
      </div>

      {/* 설명 */}
      <div
        className="
          /* 레이아웃 */
          text-center space-y-3
          /* 텍스트 */
          text-sm text-zinc-600 dark:text-zinc-400
        "
      >
        <p className="font-medium">💡 슬라이더를 드래그하여 관찰 단계 비율을 조정해보세요</p>
        <div className="space-y-2">
          <p>
            최적 비율은 약 37% (1/e)입니다. 
            <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">파란색</span>은 관찰 단계,
            <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">회색</span>은 선택 단계,
            <span className="ml-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">녹색</span>은 최종 선택을 의미합니다.
          </p>
          <p className="text-xs">
            <span className="inline-block w-12 border-t-2 border-red-600 border-dashed align-middle mr-1"></span>
            <span className="text-red-600 dark:text-red-400 font-semibold">Top 1%</span>
            <span className="mx-2">·</span>
            <span className="inline-block w-12 border-t-2 border-orange-600 border-dashed align-middle mr-1"></span>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">Top 5%</span>
            <span className="mx-2">·</span>
            <span className="inline-block w-12 border-t-2 border-amber-600 border-dashed align-middle mr-1"></span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Top 10%</span>
            <span className="ml-2 text-zinc-500">기준선</span>
          </p>
          <p className="text-xs opacity-80">
            ℹ️ 알고리즘: 관찰 단계 후 기준을 넘는 첫 번째 후보를 선택하며, 없으면 마지막 후보를 선택합니다.
            "최적 선택"은 전체 후보 중 최고를 선택했는지를 나타냅니다.
          </p>
        </div>
      </div>
    </div>
  );
}

