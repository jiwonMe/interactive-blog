import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

// 코드 블록 메타데이터에서 줄 번호 표시 여부를 파싱하는 플러그인
// rehype-pretty-code가 처리한 후에 실행되어야 함
export const rehypeLineNumbers: Plugin = () => {
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

