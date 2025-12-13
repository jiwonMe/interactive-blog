"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { experiments, getExperimentBySlug } from "../registry";
import { cn } from "../../../lib/utils";
import { ExperimentSidebar } from "./ExperimentSidebar";
import { ExperimentDetail } from "./ExperimentDetail";
import { matchesQuery, normalize } from "./utils";

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

  const onSelect = (slug: string) => {
    setActiveSlug(slug);
    router.push(`/experiment/${slug}`);
  };

  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-[1280px] mx-auto",
        "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6"
      )}
    >
      <ExperimentSidebar
        query={query}
        onQueryChange={setQuery}
        totalCount={experiments.length}
        filteredCount={filtered.length}
        grouped={grouped}
        activeSlug={activeStory?.slug ?? null}
        onSelect={onSelect}
      />
      <ExperimentDetail story={activeStory} />
    </div>
  );
}

