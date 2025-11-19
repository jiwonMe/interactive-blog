'use client';

import React, { useState } from 'react';
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
  border: '2px solid transparent',
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
    <Container>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>
          배열에서 피벗을 선택해보세요
        </p>
      </div>
      
      <ArrayDisplay>
        {array.map((value, index) => (
          <Element
            key={index}
            onClick={() => handleSelect(index)}
            style={{
              backgroundColor: selectedIndex === index ? '#f59e0b' : '#e5e7eb',
              color: selectedIndex === index ? 'white' : '#111827',
              cursor: 'pointer',
              borderColor: selectedIndex === index ? '#f59e0b' : 'transparent',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {value}
          </Element>
        ))}
      </ArrayDisplay>

      {showExplanation && selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#374151',
            textAlign: 'center',
          }}
        >
          <strong>피벗: {array[selectedIndex]}</strong>
          <br />
          이 값을 기준으로 배열을 두 부분으로 나눕니다.
          <br />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            일반적으로 마지막 요소를 피벗으로 선택합니다.
          </span>
        </motion.div>
      )}

      <Button onClick={() => {
        const lastIndex = array.length - 1;
        setSelectedIndex(lastIndex);
        setPivotIndex(lastIndex);
        setShowExplanation(true);
        if (!propArray && contextArray.length === 0) {
          setArray(array);
        }
      }}>
        표준 방법: 마지막 요소 선택
      </Button>
    </Container>
  );
};

