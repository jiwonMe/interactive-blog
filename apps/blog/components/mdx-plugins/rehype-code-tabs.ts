import type { Plugin } from 'unified';

type HastNode = any;

type HastElement = {
  type: 'element';
  tagName: string;
  properties?: Record<string, any>;
  children?: HastNode[];
};

function isElement(node: HastNode): node is HastElement {
  return node?.type === 'element' && typeof node.tagName === 'string';
}

function isPrettyCodeFigure(node: HastNode): node is HastElement {
  return (
    isElement(node) &&
    node.tagName === 'figure' &&
    node.properties?.['data-rehype-pretty-code-figure'] !== undefined
  );
}

function isTitleFigcaption(node: HastNode): node is HastElement {
  if (!isElement(node)) return false;
  if (node.tagName !== 'figcaption') return false;
  // rehype-pretty-code는 title에 data-rehype-pretty-code-title을 붙인다 (버전 차이를 고려해 널널하게 처리)
  if (node.properties?.['data-rehype-pretty-code-title'] !== undefined) return true;
  // fallback: 첫 figcaption을 title로 취급
  return true;
}

function extractText(node: HastNode): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.type === 'text') return String(node.value ?? '');
  if (Array.isArray(node.children)) return node.children.map(extractText).join('');
  return '';
}

function takeFigureTitle(figure: HastElement): string | null {
  const children = Array.isArray(figure.children) ? figure.children : [];
  const idx = children.findIndex(isTitleFigcaption);
  if (idx < 0) return null;

  const caption = children[idx];
  const title = extractText(caption).trim();

  // figcaption 제거 (탭 제목으로만 사용)
  figure.children = children.filter((_, i) => i !== idx);

  return title || null;
}

function createCodeTab(title: string, figure: HastElement): HastElement {
  return {
    type: 'element',
    tagName: 'CodeTab',
    properties: { title },
    children: [figure],
  };
}

function createCodeTabs(tabs: HastElement[]): HastElement {
  return {
    type: 'element',
    tagName: 'CodeTabs',
    properties: {},
    children: tabs,
  };
}

/**
 * 연속된 `figure[data-rehype-pretty-code-figure]` 중 title이 있는 블록이 2개 이상이면,
 * `<CodeTabs><CodeTab title="...">...</CodeTab>...</CodeTabs>`로 그룹화한다.
 *
 * - 단일 title code block은 기존 figure 그대로 유지
 * - title은 figcaption에서 추출하며, figcaption은 제거한다
 */
export const rehypeCodeTabs: Plugin = () => {
  return (tree: any) => {
    const rootChildren: HastNode[] = Array.isArray(tree.children) ? tree.children : [];

    const nextChildren: HastNode[] = [];
    let i = 0;

    while (i < rootChildren.length) {
      const node = rootChildren[i];

      if (!isPrettyCodeFigure(node)) {
        nextChildren.push(node);
        i += 1;
        continue;
      }

      // 연속 figure 수집
      const figures: HastElement[] = [];
      let j = i;
      while (j < rootChildren.length && isPrettyCodeFigure(rootChildren[j])) {
        figures.push(rootChildren[j] as HastElement);
        j += 1;
      }

      // title이 있는 figure만 탭 대상
      const titled: Array<{ title: string; figure: HastElement }> = [];
      for (const fig of figures) {
        const title = takeFigureTitle(fig);
        if (title) {
          titled.push({ title, figure: fig });
        }
      }

      if (titled.length >= 2) {
        const tabs = titled.map(({ title, figure }) => createCodeTab(title, figure));
        nextChildren.push(createCodeTabs(tabs));
      } else {
        // 원본 유지 (takeFigureTitle이 figcaption을 제거했을 수 있으니, 단일인 경우는 되돌려준다)
        // => 단일 title인 경우에는 tab으로 만들지 않지만, title은 유용하니 figcaption을 다시 추가해준다.
        if (titled.length === 1) {
          const { title, figure } = titled[0];
          figure.children = [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { 'data-rehype-pretty-code-title': '' },
              children: [{ type: 'text', value: title }],
            },
            ...(figure.children ?? []),
          ];
        }
        nextChildren.push(...figures);
      }

      i = j;
    }

    tree.children = nextChildren;
  };
};

