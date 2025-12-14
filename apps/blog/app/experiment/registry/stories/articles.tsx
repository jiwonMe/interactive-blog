import React from "react";
import type { ExperimentStory } from "../types";
import { Counter } from "../../../../articles/hello-world/components/counter";
import { SecretaryProblem } from "../../../../articles/secretary-problem/components/SecretaryProblem";
import { SecretarySimulator } from "../../../../articles/secretary-problem/components/SecretarySimulator";
import { BuggyInputDemo } from "../../../../articles/korean-ime-bug/components/BuggyInputDemo";
import { CompositionEventLogger } from "../../../../articles/korean-ime-bug/components/CompositionEventLogger";
import { HangulCompositionFlow } from "../../../../articles/korean-ime-bug/components/HangulCompositionFlow";
import { QuickSortVisualizer } from "../../../../articles/quick-sort/components/QuickSortVisualizer";
import { HiddenClassVisualizer } from "../../../../articles/v8-object-vs-map/components/HiddenClassVisualizer";
import { PropertyStorageVisualizer } from "../../../../articles/v8-object-vs-map/components/PropertyStorageVisualizer";
import { TimerComparisonPlaygroundWrapper } from "../../../../articles/settimeout-vs-setinterval/components/TimerComparisonPlaygroundWrapper";
import { TimerAccuracyTesterWrapper } from "../../../../articles/settimeout-vs-setinterval/components/TimerAccuracyTesterWrapper";
import { IntervalDriftChartWrapper } from "../../../../articles/settimeout-vs-setinterval/components/IntervalDriftChartWrapper";
import { EventLoopSimulatorWrapper } from "../../../../articles/settimeout-vs-setinterval/components/EventLoopSimulatorWrapper";
import { MemoryLeakVisualizerWrapper } from "../../../../articles/settimeout-vs-setinterval/components/MemoryLeakVisualizerWrapper";
import { ShuffleVisualizer } from "../../../../articles/shuffle-bias/components/ShuffleVisualizer";
import { TournamentSampler } from "../../../../articles/shuffle-bias/components/TournamentSampler";
import { TournamentDiagram } from "../../../../articles/shuffle-bias/components/TournamentDiagram";
import { TransitivityDiagram } from "../../../../articles/shuffle-bias/components/TransitivityDiagram";
import { NaiveSwapPathDistribution } from "../../../../articles/shuffle-bias/components/NaiveSwapPathDistribution";

