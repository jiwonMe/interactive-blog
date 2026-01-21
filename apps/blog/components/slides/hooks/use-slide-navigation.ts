"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSlide } from "../context/slide-context";

type UseSlideNavigationOptions = {
  onToggleFullscreen?: () => void;
};

export function useSlideNavigation(
  slug: string,
  options: UseSlideNavigationOptions = {},
) {
  const router = useRouter();
  const { next, prev, goTo, currentIndex, totalSlides } = useSlide();
  const { onToggleFullscreen } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          prev();
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(totalSlides - 1);
          break;
        case "f":
        case "F":
          event.preventDefault();
          onToggleFullscreen?.();
          break;
        case "Escape":
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            router.push(`/posts/${slug}`);
          }
          break;
      }
    },
    [next, prev, goTo, totalSlides, router, slug, onToggleFullscreen],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const slideIndex = parseInt(hash, 10);
    if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < totalSlides) {
      goTo(slideIndex);
    }
  }, [goTo, totalSlides]);

  useEffect(() => {
    const newHash = `#${currentIndex}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, [currentIndex]);

  return { currentIndex, totalSlides, next, prev, goTo };
}
