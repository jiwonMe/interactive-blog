'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, MarkerType, Position, Handle, Node, Edge, ReactFlowInstance } from '@xyflow/react';
// ReactFlow CSS는 globals.css에서 import됨
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------

type HiddenClassColorKey = 
  | 'indigo' | 'emerald' | 'amber' | 'red' | 'pink' 
  | 'purple' | 'cyan' | 'orange' | 'lime' | 'fuchsia';

const COLOR_KEYS: HiddenClassColorKey[] = [
  'indigo', 'emerald', 'amber', 'red', 'pink', 
  'purple', 'cyan', 'orange', 'lime', 'fuchsia'
];

const HIDDEN_CLASS_COLORS: Record<HiddenClassColorKey, {
  badge: string;
  circle: string;
  text: string;
}> = {
  indigo: { badge: 'bg-indigo-500 dark:bg-indigo-400', circle: 'bg-indigo-500 dark:bg-indigo-400', text: 'text-white dark:text-indigo-950' },
  emerald: { badge: 'bg-emerald-500 dark:bg-emerald-400', circle: 'bg-emerald-500 dark:bg-emerald-400', text: 'text-white dark:text-emerald-950' },
  amber: { badge: 'bg-amber-500 dark:bg-amber-400', circle: 'bg-amber-500 dark:bg-amber-400', text: 'text-white dark:text-amber-950' },
  red: { badge: 'bg-red-500 dark:bg-red-400', circle: 'bg-red-500 dark:bg-red-400', text: 'text-white dark:text-red-950' },
  pink: { badge: 'bg-pink-500 dark:bg-pink-400', circle: 'bg-pink-500 dark:bg-pink-400', text: 'text-white dark:text-pink-950' },
  purple: { badge: 'bg-purple-500 dark:bg-purple-400', circle: 'bg-purple-500 dark:bg-purple-400', text: 'text-white dark:text-purple-950' },
  cyan: { badge: 'bg-cyan-500 dark:bg-cyan-400', circle: 'bg-cyan-500 dark:bg-cyan-400', text: 'text-white dark:text-cyan-950' },
  orange: { badge: 'bg-orange-500 dark:bg-orange-400', circle: 'bg-orange-500 dark:bg-orange-400', text: 'text-white dark:text-orange-950' },
  lime: { badge: 'bg-lime-500 dark:bg-lime-400', circle: 'bg-lime-500 dark:bg-lime-400', text: 'text-white dark:text-lime-950' },
  fuchsia: { badge: 'bg-fuchsia-500 dark:bg-fuchsia-400', circle: 'bg-fuchsia-500 dark:bg-fuchsia-400', text: 'text-white dark:text-fuchsia-950' },
};

// 프로퍼티별 색상 매핑
const PROPERTY_COLORS: Record<string, {
  bg: string[];
  text: string[];
  border: string[];
  edge: string;
}> = {
  x: { 
    bg: ['bg-blue-100', 'dark:bg-blue-900/60'], 
    text: ['text-blue-700', 'dark:text-blue-200'],
    border: ['border-blue-300', 'dark:border-blue-600'],
    edge: '#3b82f6' // blue-500
  },
  y: { 
    bg: ['bg-green-100', 'dark:bg-green-900/60'], 
    text: ['text-green-700', 'dark:text-green-200'],
    border: ['border-green-300', 'dark:border-green-600'],
    edge: '#22c55e' // green-500
  },
  z: { 
    bg: ['bg-yellow-100', 'dark:bg-yellow-900/60'], 
    text: ['text-yellow-700', 'dark:text-yellow-200'],
    border: ['border-yellow-300', 'dark:border-yellow-600'],
    edge: '#eab308' // yellow-500
  },
  a: { 
    bg: ['bg-purple-100', 'dark:bg-purple-900/60'], 
    text: ['text-purple-700', 'dark:text-purple-200'],
    border: ['border-purple-300', 'dark:border-purple-600'],
    edge: '#a855f7' // purple-500
  },
  b: { 
    bg: ['bg-rose-100', 'dark:bg-rose-900/60'], 
    text: ['text-rose-700', 'dark:text-rose-200'],
    border: ['border-rose-300', 'dark:border-rose-600'],
    edge: '#f43f5e' // rose-500
  },
};

interface HiddenClass {
  id: string;
  name: string;
  properties: string[];
  colorKey: HiddenClassColorKey;
  // 프로퍼티 이름 -> 다음 Hidden Class ID
  transitions: Record<string, string>;
}

