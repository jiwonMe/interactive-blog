"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { experiments, getExperimentBySlug } from "../registry";
import { cn } from "../../../lib/utils";
import { ExperimentSidebar } from "./ExperimentSidebar";
import { ExperimentDetail } from "./ExperimentDetail";
import { ControlsPanel } from "../controls-panel";
import { useExperimentControls } from "../use-experiment-controls";
import { matchesQuery, normalize } from "./utils";
import type { ViewportSize } from "../viewport-selector";

type ExperimentHubClientProps = {
  initialSlug?: string | null;
};

function getInitialSlug(initialSlug: string | null | undefined) {
  if (initialSlug) return initialSlug;
  return experiments[0]?.slug ?? "";
}

export function ExperimentHubClient({ initialSlug }: ExperimentHubClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(() => getInitialSlug(initialSlug));

  // Controls panel 열림/닫힘 상태
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  
  // Viewport 크기 상태
  const [viewport, setViewport] = useState<ViewportSize>("responsive");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setIsControlsOpen(isDesktop);
  }, []);

  useEffect(() => {
    setActiveSlug(getInitialSlug(initialSlug));
  }, [initialSlug]);

  const normalizedQuery = useMemo(() => normalize(query), [query]);

  const filtered = useMemo(() => {
    return experiments.filter((story) => {
      const haystack = [
        story.title,
        story.description,
        story.category,
        story.slug,
        story.tags.join(" "),
      ].join(" ");
      return matchesQuery(haystack, normalizedQuery);
    });
  }, [normalizedQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const story of filtered) {
      const list = map.get(story.category) ?? [];
      list.push(story);
      map.set(story.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const activeStory = useMemo(() => {
    const found = getExperimentBySlug(activeSlug);
    if (found) return found;
    return filtered[0] ?? null;
  }, [activeSlug, filtered]);

  // Controls 상태 관리
  const { values, handleChange, hasControls, controls } = useExperimentControls({
    controls: activeStory?.controls ?? {},
  });

  const onSelect = (slug: string) => {
    setActiveSlug(slug);
    router.push(`/experiment/${slug}`);
  };

  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-[1600px] mx-auto",
        "grid grid-cols-1 gap-6",
        /* Desktop: 3-column grid */
        "lg:grid-cols-[280px_1fr_auto]"
      )}
    >
      {/* 좌측 사이드바: Stories 목록 */}
      <ExperimentSidebar
        query={query}
        onQueryChange={setQuery}
        totalCount={experiments.length}
        filteredCount={filtered.length}
        grouped={grouped}
        activeSlug={activeStory?.slug ?? null}
        onSelect={onSelect}
      />

      {/* 중앙: Preview 영역 */}
      <ExperimentDetail
        story={activeStory}
        values={values}
        viewport={viewport}
        onViewportChange={setViewport}
      />

      {/* 우측 사이드바: Controls 패널 */}
      {hasControls && (
        <ControlsPanel
          controls={controls}
          values={values}
          onChange={handleChange}
          isOpen={isControlsOpen}
          onToggle={() => setIsControlsOpen(!isControlsOpen)}
        />
      )}
    </div>
  );
}

