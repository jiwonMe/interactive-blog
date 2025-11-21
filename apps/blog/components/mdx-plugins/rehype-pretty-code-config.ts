import { visit } from 'unist-util-visit';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Plugin } from 'unified';

// rehype-pretty-code 전에 메타데이터를 저장하는 플러그인
const createRehypePrettyCodeMeta: Plugin = () => {
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
};

// rehype-pretty-code 설정
export const rehypePrettyCodeConfig: Plugin[] = [
  createRehypePrettyCodeMeta(),
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
];

