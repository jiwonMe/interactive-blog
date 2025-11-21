'use client';

import * as React from 'react';
import * as d3 from 'd3';
import { cn } from '../../../lib/utils';

type Environment = 'chromium' | 'firefox' | 'safari' | 'node';
type Strategy = 'interval' | 'timeout' | 'timeout-corrected';

type Series = {
  key: Strategy;
  color: string;
  values: { tick: number; driftMs: number }[];
};

const STRATEGY_META: Record<Strategy, { label: string; color: string }> = {
  'interval': { label: 'setInterval', color: '#6b5ce7' },
  'timeout': { label: 'setTimeout (재귀)', color: '#10b981' },
  'timeout-corrected': { label: 'setTimeout + 보정', color: '#f59e0b' },
};

function simulateDrift(params: {
  ticks: number;
  intervalMs: number;
  env: Environment;
}): Series[] {
  const { ticks, intervalMs, env } = params;
  const jitterFor = (n: number) => {
    const base = env === 'chromium' ? 0.35 : env === 'node' ? 0.6 : env === 'safari' ? 0.75 : 1.0;
    // 작은 지터 (양/음 랜덤)
    return (Math.random() - 0.5) * 2 * base;
  };
  const loopDelayFor = (n: number) => {
    // 이벤트 루프가 바쁠수록 딜레이 증가 (환경 가중치)
    const w =
      env === 'chromium' ? 0.15 :
      env === 'safari' ? 0.35 :
      env === 'node' ? 0.3 : 0.45;
    return w + (n % 7 === 0 ? w * 6 : 0); // 가끔 큰 스파이크
  };

  const series: Series[] = (['interval', 'timeout', 'timeout-corrected'] as Strategy[]).map((key) => ({
    key,
    color: STRATEGY_META[key].color,
    values: [],
  }));

  // 기준 시간
  const t0 = 0;

  // 누적 상태
  let lastStartInterval = t0;
  let lastStartTimeout = t0;
  let correctedCount = 0;
  const correctedStart = t0;

  for (let n = 1; n <= ticks; n++) {
    const expected = t0 + n * intervalMs;

    // setInterval: 환경 특성 반영. Chromium은 expected를 최대한 따르려 시도(보정),
    // 그 외는 이전 시작 기준으로 새 주기를 예약하는 경향(누적).
    const intervalDelay = loopDelayFor(n) + jitterFor(n);
    let intervalActual: number;
    if (env === 'chromium') {
      // 늦어졌다면 가능한 expected 시각에 붙도록
      const candidate = Math.max(expected, lastStartInterval + 0);
      intervalActual = candidate + intervalDelay;
    } else {
      intervalActual = lastStartInterval + intervalMs + intervalDelay;
    }
    lastStartInterval = intervalActual;
    const intervalDrift = intervalActual - expected;

    // setTimeout (재귀): 이전 종료 후 다음 예약 ⇒ 실행시간/지연이 누적
    const timeoutActual = lastStartTimeout + intervalMs + loopDelayFor(n) + jitterFor(n);
    lastStartTimeout = timeoutActual;
    const timeoutDrift = timeoutActual - expected;

    // setTimeout + 보정: 기대 시각에 맞춰 다음 딜레이 조정
    correctedCount += 1;
    const correctedExpected = correctedStart + correctedCount * intervalMs;
    const nowLike = Math.max(lastStartInterval, lastStartTimeout, correctedStart + (correctedCount - 1) * intervalMs);
    const driftNow = nowLike - correctedExpected;
    const correctedActual = Math.max(correctedExpected, nowLike) + Math.max(jitterFor(n), 0);
    const correctedDrift = correctedActual - expected;

    series[0].values.push({ tick: n, driftMs: intervalDrift });
    series[1].values.push({ tick: n, driftMs: timeoutDrift });
    series[2].values.push({ tick: n, driftMs: correctedDrift });
  }
  return series;
}

