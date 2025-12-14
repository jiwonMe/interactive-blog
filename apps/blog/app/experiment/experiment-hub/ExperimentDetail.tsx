"use client";

import Link from "next/link";
import { cn } from "../../../lib/utils";
import type { ExperimentStory } from "../registry";
import { ExperimentViewer } from "../experiment-viewer";
import { CodeBlock, CollapsibleCode } from "@repo/interactive-ui";
import { ViewportSelector, VIEWPORT_SIZES, type ViewportSize } from "../viewport-selector";
import { ViewportFrame } from "../viewport-frame";

type ExperimentDetailProps = {
  story: ExperimentStory | null;
  values: Record<string, any>;
  viewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
};

function getControlDefaults(story: ExperimentStory) {
  const defaults: Record<string, any> = {};
  Object.entries(story.controls).forEach(([key, control]) => {
    defaults[key] = control.defaultValue;
  });
  return defaults;
}

export function ExperimentDetail({ story, values, viewport, onViewportChange }: ExperimentDetailProps) {
  const viewportWidth = VIEWPORT_SIZES[viewport].width;
  return (
    <main
      className={cn(
        /* 레이아웃 - posts 페이지와 동일한 환경 */
        "min-w-0",
        "flex justify-center",
        /* Spacing */
        "px-6 py-8"
      )}
    >
      {story ? (
        <div
          className={cn(
            /* Layout - posts 페이지 article과 동일 */
            "w-full max-w-3xl",
            /* Overflow 방지 */
            "overflow-x-hidden"
          )}
        >
          <header
            className={cn(
              /* 레이아웃 */
              "mb-6 space-y-3"
            )}
          >
            <div
              className={cn(
                /* 레이아웃 */
                "flex items-start justify-between gap-4"
              )}
            >
              <div className="min-w-0">
                <h2
                  className={cn(
                    /* 타이포 */
                    "text-2xl font-bold",
                    /* 색상 */
                    "text-zinc-900 dark:text-zinc-100"
                  )}
                >
                  {story.title}
                </h2>
                <p
                  className={cn(
                    /* 타이포 */
                    "text-sm leading-relaxed",
                    /* 색상 */
                    "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {story.description}
                </p>
              </div>
              <code
                className={cn(
                  /* 레이아웃 */
                  "shrink-0 text-xs px-3 py-1.5 rounded-lg",
                  /* 배경 및 테두리 */
                  "bg-zinc-50 dark:bg-zinc-900",
                  "border border-zinc-200 dark:border-zinc-800",
                  /* 텍스트 */
                  "text-zinc-600 dark:text-zinc-300"
                )}
              >
                {story.slug}
              </code>
            </div>

            <div
              className={cn(
                /* 레이아웃 */
                "flex flex-wrap items-center gap-2"
              )}
            >
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    /* 레이아웃 */
                    "text-xs px-2 py-1 rounded-full",
                    /* 배경 */
                    "bg-zinc-100 dark:bg-zinc-800",
                    /* 텍스트 */
                    "text-zinc-600 dark:text-zinc-300"
                  )}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {(story.links?.length || story.sourcePaths?.length) && (
              <div
                className={cn(
                  /* 레이아웃 */
                  "grid grid-cols-1 md:grid-cols-2 gap-3"
                )}
              >
                {story.links?.length ? (
                  <div
                    className={cn(
                      /* 레이아웃 */
                      "rounded-xl p-4",
                      /* 배경 및 테두리 */
                      "bg-zinc-50 dark:bg-zinc-900",
                      "border border-zinc-200 dark:border-zinc-800"
                    )}
                  >
                    <div
                      className={cn(
                        /* 타이포 */
                        "text-xs font-bold uppercase tracking-wider mb-2",
                        /* 색상 */
                        "text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      Links
                    </div>
                    <div className="space-y-1">
                      {story.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className={cn(
                            /* 타이포 */
                            "block text-sm font-medium",
                            /* 색상 */
                            "text-blue-600 dark:text-blue-400",
                            /* 인터랙션 */
                            "hover:underline"
                          )}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {story.sourcePaths?.length ? (
                  <div
                    className={cn(
                      /* 레이아웃 */
                      "rounded-xl p-4",
                      /* 배경 및 테두리 */
                      "bg-zinc-50 dark:bg-zinc-900",
                      "border border-zinc-200 dark:border-zinc-800"
                    )}
                  >
                    <div
                      className={cn(
                        /* 타이포 */
                        "text-xs font-bold uppercase tracking-wider mb-2",
                        /* 색상 */
                        "text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      Source
                    </div>
                    <ul className="space-y-1">
                      {story.sourcePaths.map((p) => (
                        <li key={p}>
                          <code
                            className={cn(
                              /* 타이포 */
                              "text-xs",
                              /* 색상 */
                              "text-zinc-700 dark:text-zinc-300"
                            )}
                          >
                            {p}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {story.snippets?.length ? (
              <div
                className={cn(
                  /* 레이아웃 */
                  "rounded-xl p-4 space-y-3",
                  /* 배경 및 테두리 */
                  "bg-zinc-50 dark:bg-zinc-900",
                  "border border-zinc-200 dark:border-zinc-800"
                )}
              >
                <div
                  className={cn(
                    /* 타이포 */
                    "text-xs font-bold uppercase tracking-wider",
                    /* 색상 */
                    "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  Templates
                </div>

                <div className="space-y-3">
                  {story.snippets.map((snip) => {
                    const code = snip.getCode(getControlDefaults(story));
                    return (
                      <CollapsibleCode key={snip.label} title={snip.label} defaultOpen={false}>
                        <CodeBlock>
                          <code>{code}</code>
                        </CodeBlock>
                      </CollapsibleCode>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </header>

          {/* Viewport 선택기 */}
          <div
            className={cn(
              /* Layout */
              "flex items-center justify-between gap-4 mb-4",
              /* Border */
              "pb-4 border-b border-zinc-200 dark:border-zinc-800"
            )}
          >
            <ViewportSelector value={viewport} onChange={onViewportChange} />
            {viewportWidth && (
              <span
                className={cn(
                  /* Typography */
                  "text-xs font-mono",
                  /* Color */
                  "text-zinc-400 dark:text-zinc-500"
                )}
              >
                {viewportWidth}px
              </span>
            )}
          </div>

          {/* Preview Area */}
          <ViewportFrame width={viewportWidth}>
            <ExperimentViewer render={story.render} values={values} />
          </ViewportFrame>
        </div>
      ) : (
        <div
          className={cn(
            /* 레이아웃 */
            "py-24 text-center",
            /* 텍스트 */
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          표시할 스토리가 없습니다.
        </div>
      )}
    </main>
  );
}

