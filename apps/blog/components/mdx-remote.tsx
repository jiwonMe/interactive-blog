import { MDXRemote } from 'next-mdx-remote/rsc';
import { InteractivePanel, Playground } from '@repo/interactive-ui';

const components = {
  InteractivePanel,
  Playground,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mb-4" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
};

export function CustomMDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
    />
  );
}

