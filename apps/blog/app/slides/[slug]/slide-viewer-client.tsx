"use client";

import { type ReactNode } from "react";
import { SlideViewer } from "../../../components/slides/viewer/slide-viewer";

type SlideViewerClientProps = {
  slug: string;
  title: string;
  slides: ReactNode[];
};

export function SlideViewerClient({
  slug,
  title,
  slides,
}: SlideViewerClientProps) {
  return (
    <SlideViewer slug={slug} title={title}>
      {slides}
    </SlideViewer>
  );
}
