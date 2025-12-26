import React from "react";
import type { ExperimentStory } from "../../types";
import {
  AreaDemo,
  BarsDemo,
  ControlsPrimitivesDemo,
  LineChartDemo,
  ScatterDemo,
  SimulationPanelDemo,
} from "./demos";
import { RechartsHistogramDemo, RechartsLineDemo } from "./demos-recharts";
import {
  makeRechartsHistogramSnippet,
  makeRechartsLineChartSnippet,
  makeVisxLineChartSnippet,
} from "./snippets";

export const interactiveComponentsStories: ExperimentStory[] = [
  {
    slug: "interactive-components/line-chart",
    title: "LineChart (visx)",
    description: "xKey/yKey + dataJson/seriesJson로 MDX에서 바로 쓸 수 있는 라인 차트 데모입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "chart", "visx", "mdx"],
    sourcePaths: [
      "packages/interactive-components/src/charts/LineChart.tsx",
      "packages/interactive-components/src/utils/json.ts",
    ],
    render: (props: any) => (
      <LineChartDemo
        ticks={props.ticks}
        noise={props.noise}
        interactive={props.interactive}
        showPoints={props.showPoints}
      />
    ),
    controls: {
      ticks: { type: "number", label: "ticks", defaultValue: 40, min: 5, max: 120, step: 1 },
      noise: { type: "number", label: "noise", defaultValue: 2, min: 0, max: 10, step: 1 },
      interactive: { type: "boolean", label: "interactive", defaultValue: true },
      showPoints: { type: "boolean", label: "showPoints", defaultValue: false },
    },
    snippets: [
      { label: "MDX: <LineChart ... dataJson/seriesJson />", getCode: makeVisxLineChartSnippet },
    ],
  },
  {
    slug: "interactive-components/simulation-panel",
    title: "SimulationPanel (composition)",
    description: "Controls/Visualization/Stats 슬롯으로 조합하는 시뮬레이션 레이아웃 데모입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "simulation", "layout", "mdx"],
    sourcePaths: [
      "packages/interactive-components/src/simulation/SimulationPanel.tsx",
      "packages/interactive-components/src/simulation/PlaybackControls.tsx",
      "packages/interactive-components/src/simulation/StatsDisplay.tsx",
    ],
    render: (props: any) => (
      <SimulationPanelDemo ticks={props.ticks} env={props.env} showStats={props.showStats} />
    ),
    controls: {
      ticks: { type: "number", label: "ticks", defaultValue: 50, min: 5, max: 120, step: 1 },
      env: { type: "select", label: "env", defaultValue: "chromium", options: ["chromium", "firefox", "safari", "node"] },
      showStats: { type: "boolean", label: "showStats", defaultValue: true },
    },
  },
  {
    slug: "interactive-components/recharts-line-chart",
    title: "RechartsLineChart (preset)",
    description: "Recharts 기반 프리셋 라인 차트. dataJson/seriesJson로 MDX에서 바로 사용합니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "chart", "recharts", "mdx"],
    sourcePaths: [
      "packages/interactive-components/src/recharts/RechartsLineChart.tsx",
      "packages/interactive-components/src/utils/json.ts",
    ],
    render: (props: any) => <RechartsLineDemo ticks={props.ticks} />,
    controls: {
      ticks: { type: "number", label: "ticks", defaultValue: 60, min: 5, max: 160, step: 1 },
    },
    snippets: [
      { label: "MDX: <RechartsLineChart ... dataJson/seriesJson />", getCode: makeRechartsLineChartSnippet },
    ],
  },
  {
    slug: "interactive-components/recharts-histogram",
    title: "RechartsHistogram (preset)",
    description: "값 배열(valuesJson)을 binning해서 그려주는 히스토그램 프리셋입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "chart", "recharts", "histogram", "mdx"],
    sourcePaths: [
      "packages/interactive-components/src/recharts/RechartsHistogram.tsx",
      "packages/interactive-components/src/utils/json.ts",
    ],
    render: (props: any) => <RechartsHistogramDemo points={props.points} bins={props.bins} />,
    controls: {
      points: { type: "number", label: "points", defaultValue: 400, min: 50, max: 2000, step: 50 },
      bins: { type: "number", label: "bins", defaultValue: 20, min: 5, max: 60, step: 1 },
    },
    snippets: [
      { label: "MDX: <RechartsHistogram ... valuesJson />", getCode: makeRechartsHistogramSnippet },
    ],
  },
  {
    slug: "interactive-components/bar-chart",
    title: "BarChart (visx)",
    description: "카테고리(문자열) xKey + 수치 yKey 기반 막대 차트 데모입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "chart", "bar"],
    sourcePaths: ["packages/interactive-components/src/charts/BarChart.tsx"],
    render: (props: any) => <BarsDemo buckets={props.buckets} />,
    controls: {
      buckets: { type: "number", label: "buckets", defaultValue: 8, min: 3, max: 16, step: 1 },
    },
  },
  {
    slug: "interactive-components/scatter-plot",
    title: "ScatterPlot (visx)",
    description: "xKey/yKey 기반 스캐터 플롯 데모입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "chart", "scatter"],
    sourcePaths: ["packages/interactive-components/src/charts/ScatterPlot.tsx"],
    render: (props: any) => <ScatterDemo points={props.points} />,
    controls: {
      points: { type: "number", label: "points", defaultValue: 120, min: 20, max: 300, step: 10 },
    },
  },
  {
    slug: "interactive-components/area-chart",
    title: "AreaChart (visx)",
    description: "xKey/yKey 기반 면적 차트 데모입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "chart", "area"],
    sourcePaths: ["packages/interactive-components/src/charts/AreaChart.tsx"],
    render: (props: any) => <AreaDemo ticks={props.ticks} />,
    controls: {
      ticks: { type: "number", label: "ticks", defaultValue: 80, min: 10, max: 160, step: 5 },
    },
  },
  {
    slug: "interactive-components/controls-primitives",
    title: "Controls Primitives",
    description: "Button/Slider/Select/Toggle/NumberInput 기본 UI 프리미티브 데모입니다.",
    category: "Interactive Components",
    tags: ["interactive-components", "controls"],
    sourcePaths: ["packages/interactive-components/src/primitives/controls"],
    render: () => <ControlsPrimitivesDemo />,
    controls: {},
  },
];







