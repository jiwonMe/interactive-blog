import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  config,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      primary: '#2563eb', // tailwind blue-600 match
      primaryHover: '#1d4ed8', // tailwind blue-700 match
      background: '#ffffff',
      text: '#111827', // tailwind gray-900 match
      textSecondary: '#4b5563', // tailwind gray-600 match
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      border: '#e5e7eb',
      codeBackground: '#f9fafb', // tailwind gray-50 match
    },
    fonts: {
      system: '"Pretendard Variable", Pretendard, system-ui, sans-serif',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
    },
    radii: {
      1: '4px',
      2: '8px',
      3: '12px',
      round: '9999px',
    },
    fontSizes: {
      1: '0.75rem',
      2: '0.875rem',
      3: '1rem',
      4: '1.125rem',
      5: '1.25rem',
    },
  },
  utils: {
    p: (value: string | number) => ({ padding: value }),
    pt: (value: string | number) => ({ paddingTop: value }),
    pr: (value: string | number) => ({ paddingRight: value }),
    pb: (value: string | number) => ({ paddingBottom: value }),
    pl: (value: string | number) => ({ paddingLeft: value }),
    px: (value: string | number) => ({ paddingLeft: value, paddingRight: value }),
    py: (value: string | number) => ({ paddingTop: value, paddingBottom: value }),
    m: (value: string | number) => ({ margin: value }),
    mt: (value: string | number) => ({ marginTop: value }),
    mr: (value: string | number) => ({ marginRight: value }),
    mb: (value: string | number) => ({ marginBottom: value }),
    ml: (value: string | number) => ({ marginLeft: value }),
    mx: (value: string | number) => ({ marginLeft: value, marginRight: value }),
    my: (value: string | number) => ({ marginTop: value, marginBottom: value }),
  },
});

export const darkTheme = createTheme('dark-theme', {
  colors: {
    primary: '#3b82f6', // blue-500
    primaryHover: '#2563eb', // blue-600
    background: '#18181b', // zinc-900
    text: '#fafafa', // zinc-50
    textSecondary: '#a1a1aa', // zinc-400
    gray100: '#27272a', // zinc-800
    gray200: '#3f3f46', // zinc-700
    gray300: '#52525b', // zinc-600
    border: '#27272a', // zinc-800
    codeBackground: '#09090b', // zinc-950
  },
});

// CSS 변수를 정의하는 global styles
export const globalStyles = globalCss({
  ':root': {
    '--colors-primary': '#2563eb',
    '--colors-primaryHover': '#1d4ed8',
    '--colors-background': '#ffffff',
    '--colors-text': '#111827',
    '--colors-textSecondary': '#4b5563',
    '--colors-gray100': '#f3f4f6',
    '--colors-gray200': '#e5e7eb',
    '--colors-gray300': '#d1d5db',
    '--colors-border': '#e5e7eb',
    '--colors-codeBackground': '#f9fafb',
  },
  '.dark-theme': {
    '--colors-primary': '#3b82f6',
    '--colors-primaryHover': '#2563eb',
    '--colors-background': '#18181b',
    '--colors-text': '#fafafa',
    '--colors-textSecondary': '#a1a1aa',
    '--colors-gray100': '#27272a',
    '--colors-gray200': '#3f3f46',
    '--colors-gray300': '#52525b',
    '--colors-border': '#27272a',
    '--colors-codeBackground': '#09090b',
  },
});
