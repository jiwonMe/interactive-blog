"use client";

import Link from "next/link";
import { cn } from "../../../lib/utils";
import type { ExperimentStory } from "../registry";
import { ExperimentViewer } from "../experiment-viewer";

type ExperimentDetailProps = {
  story: ExperimentStory | null;
};

export function ExperimentDetail({ story }: ExperimentDetailProps) {
  return (
    <main
      className={cn(
        /* 레이아웃 */
        "min-w-0",
        "rounded-2xl p-5 lg:p-6",
        /* 배경 및 테두리 */
        "bg-white dark:bg-zinc-950",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      {story ? (
        <>
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
          </header>

          <ExperimentViewer render={story.render} controls={story.controls} />
        </>
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

