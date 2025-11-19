import { MDXRemote } from 'next-mdx-remote/rsc';
import { InteractivePanel, Playground, YouTube } from '@repo/interactive-ui';
import { cn } from '../lib/utils';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Image from 'next/image';

const components = {
  InteractivePanel: (props: any) => (
    <div className="my-8">
      <InteractivePanel {...props} />
    </div>
  ),
  Playground: () => (
    <div className="my-8">
      <Playground />
    </div>
  ),
  YouTube,
  Image: (props: any) => (
    <div className="my-8">
      <Image
        className="rounded-xl border border-gray-200 shadow-sm"
        alt={props.alt || "Blog post image"}
        {...props}
      />
      {props.caption && (
        <p className="mt-2 text-center text-sm text-gray-500 italic">
          {props.caption}
        </p>
      )}
    </div>
  ),
  img: (props: any) => (
    // Fallback for standard markdown image syntax if not using <Image /> component
    // Note: Next.js Image requires width/height for remote images unless fill is used.
    // For simplicity in standard markdown, we'll style it as a responsive img tag.
    <img 
      className="rounded-xl border border-gray-200 shadow-sm my-8 max-w-full h-auto" 
      {...props} 
    />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-12 mb-6 tracking-tight scroll-mt-24" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight border-b pb-2 scroll-mt-24" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-8 mb-3 scroll-mt-24" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 leading-8 text-gray-800" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-800" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-800" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-50 border border-gray-200 p-5 rounded-xl overflow-x-auto mb-8 text-sm leading-relaxed" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-medium text-gray-900 font-mono" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 my-6" {...props} />
  ),
};

export function CustomMDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            rehypeKatex,
          ],
        },
      }}
    />
  );
}
