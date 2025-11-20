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
    background: '#0f172a', // slate-900
    text: '#f8fafc', // slate-50
    textSecondary: '#94a3b8', // slate-400
    gray100: '#1e293b', // slate-800
    gray200: '#334155', // slate-700
    gray300: '#475569', // slate-600
    border: '#1e293b', // slate-800
  },
});
