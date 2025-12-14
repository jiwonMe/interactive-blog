"use client";

import React, { useState, useCallback } from "react";
import { cn } from "../../../lib/utils";
import { useRope } from "./use-rope";
import { RopeTreeView } from "./RopeTreeView";
import { CellArray } from "./CellArray";

/**
 * Rope 자료구조 시각화 메인 컴포넌트
 */
export function RopeVisualizer() {
  const {
    text,
    treeData,
    height,
    nodeCount,
    selectedNodeId,
    lastOperation,
    // 탐색 관련
    isSearching,
    searchPath,
    currentStep,
    searchPathNodeIds,
    // 함수
    appendText,
    selectNode,
    reset,
    searchAndInsert,
  } = useRope();

  // 삽입 폼 상태
  const [insertPosition, setInsertPosition] = useState(5);
  const [newText, setNewText] = useState("New");

  // 셀 클릭으로 삽입 위치 선택
  const handleCellClick = useCallback((index: number) => {
    setInsertPosition(index);
  }, []);

  const handleSearchAndInsert = () => {
    if (newText.length === 0 || isSearching) return;
    searchAndInsert(insertPosition, newText);
  };

  const handleAppend = () => {
    if (newText.length === 0 || isSearching) return;
    appendText(newText);
  };

  // 문자열을 배열로 변환
  const textArray = text.split("");

  // 현재 탐색 노드 ID
  const currentSearchNodeId = currentStep?.nodeId ?? null;

  return (
    <div
      className={cn(
        // layout
        "w-full rounded-2xl overflow-hidden",
        // border
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* 헤더 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-zinc-100 dark:bg-zinc-900",
          // border
          "border-b border-zinc-200 dark:border-zinc-800"
        )}
      >
        <h3
          className={cn(
            // typography
            "text-lg font-semibold",
            // color
            "text-zinc-900 dark:text-zinc-100"
          )}
        >
          Rope 트리 시각화
        </h3>
        <p
          className={cn(
            // typography
            "text-sm mt-1",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          문자열을 트리 구조로 관리하여 O(log n) 삽입을 달성
        </p>
      </div>

      {/* 메인 영역 */}
      <div
        className={cn(
          // layout
          "p-5 space-y-4",
          // background
          "bg-white dark:bg-zinc-950"
        )}
      >
        {/* 트리 시각화 */}
        <RopeTreeView
          data={treeData}
          selectedNodeId={selectedNodeId}
          onNodeClick={selectNode}
          searchPathNodeIds={searchPathNodeIds}
          currentSearchNodeId={currentSearchNodeId}
        />

        {/* 탐색 상태 표시 */}
        {isSearching && currentStep && (
          <SearchStatus
            currentStep={currentStep}
            stepIndex={searchPath.indexOf(currentStep)}
            totalSteps={searchPath.length}
          />
        )}

        {/* 결과 문자열 (클릭으로 삽입 위치 선택) */}
        <CellArray
          label={`결과 문자열 (길이: ${text.length})`}
          array={textArray}
          clickable={!isSearching}
          onCellClick={handleCellClick}
          selectedPosition={insertPosition}
        />

        {/* 컨트롤 패널 */}
        <ControlPanel
          insertPosition={insertPosition}
          newText={newText}
          setNewText={setNewText}
          onInsert={handleSearchAndInsert}
          onAppend={handleAppend}
          onReset={reset}
          isSearching={isSearching}
        />

        {/* 정보 패널 */}
        <InfoPanel
          height={height}
          nodeCount={nodeCount}
          lastOperation={lastOperation}
        />
      </div>

      {/* 하단 설명 */}
      <div
        className={cn(
          // layout
          "px-5 py-4",
          // background
          "bg-zinc-50 dark:bg-zinc-900",
          // border
          "border-t border-zinc-200 dark:border-zinc-800"
        )}
      >
        <ExplanationSection />
      </div>
    </div>
  );
}

/**
 * 탐색 상태 표시 컴포넌트
 */
function SearchStatus({
  currentStep,
  stepIndex,
  totalSteps,
}: {
  currentStep: { comparison: string; direction: string };
  stepIndex: number;
  totalSteps: number;
}) {
  return (
    <div
      className={cn(
        // layout
        "px-4 py-3 rounded-lg",
        // background
        "bg-amber-50 dark:bg-amber-950/30",
        // border
        "border border-amber-200 dark:border-amber-800"
      )}
    >
      <div
        className={cn(
          // layout
          "flex items-center gap-3"
        )}
      >
        {/* 단계 표시 */}
        <span
          className={cn(
            // layout
            "px-2 py-1 rounded",
            // background
            "bg-amber-100 dark:bg-amber-900/50",
            // typography
            "text-xs font-bold font-mono",
            // color
            "text-amber-700 dark:text-amber-300"
          )}
        >
          {stepIndex + 1} / {totalSteps}
        </span>

        {/* 비교 설명 */}
        <span
          className={cn(
            // typography
            "text-sm font-mono",
            // color
            "text-amber-800 dark:text-amber-200"
          )}
        >
          {currentStep.comparison}
        </span>

        {/* O(log n) 배지 */}
        <span
          className={cn(
            // layout
            "ml-auto px-2 py-1 rounded",
            // background
            "bg-amber-100 dark:bg-amber-900/50",
            // typography
            "text-xs font-bold",
            // color
            "text-amber-700 dark:text-amber-300"
          )}
        >
          O(log n) 탐색
        </span>
      </div>
    </div>
  );
}

/**
 * 컨트롤 패널
 */
function ControlPanel({
  insertPosition,
  newText,
  setNewText,
  onInsert,
  onAppend,
  onReset,
  isSearching,
}: {
  insertPosition: number;
  newText: string;
  setNewText: (v: string) => void;
  onInsert: () => void;
  onAppend: () => void;
  onReset: () => void;
  isSearching: boolean;
}) {
  return (
    <div
      className={cn(
        // layout
        "space-y-3"
      )}
    >
      {/* 입력 영역 */}
      <div className="space-y-1">
        <label
          className={cn(
            // typography
            "text-xs font-medium",
            // color
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          삽입할 텍스트
        </label>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="New"
          disabled={isSearching}
          className={cn(
            // layout
            "w-full px-3 py-1.5 rounded-md",
            // typography
            "text-sm font-mono",
            // background
            "bg-white dark:bg-zinc-800",
            // border
            "border border-zinc-300 dark:border-zinc-600",
            // color
            "text-zinc-700 dark:text-zinc-300",
            // focus
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
            // disabled
            "disabled:opacity-50"
          )}
        />
      </div>

      {/* 버튼 영역 */}
      <div
        className={cn(
          // layout
          "flex items-center gap-2 flex-wrap"
        )}
      >
        <button
          onClick={onInsert}
          disabled={newText.length === 0 || isSearching}
          className={cn(
            // layout
            "px-4 py-2 rounded-lg",
            // typography
            "text-sm font-medium",
            // background
            "bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300",
            // color
            "text-white dark:text-zinc-900",
            // transition
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          탐색 후 삽입
        </button>

        <button
          onClick={onAppend}
          disabled={newText.length === 0 || isSearching}
          className={cn(
            // layout
            "px-4 py-2 rounded-lg",
            // typography
            "text-sm font-medium",
            // background
            "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600",
            // color
            "text-zinc-700 dark:text-zinc-300",
            // transition
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          끝에 연결 (Concat)
        </button>

        {/* 삽입 위치 표시 */}
        <span
          className={cn(
            // layout
            "px-2 py-1 rounded",
            // background
            "bg-zinc-100 dark:bg-zinc-800",
            // typography
            "text-xs font-mono",
            // color
            "text-zinc-600 dark:text-zinc-400"
          )}
        >
          삽입 위치: {insertPosition}
        </span>

        <div className="flex-1" />

        <button
          onClick={onReset}
          disabled={isSearching}
          className={cn(
            // layout
            "px-4 py-2 rounded-lg",
            // typography
            "text-sm font-medium",
            // background
            "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600",
            // color
            "text-zinc-700 dark:text-zinc-300",
            // transition
            "transition-colors",
            // disabled
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          초기화
        </button>
      </div>
    </div>
  );
}

/**
 * 정보 패널
 */
function InfoPanel({
  height,
  nodeCount,
  lastOperation,
}: {
  height: number;
  nodeCount: number;
  lastOperation: string | null;
}) {
  return (
    <div
      className={cn(
        // layout
        "grid grid-cols-3 gap-3"
      )}
    >
      <InfoCard label="트리 높이" value={String(height)} />
      <InfoCard label="노드 개수" value={String(nodeCount)} />
      <InfoCard
        label="마지막 연산"
        value={lastOperation || "-"}
        isText
      />
    </div>
  );
}

function InfoCard({
  label,
  value,
  isText = false,
}: {
  label: string;
  value: string;
  isText?: boolean;
}) {
  return (
    <div
      className={cn(
        // layout
        "px-3 py-2 rounded-lg",
        // background
        "bg-zinc-100 dark:bg-zinc-800"
      )}
    >
      <div
        className={cn(
          // typography
          "text-xs",
          // color
          "text-zinc-500 dark:text-zinc-400"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          // typography
          isText ? "text-xs" : "text-lg font-bold font-mono",
          // color
          "text-zinc-700 dark:text-zinc-300",
          // truncate
          isText && "truncate"
        )}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * 하단 설명 섹션
 */
function ExplanationSection() {
  const items = [
    { label: "○ 내부 노드", desc: "서브트리 길이 저장" },
    { label: "□ 리프 노드", desc: "실제 문자열 저장" },
    { label: "삽입 O(log n)", desc: "Split + Concat" },
  ];

  return (
    <div
      className={cn(
        // layout
        "grid grid-cols-1 md:grid-cols-3 gap-3"
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            // layout
            "p-2 rounded-lg",
            // background
            "bg-white dark:bg-zinc-800"
          )}
        >
          <span
            className={cn(
              // typography
              "text-xs font-semibold",
              // color
              "text-zinc-700 dark:text-zinc-300"
            )}
          >
            {item.label}
          </span>
          <p
            className={cn(
              // typography
              "text-xs mt-0.5",
              // color
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
