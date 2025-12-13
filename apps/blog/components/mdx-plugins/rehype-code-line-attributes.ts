import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

type HastElement = {
  type: 'element';
  tagName: string;
  properties?: Record<string, any>;
  children?: Array<any>;
};

function isElement(node: any): node is HastElement {
  return node?.type === 'element' && typeof node.tagName === 'string';
}

function hasPrettyCodeFigure(node: HastElement) {
  return node.tagName === 'figure' && node.properties?.['data-rehype-pretty-code-figure'] !== undefined;
}

function forEachLineInFigure(figure: HastElement, onLine: (line: HastElement, index: number) => void) {
  let lineIndex = 0;

  visit(figure as any, 'element', (node: any) => {
    if (!isElement(node)) return;

    const hasDataLine = node.properties?.['data-line'] !== undefined;
    const className = node.properties?.className;
    const classList = Array.isArray(className) ? className : typeof className === 'string' ? className.split(/\s+/) : [];
    const hasLineClass = classList.includes('line');

    if (!hasDataLine && !hasLineClass) return;

    onLine(node, lineIndex);
    lineIndex += 1;
  });
}

/**
 * rehype-pretty-code가 만든 라인 span들에 `data-line-number`를 부여한다.
 * - URL 해시가 `#L10` 또는 `#L10-L20`일 때, DOM에서 라인을 찾기 쉽게 하기 위함
 */
export const rehypeCodeLineAttributes: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (!isElement(node)) return;
      if (!hasPrettyCodeFigure(node)) return;

      forEachLineInFigure(node, (line, index) => {
        if (!line.properties) line.properties = {};
        // 1-based
        line.properties['data-line-number'] = String(index + 1);
      });
    });
  };
};

