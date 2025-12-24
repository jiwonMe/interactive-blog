'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Sandpack,
  getSandpackCssText,
  type SandpackFiles,
  type SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react';
import { atomDark, githubLight } from '@codesandbox/sandpack-themes';
import {
  filterDependencies,
  DEFAULT_ALLOWED_DEPENDENCIES,
} from './dependency-policy';

/**
 * CodeSandbox 컴포넌트 Props
 */
export interface CodeSandboxProps {
  /**
   * Sandpack 템플릿
   * - "vanilla": HTML/CSS/JS
   * - "react-ts": React + TypeScript
   */
  template: 'vanilla' | 'react-ts';

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
  } = options;

  // 테마 선택
  const theme = isDarkMode ? atomDark : githubLight;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
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
          showTabs: true,
          closableTabs: false,
          showNavigator: false,
          showRefreshButton: true,
          // 에디터 설정
          wrapContent: true,
          autorun: true,
          recompileMode: 'delayed',
          recompileDelay: 500,
        }}
      />
    </div>
  );
}

