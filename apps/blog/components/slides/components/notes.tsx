"use client";

import { useEffect, type ReactNode } from "react";
import { useSlideOptional } from "../context/slide-context";

type NotesProps = {
  children: ReactNode;
};

export function Notes({ children }: NotesProps) {
  const slideContext = useSlideOptional();

  useEffect(() => {
    if (slideContext && typeof children === "string") {
      slideContext.registerNotes(slideContext.currentIndex, children);
    }
  }, [slideContext, children]);

  return null;
}
