import React from "react";
import { CodeSandbox } from "@repo/interactive-ui";
import type { ExperimentStory } from "../types";
import { cn } from "../../../../lib/utils";

/**
 * Vanilla (HTML/CSS/JS) 데모
 */
function VanillaDemo() {
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-4xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-zinc-50 dark:bg-zinc-900/40",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold mb-4",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        Vanilla (HTML/CSS/JS) 데모
      </h3>

      <CodeSandbox
        template="vanilla"
        files={{
          "/index.html": `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Grid Demo</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="/index.js"></script>
  </body>
</html>`,
          "/styles.css": `#app {
  font-family: system-ui, sans-serif;
  padding: 16px;
}

.grid {
  display: grid;
  grid-template-columns: 60px 140px 80px 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.cell {
  padding: 8px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: white;
}

.cell:hover {
  background: #f7f7f7;
}

.header {
  background: #f5f5f5;
  font-weight: 600;
  font-size: 12px;
  color: #666;
}`,
          "/index.js": `const rows = [
  ["", "A", "B", "C"],
  ["1", "Name", "Age", "Status"],
  ["2", "Alice", "30", "Active"],
  ["3", "Bob", "25", "Inactive"],
];

const grid = document.createElement("div");
grid.className = "grid";

rows.forEach((row, rowIndex) => {
  row.forEach((value) => {
    const cell = document.createElement("div");
    cell.className = rowIndex === 0 ? "cell header" : "cell";
    cell.textContent = value;
    grid.appendChild(cell);
  });
});

document.querySelector("#app").appendChild(grid);
console.log("Grid rendered with", rows.length, "rows");`,
        }}
        options={{
          showConsoleButton: true,
          editorHeight: 350,
        }}
      />
    </div>
  );
}

/**
 * React + TypeScript 데모
 */
function ReactTsDemo() {
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-4xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-zinc-50 dark:bg-zinc-900/40",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold mb-4",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        React + TypeScript 데모
      </h3>

      <CodeSandbox
        template="react-ts"
        files={{
          "/App.tsx": `import React, { useState } from "react";

type CellValue = string | number;
type CellData = { value: CellValue };
type RowData = { cells: CellData[] };
type GridData = { rows: RowData[] };

function Cell({ value }: { value: CellValue }) {
  return (
    <div style={{
      minWidth: 100,
      height: 32,
      padding: "0 8px",
      border: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      background: "white",
      fontSize: 14,
      color: "#333",
    }}>
      {value === "" ? "\\u00A0" : String(value)}
    </div>
  );
}

function Row({ cells }: { cells: CellData[] }) {
  return (
    <div style={{ display: "flex" }}>
      {cells.map((c, i) => <Cell key={i} value={c.value} />)}
    </div>
  );
}

function Grid({ data, showHeaders }: { data: GridData; showHeaders: boolean }) {
  const maxColumns = Math.max(0, ...data.rows.map((r) => r.cells.length));
  const headers = Array.from({ length: maxColumns }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div style={{
      display: "inline-block",
      border: "1px solid #d0d0d0",
      borderRadius: 6,
      overflow: "hidden",
    }}>
      {showHeaders && (
        <div style={{
          display: "flex",
          background: "#f5f5f5",
          borderBottom: "2px solid #d0d0d0",
        }}>
          <div style={{
            minWidth: 50,
            height: 32,
            borderRight: "1px solid #e0e0e0",
          }} />
          {headers.map((h) => (
            <div key={h} style={{
              minWidth: 100,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 12,
              color: "#666",
              borderRight: "1px solid #e0e0e0",
            }}>
              {h}
            </div>
          ))}
        </div>
      )}

      {data.rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{
          display: "flex",
          borderBottom: rowIndex === data.rows.length - 1 ? undefined : "1px solid #e0e0e0",
        }}>
          {showHeaders && (
            <div style={{
              minWidth: 50,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f5f5f5",
              borderRight: "2px solid #d0d0d0",
              fontSize: 12,
              color: "#666",
              fontWeight: 600,
            }}>
              {rowIndex + 1}
            </div>
          )}
          <Row cells={row.cells} />
        </div>
      ))}
    </div>
  );
}

const sampleData: GridData = {
  rows: [
    { cells: [{ value: "Name" }, { value: "Age" }, { value: "Status" }] },
    { cells: [{ value: "Alice Johnson" }, { value: 30 }, { value: "Active" }] },
    { cells: [{ value: "Bob Smith" }, { value: 25 }, { value: "Inactive" }] },
  ],
};

export default function App() {
  const [showHeaders, setShowHeaders] = useState(true);

  return (
    <div style={{ padding: 24, background: "#fafafa", minHeight: "100vh" }}>
      <h1 style={{ margin: 0, marginBottom: 8, fontSize: 24 }}>
        Build Your Own Spreadsheet
      </h1>
      <p style={{ margin: 0, marginBottom: 16, color: "#666" }}>
        Chapter 1: Basic Grid UI
      </p>
      
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={showHeaders}
          onChange={(e) => setShowHeaders(e.target.checked)}
        />
        Show Headers
      </label>

      <Grid data={sampleData} showHeaders={showHeaders} />
    </div>
  );
}`,
        }}
        options={{
          showConsoleButton: true,
          editorHeight: 450,
        }}
      />
    </div>
  );
}

