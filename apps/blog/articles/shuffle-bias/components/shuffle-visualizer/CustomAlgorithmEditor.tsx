'use client';

import React, { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '../../../../lib/utils';
import {
  defineGithubMonacoThemes,
  type GithubMonacoThemeName,
} from './monacoGithubTheme';

export type CustomAlgorithmEditorProps = {
  code: string;
  onChange: (code: string) => void;
  onReset: () => void;
  error: string | null;
  editorTheme: GithubMonacoThemeName;
  heightPx?: number;
};

export type CustomAlgorithmEditorHeaderRowProps = {
  onReset: () => void;
};

export function CustomAlgorithmEditorHeaderRow({ onReset }: CustomAlgorithmEditorHeaderRowProps) {
  return (
    <header
      className={cn(
        /* Layout */
        'flex items-center justify-between',
      )}
    >
      <h4
        className={cn(
          /* Typography */
          'text-sm font-semibold',
        )}
      >
        커스텀 알고리즘 코드
      </h4>

      <button
        type="button"
        onClick={onReset}
        className={cn(
          /* Layout */
          'px-2 py-1 text-xs rounded',
          /* Color */
          'text-zinc-500 hover:text-zinc-700',
          /* Dark */
          'dark:text-zinc-400 dark:hover:text-zinc-200',
        )}
      >
        기본값으로 리셋
      </button>
    </header>
  );
}

export type CustomAlgorithmEditorBoxProps = Pick<
  CustomAlgorithmEditorProps,
  'code' | 'onChange' | 'error' | 'editorTheme' | 'heightPx'
>;

export function CustomAlgorithmEditorBox({
  code,
  onChange,
  error,
  editorTheme,
  heightPx = 220,
}: CustomAlgorithmEditorBoxProps) {
  const borderClassName = useMemo(() => {
    if (error) return 'border-red-500';
    return 'border-zinc-300 dark:border-zinc-700';
  }, [error]);

  return (
    <div
      className={cn(
        /* Layout */
        'w-full rounded-lg overflow-visible border',
        borderClassName,
      )}
    >
      <div
        className={cn(
          /* Layout */
          'overflow-hidden rounded-lg',
        )}
      >
        <Editor
          beforeMount={(monaco) => {
            defineGithubMonacoThemes(monaco);
          }}
          height={`${heightPx}px`}
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => onChange(value || '')}
          theme={editorTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily:
              'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            fixedOverflowWidgets: true,
          }}
        />
      </div>
    </div>
  );
}

export type CustomAlgorithmEditorErrorProps = {
  error: string | null;
};

export function CustomAlgorithmEditorError({ error }: CustomAlgorithmEditorErrorProps) {
  if (!error) return null;
  return (
    <div
      role="alert"
      className={cn(
        /* Layout */
        'p-3 rounded-lg text-sm',
        /* Color */
        'bg-red-50 text-red-700 border border-red-200',
        /* Dark */
        'dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      )}
    >
      <strong>오류:</strong> {error}
    </div>
  );
}

export function CustomAlgorithmEditor({
  code,
  onChange,
  onReset,
  error,
  editorTheme,
  heightPx = 220,
}: CustomAlgorithmEditorProps) {
  return (
    <section
      aria-label="커스텀 알고리즘"
      className={cn(
        /* Layout */
        'space-y-3 pt-5 border-t',
        /* Color */
        'border-zinc-200',
        /* Dark */
        'dark:border-zinc-800',
      )}
    >
      <CustomAlgorithmEditorHeaderRow onReset={onReset} />
      <CustomAlgorithmEditorBox
        code={code}
        onChange={onChange}
        error={error}
        editorTheme={editorTheme}
        heightPx={heightPx}
      />
      <CustomAlgorithmEditorError error={error} />
    </section>
  );
}


