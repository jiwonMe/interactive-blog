'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Sandpack,
  getSandpackCssText,
  type SandpackFiles,
  type SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react';
import {
  filterDependencies,
  DEFAULT_ALLOWED_DEPENDENCIES,
} from './dependency-policy';
import { githubLightCustom, githubDarkCustom } from './github-themes';

/**
 * CodeSandbox 컴포넌트 Props
 */
export interface CodeSandboxProps {
  /**
   * Sandpack 템플릿
   * - "vanilla": HTML/CSS/JS
   * - "react-ts": React + TypeScript
   * - "test-ts": TypeScript 테스트 환경 (Jest 기반)
   */
  template: 'vanilla' | 'react-ts' | 'test-ts';

  /**
   * 파일 맵 (Sandpack files 형식)
   * 키: 파일 경로 (예: "/App.tsx")
   * 값: 코드 문자열 또는 { code, readOnly?, hidden?, active? } 객체
   */
  files: SandpackFiles;

  /**
   * 추가 npm 의존성 (allowlist 기반으로 필터링됨)
   */
  dependencies?: Record<string, string>;

  /**
   * 허용할 의존성 목록 (미지정 시 기본 allowlist 사용)
   * 빈 배열 [] 전달 시 의존성 사용 불가
   */
  allowedDependencies?: readonly string[];

  /**
   * Sandpack 옵션 (일부만 노출)
   */
  options?: {
    /** 콘솔 표시 여부 */
    showConsole?: boolean;
    /** 콘솔 버튼 표시 여부 */
    showConsoleButton?: boolean;
    /** 에디터 높이 (기본: 400px) */
    editorHeight?: number | string;
    /** 보이는 파일 목록 (탭으로 표시할 파일) */
    visibleFiles?: string[];
    /** 활성 파일 */
    activeFile?: string;
    /** 외부 리소스 (CDN 등) */
    externalResources?: string[];
    /** 읽기 전용 모드 */
    readOnly?: boolean;
    /** 행 번호 표시 */
    showLineNumbers?: boolean;
    /** 레이아웃 모드 (preview, tests, console) */
    layout?: 'preview' | 'tests' | 'console';
  };

  /**
   * wrapper className (Tailwind 등)
   */
  className?: string;
}

/**
 * CSS를 한 번만 주입하기 위한 플래그
 */
let cssInjected = false;

/**
 * Sandpack CSS를 head에 주입
 */
