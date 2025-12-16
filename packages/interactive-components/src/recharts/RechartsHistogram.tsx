'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { parseJsonArray } from '../utils/json';

export type HistogramDatum = {
  bin: string;
  count: number;
};

export interface RechartsHistogramProps {
  className?: string;
  height?: number;

  values?: number[];
  valuesJson?: string;

  bins?: number;
  color?: string;
  xLabel?: string;
  yLabel?: string;
}

function resolveValues(direct: number[] | undefined, json: string | undefined) {
  if (direct && Array.isArray(direct)) return { ok: true as const, value: direct };
  if (!json) return { ok: true as const, value: [] as number[] };
  const parsed = parseJsonArray<unknown>(json);
  if (!parsed.ok) return parsed as { ok: false; error: string };

  const nums = parsed.value
    .map((v) => (typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN))
    .filter((v) => Number.isFinite(v));

  return { ok: true as const, value: nums };
}

function buildHistogram(values: number[], bins: number): HistogramDatum[] {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return [{ bin: `${min}`, count: values.length }];
  }

  const n = Math.max(1, Math.floor(bins));
  const width = (max - min) / n;
  const counts = Array.from({ length: n }, () => 0);

  for (const v of values) {
    const idx = Math.min(n - 1, Math.max(0, Math.floor((v - min) / width)));
    counts[idx] += 1;
  }

  return counts.map((count, i) => {
    const a = min + i * width;
    const b = i === n - 1 ? max : min + (i + 1) * width;
    const label = `${a.toFixed(2)}–${b.toFixed(2)}`;
    return { bin: label, count };
  });
}

export function RechartsHistogram(props: RechartsHistogramProps) {
  const {
    className,
    height = 360,
    values,
    valuesJson,
    bins = 20,
    color = '#10b981',
    xLabel,
    yLabel,
  } = props;

  const valuesResult = React.useMemo(() => resolveValues(values, valuesJson), [values, valuesJson]);

  if (!valuesResult.ok) {
    return (
      <div className={className} style={{ color: 'crimson', fontSize: 12 }}>
        valuesJson parse error: {valuesResult.error}
      </div>
    );
  }

  const data = React.useMemo(() => buildHistogram(valuesResult.value, bins), [valuesResult.value, bins]);

  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, bottom: 24, left: 32 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="bin" interval="preserveStartEnd" angle={-20} textAnchor="end" height={56} label={xLabel ? { value: xLabel, position: 'insideBottomRight', offset: -8 } : undefined} />
            <YAxis label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined} />
            <Tooltip />
            <Bar dataKey="count" fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


