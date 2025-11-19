"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ExperimentViewer({ children }: { children: React.ReactNode }) {
  const [isCardView, setIsCardView] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div 
        className={`
          w-full flex items-center justify-center transition-all duration-300 ease-in-out
          ${isCardView 
            ? 'bg-white rounded-xl shadow-sm border border-gray-200 p-12 min-h-[400px]' 
            : 'bg-transparent p-0 min-h-[200px]'
          }
        `}
        layout
      >
        {children}
      </motion.div>

      {/* Toggle Control */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md pl-4 pr-2 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-colors">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Card Background</span>
        <button
          onClick={() => setIsCardView(!isCardView)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isCardView ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span className="sr-only">Toggle card background</span>
          <motion.span
            layout
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
              ${isCardView ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
}

