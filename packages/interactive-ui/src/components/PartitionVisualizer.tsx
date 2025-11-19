'use client';

import React, { useState, useEffect } from 'react';
import { styled } from '../stitches.config';
import { motion } from 'framer-motion';
import { useQuickSortContext } from './QuickSortContext';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',
  padding: '$6',
  backgroundColor: '$background',
  border: '1px solid $border',
  borderRadius: '$3',
  width: '100%',
});

const ArrayDisplay = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
});

const Element = styled(motion.div, {
  padding: '$2 $4',
  borderRadius: '$2',
  fontSize: '$3',
  fontWeight: 600,
  minWidth: '48px',
  textAlign: 'center',
  border: '2px solid',
});

const Button = styled('button', {
  padding: '$2 $4',
  borderRadius: '$2',
  border: 'none',
  cursor: 'pointer',
  fontSize: '$2',
  fontWeight: 600,
  backgroundColor: '$primary',
  color: 'white',
  '&:hover': { backgroundColor: '$primaryHover' },
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

type Step = {
  array: number[];
  compareIndex: number | null;
  swapIndices: number[];
  description: string;
};

function generatePartitionSteps(arr: number[], pivotIndex: number): Step[] {
  const steps: Step[] = [];
  const tempArray = [...arr];
  const pivot = tempArray[pivotIndex];
  
  steps.push({
    array: [...tempArray],
    compareIndex: null,
    swapIndices: [],
    description: `초기 상태: 피벗은 ${pivot}입니다.`,
  });

  let i = -1;
  
  for (let j = 0; j < tempArray.length; j++) {
    if (j === pivotIndex) continue; // 피벗은 건너뛰기
    
    steps.push({
      array: [...tempArray],
      compareIndex: j,
      swapIndices: [],
      description: `${tempArray[j]}와 피벗 ${pivot}을 비교합니다.`,
    });

    if (tempArray[j] < pivot) {
      i++;
      if (i === pivotIndex) i++; // 피벗 위치는 건너뛰기
      
      if (i !== j) {
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
        steps.push({
          array: [...tempArray],
          compareIndex: j,
          swapIndices: [i, j],
          description: `${tempArray[i]}가 피벗보다 작으므로 작은 영역으로 이동합니다.`,
        });
      }
    }
  }
  
  // 피벗을 최종 위치로 이동
  const finalPos = i + 1;
  if (finalPos !== pivotIndex) {
    [tempArray[finalPos], tempArray[pivotIndex]] = [tempArray[pivotIndex], tempArray[finalPos]];
    steps.push({
      array: [...tempArray],
      compareIndex: null,
      swapIndices: [finalPos, pivotIndex],
      description: `피벗 ${pivot}을 최종 위치로 이동합니다. 분할 완료!`,
    });
  } else {
    steps.push({
      array: [...tempArray],
      compareIndex: null,
      swapIndices: [],
      description: `피벗 ${pivot}이 이미 올바른 위치에 있습니다. 분할 완료!`,
    });
  }

  return steps;
}

export const PartitionVisualizer = () => {
  const { array: contextArray, pivotIndex: contextPivotIndex } = useQuickSortContext();
  const [step, setStep] = useState(0);
  
  // Context에서 배열과 피벗을 가져오거나 기본값 사용
  const array = contextArray.length > 0 ? contextArray : [50, 25, 90, 10, 35, 80, 60, 15];
  const pivotIndex = contextPivotIndex !== null ? contextPivotIndex : array.length - 1;
  
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const newSteps = generatePartitionSteps(array, pivotIndex);
    setSteps(newSteps);
    setStep(0);
  }, [array, pivotIndex]);

  if (steps.length === 0) {
    return <Container>준비 중...</Container>;
  }

  const current = steps[step] || steps[0];
  const currentPivotIndex = current.array.findIndex((val, idx) => 
    idx === pivotIndex || (step === steps.length - 1 && val === array[pivotIndex])
  );

  const getElementColor = (index: number) => {
    const currentPivotPos = current.array.indexOf(array[pivotIndex]);
    if (index === currentPivotPos) return '#f59e0b'; // 피벗 - 노란색
    if (current.compareIndex === index) return '#3b82f6'; // 비교 중 - 파란색
    if (current.swapIndices.includes(index)) return '#ef4444'; // 교환 - 빨간색
    if (step === steps.length - 1 && index <= currentPivotPos) return '#10b981'; // 정렬된 영역 - 초록색
    return '#e5e7eb'; // 기본 - 회색
  };

  return (
    <Container>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>
          {current.description}
        </p>
      </div>
      
      <ArrayDisplay>
        {current.array.map((value, index) => (
          <Element
            key={`${index}-${value}-${step}`}
            layout
            style={{
              backgroundColor: getElementColor(index),
              color: getElementColor(index) !== '#e5e7eb' ? 'white' : '#111827',
              borderColor: getElementColor(index),
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {value}
          </Element>
        ))}
      </ArrayDisplay>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          이전
        </Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}>
          다음
        </Button>
        <Button onClick={() => setStep(0)}>
          처음부터
        </Button>
      </div>
    </Container>
  );
};
