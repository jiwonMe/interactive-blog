import { MDXRemote } from 'next-mdx-remote/rsc';
import { InteractivePanel, Playground, YouTube, QuickSortVisualizer, PivotSelector, PartitionVisualizer, QuickSortProvider } from '@repo/interactive-ui';
import { cn } from '../lib/utils';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Image from 'next/image';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Paragraph } from 'mdast';

// 한글-영문/기호가 섞인 bold 파싱을 위한 커스텀 플러그인
const remarkBoldFix: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: Paragraph) => {
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const textNode = node.children[0] as Text;
        const text = textNode.value;
        
        // **로 감싸진 텍스트를 찾아서 파싱
        const boldRegex = /\*\*([^*]+?)\*\*/g;
        const matches = Array.from(text.matchAll(boldRegex)) as RegExpMatchArray[];
        
        if (matches.length > 0) {
          const newChildren: any[] = [];
          let lastIndex = 0;
          
          matches.forEach((match: RegExpMatchArray) => {
            const beforeText = text.slice(lastIndex, match.index);
            if (beforeText) {
              newChildren.push({
                type: 'text',
                value: beforeText,
              });
            }
            
            newChildren.push({
              type: 'strong',
              children: [{ type: 'text', value: match[1] }],
            });
            
            lastIndex = (match.index || 0) + match[0].length;
          });
          
          const afterText = text.slice(lastIndex);
          if (afterText) {
            newChildren.push({
              type: 'text',
              value: afterText,
            });
          }
          
          if (newChildren.length > 0) {
            node.children = newChildren;
          }
        }
      } else {
        // 여러 자식 노드가 있는 경우, 각 텍스트 노드를 재귀적으로 처리
        const processTextNodes = (children: any[]): any[] => {
          return children.flatMap((child) => {
            if (child.type === 'text') {
              const text = child.value;
              const boldRegex = /\*\*([^*]+?)\*\*/g;
              const matches = Array.from(text.matchAll(boldRegex)) as RegExpMatchArray[];
              
              if (matches.length === 0) {
                return [child];
              }
              
              const newChildren: any[] = [];
              let lastIndex = 0;
              
              matches.forEach((match: RegExpMatchArray) => {
                const beforeText = text.slice(lastIndex, match.index);
                if (beforeText) {
                  newChildren.push({
                    type: 'text',
                    value: beforeText,
                  });
                }
                
                newChildren.push({
                  type: 'strong',
                  children: [{ type: 'text', value: match[1] }],
                });
                
                lastIndex = (match.index || 0) + match[0].length;
              });
              
              const afterText = text.slice(lastIndex);
              if (afterText) {
                newChildren.push({
                  type: 'text',
                  value: afterText,
                });
              }
              
              return newChildren;
            } else if (child.children) {
              return [{
                ...child,
                children: processTextNodes(child.children),
              }];
            }
            return [child];
          });
        };
        
        node.children = processTextNodes(node.children);
      }
    });
  };
};

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
  QuickSortProvider: (props: any) => (
    <QuickSortProvider {...props} />
  ),
  QuickSortVisualizer: () => (
    <div className="my-8">
      <QuickSortVisualizer />
    </div>
  ),
  PivotSelector: (props: any) => (
    <div className="my-8">
      <PivotSelector {...props} />
    </div>
  ),
  PartitionVisualizer: () => (
    <div className="my-8">
      <PartitionVisualizer />
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
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-gray-900" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
};

export function CustomMDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkBoldFix, remarkMath],
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
