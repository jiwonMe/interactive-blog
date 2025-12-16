'use client';

import * as React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { parseJsonArray } from '../utils/json';

export type RechartsLineSeries = {
  key: string;
  name?: string;
  color?: string;
  yKey?: string;
  // Recharts `Line`의 curve type. (버전별 타입 정의가 달라질 수 있어 any로 둡니다)
  type?: any;
};

export interface RechartsLineChartProps {
  className?: string;
  height?: number;

  data?: any[];
  dataJson?: string;

  series?: RechartsLineSeries[];
  seriesJson?: string;

  xKey: string;
  xLabel?: string;
  yLabel?: string;

  showGrid?: boolean;
  showLegend?: boolean;
}

function resolveArrayProp<T>(direct: T[] | undefined, json: string | undefined) {
  if (direct && Array.isArray(direct)) return { ok: true as const, value: direct };
  if (!json) return { ok: true as const, value: [] as T[] };
  return parseJsonArray<T>(json);
}

export function RechartsLineChart(props: RechartsLineChartProps) {
  const {
    className,
    height = 360,
    data,
    dataJson,
    series,
    seriesJson,
    xKey,
    xLabel,
    yLabel,
    showGrid = true,
    showLegend = true,
  } = props;

  const dataResult = React.useMemo(() => resolveArrayProp<any>(data, dataJson), [data, dataJson]);
  const seriesResult = React.useMemo(
    () => resolveArrayProp<RechartsLineSeries>(series, seriesJson),
    [series, seriesJson],
  );

  if (!dataResult.ok) {
    return (
      <div className={className} style={{ color: 'crimson', fontSize: 12 }}>
        dataJson parse error: {dataResult.error}
      </div>
    );
  }

  if (!seriesResult.ok) {
    return (
      <div className={className} style={{ color: 'crimson', fontSize: 12 }}>
        seriesJson parse error: {seriesResult.error}
      </div>
    );
  }

  const seriesList = seriesResult.value.length
    ? seriesResult.value
    : [{ key: 'y', name: 'y', color: '#6b5ce7', yKey: 'y', type: 'monotone' }];

  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataResult.value} margin={{ top: 16, right: 16, bottom: 24, left: 32 }}>
            {showGrid ? <CartesianGrid strokeDasharray="3 3" opacity={0.3} /> : null}
            <XAxis dataKey={xKey} label={xLabel ? { value: xLabel, position: 'insideBottomRight', offset: -8 } : undefined} />
            <YAxis label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined} />
            <Tooltip />
            {showLegend ? <Legend /> : null}
            {seriesList.map((s) => (
              <Line
                key={s.key}
                type={s.type ?? 'monotone'}
                dataKey={s.yKey ?? s.key}
                name={s.name ?? s.key}
                stroke={s.color ?? '#6b5ce7'}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


