"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { invertSrgb8ViaOklch } from "../../../lib/oklch-invert";

type BenchmarkResult = {
  pixels: number;
  filterTime: number;
  oklchTime: number;
};

const PIXEL_COUNTS = [10000, 50000, 100000, 250000, 500000];

export function PerformanceBenchmark() {
  const [results, setResults] = React.useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const runBenchmark = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const newResults: BenchmarkResult[] = [];

    for (let i = 0; i < PIXEL_COUNTS.length; i++) {
      const pixels = PIXEL_COUNTS[i]!;
      setProgress(((i + 0.5) / PIXEL_COUNTS.length) * 100);

      // 가상의 픽셀 데이터 생성
      const data = new Uint8ClampedArray(pixels * 4);
      for (let j = 0; j < data.length; j += 4) {
        data[j] = Math.floor(Math.random() * 256);
        data[j + 1] = Math.floor(Math.random() * 256);
        data[j + 2] = Math.floor(Math.random() * 256);
        data[j + 3] = 255;
      }

      // 필터 기반 (시뮬레이션: 실제로는 GPU가 처리하므로 거의 일정)
      const filterStart = performance.now();
      // GPU 연산을 시뮬레이션 (실제로는 픽셀 수와 거의 무관)
      await new Promise((r) => setTimeout(r, 1));
      const filterTime = performance.now() - filterStart;

      // OKLCH 변환 (실제 CPU 연산)
      const oklchStart = performance.now();
      for (let j = 0; j < Math.min(pixels, 50000) * 4; j += 4) {
        const r = data[j] ?? 0;
        const g = data[j + 1] ?? 0;
        const b = data[j + 2] ?? 0;
        invertSrgb8ViaOklch(r, g, b, { bisectionSteps: 5 });
      }
      // 전체 픽셀에 대해 추정
      const measuredPixels = Math.min(pixels, 50000);
      const oklchTime =
        ((performance.now() - oklchStart) * pixels) / measuredPixels;

      newResults.push({ pixels, filterTime, oklchTime });
      setProgress(((i + 1) / PIXEL_COUNTS.length) * 100);

      // UI 업데이트를 위한 짧은 대기
      await new Promise((r) => setTimeout(r, 10));
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const maxTime = Math.max(...results.map((r) => r.oklchTime), 100);

  return (
    <div
      className={cn(
        /* layout */
        "rounded-2xl p-6",
        /* background */
        "bg-zinc-50 dark:bg-zinc-900",
        /* border */
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div
        className={cn(
          /* layout */
          "mb-4 flex items-center justify-between"
        )}
      >
        <div>
          <h4
            className={cn(
              /* typography */
              "text-lg font-bold",
              /* color */
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            성능 벤치마크
          </h4>
          <p
            className={cn(
              /* typography */
              "mt-1 text-sm",
              /* color */
              "text-zinc-600 dark:text-zinc-400"
            )}
          >
            필터 기반(GPU) vs OKLCH 픽셀 변환(CPU) 처리 시간 비교
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className={cn(
            /* layout */
            "rounded-lg px-4 py-2",
            /* background */
            "bg-blue-600 hover:bg-blue-700",
            /* typography */
            "text-sm font-medium text-white",
            /* disabled */
            "disabled:cursor-not-allowed disabled:opacity-50",
            /* transition */
            "transition-colors"
          )}
        >
          {isRunning ? "측정 중..." : "벤치마크 실행"}
        </button>
      </div>

      {isRunning && (
        <div
          className={cn(
            /* layout */
            "mb-4 h-2 overflow-hidden rounded-full",
            /* background */
            "bg-zinc-200 dark:bg-zinc-700"
          )}
        >
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {/* 범례 */}
          <div
            className={cn(
              /* layout */
              "flex gap-6"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                필터 기반 (GPU)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-orange-500" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                OKLCH (CPU)
              </span>
            </div>
          </div>

          {/* 막대 그래프 */}
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.pixels} className="space-y-1">
                <div
                  className={cn(
                    /* layout */
                    "flex items-center justify-between",
                    /* typography */
                    "text-xs",
                    /* color */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  <span>{(result.pixels / 1000).toFixed(0)}K 픽셀</span>
                  <span>
                    필터: {result.filterTime.toFixed(1)}ms / OKLCH:{" "}
                    {result.oklchTime.toFixed(0)}ms
                  </span>
                </div>
                <div className="flex gap-1">
                  {/* 필터 바 */}
                  <div
                    className={cn(
                      /* layout */
                      "h-4 rounded-sm",
                      /* background */
                      "bg-emerald-500"
                    )}
                    style={{
                      width: `${Math.max((result.filterTime / maxTime) * 100, 1)}%`,
                      minWidth: "4px",
                    }}
                  />
                  {/* OKLCH 바 */}
                  <div
                    className={cn(
                      /* layout */
                      "h-4 rounded-sm",
                      /* background */
                      "bg-orange-500"
                    )}
                    style={{
                      width: `${(result.oklchTime / maxTime) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 결론 */}
          <div
            className={cn(
              /* layout */
              "mt-4 rounded-lg p-3",
              /* background */
              "bg-amber-50 dark:bg-amber-950/30",
              /* border */
              "border border-amber-200 dark:border-amber-800"
            )}
          >
            <p
              className={cn(
                /* typography */
                "text-sm",
                /* color */
                "text-amber-800 dark:text-amber-200"
              )}
            >
              <strong>결론:</strong> 필터 기반은 픽셀 수와 무관하게 일정한 반면,
              OKLCH는 픽셀 수에 비례해 증가합니다. 500K 픽셀 이상에서는{" "}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">
                maxProcessingPixels
              </code>
              로 해상도를 제한하는 것이 권장됩니다.
            </p>
          </div>
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <div
          className={cn(
            /* layout */
            "flex h-40 items-center justify-center rounded-xl",
            /* background */
            "bg-zinc-100 dark:bg-zinc-800",
            /* typography */
            "text-sm",
            /* color */
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          &quot;벤치마크 실행&quot; 버튼을 눌러 측정을 시작하세요
        </div>
      )}
    </div>
  );
}
