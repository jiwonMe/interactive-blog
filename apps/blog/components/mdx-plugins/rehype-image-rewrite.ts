import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

// Rehype plugin to rewrite image src in standard markdown
export const createRehypeImageRewrite = (slug?: string): Plugin => {
  return () => {
    return (tree: any) => {
      if (!slug) return;
      visit(tree, 'element', (node: any) => {
        if (node.tagName === 'img' && node.properties && typeof node.properties.src === 'string') {
          const src = node.properties.src;
          if (!src.startsWith('/') && !src.startsWith('http')) {
            const cleanSrc = src.replace(/^\.\//, '');
            node.properties.src = `/images/articles/${slug}/${cleanSrc}`;
          }
        }
      });
    };
  };
};

