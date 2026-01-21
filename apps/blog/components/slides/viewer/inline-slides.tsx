import { parseSlides } from "../../../lib/slides";
import { SlideRenderer } from "./slide-renderer";
import { InlineSlideViewer } from "./inline-slide-viewer";

type InlineSlidesProps = {
  content: string;
  slug: string;
  title?: string;
};

export async function InlineSlides({
  content,
  slug,
  title,
}: InlineSlidesProps) {
  const slides = parseSlides(content);

  const renderedSlides = await Promise.all(
    slides.map(async (slide, index) => {
      return (
        <SlideRenderer
          key={index}
          content={slide.content}
          slug={slug}
          title={title}
        />
      );
    }),
  );

  return <InlineSlideViewer slug={slug}>{renderedSlides}</InlineSlideViewer>;
}
