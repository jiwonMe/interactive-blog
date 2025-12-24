'use client';

import React, { useState } from 'react';
import styles from './GridDemo.module.css';

// ============================================================
// 타입 정의
// ============================================================

interface CellData {
  value: string | number;
}

interface RowData {
  cells: CellData[];
}

interface GridData {
  rows: RowData[];
}

// ============================================================
// Cell 컴포넌트
// ============================================================

interface CellProps {
  value: string | number;
}

function Cell({ value }: CellProps) {
  const displayValue = value === '' ? '\u00A0' : value;

  return <div className={styles.cell}>{displayValue}</div>;
}

// ============================================================
// Row 컴포넌트
// ============================================================

interface RowProps {
  cells: CellData[];
  rowIndex: number;
}

function Row({ cells, rowIndex }: RowProps) {
  return (
    <div className={styles.row}>
      {cells.map((cell, colIndex) => (
        <Cell key={`${rowIndex}-${colIndex}`} value={cell.value} />
      ))}
    </div>
  );
}

// ============================================================
// Grid 컴포넌트
// ============================================================

interface GridProps {
  data: GridData;
  showHeaders?: boolean;
}

function Grid({ data, showHeaders = false }: GridProps) {
  const maxColumns = Math.max(...data.rows.map((row) => row.cells.length), 0);

  const columnHeaders = Array.from({ length: maxColumns }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className={styles.grid}>
      {/* 열 헤더 */}
      {showHeaders && (
        <div className={styles.header}>
          <div className={styles.cornerCell} />
          {columnHeaders.map((header) => (
            <div key={header} className={styles.headerCell}>
              {header}
            </div>
          ))}
        </div>
      )}

      {/* 데이터 행 */}
      {data.rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.rowContainer}>
          {showHeaders && (
            <div className={styles.rowNumber}>{rowIndex + 1}</div>
          )}
          <Row cells={row.cells} rowIndex={rowIndex} />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 샘플 데이터
// ============================================================

function createSampleGrid(): GridData {
  return {
    rows: [
      {
        cells: [
          { value: 'Name' },
          { value: 'Age' },
          { value: 'Status' },
          { value: 'Score' },
        ],
      },
      {
        cells: [
          { value: 'Alice Johnson' },
          { value: 30 },
          { value: 'Active' },
          { value: 95 },
        ],
      },
      {
        cells: [
          { value: 'Bob Smith' },
          { value: 25 },
          { value: 'Inactive' },
          { value: 82 },
        ],
      },
      {
        cells: [
          { value: 'Carol White' },
          { value: 35 },
          { value: 'Active' },
          { value: 88 },
        ],
      },
    ],
  };
}

// ============================================================
// GridDemo (메인 export)
// ============================================================

export function GridDemo() {
  const [showHeaders, setShowHeaders] = useState(true);
  const data = createSampleGrid();

  return (
    <div className={styles.container}>
      {/* 컨트롤 */}
      <div className={styles.controls}>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={showHeaders}
            onChange={(e) => setShowHeaders(e.target.checked)}
            className={styles.checkbox}
          />
          헤더 표시
        </label>
      </div>

      {/* Grid */}
      <div className={styles.gridWrapper}>
        <Grid data={data} showHeaders={showHeaders} />
      </div>

      {/* 안내 문구 */}
      <p className={styles.hint}>
        ↑ 셀 위에 마우스를 올려보세요. 배경색이 변합니다.
      </p>
    </div>
  );
}
