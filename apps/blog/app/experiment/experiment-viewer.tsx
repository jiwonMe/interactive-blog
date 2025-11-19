"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ControlType } from "./registry";

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
      <div className="w-full flex flex-col items-center justify-center py-10">
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
          className="fixed top-24 right-6 z-50 bg-white/90 backdrop-blur-md rounded-lg border border-gray-200 shadow-lg overflow-hidden max-h-[calc(100vh-120px)] flex flex-col"
          initial={false}
          animate={{ 
            width: isControlsOpen ? '280px' : '40px',
            height: isControlsOpen ? 'auto' : '40px'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-2 flex items-center justify-between border-b border-gray-100 bg-gray-50/80">
            {isControlsOpen && (
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Controls</span>
            )}
            <button 
              onClick={() => setIsControlsOpen(!isControlsOpen)}
              className="p-1.5 hover:bg-white rounded-md text-gray-500 transition-colors ml-auto"
              title={isControlsOpen ? "Collapse" : "Expand controls"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isControlsOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" /> // X icon
                ) : (
                  <path d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3 6h1.5M3 12h1.5M3 18h1.5" /> // List icon
                )}
              </svg>
            </button>
          </div>

          {isControlsOpen && (
            <div className="p-4 space-y-5 overflow-y-auto">
              {Object.entries(controls).map(([key, control]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={key} className="text-xs font-semibold text-gray-600">
                      {control.label}
                    </label>
                    {control.type === 'number' && (
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1 rounded">{values[key]}</span>
                    )}
                  </div>

                  {/* Text Input */}
                  {control.type === 'text' && (
                    <input
                      type="text"
                      id={key}
                      value={values[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 block mt-2"
                    />
                  )}

                  {/* Boolean Toggle */}
                  {control.type === 'boolean' && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleChange(key, !values[key])}
                        className={`
                          relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1
                          ${values[key] ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm
                            ${values[key] ? 'translate-x-4' : 'translate-x-1'}
                          `}
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
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
