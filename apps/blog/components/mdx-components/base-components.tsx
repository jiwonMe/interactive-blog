import { InteractivePanel, Playground, YouTube, Section, StickyWrapper, Content, CodeBlock, LinkCard, Footnote, Footnotes, Callout, CollapsibleCode, Highlight } from '@repo/interactive-ui';
import { AreaChart, BarChart, LineChart, ScatterPlot, SimulationPanel, PlaybackControls, StatsDisplay, Button, NumberInput, Select, Slider, Toggle, RechartsLineChart, RechartsHistogram } from '@repo/interactive-components';
import { cn } from '../../lib/utils';
import Image from 'next/image';
import React from 'react';
import { articleComponentsRegistry } from './article-components-registry';
import { Boxed, Claim, Definition, Lemma, Proof, ProofStep, ProofSteps, Theorem } from "./proof-components";
import { CollapsibleSection } from './CollapsibleSection';
import { CodeTabs, CodeTab } from '../code-tabs';
import { HeadingWithLink } from './heading-with-link';
import { SVGFilteredImage } from './SVGFilteredImage';
import { DarkmodeImage } from './DarkmodeImage';
import { DarkmodeOklchImage } from './DarkmodeOklchImage';

// 이미지 src를 재작성하는 헬퍼 함수
const createImageSrcRewriter = (slug?: string) => {
  return (src: string | undefined) => {
    if (!src || !slug) return src;
    if (src.startsWith('/') || src.startsWith('http')) return src;
    // remove ./ prefix
    const cleanSrc = src.replace(/^\.\//, '');
    const shouldAssumeImagesFolder = cleanSrc.length > 0 && !cleanSrc.includes('/');
    const normalizedSrc = shouldAssumeImagesFolder ? `images/${cleanSrc}` : cleanSrc;
    return `/images/articles/${slug}/${normalizedSrc}`;
  };
};

// 기본 MDX 컴포넌트들을 생성하는 함수
export function createBaseComponents(slug?: string) {
  const rewriteSrc = createImageSrcRewriter(slug);

  return {
    // Atomic interactive components (vanilla-extract 기반)
    LineChart: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <LineChart {...props} />
      </div>
    ),
    BarChart: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <BarChart {...props} />
      </div>
    ),
    ScatterPlot: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <ScatterPlot {...props} />
      </div>
    ),
    AreaChart: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <AreaChart {...props} />
      </div>
    ),
    RechartsLineChart: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <RechartsLineChart {...props} />
      </div>
    ),
    RechartsHistogram: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <RechartsHistogram {...props} />
      </div>
    ),
    SimulationPanel: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <SimulationPanel {...props} />
      </div>
    ),
    PlaybackControls: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <PlaybackControls {...props} />
      </div>
    ),
    StatsDisplay: (props: any) => (
      <div
        className={cn(
          /* spacing */
          'my-8',
        )}
      >
        <StatsDisplay {...props} />
      </div>
    ),
    // Controls primitives (MDX에서 바로 조합 가능)
    Button,
    Slider,
    Select,
    Toggle,
    NumberInput,
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
    // Callout 컴포넌트
    Callout: (props: any) => <Callout {...props} />,
    // CollapsibleCode 컴포넌트
    CollapsibleCode: (props: any) => <CollapsibleCode {...props} />,
    // CollapsibleSection 컴포넌트 (일반 콘텐츠 접기/펼치기)
    CollapsibleSection: (props: any) => <CollapsibleSection {...props} />,
    // Highlight 컴포넌트 (형광펜 효과)
    Highlight: (props: any) => <Highlight {...props} />,
    // CodeTabs / CodeTab (rehype plugin이 주입한 탭 UI)
    CodeTabs: (props: any) => <CodeTabs {...props} />,
    CodeTab: (props: any) => <CodeTab {...props} />,
    // 수학/증명 구조화 컴포넌트들
    Boxed,
    Theorem,
    Lemma,
    Claim,
    Definition,
    Proof,
    ProofSteps,
    ProofStep,
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
    // SVG filter를 이미지에 적용하는 컴포넌트
    SVGFilteredImage: (props: any) => {
      // Server -> Client 경계에서 함수 prop(rewriteSrc)를 넘기면 Next.js가 막습니다.
      // 따라서 여기서 src를 문자열로 rewrite한 뒤, Client Component에는 값만 전달합니다.
      const { src: rawSrc, ...rest } = props ?? {};
      const rewrittenSrc = rewriteSrc(rawSrc) ?? rawSrc;
      return (
        <SVGFilteredImage
          {...rest}
          src={rewrittenSrc}
        />
      );
    },
    // 다크모드일 때만 preset을 켜는 이미지 컴포넌트
    DarkmodeImage: (props: any) => {
      const { src: rawSrc, ...rest } = props ?? {};
      const rewrittenSrc = rewriteSrc(rawSrc) ?? rawSrc;
      return (
        <DarkmodeImage
          {...rest}
          src={rewrittenSrc}
        />
      );
    },
    // 다크모드일 때 OKLCH 기반으로 픽셀 변환하는 이미지 컴포넌트 (canvas)
    DarkmodeOklchImage: (props: any) => {
      const { src: rawSrc, ...rest } = props ?? {};
      const rewrittenSrc = rewriteSrc(rawSrc) ?? rawSrc;
      return (
        <DarkmodeOklchImage
          {...rest}
          src={rewrittenSrc}
        />
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
      <HeadingWithLink
        as="h1"
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
      <HeadingWithLink
        as="h2"
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
      <HeadingWithLink
        as="h3"
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
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <CodeBlock {...props}>{children}</CodeBlock>
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
    // 수평선 (Divider) 컴포넌트
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
      <div 
        className={cn(
          // layout
          "my-12 mx-auto w-full max-w-xs h-px",
          // gradient - 중앙에서 양쪽으로 fade
          "bg-gradient-to-r from-transparent via-zinc-300 to-transparent",
          "dark:via-zinc-700"
        )}
        role="separator"
        {...props}
      />
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

