'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------

type StorageMode = 'in-object' | 'fast' | 'dictionary';

interface Property {
  key: string;
  value: number;
  addedAt?: number;
}

interface LogEntry {
  id: number;
  message: React.ReactNode;
  type: 'info' | 'success' | 'warning' | 'error';
}

const PROPERTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  a: { bg: 'bg-blue-100 dark:bg-blue-900/60', text: 'text-blue-700 dark:text-blue-200', border: 'border-blue-300 dark:border-blue-600' },
  b: { bg: 'bg-green-100 dark:bg-green-900/60', text: 'text-green-700 dark:text-green-200', border: 'border-green-300 dark:border-green-600' },
  c: { bg: 'bg-yellow-100 dark:bg-yellow-900/60', text: 'text-yellow-700 dark:text-yellow-200', border: 'border-yellow-300 dark:border-yellow-600' },
  d: { bg: 'bg-purple-100 dark:bg-purple-900/60', text: 'text-purple-700 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-600' },
  e: { bg: 'bg-rose-100 dark:bg-rose-900/60', text: 'text-rose-700 dark:text-rose-200', border: 'border-rose-300 dark:border-rose-600' },
  f: { bg: 'bg-cyan-100 dark:bg-cyan-900/60', text: 'text-cyan-700 dark:text-cyan-200', border: 'border-cyan-300 dark:border-cyan-600' },
};

const IN_OBJECT_SLOTS = 4;
const ALL_PROPS = ['a', 'b', 'c', 'd', 'e', 'f'];

// -----------------------------------------------------------------------------
// Sub Components
// -----------------------------------------------------------------------------

