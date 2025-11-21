'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { ALGORITHMS, Algorithm, ShuffleFunction } from '../lib/algorithms';
import { MatrixDiagram } from './MatrixDiagram';
import { cn } from '../../../lib/utils';

// 간단한 버튼 컴포넌트 (만약 @repo/interactive-ui에 적절한 게 없다면)
const SimpleButton = ({ 
  onClick, 
  disabled, 
  children, 
  className 
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
      "bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed",
      "dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300",
      className
    )}
  >
    {children}
  </button>
);

const N = 60; // 배열 크기 (Mike Bostock 예제와 유사하게)
const BATCH_SIZE = 500; // 프레임당 시뮬레이션 횟수
const CUSTOM_ALGO_ID = 'custom';

// 기본 커스텀 알고리즘 템플릿
const DEFAULT_CUSTOM_CODE = `// 배열을 셔플하는 함수를 작성하세요
// 함수는 array를 받아서 셔플된 새 배열을 반환해야 합니다
// 예: return [...array].sort(() => Math.random() - 0.5);

const copy = [...array];
// 여기에 셔플 로직을 작성하세요
return copy;`;

export function ShuffleVisualizer() {
  const { resolvedTheme } = useTheme();
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(ALGORITHMS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTrials, setTotalTrials] = useState(0);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [customCode, setCustomCode] = useState<string>(DEFAULT_CUSTOM_CODE);
  const [customError, setCustomError] = useState<string | null>(null);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  
  const requestRef = useRef<number>(0);
  
  // Monaco Editor 테마 결정
  const editorTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light';
  
  // 초기화
  const resetMatrix = useCallback(() => {
    const newMatrix = Array(N).fill(0).map(() => Array(N).fill(0));
    setMatrix(newMatrix);
    setTotalTrials(0);
  }, []);

  // 커스텀 알고리즘 함수 생성 (순수 함수, 상태 변경 없음)
  const createCustomShuffle = useCallback((code: string): { func: ShuffleFunction | null; error: string | null } => {
    try {
      // 코드를 함수로 래핑하여 실행
      // 안전을 위해 array 파라미터만 제공
      const func = new Function('array', `
        ${code}
      `);
      
      // 테스트 실행
      const testArray = [0, 1, 2];
      const result = func(testArray);
      
      // 결과 검증
      if (!Array.isArray(result)) {
        throw new Error('함수는 배열을 반환해야 합니다.');
      }
      if (result.length !== testArray.length) {
        throw new Error('반환된 배열의 길이가 원본과 같아야 합니다.');
      }
      
      return { func: func as ShuffleFunction, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      return { func: null, error: errorMessage };
    }
  }, []);

  // 커스텀 코드 변경 시 에러 검증
  useEffect(() => {
    if (selectedAlgoId === CUSTOM_ALGO_ID) {
      const { error } = createCustomShuffle(customCode);
      setCustomError(error);
    }
  }, [customCode, selectedAlgoId, createCustomShuffle]);

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
  }, [selectedAlgoId, customCode, createCustomShuffle]);

  // 알고리즘 변경 시 리셋
  useEffect(() => {
    resetMatrix();
    setIsRunning(false);
    if (selectedAlgoId === CUSTOM_ALGO_ID) {
      setShowCustomEditor(true);
    } else {
      setShowCustomEditor(false);
    }
  }, [selectedAlgoId, resetMatrix]);

  // 시뮬레이션 루프
  const animate = useCallback(() => {
    if (!currentAlgo) return;

    // BATCH_SIZE 만큼 실행하여 매트릭스 업데이트
    // 상태 업데이트를 함수형으로 하여 최신 상태 반영
    setMatrix(prevMatrix => {
      // 불변성을 위해 복사 (성능 최적화를 위해 1차원 배열이나 Int32Array 고려 가능하지만,
      // 여기서는 가독성과 N=60 수준임을 감안하여 2차원 배열 복사 사용)
      const nextMatrix = prevMatrix.map(row => [...row]);
      const initialArray = Array.from({ length: N }, (_, i) => i);

      for (let k = 0; k < BATCH_SIZE; k++) {
        const shuffled = currentAlgo.shuffle(initialArray);
        for (let i = 0; i < N; i++) {
          // initialArray[i] is i.
          // shuffled[j] contains the original index.
          // We want to know: where did element i go?
          // shuffled array values are the original indices.
          // So if shuffled[j] == i, then element i ended up at j.
          // This implies we need to scan shuffled to find i, which is O(N^2).
          // Wait, let's rephrase.
          // shuffled[j] = x means "at position j, we have element x".
          // So element x moved to position j.
          // Matrix[x][j]++
          const element = shuffled[i];
          const position = i;
          nextMatrix[element][position]++;
        }
      }
      return nextMatrix;
    });

    setTotalTrials(prev => prev + BATCH_SIZE);
    requestRef.current = requestAnimationFrame(animate);
  }, [currentAlgo]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  return (
    <div className="flex flex-col gap-8 my-8 p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Controls */}
        <div className="flex-1 flex flex-col gap-6 w-full md:w-auto">
          <div>
            <h3 className="text-lg font-bold mb-3">알고리즘 선택</h3>
            <div className="flex flex-wrap gap-2">
              {ALGORITHMS.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgoId(algo.id)}
                  className={cn(
                    // Layout
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    // Active State
                    selectedAlgoId === algo.id
                      ? [
                          "bg-zinc-900 text-white border-zinc-900 shadow-sm",
                          "dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100",
                        ]
                      : [
                          // Inactive State
                          "bg-white text-zinc-600 border-zinc-200",
                          "hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900",
                          // Dark mode
                          "dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
                          "dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
                        ],
                  )}
                >
                  {algo.name}
                </button>
              ))}
              <button
                onClick={() => setSelectedAlgoId(CUSTOM_ALGO_ID)}
                className={cn(
                  // Layout
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  // Active State
                  selectedAlgoId === CUSTOM_ALGO_ID
                    ? [
                        "bg-zinc-900 text-white border-zinc-900 shadow-sm",
                        "dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100",
                      ]
                    : [
                        // Inactive State
                        "bg-white text-zinc-600 border-zinc-200",
                        "hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900",
                        // Dark mode
                        "dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
                        "dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
                      ],
                )}
              >
                Custom
              </button>
            </div>
            <p
              className={cn(
                // Layout
                "mt-3 min-h-[3rem] text-sm leading-relaxed",
                // Color
                "text-zinc-500 dark:text-zinc-400",
              )}
            >
              {currentAlgo?.description || '알고리즘을 선택하세요.'}
            </p>
          </div>

          {/* Custom Algorithm Editor */}
          {selectedAlgoId === CUSTOM_ALGO_ID && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">커스텀 알고리즘 코드</h4>
                <button
                  onClick={() => setCustomCode(DEFAULT_CUSTOM_CODE)}
                  className={cn(
                    // Layout
                    "px-2 py-1 text-xs rounded",
                    // Color
                    "text-zinc-500 hover:text-zinc-700",
                    "dark:text-zinc-400 dark:hover:text-zinc-200",
                  )}
                >
                  기본값으로 리셋
                </button>
              </div>
              <div
                className={cn(
                  // Layout
                  "w-full rounded-lg overflow-visible border",
                  customError
                    ? [
                        // Error state
                        "border-red-500",
                      ]
                    : [
                        // Normal state
                        "border-zinc-300 dark:border-zinc-700",
                      ],
                )}
              >
                <div className="overflow-hidden rounded-lg">
                  <Editor
                    height="200px"
                    defaultLanguage="javascript"
                    value={customCode}
                    onChange={(value) => {
                      setCustomCode(value || '');
                      setCustomError(null);
                    }}
                    theme={editorTheme}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 12, bottom: 12 },
                      // IntelliSense 팝업이 컨테이너 밖으로 나갈 수 있도록
                      fixedOverflowWidgets: true,
                    }}
                  />
                </div>
              </div>
              {customError && (
                <div
                  className={cn(
                    // Layout
                    "p-3 rounded-lg text-sm",
                    // Color
                    "bg-red-50 text-red-700 border border-red-200",
                    "dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
                  )}
                >
                  <strong>오류:</strong> {customError}
                </div>
              )}
              {!customError && customCode !== DEFAULT_CUSTOM_CODE && (
                <div
                  className={cn(
                    // Layout
                    "p-2 rounded text-xs",
                    // Color
                    "bg-green-50 text-green-700",
                    "dark:bg-green-900/20 dark:text-green-400",
                  )}
                >
                  ✓ 코드가 유효합니다. 시뮬레이션을 시작할 수 있습니다.
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <SimpleButton 
              onClick={() => setIsRunning(!isRunning)}
              disabled={selectedAlgoId === CUSTOM_ALGO_ID && !currentAlgo}
            >
              {isRunning ? '일시 정지' : '시뮬레이션 시작'}
            </SimpleButton>
            <SimpleButton 
              onClick={() => {
                setIsRunning(false);
                resetMatrix();
              }}
              className="bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              리셋
            </SimpleButton>
          </div>

          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p>총 시도 횟수: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{totalTrials.toLocaleString()}</span></p>
            {totalTrials > 0 && (
              <div className="flex items-center gap-2 text-xs">
                 <div className="w-3 h-3 bg-[#e66101]"></div> <span>자주 등장 (Positive Bias)</span>
                 <div className="w-3 h-3 bg-white border border-zinc-200"></div> <span>기대치 (Unbiased)</span>
                 <div className="w-3 h-3 bg-[#5e3c99]"></div> <span>드물게 등장 (Negative Bias)</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization */}
        <div className="w-auto">
          <MatrixDiagram matrix={matrix} totalTrials={totalTrials} />
        </div>
      </div>
    </div>
  );
}

