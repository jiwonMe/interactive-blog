import * as React from 'react';
import { LinePath, Circle } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { cx } from '../utils/cx';
import { ChartContainer } from '../primitives/chart/ChartContainer';
import { Axis } from '../primitives/chart/Axis';
import { Grid } from '../primitives/chart/Grid';
import { Legend } from '../primitives/chart/Legend';
import { Tooltip } from '../primitives/chart/Tooltip';
import { chartCaption, chartFooter } from '../styles/recipes/chart.css';
import { parseJsonArray } from '../utils/json';

export type LineChartSeries<T> = {
  key: string;
  label?: string;
  color: string;
  yAccessor?: (d: T) => number;
  yKey?: string;
};

export interface LineChartProps<T> {
  className?: string;
  height?: number;
  data?: T[];
  dataJson?: string;
  xAccessor?: (d: T) => number;
  xKey?: string;
  series?: LineChartSeries<T>[];
  seriesJson?: string;
  xLabel?: string;
  yLabel?: string;
  caption?: string;
  interactive?: boolean;
  showPoints?: boolean;
}

type TooltipState = {
  open: boolean;
  x: number;
  y: number;
  datumIndex: number;
};

function readNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return NaN;
}

export function LineChart<T>(props: LineChartProps<T>) {
  const {
    className,
    height = 360,
    data,
    dataJson,
    xAccessor,
    xKey,
    series,
    seriesJson,
    xLabel,
    yLabel,
    caption,
    interactive = false,
    showPoints = false,
  } = props;

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
    : (series ?? [])) as LineChartSeries<any>[];

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = React.useState<TooltipState>({
    open: false,
    x: 0,
    y: 0,
    datumIndex: 0,
  });

  const domain = React.useMemo(() => {
    if (resolvedData.length === 0) return { x: [0, 1] as [number, number], y: [-1, 1] as [number, number] };

    const xValueOf = (d: any) => {
      if (xAccessor) return xAccessor(d);
      if (xKey) return readNumber(d?.[xKey]);
      return NaN;
    };

    const yValueOf = (s: LineChartSeries<any>, d: any) => {
      if (s.yAccessor) return s.yAccessor(d);
      if (s.yKey) return readNumber(d?.[s.yKey]);
      return NaN;
    };

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (const d of resolvedData) {
      const x = xValueOf(d);
      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      for (const s of resolvedSeries) {
        const y = yValueOf(s, d);
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    }

    if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) return { x: [0, 1] as [number, number], y: [-1, 1] as [number, number] };
    if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) return { x: [xMin, xMax] as [number, number], y: [-1, 1] as [number, number] };

    const pad = (yMax - yMin) * 0.08;
    const y0 = yMin - pad;
    const y1 = yMax + pad;

    return {
      x: [xMin, xMax] as [number, number],
      y: [y0 === y1 ? y0 - 1 : y0, y0 === y1 ? y1 + 1 : y1] as [number, number],
    };
  }, [resolvedData, resolvedSeries, xAccessor, xKey]);

  const legendItems = React.useMemo(
    () => resolvedSeries.map((s) => ({ key: s.key, label: s.label ?? s.key, color: s.color })),
    [resolvedSeries],
  );

  return (
    <div ref={wrapperRef} className={cx(className)} style={{ position: 'relative' }}>
      <ChartContainer height={height}>
        {({ innerWidth, innerHeight }) => {
          const xScale = scaleLinear({ domain: domain.x, range: [0, innerWidth] });
          const yScale = scaleLinear({ domain: domain.y, range: [innerHeight, 0] });

          const xValueOf = (d: any) => {
            if (xAccessor) return xAccessor(d);
            if (xKey) return readNumber(d?.[xKey]);
            return NaN;
          };

          const yValueOf = (s: LineChartSeries<any>, d: any) => {
            if (s.yAccessor) return s.yAccessor(d);
            if (s.yKey) return readNumber(d?.[s.yKey]);
            return NaN;
          };

          const onMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
            if (!interactive || resolvedData.length === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const localX = e.clientX - rect.left;
            const xValue = xScale.invert ? xScale.invert(localX) : domain.x[0];

            let bestIdx = 0;
            let bestDist = Infinity;
            for (let i = 0; i < resolvedData.length; i++) {
              const dx = Math.abs(xValueOf(resolvedData[i]) - xValue);
              if (dx < bestDist) {
                bestDist = dx;
                bestIdx = i;
              }
            }

            const wrapper = wrapperRef.current?.getBoundingClientRect();
            const x = wrapper ? e.clientX - wrapper.left + 12 : 12;
            const y = wrapper ? e.clientY - wrapper.top + 12 : 12;

            setTooltip({ open: true, x, y, datumIndex: bestIdx });
          };

          return (
            <>
              <Grid xScale={xScale} yScale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} />
              <Axis orientation="left" scale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} label={yLabel} />
              <Axis orientation="bottom" scale={xScale} innerWidth={innerWidth} innerHeight={innerHeight} label={xLabel} />

              {resolvedSeries.map((s) => (
                <g key={s.key}>
                  <LinePath
                    data={resolvedData}
                    x={(d) => xScale(xValueOf(d))}
                    y={(d) => yScale(yValueOf(s, d))}
                    stroke={s.color}
                    strokeWidth={2}
                  />
                  {showPoints
                    ? resolvedData.map((d, i) => (
                        <Circle
                          key={`${s.key}:${i}`}
                          cx={xScale(xValueOf(d))}
                          cy={yScale(yValueOf(s, d))}
                          r={2.5}
                          fill={s.color}
                          opacity={0.9}
                        />
                      ))
                    : null}
                </g>
              ))}

              {interactive ? (
                <rect
                  x={0}
                  y={0}
                  width={innerWidth}
                  height={innerHeight}
                  fill="transparent"
                  onMouseMove={onMouseMove}
                  onMouseLeave={() => setTooltip((t) => ({ ...t, open: false }))}
                />
              ) : null}
            </>
          );
        }}
      </ChartContainer>

      <div className={chartFooter}>
        <Legend items={legendItems} />
        {caption ? <div className={chartCaption}>{caption}</div> : null}
      </div>

      {tooltip.open ? (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            x ={' '}
            {xAccessor
              ? String(xAccessor(resolvedData[tooltip.datumIndex]))
              : xKey
                ? String((resolvedData as any)[tooltip.datumIndex]?.[xKey])
                : '(unknown)'}
          </div>
          {resolvedSeries.map((s) => (
            <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ color: s.color }}>{s.label ?? s.key}</span>
              <span>
                {s.yAccessor
                  ? s.yAccessor(resolvedData[tooltip.datumIndex]).toFixed(3)
                  : s.yKey
                    ? readNumber((resolvedData as any)[tooltip.datumIndex]?.[s.yKey]).toFixed(3)
                    : 'NaN'}
              </span>
            </div>
          ))}
        </Tooltip>
      ) : null}
    </div>
  );
}