function ModeBadge({ mode, isTransitioning }: { mode: StorageMode; isTransitioning: boolean }) {
  const config = {
    'in-object': { label: 'In-object', color: 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-emerald-950' },
    'fast': { label: 'Fast', color: 'bg-sky-500 dark:bg-sky-400 text-white dark:text-sky-950' },
    'dictionary': { label: 'Slow (Dictionary)', color: 'bg-red-500 dark:bg-red-400 text-white dark:text-red-950' },
  };
  
  return (
    <span className={cn(
      // 레이아웃
      "px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold font-mono",
      // 색상
      config[mode].color,
      // 애니메이션
      "transition-all duration-300",
      isTransitioning && "animate-pulse scale-110"
    )}>
      {config[mode].label}
    </span>
  );
}

function MemorySlot({ 
  index, 
  property, 
  isEmpty,
  isDeleted,
  isNew,
}: { 
  index: number; 
  property?: Property;
  isEmpty?: boolean;
  isDeleted?: boolean;
  isNew?: boolean;
}) {
  const color = property ? PROPERTY_COLORS[property.key] : null;
  
  return (
    <div className={cn(
      // 레이아웃
      "flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs py-1 px-1.5 sm:px-2 rounded border",
      // 애니메이션
      "transition-all duration-300",
      isNew && "animate-slot-in",
      // 배경
      isEmpty || isDeleted
        ? "bg-zinc-100 dark:bg-zinc-800/50 border-dashed border-zinc-300 dark:border-zinc-600"
        : color 
          ? cn(color.bg, color.border)
          : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
    )}>
      <span className="text-zinc-500 dark:text-zinc-400 w-12 sm:w-14">
        offset {index}
      </span>
      <span className="text-zinc-400 dark:text-zinc-500">→</span>
      {isDeleted ? (
        <span className="text-red-400 dark:text-red-500 line-through italic">deleted</span>
      ) : isEmpty ? (
        <span className="text-zinc-400 dark:text-zinc-500 italic">empty</span>
      ) : property ? (
        <span className={cn("font-bold", color?.text)}>
          {property.key}: {property.value}
        </span>
      ) : null}
    </div>
  );
}

function JSObjectBlock({ 
  inObjectProps, 
  hasPropertyArray, 
  mode,
  deletedSlots,
  recentKey,
  isShaking,
}: { 
  inObjectProps: Property[];
  hasPropertyArray: boolean;
  mode: StorageMode;
  deletedSlots: Set<number>;
  recentKey: string | null;
  isShaking: boolean;
}) {
  const slots = Array.from({ length: IN_OBJECT_SLOTS }, (_, i) => i);
  
  return (
    <div className={cn(
      // 레이아웃
      "p-3 sm:p-4 rounded-lg border-2 min-w-[160px] sm:min-w-[200px]",
      // 애니메이션
      "transition-all duration-500",
      isShaking && "animate-shake",
      // 배경 및 테두리
      mode === 'dictionary'
        ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700"
        : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600"
    )}>
      <div className={cn(
        "text-xs sm:text-sm font-bold mb-2 sm:mb-3",
        "text-zinc-700 dark:text-zinc-300"
      )}>
        JSObject
      </div>
      
      <div className="space-y-1">
        {slots.map(i => {
          const prop = inObjectProps[i];
          const isNew = prop?.key === recentKey;
          return (
            <MemorySlot
              key={i}
              index={i}
              property={prop}
              isEmpty={!prop && !deletedSlots.has(i)}
              isDeleted={deletedSlots.has(i)}
              isNew={isNew}
            />
          );
        })}
      </div>
      
      {(hasPropertyArray || mode === 'dictionary') && (
        <div className={cn(
          // 레이아웃
          "mt-3 pt-2 border-t flex items-center gap-2 text-[10px] sm:text-xs font-mono",
          // 애니메이션
          "animate-fade-in",
          // 테두리
          "border-zinc-200 dark:border-zinc-700"
        )}>
          <span className="text-zinc-500 dark:text-zinc-400">properties</span>
          <span className={cn(
            "text-zinc-400 dark:text-zinc-500",
            // 연결선 애니메이션
            "animate-pulse"
          )}>→</span>
          <span className={cn(
            "px-1.5 py-0.5 rounded",
            mode === 'dictionary'
              ? "bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300"
              : "bg-sky-200 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300"
          )}>
            {mode === 'dictionary' ? 'NameDictionary*' : 'PropertyArray*'}
          </span>
        </div>
      )}
    </div>
  );
}

function PropertyArrayBlock({ properties, recentKey }: { properties: Property[]; recentKey: string | null }) {
  if (properties.length === 0) return null;
  
  return (
    <div className={cn(
      // 레이아웃
      "p-3 sm:p-4 rounded-lg border-2 min-w-[160px] sm:min-w-[200px]",
      // 애니메이션
      "animate-slide-in",
      // 배경 및 테두리
      "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-600"
    )}>
      <div className={cn(
        "text-xs sm:text-sm font-bold mb-2 sm:mb-3",
        "text-sky-700 dark:text-sky-300"
      )}>
        PropertyArray
      </div>
      
      <div className="space-y-1">
        {properties.map((prop, i) => (
          <MemorySlot 
            key={prop.key} 
            index={i} 
            property={prop} 
            isNew={prop.key === recentKey}
          />
        ))}
      </div>
    </div>
  );
}

function DictionaryBlock({ properties, recentKey }: { properties: Property[]; recentKey: string | null }) {
  if (properties.length === 0) return null;
  
  const buckets = properties.map(prop => ({
    key: prop.key,
    value: prop.value,
    hash: prop.key.charCodeAt(0) % 8,
  }));
  
  return (
    <div className={cn(
      // 레이아웃
      "p-3 sm:p-4 rounded-lg border-2 min-w-[200px] sm:min-w-[260px]",
      // 애니메이션
      "animate-dictionary-in",
      // 배경 및 테두리
      "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-600"
    )}>
      <div className={cn(
        "text-xs sm:text-sm font-bold mb-2 sm:mb-3 flex items-center gap-2",
        "text-red-700 dark:text-red-300"
      )}>
        <span className="animate-pulse">⚠️</span>
        NameDictionary (Hash Table)
      </div>
      
      <div className="space-y-1">
        {buckets.map((entry, i) => {
          const color = PROPERTY_COLORS[entry.key];
          const isNew = entry.key === recentKey;
          return (
            <div 
              key={entry.key} 
              className={cn(
                // 레이아웃
                "flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs py-1 px-1.5 sm:px-2 rounded border",
                // 애니메이션
                "transition-all duration-300",
                isNew && "animate-slot-in",
                // 배경 및 테두리
                color.bg, color.border
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-zinc-500 dark:text-zinc-400 w-14 sm:w-16">
                h={entry.hash}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
              <span className={cn("font-bold", color.text)}>
                "{entry.key}": {entry.value}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className={cn(
        "mt-2 text-[9px] sm:text-[10px] italic",
        "text-red-600 dark:text-red-400"
      )}>
        * 매번 해시 조회 필요
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function PropertyStorageVisualizer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [mode, setMode] = useState<StorageMode>('in-object');
  const [deletedSlots, setDeletedSlots] = useState<Set<number>>(new Set());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [recentKey, setRecentKey] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isModeTransitioning, setIsModeTransitioning] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  // 현재 모드 계산
  const inObjectProps = properties.slice(0, IN_OBJECT_SLOTS);
  const overflowProps = properties.slice(IN_OBJECT_SLOTS);
  const hasPropertyArray = overflowProps.length > 0 && mode !== 'dictionary';

  // 애니메이션 리셋
  useEffect(() => {
    if (recentKey) {
      const timer = setTimeout(() => setRecentKey(null), 600);
      return () => clearTimeout(timer);
    }
  }, [recentKey]);

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  useEffect(() => {
    if (isModeTransitioning) {
      const timer = setTimeout(() => setIsModeTransitioning(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isModeTransitioning]);

  // 로그 스크롤
  useEffect(() => {
    if (logsContainerRef.current && logs.length > 0) {
      const container = logsContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: React.ReactNode, type: LogEntry['type'] = 'info') => {
    logIdRef.current += 1;
    setLogs(prev => [...prev, { id: logIdRef.current, message, type }]);
  };

  const triggerModeTransition = () => {
    setIsModeTransitioning(true);
  };

  const handleAddProperty = (key: string) => {
    setRecentKey(key);
    
    if (mode === 'dictionary') {
      const value = Math.floor(Math.random() * 100);
      setProperties(prev => [...prev, { key, value, addedAt: Date.now() }]);
      addLog(
        <span>
          <strong>obj.{key} = {value}</strong> - Dictionary mode에서 해시테이블에 추가됨
        </span>,
        'warning'
      );
      return;
    }

    const currentCount = properties.length;
    const value = Math.floor(Math.random() * 100);
    
    if (currentCount < IN_OBJECT_SLOTS) {
      setProperties(prev => [...prev, { key, value, addedAt: Date.now() }]);
      addLog(
        <span>
          <strong>obj.{key} = {value}</strong> - In-object 오프셋 {currentCount}에 직접 저장 (가장 빠름)
        </span>,
        'success'
      );
    } else {
      if (currentCount === IN_OBJECT_SLOTS) {
        setMode('fast');
        triggerModeTransition();
        addLog(
          <span>
            In-object 오프셋이 가득 찼습니다. <strong>PropertyArray</strong>로 확장합니다.
          </span>,
          'warning'
        );
      }
      setProperties(prev => [...prev, { key, value, addedAt: Date.now() }]);
      addLog(
        <span>
          <strong>obj.{key} = {value}</strong> - PropertyArray에 저장 (한 단계 간접 참조)
        </span>,
        'info'
      );
    }
  };

  const handleDeleteProperty = (key: string) => {
    const propIndex = properties.findIndex(p => p.key === key);
    if (propIndex === -1) return;

    const isLastProp = propIndex === properties.length - 1;
    const isInObjectSlot = propIndex < IN_OBJECT_SLOTS;

    if (mode === 'dictionary') {
      setProperties(prev => prev.filter(p => p.key !== key));
      addLog(
        <span>
          <strong>delete obj.{key}</strong> - 해시테이블에서 제거됨
        </span>,
        'info'
      );
      return;
    }

    if (isLastProp) {
      setProperties(prev => prev.filter(p => p.key !== key));
      addLog(
        <span>
          <strong>delete obj.{key}</strong> - 마지막 프로퍼티 삭제 (이전 Hidden Class로 롤백 가능)
        </span>,
        'success'
      );
      
      if (mode === 'fast' && properties.length <= IN_OBJECT_SLOTS + 1) {
        setMode('in-object');
        triggerModeTransition();
      }
    } else if (isInObjectSlot) {
      // 중간 in-object 오프셋 삭제 → Dictionary mode 전환!
      setIsShaking(true);
      setMode('dictionary');
      triggerModeTransition();
      setDeletedSlots(new Set());
      addLog(
        <span className="text-red-600 dark:text-red-400">
          ⚠️ <strong>delete obj.{key}</strong> - 중간 프로퍼티 삭제! <strong>Dictionary mode로 영구 전환됩니다.</strong>
        </span>,
        'error'
      );
      addLog(
        <span className="text-red-600 dark:text-red-400">
          Hidden Class가 무너져 모든 프로퍼티 접근이 해시 조회로 처리됩니다.
        </span>,
        'error'
      );
      setProperties(prev => prev.filter(p => p.key !== key));
    } else {
      setProperties(prev => prev.filter(p => p.key !== key));
      addLog(
        <span>
          <strong>delete obj.{key}</strong> - PropertyArray에서 제거됨
        </span>,
        'info'
      );
    }
  };

  const handleReset = () => {
    setProperties([]);
    setMode('in-object');
    setDeletedSlots(new Set());
    setLogs([]);
    setRecentKey(null);
    setIsShaking(false);
    setIsModeTransitioning(false);
    addLog('시뮬레이터가 초기화되었습니다.');
  };

  const existingKeys = new Set(properties.map(p => p.key));

  return (
    <div className={cn(
      // 레이아웃
      "flex flex-col gap-3 sm:gap-5 p-3 sm:p-6 rounded-xl border",
      // 배경 및 테두리
      "bg-zinc-50 dark:bg-zinc-900/50",
      "border-zinc-200 dark:border-zinc-800"
    )}>
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes slot-in {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateX(-10px); 
          }
          50% { 
            transform: scale(1.05); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateX(0); 
          }
        }
        @keyframes slide-in {
          0% { 
            opacity: 0; 
            transform: translateX(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes dictionary-in {
          0% { 
            opacity: 0; 
            transform: scale(0.9); 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.3);
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        :global(.animate-slot-in) {
          animation: slot-in 0.4s ease-out forwards;
        }
        :global(.animate-slide-in) {
          animation: slide-in 0.5s ease-out forwards;
        }
        :global(.animate-dictionary-in) {
          animation: dictionary-in 0.6s ease-out forwards;
        }
        :global(.animate-shake) {
          animation: shake 0.5s ease-in-out;
        }
        :global(.animate-fade-in) {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className={cn(
          "font-bold text-sm sm:text-lg",
          "text-zinc-900 dark:text-zinc-100"
        )}>
          Property Storage Mode 시뮬레이터
        </h3>
        <div className="flex items-center gap-2">
          <ModeBadge mode={mode} isTransitioning={isModeTransitioning} />
          <button
            onClick={handleReset}
            className={cn(
              // 레이아웃
              "px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded border",
              // 배경 및 테두리
              "bg-white dark:bg-zinc-800",
              "border-zinc-200 dark:border-zinc-700",
              // 텍스트 색상
              "text-zinc-600 dark:text-zinc-300",
              // 호버 효과
              "hover:bg-zinc-50 dark:hover:bg-zinc-700",
              "transition-colors duration-200"
            )}
          >
            초기화
          </button>
        </div>
      </div>

      {/* Memory Visualization */}
      <div className="flex flex-wrap items-start gap-3 sm:gap-6 justify-center min-h-[180px]">
        <JSObjectBlock
          inObjectProps={mode === 'dictionary' ? [] : inObjectProps}
          hasPropertyArray={hasPropertyArray}
          mode={mode}
          deletedSlots={deletedSlots}
          recentKey={recentKey}
          isShaking={isShaking}
        />
        
        {hasPropertyArray && (
          <PropertyArrayBlock 
            properties={overflowProps} 
            recentKey={recentKey}
          />
        )}
        
        {mode === 'dictionary' && (
          <DictionaryBlock 
            properties={properties}
            recentKey={recentKey}
          />
        )}
      </div>

      {/* Controls */}
      <div className={cn(
        // 레이아웃
        "p-3 sm:p-4 rounded-lg border space-y-3",
        // 배경 및 테두리
        "bg-white dark:bg-zinc-900",
        "border-zinc-200 dark:border-zinc-700"
      )}>
        <div>
          <p className={cn(
            "text-[10px] sm:text-xs mb-1.5 sm:mb-2 font-medium",
            "text-zinc-600 dark:text-zinc-300"
          )}>
            프로퍼티 추가:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ALL_PROPS.map(prop => {
              const hasProp = existingKeys.has(prop);
              const propColor = PROPERTY_COLORS[prop];
              return (
                <button
                  key={prop}
                  onClick={() => !hasProp && handleAddProperty(prop)}
                  disabled={hasProp}
                  className={cn(
                    // 레이아웃
                    "min-w-[40px] min-h-[36px] sm:min-w-0 sm:min-h-0",
                    "px-3 py-2 sm:px-3 sm:py-1 text-xs font-mono rounded border font-bold",
                    // 전환 효과
                    "transition-all duration-200",
                    hasProp 
                      ? cn(
                          "bg-zinc-100 dark:bg-zinc-950",
                          "text-zinc-400 dark:text-zinc-600",
                          "border-zinc-200 dark:border-zinc-800",
                          "cursor-not-allowed opacity-60"
                        )
                      : cn(
                          propColor.bg, propColor.text, propColor.border,
                          "hover:opacity-80 hover:scale-105 active:scale-95"
                        )
                  )}
                >
                  +{prop}
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <p className={cn(
            "text-[10px] sm:text-xs mb-1.5 sm:mb-2 font-medium",
            "text-zinc-600 dark:text-zinc-300"
          )}>
            프로퍼티 삭제 (delete):
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ALL_PROPS.map(prop => {
              const hasProp = existingKeys.has(prop);
              return (
                <button
                  key={prop}
                  onClick={() => hasProp && handleDeleteProperty(prop)}
                  disabled={!hasProp}
                  className={cn(
                    // 레이아웃
                    "min-w-[40px] min-h-[36px] sm:min-w-0 sm:min-h-0",
                    "px-3 py-2 sm:px-3 sm:py-1 text-xs font-mono rounded border font-bold",
                    // 전환 효과
                    "transition-all duration-200",
                    !hasProp
                      ? cn(
                          "bg-zinc-100 dark:bg-zinc-950",
                          "text-zinc-400 dark:text-zinc-600",
                          "border-zinc-200 dark:border-zinc-800",
                          "cursor-not-allowed opacity-60"
                        )
                      : cn(
                          "bg-red-100 dark:bg-red-900/40",
                          "text-red-600 dark:text-red-400",
                          "border-red-300 dark:border-red-700",
                          "hover:bg-red-200 dark:hover:bg-red-900/60",
                          "hover:scale-105 active:scale-95"
                        )
                  )}
                >
                  ×{prop}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-2">
        <h4 className={cn(
          "text-xs sm:text-sm font-semibold",
          "text-zinc-700 dark:text-zinc-300"
        )}>
          실행 로그
        </h4>
        <div 
          ref={logsContainerRef}
          className={cn(
            // 레이아웃
            "h-28 sm:h-32 overflow-y-auto p-2 sm:p-3 rounded-lg font-mono text-[10px] sm:text-xs space-y-1 sm:space-y-1.5 border",
            // 배경 및 테두리
            "bg-zinc-900 dark:bg-zinc-950",
            "text-zinc-200 dark:text-zinc-300",
            "border-zinc-800"
          )}
        >
          {logs.length === 0 && (
            <div className="italic text-zinc-500">
              프로퍼티를 추가하거나 삭제해보세요.
            </div>
          )}
          {logs.map(log => (
            <div key={log.id} className={cn(
              "border-l-2 pl-2 animate-fade-in",
              log.type === 'info' && "border-blue-500 dark:border-blue-400",
              log.type === 'success' && "border-green-500 dark:border-green-400",
              log.type === 'warning' && "border-orange-500 dark:border-orange-400",
              log.type === 'error' && "border-red-500 dark:border-red-400"
            )}>
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
