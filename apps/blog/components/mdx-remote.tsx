import { MDXRemote } from 'next-mdx-remote/rsc';
import { createBaseComponents, createArticleComponents } from './mdx-components/base-components';
import { remarkBoldFix } from './mdx-plugins/remark-bold-fix';
import { rehypeLineNumbers } from './mdx-plugins/rehype-line-numbers';
import { createRehypeImageRewrite } from './mdx-plugins/rehype-image-rewrite';
import { rehypePrettyCodeConfig } from './mdx-plugins/rehype-pretty-code-config';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function CustomMDX({ source, slug }: { source: string; slug?: string }) {
  // 기본 컴포넌트와 아티클 컴포넌트를 합쳐서 최종 컴포넌트 맵 생성
  const baseComponents = createBaseComponents(slug);
  const articleComponents = createArticleComponents();
  const components = {
    ...baseComponents,
    ...articleComponents,
  };

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkBoldFix, remarkMath],
          rehypePlugins: [
            rehypeSlug,
            createRehypeImageRewrite(slug),
            ...rehypePrettyCodeConfig,
            rehypeLineNumbers,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            rehypeKatex,
          ],
        },
      }}
    />
  );
}
