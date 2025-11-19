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

// 제목
const Title = styled('h3', {
  fontSize: '$4',
  fontWeight: 600,
  color: '$text',
  margin: 0,
});

// 설명 텍스트
const Description = styled('p', {
  fontSize: '$3',
  color: '$textSecondary',
  margin: 0,
  lineHeight: 1.6,
});

// 히스토리 리스트
const HistoryList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  maxHeight: '300px',
  overflowY: 'auto',
  padding: '$2',
});

// 히스토리 아이템
const HistoryItem = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  padding: '$3 $4',
  backgroundColor: '$gray100',
  borderRadius: '$2',
  border: '1px solid $border',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '$gray200',
    borderColor: '$primary',
  },
  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '$primary',
      },
    },
  },
});

// 명령 인덱스
const CommandIndex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '32px',
  height: '32px',
  borderRadius: '$1',
  backgroundColor: '$background',
  fontSize: '$2',
  fontWeight: 600,
  color: '$textSecondary',
});

// 명령 정보
const CommandInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  flex: 1,
});

// 명령 이름
const CommandName = styled('div', {
  fontSize: '$3',
  fontWeight: 600,
  color: '$text',
});

// 명령 타입
const CommandType = styled('div', {
  fontSize: '$2',
  color: '$textSecondary',
});

// 실행 버튼
const ExecuteButton = styled(motion.button, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$2 $4',
  borderRadius: '$2',
  backgroundColor: '$primary',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '$2',
  fontWeight: 600,
  outline: 'none',
  '&:hover': {
    backgroundColor: '$primaryHover',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

// 빈 상태
const EmptyState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$8',
  color: '$textSecondary',
  fontSize: '$3',
});

export const CommandHistory = () => {
  const {
    isLightOn,
    setLightOn,
    history,
    historyIndex,
    setHistoryIndex,
    addCommand,
    setHistory,
  } = useCommandPatternContext();

  const executeToIndex = (targetIndex: number) => {
    // 목표 인덱스까지의 모든 명령을 순차적으로 실행하여 상태 복원
    // 초기 상태로 리셋
    let currentState = false;
    
    // 0부터 targetIndex까지 모든 명령 실행
    for (let i = 0; i <= targetIndex; i++) {
      const cmd = history[i];
      if (cmd.name === '불 켜기') {
        currentState = true;
      } else if (cmd.name === '불 끄기') {
        currentState = false;
      }
    }
    
    setLightOn(currentState);
    setHistoryIndex(targetIndex);
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryIndex(-1);
    setLightOn(false);
  };

  return (
    <Container>
      <div>
        <Title>명령 히스토리</Title>
        <Description>
          CommandExecutor에서 실행한 명령들이 여기에 표시됩니다. 히스토리 아이템을 클릭하여 특정 시점으로 이동할 수 있습니다.
        </Description>
      </div>

      <div style={{ display: 'flex', gap: '$3', flexWrap: 'wrap' }}>
        <ExecuteButton
          onClick={clearHistory}
          disabled={history.length === 0}
          whileHover={{ scale: history.length > 0 ? 1.05 : 1 }}
          whileTap={{ scale: history.length > 0 ? 0.95 : 1 }}
          style={{ backgroundColor: '#ef4444' }}
        >
          히스토리 초기화
        </ExecuteButton>
      </div>

      {history.length === 0 ? (
        <EmptyState>
          <div>명령 히스토리가 비어있습니다.</div>
          <div style={{ fontSize: '$2', marginTop: '$2' }}>
            위 버튼을 클릭하여 명령을 추가해보세요.
          </div>
        </EmptyState>
      ) : (
        <HistoryList>
          <AnimatePresence>
            {history.map((cmd, index) => (
              <HistoryItem
                key={cmd.id}
                active={index === historyIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={() => executeToIndex(index)}
              >
                <CommandIndex>{index + 1}</CommandIndex>
                <CommandInfo>
                  <CommandName>{cmd.name}</CommandName>
                  <CommandType>
                    {cmd.type === 'execute' ? '실행' : '실행 취소'} · {cmd.timestamp.toLocaleTimeString()}
                  </CommandType>
                </CommandInfo>
                {index === historyIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--colors-primary)',
                    }}
                  />
                )}
              </HistoryItem>
            ))}
          </AnimatePresence>
        </HistoryList>
      )}
    </Container>
  );
};