export function IntervalDriftChart() {
  const [intervalMs, setIntervalMs] = React.useState(200);
  const [ticks, setTicks] = React.useState(40);
  const [env, setEnv] = React.useState<Environment>('chromium');
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const render = React.useCallback(() => {
    if (!svgRef.current) return;
    const width = svgRef.current.clientWidth || 800;
    const height = 320;
    const margin = { top: 20, right: 20, bottom: 36, left: 48 };

    const data = simulateDrift({ ticks, intervalMs, env });

    const x = d3.scaleLinear().domain([1, ticks]).range([margin.left, width - margin.right]);
    const yMax = Math.max(
      8,
      d3.max(data.flatMap((s) => s.values.map((v) => Math.abs(v.driftMs)))) || 0
    );
    const y = d3.scaleLinear().domain([-yMax, yMax]).nice().range([height - margin.bottom, margin.top]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(Math.min(10, ticks)))
      .call((g) => g.append('text')
        .attr('x', width - margin.right)
        .attr('y', 30)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text('tick #'));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.append('text')
        .attr('x', 0)
        .attr('y', margin.top - 8)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text('drift (ms)'));

    // 기준선
    svg
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    const line = d3
      .line<{ tick: number; driftMs: number }>()
      .x((d) => x(d.tick))
      .y((d) => y(d.driftMs))
      .curve(d3.curveMonotoneX);

    data.forEach((s) => {
      svg
        .append('path')
        .datum(s.values)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // 범례
    const legend = svg.append('g').attr('transform', `translate(${margin.left}, ${height - margin.bottom + 8})`);
    data.forEach((s, i) => {
      const g = legend.append('g').attr('transform', `translate(${i * 200}, 0)`);
      g.append('rect').attr('width', 12).attr('height', 12).attr('fill', s.color).attr('rx', 2);
      g.append('text')
        .attr('x', 16)
        .attr('y', 11)
        .attr('fill', 'currentColor')
        .text(STRATEGY_META[s.key].label);
    });
  }, [ticks, intervalMs, env]);

  React.useEffect(() => {
    render();
    if (typeof window === 'undefined') return;
    const onResize = () => render();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [render]);

  return (
    <div
      className={cn(
        /* layout */ 'w-full',
        /* spacing */ 'my-6',
      )}
    >
      <div
        className={cn(
          /* layout */ 'flex flex-wrap items-center gap-3',
          /* spacing */ 'mb-3',
        )}
      >
        <label className={cn(/* color */ 'text-sm text-zinc-500')}>
          간격(ms){' '}
          <input
            type="number"
            min={10}
            value={intervalMs}
            onChange={(e) => setIntervalMs(Math.max(1, Number(e.target.value)))}
            className={cn(
              /* form */ 'rounded-md border border-zinc-300 bg-transparent',
              /* spacing */ 'px-2 py-1',
              /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
            )}
          />
        </label>
        <label className={cn(/* color */ 'text-sm text-zinc-500')}>
          틱 수{' '}
          <input
            type="number"
            min={5}
            value={ticks}
            onChange={(e) => setTicks(Math.max(1, Number(e.target.value)))}
            className={cn(
              /* form */ 'rounded-md border border-zinc-300 bg-transparent',
              /* spacing */ 'px-2 py-1',
              /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
            )}
          />
        </label>
        <label className={cn(/* color */ 'text-sm text-zinc-500')}>
          환경{' '}
          <select
            value={env}
            onChange={(e) => setEnv(e.target.value as Environment)}
            className={cn(
              /* form */ 'rounded-md border border-zinc-300 bg-transparent',
              /* spacing */ 'px-2 py-1',
              /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
            )}
          >
            <option value="chromium">Chromium</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="node">Node.js</option>
          </select>
        </label>
      </div>
      <svg ref={svgRef} width="100%" height="360" />
      <p
        className={cn(
          /* text */ 'text-xs text-zinc-500',
          /* spacing */ 'mt-2',
        )}
      >
        본 시뮬레이션은 개념 설명을 위한 근사 모델입니다. 실제 환경의 타이머 동작과 다를 수 있습니다.
      </p>
    </div>
  );
}

export default IntervalDriftChart;


