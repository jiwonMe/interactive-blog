'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useQuickSortContext } from './context';

type PivotSelectorProps = {
  array?: number[];
};

export const PivotSelector = ({ array: propArray }: PivotSelectorProps) => {
  const { array: contextArray, setArray, setPivotIndex } = useQuickSortContext();
  const array = propArray || contextArray;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setPivotIndex(index);
    setShowExplanation(true);
    // Context에 배열이 없으면 현재 배열을 저장
    if (!propArray && contextArray.length === 0) {
      setArray(array);
    }
  };

  return (
    <div 
      className={cn(
        /* Layout */
        "flex flex-col items-center gap-4 w-full",
        /* Appearance */
        "p-6 bg-white border border-gray-200 rounded-lg"
      )}
    >
      <div className="text-center mb-2">
        <p 
          className={cn(
            /* Typography */
            "text-sm font-medium text-gray-600"
          )}
        >
          배열에서 피벗을 선택해보세요
        </p>
      </div>
      
      <div 
        className={cn(
          /* Layout */
          "flex gap-2 items-center justify-center flex-wrap"
        )}
      >
        {array.map((value, index) => (
          <motion.div
            key={index}
            onClick={() => handleSelect(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              /* Layout */
              "px-4 py-2 min-w-[48px] text-center cursor-pointer",
              /* Appearance */
              "rounded-md border-2",
              /* Typography */
              "text-sm font-semibold",
              /* State styles */
              selectedIndex === index 
                ? "bg-amber-500 text-white border-amber-500" 
                : "bg-gray-200 text-gray-900 border-transparent"
            )}
          >
            {value}
          </motion.div>
        ))}
      </div>

      {showExplanation && selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            /* Layout */
            "mt-4 p-3 text-center",
            /* Appearance */
            "bg-gray-100 rounded-lg",
            /* Typography */
            "text-sm text-gray-700"
          )}
        >
          <strong>피벗: {array[selectedIndex]}</strong>
          <br />
          이 값을 기준으로 배열을 두 부분으로 나눕니다.
          <br />
          <span className="text-xs text-gray-500">
            일반적으로 마지막 요소를 피벗으로 선택합니다.
          </span>
        </motion.div>
      )}

      <button
        onClick={() => {
          const lastIndex = array.length - 1;
          setSelectedIndex(lastIndex);
          setPivotIndex(lastIndex);
          setShowExplanation(true);
          if (!propArray && contextArray.length === 0) {
            setArray(array);
          }
        }}
        className={cn(
          /* Layout */
          "px-4 py-2 mt-2",
          /* Appearance */
          "bg-blue-600 text-white hover:bg-blue-700 rounded-md border-none",
          /* Typography */
          "text-sm font-semibold cursor-pointer"
        )}
      >
        표준 방법: 마지막 요소 선택
      </button>
    </div>
  );
};

