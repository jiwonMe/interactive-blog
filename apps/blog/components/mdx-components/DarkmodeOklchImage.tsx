"use client";

import React from "react";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";
import { invertSrgb8ViaOklch } from "../../lib/oklch-invert";

export type DarkmodeOklchImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
  wrapperClassName?: string;
  rewriteSrc?: (src: string | undefined) => string | undefined;
  /**
   * 픽셀 변환 비용을 줄이기 위해 처리 해상도를 제한합니다.
   * (targetW * targetH <= maxProcessingPixels)
   */
  maxProcessingPixels?: number;
  /**
   * C를 줄이는 bisection 반복 횟수 (3~6 추천)
   */
  bisectionSteps?: number;
};

type CacheEntry = { w: number; h: number; data: Uint8ClampedArray };

function computeTargetSize(input: { w: number; h: number; maxPixels: number }) {
  const w = Math.max(1, Math.floor(input.w));
  const h = Math.max(1, Math.floor(input.h));
  const maxPixels = Math.max(1024, Math.floor(input.maxPixels));
  const pixels = w * h;
  if (pixels <= maxPixels) return { w, h, scale: 1 };

  const scale = Math.sqrt(maxPixels / pixels);
  return {
    w: Math.max(1, Math.floor(w * scale)),
    h: Math.max(1, Math.floor(h * scale)),
    scale,
  };
}

function buildCacheKey(params: {
  src: string;
  w: number;
  h: number;
  bisectionSteps: number;
}) {
  return `${params.src}::${params.w}x${params.h}::b${params.bisectionSteps}`;
}

export function DarkmodeOklchImage({
  src,
  alt,
  width,
  height,
  caption,
  className,
  wrapperClassName,
  rewriteSrc,
  maxProcessingPixels = 260_000,
  bisectionSteps = 5,
}: DarkmodeOklchImageProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const finalSrc = rewriteSrc ? rewriteSrc(src) ?? src : src;
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");
  const cacheRef = React.useRef<Map<string, CacheEntry>>(new Map());

  const target = React.useMemo(
    () => computeTargetSize({ w: width, h: height, maxPixels: maxProcessingPixels }),
    [width, height, maxProcessingPixels]
  );

  React.useEffect(() => {
    if (!isDark) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const key = buildCacheKey({
      src: finalSrc,
      w: target.w,
      h: target.h,
      bisectionSteps,
    });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setStatus("error");
      return;
    }

    canvas.width = target.w;
    canvas.height = target.h;

    const cached = cacheRef.current.get(key);
    if (cached) {
      try {
        const imageData = new ImageData(new Uint8ClampedArray(cached.data), cached.w, cached.h);
        ctx.putImageData(imageData, 0, 0);
        setStatus("ready");
        return;
      } catch {
        cacheRef.current.delete(key);
      }
    }

    let cancelled = false;
    setStatus("loading");

    const img = new Image();
    img.decoding = "async";
    // same-origin 리소스면 문제 없고, 외부 URL이면 CORS 설정이 필요합니다.
    img.crossOrigin = "anonymous";
    img.src = finalSrc;

    const run = async () => {
      try {
        await img.decode();
        if (cancelled) return;

        ctx.clearRect(0, 0, target.w, target.h);
        ctx.drawImage(img, 0, 0, target.w, target.h);

        const imageData = ctx.getImageData(0, 0, target.w, target.h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const a = data[i + 3] ?? 255;

          const inv = invertSrgb8ViaOklch(r, g, b, { bisectionSteps });
          data[i] = inv.r8;
          data[i + 1] = inv.g8;
          data[i + 2] = inv.b8;
          data[i + 3] = a;
        }

        ctx.putImageData(imageData, 0, 0);
        cacheRef.current.set(key, { w: target.w, h: target.h, data: new Uint8ClampedArray(data) });

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isDark, finalSrc, target.w, target.h, bisectionSteps]);

  return (
    <figure
      className={cn(
        /* layout */
        "my-8",
        wrapperClassName
      )}
    >
      {isDark ? (
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            className={cn(
              /* shape */
              "rounded-xl",
              /* border & shadow */
              "border shadow-sm",
              /* border color */
              "border-zinc-200 dark:border-zinc-800",
              className
            )}
            style={{
              width: "100%",
              height: "auto",
            }}
          />

          {status === "loading" ? (
            <p
              className={cn(
                /* layout */
                "text-center",
                /* typography */
                "text-xs",
                /* color */
                "text-zinc-500 dark:text-zinc-400"
              )}
            >
              OKLCH 변환 중… (target: {target.w}×{target.h}, bisection: {bisectionSteps})
            </p>
          ) : null}

          {status === "error" ? (
            <p
              className={cn(
                /* layout */
                "text-center",
                /* typography */
                "text-xs",
                /* color */
                "text-red-600 dark:text-red-400"
              )}
            >
              이미지 변환에 실패했습니다. (외부 이미지면 CORS 설정이 필요할 수 있어요)
            </p>
          ) : null}
        </div>
      ) : (
        <img
          alt={alt}
          src={finalSrc}
          width={width}
          height={height}
          className={cn(
            /* shape */
            "rounded-xl",
            /* border & shadow */
            "border shadow-sm",
            /* border color */
            "border-zinc-200 dark:border-zinc-800",
            className
          )}
          style={{ width: "100%", height: "auto" }}
        />
      )}

      {caption ? (
        <figcaption
          className={cn(
            /* layout */
            "mt-2 text-center",
            /* typography */
            "text-sm italic",
            /* color */
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}


