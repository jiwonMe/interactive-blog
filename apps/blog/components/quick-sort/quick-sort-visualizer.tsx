'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Step } from './types';
import { generateSteps } from './logic';

export const QuickSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([50, 25, 90, 10, 35, 80, 60, 15]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setSteps(generateSteps(array));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const reset = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setSteps(generateSteps(newArray));
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const current = steps[currentStep] || { 
    array, 
    pivotIndex: null, 
    compareIndices: [], 
    swapIndices: [],
    sortedIndices: [],
    description: '준비' 
  };

  const getBarColor = (index: number) => {
    if (current.sortedIndices.includes(index) || (currentStep === steps.length - 1)) return '#10b981'; // emerald-500
    if (index === current.pivotIndex) return '#f59e0b'; // amber-500
    if (current.swapIndices.includes(index)) return '#ef4444'; // red-500
    if (current.compareIndices.includes(index)) return '#3b82f6'; // blue-500
    return '#e5e7eb'; // gray-200
  };

  return (
    <div 
      className={cn(
        /* Layout */
        "flex flex-col items-center gap-4 w-full",
        /* Appearance */
        "p-8 bg-white border border-gray-200 rounded-lg"
      )}
    >
      <div 
        className={cn(
          /* Layout */
          "h-10 flex items-center justify-center text-center"
        )}
      >
        <p 
          className={cn(
            /* Typography */
            "text-sm text-gray-600"
          )}
        >
          {current.description}
        </p>
      </div>

      <div 
        className={cn(
          /* Layout */
          "flex items-end justify-center gap-1 w-full h-[200px] p-4"
        )}
      >
        <AnimatePresence>
          {current.array.map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                /* Layout */
                "flex-1 flex flex-col items-center justify-end max-w-[40px]"
              )}
            >
              <motion.div
                style={{ 
                  height: `${value * 2}px`,
                  backgroundColor: getBarColor(index) 
                }}
                animate={{ backgroundColor: getBarColor(index) }}
                className={cn(
                  /* Appearance */
                  "w-full rounded-sm"
                )}
              />
              <span 
                className={cn(
                  /* Typography */
                  "text-xs mt-1 text-gray-500 font-semibold"
                )}
              >
                {value}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div 
        className={cn(
          /* Layout */
          "flex gap-4"
        )}
      >
        <LegendItem color="#f59e0b" label="피벗" />
        <LegendItem color="#3b82f6" label="비교" />
        <LegendItem color="#ef4444" label="교환" />
        <LegendItem color="#10b981" label="완료" />
      </div>

      <div 
        className={cn(
          /* Layout */
          "flex gap-3 mt-4"
        )}
      >
        <Button onClick={reset}>새로운 배열</Button>
        <Button 
          onClick={() => {
            if(currentStep > 0) {
              setIsPlaying(false);
              setCurrentStep(prev => prev - 1);
            }
          }} 
          disabled={currentStep === 0}
        >
          이전
        </Button>
        <Button 
          variant="primary" 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '일시정지' : currentStep >= steps.length - 1 ? '다시 시작' : '재생'}
        </Button>
        <Button 
          onClick={() => {
            if(currentStep < steps.length - 1) {
              setIsPlaying(false);
              setCurrentStep(prev => prev + 1);
            }
          }} 
          disabled={currentStep === steps.length - 1}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div 
    className={cn(
      /* Layout */
      "flex items-center gap-2",
      /* Typography */
      "text-xs text-gray-500"
    )}
  >
    <span 
      style={{ backgroundColor: color }}
      className={cn(
        /* Appearance */
        "block w-3 h-3 rounded-sm"
      )}
    />
    {label}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = ({ variant = 'secondary', className, ...props }: ButtonProps) => (
  <button
    className={cn(
      /* Layout */
      "px-4 py-2",
      /* Appearance */
      "rounded-md transition-all",
      /* Typography */
      "text-sm font-semibold",
      /* Variants */
      variant === 'primary' 
        ? "bg-blue-600 text-white hover:bg-blue-700" 
        : "bg-gray-100 text-gray-900 hover:bg-gray-200",
      /* Disabled */
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
);

