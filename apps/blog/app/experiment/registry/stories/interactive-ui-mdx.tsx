import React from "react";
import {
  CodeBlock,
  CollapsibleCode,
  Footnote,
  FootnoteProvider,
  Footnotes,
  Highlight,
} from "@repo/interactive-ui";
import type { ExperimentStory } from "../types";
import { cn } from "../../../../lib/utils";

function FootnoteDemo() {
  return (
    <FootnoteProvider>
      <div
        className={cn(
          /* 레이아웃 */
          "w-full max-w-3xl",
          "rounded-2xl p-6",
          /* 배경 및 테두리 */
          "bg-zinc-50 dark:bg-zinc-900/40",
          "border border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div className="space-y-4">
          <h3
            className={cn(
              /* 타이포 */
              "text-lg font-bold",
              /* 색상 */
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            Footnote / Footnotes 데모
          </h3>

          <p
            className={cn(
              /* 타이포 */
              "text-sm leading-relaxed",
              /* 색상 */
              "text-zinc-700 dark:text-zinc-300"
            )}
          >
            이 문장에는 각주가 달려있습니다
            <Footnote id="react-docs" refId={undefined} style={undefined}>
              React 공식 문서: `https://react.dev`
            </Footnote>
            .
            그리고 같은 각주를 재사용할 수도 있어요
            <Footnote id={undefined} refId="react-docs" style={undefined}>
              {null}
            </Footnote>
            .
          </p>

          <p
            className={cn(
              /* 타이포 */
              "text-sm leading-relaxed",
              /* 색상 */
              "text-zinc-700 dark:text-zinc-300"
            )}
          >
            포인터를 올리면 툴팁이 뜨고, 클릭하면 하단 각주 목록으로 이동합니다
            <Footnote id={undefined} refId={undefined} style={undefined}>
              이건 두 번째 각주입니다.
            </Footnote>
            .
          </p>
        </div>

        <Footnotes />
      </div>
    </FootnoteProvider>
  );
}

function HighlightDemo() {
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-3xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-white dark:bg-zinc-950",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold mb-3",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        Highlight 데모
      </h3>
      <p
        className={cn(
          /* 타이포 */
          "text-sm leading-relaxed",
          /* 색상 */
          "text-zinc-700 dark:text-zinc-300"
        )}
      >
        문장 중 <Highlight>중요한 부분</Highlight>을 강조하거나,
        <code
          className={cn(
            /* 레이아웃 */
            "mx-1 px-1.5 py-0.5 rounded border",
            /* 배경 및 테두리 */
            "bg-zinc-50 dark:bg-zinc-900",
            "border-zinc-200 dark:border-zinc-800",
            /* 타이포 */
            "text-xs font-mono"
          )}
        >
          code
        </code>
        내부에서도 <Highlight>잘 보이게</Highlight> 처리할 수 있어요.
      </p>
    </div>
  );
}

function CollapsibleCodeDemo() {
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-3xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-white dark:bg-zinc-950",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold mb-3",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        CollapsibleCode 데모
      </h3>

      <CollapsibleCode title="코드 보기 (접기/펼치기)" defaultOpen={false}>
        <CodeBlock>
          <code>
{`type User = { id: string; name: string };

export function greet(user: User) {
  return \`Hello, \${user.name}!\`;
}
`}
          </code>
        </CodeBlock>
      </CollapsibleCode>
    </div>
  );
}

export const interactiveUiMdxStories: ExperimentStory[] = [
  {
    slug: "interactive-ui/footnote",
    title: "Footnote / Footnotes",
    description: "본문 각주(툴팁) + 하단 각주 목록 컴포넌트 데모입니다.",
    category: "UI / MDX",
    tags: ["interactive-ui", "mdx", "footnote"],
    sourcePaths: ["packages/interactive-ui/src/components/Footnote.tsx"],
    render: () => <FootnoteDemo />,
    controls: {},
  },
  {
    slug: "interactive-ui/highlight",
    title: "Highlight",
    description: "형광펜 스타일 inline highlight 데모입니다.",
    category: "UI / MDX",
    tags: ["interactive-ui", "mdx", "highlight"],
    sourcePaths: ["packages/interactive-ui/src/components/Highlight.tsx"],
    render: () => <HighlightDemo />,
    controls: {},
  },
  {
    slug: "interactive-ui/collapsible-code",
    title: "CollapsibleCode",
    description: "코드 블록을 접었다 펼치는 컴포넌트 데모입니다.",
    category: "UI / MDX",
    tags: ["interactive-ui", "mdx", "collapsible"],
    sourcePaths: ["packages/interactive-ui/src/components/CollapsibleCode.tsx"],
    render: () => <CollapsibleCodeDemo />,
    controls: {},
  },
];

