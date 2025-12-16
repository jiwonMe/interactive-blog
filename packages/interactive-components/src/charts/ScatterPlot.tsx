import * as React from 'react';
import { Circle } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { cx } from '../utils/cx';
import { ChartContainer } from '../primitives/chart/ChartContainer';
import { Axis } from '../primitives/chart/Axis';
import { Grid } from '../primitives/chart/Grid';
import { Legend } from '../primitives/chart/Legend';
import { chartCaption, chartFooter } from '../styles/recipes/chart.css';
import { parseJsonArray } from '../utils/json';

export type ScatterPlotSeries<T> = {
  key: string;
  label?: string;
  color: string;
  xAccessor?: (d: T) => number;
  yAccessor?: (d: T) => number;
  xKey?: string;
  yKey?: string;
  data?: T[];
  dataJson?: string;
};

export interface ScatterPlotProps<T> {
  className?: string;
  height?: number;
  series?: ScatterPlotSeries<T>[];
  seriesJson?: string;
  xLabel?: string;
  yLabel?: string;
  caption?: string;
  pointRadius?: number;
}

function readNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return NaN;
}

function readSeriesData(s: ScatterPlotSeries<any>) {
  if (Array.isArray(s.data)) return { ok: true as const, value: s.data as any[] };
  if (!s.dataJson) return { ok: true as const, value: [] as any[] };
  return parseJsonArray<any>(s.dataJson);
}

export function ScatterPlot<T>(props: ScatterPlotProps<T>) {
  const { className, height = 360, series, seriesJson, xLabel, yLabel, caption, pointRadius = 3 } = props;

  const seriesResult = React.useMemo(() => {
    if (Array.isArray(series)) return { ok: true as const, value: series as any[] };
    if (!seriesJson) return { ok: true as const, value: [] as any[] };
    return parseJsonArray<any>(seriesJson);
  }, [series, seriesJson]);

  if (!seriesResult.ok) {
    return (
      <div className={cx(className)} style={{ color: 'crimson', fontSize: 12 }}>
        seriesJson parse error: {seriesResult.error}
      </div>
    );
  }

  const resolvedSeries = (seriesResult.value.length ? seriesResult.value : (series ?? [])) as ScatterPlotSeries<any>[];

  const domain = React.useMemo(() => {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (const s of resolvedSeries) {
      const xValueOf = (d: any) => (s.xAccessor ? s.xAccessor(d) : s.xKey ? readNumber(d?.[s.xKey]) : NaN);
      const yValueOf = (d: any) => (s.yAccessor ? s.yAccessor(d) : s.yKey ? readNumber(d?.[s.yKey]) : NaN);

      const parsed = readSeriesData(s);
      const dataList = parsed.ok ? parsed.value : [];

      for (const d of dataList) {
        const x = xValueOf(d);
        const y = yValueOf(d);
        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    }

    if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) return { x: [0, 1] as [number, number], y: [0, 1] as [number, number] };
    if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) return { x: [xMin, xMax] as [number, number], y: [0, 1] as [number, number] };

    const pad = (yMax - yMin) * 0.08;
    const y0 = yMin - pad;
    const y1 = yMax + pad;

    return {
      x: [xMin, xMax] as [number, number],
      y: [y0 === y1 ? y0 - 1 : y0, y0 === y1 ? y1 + 1 : y1] as [number, number],
    };
  }, [resolvedSeries]);

  const legendItems = React.useMemo(
    () => resolvedSeries.map((s) => ({ key: s.key, label: s.label ?? s.key, color: s.color })),
    [resolvedSeries],
  );

  return (
    <div className={cx(className)}>
      <ChartContainer height={height}>
        {({ innerWidth, innerHeight }) => {
          const xScale = scaleLinear({ domain: domain.x, range: [0, innerWidth] });
          const yScale = scaleLinear({ domain: domain.y, range: [innerHeight, 0] });

          return (
            <>
              <Grid xScale={xScale} yScale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} />
              <Axis orientation="left" scale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} label={yLabel} />
              <Axis orientation="bottom" scale={xScale} innerWidth={innerWidth} innerHeight={innerHeight} label={xLabel} />

              {resolvedSeries.map((s) => {
                const parsed = readSeriesData(s);
                const dataList = parsed.ok ? parsed.value : [];
                return (
                <g key={s.key}>
                  {dataList.map((d, i) => (
                    <Circle
                      key={`${s.key}:${i}`}
                      cx={xScale(s.xAccessor ? s.xAccessor(d) : s.xKey ? readNumber((d as any)?.[s.xKey]) : NaN)}
                      cy={yScale(s.yAccessor ? s.yAccessor(d) : s.yKey ? readNumber((d as any)?.[s.yKey]) : NaN)}
                      r={pointRadius}
                      fill={s.color}
                      opacity={0.85}
                    />
                  ))}
                </g>
                );
              })}
            </>
          );
        }}
      </ChartContainer>

      <div className={chartFooter}>
        <Legend items={legendItems} />
        {caption ? <div className={chartCaption}>{caption}</div> : null}
      </div>
    </div>
  );
}



