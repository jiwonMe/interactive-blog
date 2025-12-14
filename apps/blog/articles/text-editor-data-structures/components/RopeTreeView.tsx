"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { cn } from "../../../lib/utils";
import type { TreeNodeData } from "./use-rope";

interface RopeTreeViewProps {
  data: TreeNodeData;
  selectedNodeId: string | null;
  onNodeClick: (id: string | null) => void;
  width?: number;
  height?: number;
  // 탐색 경로 하이라이트
  searchPathNodeIds?: string[];
  currentSearchNodeId?: string | null;
}

// 이전 노드 위치 저장 (애니메이션용)
type NodePosition = { x: number; y: number };
const nodePositions = new Map<string, NodePosition>();

// 애니메이션 설정
const ANIMATION_DURATION = 500;

/**
 * D3.js를 이용한 Rope 트리 시각화 컴포넌트
 */
export function RopeTreeView({
  data,
  selectedNodeId,
  onNodeClick,
  width = 500,
  height = 300,
  searchPathNodeIds = [],
  currentSearchNodeId = null,
}: RopeTreeViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 최초 실행 시 그룹 생성
    if (!gRef.current) {
      gRef.current = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }
    const g = gRef.current;

    // 트리 레이아웃 생성
    const treeLayout = d3.tree<TreeNodeData>().size([innerWidth, innerHeight]);

    // 계층 구조 생성
    const root = d3.hierarchy(data);
    const treeData = treeLayout(root);

    // 노드 상태 확인 헬퍼
    const isInSearchPath = (nodeId: string) => searchPathNodeIds.includes(nodeId);
    const isCurrentSearch = (nodeId: string) => nodeId === currentSearchNodeId;

    // 노드 색상 결정 (기본 흑백, 탐색은 amber)
    const getNodeFill = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#f59e0b"; // amber-500
      if (isInSearchPath(nodeId)) return "#fef3c7"; // amber-100
      if (nodeId === selectedNodeId) return "#71717a"; // zinc-500
      return "#f4f4f5"; // zinc-100
    };

    const getNodeStroke = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#d97706"; // amber-600
      if (isInSearchPath(nodeId)) return "#fbbf24"; // amber-400
      if (nodeId === selectedNodeId) return "#3f3f46"; // zinc-700
      return "#a1a1aa"; // zinc-400
    };

    const getTextFill = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#ffffff";
      if (nodeId === selectedNodeId) return "#ffffff";
      return "#3f3f46"; // zinc-700
    };

    const getStrokeWidth = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return 3;
      if (isInSearchPath(nodeId)) return 2;
      return 1.5;
    };

    // 루트 위치 (새 노드 진입점)
    const rootX = innerWidth / 2;
    const rootY = 0;

    // 이전 위치 가져오기 (없으면 루트 위치)
    const getPrevPosition = (nodeId: string): NodePosition => {
      return nodePositions.get(nodeId) || { x: rootX, y: rootY };
    };

    // ===== 엣지 (Links) =====
    const linkGenerator = d3
      .linkVertical<d3.HierarchyPointLink<TreeNodeData>, d3.HierarchyPointNode<TreeNodeData>>()
      .x((d) => d.x)
      .y((d) => d.y);

    const links = g
      .selectAll<SVGPathElement, d3.HierarchyPointLink<TreeNodeData>>(".link")
      .data(treeData.links(), (d) => `${d.source.data.id}-${d.target.data.id}`);

    // 새 엣지 진입
    links
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#d4d4d8")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0)
      .attr("d", (d) => {
        // 시작점에서 시작
        const prev = getPrevPosition(d.source.data.id);
        return `M${prev.x},${prev.y}L${prev.x},${prev.y}`;
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("opacity", 1)
      .attr("d", linkGenerator)
      .attr("stroke", (d) => {
        const sourceInPath = isInSearchPath(d.source.data.id);
        const targetInPath = isInSearchPath(d.target.data.id);
        if (sourceInPath && targetInPath) return "#fbbf24"; // amber-400
        return "#d4d4d8"; // zinc-300
      })
      .attr("stroke-width", (d) => {
        const sourceInPath = isInSearchPath(d.source.data.id);
        const targetInPath = isInSearchPath(d.target.data.id);
        if (sourceInPath && targetInPath) return 2.5;
        return 1.5;
      });

    // 기존 엣지 업데이트
    links
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("d", linkGenerator)
      .attr("stroke", (d) => {
        const sourceInPath = isInSearchPath(d.source.data.id);
        const targetInPath = isInSearchPath(d.target.data.id);
        if (sourceInPath && targetInPath) return "#fbbf24"; // amber-400
        return "#d4d4d8"; // zinc-300
      })
      .attr("stroke-width", (d) => {
        const sourceInPath = isInSearchPath(d.source.data.id);
        const targetInPath = isInSearchPath(d.target.data.id);
        if (sourceInPath && targetInPath) return 2.5;
        return 1.5;
      });

    // 삭제되는 엣지
    links
      .exit()
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("opacity", 0)
      .remove();

    // ===== 노드 그룹 =====
    const nodes = g
      .selectAll<SVGGElement, d3.HierarchyPointNode<TreeNodeData>>(".node")
      .data(treeData.descendants(), (d) => d.data.id);

    // 새 노드 진입
    const nodesEnter = nodes
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => {
        const prev = getPrevPosition(d.data.id);
        return `translate(${prev.x},${prev.y})`;
      })
      .attr("opacity", 0)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d.data.id === selectedNodeId ? null : d.data.id);
      });

    // 내부 노드 (원형) - 진입
    nodesEnter
      .filter((d) => d.data.type === "internal")
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("r", (d) => isCurrentSearch(d.data.id) ? 22 : 18);

    // 리프 노드 (사각형) - 진입
    nodesEnter
      .filter((d) => d.data.type === "leaf")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", 0)
      .attr("rx", 4)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("x", (d) => isCurrentSearch(d.data.id) ? -32 : -28)
      .attr("y", (d) => isCurrentSearch(d.data.id) ? -18 : -14)
      .attr("width", (d) => isCurrentSearch(d.data.id) ? 64 : 56)
      .attr("height", (d) => isCurrentSearch(d.data.id) ? 36 : 28);

    // 텍스트 - 진입
    nodesEnter
      .append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-family", "monospace")
      .attr("fill", (d) => getTextFill(d.data.id))
      .attr("opacity", 0)
      .text((d) => {
        if (d.data.type === "leaf") {
          const text = d.data.text || "";
          return text.length > 6 ? text.slice(0, 5) + "…" : text;
        }
        return d.data.name;
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("opacity", 1);

    // 노드 진입 애니메이션
    nodesEnter
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("opacity", 1);

    // 기존 노드 업데이트
    nodes
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // 내부 노드 업데이트
    nodes
      .select("circle")
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("r", (d) => isCurrentSearch(d.data.id) ? 22 : 18)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id));

    // 리프 노드 업데이트
    nodes
      .select("rect")
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("x", (d) => isCurrentSearch(d.data.id) ? -32 : -28)
      .attr("y", (d) => isCurrentSearch(d.data.id) ? -18 : -14)
      .attr("width", (d) => isCurrentSearch(d.data.id) ? 64 : 56)
      .attr("height", (d) => isCurrentSearch(d.data.id) ? 36 : 28)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id));

    // 텍스트 업데이트
    nodes
      .select("text")
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("fill", (d) => getTextFill(d.data.id))
      .text((d) => {
        if (d.data.type === "leaf") {
          const text = d.data.text || "";
          return text.length > 6 ? text.slice(0, 5) + "…" : text;
        }
        return d.data.name;
      });

    // 삭제되는 노드
    nodes
      .exit()
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("opacity", 0)
      .attr("transform", `translate(${rootX},${rootY})`)
      .remove();

    // 현재 위치 저장 (다음 애니메이션용)
    treeData.descendants().forEach((d) => {
      nodePositions.set(d.data.id, { x: d.x, y: d.y });
    });
  }, [data, selectedNodeId, onNodeClick, width, height, searchPathNodeIds, currentSearchNodeId]);

  return (
    <div
      className={cn(
        // layout
        "rounded-lg overflow-hidden",
        // border
        "border border-zinc-200 dark:border-zinc-700"
      )}
    >
      {/* 라벨 */}
      <div
        className={cn(
          // layout
          "px-3 py-1.5",
          // background
          "bg-zinc-100 dark:bg-zinc-800",
          // border
          "border-b border-zinc-200 dark:border-zinc-700"
        )}
      >
        <span
          className={cn(
            // typography
            "text-xs font-medium",
            // color
            "text-zinc-500 dark:text-zinc-400"
          )}
        >
          Rope 트리 구조
          <span className="ml-2 text-zinc-400">
            (노드를 클릭하여 선택)
          </span>
        </span>
      </div>

      {/* SVG 영역 */}
      <div
        className={cn(
          // layout
          "flex items-center justify-center p-4",
          // background
          "bg-white dark:bg-zinc-900"
        )}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
        />
      </div>
    </div>
  );
}