export const articleStories: ExperimentStory[] = [
  {
    slug: "hello-world/counter",
    title: "카운터 (Hello World)",
    description: "Hello World 아티클에 사용된 인터랙티브 카운터입니다.",
    category: "Articles / hello-world",
    tags: ["article", "react-state"],
    links: [{ href: "/posts/hello-world", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/hello-world/components/counter.tsx"],
    render: () => <Counter />,
    controls: {},
  },
  {
    slug: "secretary-problem",
    title: "비서문제 (Secretary Problem)",
    description: "최적 멈춤 이론을 인터랙티브하게 시각화합니다.",
    category: "Articles / secretary-problem",
    tags: ["article", "d3", "visualization"],
    links: [{ href: "/posts/secretary-problem", label: "글로 이동" }],
    sourcePaths: [
      "apps/blog/articles/secretary-problem/components/SecretaryProblem.tsx",
      "apps/blog/articles/secretary-problem/lib/secretary-algorithm.ts",
    ],
    render: (props) => (
      <SecretaryProblem
        numCandidates={props.numCandidates}
        speed={props.speed}
        autoPlay={props.autoPlay}
      />
    ),
    controls: {
      numCandidates: { type: "number", label: "후보자 수", defaultValue: 10, min: 5, max: 100, step: 5 },
      speed: { type: "number", label: "애니메이션 속도 (ms)", defaultValue: 1000, min: 100, max: 3000, step: 100 },
      autoPlay: { type: "boolean", label: "자동 재생", defaultValue: false },
    },
  },
  {
    slug: "secretary-problem/simulator",
    title: "비서문제 시뮬레이터 (New)",
    description: "@repo/interactive-components를 사용한 새로운 비서문제 시뮬레이터입니다.",
    category: "Articles / secretary-problem",
    tags: ["article", "d3", "interactive-components", "simulation"],
    links: [{ href: "/posts/secretary-problem", label: "글로 이동" }],
    sourcePaths: [
      "apps/blog/articles/secretary-problem/components/SecretarySimulator.tsx",
      "apps/blog/articles/secretary-problem/components/SecretaryCandidateChart.tsx",
      "apps/blog/articles/secretary-problem/lib/secretary-algorithm.ts",
    ],
    render: (props) => <SecretarySimulator numCandidates={props.numCandidates} />,
    controls: {
      numCandidates: { type: "number", label: "후보자 수", defaultValue: 10, min: 5, max: 30, step: 1 },
    },
  },
  {
    slug: "korean-ime-bug/buggy-input",
    title: "한글 IME 버그 데모 (BuggyInputDemo)",
    description: "IME 조합을 깨뜨리는 DOM 직접 조작 버그를 재현합니다.",
    category: "Articles / korean-ime-bug",
    tags: ["article", "ime", "input"],
    links: [{ href: "/posts/korean-ime-bug", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/korean-ime-bug/components/BuggyInputDemo.tsx"],
    render: () => <BuggyInputDemo />,
    controls: {},
  },
  {
    slug: "korean-ime-bug/composition-event-logger",
    title: "IME 이벤트 로거 (CompositionEventLogger)",
    description: "composition/input 이벤트를 로깅하여 흐름을 관찰합니다.",
    category: "Articles / korean-ime-bug",
    tags: ["article", "ime", "events"],
    links: [{ href: "/posts/korean-ime-bug", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/korean-ime-bug/components/CompositionEventLogger.tsx"],
    render: () => <CompositionEventLogger />,
    controls: {},
  },
  {
    slug: "korean-ime-bug/hangul-composition-flow",
    title: "한글 조합 플로우 (HangulCompositionFlow)",
    description: "한글 조합 과정을 단계적으로 시각화합니다.",
    category: "Articles / korean-ime-bug",
    tags: ["article", "ime", "visualization"],
    links: [{ href: "/posts/korean-ime-bug", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/korean-ime-bug/components/HangulCompositionFlow.tsx"],
    render: () => <HangulCompositionFlow />,
    controls: {},
  },
  {
    slug: "quick-sort/visualizer",
    title: "퀵 정렬 시각화 (QuickSortVisualizer)",
    description: "퀵 정렬 과정을 단계별로 보여주는 시각화입니다.",
    category: "Articles / quick-sort",
    tags: ["article", "algorithm", "d3"],
    links: [{ href: "/posts/quick-sort", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/quick-sort/components/QuickSortVisualizer.tsx"],
    render: (props) => (
      <QuickSortVisualizer
        initialAlgorithm={props.algorithm}
        showAlgorithmSelect={props.showAlgorithmSelect}
      />
    ),
    controls: {
      algorithm: {
        type: "select",
        label: "알고리즘",
        defaultValue: "standard",
        options: ["standard", "median-of-three", "dual-pivot"],
      },
      showAlgorithmSelect: { type: "boolean", label: "알고리즘 선택 표시", defaultValue: true },
    },
  },
  {
    slug: "v8-object-vs-map/hidden-class",
    title: "Hidden Class 시각화",
    description: "V8 hidden class 전이를 인터랙티브하게 관찰합니다.",
    category: "Articles / v8-object-vs-map",
    tags: ["article", "v8", "reactflow"],
    links: [{ href: "/posts/v8-object-vs-map", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/v8-object-vs-map/components/HiddenClassVisualizer.tsx"],
    render: () => <HiddenClassVisualizer />,
    controls: {},
  },
  {
    slug: "v8-object-vs-map/property-storage",
    title: "Property Storage 시각화",
    description: "객체 프로퍼티 저장 구조를 인터랙티브하게 보여줍니다.",
    category: "Articles / v8-object-vs-map",
    tags: ["article", "v8", "visualization"],
    links: [{ href: "/posts/v8-object-vs-map", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/v8-object-vs-map/components/PropertyStorageVisualizer.tsx"],
    render: () => <PropertyStorageVisualizer />,
    controls: {},
  },
  {
    slug: "settimeout-vs-setinterval/timer-comparison",
    title: "타이머 비교 플레이그라운드",
    description: "setTimeout / setInterval 동작 차이를 인터랙티브하게 비교합니다.",
    category: "Articles / settimeout-vs-setinterval",
    tags: ["article", "timers", "dynamic"],
    links: [{ href: "/posts/settimeout-vs-setinterval", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/settimeout-vs-setinterval/components/TimerComparisonPlaygroundWrapper.tsx"],
    render: () => <TimerComparisonPlaygroundWrapper />,
    controls: {},
  },
  {
    slug: "settimeout-vs-setinterval/timer-accuracy",
    title: "타이머 정확도 테스터",
    description: "타이머 정확도를 측정하고 시각화합니다.",
    category: "Articles / settimeout-vs-setinterval",
    tags: ["article", "timers", "dynamic"],
    links: [{ href: "/posts/settimeout-vs-setinterval", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/settimeout-vs-setinterval/components/TimerAccuracyTesterWrapper.tsx"],
    render: () => <TimerAccuracyTesterWrapper />,
    controls: {},
  },
  {
    slug: "settimeout-vs-setinterval/interval-drift",
    title: "Interval Drift Chart",
    description: "setInterval 드리프트를 차트로 확인합니다.",
    category: "Articles / settimeout-vs-setinterval",
    tags: ["article", "timers", "dynamic"],
    links: [{ href: "/posts/settimeout-vs-setinterval", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/settimeout-vs-setinterval/components/IntervalDriftChartWrapper.tsx"],
    render: () => <IntervalDriftChartWrapper />,
    controls: {},
  },
  {
    slug: "settimeout-vs-setinterval/event-loop",
    title: "이벤트 루프 시뮬레이터",
    description: "이벤트 루프 동작을 인터랙티브하게 시뮬레이션합니다.",
    category: "Articles / settimeout-vs-setinterval",
    tags: ["article", "event-loop", "dynamic"],
    links: [{ href: "/posts/settimeout-vs-setinterval", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/settimeout-vs-setinterval/components/EventLoopSimulatorWrapper.tsx"],
    render: () => <EventLoopSimulatorWrapper />,
    controls: {},
  },
  {
    slug: "settimeout-vs-setinterval/memory-leak",
    title: "메모리 누수 시각화",
    description: "타이머로 인한 메모리 누수 패턴을 시각화합니다.",
    category: "Articles / settimeout-vs-setinterval",
    tags: ["article", "memory", "dynamic"],
    links: [{ href: "/posts/settimeout-vs-setinterval", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/settimeout-vs-setinterval/components/MemoryLeakVisualizerWrapper.tsx"],
    render: () => <MemoryLeakVisualizerWrapper />,
    controls: {},
  },
  {
    slug: "shuffle-bias/shuffle-visualizer",
    title: "Shuffle Bias: Visualizer",
    description: "셔플 알고리즘 편향을 시각화하고 비교합니다.",
    category: "Articles / shuffle-bias",
    tags: ["article", "shuffle", "visualization"],
    links: [{ href: "/posts/shuffle-bias", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/shuffle-bias/components/ShuffleVisualizer.tsx"],
    render: () => <ShuffleVisualizer />,
    controls: {},
  },
  {
    slug: "shuffle-bias/tournament-sampler",
    title: "Shuffle Bias: Tournament Sampler",
    description: "토너먼트 샘플러를 통해 편향을 관찰합니다.",
    category: "Articles / shuffle-bias",
    tags: ["article", "shuffle", "sampling"],
    links: [{ href: "/posts/shuffle-bias", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/shuffle-bias/components/TournamentSampler.tsx"],
    render: () => <TournamentSampler />,
    controls: {},
  },
  {
    slug: "shuffle-bias/tournament-diagram",
    title: "Shuffle Bias: Tournament Diagram",
    description: "토너먼트 구조를 다이어그램으로 표시합니다.",
    category: "Articles / shuffle-bias",
    tags: ["article", "shuffle", "diagram"],
    links: [{ href: "/posts/shuffle-bias", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/shuffle-bias/components/TournamentDiagram.tsx"],
    render: () => (
      <TournamentDiagram
        edges={[
          { id: "ab", from: "a", to: "b" },
          { id: "bc", from: "b", to: "c" },
          { id: "ac", from: "a", to: "c" },
        ]}
        title="예시: 추이적 토너먼트"
      />
    ),
    controls: {},
  },
  {
    slug: "shuffle-bias/transitivity-diagram",
    title: "Shuffle Bias: Transitivity Diagram",
    description: "전이성(Transitivity) 구조를 시각화합니다.",
    category: "Articles / shuffle-bias",
    tags: ["article", "shuffle", "diagram"],
    links: [{ href: "/posts/shuffle-bias", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/shuffle-bias/components/TransitivityDiagram.tsx"],
    render: () => <TransitivityDiagram />,
    controls: {},
  },
  {
    slug: "shuffle-bias/naive-swap-path-distribution",
    title: "Shuffle Bias: Naive Swap Path Distribution",
    description: "작은 N에서 Naive Swap의 순열 분포(경로 전수조사)를 확인합니다.",
    category: "Articles / shuffle-bias",
    tags: ["article", "shuffle", "distribution"],
    links: [{ href: "/posts/shuffle-bias", label: "글로 이동" }],
    sourcePaths: ["apps/blog/articles/shuffle-bias/components/NaiveSwapPathDistribution.tsx"],
    render: () => <NaiveSwapPathDistribution />,
    controls: {},
  },
];

