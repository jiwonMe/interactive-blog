'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { getCssText } from '@repo/interactive-ui';
import { useState } from 'react';

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

