'use client';

import { useLayoutEffect } from 'react';
import { getCssText, globalStyles } from '@repo/interactive-ui';

// Global styles 적용 (컴포넌트 외부에서 호출)
globalStyles();

export function StitchesStyles() {
  useLayoutEffect(() => {
    // Stitches CSS가 이미 주입되어 있는지 확인
    if (!document.getElementById('stitches')) {
      const style = document.createElement('style');
      style.id = 'stitches';
      style.innerHTML = getCssText();
      document.head.appendChild(style);
    }
  }, []);

  return null;
}

