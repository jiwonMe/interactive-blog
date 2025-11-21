import { InteractivePanel, Playground, YouTube, Section, StickyWrapper, Content, CodeBlock, LinkCard, Footnote, Footnotes } from '@repo/interactive-ui';
import { cn } from '../../lib/utils';
import Image from 'next/image';
import React from 'react';
import { articleComponentsRegistry } from './article-components-registry';

// 이미지 src를 재작성하는 헬퍼 함수
const createImageSrcRewriter = (slug?: string) => {
  return (src: string | undefined) => {
    if (!src || !slug) return src;
    if (src.startsWith('/') || src.startsWith('http')) return src;
    // remove ./ prefix
    const cleanSrc = src.replace(/^\.\//, '');
    return `/images/articles/${slug}/${cleanSrc}`;
  };
};

// 기본 MDX 컴포넌트들을 생성하는 함수
export function createBaseComponents(slug?: string) {
  const rewriteSrc = createImageSrcRewriter(slug);

  return {
    // 인터랙티브 UI 컴포넌트들
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
    // 각주 컴포넌트
    Footnote,
    Footnotes,
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
    // 이미지 컴포넌트
    Image: (props: any) => {
      const src = rewriteSrc(props.src);
      return (
        <div className="my-8">
          <Image
            className={cn(
              // border & shadow
              "rounded-xl border shadow-sm",
              // border color
              "border-zinc-200 dark:border-zinc-800"
            )}
            alt={props.alt || "Blog post image"}
            {...props}
            src={src}
          />
          {props.caption && (
            <p className={cn(
              // layout
              "mt-2 text-center text-sm italic",
              // color
              "text-zinc-500 dark:text-zinc-400"
            )}>
              {props.caption}
            </p>
          )}
        </div>
      );
    },
    img: (props: any) => (
      // Fallback for standard markdown image syntax if not using <Image /> component
      // Note: Next.js Image requires width/height for remote images unless fill is used.
      // For simplicity in standard markdown, we'll style it as a responsive img tag.
      <img 
        className={cn(
          // layout
          "rounded-xl border shadow-sm my-8 max-w-full h-auto",
          // border color
          "border-zinc-200 dark:border-zinc-800"
        )}
        {...props} 
      />
    ),
    // 제목 컴포넌트들
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 
        className={cn(
          // layout
          "mt-12 mb-6 pb-2 scroll-mt-24",
          // typography
          "text-3xl font-bold tracking-tight",
          // color
          "text-zinc-900 dark:text-zinc-50"
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
          // color
          "text-zinc-900 border-zinc-200",
          "dark:text-zinc-50 dark:border-zinc-800"
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
          // color
          "text-zinc-900 dark:text-zinc-100"
        )} 
        {...props} 
      />
    ),
    // 텍스트 컴포넌트들
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p 
        className={cn(
          // layout
          "mb-6",
          // typography
          "leading-7",
          // color
          "text-zinc-800 dark:text-zinc-300"
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
          // color
          "text-zinc-800 dark:text-zinc-300"
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
          // color
          "text-zinc-800 dark:text-zinc-300"
        )} 
        {...props} 
      />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="leading-7" {...props} />
    ),
    // 코드 블록
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <CodeBlock {...props} />
    ),
    // 인용구
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote 
        className={cn(
          // layout
          "pl-4 my-6 border-l-4",
          // typography
          "italic",
          // color
          "border-zinc-200 text-zinc-600",
          "dark:border-zinc-700 dark:text-zinc-400"
        )} 
        {...props} 
      />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
      <strong 
        className={cn(
          // typography
          "font-bold",
          // color
          "text-zinc-900 dark:text-zinc-100"
        )} 
        {...props} 
      />
    ),
    em: (props: React.HTMLAttributes<HTMLElement>) => (
      <em className="italic" {...props} />
    ),
    // 테이블 컴포넌트들
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className={cn(
        // layout
        "my-8 overflow-x-auto"
      )}>
        <table 
          className={cn(
            // layout
            "w-full border-collapse",
            // typography
            "text-sm",
            // color
            "text-zinc-800 dark:text-zinc-300"
          )} 
          {...props} 
        />
      </div>
    ),
    thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead 
        className={cn(
          // border
          "border-b-2",
          // color
          "border-zinc-200 dark:border-zinc-700"
        )} 
        {...props} 
      />
    ),
    tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props} />
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr 
        className={cn(
          // border
          "border-b",
          // color
          "border-zinc-200 dark:border-zinc-800"
        )} 
        {...props} 
      />
    ),
    th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th 
        className={cn(
          // layout
          "px-4 py-3 text-left",
          // typography
          "font-semibold",
          // color
          "text-zinc-900 dark:text-zinc-100"
        )} 
        {...props} 
      />
    ),
    td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td 
        className={cn(
          // layout
          "px-4 py-3",
          // color
          "text-zinc-800 dark:text-zinc-300"
        )} 
        {...props} 
      />
    ),
  };
}

// 아티클 컴포넌트를 동적으로 생성하는 함수
export function createArticleComponents() {
  const articleComponents: Record<string, React.ComponentType<any>> = {};
  
  // 레지스트리에서 모든 컴포넌트를 가져와서 래핑
  Object.entries(articleComponentsRegistry).forEach(([componentName, Component]) => {
    articleComponents[componentName] = (props: any) => (
      <div className="my-8">
        <Component {...props} />
      </div>
    );
  });
  
  return articleComponents;
}

