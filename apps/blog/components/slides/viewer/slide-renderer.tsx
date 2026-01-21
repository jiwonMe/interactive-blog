import { MDXRemote } from "next-mdx-remote/rsc";
import {
  createBaseComponents,
  createArticleComponents,
} from "../../mdx-components/base-components";
import { remarkBoldFix } from "../../mdx-plugins/remark-bold-fix";
import { rehypeLineNumbers } from "../../mdx-plugins/rehype-line-numbers";
import { createRehypeImageRewrite } from "../../mdx-plugins/rehype-image-rewrite";
import { rehypePrettyCodeConfig } from "../../mdx-plugins/rehype-pretty-code-config";
import { FootnoteProvider } from "@repo/interactive-ui";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { slideComponents } from "../components";

type SlideRendererProps = {
  content: string;
  slug: string;
  title?: string;
};

export async function SlideRenderer({
  content,
  slug,
  title,
}: SlideRendererProps) {
  const baseComponents = createBaseComponents(slug, title);
  const articleComponents = createArticleComponents();

  const components = {
    ...baseComponents,
    ...articleComponents,
    ...slideComponents,
  };

  return (
    <FootnoteProvider>
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkBoldFix, remarkMath],
            rehypePlugins: [
              rehypeSlug,
              createRehypeImageRewrite(slug),
              ...rehypePrettyCodeConfig,
              rehypeLineNumbers,
              rehypeKatex,
            ],
          },
        }}
      />
    </FootnoteProvider>
  );
}
