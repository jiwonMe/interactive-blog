import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Paragraph } from 'mdast';

// 한글-영문/기호가 섞인 bold 파싱을 위한 커스텀 플러그인
export const remarkBoldFix: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: Paragraph) => {
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const textNode = node.children[0] as Text;
        const text = textNode.value;
        
        // **로 감싸진 텍스트를 찾아서 파싱
        const boldRegex = /\*\*([^*]+?)\*\*/g;
        const matches = Array.from(text.matchAll(boldRegex)) as RegExpMatchArray[];
        
        if (matches.length > 0) {
          const newChildren: any[] = [];
          let lastIndex = 0;
          
          matches.forEach((match: RegExpMatchArray) => {
            const beforeText = text.slice(lastIndex, match.index);
            if (beforeText) {
              newChildren.push({
                type: 'text',
                value: beforeText,
              });
            }
            
            newChildren.push({
              type: 'strong',
              children: [{ type: 'text', value: match[1] }],
            });
            
            lastIndex = (match.index || 0) + match[0].length;
          });
          
          const afterText = text.slice(lastIndex);
          if (afterText) {
            newChildren.push({
              type: 'text',
              value: afterText,
            });
          }
          
          if (newChildren.length > 0) {
            node.children = newChildren;
          }
        }
      } else {
        // 여러 자식 노드가 있는 경우, 각 텍스트 노드를 재귀적으로 처리
        const processTextNodes = (children: any[]): any[] => {
          return children.flatMap((child) => {
            if (child.type === 'text') {
              const text = child.value;
              const boldRegex = /\*\*([^*]+?)\*\*/g;
              const matches = Array.from(text.matchAll(boldRegex)) as RegExpMatchArray[];
              
              if (matches.length === 0) {
                return [child];
              }
              
              const newChildren: any[] = [];
              let lastIndex = 0;
              
              matches.forEach((match: RegExpMatchArray) => {
                const beforeText = text.slice(lastIndex, match.index);
                if (beforeText) {
                  newChildren.push({
                    type: 'text',
                    value: beforeText,
                  });
                }
                
                newChildren.push({
                  type: 'strong',
                  children: [{ type: 'text', value: match[1] }],
                });
                
                lastIndex = (match.index || 0) + match[0].length;
              });
              
              const afterText = text.slice(lastIndex);
              if (afterText) {
                newChildren.push({
                  type: 'text',
                  value: afterText,
                });
              }
              
              return newChildren;
            } else if (child.children) {
              return [{
                ...child,
                children: processTextNodes(child.children),
              }];
            }
            return [child];
          });
        };
        
        node.children = processTextNodes(node.children);
      }
    });
  };
};

