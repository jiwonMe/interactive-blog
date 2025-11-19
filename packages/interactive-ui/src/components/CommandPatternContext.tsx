'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Command {
  id: string;
  name: string;
  type: 'execute' | 'undo';
  timestamp: Date;
}

type CommandPatternContextType = {
  // 조명 상태
  isLightOn: boolean;
  setLightOn: (on: boolean) => void;
  
  // 명령 히스토리
  history: Command[];
  setHistory: (history: Command[]) => void;
  
  // 현재 히스토리 위치
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  
  // 명령 추가 함수
  addCommand: (name: string, type: 'execute' | 'undo') => void;
  
  // 실행 취소/다시 실행 함수
  undo: () => void;
  redo: () => void;
};

const CommandPatternContext = createContext<CommandPatternContextType | undefined>(undefined);

export function useCommandPatternContext() {
  const context = useContext(CommandPatternContext);
  if (!context) {
    // Context가 없으면 기본값 사용 (독립적으로 동작)
    return {
      isLightOn: false,
      setLightOn: () => {},
      history: [],
      setHistory: () => {},
      historyIndex: -1,
      setHistoryIndex: () => {},
      addCommand: () => {},
      undo: () => {},
      redo: () => {},
    };
  }
  return context;
}

export function CommandPatternProvider({ children }: { children: ReactNode }) {
  const [isLightOn, setLightOn] = useState(false);
  const [history, setHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addCommand = (name: string, type: 'execute' | 'undo') => {
    const newCommand: Command = {
      id: Date.now().toString(),
      name,
      type,
      timestamp: new Date(),
    };
    
    // 현재 위치 이후의 명령 제거
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newCommand]);
    setHistoryIndex(newHistory.length);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      const command = history[historyIndex];
      if (command.name === '불 켜기') {
        setLightOn(false);
      } else if (command.name === '불 끄기') {
        setLightOn(true);
      }
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const command = history[nextIndex];
      if (command.name === '불 켜기') {
        setLightOn(true);
      } else if (command.name === '불 끄기') {
        setLightOn(false);
      }
      setHistoryIndex(nextIndex);
    }
  };

  return (
    <CommandPatternContext.Provider
      value={{
        isLightOn,
        setLightOn,
        history,
        setHistory,
        historyIndex,
        setHistoryIndex,
        addCommand,
        undo,
        redo,
      }}
    >
      {children}
    </CommandPatternContext.Provider>
  );
}