/**
 * 차단된 의존성 경고 데모
 */
function BlockedDepsDemo() {
  return (
    <div
      className={cn(
        /* 레이아웃 */
        "w-full max-w-4xl",
        "rounded-2xl p-6",
        /* 배경 및 테두리 */
        "bg-zinc-50 dark:bg-zinc-900/40",
        "border border-zinc-200 dark:border-zinc-800"
      )}
    >
      <h3
        className={cn(
          /* 타이포 */
          "text-lg font-bold mb-2",
          /* 색상 */
          "text-zinc-900 dark:text-zinc-100"
        )}
      >
        차단된 의존성 경고 데모
      </h3>
      <p
        className={cn(
          /* 타이포 */
          "text-sm mb-4",
          /* 색상 */
          "text-zinc-600 dark:text-zinc-400"
        )}
      >
        allowlist에 없는 패키지(&quot;some-random-package&quot;)를 요청하면 경고가 표시됩니다.
      </p>

      <CodeSandbox
        template="react-ts"
        files={{
          "/App.tsx": `export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Blocked Dependencies Demo</h1>
      <p>이 샌드박스는 차단된 의존성 경고를 보여줍니다.</p>
      <p>콘솔에서도 경고 메시지를 확인할 수 있습니다.</p>
    </div>
  );
}`,
        }}
        dependencies={{
          // 허용된 패키지
          lodash: "^4.17.21",
          // 차단될 패키지 (allowlist에 없음)
          "some-random-package": "^1.0.0",
          "another-blocked-pkg": "^2.0.0",
        }}
        options={{
          editorHeight: 200,
        }}
      />
    </div>
  );
}

export const codeSandboxStories: ExperimentStory[] = [
  {
    slug: "interactive-ui/codesandbox-vanilla",
    title: "CodeSandbox - Vanilla (HTML/CSS/JS)",
    description: "HTML, CSS, JavaScript로 구성된 기본 샌드박스 데모입니다.",
    category: "UI / MDX",
    tags: ["interactive-ui", "codesandbox", "sandpack", "vanilla"],
    sourcePaths: [
      "packages/interactive-ui/src/components/CodeSandbox/CodeSandbox.tsx",
    ],
    render: () => <VanillaDemo />,
    controls: {},
  },
  {
    slug: "interactive-ui/codesandbox-react-ts",
    title: "CodeSandbox - React + TypeScript",
    description: "React와 TypeScript로 구성된 샌드박스 데모입니다.",
    category: "UI / MDX",
    tags: ["interactive-ui", "codesandbox", "sandpack", "react", "typescript"],
    sourcePaths: [
      "packages/interactive-ui/src/components/CodeSandbox/CodeSandbox.tsx",
    ],
    render: () => <ReactTsDemo />,
    controls: {},
  },
  {
    slug: "interactive-ui/codesandbox-blocked-deps",
    title: "CodeSandbox - Blocked Dependencies",
    description:
      "allowlist 정책으로 차단된 의존성이 있을 때 경고를 표시하는 데모입니다.",
    category: "UI / MDX",
    tags: ["interactive-ui", "codesandbox", "sandpack", "allowlist"],
    sourcePaths: [
      "packages/interactive-ui/src/components/CodeSandbox/dependency-policy.ts",
    ],
    render: () => <BlockedDepsDemo />,
    controls: {},
  },
];

