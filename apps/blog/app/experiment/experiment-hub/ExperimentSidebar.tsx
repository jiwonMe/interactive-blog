"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ExperimentStory } from "../registry";

type ExperimentSidebarProps = {
  query: string;
  onQueryChange: (next: string) => void;
  totalCount: number;
  filteredCount: number;
  grouped: Array<[string, ExperimentStory[]]>;
  activeSlug: string | null;
  onSelect: (slug: string) => void;
};

export function ExperimentSidebar({
  query,
  onQueryChange,
  totalCount,
  filteredCount,
  grouped,
  activeSlug,
  onSelect,
}: ExperimentSidebarProps) {
  const hasQuery = query.trim().length > 0;

  // 각 section의 열림/닫힘 상태 관리
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());

  // 활성 story가 있는 section은 자동으로 열기
  React.useEffect(() => {
    if (activeSlug) {
      const activeStory = grouped.find(([, stories]) =>
        stories.some((s) => s.slug === activeSlug)
      );
      if (activeStory) {
        setOpenSections((prev) => new Set(prev).add(activeStory[0]));
      }
    }
  }, [activeSlug, grouped]);

  const toggleSection = (category: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        /* 레이아웃 */
        "lg:sticky lg:top-24 h-fit",
        "rounded-2xl p-4",
        /* 배경 및 테두리 */
        "bg-white dark:bg-zinc-950",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div
        className={cn(
          /* 레이아웃 */
          "flex items-start justify-between gap-3"
        )}
      >
        <div className="min-w-0">
          <h1
            className={cn(
              /* 타이포 */
              "text-lg font-bold",
              /* 색상 */
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            /experiment
          </h1>
          <p
            className={cn(
              /* 타이포 */
              "text-xs leading-relaxed",
              /* 색상 */
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            MDX/Posts에서 쓰는 인터랙티브 컴포넌트들을 Storybook처럼 관리합니다.
          </p>
        </div>
        <Link
          href="/"
          className={cn(
            /* 레이아웃 */
            "shrink-0 text-xs font-medium",
            /* 색상 */
            "text-blue-600 dark:text-blue-400",
            /* 인터랙션 */
            "hover:underline"
          )}
        >
          홈 →
        </Link>
      </div>

      <div
        className={cn(
          /* 레이아웃 */
          "mt-4 flex items-center justify-between gap-2"
        )}
      >
        <div
          className={cn(
            /* 레이아웃 */
            "flex items-center gap-2"
          )}
        >
          <span
            className={cn(
              /* 레이아웃 */
              "text-[11px] px-2 py-1 rounded-full",
              /* 배경 */
              "bg-zinc-100 dark:bg-zinc-900",
              /* 테두리 */
              "border border-zinc-200 dark:border-zinc-800",
              /* 텍스트 */
              "text-zinc-600 dark:text-zinc-300"
            )}
          >
            전체 {totalCount}
          </span>
          <span
            className={cn(
              /* 레이아웃 */
              "text-[11px] px-2 py-1 rounded-full",
              /* 배경 */
              "bg-blue-50 dark:bg-blue-950/40",
              /* 테두리 */
              "border border-blue-200 dark:border-blue-900/60",
              /* 텍스트 */
              "text-blue-700 dark:text-blue-300"
            )}
          >
            결과 {filteredCount}
          </span>
        </div>
        {hasQuery ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className={cn(
              /* 레이아웃 */
              "text-[11px] px-2 py-1 rounded-full",
              /* 배경 */
              "bg-white dark:bg-zinc-950",
              /* 테두리 */
              "border border-zinc-200 dark:border-zinc-800",
              /* 텍스트 */
              "text-zinc-600 dark:text-zinc-300",
              /* 인터랙션 */
              "hover:bg-zinc-50 dark:hover:bg-zinc-900",
              "transition-colors"
            )}
          >
            검색 지우기
          </button>
        ) : null}
      </div>

      <label
        className={cn(
          /* 레이아웃 */
          "block mt-4"
        )}
      >
        <span
          className={cn(
            /* 타이포 */
            "text-xs font-semibold",
            /* 색상 */
            "text-zinc-700 dark:text-zinc-300"
          )}
        >
          검색
        </span>
        <div
          className={cn(
            /* 레이아웃 */
            "relative mt-2"
          )}
        >
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="title / slug / tags..."
            className={cn(
              /* 레이아웃 */
              "w-full pr-10 pl-3 py-2 rounded-lg",
              /* 배경 및 테두리 */
              "bg-zinc-50 dark:bg-zinc-900",
              "border border-zinc-200 dark:border-zinc-800",
              /* 텍스트 */
              "text-sm text-zinc-900 dark:text-zinc-100",
              /* placeholder */
              "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
              /* 포커스 */
              "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40"
            )}
          />
          {hasQuery ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className={cn(
                /* 레이아웃 */
                "absolute right-2 top-1/2 -translate-y-1/2",
                "h-7 w-7 rounded-md",
                "grid place-items-center",
                /* 배경 */
                "bg-transparent",
                /* 텍스트 */
                "text-zinc-500 dark:text-zinc-400",
                /* 인터랙션 */
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "transition-colors",
                /* 포커스 */
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              )}
              aria-label="검색어 지우기"
              title="검색어 지우기"
            >
              ×
            </button>
          ) : null}
        </div>
      </label>

      <div
        className={cn(
          /* 레이아웃 */
          "mt-4",
          /* 스크롤 */
          "max-h-[calc(100vh-280px)] overflow-y-auto overscroll-contain",
          /* 스페이싱 */
          "space-y-4 pr-1"
        )}
      >
        {grouped.length === 0 ? (
          <p
            className={cn(
              /* 타이포 */
              "text-sm",
              /* 색상 */
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            검색 결과가 없습니다.
          </p>
        ) : (
          grouped.map(([category, stories]) => {
            const isOpen = openSections.has(category);
            return (
              <section key={category}>
                <button
                  type="button"
                  onClick={() => toggleSection(category)}
                  className={cn(
                    /* 레이아웃 */
                    "w-full flex items-center justify-between gap-2",
                    /* 패딩 */
                    "py-2",
                    /* 인터랙션 */
                    "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                    "transition-colors rounded-lg",
                    /* 포커스 */
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                  )}
                >
                  <div
                    className={cn(
                      /* 레이아웃 */
                      "flex items-center gap-2 flex-1 min-w-0"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        /* 레이아웃 */
                        "h-3.5 w-3.5 shrink-0",
                        /* 색상 */
                        "text-zinc-500 dark:text-zinc-400",
                        /* 애니메이션 */
                        "transition-transform duration-200",
                        /* 회전 */
                        isOpen ? "rotate-0" : "-rotate-90"
                      )}
                    />
                    <h2
                      className={cn(
                        /* 타이포 */
                        "text-xs font-bold uppercase tracking-wider truncate",
                        /* 색상 */
                        "text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      {category}
                    </h2>
                  </div>
                  <span
                    className={cn(
                      /* 레이아웃 */
                      "text-[10px] px-2 py-0.5 rounded-full shrink-0",
                      /* 배경 */
                      "bg-zinc-100 dark:bg-zinc-900",
                      /* 테두리 */
                      "border border-zinc-200 dark:border-zinc-800",
                      /* 텍스트 */
                      "text-zinc-600 dark:text-zinc-300"
                    )}
                  >
                    {stories.length}
                  </span>
                </button>
                <div
                  className={cn(
                    /* 레이아웃 */
                    "grid",
                    /* 애니메이션 */
                    "transition-all duration-200 ease-in-out",
                    /* 상태 */
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        /* 레이아웃 */
                        "mt-2 space-y-1"
                      )}
                    >
                      {stories.map((story) => {
                        const isActive = activeSlug === story.slug;
                        return (
                          <button
                            key={story.slug}
                            type="button"
                            onClick={() => onSelect(story.slug)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              /* 레이아웃 */
                              "relative w-full text-left rounded-lg px-3 py-2",
                              /* 배경 */
                              isActive ? "bg-blue-50 dark:bg-blue-950/40" : "bg-transparent",
                              /* 테두리 */
                              "border",
                              isActive
                                ? "border-blue-200 dark:border-blue-900/60"
                                : "border-transparent",
                              /* 인터랙션 */
                              "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                              "transition-colors",
                              /* 포커스 */
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
                              /* 인디케이터 */
                              isActive
                                ? "before:absolute before:left-1 before:inset-y-2 before:w-1 before:rounded-full before:bg-blue-500 dark:before:bg-blue-400"
                                : "before:absolute before:left-1 before:inset-y-2 before:w-1 before:rounded-full before:bg-transparent"
                            )}
                          >
                            <div
                              className={cn(
                                /* 레이아웃 */
                                "flex items-start justify-between gap-3"
                              )}
                            >
                              <div className="min-w-0">
                                <div
                                  className={cn(
                                    /* 타이포 */
                                    "text-sm font-semibold truncate",
                                    /* 색상 */
                                    "text-zinc-900 dark:text-zinc-100"
                                  )}
                                >
                                  {story.title}
                                </div>
                                <div
                                  className={cn(
                                    /* 타이포 */
                                    "text-xs truncate",
                                    /* 색상 */
                                    "text-zinc-500 dark:text-zinc-400"
                                  )}
                                >
                                  {story.slug}
                                </div>
                              </div>
                              <span
                                className={cn(
                                  /* 레이아웃 */
                                  "shrink-0 text-[10px] px-2 py-1 rounded-full",
                                  /* 배경 */
                                  "bg-zinc-100 dark:bg-zinc-800",
                                  /* 텍스트 */
                                  "text-zinc-600 dark:text-zinc-300"
                                )}
                              >
                                {story.tags[0] ?? "story"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </aside>
  );
}

