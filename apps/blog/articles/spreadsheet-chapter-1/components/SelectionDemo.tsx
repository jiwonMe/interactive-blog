'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SelectionDemo.module.css';

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

interface CellPosition {
  rowIndex: number;
  colIndex: number;
}

type Selection = CellPosition | null;

// ============================================================
// useSelection 훅
// ============================================================

function useSelection(totalRows: number, totalCols: number) {
  const [selection, setSelection] = useState<Selection>(null);

  const selectCell = useCallback((position: CellPosition) => {
    setSelection(position);
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  const moveSelection = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      setSelection((current) => {
        if (!current) return null;

        const { rowIndex, colIndex } = current;
        let newRow = rowIndex;
        let newCol = colIndex;

        switch (direction) {
          case 'up':
            newRow = Math.max(0, rowIndex - 1);
            break;
          case 'down':
            newRow = Math.min(totalRows - 1, rowIndex + 1);
            break;
          case 'left':
            newCol = Math.max(0, colIndex - 1);
            break;
          case 'right':
            newCol = Math.min(totalCols - 1, colIndex + 1);
            break;
        }

        return { rowIndex: newRow, colIndex: newCol };
      });
    },
    [totalRows, totalCols]
  );

  return {
    selection,
    selectCell,
    clearSelection,
    moveSelection,
  };
}

// ============================================================
// useKeyboard 훅
// ============================================================

interface KeyboardHandlers {
  onArrowUp?: () => boolean;
  onArrowDown?: () => boolean;
  onArrowLeft?: () => boolean;
  onArrowRight?: () => boolean;
  onTab?: (shiftKey: boolean) => boolean;
  onEnter?: (shiftKey: boolean) => boolean;
  onEscape?: () => boolean;
}

function useKeyboard(handlers: KeyboardHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, shiftKey } = event;

      const call = (fn: (() => boolean) | undefined) => (fn ? fn() : false);
      const callWithShift = (fn: ((shift: boolean) => boolean) | undefined) =>
        fn ? fn(shiftKey) : false;

      let handled = false;

      switch (key) {
        case 'ArrowUp':
          handled = call(handlers.onArrowUp);
          break;
        case 'ArrowDown':
          handled = call(handlers.onArrowDown);
          break;
        case 'ArrowLeft':
          handled = call(handlers.onArrowLeft);
          break;
        case 'ArrowRight':
          handled = call(handlers.onArrowRight);
          break;
        case 'Tab':
          handled = callWithShift(handlers.onTab);
          break;
        case 'Enter':
          handled = callWithShift(handlers.onEnter);
          break;
        case 'Escape':
          handled = call(handlers.onEscape);
          break;
      }

      // 기본 동작은 "정말 우리가 처리한 경우"에만 막는다.
      // (예: selection이 없을 때는 Tab으로 포커스를 빠져나갈 수 있어야 한다)
      if (handled) event.preventDefault();
    },
    [handlers]
  );

  return { handleKeyDown };
}

// ============================================================
// Cell 컴포넌트
// ============================================================

interface CellProps {
  value: string | number;
  isSelected?: boolean;
  onClick?: () => void;
}

function Cell({ value, isSelected = false, onClick }: CellProps) {
  const displayValue = value === '' ? '\u00A0' : value;

  const className = [
    styles.cell,
    isSelected && styles.selected,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onClick={onClick}
      role="gridcell"
      aria-selected={isSelected}
    >
      {displayValue}
    </div>
  );
}

// ============================================================
// Row 컴포넌트
// ============================================================

interface RowProps {
  cells: CellData[];
  rowIndex: number;
  selection?: Selection;
  onCellClick?: (rowIndex: number, colIndex: number) => void;
}

function Row({ cells, rowIndex, selection, onCellClick }: RowProps) {
  return (
    <div className={styles.row} role="row">
      {cells.map((cell, colIndex) => {
        const isSelected =
          selection?.rowIndex === rowIndex && selection?.colIndex === colIndex;

        return (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell.value}
            isSelected={isSelected}
            onClick={() => onCellClick?.(rowIndex, colIndex)}
          />
        );
      })}
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
  const gridRef = useRef<HTMLDivElement>(null);

  const maxColumns = Math.max(...data.rows.map((row) => row.cells.length), 0);

  const { selection, selectCell, clearSelection, moveSelection } = useSelection(
    data.rows.length,
    maxColumns
  );

  const { handleKeyDown } = useKeyboard({
    onArrowUp: () => {
      if (!selection) return false;
      moveSelection('up');
      return true;
    },
    onArrowDown: () => {
      if (!selection) return false;
      moveSelection('down');
      return true;
    },
    onArrowLeft: () => {
      if (!selection) return false;
      moveSelection('left');
      return true;
    },
    onArrowRight: () => {
      if (!selection) return false;
      moveSelection('right');
      return true;
    },
    onTab: (shiftKey) => {
      if (!selection) return false;
      moveSelection(shiftKey ? 'left' : 'right');
      return true;
    },
    onEnter: (shiftKey) => {
      if (!selection) return false;
      moveSelection(shiftKey ? 'up' : 'down');
      return true;
    },
    onEscape: () => {
      // selection 모드를 종료하고, Tab으로 페이지 내 다른 요소로 이동할 수 있게 한다.
      if (!selection) return false;
      clearSelection();
      gridRef.current?.blur();
      return true;
    },
  });

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    const element = gridRef.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return () => element.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    selectCell({ rowIndex, colIndex });
    // 클릭 후 그리드에 포커스
    gridRef.current?.focus();
  };

  const columnHeaders = Array.from({ length: maxColumns }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div
      ref={gridRef}
      className={styles.grid}
      tabIndex={0}
      role="grid"
      aria-rowcount={data.rows.length}
      aria-colcount={maxColumns}
    >
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
          <Row
            cells={row.cells}
            rowIndex={rowIndex}
            selection={selection}
            onCellClick={handleCellClick}
          />
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
// SelectionDemo (메인 export)
// ============================================================

export function SelectionDemo() {
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
      <div className={styles.instructions}>
        <p className={styles.hint}>
          ↑ 셀을 클릭한 뒤 방향키(↑↓←→), Tab, Enter로 선택을 이동할 수 있습니다.
        </p>
        <p className={styles.hint}>
          선택된 셀은 파란색 테두리로 강조됩니다.
        </p>
        <p className={styles.hint}>Esc로 선택을 해제하고 포커스를 빠져나갈 수 있습니다.</p>
      </div>
    </div>
  );
}

