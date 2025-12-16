import * as React from 'react';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { cx } from '../utils/cx';
import { ChartContainer } from '../primitives/chart/ChartContainer';
import { Axis } from '../primitives/chart/Axis';
import { Grid } from '../primitives/chart/Grid';
import { Legend } from '../primitives/chart/Legend';
import { chartCaption, chartFooter } from '../styles/recipes/chart.css';
import { parseJsonArray } from '../utils/json';

export type BarChartSeries<T> = {
  key: string;
  label?: string;
  color: string;
  yAccessor?: (d: T) => number;
  yKey?: string;
};

export interface BarChartProps<T> {
  className?: string;
  height?: number;
  data?: T[];
  dataJson?: string;
  xAccessor?: (d: T) => string;
  xKey?: string;
  series?: BarChartSeries<T>[];
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

export function BarChart<T>(props: BarChartProps<T>) {
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
    : (series ?? [])) as BarChartSeries<any>[];

  const domain = React.useMemo(() => {
    const xValueOf = (d: any) => {
      if (xAccessor) return xAccessor(d);
      if (xKey) return String(d?.[xKey]);
      return '';
    };

    const keys = resolvedData.map(xValueOf);
    let yMax = 0;
    for (const d of resolvedData) {
      for (const s of resolvedSeries) {
        const y = s.yAccessor ? s.yAccessor(d) : s.yKey ? readNumber((d as any)?.[s.yKey]) : NaN;
        yMax = Math.max(yMax, y);
      }
    }
    return { keys, y: [0, yMax || 1] as [number, number] };
  }, [resolvedData, resolvedSeries, xAccessor, xKey]);

  const legendItems = React.useMemo(
    () => resolvedSeries.map((s) => ({ key: s.key, label: s.label ?? s.key, color: s.color })),
    [resolvedSeries],
  );

  return (
    <div className={cx(className)}>
      <ChartContainer height={height}>
        {({ innerWidth, innerHeight }) => {
          const xScale = scaleBand({ domain: domain.keys, range: [0, innerWidth], padding: 0.25 });
          const yScale = scaleLinear({ domain: domain.y, range: [innerHeight, 0] });

          const xValueOf = (d: any) => {
            if (xAccessor) return xAccessor(d);
            if (xKey) return String(d?.[xKey]);
            return '';
          };

          const groupWidth = xScale.bandwidth();
          const barWidth = resolvedSeries.length > 0 ? groupWidth / resolvedSeries.length : groupWidth;

          return (
            <>
              <Grid xScale={xScale} yScale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} />
              <Axis orientation="left" scale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} label={yLabel} />
              <Axis
                orientation="bottom"
                scale={xScale}
                innerWidth={innerWidth}
                innerHeight={innerHeight}
                label={xLabel}
                tickCount={Math.min(10, domain.keys.length)}
              />

              {resolvedData.map((d) => {
                const x0 = xScale(xValueOf(d)) ?? 0;
                return (
                  <g key={xValueOf(d)}>
                    {resolvedSeries.map((s, i) => {
                      const v = s.yAccessor ? s.yAccessor(d) : s.yKey ? readNumber((d as any)?.[s.yKey]) : NaN;
                      const y = yScale(v);
                      const h = innerHeight - y;
                      return (
                        <Bar
                          key={s.key}
                          x={x0 + i * barWidth}
                          y={y}
                          width={Math.max(0, barWidth - 2)}
                          height={Math.max(0, h)}
                          fill={s.color}
                          rx={4}
                          opacity={0.9}
                        />
                      );
                    })}
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


