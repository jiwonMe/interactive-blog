'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { getCssText, globalStyles } from '@repo/interactive-ui';

// globalStyles를 클라이언트에서도 초기화
if (typeof window !== 'undefined') {
  globalStyles();
}

export default function StitchesRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  useServerInsertedHTML(() => {
    return (
      <style
        id="stitches"
        dangerouslySetInnerHTML={{ __html: getCssText() }}
      />
    );
  });

  return <>{children}</>;
}

