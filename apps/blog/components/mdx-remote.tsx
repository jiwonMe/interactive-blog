import { MDXRemote } from 'next-mdx-remote/rsc';
import { InteractivePanel, Playground, YouTube, Section, StickyWrapper, Content, CodeBlock, LinkCard } from '@repo/interactive-ui';
import { Counter } from '../articles/hello-world/components/counter';
import { cn } from '../lib/utils';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import 'katex/dist/katex.min.css';
import Image from 'next/image';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Paragraph } from 'mdast';

// 코드 블록 메타데이터에서 줄 번호 표시 여부를 파싱하는 플러그인
// rehype-pretty-code가 처리한 후에 실행되어야 함
const rehypeLineNumbers: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // figure 요소에서 pre를 찾기 (rehype-pretty-code가 생성한 구조)
      if (node.tagName === 'figure' && node.properties?.['data-rehype-pretty-code-figure']) {
        const preElement = node.children?.find((child: any) => child.tagName === 'pre');
        if (preElement && preElement.properties) {
          const codeElement = preElement.children?.find((child: any) => child.tagName === 'code');
          if (codeElement && codeElement.properties) {
            // data-language에서 언어와 메타데이터 확인
            const languageAttr = String(codeElement.properties['data-language'] || 
                                       preElement.properties['data-language'] || '');
            
            // 언어와 메타데이터가 공백으로 구분되어 있을 수 있음
            const parts = languageAttr.trim().split(/\s+/);
            const metaParts = parts.slice(1);
            
            // showLineNumbers 또는 line-numbers가 메타데이터에 있는지 확인
            const hasLineNumbers = metaParts.some((meta: string) => 
              meta === 'showLineNumbers' || meta === 'line-numbers'
            ) || languageAttr.includes('showLineNumbers') || languageAttr.includes('line-numbers');
            
            if (hasLineNumbers) {
              // pre와 code 모두에 data-line-numbers 추가
              preElement.properties['data-line-numbers'] = '';
              if (codeElement.properties) {
                codeElement.properties['data-line-numbers'] = '';
              }
            }
          }
        }
      }
      // pre 요소 직접 확인 (fallback)
      else if (node.tagName === 'pre' && node.properties) {
        const codeElement = node.children?.find((child: any) => child.tagName === 'code');
        if (codeElement && codeElement.properties) {
          const languageAttr = String(codeElement.properties['data-language'] || 
                                      node.properties['data-language'] || '');
          
          const parts = languageAttr.trim().split(/\s+/);
          const metaParts = parts.slice(1);
          
          const hasLineNumbers = metaParts.some((meta: string) => 
            meta === 'showLineNumbers' || meta === 'line-numbers'
          ) || languageAttr.includes('showLineNumbers') || languageAttr.includes('line-numbers');
          
          if (hasLineNumbers) {
            node.properties['data-line-numbers'] = '';
            if (codeElement.properties) {
              codeElement.properties['data-line-numbers'] = '';
            }
          }
        }
      }
    });
  };
};

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
  Counter: () => (
    <div className="my-8">
      <Counter />
    </div>
  ),
  Section: (props: React.ComponentProps<typeof Section>) => (
    <Section {...props} />
  ),
  StickyWrapper: ({ children, ...props }: any) => (
    <StickyWrapper {...props}>{children}</StickyWrapper>
  ),
  Content: ({ children, ...props }: any) => (
    <Content {...props}>{children}</Content>
  ),
  YouTube,
  LinkCard: (props: any) => {
    // MDX에서 전달되는 props를 적절한 타입으로 변환
    // 빈 문자열이나 undefined인 경우 undefined로 처리
    // MDX에서 전달되는 모든 props는 문자열이므로 명시적으로 변환 필요
    const linkCardProps = {
      href: props.href,
      title: props.title,
      description: props.description,
      image: props.image,
      imageAlt: props.imageAlt,
      // size prop만 명시적으로 변환
      size: (props.size && props.size !== '' && ['small', 'medium', 'large'].includes(props.size)) 
        ? (props.size as 'small' | 'medium' | 'large') 
        : undefined,
    };
    
    return (
      <div className="my-8">
        <LinkCard {...linkCardProps} />
      </div>
    );
  },
  Image: (props: any) => (
    <div className="my-8">
      <Image
        className={cn(
          "rounded-xl border shadow-sm",
          "border-gray-200 dark:border-zinc-800"
        )}
        alt={props.alt || "Blog post image"}
        {...props}
      />
      {props.caption && (
        <p className="mt-2 text-center text-sm text-gray-500 italic dark:text-gray-400">
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
      className={cn(
        "rounded-xl border shadow-sm my-8 max-w-full h-auto",
        "border-gray-200 dark:border-zinc-800"
      )}
      {...props} 
    />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 
      className={cn(
        // layout
        "mt-12 mb-6 pb-2 scroll-mt-24",
        // typography
        "text-3xl font-bold tracking-tight",
        // light
        "text-gray-900",
        // dark
        "dark:text-gray-50"
      )} 
      {...props} 
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 
      className={cn(
        // layout
        "mt-10 mb-4 pb-2 scroll-mt-24",
        // typography
        "text-2xl font-bold tracking-tight border-b",
        // light
        "text-gray-900 border-gray-200",
        // dark
        "dark:text-gray-50 dark:border-gray-800"
      )} 
      {...props} 
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 
      className={cn(
        // layout
        "mt-8 mb-3 scroll-mt-24",
        // typography
        "text-xl font-semibold",
        // light
        "text-gray-900",
        // dark
        "dark:text-gray-100"
      )} 
      {...props} 
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      className={cn(
        // layout
        "mb-6",
        // typography
        "leading-8",
        // light
        "text-gray-800",
        // dark
        "dark:text-gray-300"
      )} 
      {...props} 
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul 
      className={cn(
        // layout
        "pl-6 mb-6 space-y-2",
        // style
        "list-disc",
        // light
        "text-gray-800",
        // dark
        "dark:text-gray-300"
      )} 
      {...props} 
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol 
      className={cn(
        // layout
        "pl-6 mb-6 space-y-2",
        // style
        "list-decimal",
        // light
        "text-gray-800",
        // dark
        "dark:text-gray-300"
      )} 
      {...props} 
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props} />
  ),
  // pre와 code는 rehype-pretty-code가 처리하므로 제거
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      className={cn(
        // layout
        "pl-4 my-6 border-l-4",
        // typography
        "italic",
        // light
        "border-gray-200 text-gray-600",
        // dark
        "dark:border-zinc-700 dark:text-gray-400"
      )} 
      {...props} 
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong 
      className={cn(
        // typography
        "font-bold",
        // light
        "text-gray-900",
        // dark
        "dark:text-gray-100"
      )} 
      {...props} 
    />
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
            // rehype-pretty-code 전에 메타데이터를 저장하는 플러그인
            (() => {
              const metaMap = new Map();
              return () => {
                return (tree: any) => {
                  visit(tree, 'element', (node: any) => {
                    if (node.tagName === 'code' && node.properties) {
                      const className = node.properties.className || [];
                      const classString = Array.isArray(className) ? className.join(' ') : String(className);
                      // 코드 블록의 원본 메타데이터 확인
                      if (classString.includes('language-')) {
                        const match = classString.match(/language-(\S+)/);
                        if (match) {
                          const fullLang = match[1];
                          const parts = fullLang.split(/\s+/);
                          if (parts.length > 1 && (parts.includes('showLineNumbers') || parts.includes('line-numbers'))) {
                            metaMap.set(node, true);
                          }
                        }
                      }
                    }
                  });
                };
              };
            })(),
            [
              rehypePrettyCode,
              {
                theme: {
                  dark: 'github-dark',
                  light: 'github-light',
                  showLineNumbers: true,
                },
                keepBackground: false,
                onVisitLine(node: any) {
                  // Prevent lines from collapsing in `display: grid` mode
                  if (node.children.length === 0) {
                    node.children = [{ type: 'text', value: ' ' }];
                  }
                },
                onVisitHighlightedLine(node: any) {
                  node.properties.className = ['line', 'highlighted'];
                },
                onVisitHighlightedWord(node: any) {
                  node.properties.className = ['word', 'highlighted'];
                },
              },
            ],
            rehypeLineNumbers,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            rehypeKatex,
          ],
        },
      }}
    />
  );
}
