'use client';

import React from 'react';
import { styled } from '../stitches.config';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandPatternContext } from './CommandPatternContext';

// 컨테이너 스타일
const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  padding: '$6',
  backgroundColor: '$background',
  border: '1px solid $border',
  borderRadius: '$3',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
});

// 조명 영역 스타일
const LightArea = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',
  padding: '$6',
  backgroundColor: '$gray100',
  borderRadius: '$2',
});

// 조명 래퍼
const LightWrapper = styled('div', {
  position: 'relative',
  width: '120px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// 조명 전구
const LightBulb = styled(motion.div, {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  border: '3px solid $gray300',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  position: 'relative',
  variants: {
    state: {
      on: {
        backgroundColor: '#fef3c7',
        borderColor: '#f59e0b',
        boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
        color: '#92400e',
      },
      off: {
        backgroundColor: '#f3f4f6',
        borderColor: '$gray300',
        boxShadow: 'none',
        color: '$textSecondary',
      },
    },
  },
});

// 상태 텍스트
const StatusText = styled(motion.div, {
  fontSize: '$4',
  fontWeight: 600,
  marginTop: '$2',
  variants: {
    state: {
      on: {
        color: '#92400e',
      },
      off: {
        color: '$textSecondary',
      },
    },
  },
});

// 버튼 그룹
const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '$3',
  justifyContent: 'center',
  flexWrap: 'wrap',
});

// 버튼 스타일
const Button = styled(motion.button, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  padding: '$3 $5',
  borderRadius: '$2',
  border: '1px solid transparent',
  cursor: 'pointer',
  fontSize: '$3',
  fontWeight: 600,
  outline: 'none',
  transition: 'all 0.2s',
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        '&:hover': {
          backgroundColor: '$primaryHover',
        },
      },
      secondary: {
        backgroundColor: '$gray200',
        color: '$text',
        '&:hover': {
          backgroundColor: '$gray300',
        },
      },
      danger: {
        backgroundColor: '#ef4444',
        color: 'white',
        '&:hover': {
          backgroundColor: '#dc2626',
        },
      },
      success: {
        backgroundColor: '#10b981',
        color: 'white',
        '&:hover': {
          backgroundColor: '#059669',
        },
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: {
    variant: 'secondary',
    disabled: false,
  },
});


export const CommandExecutor = () => {
  const {
    isLightOn,
    setLightOn,
    history,
    historyIndex,
    addCommand,
    undo,
    redo,
  } = useCommandPatternContext();

  const handleTurnOn = () => {
    setLightOn(true);
    addCommand('불 켜기', 'execute');
  };

  const handleTurnOff = () => {
    setLightOn(false);
    addCommand('불 끄기', 'execute');
  };

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <Container>
      <LightArea>
        <LightWrapper>
          <LightBulb
            state={isLightOn ? 'on' : 'off'}
            animate={{
              scale: isLightOn ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            {isLightOn ? '💡' : '⚫'}
          </LightBulb>
        </LightWrapper>
        <AnimatePresence mode="wait">
          <StatusText
            key={isLightOn ? 'on' : 'off'}
            state={isLightOn ? 'on' : 'off'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {isLightOn ? '켜짐' : '꺼짐'}
          </StatusText>
        </AnimatePresence>
      </LightArea>

      <ButtonGroup>
        <Button
          variant="primary"
          onClick={handleTurnOn}
          disabled={isLightOn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          불 켜기
        </Button>
        <Button
          variant="secondary"
          onClick={handleTurnOff}
          disabled={!isLightOn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          불 끄기
        </Button>
        <Button
          variant="danger"
          onClick={undo}
          disabled={!canUndo}
          whileHover={{ scale: canUndo ? 1.05 : 1 }}
          whileTap={{ scale: canUndo ? 0.95 : 1 }}
        >
          실행 취소 (Undo)
        </Button>
        <Button
          variant="success"
          onClick={redo}
          disabled={!canRedo}
          whileHover={{ scale: canRedo ? 1.05 : 1 }}
          whileTap={{ scale: canRedo ? 0.95 : 1 }}
        >
          다시 실행 (Redo)
        </Button>
      </ButtonGroup>

    </Container>
  );
};

