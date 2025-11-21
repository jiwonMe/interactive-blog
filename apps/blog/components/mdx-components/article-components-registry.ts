// 아티클별 컴포넌트 레지스트리
// 새로운 아티클 컴포넌트를 추가할 때 여기에만 등록하면 됩니다.

import { Counter } from '../../articles/hello-world/components/counter';
import { QuickSortVisualizer } from '../../articles/quick-sort/components/QuickSortVisualizer';
import { IntervalDriftChartWrapper as IntervalDriftChart } from '../../articles/settimeout-vs-setinterval/components/IntervalDriftChartWrapper';
import { EventLoopSimulatorWrapper as EventLoopSimulator } from '../../articles/settimeout-vs-setinterval/components/EventLoopSimulatorWrapper';
import { TimerAccuracyTesterWrapper as TimerAccuracyTester } from '../../articles/settimeout-vs-setinterval/components/TimerAccuracyTesterWrapper';
import { MemoryLeakVisualizerWrapper as MemoryLeakVisualizer } from '../../articles/settimeout-vs-setinterval/components/MemoryLeakVisualizerWrapper';
import { TimerComparisonPlaygroundWrapper as TimerComparisonPlayground } from '../../articles/settimeout-vs-setinterval/components/TimerComparisonPlaygroundWrapper';
import { ShuffleVisualizer } from '../../articles/shuffle-bias/components/ShuffleVisualizer';

// 컴포넌트 이름과 컴포넌트를 매핑하는 레지스트리
export const articleComponentsRegistry: Record<string, React.ComponentType<any>> = {
  Counter,
  QuickSortVisualizer,
  IntervalDriftChart,
  EventLoopSimulator,
  TimerAccuracyTester,
  MemoryLeakVisualizer,
  TimerComparisonPlayground,
  ShuffleVisualizer,
};

// 컴포넌트를 동적으로 가져오는 함수
export function getArticleComponent(componentName: string): React.ComponentType<any> | undefined {
  return articleComponentsRegistry[componentName];
}

// 모든 아티클 컴포넌트 이름 목록
export function getAllArticleComponentNames(): string[] {
  return Object.keys(articleComponentsRegistry);
}

