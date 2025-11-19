import React from 'react';
import { InteractivePanel, Playground } from "@repo/interactive-ui";

export type ControlType =
  | { type: 'text'; label: string; defaultValue: string }
  | { type: 'number'; label: string; defaultValue: number; min?: number; max?: number; step?: number }
  | { type: 'boolean'; label: string; defaultValue: boolean }
  | { type: 'select'; label: string; defaultValue: string; options: string[] };

export type ExperimentItem = {
  slug: string;
  title: string;
  description: string;
  render: (props: any) => React.ReactNode;
  controls: Record<string, ControlType>;
};

export const experiments: ExperimentItem[] = [
  {
    slug: "playground",
    title: "인터랙티브 플레이그라운드",
    description: "로컬 상태를 가진 카운터 컴포넌트입니다.",
    render: () => <Playground />,
    controls: {},
  },
  {
    slug: "panel-basic",
    title: "기본 패널",
    description: "단순한 접이식 패널입니다.",
    render: (props) => (
      <div style={{ width: '300px' }}>
        <InteractivePanel title={props.title}>
          {props.content}
        </InteractivePanel>
      </div>
    ),
    controls: {
      title: { type: 'text', label: '패널 제목', defaultValue: '기본 패널' },
      content: { type: 'text', label: '내용', defaultValue: '이것은 기본 인터랙티브 패널의 내용입니다. 클릭하여 활성화/비활성화 상태를 전환해보세요.' },
    },
  },
  {
    slug: "panel-complex",
    title: "복합 콘텐츠 패널",
    description: "다양한 요소가 포함된 패널 예시입니다.",
    render: (props) => (
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <InteractivePanel title={props.title}>
          <div className="space-y-4">
            <p>{props.description}</p>
            {props.showImage && (
              <div className="h-32 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center text-blue-500 font-medium">
                이미지 영역
              </div>
            )}
            {props.showButton && (
              <button className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
                {props.buttonText}
              </button>
            )}
          </div>
        </InteractivePanel>
      </div>
    ),
    controls: {
      title: { type: 'text', label: '패널 제목', defaultValue: '고급 기능 패널' },
      description: { type: 'text', label: '설명 텍스트', defaultValue: '풍부한 콘텐츠 예시입니다. 아래 컨트롤을 통해 요소를 제어해보세요.' },
      showImage: { type: 'boolean', label: '이미지 표시', defaultValue: true },
      showButton: { type: 'boolean', label: '버튼 표시', defaultValue: true },
      buttonText: { type: 'text', label: '버튼 텍스트', defaultValue: '동작 실행' },
    },
  },
];

export function getExperimentBySlug(slug: string) {
  return experiments.find((e) => e.slug === slug);
}
