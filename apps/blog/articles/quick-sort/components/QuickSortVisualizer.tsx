'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';
import { Controls } from '@repo/interactive-ui';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

type ArrayItem = {
  id: number;
  value: number;
};

// 정렬 상태를 나타내는 타입
type SortStep = {
  array: ArrayItem[];
  pivotIndices: number[]; // pivotIndex -> pivotIndices (배열)
  compareIndices: [number, number] | null; // 비교 중인 두 인덱스
  swapIndices: [number, number] | null; // 교환 중인 두 인덱스
  sortedIndices: number[]; // 정렬 완료된 인덱스들
  message: string; // 현재 단계 설명
    partitionRange: [number, number] | null; // 현재 분할 중인 범위
};

type AlgorithmType = 'standard' | 'median-of-three' | 'dual-pivot';

interface QuickSortVisualizerProps {
    initialAlgorithm?: AlgorithmType;
    showAlgorithmSelect?: boolean;
}

export function QuickSortVisualizer({ 
    initialAlgorithm = 'standard',
    showAlgorithmSelect = false 
}: QuickSortVisualizerProps) {
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(initialAlgorithm);
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 알고리즘 변경 시 또는 초기 로드 시 스텝 생성
  useEffect(() => {
    generateSteps();
  }, [algorithm]);

  const generateSteps = () => {
    const initialArray: ArrayItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 90) + 10
    }));
    
    const steps: SortStep[] = [];
    
    // 헬퍼 함수: 현재까지의 정렬된 인덱스 가져오기
    const getSortedIndices = (currentSteps: SortStep[]) => {
        if (currentSteps.length === 0) return [];
        return [...currentSteps[currentSteps.length - 1].sortedIndices];
    };

    // 스텝 추가 헬퍼
    const addStep = (
        arr: ArrayItem[], 
        pivotIndices: number[], 
        compareIndices: [number, number] | null, 
        swapIndices: [number, number] | null,
        message: string,
        partitionRange: [number, number] | null = null,
        newSortedIndices?: number[]
    ) => {
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            pivotIndices: pivotIndices,
            compareIndices: compareIndices,
            swapIndices: swapIndices,
            sortedIndices: newSortedIndices || getSortedIndices(steps),
            message: message,
            partitionRange: partitionRange
        });
    };

    // 초기 상태
    addStep(initialArray, [], null, null, '초기 배열입니다.');

    // --- Standard Quick Sort ---
    const quickSortStandard = (arr: ArrayItem[], low: number, high: number) => {
      if (low < high) {
        addStep(arr, [], null, null, `${low}번부터 ${high}번 인덱스 범위에서 퀵 정렬을 시작합니다.`, [low, high]);

        const pi = partitionStandard(arr, low, high);

        const currentSorted = getSortedIndices(steps);
        currentSorted.push(pi);
        addStep(arr, [pi], null, null, `피벗(${arr[pi].value})의 위치가 확정되었습니다.`, null, currentSorted);

        quickSortStandard(arr, low, pi - 1);
        quickSortStandard(arr, pi + 1, high);
      } else if (low === high) {
          const currentSorted = getSortedIndices(steps);
          if (!currentSorted.includes(low)) {
              currentSorted.push(low);
              addStep(arr, [], null, null, `${low}번 요소는 위치가 확정되었습니다.`, null, currentSorted);
          }
      }
    };

    const partitionStandard = (arr: ArrayItem[], low: number, high: number) => {
      const pivot = arr[high];
      addStep(arr, [high], null, null, `마지막 요소인 ${pivot.value}을 피벗으로 선택합니다.`, [low, high]);

      let i = low - 1;

      for (let j = low; j < high; j++) {
        addStep(arr, [high], [j, high], null, `${arr[j].value}와 피벗(${pivot.value})을 비교합니다.`, [low, high]);

        if (arr[j].value < pivot.value) {
          i++;
          if (i !== j) {
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
              addStep(arr, [high], null, [i, j], `${arr[i].value}(작은 값)을 왼쪽(${i})으로 옮깁니다.`, [low, high]);
          }
        }
      }

      if (i + 1 !== high) {
        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        addStep(arr, [i + 1], null, [i + 1, high], `피벗을 자신의 위치(${i + 1})로 이동합니다.`, [low, high]);
      }

      return i + 1;
    };

    // --- Median of Three Quick Sort ---
    const quickSortMedian = (arr: ArrayItem[], low: number, high: number) => {
        if (low < high) {
             addStep(arr, [], null, null, `${low}번부터 ${high}번 인덱스 범위에서 퀵 정렬(Median of 3)을 시작합니다.`, [low, high]);
             
             const pi = partitionMedian(arr, low, high);
             
             const currentSorted = getSortedIndices(steps);
             currentSorted.push(pi);
             addStep(arr, [pi], null, null, `피벗(${arr[pi].value})의 위치가 확정되었습니다.`, null, currentSorted);

             quickSortMedian(arr, low, pi - 1);
             quickSortMedian(arr, pi + 1, high);
        } else if (low === high) {
            const currentSorted = getSortedIndices(steps);
            if (!currentSorted.includes(low)) {
                currentSorted.push(low);
                addStep(arr, [], null, null, `${low}번 요소는 위치가 확정되었습니다.`, null, currentSorted);
            }
        }
    };

    const partitionMedian = (arr: ArrayItem[], low: number, high: number) => {
        const mid = Math.floor((low + high) / 2);
        addStep(arr, [], [low, mid], null, `피벗 후보: 처음(${arr[low].value}), 중간(${arr[mid].value}), 끝(${arr[high].value})을 비교합니다.`, [low, high]);

        // Sort low, mid, high to find median
        if (arr[low].value > arr[mid].value) {
            [arr[low], arr[mid]] = [arr[mid], arr[low]];
            addStep(arr, [], null, [low, mid], `중간값 찾기: ${arr[low].value}와 ${arr[mid].value} 교환`, [low, high]);
        }
        if (arr[low].value > arr[high].value) {
            [arr[low], arr[high]] = [arr[high], arr[low]];
             addStep(arr, [], null, [low, high], `중간값 찾기: ${arr[low].value}와 ${arr[high].value} 교환`, [low, high]);
        }
        if (arr[mid].value > arr[high].value) {
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
             addStep(arr, [], null, [mid, high], `중간값 찾기: ${arr[mid].value}와 ${arr[high].value} 교환`, [low, high]);
        }

        // Now median is at arr[mid]. Swap it with arr[high] to use standard partition logic
        const temp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = temp;
        addStep(arr, [high], null, [mid, high], `중간값(${arr[high].value})을 피벗으로 선택하고 맨 뒤로 보냅니다.`, [low, high]);

        // Standard partition logic
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            addStep(arr, [high], [j, high], null, `${arr[j].value}와 피벗(${pivot.value})을 비교합니다.`, [low, high]);
            if (arr[j].value < pivot.value) {
                i++;
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    addStep(arr, [high], null, [i, j], `${arr[i].value}(작은 값)을 왼쪽(${i})으로 옮깁니다.`, [low, high]);
                }
            }
        }

        if (i + 1 !== high) {
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            addStep(arr, [i + 1], null, [i + 1, high], `피벗을 자신의 위치(${i + 1})로 이동합니다.`, [low, high]);
        }
        return i + 1;
    };

    // --- Dual Pivot Quick Sort ---
    const quickSortDualPivot = (arr: ArrayItem[], low: number, high: number) => {
        if (low < high) {
            addStep(arr, [], null, null, `${low}번부터 ${high}번 인덱스 범위에서 듀얼 피벗 퀵 정렬을 시작합니다.`, [low, high]);
            
            // Swap if necessary so pivot1 <= pivot2
            if (arr[low].value > arr[high].value) {
                [arr[low], arr[high]] = [arr[high], arr[low]];
                addStep(arr, [], null, [low, high], `양 끝 값을 비교하여 작은 값을 왼쪽(P1), 큰 값을 오른쪽(P2)으로 둡니다.`, [low, high]);
            }

            const pivot1 = arr[low];
            const pivot2 = arr[high];
            addStep(arr, [low, high], null, null, `P1(${pivot1.value})과 P2(${pivot2.value})를 피벗으로 선택합니다.`, [low, high]);

            let l = low + 1;
            let g = high - 1;
            let k = low + 1;

            while (k <= g) {
                 addStep(arr, [low, high], [k, low], null, `현재 값(${arr[k].value})과 P1(${pivot1.value})을 비교합니다.`, [low, high]);
                if (arr[k].value < pivot1.value) {
                    if (k !== l) {
                         [arr[k], arr[l]] = [arr[l], arr[k]];
                         addStep(arr, [low, high], null, [k, l], `${arr[l].value}(<P1)을 왼쪽 영역으로 이동합니다.`, [low, high]);
                    }
                    l++;
                    k++;
                } else {
                     addStep(arr, [low, high], [k, high], null, `현재 값(${arr[k].value})과 P2(${pivot2.value})를 비교합니다.`, [low, high]);
                    if (arr[k].value > pivot2.value) {
                        while (arr[g].value > pivot2.value && k < g) {
                            g--;
                        }
                        if (k !== g) {
                             [arr[k], arr[g]] = [arr[g], arr[k]];
                             addStep(arr, [low, high], null, [k, g], `${arr[g].value}(>P2)을 오른쪽 영역으로 이동합니다.`, [low, high]);
                        }
                        g--;
                        if (arr[k].value < pivot1.value) {
                            if (k !== l) {
                                [arr[k], arr[l]] = [arr[l], arr[k]];
                                 addStep(arr, [low, high], null, [k, l], `${arr[l].value}(<P1)을 왼쪽 영역으로 이동합니다.`, [low, high]);
                            }
                            l++;
                        }
                    }
                    k++;
                }
            }

            [arr[low], arr[l - 1]] = [arr[l - 1], arr[low]];
            addStep(arr, [l - 1, high], null, [low, l - 1], `P1을 자신의 위치(${l - 1})로 이동합니다.`, [low, high]);
            
            [arr[high], arr[g + 1]] = [arr[g + 1], arr[high]];
            addStep(arr, [l - 1, g + 1], null, [high, g + 1], `P2를 자신의 위치(${g + 1})로 이동합니다.`, [low, high]);

            const currentSorted = getSortedIndices(steps);
            currentSorted.push(l - 1);
            currentSorted.push(g + 1);
            addStep(arr, [l - 1, g + 1], null, null, `두 피벗의 위치가 확정되었습니다.`, null, currentSorted);

            quickSortDualPivot(arr, low, l - 2);
            quickSortDualPivot(arr, l, g);
            quickSortDualPivot(arr, g + 2, high);

        } else if (low === high) {
             const currentSorted = getSortedIndices(steps);
            if (!currentSorted.includes(low)) {
                currentSorted.push(low);
                addStep(arr, [], null, null, `${low}번 요소는 위치가 확정되었습니다.`, null, currentSorted);
            }
        }
    };


    // 정렬 실행
    const arrayCopy = JSON.parse(JSON.stringify(initialArray));
    if (algorithm === 'standard') {
        quickSortStandard(arrayCopy, 0, arrayCopy.length - 1);
    } else if (algorithm === 'median-of-three') {
        quickSortMedian(arrayCopy, 0, arrayCopy.length - 1);
    } else if (algorithm === 'dual-pivot') {
        quickSortDualPivot(arrayCopy, 0, arrayCopy.length - 1);
    }

    // 최종 완료 상태
    addStep(arrayCopy, [], null, null, '정렬이 완료되었습니다!', null, arrayCopy.map((_: any, i: number) => i));

    setSteps(steps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // 재생 로직
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
            if (prev >= steps.length - 1) {
                setIsPlaying(false);
                return prev;
            }
            return prev + 1;
        });
      }, speed);
    } else {
        setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  // D3 렌더링
  useEffect(() => {
    if (!mounted || !svgRef.current || steps.length === 0) return;

    const step = steps[currentStep];
    // pivotIndex -> pivotIndices (배열)로 변경
    const { array, pivotIndices, compareIndices, swapIndices, sortedIndices, partitionRange } = step;
    const isDark = resolvedTheme === 'dark';

    // 색상 팔레트 정의
    const colors = {
      sorted: isDark ? '#34D399' : '#10B981', // Emerald 400 / 500
      pivot: isDark ? '#FBBF24' : '#F59E0B', // Amber 400 / 500
      swap: isDark ? '#F87171' : '#EF4444', // Red 400 / 500
      compare: isDark ? '#60A5FA' : '#3B82F6', // Blue 400 / 500
      partition: isDark ? '#A78BFA' : '#DDD6FE', // Violet 400 / 200
      default: isDark ? '#52525B' : '#E4E4E7', // Zinc 600 / 200 (Dark mode adjusted for better contrast)
      text: isDark ? '#A1A1AA' : '#71717A', // Zinc 400 / 500
      textLight: isDark ? '#71717A' : '#A1A1AA', // Zinc 500 / 400
    };

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 그룹 요소가 없으면 생성
    let g = svg.select<SVGGElement>('g');
    if (g.empty()) {
      g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }

    const xScale = d3.scaleBand()
        .domain(d3.range(array.length).map(String))
        .range([0, innerWidth])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);

    const t = svg.transition()
        .duration(speed * 0.8)
        .ease(d3.easeCubicOut) as any;

    // 막대 그리기
    g.selectAll<SVGRectElement, ArrayItem>('.bar')
        .data(array, (d) => d.id)
        .join(
            enter => enter.append('rect')
                .attr('class', 'bar')
                .attr('x', (_, i) => xScale(i.toString())!)
                .attr('y', (d) => yScale(d.value))
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => innerHeight - yScale(d.value))
                .attr('rx', 4)
                .attr('fill', colors.default)
                .attr('opacity', 0)
                .call(enter => enter.transition(t)
                    .attr('opacity', 1)
                ),
            update => update
                .call(update => update.transition(t)
                    .attr('x', (_, i) => xScale(i.toString())!)
                    .attr('y', (d) => yScale(d.value))
                    .attr('height', (d) => innerHeight - yScale(d.value))
                    .attr('fill', (_, i) => {
                        if (sortedIndices.includes(i)) return colors.sorted;
                        if (pivotIndices && pivotIndices.includes(i)) return colors.pivot; // 수정됨
                        if (swapIndices && swapIndices.includes(i)) return colors.swap;
                        if (compareIndices && compareIndices.includes(i)) return colors.compare;
                        if (partitionRange && i >= partitionRange[0] && i <= partitionRange[1]) return colors.partition;
                        return colors.default;
                    })
                ),
            exit => exit
                .call(exit => exit.transition(t)
                    .attr('opacity', 0)
                    .remove()
                )
        );

    // 값 텍스트 표시
    g.selectAll<SVGTextElement, ArrayItem>('.label')
        .data(array, (d) => d.id)
        .join(
            enter => enter.append('text')
                .attr('class', 'label')
                .attr('x', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
                .attr('y', (d) => yScale(d.value) - 5)
                .attr('text-anchor', 'middle')
                .text((d) => d.value)
                .attr('fill', colors.text)
                .style('font-size', '14px')
                .style('font-weight', '500')
                .attr('opacity', 0)
                .call(enter => enter.transition(t)
                    .attr('opacity', 1)
                ),
            update => update
                .text((d) => d.value)
                .call(update => update.transition(t)
                    .attr('x', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
                    .attr('y', (d) => yScale(d.value) - 5)
                    .attr('fill', colors.text)
                ),
            exit => exit.remove()
        );

    // 인덱스 표시는 데이터와 무관하게 위치 고정이므로 별도 처리
    const indices = array.map((_, i) => i);
    g.selectAll<SVGTextElement, number>('.index')
        .data(indices)
        .join(
            enter => enter.append('text')
                .attr('class', 'index')
                .attr('x', (i) => xScale(i.toString())! + xScale.bandwidth() / 2)
                .attr('y', innerHeight + 25)
                .attr('text-anchor', 'middle')
                .text((i) => i)
                .attr('fill', colors.textLight)
                .style('font-size', '12px'),
            update => update
                 .attr('fill', colors.textLight)
        );

  }, [currentStep, steps, mounted, resolvedTheme, speed]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 my-8 transition-colors duration-200">
      <div className="mb-4 flex flex-col items-center">
        {showAlgorithmSelect && (
            <Controls.Select
                label="알고리즘 선택"
                options={[
                    { value: 'standard', label: '기본 (Last Pivot)' },
                    { value: 'median-of-three', label: '세 값의 중앙값 (Median of 3)' },
                    { value: 'dual-pivot', label: '듀얼 피벗 (Dual Pivot)' },
                ]}
                value={algorithm}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAlgorithm(e.target.value as AlgorithmType)}
                css={{ marginBottom: '1rem' }}
            />
        )}
      </div>

      <div className="w-full mb-6 overflow-x-auto pb-2">
        <div className="min-w-[600px] w-full">
          <svg ref={svgRef} viewBox="0 0 600 300" className="w-full h-auto block" />
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg mb-6 flex flex-col items-center justify-center text-center transition-colors duration-200 gap-2 min-h-[80px]">
        <p className="text-zinc-700 dark:text-zinc-200 font-medium">
          {steps[currentStep]?.message}
        </p>
        <div className="text-xs text-zinc-400 dark:text-zinc-400 font-mono">
            Step {currentStep + 1} / {steps.length}
        </div>
      </div>

      <Controls.Root>
        <Controls.Group>
            <Controls.Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                title="이전 단계"
            >
                <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5" />
            </Controls.Button>

            <Controls.Button
                variant="primary"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "일시정지" : "재생"}
            >
                {isPlaying ? <Pause className="w-6 h-6 sm:w-5 sm:h-5" /> : <Play className="w-6 h-6 sm:w-5 sm:h-5" />}
            </Controls.Button>

            <Controls.Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                title="다음 단계"
            >
                <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5" />
            </Controls.Button>

            <Controls.Button
                onClick={() => {
                    setIsPlaying(false);
                    generateSteps();
                }}
                title="새로운 배열로 다시 시작"
                css={{ marginLeft: '0.5rem', '@media (min-width: 640px)': { marginLeft: '1rem' } }}
            >
                <RotateCcw className="w-6 h-6 sm:w-5 sm:h-5" />
            </Controls.Button>
        </Controls.Group>

        <Controls.Slider
            label="속도"
            min={50}
            max={1000}
            step={50}
            value={1050 - speed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpeed(1050 - Number(e.target.value))}
        />
      </Controls.Root>
    </div>
  );
}
