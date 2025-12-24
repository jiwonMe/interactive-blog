import type { SandpackTheme } from '@codesandbox/sandpack-react';
import { githubLight, atomDark } from '@codesandbox/sandpack-themes';

/**
 * GitHub Light 테마 (Shiki github-light와 일치)
 * Sandpack의 기본 githubLight를 기반으로 문법 하이라이팅 색상만 조정
 */
export const githubLightCustom: SandpackTheme = {
  ...githubLight,
  colors: {
    ...githubLight.colors,
    // 기본 텍스트 색상 명시적으로 설정
    base: '#24292f',
    // 본문 배경색과 일치 (zinc-100)
    surface1: '#f4f4f5',
  },
  syntax: {
    ...githubLight.syntax,
    // Shiki github-light와 일치하도록 조정
    plain: '#24292f', // 일반 텍스트 색상 (검은색)
    comment: '#6e7781',
    keyword: '#cf222e',
    tag: '#116329',
    punctuation: '#24292f',
    definition: '#8250df',
    property: '#0550ae',
    static: '#0550ae',
    string: '#0a3069',
  },
};

/**
 * GitHub Dark 테마 (Shiki github-dark와 일치)
 * atomDark를 기반으로 하되 GitHub Dark 색상으로 조정
 */
export const githubDarkCustom: SandpackTheme = {
  ...atomDark,
  colors: {
    ...atomDark.colors,
    // 본문 배경색과 일치 (zinc-950)
    surface1: '#09090b',
    surface2: '#161b22',
    surface3: '#21262d',
    // 기본 텍스트 색상 명시적으로 설정 (무채색)
    base: '#c9d1d9',
    // 클릭 가능한 요소도 무채색 (일관성 유지)
    clickable: '#c9d1d9',
    hover: '#c9d1d9',
    accent: '#c9d1d9',
    error: '#f85149',
    errorSurface: '#490202',
    warning: '#d29922',
    warningSurface: '#3d2c00',
  },
  syntax: {
    ...atomDark.syntax,
    // 일반 텍스트 색상 명시적으로 설정 (회색, 파란색 아님)
    plain: '#c9d1d9',
    comment: '#8b949e',
    keyword: '#ff7b72',
    tag: '#7ee787',
    punctuation: '#c9d1d9',
    definition: '#d2a8ff',
    property: '#79c0ff',
    static: '#79c0ff',
    string: '#a5d6ff',
  },
};

