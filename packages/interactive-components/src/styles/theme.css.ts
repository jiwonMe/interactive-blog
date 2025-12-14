import { createThemeContract, style } from '@vanilla-extract/css';
import { palette } from '../utils/colors';

export const vars = createThemeContract({
  color: {
    // 기본 배경/표면 색상
    background: null,
    surface: null,
    surfaceAlt: null,
    // 텍스트 색상
    text: null,
    textMuted: null,
    textInverse: null,
    // 테두리 색상
    border: null,
    borderAlt: null,
    // 버튼 색상 (블로그 스타일: zinc 기반)
    buttonPrimaryBg: null,
    buttonPrimaryText: null,
    buttonPrimaryHover: null,
    buttonSecondaryBg: null,
    buttonSecondaryText: null,
    buttonSecondaryHover: null,
    // 강조 색상
    accent: null,
    success: null,
    warning: null,
    danger: null,
    // 그리드/차트 색상
    grid: null,
  },
  space: {
    1: null,
    2: null,
    3: null,
    4: null,
    6: null,
    8: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
    full: null,
  },
  font: {
    sizeSm: null,
    sizeMd: null,
    sizeLg: null,
    mono: null,
  },
  shadow: {
    sm: null,
    md: null,
  },
});

export const lightThemeValues = {
  color: {
    // 기본 배경/표면 색상 (ShuffleVisualizer 스타일)
    background: '#ffffff',
    surface: palette.zinc50,
    surfaceAlt: palette.zinc100,
    // 텍스트 색상
    text: palette.zinc900,
    textMuted: palette.zinc600,
    textInverse: '#ffffff',
    // 테두리 색상
    border: palette.zinc200,
    borderAlt: palette.zinc300,
    // 버튼 색상 (블로그 스타일: 라이트에서 bg-zinc-900)
    buttonPrimaryBg: palette.zinc900,
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: palette.zinc700,
    buttonSecondaryBg: palette.zinc200,
    buttonSecondaryText: palette.zinc900,
    buttonSecondaryHover: palette.zinc300,
    // 강조 색상
    accent: palette.indigo500,
    success: palette.emerald500,
    warning: palette.amber500,
    danger: palette.rose500,
    // 그리드/차트 색상
    grid: palette.zinc200,
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  font: {
    sizeSm: '12px',
    sizeMd: '14px',
    sizeLg: '16px',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 8px 24px rgba(0,0,0,0.10)',
  },
} as const;

export const darkThemeValues = {
  color: {
    // 기본 배경/표면 색상 (ShuffleVisualizer 스타일)
    background: palette.zinc900,
    surface: 'rgba(24, 24, 27, 0.5)',
    surfaceAlt: 'rgba(24, 24, 27, 0.7)',
    // 텍스트 색상
    text: palette.zinc100,
    textMuted: palette.zinc400,
    textInverse: palette.zinc900,
    // 테두리 색상
    border: palette.zinc800,
    borderAlt: palette.zinc700,
    // 버튼 색상 (블로그 스타일: 다크에서 bg-zinc-100)
    buttonPrimaryBg: palette.zinc100,
    buttonPrimaryText: palette.zinc900,
    buttonPrimaryHover: palette.zinc300,
    buttonSecondaryBg: palette.zinc800,
    buttonSecondaryText: palette.zinc100,
    buttonSecondaryHover: palette.zinc700,
    // 강조 색상
    accent: palette.indigo500,
    success: palette.emerald500,
    warning: palette.amber500,
    danger: palette.rose500,
    // 그리드/차트 색상
    grid: palette.zinc800,
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  font: {
    sizeSm: '12px',
    sizeMd: '14px',
    sizeLg: '16px',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.30)',
    md: '0 10px 30px rgba(0,0,0,0.40)',
  },
} as const;

export const themeRoot = style({
  color: vars.color.text,
  backgroundColor: vars.color.background,
});

