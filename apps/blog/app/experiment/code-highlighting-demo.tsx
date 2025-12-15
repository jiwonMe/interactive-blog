"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

type CodeHighlightingDemoProps = {
  code: string;
  language: string;
  showLineNumbers: boolean;
};

type ShikiHighlightResponse =
  | { ok: true; html: string }
  | { ok: false; error: string };

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function CodeHighlightingDemo({ code, language, showLineNumbers }: CodeHighlightingDemoProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 코드가 없으면 기본 예시 표시
  const displayCode = code.trim() || `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`;

  useEffect(() => {
    let cancelled = false;

    async function highlightCode() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/shiki", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            code: displayCode,
            language,
          }),
        });

        const data = (await res.json()) as ShikiHighlightResponse;
        if (!data.ok) {
          throw new Error(data.error);
        }
        const html = data.html;
        
        if (!cancelled) {
          // shiki가 생성한 HTML 구조를 파싱하여 수정
          let processedHtml = html;
          
          // 다크모드/라이트모드 전환을 위해 data-theme 속성 추가
          // shiki는 두 테마를 모두 포함하므로, 각각에 data-theme 추가
          processedHtml = processedHtml.replace(
            /<pre([^>]*class="[^"]*shiki[^"]*"[^>]*)>/g,
            (match, attrs) => {
              // data-theme 속성이 없으면 추가
              let newAttrs = attrs;
              if (!newAttrs.includes('data-theme')) {
                newAttrs += ' data-theme="light dark"';
              }
              // 인라인 스타일에서 배경색을 더 어둡게 오버라이드
              if (newAttrs.includes('style=')) {
                // 기존 style 속성의 배경색을 zinc-950로 변경
                newAttrs = newAttrs.replace(
                  /background-color:\s*[^;]+/gi,
                  'background-color: #09090b'
                );
                // --shiki-dark-bg 변수도 업데이트
                newAttrs = newAttrs.replace(
                  /--shiki-dark-bg:\s*[^;]+/gi,
                  '--shiki-dark-bg: #09090b'
                );
              } else {
                // style 속성이 없으면 추가
                newAttrs += ' style="background-color: #09090b; --shiki-dark-bg: #09090b;"';
              }
              return `<pre${newAttrs}>`;
            }
          );
          
          // 줄번호 표시를 위해 data-line-numbers 속성 추가 및 각 라인에 data-line 추가
          if (showLineNumbers) {
            // pre 요소에 data-line-numbers 추가
            processedHtml = processedHtml.replace(
              /<pre([^>]*)>/g,
              (match, attrs) => {
                if (!attrs.includes('data-line-numbers')) {
                  return `<pre${attrs} data-line-numbers="">`;
                }
                return match;
              }
            );
            // code 요소에도 data-line-numbers 추가
            processedHtml = processedHtml.replace(
              /<code([^>]*)>/g,
              (match, attrs) => {
                if (!attrs.includes('data-line-numbers')) {
                  return `<code${attrs} data-line-numbers="">`;
                }
                return match;
              }
            );
            
            // 각 라인에 data-line 속성 추가
            // shiki는 span.line 또는 다른 구조를 사용할 수 있음
            processedHtml = processedHtml.replace(
              /<span class="line"/g,
              '<span class="line" data-line=""'
            );
          }
          
          setHighlightedHtml(processedHtml);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to highlight code:', error);
        if (!cancelled) {
          // 하이라이팅 실패 시 기본 텍스트 표시
          const fallbackHtml = `<pre class="shiki"><code>${escapeHtml(displayCode).replace(/\n/g, "<br />")}</code></pre>`;
          setHighlightedHtml(fallbackHtml);
          setIsLoading(false);
        }
      }
    }

    highlightCode();

    return () => {
      cancelled = true;
    };
  }, [displayCode, language, showLineNumbers]);
  
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full",
        /* 크기 */
        "max-w-4xl"
      )}
    >
      {!code.trim() && (
        <div
          className={cn(
            /* 레이아웃 */
            "mb-6",
            "p-4",
            /* 배경 */
            "bg-blue-50",
            "dark:bg-blue-900/20",
            /* 테두리 */
            "border",
            "border-blue-200",
            "dark:border-blue-800",
            /* 모서리 */
            "rounded-lg"
          )}
        >
          <p
            className={cn(
              /* 텍스트 */
              "text-sm",
              "text-blue-800",
              "dark:text-blue-200"
            )}
          >
            코드를 입력하면 코드 블록 컴포넌트가 표시됩니다. 기본 예시가 표시되고 있습니다.
          </p>
        </div>
      )}
      
      {!mounted || isLoading ? (
        <div
          className={cn(
            /* 레이아웃 */
            "p-4",
            /* 정렬 */
            "text-center",
            /* 텍스트 */
            "text-zinc-500",
            "dark:text-zinc-400"
          )}
        >
          하이라이팅 중...
        </div>
      ) : (
        <figure data-rehype-pretty-code-figure="">
          <div
              className={cn(
                // 기본 스타일
                "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:my-6 [&_pre]:text-sm [&_pre]:leading-relaxed",
                // shiki가 생성한 pre 요소는 자체 배경색을 사용하므로 Tailwind 배경색 제거
                "[&_pre.shiki]:bg-transparent [&_pre.shiki]:border-zinc-200 dark:[&_pre.shiki]:border-zinc-800",
                // shiki 다크모드 배경색 오버라이드
                "dark:[&_pre.shiki]:!bg-[#09090b]",
                // 일반 pre 요소는 Tailwind 배경색 사용
                "[&_pre:not(.shiki)]:bg-zinc-50 [&_pre:not(.shiki)]:border-zinc-200",
                "dark:[&_pre:not(.shiki)]:bg-zinc-900 dark:[&_pre:not(.shiki)]:border-zinc-800",
                // shiki가 생성한 구조에 대한 스타일
                "[&_pre_code]:bg-transparent [&_pre_code]:grid [&_pre_code]:min-w-full [&_pre_code]:w-max [&_pre_code]:p-4",
                // data-line 요소 스타일
                "[&_pre_code_[data-line]]:px-4 [&_pre_code_[data-line]]:inline-block [&_pre_code_[data-line]]:w-full [&_pre_code_[data-line]]:min-h-[1.5rem]",
                "[&_pre_code_.line]:px-4 [&_pre_code_.line]:inline-block [&_pre_code_.line]:w-full [&_pre_code_.line]:min-h-[1.5rem]"
              )}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </figure>
      )}
      
      <div
        className={cn(
          /* 여백 */
          "mt-4",
          /* 텍스트 */
          "text-sm",
          "text-zinc-600",
          "dark:text-zinc-400",
          /* 레이아웃 */
          "space-y-1"
        )}
      >
        <p>
          <strong>언어:</strong> {language}
        </p>
        <p>
          <strong>줄 번호:</strong> {showLineNumbers ? '표시됨' : '숨김'}
        </p>
        <p
          className={cn(
            /* 텍스트 */
            "text-xs",
            "text-zinc-500",
            "dark:text-zinc-500",
            /* 여백 */
            "mt-2"
          )}
        >
          💡 CodeBlock 컴포넌트를 테스트하고 있습니다. 코드를 입력하고 언어를 변경해보세요.
        </p>
      </div>
    </div>
  );
}

