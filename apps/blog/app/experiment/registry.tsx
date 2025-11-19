import React from 'react';
import { InteractivePanel, Playground } from "@repo/interactive-ui";

export type ExperimentItem = {
  slug: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

export const experiments: ExperimentItem[] = [
  {
    slug: "playground",
    title: "인터랙티브 플레이그라운드",
    description: "로컬 상태를 가진 카운터 컴포넌트입니다.",
    component: <Playground />,
  },
  {
    slug: "panel-basic",
    title: "기본 패널",
    description: "단순한 접이식 패널입니다.",
    component: (
      <InteractivePanel title="기본 패널">
        이것은 기본 인터랙티브 패널의 내용입니다. 클릭하여 활성화/비활성화 상태를 전환해보세요.
      </InteractivePanel>
    ),
  },
  {
    slug: "panel-complex",
    title: "복합 콘텐츠 패널",
    description: "다양한 요소가 포함된 패널 예시입니다.",
    component: (
      <InteractivePanel title="고급 기능 패널">
        <div className="space-y-4 min-w-[300px]">
          <p>풍부한 콘텐츠 예시:</p>
          <div className="h-20 bg-blue-100 rounded flex items-center justify-center text-blue-800 font-medium">
            이미지 플레이스홀더
          </div>
          <button className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
            동작 실행
          </button>
        </div>
      </InteractivePanel>
    ),
  },
];

export function getExperimentBySlug(slug: string) {
  return experiments.find((e) => e.slug === slug);
}
