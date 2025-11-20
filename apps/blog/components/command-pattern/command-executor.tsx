'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useCommandPatternContext } from './context';

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
      <div 
        className={cn(
          /* Layout */
          "flex flex-col items-center gap-4",
          /* Appearance */
          "p-6 rounded-md",
          /* Light */
          "bg-gray-100",
          /* Dark */
          "dark:bg-slate-800"
        )}
      >
        <div 
          className={cn(
            /* Layout */
            "relative w-[120px] h-[120px] flex items-center justify-center"
          )}
        >
          <motion.div
            animate={{
              scale: isLightOn ? [1, 1.1, 1] : 1,
              backgroundColor: isLightOn ? '#fef3c7' : 'var(--bg-bulb-off)',
              borderColor: isLightOn ? '#f59e0b' : 'var(--border-bulb-off)',
              color: isLightOn ? '#92400e' : 'var(--text-bulb-off)',
              boxShadow: isLightOn ? '0 0 30px rgba(245, 158, 11, 0.6)' : 'none',
            }}
            style={{
              '--bg-bulb-off': '#f3f4f6', // gray-100
              '--border-bulb-off': '#d1d5db', // gray-300
              '--text-bulb-off': '#9ca3af', // gray-400
            } as any}
            transition={{ duration: 0.3 }}
            className={cn(
              /* Layout */
              "w-20 h-20 flex items-center justify-center",
              /* Appearance */
              "rounded-full border-4 text-4xl font-bold",
              /* Dark overrides via CSS variables or class if needed, but motion style handles colors */
              /* We use CSS variables for motion animation values to support dark mode if we could, 
                 but framer-motion interpolates colors. For simplicity, let's keep light mode colors for the bulb off state
                 or we need to use current theme to set these values.
                 Let's use CSS classes for the off state structure and motion for the animation.
               */
            )}
          >
            {isLightOn ? '💡' : '⚫'}
          </motion.div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isLightOn ? 'on' : 'off'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              /* Typography */
              "text-lg font-semibold mt-2",
              /* Colors */
              isLightOn ? "text-amber-800 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {isLightOn ? '켜짐' : '꺼짐'}
          </motion.div>
        </AnimatePresence>
      </div>

      <div 
        className={cn(
          /* Layout */
          "flex gap-3 justify-center flex-wrap"
        )}
      >
        <Button
          variant="primary"
          onClick={handleTurnOn}
          disabled={isLightOn}
        >
          불 켜기
        </Button>
        <Button
          variant="secondary"
          onClick={handleTurnOff}
          disabled={!isLightOn}
        >
          불 끄기
        </Button>
        <Button
          variant="danger"
          onClick={undo}
          disabled={!canUndo}
        >
          실행 취소 (Undo)
        </Button>
        <Button
          variant="success"
          onClick={redo}
          disabled={!canRedo}
        >
          다시 실행 (Redo)
        </Button>
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

const Button = ({ variant = 'secondary', className, disabled, ...props }: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";
      case 'danger': return "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500";
      case 'success': return "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500";
      default: return "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      className={cn(
        /* Layout */
        "flex items-center justify-center gap-2 px-5 py-3",
        /* Appearance */
        "rounded-md transition-all outline-none",
        /* Typography */
        "text-sm font-semibold",
        /* Variant */
        getVariantClasses(),
        /* Disabled */
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
};

