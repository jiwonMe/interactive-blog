"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ControlType } from "./registry";
import { cn } from "../../lib/utils";

type ExperimentViewerProps = {
  render: (props: any) => React.ReactNode;
  controls: Record<string, ControlType>;
};

export function ExperimentViewer({ render, controls }: ExperimentViewerProps) {
  // Initialize state with default values
  const [values, setValues] = useState(() => {
    const defaults: Record<string, any> = {};
    Object.entries(controls).forEach(([key, control]) => {
      defaults[key] = control.defaultValue;
    });
    return defaults;
  });

  const [isControlsOpen, setIsControlsOpen] = useState(true);

  const handleChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const hasControls = Object.keys(controls).length > 0;

  return (
    <div className="relative w-full min-h-[600px]">
      {/* Main Preview Area */}
      <div className={cn(
        "w-full flex flex-col justify-center py-10 transition-all duration-300",
        // CONTROL Panel이 열려있을 때 약간 왼쪽으로 조정
        hasControls && isControlsOpen 
          ? "items-center pl-4 pr-[320px]" 
          : "items-center px-4",
        // 반응형: 모바일에서는 중앙 정렬
        "max-md:items-center max-md:px-4 max-md:pr-4"
      )}>
        <motion.div 
          className="w-full max-w-3xl flex items-center justify-center relative bg-transparent p-4 min-h-[300px]"
          layout
        >
          {/* Render the component with current control values */}
          {render(values)}
        </motion.div>
      </div>

      {/* Compact Fixed Controls Panel (Top Right) */}
      {hasControls && (
        <motion.div 
          className={cn(
            "fixed top-24 right-6 z-50 rounded-lg border shadow-lg overflow-hidden max-h-[calc(100vh-120px)] flex flex-col",
            "bg-white/90 backdrop-blur-md border-zinc-200",
            "dark:bg-zinc-900/90 dark:border-zinc-700"
          )}
          initial={false}
          animate={{ 
            width: isControlsOpen ? '280px' : '40px',
            height: isControlsOpen ? 'auto' : '40px'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div 
            className={cn(
              "p-2 flex items-center justify-between border-b",
              "border-zinc-100 bg-zinc-50/80",
              "dark:border-zinc-800 dark:bg-zinc-800/80"
            )}
          >
            {isControlsOpen && (
              <span 
                className={cn(
                  "text-xs font-bold uppercase tracking-wider ml-2",
                  "text-zinc-500 dark:text-zinc-400"
                )}
              >
                Controls
              </span>
            )}
            <button 
              onClick={() => setIsControlsOpen(!isControlsOpen)}
              className={cn(
                "p-1.5 rounded-md transition-colors ml-auto",
                "hover:bg-white text-zinc-500",
                "dark:hover:bg-zinc-700 dark:text-zinc-400"
              )}
              title={isControlsOpen ? "Collapse" : "Expand controls"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isControlsOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3 6h1.5M3 12h1.5M3 18h1.5" />
                )}
              </svg>
            </button>
          </div>

          {isControlsOpen && (
            <div className="p-4 space-y-5 overflow-y-auto">
              {Object.entries(controls).map(([key, control]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor={key} 
                      className={cn(
                        "text-xs font-semibold",
                        "text-zinc-600 dark:text-zinc-300"
                      )}
                    >
                      {control.label}
                    </label>
                    {control.type === 'number' && (
                      <span 
                        className={cn(
                          "text-[10px] font-mono px-1 rounded",
                          "text-zinc-400 bg-zinc-100",
                          "dark:text-zinc-500 dark:bg-zinc-800"
                        )}
                      >
                        {values[key]}
                      </span>
                    )}
                  </div>

                  {/* Text Input */}
                  {control.type === 'text' && (
                    <textarea
                      id={key}
                      value={values[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={key === 'code' ? 10 : 1}
                      className={cn(
                        "w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono",
                        "bg-white border-zinc-200",
                        "dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200",
                        key === 'code' && "resize-y"
                      )}
                      placeholder={key === 'code' ? '코드를 입력하세요...' : ''}
                    />
                  )}

                  {/* Number Slider */}
                  {control.type === 'number' && (
                    <input
                      type="range"
                      id={key}
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={values[key]}
                      onChange={(e) => handleChange(key, Number(e.target.value))}
                      className={cn(
                        "w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-600 block mt-2",
                        "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    />
                  )}

                  {/* Boolean Toggle */}
                  {control.type === 'boolean' && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleChange(key, !values[key])}
                        className={cn(
                          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1",
                          values[key] 
                            ? "bg-blue-600 dark:bg-blue-500" 
                            : "bg-zinc-200 dark:bg-zinc-700",
                          "focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-zinc-800"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                            values[key] ? 'translate-x-4' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  )}

                  {/* Select Dropdown */}
                  {control.type === 'select' && (
                    <select
                      id={key}
                      value={values[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className={cn(
                        "w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all",
                        "bg-white border-zinc-200",
                        "dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                      )}
                    >
                      {control.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
