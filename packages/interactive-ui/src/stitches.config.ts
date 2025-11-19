import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  config,
} = createStitches({
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#ff4081',
      background: '#ffffff',
      text: '#333333',
      gray100: '#f5f5f5',
      gray200: '#eeeeee',
      gray300: '#e0e0e0',
    },
    fonts: {
      system: 'system-ui, sans-serif',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '16px',
      4: '32px',
    },
    radii: {
      1: '4px',
      2: '8px',
      round: '9999px',
    },
  },
});

