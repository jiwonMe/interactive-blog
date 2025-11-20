'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useQuickSortContext } from './context';
import { generatePartitionSteps } from './logic';
import { PartitionStep } from './types';
import { useTheme } from 'next-themes';

export const PartitionVisualizer = () => {
  const { array: contextArray, pivotIndex: contextPivotIndex } = useQuickSortContext();
  const [step, setStep] = useState(0);
  const { theme } = useTheme();
  
  // Context에서 배열과 피벗을 가져오거나 기본값 사용
  const array = contextArray.length > 0 ? contextArray : [50, 25, 90, 10, 35, 80, 60, 15];
  const pivotIndex = contextPivotIndex !== null ? contextPivotIndex : array.length - 1;
  
  const [steps, setSteps] = useState<PartitionStep[]>([]);

  useEffect(() => {
    const newSteps = generatePartitionSteps(array, pivotIndex);
    setSteps(newSteps);
    setStep(0);
  }, [array, pivotIndex]);

  if (steps.length === 0) {
    return <div className="p-6 text-center text-gray-500">준비 중...</div>;
  }

  const current = steps[step] || steps[0];
  
  const getElementColor = (index: number) => {
    const currentPivotPos = current.array.indexOf(array[pivotIndex]);
    if (index === currentPivotPos) return '#f59e0b'; // 피벗 - 노란색
    if (current.compareIndex === index) return '#3b82f6'; // 비교 중 - 파란색
    if (current.swapIndices.includes(index)) return '#ef4444'; // 교환 - 빨간색
    if (step === steps.length - 1 && index <= currentPivotPos) return '#10b981'; // 정렬된 영역 - 초록색
    return theme === 'dark' ? '#334155' : '#e5e7eb'; // 기본 - 회색
  };

  const getTextColor = (index: number) => {
     const color = getElementColor(index);
     return (color !== '#e5e7eb' && color !== '#334155') ? 'white' : (theme === 'dark' ? '#f1f5f9' : '#111827');
  };

  return (
    <div 
      className={cn(
        /* Layout */
        "flex flex-col items-center gap-4 w-full",
        /* Appearance */
        "p-6 border rounded-lg",
        /* Light */
        "bg-white border-gray-200",
        /* Dark */
        "dark:bg-slate-900 dark:border-slate-800"
      )}
    >
      <div className="text-center mb-2">
        <p 
          className={cn(
            /* Typography */
            "text-sm font-medium",
            /* Light */
            "text-gray-600",
            /* Dark */
            "dark:text-gray-400"
          )}
        >
          {current.description}
        </p>
      </div>
      
      <div 
        className={cn(
          /* Layout */
          "flex gap-2 items-center justify-center flex-wrap"
        )}
      >
        {current.array.map((value, index) => (
          <motion.div
            key={`${index}-${value}-${step}`}
            layout
            style={{
              backgroundColor: getElementColor(index),
              color: getTextColor(index),
              borderColor: getElementColor(index),
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              /* Layout */
              "px-4 py-2 min-w-[48px] text-center",
              /* Appearance */
              "rounded-md border-2",
              /* Typography */
              "text-sm font-semibold"
            )}
          >
            {value}
          </motion.div>
        ))}
      </div>

      <div 
        className={cn(
          /* Layout */
          "flex gap-2 mt-4"
        )}
      >
        <Button 
          onClick={() => setStep(Math.max(0, step - 1))} 
          disabled={step === 0}
        >
          이전
        </Button>
        <Button 
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))} 
          disabled={step === steps.length - 1}
        >
          다음
        </Button>
        <Button onClick={() => setStep(0)}>
          처음부터
        </Button>
      </div>
    </div>
  );
};

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      /* Layout */
      "px-4 py-2",
      /* Appearance */
      "rounded-md",
      /* Light */
      "bg-blue-600 text-white hover:bg-blue-700",
      /* Dark */
      "dark:bg-blue-600 dark:hover:bg-blue-500",
      /* Typography */
      "text-sm font-semibold",
      /* Disabled */
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-slate-700",
      className
    )}
    {...props}
  />
);

