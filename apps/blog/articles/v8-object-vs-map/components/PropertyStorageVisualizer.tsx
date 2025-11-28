'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.span 
      layout
      initial={{ scale: 1 }}
      animate={{ scale: isTransitioning ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        // 레이아웃
        "px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[10px] sm:text-xs font-bold font-mono",
        // 색상
        config[mode].color
      )}
    >
      {config[mode].label}
    </motion.span>
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
    <motion.div 
      layout
      initial={isNew ? { opacity: 0, x: -12, backgroundColor: 'rgba(196, 219, 255, 0.3)' } : false}
      animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(196, 219, 255, 0)' }}
      transition={{ duration: 0.3, backgroundColor: { duration: 0.8 } }}
      className={cn(
        // 레이아웃
        "flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs py-0.5 px-1 sm:px-1.5 rounded",
        // 배경 (회색톤 베이스)
        isEmpty || isDeleted
          ? "bg-zinc-100/50 dark:bg-zinc-800/30"
          : "bg-zinc-100 dark:bg-zinc-800"
      )}
    >
      <span className="text-zinc-500 dark:text-zinc-500 w-14 sm:w-16">
        offset {index}
      </span>
      <span className="text-zinc-300 dark:text-zinc-600">→</span>
      {isDeleted ? (
        <span className="text-red-400 dark:text-red-500 line-through italic">deleted</span>
      ) : isEmpty ? (
        <span className="text-zinc-400 dark:text-zinc-500 italic">empty</span>
      ) : property ? (
        <span className="text-zinc-700 dark:text-zinc-300">
          <span className={cn("font-bold", color?.text)}>{property.key}</span>: {property.value}
        </span>
      ) : null}
    </motion.div>
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
    <motion.div 
      layout
      animate={{ 
        x: isShaking ? [0, -4, 4, -4, 4, 0] : 0,
      }}
      transition={{ duration: 0.4 }}
      className={cn(
        // 레이아웃
        "p-2.5 sm:p-3 rounded-sm border min-w-[140px] sm:min-w-[180px]",
        // 배경 및 테두리 (회색톤)
        mode === 'dictionary'
          ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
      )}
    >
      <div className={cn(
        "text-[10px] sm:text-xs font-bold mb-2",
        "text-zinc-600 dark:text-zinc-400"
      )}>
        JSObject
      </div>
      
      <div className="space-y-0.5">
        <AnimatePresence mode="popLayout">
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
        </AnimatePresence>
      </div>
      
      {(hasPropertyArray || mode === 'dictionary') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            // 레이아웃
            "mt-2 pt-1.5 border-t flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono",
            // 테두리
            "border-zinc-200 dark:border-zinc-700"
          )}
        >
          <span className="text-zinc-500 dark:text-zinc-500">properties</span>
          <span className="text-zinc-300 dark:text-zinc-600">→</span>
          <span className={cn(
            "px-1 py-0.5 rounded text-[9px] font-medium",
            mode === 'dictionary'
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
          )}>
            {mode === 'dictionary' ? 'NameDictionary*' : 'PropertyArray*'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

function PropertyArrayBlock({ properties, recentKey }: { properties: Property[]; recentKey: string | null }) {
  if (properties.length === 0) return null;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className={cn(
        // 레이아웃
        "p-2.5 sm:p-3 rounded-sm border min-w-[140px] sm:min-w-[180px]",
        // 배경 및 테두리 (회색톤 + 약한 색상 힌트)
        "bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800"
      )}
    >
      <div className={cn(
        "text-[10px] sm:text-xs font-bold mb-2",
        "text-sky-600 dark:text-sky-400"
      )}>
        PropertyArray
      </div>
      
      <div className="space-y-0.5">
        <AnimatePresence mode="popLayout">
          {properties.map((prop, i) => (
            <MemorySlot 
              key={prop.key} 
              index={i} 
              property={prop} 
              isNew={prop.key === recentKey}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
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
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className={cn(
        // 레이아웃
        "p-2.5 sm:p-3 rounded-sm border min-w-[160px] sm:min-w-[200px]",
        // 배경 및 테두리 (회색톤 + 약한 빨강 힌트)
        "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
      )}
    >
      <div className={cn(
        "text-[10px] sm:text-xs font-bold mb-2 flex items-center gap-1.5",
        "text-red-600 dark:text-red-400"
      )}>
        <span>⚠️</span>
        NameDictionary
      </div>
      
      <div className="space-y-0.5">
        <AnimatePresence mode="popLayout">
          {buckets.map((entry, i) => {
            const color = PROPERTY_COLORS[entry.key];
            const isNew = entry.key === recentKey;
            return (
              <motion.div 
                key={entry.key}
                layout
                initial={isNew ? { opacity: 0, x: -12 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  // 레이아웃
                  "flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs py-0.5 px-1 sm:px-1.5 rounded",
                  // 배경 (회색톤)
                  "bg-zinc-100 dark:bg-zinc-800"
                )}
              >
                <span className="text-zinc-500 dark:text-zinc-500 w-10 sm:w-12">
                  h={entry.hash}
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">→</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  "<span className={cn("font-bold", color.text)}>{entry.key}</span>": {entry.value}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className={cn(
        "mt-1.5 text-[8px] sm:text-[9px] italic",
        "text-red-500 dark:text-red-500"
      )}>
        * 매번 해시 조회 필요
      </div>
    </motion.div>
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
  const logIdRef = React.useRef(0);

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
      "flex flex-col gap-1 sm:gap-2 p-3 sm:p-6 rounded-xl border",
      // 배경 및 테두리
      "bg-zinc-50 dark:bg-zinc-900/50",
      "border-zinc-200 dark:border-zinc-800"
    )}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className={cn(
          "font-bold text-sm sm:text-lg",
          "text-zinc-900 dark:text-zinc-100"
        )}>
          Property Storage
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

      {/* 실행 로그 (최근 1줄) */}
      <AnimatePresence mode="wait">
        {logs.length > 0 ? (
          <motion.div
            key={logs[logs.length - 1].id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={cn(
              // 레이아웃
              "px-2.5 py-1.5 sm:px-3 sm:py-2 rounded border font-mono text-[10px] sm:text-xs",
              // 배경 및 테두리
              "bg-zinc-100 dark:bg-zinc-800/80",
              "border-zinc-200 dark:border-zinc-700",
              // 텍스트 색상
              "text-zinc-600 dark:text-zinc-300",
              // 왼쪽 테두리 색상 (로그 타입별)
              "border-l-2",
              logs[logs.length - 1].type === 'info' 
                ? "border-l-blue-500 dark:border-l-blue-400"
                : logs[logs.length - 1].type === 'success'
                ? "border-l-green-500 dark:border-l-green-400"
                : logs[logs.length - 1].type === 'warning'
                ? "border-l-orange-500 dark:border-l-orange-400"
                : "border-l-red-500 dark:border-l-red-400"
            )}
          >
            {logs[logs.length - 1].message}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              // 레이아웃
              "px-2.5 py-1.5 sm:px-3 sm:py-2 rounded border font-mono text-[10px] sm:text-xs italic",
              // 배경 및 테두리
              "bg-zinc-100 dark:bg-zinc-800/80",
              "border-zinc-200 dark:border-zinc-700",
              // 텍스트 색상
              "text-zinc-400 dark:text-zinc-500"
            )}
          >
            프로퍼티를 추가하거나 삭제해보세요.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Visualization */}
      <div className="flex flex-wrap items-start gap-2 sm:gap-4 justify-center min-h-[150px]">
        <JSObjectBlock
          inObjectProps={mode === 'dictionary' ? [] : inObjectProps}
          hasPropertyArray={hasPropertyArray}
          mode={mode}
          deletedSlots={deletedSlots}
          recentKey={recentKey}
          isShaking={isShaking}
        />
        
        <AnimatePresence>
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
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className={cn(
        // 레이아웃
        "p-2.5 sm:p-3 rounded-sm border space-y-2",
        // 배경 및 테두리 (회색톤)
        "bg-white dark:bg-zinc-900",
        "border-zinc-200 dark:border-zinc-700"
      )}>
        <div>
          <p className={cn(
            "text-[10px] sm:text-xs mb-1 sm:mb-1.5 font-medium",
            "text-zinc-500 dark:text-zinc-500"
          )}>
            프로퍼티 추가:
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
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
                    "min-w-[32px] min-h-[28px] sm:min-w-0 sm:min-h-0",
                    "px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-mono rounded border",
                    // 전환 효과
                    "transition-all duration-150",
                    hasProp 
                      ? cn(
                          // 비활성화 상태 (회색)
                          "bg-zinc-100 dark:bg-zinc-900",
                          "text-zinc-300 dark:text-zinc-600",
                          "border-zinc-200 dark:border-zinc-800",
                          "cursor-not-allowed"
                        )
                      : cn(
                          // 활성화 상태 (회색 베이스 + 약한 색상 힌트)
                          "bg-zinc-50 dark:bg-zinc-800",
                          "border-zinc-300 dark:border-zinc-600",
                          "text-zinc-600 dark:text-zinc-400",
                          "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                          "active:scale-95"
                        )
                  )}
                >
                  <span className={cn(!hasProp && "font-medium", !hasProp && propColor.text)}>+{prop}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <p className={cn(
            "text-[10px] sm:text-xs mb-1 sm:mb-1.5 font-medium",
            "text-zinc-500 dark:text-zinc-500"
          )}>
            프로퍼티 삭제:
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {ALL_PROPS.map(prop => {
              const hasProp = existingKeys.has(prop);
              return (
                <button
                  key={prop}
                  onClick={() => hasProp && handleDeleteProperty(prop)}
                  disabled={!hasProp}
                  className={cn(
                    // 레이아웃
                    "min-w-[32px] min-h-[28px] sm:min-w-0 sm:min-h-0",
                    "px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-mono rounded border",
                    // 전환 효과
                    "transition-all duration-150",
                    !hasProp
                      ? cn(
                          // 비활성화 상태 (회색)
                          "bg-zinc-100 dark:bg-zinc-900",
                          "text-zinc-300 dark:text-zinc-600",
                          "border-zinc-200 dark:border-zinc-800",
                          "cursor-not-allowed"
                        )
                      : cn(
                          // 활성화 상태 (회색 베이스 + 빨강 힌트)
                          "bg-zinc-50 dark:bg-zinc-800",
                          "border-zinc-300 dark:border-zinc-600",
                          "text-red-500 dark:text-red-400",
                          "hover:bg-red-50 dark:hover:bg-red-900/20",
                          "active:scale-95"
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
    </div>
  );
}
