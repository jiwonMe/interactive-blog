import * as React from 'react';
import { AreaClosed } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { cx } from '../utils/cx';
import { ChartContainer } from '../primitives/chart/ChartContainer';
import { Axis } from '../primitives/chart/Axis';
import { Grid } from '../primitives/chart/Grid';
import { Legend } from '../primitives/chart/Legend';
import { chartCaption, chartFooter } from '../styles/recipes/chart.css';
import { parseJsonArray } from '../utils/json';

export type AreaChartSeries<T> = {
  key: string;
  label?: string;
  color: string;
  yAccessor?: (d: T) => number;
  yKey?: string;
};

export interface AreaChartProps<T> {
  className?: string;
  height?: number;
  data?: T[];
  dataJson?: string;
  xAccessor?: (d: T) => number;
  xKey?: string;
  series?: AreaChartSeries<T>[];
  seriesJson?: string;
  xLabel?: string;
  yLabel?: string;
  caption?: string;
}

function readNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return NaN;
}

export function AreaChart<T>(props: AreaChartProps<T>) {
  const { className, height = 360, data, dataJson, xAccessor, xKey, series, seriesJson, xLabel, yLabel, caption } = props;

  const dataResult = React.useMemo(() => {
    if (Array.isArray(data)) return { ok: true as const, value: data as any[] };
    if (!dataJson) return { ok: true as const, value: [] as any[] };
    return parseJsonArray<any>(dataJson);
  }, [data, dataJson]);

  const seriesResult = React.useMemo(() => {
    if (Array.isArray(series)) return { ok: true as const, value: series as any[] };
    if (!seriesJson) return { ok: true as const, value: [] as any[] };
    return parseJsonArray<any>(seriesJson);
  }, [series, seriesJson]);

  if (!dataResult.ok) {
    return (
      <div className={cx(className)} style={{ color: 'crimson', fontSize: 12 }}>
        dataJson parse error: {dataResult.error}
      </div>
    );
  }

  if (!seriesResult.ok) {
    return (
      <div className={cx(className)} style={{ color: 'crimson', fontSize: 12 }}>
        seriesJson parse error: {seriesResult.error}
      </div>
    );
  }

  const resolvedData = dataResult.value as any[];
  const resolvedSeries = (seriesResult.value.length
    ? seriesResult.value
    : (series ?? [])) as AreaChartSeries<any>[];

  const domain = React.useMemo(() => {
    if (resolvedData.length === 0) return { x: [0, 1] as [number, number], y: [0, 1] as [number, number] };

    const xValueOf = (d: any) => {
      if (xAccessor) return xAccessor(d);
      if (xKey) return readNumber(d?.[xKey]);
      return NaN;
    };

    const yValueOf = (s: AreaChartSeries<any>, d: any) => {
      if (s.yAccessor) return s.yAccessor(d);
      if (s.yKey) return readNumber(d?.[s.yKey]);
      return NaN;
    };

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMax = 0;

    for (const d of resolvedData) {
      const x = xValueOf(d);
      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      for (const s of resolvedSeries) {
        yMax = Math.max(yMax, yValueOf(s, d));
      }
    }

    return { x: [xMin, xMax] as [number, number], y: [0, yMax || 1] as [number, number] };
  }, [resolvedData, resolvedSeries, xAccessor, xKey]);

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

          const xValueOf = (d: any) => {
            if (xAccessor) return xAccessor(d);
            if (xKey) return readNumber(d?.[xKey]);
            return NaN;
          };

          const yValueOf = (s: AreaChartSeries<any>, d: any) => {
            if (s.yAccessor) return s.yAccessor(d);
            if (s.yKey) return readNumber(d?.[s.yKey]);
            return NaN;
          };

          return (
            <>
              <Grid xScale={xScale} yScale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} />
              <Axis orientation="left" scale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} label={yLabel} />
              <Axis orientation="bottom" scale={xScale} innerWidth={innerWidth} innerHeight={innerHeight} label={xLabel} />

              {resolvedSeries.map((s) => (
                <AreaClosed
                  key={s.key}
                  data={resolvedData}
                  x={(d) => xScale(xValueOf(d))}
                  y={(d) => yScale(yValueOf(s, d))}
                  yScale={yScale}
                  fill={s.color}
                  opacity={0.18}
                  stroke={s.color}
                  strokeWidth={2}
                />
              ))}
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




