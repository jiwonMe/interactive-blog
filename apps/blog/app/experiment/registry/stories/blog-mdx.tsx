import React from "react";
import { CodeBlock } from "@repo/interactive-ui";
import type { ExperimentStory } from "../types";
import { cn } from "../../../../lib/utils";
import { CodeTab, CodeTabs } from "../../../../components/code-tabs";
import { CollapsibleSection } from "../../../../components/mdx-components/CollapsibleSection";
import {
  Boxed,
  Claim,
  Definition,
  Lemma,
  Proof,
  ProofStep,
  ProofSteps,
  Theorem,
} from "../../../../components/mdx-components/proof-components";
import { HeadingWithLink } from "../../../../components/mdx-components/heading-with-link";

function MdxCollapsibleSectionDemo() {
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
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        CollapsibleSection (MDX 공통)
      </h3>
      <p
        className={cn(
          /* 레이아웃 */
          "mt-2",
          /* 타이포 */
          "text-sm leading-relaxed",
          /* 색상 */
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        기본은 접혀있고, 열림 상태를 sessionStorage로 유지합니다.
      </p>

      <CollapsibleSection title="더 깊게 보기(데모)" persist storage="session" storageKey="experiment:mdx:collapsible">
        <div
          className={cn(
            /* 레이아웃 */
            "space-y-3",
            /* 타이포 */
            "text-sm leading-relaxed",
            /* 색상 */
            "text-zinc-700 dark:text-zinc-300"
          )}
        >
          <p>
            이 영역은 본문 흐름을 끊지 않으면서, 선택적으로 추가 설명을 제공할 때 사용합니다.
          </p>
          <Boxed title="참고" variant="note">
            박스형 강조(노트/정리/증명 등)와 함께 중첩해서 쓰는 경우가 많습니다.
          </Boxed>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function MdxProofComponentsDemo() {
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
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        Proof Components (MDX 공통)
      </h3>

      <div className="mt-4 space-y-6">
        <Definition name="균일 분포">
          가능한 모든 결과가 같은 확률로 발생하는 분포.
        </Definition>

        <Theorem name="간단한 예시">
          두 개의 공정한 동전을 던지면 (HH, HT, TH, TT) 4가지가 각각 1/4 확률로 나온다.
        </Theorem>

        <Lemma name="보조정리 예시">
          독립 시행이면, 결합 확률은 곱으로 분해된다.
        </Lemma>

        <Claim name="주장 예시">
          위 정리의 결과는 동전이 공정하다는 가정에 의존한다.
        </Claim>

        <Proof>
          <ProofSteps>
            <ProofStep label="표본공간:">두 번 던지기 결과는 4가지다.</ProofStep>
            <ProofStep label="확률:">각 결과는 독립이고 공정하므로 1/2 × 1/2 = 1/4다.</ProofStep>
          </ProofSteps>
        </Proof>
      </div>
    </div>
  );
}

function MdxCodeTabsDemo() {
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
          "text-lg font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        CodeTabs / CodeTab (MDX 공통)
      </h3>
      <p
        className={cn(
          /* 레이아웃 */
          "mt-2",
          /* 타이포 */
          "text-sm leading-relaxed",
          /* 색상 */
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        rehype 플러그인이 생성한 탭 UI를 로컬에서 재현합니다.
      </p>

      <CodeTabs>
        <CodeTab title="TypeScript">
          <CodeBlock>
            <code>
{`export function add(a: number, b: number) {
  return a + b;
}
`}
            </code>
          </CodeBlock>
        </CodeTab>
        <CodeTab title="Python">
          <CodeBlock>
            <code>
{`def add(a: int, b: int) -> int:
    return a + b
`}
            </code>
          </CodeBlock>
        </CodeTab>
      </CodeTabs>
    </div>
  );
}

function MdxHeadingWithLinkDemo() {
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
      <p
        className={cn(
          /* 타이포 */
          "text-sm leading-relaxed",
          /* 색상 */
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        제목 오른쪽의 버튼(hover 시 표시)을 눌러 섹션 링크를 클립보드로 복사합니다.
      </p>

      <HeadingWithLink
        as="h2"
        id="experiment-heading-with-link"
        className={cn(
          /* 레이아웃 */
          "mt-4",
          /* 타이포 */
          "text-2xl font-bold",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        HeadingWithLink 데모
      </HeadingWithLink>
    </div>
  );
}

export const blogMdxStories: ExperimentStory[] = [
  {
    slug: "blog-mdx/collapsible-section",
    title: "CollapsibleSection",
    description: "MDX에서 쓰는 접기/펼치기 섹션 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "collapsible"],
    sourcePaths: ["apps/blog/components/mdx-components/CollapsibleSection.tsx"],
    render: () => <MdxCollapsibleSectionDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/proof-components",
    title: "Proof Components (Boxed/Theorem/Proof...)",
    description: "정리/정의/증명/스텝 등 수학 구조화 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "math"],
    sourcePaths: ["apps/blog/components/mdx-components/proof-components.tsx"],
    render: () => <MdxProofComponentsDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/code-tabs",
    title: "CodeTabs",
    description: "rehype 기반 코드 탭 UI 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "code"],
    sourcePaths: ["apps/blog/components/code-tabs.tsx"],
    render: () => <MdxCodeTabsDemo />,
    controls: {},
  },
  {
    slug: "blog-mdx/heading-with-link",
    title: "HeadingWithLink",
    description: "섹션 링크 복사 버튼이 있는 heading 컴포넌트 데모입니다.",
    category: "Blog / MDX",
    tags: ["blog", "mdx", "heading"],
    sourcePaths: ["apps/blog/components/mdx-components/heading-with-link.tsx"],
    render: () => <MdxHeadingWithLinkDemo />,
    controls: {},
  },
];

