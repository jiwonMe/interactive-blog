'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { ALGORITHMS, type Algorithm } from '../lib/algorithms';
import { MatrixDiagram } from './MatrixDiagram';
import { cn } from '../../../lib/utils';
import {
  CustomAlgorithmEditorBox,
  CustomAlgorithmEditorError,
  CustomAlgorithmEditorHeaderRow,
} from './shuffle-visualizer/CustomAlgorithmEditor';
import { ShuffleControls } from './shuffle-visualizer/ShuffleControls';
import {
  createCustomShuffle,
  CUSTOM_ALGO_ID,
  DEFAULT_CUSTOM_CODE,
} from './shuffle-visualizer/customAlgorithm';
import { useShuffleSimulation } from './shuffle-visualizer/useShuffleSimulation';
import { computeBiasSummary } from './shuffle-visualizer/metrics';
import { MatrixLegend } from './shuffle-visualizer/MatrixLegend';
import { getGithubMonacoThemeName } from './shuffle-visualizer/monacoGithubTheme';

export function ShuffleVisualizer() {
  const { resolvedTheme } = useTheme();
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(ALGORITHMS[0].id);

  const n = 60;
  const batchSize = 500;
  const autoStop = true;
  const targetTrials = 20_000;

  const [customCode, setCustomCode] = useState<string>(DEFAULT_CUSTOM_CODE);
  const [customError, setCustomError] = useState<string | null>(null);

  // 커스텀 코드 변경 시 에러 검증
  useEffect(() => {
    if (selectedAlgoId === CUSTOM_ALGO_ID) {
      const { error } = createCustomShuffle(customCode);
      setCustomError(error);
    }
  }, [customCode, selectedAlgoId]);

  useEffect(() => {
    if (selectedAlgoId !== CUSTOM_ALGO_ID) {
      setCustomError(null);
    }
  }, [selectedAlgoId]);

  // 현재 선택된 알고리즘 가져오기 (메모이제이션)
  const currentAlgo = useMemo((): Algorithm | null => {
    if (selectedAlgoId === CUSTOM_ALGO_ID) {
      const { func: shuffleFunc } = createCustomShuffle(customCode);
      if (!shuffleFunc) return null;
      
      return {
        id: CUSTOM_ALGO_ID,
        name: 'Custom Algorithm',
        description: '사용자가 작성한 커스텀 셔플 알고리즘입니다.',
        shuffle: shuffleFunc,
      };
    }
    return ALGORITHMS.find(a => a.id === selectedAlgoId) || null;
  }, [selectedAlgoId, customCode]);

  const editorTheme = getGithubMonacoThemeName(resolvedTheme === 'dark' ? 'dark' : 'light');

  const simulation = useShuffleSimulation({
    algo: currentAlgo,
    n,
    batchSize,
    throttleMs: 100,
    autoStop,
    targetTrials: autoStop ? targetTrials : null,
  });

  const canRun = Boolean(currentAlgo) && simulation.status !== 'error' && !customError;
  const isRunning = simulation.status === 'running';

  const statusText = useMemo(() => {
    if (simulation.status === 'running') return '실행 중…';
    if (simulation.status === 'paused') return '일시 정지됨';
    if (simulation.status === 'error') return '오류로 중단됨';
    return '대기 중';
  }, [simulation.status]);

  const biasSummaryText = useMemo(() => {
    const summary = computeBiasSummary({
      counts: simulation.countsRef.current,
      n,
      totalTrials: simulation.totalTrials,
    });
    if (!summary) return null;

    return {
      minRatio: summary.minRatio.toFixed(3),
      maxRatio: summary.maxRatio.toFixed(3),
      chiSquare: summary.chiSquare.toFixed(1),
      hottestCell: `(${summary.maxCell.element}→${summary.maxCell.position}) x${summary.maxCell.ratio.toFixed(
        2,
      )}`,
    };
  }, [n, simulation.revision, simulation.totalTrials]);

  const visualizationContent = (
    <>
      <MatrixDiagram
        n={n}
        counts={simulation.countsRef.current}
        totalTrials={simulation.totalTrials}
        revision={simulation.revision}
      />

      <div
        className={cn(
          /* Layout */
          'mt-2',
        )}
      >
        <MatrixLegend />
      </div>
    </>
  );

  const visualizationDesktop = (
    <div
      className={cn(
        /* Layout */
        'w-full',
      )}
    >
      {visualizationContent}
    </div>
  );

  const visualizationMobile = (
    <div
      className={cn(
        /* Layout */
        'w-full',
        /* Visibility */
        'md:hidden',
      )}
    >
      {visualizationContent}
    </div>
  );

  return (
    <div
      className={cn(
        /* Layout */
        'flex flex-col gap-6 my-8 p-4 border rounded-xl',
        /* Color */
        'bg-zinc-50 border-zinc-200',
        /* Dark */
        'dark:bg-zinc-900/50 dark:border-zinc-800',
      )}
    >
      <div
        className={cn(
          /* Layout */
          'grid grid-cols-1 gap-6 items-start',
          /* Responsive */
          'md:grid-cols-[min(46vh,460px)_minmax(0,1fr)]',
        )}
      >
        {/* Visualization (mobile: inside controls, desktop: left) */}
        <div
          className={cn(
            /* Layout */
            'w-full mx-auto',
            /* Visibility */
            'hidden md:block',
            /* Size */
            'max-w-[min(46vh,460px)]',
            /* Desktop alignment */
            'md:mx-0 md:justify-self-start',
            /* Order */
            'order-2 md:order-1',
          )}
        >
          {visualizationDesktop}
        </div>

        {/* Controls (mobile: bottom, desktop: right) */}
        <div
          className={cn(
            /* Layout */
            'w-full space-y-4',
            /* Order */
            'order-1 md:order-2',
          )}
        >
          <ShuffleControls
            algorithms={[
              ...ALGORITHMS.map((a) => ({ id: a.id, name: a.name })),
              { id: CUSTOM_ALGO_ID, name: 'Custom' },
            ]}
            selectedAlgoId={selectedAlgoId}
            onSelectAlgoId={setSelectedAlgoId}
            algoDescription={currentAlgo?.description || '알고리즘을 선택하세요.'}
            hideDescription={selectedAlgoId === CUSTOM_ALGO_ID}
            afterDescription={visualizationMobile}
            canRun={canRun}
            isRunning={isRunning}
            onToggleRunning={simulation.toggle}
            onReset={() => {
              simulation.reset();
              setCustomError(null);
            }}
            totalTrials={simulation.totalTrials}
            expectedPerCell={simulation.expectedPerCell}
            biasSummaryText={biasSummaryText}
            statusText={statusText}
            errorText={customError || simulation.error}
            beforeStats={
              selectedAlgoId === CUSTOM_ALGO_ID ? (
                <>
                  <CustomAlgorithmEditorHeaderRow
                    onReset={() => {
                      setCustomCode(DEFAULT_CUSTOM_CODE);
                      setCustomError(null);
                    }}
                  />
                  <CustomAlgorithmEditorBox
                    code={customCode}
                    onChange={(code) => {
                      setCustomCode(code);
                      setCustomError(null);
                    }}
                    error={customError}
                    editorTheme={editorTheme}
                  />
                  <CustomAlgorithmEditorError error={customError} />
                </>
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
}