function injectSandpackCss() {
  if (cssInjected || typeof document === 'undefined') return;

  const existingStyle = document.getElementById('sandpack-css');
  if (existingStyle) {
    cssInjected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = 'sandpack-css';
  style.textContent = getSandpackCssText();
  document.head.appendChild(style);
  cssInjected = true;
}

/**
 * 탭 버튼 텍스트 색상 오버라이드 CSS 주입
 */
function injectTabButtonOverride(isDark: boolean) {
  if (typeof document === 'undefined') return;

  const existingOverride = document.getElementById('sandpack-tab-override');
  if (existingOverride) {
    // 기존 스타일 업데이트
    existingOverride.textContent = getTabButtonOverrideCSS(isDark);
    return;
  }

  const overrideStyle = document.createElement('style');
  overrideStyle.id = 'sandpack-tab-override';
  overrideStyle.textContent = getTabButtonOverrideCSS(isDark);
  document.head.appendChild(overrideStyle);
}

/**
 * 탭 버튼 오버라이드 CSS 생성
 */
function getTabButtonOverrideCSS(isDark: boolean): string {
  // 다크모드/라이트모드에 따른 색상
  const baseColor = isDark ? '#c9d1d9' : '#24292f';
  const accentColor = isDark ? '#58a6ff' : '#0969da';

  return `
    /* 비활성 탭 버튼 텍스트 색상 (무채색) */
    .sp-tab-button:not([data-active="true"]) {
      color: ${baseColor} !important;
    }
    /* 활성 탭 버튼은 파란색 유지 */
    .sp-tab-button[data-active="true"] {
      color: ${accentColor} !important;
    }
  `;
}

/**
 * 차단된 의존성 경고 배너
 */
function BlockedDepsWarning({ blocked }: { blocked: string[] }) {
  if (blocked.length === 0) return null;

  return (
    <div
      style={{
        padding: '8px 12px',
        marginBottom: '8px',
        borderRadius: '6px',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        fontSize: '13px',
        color: '#92400e',
      }}
    >
      <strong>⚠️ 차단된 의존성:</strong> {blocked.join(', ')}
      <span style={{ marginLeft: '8px', opacity: 0.8 }}>
        (allowlist에 없어 제외됨)
      </span>
    </div>
  );
}

/**
 * 다크모드 감지 훅
 */
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 초기값 설정
    const checkDark = () => {
      const htmlEl = document.documentElement;
      return (
        htmlEl.classList.contains('dark') ||
        htmlEl.getAttribute('data-theme') === 'dark'
      );
    };

    setIsDark(checkDark());

    // MutationObserver로 다크모드 변경 감지
    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/**
 * MDX 아티클에서 사용하는 코드 샌드박스 컴포넌트
 *
 * @example
 * ```mdx
 * <CodeSandbox
 *   template="react-ts"
 *   files={{
 *     "/App.tsx": `export default function App() { return <h1>Hello</h1>; }`
 *   }}
 * />
 * ```
 */
export function CodeSandbox({
  template,
  files,
  dependencies,
  allowedDependencies = DEFAULT_ALLOWED_DEPENDENCIES,
  options = {},
  className,
}: CodeSandboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useIsDarkMode();

  // CSS 주입 (최초 1회)
  useEffect(() => {
    injectSandpackCss();
  }, []);

  // 탭 버튼 텍스트 색상 오버라이드 (다크모드 변경 시 업데이트)
  useEffect(() => {
    injectTabButtonOverride(isDarkMode);
  }, [isDarkMode]);

  // 의존성 필터링
  const { allowed: filteredDeps, blocked } = filterDependencies(
    dependencies,
    allowedDependencies
  );

  // Sandpack 옵션 구성
  const {
    showConsole = false,
    showConsoleButton = true,
    editorHeight = 400,
    visibleFiles,
    activeFile,
    externalResources,
    readOnly = false,
    showLineNumbers = true,
    layout,
  } = options;

  // 테마 선택 (Shiki github-light/github-dark와 일치)
  const theme = isDarkMode ? githubDarkCustom : githubLightCustom;

  // 테스트 템플릿인 경우 자동으로 tests 레이아웃 사용
  const effectiveLayout = layout ?? (template === 'test-ts' ? 'tests' : 'preview');

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        // 본문 배경색과 일치하도록 배경색 제거 (Sandpack 테마의 surface1 사용)
        backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
        border: isDarkMode ? '1px solid #3f3f46' : '1px solid #e4e4e7',
      }}
    >
      {/* 차단된 의존성 경고 */}
      <BlockedDepsWarning blocked={blocked} />

      {/* Sandpack 에디터/프리뷰 */}
      <Sandpack
        template={template as SandpackPredefinedTemplate}
        files={files}
        theme={theme}
        customSetup={{
          dependencies:
            Object.keys(filteredDeps).length > 0 ? filteredDeps : undefined,
        }}
        options={{
          showConsole,
          showConsoleButton,
          editorHeight,
          visibleFiles,
          activeFile,
          externalResources,
          readOnly,
          showLineNumbers,
          // 레이아웃 설정
          layout: effectiveLayout,
          showTabs: true,
          closableTabs: false,
          showNavigator: false,
          showRefreshButton: template !== 'test-ts',
          // 에디터 설정
          wrapContent: false, // 긴 줄은 스크롤로 표시
          autorun: true,
          recompileMode: 'delayed',
          recompileDelay: 500,
        }}
      />
    </div>
  );
}

