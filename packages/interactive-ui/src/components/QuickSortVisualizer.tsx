'use client';

import React, { useState, useEffect, useRef } from 'react';
import { styled } from '../stitches.config';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',
  padding: '$8',
  backgroundColor: '$background',
  border: '1px solid $border',
  borderRadius: '$3',
  width: '100%',
});

const BarsContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: '4px',
  height: '200px',
  width: '100%',
  padding: '$4',
});

const BarWrapper = styled(motion.div, {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  maxWidth: '40px',
});

const Bar = styled(motion.div, {
  width: '100%',
  borderRadius: '$1',
  backgroundColor: '$gray200',
});

const ValueLabel = styled('span', {
  fontSize: '12px',
  marginTop: '4px',
  color: '$textSecondary',
  fontWeight: 600,
});

const Controls = styled('div', {
  display: 'flex',
  gap: '$3',
  marginTop: '$4',
});

const Button = styled('button', {
  padding: '$2 $4',
  borderRadius: '$2',
  border: 'none',
  cursor: 'pointer',
  fontSize: '$2',
  fontWeight: 600,
  transition: 'all 0.2s',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        '&:hover': { backgroundColor: '$primaryHover' },
      },
      secondary: {
        backgroundColor: '$gray100',
        color: '$text',
        '&:hover': { backgroundColor: '$gray200' },
      },
    },
  },
  defaultVariants: {
    variant: 'secondary',
  },
});

const Legend = styled('div', {
  display: 'flex',
  gap: '$4',
  fontSize: '$1',
  color: '$textSecondary',
});

const LegendItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  '&::before': {
    content: '""',
    display: 'block',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    backgroundColor: 'var(--color)',
  },
});

type Step = {
  array: number[];
  pivotIndex: number | null;
  compareIndices: number[];
  swapIndices: number[];
  sortedIndices: number[];
  description: string;
};

export const QuickSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([50, 25, 90, 10, 35, 80, 60, 15]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Generate steps for quick sort
  const generateSteps = (arr: number[]) => {
    const newSteps: Step[] = [];
    const tempArray = [...arr];
    
    const partition = (low: number, high: number) => {
      const pivot = tempArray[high];
      let i = low - 1;
      
      newSteps.push({
        array: [...tempArray],
        pivotIndex: high,
        compareIndices: [],
        swapIndices: [],
        sortedIndices: [],
        description: `피벗으로 ${pivot}을 선택합니다.`,
      });

      for (let j = low; j < high; j++) {
        newSteps.push({
          array: [...tempArray],
          pivotIndex: high,
          compareIndices: [j],
          swapIndices: [],
          sortedIndices: [],
          description: `${tempArray[j]}와 피벗 ${pivot}을 비교합니다.`,
        });

        if (tempArray[j] < pivot) {
          i++;
          // Swap
          [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
          newSteps.push({
            array: [...tempArray],
            pivotIndex: high,
            compareIndices: [j],
            swapIndices: [i, j],
            sortedIndices: [],
            description: `${tempArray[i]}가 피벗보다 작으므로 교환합니다.`,
          });
        }
      }
      
      [tempArray[i + 1], tempArray[high]] = [tempArray[high], tempArray[i + 1]];
      newSteps.push({
        array: [...tempArray],
        pivotIndex: i + 1,
        compareIndices: [],
        swapIndices: [i + 1, high],
        sortedIndices: [i + 1],
        description: `피벗 ${pivot}을 정렬된 위치로 이동합니다.`,
      });
      
      return i + 1;
    };

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        
        // Add sorted indices for visualization context
        const lastStep = newSteps[newSteps.length - 1];
        if(lastStep) {
            // Accumulate sorted indices logically (simplified visualization)
        }

        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    quickSort(0, tempArray.length - 1);
    
    // Final step - all sorted
    newSteps.push({
      array: [...tempArray],
      pivotIndex: null,
      compareIndices: [],
      swapIndices: [],
      sortedIndices: tempArray.map((_, i) => i),
      description: '정렬이 완료되었습니다.',
    });

    return newSteps;
  };

  useEffect(() => {
    setSteps(generateSteps(array));
  }, []); // Run once on mount

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
    if (current.sortedIndices.includes(index) || (currentStep === steps.length - 1)) return '#10b981'; // Green (Sorted)
    if (index === current.pivotIndex) return '#f59e0b'; // Yellow (Pivot)
    if (current.swapIndices.includes(index)) return '#ef4444'; // Red (Swap)
    if (current.compareIndices.includes(index)) return '#3b82f6'; // Blue (Compare)
    return '#e5e7eb'; // Gray (Default)
  };

  return (
    <Container>
      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#4b5563' }}>
          {current.description}
        </p>
      </div>

      <BarsContainer>
        <AnimatePresence>
          {current.array.map((value, index) => (
            <BarWrapper key={`${index}-${value}`} layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <Bar
                style={{ 
                  height: `${value * 2}px`,
                  backgroundColor: getBarColor(index) 
                }}
                animate={{ backgroundColor: getBarColor(index) }}
              />
              <ValueLabel>{value}</ValueLabel>
            </BarWrapper>
          ))}
        </AnimatePresence>
      </BarsContainer>

      <Legend>
        <LegendItem style={{ '--color': '#f59e0b' } as any}>피벗</LegendItem>
        <LegendItem style={{ '--color': '#3b82f6' } as any}>비교</LegendItem>
        <LegendItem style={{ '--color': '#ef4444' } as any}>교환</LegendItem>
        <LegendItem style={{ '--color': '#10b981' } as any}>완료</LegendItem>
      </Legend>

      <Controls>
        <Button onClick={reset}>새로운 배열</Button>
        <Button onClick={() => {
            if(currentStep > 0) {
                setIsPlaying(false);
                setCurrentStep(prev => prev - 1);
            }
        }} disabled={currentStep === 0}>이전</Button>
        <Button 
          variant="primary" 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '일시정지' : currentStep >= steps.length - 1 ? '다시 시작' : '재생'}
        </Button>
        <Button onClick={() => {
            if(currentStep < steps.length - 1) {
                setIsPlaying(false);
                setCurrentStep(prev => prev + 1);
            }
        }} disabled={currentStep === steps.length - 1}>다음</Button>
      </Controls>
    </Container>
  );
};

