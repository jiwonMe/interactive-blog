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
  pivotIndex: number | null;
  compareIndices: [number, number] | null; // 비교 중인 두 인덱스
  swapIndices: [number, number] | null; // 교환 중인 두 인덱스
  sortedIndices: number[]; // 정렬 완료된 인덱스들
  message: string; // 현재 단계 설명
  partitionRange: [number, number] | null; // 현재 분할 중인 범위
};

export function QuickSortVisualizer() {
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 초기 배열 생성 및 정렬 과정 기록
  useEffect(() => {
    generateSteps();
  }, []);

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

    // 초기 상태
    steps.push({
      array: JSON.parse(JSON.stringify(initialArray)),
      pivotIndex: null,
      compareIndices: null,
      swapIndices: null,
      sortedIndices: [],
      message: '초기 배열입니다.',
      partitionRange: null
    });

    const quickSort = (arr: ArrayItem[], low: number, high: number) => {
      if (low < high) {
        // 파티션 시작 알림
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            pivotIndex: null,
            compareIndices: null,
            swapIndices: null,
            sortedIndices: getSortedIndices(steps),
            message: `${low}번부터 ${high}번 인덱스 범위에서 퀵 정렬을 시작합니다.`,
            partitionRange: [low, high]
        });

        const pi = partition(arr, low, high);

        // 피벗 위치 확정
        const currentSorted = getSortedIndices(steps);
        currentSorted.push(pi);
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            pivotIndex: pi,
            compareIndices: null,
            swapIndices: null,
            sortedIndices: currentSorted,
            message: `피벗(${arr[pi].value})의 위치가 확정되었습니다.`,
            partitionRange: null
        });

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
      } else if (low === high) {
          // 요소가 하나 남았을 때도 정렬 완료 처리
          const currentSorted = getSortedIndices(steps);
          if (!currentSorted.includes(low)) {
              currentSorted.push(low);
              steps.push({
                  array: JSON.parse(JSON.stringify(arr)),
                  pivotIndex: null,
                  compareIndices: null,
                  swapIndices: null,
                  sortedIndices: currentSorted,
                  message: `${low}번 요소는 위치가 확정되었습니다.`,
                  partitionRange: null
              });
          }
      }
    };

    const partition = (arr: ArrayItem[], low: number, high: number) => {
      const pivot = arr[high];
      
      // 피벗 선택 알림
      steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          pivotIndex: high,
          compareIndices: null,
          swapIndices: null,
          sortedIndices: getSortedIndices(steps),
          message: `마지막 요소인 ${pivot.value}을 피벗으로 선택합니다.`,
          partitionRange: [low, high]
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        // 비교 알림
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            pivotIndex: high,
            compareIndices: [j, high],
            swapIndices: null,
            sortedIndices: getSortedIndices(steps),
            message: `${arr[j].value}와 피벗(${pivot.value})을 비교합니다.`,
            partitionRange: [low, high]
        });

        if (arr[j].value < pivot.value) {
          i++;
          
          if (i !== j) {
              // 교환 알림
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;

              steps.push({
                array: JSON.parse(JSON.stringify(arr)),
                pivotIndex: high,
                compareIndices: null,
                swapIndices: [i, j],
                sortedIndices: getSortedIndices(steps),
                message: `${arr[i].value}(작은 값)을 왼쪽(${i})으로 옮깁니다.`,
                partitionRange: [low, high]
              });
          }
        }
      }

      // 피벗 위치 교환
      if (i + 1 !== high) {
        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        steps.push({
                array: JSON.parse(JSON.stringify(arr)),
                pivotIndex: i + 1,
                compareIndices: null,
                swapIndices: [i + 1, high],
                sortedIndices: getSortedIndices(steps),
                message: `피벗을 자신의 위치(${i + 1})로 이동합니다.`,
                partitionRange: [low, high]
            });
      } else {
         // 피벗이 이미 제자리에 있는 경우 (이동 없음)
         // 여기서는 별도 메시지 없이 다음 단계(피벗 확정)로 자연스럽게 넘어감
      }

      return i + 1;
    };

    // 정렬 실행
    const arrayCopy = JSON.parse(JSON.stringify(initialArray));
    quickSort(arrayCopy, 0, arrayCopy.length - 1);

    // 최종 완료 상태
    steps.push({
        array: JSON.parse(JSON.stringify(arrayCopy)),
        pivotIndex: null,
        compareIndices: null,
        swapIndices: null,
        sortedIndices: arrayCopy.map((_: any, i: number) => i),
        message: '정렬이 완료되었습니다!',
        partitionRange: null
    });

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
    const { array, pivotIndex, compareIndices, swapIndices, sortedIndices, partitionRange } = step;
    const isDark = resolvedTheme === 'dark';

    // 색상 팔레트 정의
    const colors = {
      sorted: isDark ? '#34D399' : '#10B981', // Emerald 400 / 500
      pivot: isDark ? '#FBBF24' : '#F59E0B', // Amber 400 / 500
      swap: isDark ? '#F87171' : '#EF4444', // Red 400 / 500
      compare: isDark ? '#60A5FA' : '#3B82F6', // Blue 400 / 500
      partition: isDark ? '#A78BFA' : '#DDD6FE', // Violet 400 / 200
      default: isDark ? '#3F3F46' : '#E4E4E7', // Zinc 700 / 200
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
                        if (pivotIndex === i) return colors.pivot;
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

    // 인덱스 표시는 데이터와 무관하게 위치 고정이므로 별도 처리 (또는 id 말고 index로 바인딩)
    // 하지만 여기서는 막대와 함께 움직이지 않고 바닥에 고정된 축처럼 보이게 하기 위해
    // index를 key로 사용하여 업데이트만 수행
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
                 .attr('fill', colors.textLight) // 테마 변경 대응
        );

  }, [currentStep, steps, mounted, resolvedTheme, speed]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 my-8 transition-colors duration-200">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">퀵 정렬 시각화</h3>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Step {currentStep + 1} / {steps.length}
        </div>
      </div>

      <div className="w-full mb-6 overflow-x-auto pb-2">
        <div className="min-w-[600px] w-full">
          <svg ref={svgRef} viewBox="0 0 600 300" className="w-full h-auto block" />
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg mb-6 min-h-[60px] flex items-center justify-center text-center transition-colors duration-200">
        <p className="text-zinc-700 dark:text-zinc-200 font-medium">
          {steps[currentStep]?.message}
        </p>
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