interface ObjectState {
  name: string;
  properties: { key: string; value: number }[];
  hiddenClassId: string;
}

interface LogEntry {
  id: number;
  message: React.ReactNode;
  type: 'info' | 'success' | 'warning';
}

// -----------------------------------------------------------------------------
// Sub Components
// -----------------------------------------------------------------------------

function ObjectPanel({ 
  state, 
  hiddenClass,
  onAddProperty,
  objectKey,
}: { 
  state: ObjectState;
  hiddenClass: HiddenClass;
  onAddProperty: (prop: string) => void;
  objectKey: 'A' | 'B';
}) {
  const potentialProps = ['x', 'y', 'z', 'a', 'b'];
  
  // Hidden Class 색상 (구분용)
  const hiddenClassColor = HIDDEN_CLASS_COLORS[hiddenClass.colorKey];
  
  // Object A: 파란색 dot, Object B: 초록색 dot (최소한의 색상만)
  const objectDotColor = objectKey === 'A' 
    ? 'bg-blue-500 dark:bg-blue-400'
    : 'bg-green-500 dark:bg-green-400';

  return (
    <div className={cn(
      // 레이아웃
      "flex-1 p-2.5 sm:p-4 rounded-sm border transition-all duration-300",
      // 배경 및 테두리 (회색톤)
      "bg-white dark:bg-zinc-900",
      "border-zinc-200 dark:border-zinc-700"
    )}>
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-4">
        {/* Object 구분용 색상 dot */}
        <div className={cn(
          // 레이아웃 (작은 dot)
          "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0",
          // 색상
          objectDotColor
        )} />
        <span className={cn(
          // 회색 텍스트 (미니멀)
          "font-mono font-bold text-xs sm:text-md",
          "text-zinc-700 dark:text-zinc-300"
        )}>
          {state.name}
        </span>
        {/* Hidden Class 뱃지 (색상으로 구분) */}
        <span className={cn(
          // 레이아웃
          "px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[10px] sm:text-xs font-bold font-mono",
          // Hidden Class별 색상
          hiddenClassColor.badge,
          hiddenClassColor.text
        )}>
          {hiddenClass.name}
        </span>
      </div>
      
      {/* Properties Display */}
      <div className={cn(
        // 레이아웃
        "space-y-0.5 sm:space-y-1 min-h-[60px] sm:min-h-[80px] mb-2.5 sm:mb-4 border rounded p-1.5 sm:p-2",
        // 배경 및 테두리 (회색톤)
        "bg-zinc-50 dark:bg-zinc-900/50",
        "border-zinc-200 dark:border-zinc-800"
      )}>
        {state.properties.length === 0 ? (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "text-xs sm:text-sm italic block",
              "text-zinc-400 dark:text-zinc-500"
            )}
          >
            {'{}'} (빈 객체)
          </motion.span>
        ) : (
          <>
            {/* 모바일: 3개 초과 시 숨겨진 프로퍼티 개수 표시 */}
            {state.properties.length > 3 && (
              <div className={cn(
                // 모바일에서만 표시
                "block sm:hidden",
                "text-[9px] text-zinc-400 dark:text-zinc-500 mb-1"
              )}>
                +{state.properties.length - 3}개 더...
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {state.properties.map((prop, idx) => {
                const propColor = PROPERTY_COLORS[prop.key] || PROPERTY_COLORS.x;
                // 모바일에서 3개 초과 시 앞의 프로퍼티 숨김
                const hiddenOnMobile = state.properties.length > 3 && idx < state.properties.length - 3;
                return (
                  <motion.div 
                    key={`${prop.key}-${idx}`}
                    layout
                    initial={{ opacity: 0, x: -12, backgroundColor: 'rgba(196, 219, 255, 0.3)' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(196, 219, 255, 0)' }}
                    transition={{ 
                      duration: 0.3,
                      backgroundColor: { duration: 0.8 }
                    }}
                    className={cn(
                      // 레이아웃
                      "flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-sm rounded px-1 -mx-1",
                      // 모바일에서 숨김 (3개 초과 시)
                      hiddenOnMobile && "hidden sm:flex"
                    )}
                  >
                    <span className={cn(
                      // 회색톤 offset 텍스트
                      "text-zinc-500 dark:text-zinc-500"
                    )}>
                      offset {idx}
                    </span>
                    <span className={cn(
                      "text-zinc-300 dark:text-zinc-600"
                    )}>
                      →
                    </span>
                    <span className={cn(
                      // 레이아웃
                      "px-1.5 py-0.5 sm:px-2 rounded font-medium",
                      // 회색톤 베이스 + 약한 색상 힌트
                      "bg-zinc-100 dark:bg-zinc-800",
                      "text-zinc-700 dark:text-zinc-300"
                    )}>
                      <span className={cn("font-bold", ...propColor.text)}>{prop.key}</span>: {prop.value}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Controls */}
      <div>
        <p className={cn(
          "text-[10px] sm:text-xs mb-1 sm:mb-1.5 font-medium",
          "text-zinc-500 dark:text-zinc-500"
        )}>
          프로퍼티 추가:
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {potentialProps.map(prop => {
            const hasProp = state.properties.some(p => p.key === prop);
            const propColor = PROPERTY_COLORS[prop];
            return (
              <button
                key={prop}
                onClick={() => !hasProp && onAddProperty(prop)}
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
                        "hover:border-zinc-400 dark:hover:border-zinc-500",
                        "active:scale-95"
                      )
                )}
              >
                <span className={cn(!hasProp && "font-medium", !hasProp && propColor.text.join(' '))}>+{prop}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const HiddenClassNode = ({ data }: { data: { label: string, properties: string[], colorKey: HiddenClassColorKey, isActive: boolean, activeObjects: ('A' | 'B')[], objectLabel?: string, objectLabelColor?: string } }) => {
  const colorStyles = HIDDEN_CLASS_COLORS[data.colorKey];
  const hasObjectA = data.activeObjects.includes('A');
  const hasObjectB = data.activeObjects.includes('B');
  
  // Border 색상 결정 (더 두껍게, 더 명확하게)
  let borderClass = "border-[3px] border-zinc-200 dark:border-zinc-700";
  if (hasObjectA && hasObjectB) {
    // 둘 다 사용 중: 보라색 (파란색 + 초록색의 혼합 느낌)
    borderClass = "border-[2px] border-blue-500 dark:border-blue-400 ring-2 ring-green-500 dark:ring-green-400";
  } else if (hasObjectA) {
    // Object A만 사용 중: 파란색
    borderClass = "border-[3px] border-blue-500 dark:border-blue-400";
  } else if (hasObjectB) {
    // Object B만 사용 중: 초록색
    borderClass = "border-[3px] border-green-500 dark:border-green-400";
  }
  
  return (
    <div className="relative">
      <div 
        className={cn(
          // 레이아웃
          "p-2 sm:p-3 rounded-md transition-all duration-300 min-w-[90px] sm:min-w-[140px] shadow-lg relative",
          // 배경
          "bg-white dark:bg-zinc-800",
          // 활성화 상태
          data.isActive 
            ? "scale-105 sm:scale-110 z-10 shadow-xl" 
            : "opacity-90",
          // 테두리
          borderClass
        )}
        style={{
          borderWidth: (hasObjectA || hasObjectB) ? '2px' : '1px',
        }}
      >
        <Handle 
          type="target" 
          position={Position.Left} 
          className={cn(
            "!w-1.5 !h-1.5 sm:!w-2 sm:!h-2",
            "!bg-zinc-500 dark:!bg-zinc-400"
          )} 
        />
        
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <div className={cn(
            // 레이아웃
            "w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[8px] sm:text-xs font-bold shadow-sm",
            // 색상
            colorStyles.circle,
            colorStyles.text
          )}>
          </div>
          <div className={cn(
            "text-[9px] sm:text-xs font-bold font-mono",
            "text-zinc-700 dark:text-zinc-300"
          )}>
            {data.label}
          </div>
        </div>
        
        <div className={cn(
          // 레이아웃
          "rounded-lg p-1 sm:p-2 border",
          // 배경 및 테두리
          "bg-zinc-100 dark:bg-zinc-900/80",
          "border-zinc-200 dark:border-zinc-700"
        )}>
          {data.properties.length === 0 ? (
            <div className={cn(
              "text-[8px] sm:text-[10px] italic text-center",
              "text-zinc-400 dark:text-zinc-500"
            )}>
              No properties
            </div>
          ) : (
            <div className="space-y-0.5 sm:space-y-1">
              {data.properties.map((prop, idx) => {
                const propColor = PROPERTY_COLORS[prop] || PROPERTY_COLORS.x;
                return (
                  <div key={idx} className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono gap-0.5 sm:gap-1">
                    <span className={cn(
                      "px-0.5 sm:px-1 py-0.5 rounded",
                      "bg-zinc-200/50 dark:bg-zinc-800/80",
                      "text-zinc-600 dark:text-zinc-300"
                    )}>
                      offset {idx}
                    </span>
                    <span className={cn(
                      // 레이아웃
                      "px-1 sm:px-1.5 py-0.5 rounded border font-bold",
                      // 색상
                      ...propColor.bg,
                      ...propColor.text,
                      ...propColor.border
                    )}>
                      {prop}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Handle 
          type="source" 
          position={Position.Right} 
          className={cn(
            "!w-1.5 !h-1.5 sm:!w-2 sm:!h-2",
            "!bg-zinc-500 dark:!bg-zinc-400"
          )} 
        />
      </div>
      
      {/* 노드 외부에 Object 표시 텍스트 */}
      {data.objectLabel && (
        <div 
          className="absolute text-center pointer-events-none whitespace-nowrap z-20"
          style={{
            top: 'calc(100% + 2px)',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <span className={cn(
            // 레이아웃
            "text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded shadow-lg",
            // 배경 및 테두리
            "bg-white dark:bg-zinc-800",
            "border border-zinc-300 dark:border-zinc-700",
            // 기본 텍스트 색상
            "text-zinc-800 dark:text-zinc-200",
            // 색상별 텍스트
            data.objectLabelColor === 'blue' && "text-blue-600 dark:text-blue-400",
            data.objectLabelColor === 'green' && "text-green-600 dark:text-green-400",
            data.objectLabelColor === 'purple' && "text-purple-600 dark:text-purple-400"
          )}>
            {data.objectLabel}
          </span>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Layout Helpers
// -----------------------------------------------------------------------------

const getLayoutedElements = (
  classes: Record<string, HiddenClass>, 
  activeIds: Set<string>, 
  objectAHiddenClassId: string, 
  objectBHiddenClassId: string,
  isDarkMode: boolean
) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const levels: Record<number, string[]> = {};
  const nodeDepth: Record<string, number> = { 'C0': 0 };
  
  // BFS for depth & edges
  const queue = ['C0'];
  const visited = new Set(['C0']);
  
  // Add C0 first
  if (!levels[0]) levels[0] = [];
  levels[0].push('C0');

  // Edge label 배경색을 dark mode에 맞게 동적으로 설정
  const labelBgColor = isDarkMode ? 'rgba(39, 39, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'; // zinc-800 / white
  const labelTextColor = isDarkMode ? '#e4e4e7' : '#18181b'; // zinc-200 / zinc-900

  while (queue.length > 0) {
    const id = queue.shift()!;
    const depth = nodeDepth[id];
    
    const hc = classes[id];
    Object.entries(hc.transitions).forEach(([prop, nextId]) => {
      if (!visited.has(nextId)) {
        nodeDepth[nextId] = depth + 1;
        if (!levels[depth + 1]) levels[depth + 1] = [];
        levels[depth + 1].push(nextId);
        
        visited.add(nextId);
        queue.push(nextId);
      }
      
      const propColor = PROPERTY_COLORS[prop] || PROPERTY_COLORS.x;
      edges.push({
        id: `${id}-${nextId}`,
        source: id,
        target: nextId,
        label: `+ ${prop}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: propColor.edge },
        style: { stroke: propColor.edge, strokeWidth: 2.5 },
        labelStyle: { 
          fill: propColor.edge, 
          fontWeight: 700, 
          fontSize: 11, 
          backgroundColor: labelBgColor,
          color: labelTextColor,
        },
        labelBgStyle: {
          fill: labelBgColor,
          fillOpacity: 0.95,
        },
      });
    });
  }
  
  // Node placement (Left-to-Right layout)
  Object.entries(levels).forEach(([depthStr, ids]) => {
    const depth = parseInt(depthStr);
    const nodeHeight = 160; // 수직 간격
    const nodeWidth = 220; // 수평 간격 (노드 간 폭)
    const totalHeight = ids.length * nodeHeight;
    const startY = -totalHeight / 2 + nodeHeight / 2;
    
    ids.forEach((id, index) => {
      const hc = classes[id];
      const activeObjects: ('A' | 'B')[] = [];
      if (id === objectAHiddenClassId) activeObjects.push('A');
      if (id === objectBHiddenClassId) activeObjects.push('B');
      
      // Object 표시 텍스트 생성
      let objectLabel = '';
      let objectLabelColor = '';
      if (id === objectAHiddenClassId && id === objectBHiddenClassId) {
        objectLabel = 'Object A · Object B';
        objectLabelColor = 'zinc';
      } else if (id === objectAHiddenClassId) {
        objectLabel = 'Object A';
        objectLabelColor = 'blue';
      } else if (id === objectBHiddenClassId) {
        objectLabel = 'Object B';
        objectLabelColor = 'green';
      }
      
      nodes.push({
        id,
        type: 'hiddenClass',
        position: { x: depth * nodeWidth, y: startY + index * nodeHeight },
        data: { 
          label: hc.name, 
          properties: hc.properties, 
          colorKey: hc.colorKey,
          isActive: activeIds.has(id),
          activeObjects,
          objectLabel,
          objectLabelColor
        },
      });
    });
  });
  
  return { nodes, edges };
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function HiddenClassVisualizer() {
  // Theme
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // 클라이언트에서만 테마를 적용하여 하이드레이션 불일치 방지
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDarkMode = mounted && resolvedTheme === 'dark';
  
  // State
  const [hiddenClasses, setHiddenClasses] = useState<Record<string, HiddenClass>>({
    'C0': { id: 'C0', name: 'C0', properties: [], colorKey: 'indigo', transitions: {} }
  });
  
  const [objectA, setObjectA] = useState<ObjectState>({ name: 'Object A', properties: [], hiddenClassId: 'C0' });
  const [objectB, setObjectB] = useState<ObjectState>({ name: 'Object B', properties: [], hiddenClassId: 'C0' });
  const [nextClassId, setNextClassId] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // React Flow Instance
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const activeHiddenClassIds = useMemo(() => new Set([objectA.hiddenClassId, objectB.hiddenClassId]), [objectA.hiddenClassId, objectB.hiddenClassId]);
  
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(hiddenClasses, activeHiddenClassIds, objectA.hiddenClassId, objectB.hiddenClassId, isDarkMode),
    [hiddenClasses, activeHiddenClassIds, objectA.hiddenClassId, objectB.hiddenClassId, isDarkMode]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const nodeTypes = useMemo(() => ({ hiddenClass: HiddenClassNode }), []);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // Fit view on active nodes only (without animation to prevent scroll)
    if (rfInstance) {
      window.requestAnimationFrame(() => {
        // 활성화된 노드들만 필터링하여 fitView 적용
        const activeNodes = layoutedNodes.filter(node => activeHiddenClassIds.has(node.id));
        rfInstance.fitView({ 
          padding: 0.3, 
          duration: 200,
          nodes: activeNodes.length > 0 ? activeNodes : layoutedNodes
        });
      });
    }
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges, rfInstance, activeHiddenClassIds]);

  const addLog = (message: React.ReactNode, type: 'info' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const handleAddProperty = (target: 'A' | 'B', propKey: string) => {
    const targetObj = target === 'A' ? objectA : objectB;
    const setTargetObj = target === 'A' ? setObjectA : setObjectB;
    const otherObj = target === 'A' ? objectB : objectA;
    
    const currentHc = hiddenClasses[targetObj.hiddenClassId];
    
    // 1. 이미 존재하는 전이인지 확인
    if (currentHc.transitions[propKey]) {
      const nextHcId = currentHc.transitions[propKey];
      const nextHc = hiddenClasses[nextHcId];
      
      setTargetObj(prev => ({
        ...prev,
        properties: [...prev.properties, { key: propKey, value: Math.floor(Math.random() * 100) }],
        hiddenClassId: nextHcId
      }));

      const isShared = otherObj.hiddenClassId === nextHcId;
      addLog(
        <span>
          <strong>{targetObj.name}</strong>: 기존 경로를 발견했습니다. 
          <span className={cn(
            "mx-1 px-1 rounded font-mono text-xs",
            "bg-zinc-200 dark:bg-zinc-700",
            "text-zinc-800 dark:text-zinc-200"
          )}>
            {currentHc.name} → {nextHc.name}
          </span>
          로 전환합니다. {isShared ? (
            <span className={cn(
              "font-bold",
              "text-green-600 dark:text-green-400"
            )}>
              (공유 됨!)
            </span>
          ) : ''}
        </span>,
        isShared ? 'success' : 'info'
      );
    } 
    // 2. 새로운 Hidden Class 생성 필요
    else {
      const newHcId = `C${nextClassId}`;
      const newColorKey = COLOR_KEYS[nextClassId % COLOR_KEYS.length];
      
      const newHc: HiddenClass = {
        id: newHcId,
        name: newHcId,
        properties: [...currentHc.properties, propKey],
        colorKey: newColorKey,
        transitions: {}
      };

      // 상태 업데이트
      setHiddenClasses(prev => ({
        ...prev,
        [currentHc.id]: {
          ...prev[currentHc.id],
          transitions: { ...prev[currentHc.id].transitions, [propKey]: newHcId }
        },
        [newHcId]: newHc
      }));
      
      setNextClassId(prev => prev + 1);
      
      setTargetObj(prev => ({
        ...prev,
        properties: [...prev.properties, { key: propKey, value: Math.floor(Math.random() * 100) }],
        hiddenClassId: newHcId
      }));

      addLog(
        <span>
          <strong>{targetObj.name}</strong>: 새로운 전이가 필요합니다. 
          <span className={cn(
            "mx-1 px-1 rounded font-mono text-xs",
            "bg-zinc-200 dark:bg-zinc-700",
            "text-zinc-800 dark:text-zinc-200"
          )}>
            {currentHc.name}
          </span>
          에서 <strong>'{propKey}'</strong> 추가를 위한
          <span className={cn(
            "mx-1 px-1 rounded font-mono text-xs",
            "bg-zinc-200 dark:bg-zinc-700",
            "text-zinc-800 dark:text-zinc-200"
          )}>
            {newHc.name}
          </span>
          를 생성했습니다.
        </span>,
        'warning'
      );
    }
  };

  const handleReset = () => {
    setHiddenClasses({ 'C0': { id: 'C0', name: 'C0', properties: [], colorKey: 'indigo', transitions: {} } });
    setObjectA({ name: 'Object A', properties: [], hiddenClassId: 'C0' });
    setObjectB({ name: 'Object B', properties: [], hiddenClassId: 'C0' });
    setNextClassId(1);
    setLogs([]);
    addLog('시뮬레이터가 초기화되었습니다.');
  };

  return (
    <div className={cn(
      // 레이아웃
      "flex flex-col gap-1 sm:gap-2 p-3 sm:p-6 rounded-xl border",
      // 배경 및 테두리
      "bg-zinc-50 dark:bg-zinc-900/50",
      "border-zinc-200 dark:border-zinc-800"
    )}>
      {/* Header & Reset */}
      <div className="flex justify-between items-center">
        <h3 className={cn(
          "font-bold text-sm sm:text-lg",
          "text-zinc-900 dark:text-zinc-100"
        )}>
          Hidden Class
        </h3>
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
                : "border-l-orange-500 dark:border-l-orange-400"
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
            프로퍼티를 추가하여 Hidden Class 변화를 관찰해보세요.
          </motion.div>
        )}
      </AnimatePresence>

      

      {/* React Flow Visualization */}
      <div className="space-y-1.5 sm:space-y-2">

        <div 
          className={cn(
            // 레이아웃
            "rounded-lg border overflow-hidden relative",
            // 배경 및 테두리
            "bg-zinc-50 dark:bg-zinc-900",
            "border-zinc-200 dark:border-zinc-800"
          )}
          style={{ height: 'clamp(280px, 50vw, 400px)', width: '100%' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={setRfInstance}
            fitView
            minZoom={0.1}
            maxZoom={2.0}
            proOptions={{ hideAttribution: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Background 
              color={isDarkMode ? "#52525b" : "#a1a1aa"} 
              gap={16} 
              size={1} 
              className={cn(
                "transition-opacity duration-300",
                isDarkMode ? "opacity-15" : "opacity-25"
              )} 
            />
            
          </ReactFlow>
        </div>
        
      </div>
      {/* Objects Panel */}
      <div className="flex flex-row gap-1 sm:gap-2">
        <ObjectPanel 
          state={objectA} 
          hiddenClass={hiddenClasses[objectA.hiddenClassId]} 
          onAddProperty={(prop) => handleAddProperty('A', prop)}
          objectKey="A"
        />
        <ObjectPanel 
          state={objectB} 
          hiddenClass={hiddenClasses[objectB.hiddenClassId]} 
          onAddProperty={(prop) => handleAddProperty('B', prop)}
          objectKey="B"
        />
      </div>

    </div>
  );
}
