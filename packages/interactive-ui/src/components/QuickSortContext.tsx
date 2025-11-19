'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type QuickSortContextType = {
  array: number[];
  setArray: (arr: number[]) => void;
  pivotIndex: number | null;
  setPivotIndex: (index: number | null) => void;
};

const QuickSortContext = createContext<QuickSortContextType | undefined>(undefined);

export function useQuickSortContext() {
  const context = useContext(QuickSortContext);
  if (!context) {
    // Context가 없으면 기본값 사용 (독립적으로 동작)
    return {
      array: [50, 25, 90, 10, 35, 80, 60, 15],
      setArray: () => {},
      pivotIndex: null,
      setPivotIndex: () => {},
    };
  }
  return context;
}

export function QuickSortProvider({ children, initialArray }: { children: ReactNode; initialArray?: number[] }) {
  const [array, setArray] = useState<number[]>(initialArray || [50, 25, 90, 10, 35, 80, 60, 15]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);

  return (
    <QuickSortContext.Provider value={{ array, setArray, pivotIndex, setPivotIndex }}>
      {children}
    </QuickSortContext.Provider>
  );
}

