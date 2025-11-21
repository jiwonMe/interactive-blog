'use client';

import * as React from 'react';
import p5 from 'p5';
import { cn } from '../../../lib/utils';

type Mode = 'interval' | 'timeout' | 'timeout-corrected';

type Tick = {
  t: number; // ms
  drift: number; // actual - expected
};

export function EventLoopSimulator() {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const p5Ref = React.useRef<p5 | null>(null);
  const [mode, setMode] = React.useState<Mode>('interval');
  const [intervalMs, setIntervalMs] = React.useState(200);
  const [running, setRunning] = React.useState(false);
  const ticksRef = React.useRef<Tick[]>([]);
  const startRef = React.useRef<number>(0);
  const countRef = React.useRef<number>(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      if ((timerRef.current as any)[Symbol.toStringTag] === 'Timeout') {
        clearTimeout(timerRef.current as any);
      } else {
        clearInterval(timerRef.current as any);
      }
      timerRef.current = null;
    }
  }, []);

  const recordTick = React.useCallback((now: number) => {
    const expected = startRef.current + countRef.current * intervalMs;
    ticksRef.current.push({ t: now, drift: now - expected });
    // 10초 이내만 유지
    const cutoff = now - 10000;
    ticksRef.current = ticksRef.current.filter((d) => d.t >= cutoff);
  }, [intervalMs]);

  const start = React.useCallback(() => {
    clearTimer();
    ticksRef.current = [];
    startRef.current = performance.now();
    countRef.current = 0;
    setRunning(true);
    if (mode === 'interval') {
      const id = setInterval(() => {
        countRef.current += 1;
        recordTick(performance.now());
      }, intervalMs);
      timerRef.current = id;
    } else if (mode === 'timeout') {
      const tick = () => {
        countRef.current += 1;
        recordTick(performance.now());
        timerRef.current = setTimeout(tick, intervalMs);
      };
      timerRef.current = setTimeout(tick, intervalMs);
    } else {
      // timeout-corrected
      const tick = () => {
        countRef.current += 1;
        const now = performance.now();
        recordTick(now);
        const expectedNext = startRef.current + countRef.current * intervalMs;
        const drift = now - expectedNext;
        const nextDelay = Math.max(0, intervalMs - drift);
        timerRef.current = setTimeout(tick, nextDelay);
      };
      timerRef.current = setTimeout(tick, intervalMs);
    }
  }, [mode, intervalMs, recordTick, clearTimer]);

  const stop = React.useCallback(() => {
    clearTimer();
    setRunning(false);
  }, [clearTimer]);

  const block = React.useCallback((ms: number) => {
    const end = performance.now() + ms;
    // busy wait
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (performance.now() >= end) break;
    }
  }, []);

  React.useEffect(() => {
    if (!hostRef.current) return;
    const sketch = (s: p5) => {
      let W = 800;
      let H = 200;
      s.setup = () => {
        const c = s.createCanvas(W, H);
        c.parent(hostRef.current!);
        s.frameRate(60);
      };
      s.windowResized = () => {
        const el = hostRef.current!;
        W = Math.max(320, el.clientWidth);
        s.resizeCanvas(W, H);
      };
      s.draw = () => {
        s.background(250);
        const now = performance.now();
        const viewMs = 5000; // 최근 5초 표시
        const t0 = now - viewMs;
        // 축
        s.stroke(230);
        s.strokeWeight(1);
        s.line(8, H - 28, W - 8, H - 28);
        s.noStroke();
        s.fill(120);
        s.textSize(10);
        s.textAlign(s.LEFT, s.CENTER);
        s.text('time (last 5s)', 8, H - 40);
        // expected grid
        const expectedStart = startRef.current;
        const period = intervalMs;
        s.stroke(235);
        for (let t = expectedStart; t < now; t += period) {
          const x = 8 + ((t - t0) / viewMs) * (W - 16);
          if (x >= 8 && x <= W - 8) {
            s.line(x, 16, x, H - 28);
          }
        }
        // ticks
        const ticks = ticksRef.current;
        s.noStroke();
        s.fill('#2563eb');
        ticks.forEach((d) => {
          const x = 8 + ((d.t - t0) / viewMs) * (W - 16);
          if (x >= 8 && x <= W - 8) {
            s.circle(x, H - 40, 6);
          }
        });
        // drift label
        const last = ticks[ticks.length - 1];
        if (last) {
          s.fill(60);
          s.textAlign(s.RIGHT, s.TOP);
          s.text(`drift: ${last.drift.toFixed(1)} ms`, W - 10, 10);
        }
      };
    };
    const instance = new p5(sketch);
    p5Ref.current = instance;
    return () => {
      instance.remove();
      p5Ref.current = null;
    };
  }, [intervalMs]);

  // 모드/간격 변경 시 재시작
  React.useEffect(() => {
    if (running) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, intervalMs]);

  React.useEffect(() => stop, [stop]);

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
          모드{' '}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className={cn(
              /* form */ 'rounded-md border border-zinc-300 bg-transparent',
              /* spacing */ 'px-2 py-1',
              /* focus */ 'focus:outline-none focus:ring-2 focus:ring-indigo-400',
            )}
          >
            <option value="interval">setInterval</option>
            <option value="timeout">setTimeout(재귀)</option>
            <option value="timeout-corrected">setTimeout + 보정</option>
          </select>
        </label>
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
        {!running ? (
          <button
            onClick={start}
            className={cn(
              /* button */ 'rounded-md border border-indigo-500 text-indigo-600',
              /* spacing */ 'px-3 py-1',
              /* hover */ 'hover:bg-indigo-50',
            )}
          >
            시작
          </button>
        ) : (
          <button
            onClick={stop}
            className={cn(
              /* button */ 'rounded-md border border-rose-500 text-rose-600',
              /* spacing */ 'px-3 py-1',
              /* hover */ 'hover:bg-rose-50',
            )}
          >
            정지
          </button>
        )}
        <button
          onClick={() => block(600)}
          className={cn(
            /* button */ 'rounded-md border border-zinc-400 text-zinc-700',
            /* spacing */ 'px-3 py-1',
            /* hover */ 'hover:bg-zinc-50',
          )}
        >
          메인 스레드 600ms 블로킹
        </button>
      </div>
      <div ref={hostRef} className={cn(/* layout */ 'w-full', /* border */ 'rounded-lg border border-zinc-200')} />
      <p
        className={cn(
          /* text */ 'text-xs text-zinc-500',
          /* spacing */ 'mt-2',
        )}
      >
        파란 점은 실제 타이머 콜백 실행 시각입니다. 회색 세로선은 이상적(기대) 시각입니다.
      </p>
    </div>
  );
}

export default EventLoopSimulator;


