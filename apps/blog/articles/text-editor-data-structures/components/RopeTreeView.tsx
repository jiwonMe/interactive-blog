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

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 트리 레이아웃 생성
    const treeLayout = d3.tree<TreeNodeData>().size([innerWidth, innerHeight]);

    // 계층 구조 생성
    const root = d3.hierarchy(data);
    const treeData = treeLayout(root);

    // 노드 상태 확인 헬퍼
    const isInSearchPath = (nodeId: string) => searchPathNodeIds.includes(nodeId);
    const isCurrentSearch = (nodeId: string) => nodeId === currentSearchNodeId;

    // 노드 색상 결정 (흑백 기반, 현재 탐색 노드만 약간 강조)
    const getNodeFill = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#52525b"; // zinc-600 (현재 탐색 중)
      if (isInSearchPath(nodeId)) return "#e4e4e7"; // zinc-200 (탐색 경로)
      if (nodeId === selectedNodeId) return "#71717a"; // zinc-500 (선택됨)
      return "#f4f4f5"; // zinc-100 (기본)
    };

    const getNodeStroke = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#27272a"; // zinc-800
      if (isInSearchPath(nodeId)) return "#71717a"; // zinc-500
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

    // 엣지 그리기
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d) => {
        // 탐색 경로의 엣지 하이라이트
        const sourceInPath = isInSearchPath(d.source.data.id);
        const targetInPath = isInSearchPath(d.target.data.id);
        if (sourceInPath && targetInPath) return "#71717a"; // zinc-500
        return "#d4d4d8"; // zinc-300
      })
      .attr("stroke-width", (d) => {
        const sourceInPath = isInSearchPath(d.source.data.id);
        const targetInPath = isInSearchPath(d.target.data.id);
        if (sourceInPath && targetInPath) return 2;
        return 1.5;
      })
      .attr(
        "d",
        d3
          .linkVertical<d3.HierarchyPointLink<TreeNodeData>, d3.HierarchyPointNode<TreeNodeData>>()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    // 노드 그룹
    const nodes = g
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d.data.id === selectedNodeId ? null : d.data.id);
      });

    // 내부 노드 (원형)
    nodes
      .filter((d) => d.data.type === "internal")
      .append("circle")
      .attr("r", (d) => isCurrentSearch(d.data.id) ? 22 : 18)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id))
      .style("transition", "all 0.3s ease");

    // 리프 노드 (사각형)
    nodes
      .filter((d) => d.data.type === "leaf")
      .append("rect")
      .attr("x", (d) => isCurrentSearch(d.data.id) ? -32 : -28)
      .attr("y", (d) => isCurrentSearch(d.data.id) ? -18 : -14)
      .attr("width", (d) => isCurrentSearch(d.data.id) ? 64 : 56)
      .attr("height", (d) => isCurrentSearch(d.data.id) ? 36 : 28)
      .attr("rx", 4)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id))
      .style("transition", "all 0.3s ease");

    // 노드 텍스트
    nodes
      .append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-family", "monospace")
      .attr("fill", (d) => getTextFill(d.data.id))
      .text((d) => {
        if (d.data.type === "leaf") {
          const text = d.data.text || "";
          return text.length > 6 ? text.slice(0, 5) + "…" : text;
        }
        return d.data.name;
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
