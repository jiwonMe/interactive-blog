import React from "react";
import { cn } from "../../../../../lib/utils";
import {
  AreaChart,
  BarChart,
  LineChart,
  ScatterPlot,
  SimulationPanel,
  PlaybackControls,
  StatsDisplay,
  Button,
  Toggle,
  Slider,
  Select,
  NumberInput,
} from "@repo/interactive-components";

export type LineChartDemoProps = {
  ticks: number;
  noise: number;
  interactive: boolean;
  showPoints: boolean;
};

export function LineChartDemo(props: LineChartDemoProps) {
  const { ticks, noise, interactive, showPoints } = props;

  const t = Math.max(5, Math.min(120, Math.floor(ticks)));
  const n = Math.max(0, Math.min(10, noise));

  const data = Array.from({ length: t }, (_, i) => {
    const tick = i + 1;
    const base = Math.sin(tick / 6) * 3 + (tick % 7 === 0 ? 8 : 0);
    const jitter = (Math.sin(tick * 17.3) + Math.cos(tick * 9.1)) * 0.5 * n;
    return {
      tick,
      interval: base + jitter,
      timeout: base + jitter + tick * 0.15,
      corrected: (base + jitter) * 0.4,
    };
  });

  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full",
      )}
    >
      <LineChart
        data={data}
        xKey="tick"
        series={[
          { key: "interval", label: "setInterval", color: "#6b5ce7", yKey: "interval" },
          { key: "timeout", label: "setTimeout (재귀)", color: "#10b981", yKey: "timeout" },
          { key: "corrected", label: "setTimeout + 보정", color: "#f59e0b", yKey: "corrected" },
        ]}
        xLabel="tick #"
        yLabel="drift (ms)"
        caption="hover로 값 확인 (visx LineChart interactive)"
        interactive={interactive}
        showPoints={showPoints}
      />
    </div>
  );
}

export type SimulationPanelDemoProps = {
  ticks: number;
  env: string;
  showStats: boolean;
};

export function SimulationPanelDemo(props: SimulationPanelDemoProps) {
  const { ticks, env, showStats } = props;
  const t = Math.max(5, Math.min(120, Math.floor(ticks)));

  const data = Array.from({ length: t }, (_, i) => {
    const tick = i + 1;
    const base = Math.sin(tick / 7) * 2 + (tick % 11 === 0 ? 6 : 0);
    const multiplier =
      env === "chromium" ? 0.35 : env === "firefox" ? 1.0 : env === "safari" ? 0.75 : 0.6;
    const drift = base + tick * 0.05 * multiplier;
    return { tick, drift };
  });

  return (
    <SimulationPanel
      className=""
      title="SimulationPanel (조합 예시)"
      description="Controls / Visualization / Stats 슬롯을 MDX에서 조합하는 패턴을 실험합니다."
    >
      <SimulationPanel.Controls>
        <div
          className={cn(
            /* 레이아웃 */
            "space-y-3",
          )}
        >
          <PlaybackControls
            isPlaying={false}
            canRun={true}
            onPlay={() => {}}
            onPause={() => {}}
            onToggleRunning={() => {}}
            onStep={() => {}}
            onReset={() => {}}
          />
          <div
            className={cn(
              /* 레이아웃 */
              "grid grid-cols-1 sm:grid-cols-2 gap-3",
            )}
          >
            <NumberInput label="ticks" value={t} readOnly />
            <Select
              label="env"
              value={env}
              options={[
                { value: "chromium", label: "chromium" },
                { value: "firefox", label: "firefox" },
                { value: "safari", label: "safari" },
                { value: "node", label: "node" },
              ]}
              disabled
            />
          </div>
        </div>
      </SimulationPanel.Controls>

      <SimulationPanel.Visualization>
        <LineChart
          data={data}
          xKey="tick"
          series={[{ key: "drift", label: `drift (${env})`, color: "#6b5ce7", yKey: "drift" }]}
          xLabel="tick #"
          yLabel="drift (ms)"
          interactive
        />
      </SimulationPanel.Visualization>

      <SimulationPanel.Stats>
        {showStats ? (
          <StatsDisplay
            title="Stats"
            items={[
              { key: "ticks", label: "ticks", value: t },
              { key: "env", label: "env", value: env },
              { key: "points", label: "points", value: data.length },
            ]}
          />
        ) : null}
      </SimulationPanel.Stats>
    </SimulationPanel>
  );
}

export function ControlsPrimitivesDemo() {
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-3xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-white dark:bg-zinc-950",
        "border border-zinc-200 dark:border-zinc-800",
      )}
    >
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold mb-4",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100",
        )}
      >
        Controls Primitives (Button/Slider/Select/Toggle/NumberInput)
      </h3>

      <div
        className={cn(
          /* 레이아웃 */
          "grid grid-cols-1 sm:grid-cols-2 gap-4",
        )}
      >
        <div className="space-y-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <div className="space-y-3">
          <Toggle defaultChecked />
          <NumberInput label="NumberInput" defaultValue={42} />
          <Slider label="Slider" defaultValue={50} />
          <Select
            label="Select"
            defaultValue="a"
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export type BarsDemoProps = {
  buckets: number;
};

export function BarsDemo(props: BarsDemoProps) {
  const n = Math.max(3, Math.min(16, Math.floor(props.buckets)));
  const data = Array.from({ length: n }, (_, i) => {
    const key = `B${i + 1}`;
    const v = Math.max(0, Math.sin(i / 2) * 10 + 12 + (i % 3) * 2);
    return { key, v };
  });

  return (
    <div className="w-full">
      <BarChart
        data={data}
        xKey="key"
        series={[{ key: "v", label: "value", color: "#10b981", yKey: "v" }]}
        xLabel="bucket"
        yLabel="value"
      />
    </div>
  );
}

export type ScatterDemoProps = {
  points: number;
};

export function ScatterDemo(props: ScatterDemoProps) {
  const n = Math.max(20, Math.min(300, Math.floor(props.points)));
  const data = Array.from({ length: n }, (_, i) => {
    const x = i;
    const y = Math.sin(i / 8) * 10 + Math.cos(i * 1.7) * 2;
    return { x, y };
  });

  return (
    <div className="w-full">
      <ScatterPlot
        xLabel="x"
        yLabel="y"
        series={[
          { key: "s", label: "points", color: "#f59e0b", xKey: "x", yKey: "y", data },
        ]}
      />
    </div>
  );
}

export type AreaDemoProps = {
  ticks: number;
};

export function AreaDemo(props: AreaDemoProps) {
  const t = Math.max(10, Math.min(160, Math.floor(props.ticks)));
  const data = Array.from({ length: t }, (_, i) => {
    const tick = i + 1;
    const v = Math.max(0, Math.sin(tick / 10) * 8 + 12);
    return { tick, v };
  });

  return (
    <div className="w-full">
      <AreaChart
        data={data}
        xKey="tick"
        series={[{ key: "v", label: "value", color: "#6b5ce7", yKey: "v" }]}
        xLabel="tick #"
        yLabel="value"
      />
    </div>
  );
}




