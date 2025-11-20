'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useCommandPatternContext } from './context';

export const CommandHistory = () => {
  const {
    setLightOn,
    history,
    historyIndex,
    setHistoryIndex,
    setHistory,
  } = useCommandPatternContext();

  const executeToIndex = (targetIndex: number) => {
    let currentState = false;
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
    <div 
      className={cn(
        /* Layout */
        "flex flex-col gap-4",
        /* Appearance */
        "p-6 border rounded-lg shadow-sm",
        /* Light */
        "bg-white border-gray-200",
        /* Dark */
        "dark:bg-slate-900 dark:border-slate-800"
      )}
    >
      <div>
        <h3 
          className={cn(
            /* Typography */
            "text-lg font-semibold m-0",
            /* Light */
            "text-gray-900",
            /* Dark */
            "dark:text-gray-100"
          )}
        >
          명령 히스토리
        </h3>
        <p 
          className={cn(
            /* Typography */
            "text-sm mt-1 leading-relaxed",
            /* Light */
            "text-gray-500",
            /* Dark */
            "dark:text-gray-400"
          )}
        >
          CommandExecutor에서 실행한 명령들이 여기에 표시됩니다. 히스토리 아이템을 클릭하여 특정 시점으로 이동할 수 있습니다.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <motion.button
          onClick={clearHistory}
          disabled={history.length === 0}
          whileHover={{ scale: history.length > 0 ? 1.05 : 1 }}
          whileTap={{ scale: history.length > 0 ? 0.95 : 1 }}
          className={cn(
            /* Layout */
            "px-4 py-2 flex items-center justify-center",
            /* Appearance */
            "bg-red-500 text-white rounded-md border-none",
            /* Typography */
            "text-sm font-semibold",
            /* Disabled */
            "disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
          )}
        >
          히스토리 초기화
        </motion.button>
      </div>

      {history.length === 0 ? (
        <div 
          className={cn(
            /* Layout */
            "flex flex-col items-center justify-center p-8",
            /* Typography */
            "text-base",
            /* Light */
            "text-gray-500",
            /* Dark */
            "dark:text-gray-400"
          )}
        >
          <div>명령 히스토리가 비어있습니다.</div>
          <div className="text-sm mt-2">
            위 버튼을 클릭하여 명령을 추가해보세요.
          </div>
        </div>
      ) : (
        <div 
          className={cn(
            /* Layout */
            "flex flex-col gap-2 max-h-[300px] overflow-y-auto p-2"
          )}
        >
          <AnimatePresence>
            {history.map((cmd, index) => (
              <motion.div
                key={cmd.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={() => executeToIndex(index)}
                className={cn(
                  /* Layout */
                  "flex items-center gap-3 px-4 py-3 cursor-pointer",
                  /* Appearance */
                  "rounded-md border transition-all",
                  /* Light */
                  "bg-gray-100 border-gray-200",
                  "hover:bg-gray-200 hover:border-blue-500",
                  /* Dark */
                  "dark:bg-slate-800 dark:border-slate-700",
                  "dark:hover:bg-slate-700 dark:hover:border-blue-500",
                  /* Active State */
                  index === historyIndex && "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500"
                )}
              >
                <div 
                  className={cn(
                    /* Layout */
                    "flex items-center justify-center min-w-[32px] h-8",
                    /* Appearance */
                    "rounded",
                    /* Light */
                    "bg-white text-gray-500",
                    /* Dark */
                    "dark:bg-slate-700 dark:text-gray-300",
                    /* Typography */
                    "text-sm font-semibold"
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <div className={cn(
                    "text-sm font-semibold",
                    "text-gray-900 dark:text-gray-100"
                  )}>
                    {cmd.name}
                  </div>
                  <div className={cn(
                    "text-xs",
                    "text-gray-500 dark:text-gray-400"
                  )}>
                    {cmd.type === 'execute' ? '실행' : '실행 취소'} · {cmd.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {index === historyIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      /* Appearance */
                      "w-2 h-2 rounded-full",
                      "bg-blue-600 dark:bg-blue-400"
                    )}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

