import React from "react";
import { RechartsHistogram, RechartsLineChart } from "@repo/interactive-components";

export type RechartsLineDemoProps = {
  ticks: number;
};

export function RechartsLineDemo(props: RechartsLineDemoProps) {
  const t = Math.max(5, Math.min(160, Math.floor(props.ticks)));
  const data = Array.from({ length: t }, (_, i) => {
    const tick = i + 1;
    const y = Math.sin(tick / 7) * 8 + 12;
    return { tick, y };
  });

  return (
    <RechartsLineChart
      xKey="tick"
      data={data}
      series={[{ key: "y", name: "value", color: "#6b5ce7", yKey: "y", type: "monotone" }]}
      xLabel="tick #"
      yLabel="value"
    />
  );
}

export type RechartsHistogramDemoProps = {
  points: number;
  bins: number;
};

export function RechartsHistogramDemo(props: RechartsHistogramDemoProps) {
  const n = Math.max(50, Math.min(2000, Math.floor(props.points)));
  const values = Array.from({ length: n }, (_, i) => {
    // 간단한 혼합 분포
    const a = Math.sin(i / 9) * 0.8;
    const b = Math.cos(i / 23) * 0.4;
    return a + b + (i % 17 === 0 ? 1.2 : 0);
  });

  return <RechartsHistogram values={values} bins={props.bins} xLabel="bin" yLabel="count" />;
}


