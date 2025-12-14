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

// 애니메이션 설정
const ANIMATION_DURATION = 500;

// 노드 위치 타입
type NodePosition = { x: number; y: number };

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
  // 이전 노드 위치 저장 (애니메이션용) - 컴포넌트 내부 ref로 이동
  const nodePositionsRef = useRef<Map<string, NodePosition>>(new Map());
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const nodePositions = nodePositionsRef.current;

    // 최초 초기화
    if (!isInitializedRef.current) {
      // 기존 내용 제거
      svg.selectAll("*").remove();

      // SVG 필터 정의
      const defs = svg.append("defs");

      // 기본 그림자
      const shadowFilter = defs.append("filter")
        .attr("id", "node-shadow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
      shadowFilter.append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 1)
        .attr("stdDeviation", 2)
        .attr("flood-color", "#00000015");

      // 탐색 글로우 효과
      const glowFilter = defs.append("filter")
        .attr("id", "search-glow")
        .attr("x", "-100%")
        .attr("y", "-100%")
        .attr("width", "300%")
        .attr("height", "300%");
      glowFilter.append("feGaussianBlur")
        .attr("stdDeviation", 4)
        .attr("result", "blur");
      glowFilter.append("feFlood")
        .attr("flood-color", "#f59e0b")
        .attr("flood-opacity", 0.4);
      glowFilter.append("feComposite")
        .attr("in2", "blur")
        .attr("operator", "in");
      const glowMerge = glowFilter.append("feMerge");
      glowMerge.append("feMergeNode");
      glowMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // 선택 그림자
      const selectFilter = defs.append("filter")
        .attr("id", "select-shadow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
      selectFilter.append("feDropShadow")
        .attr("dx", 0)
        .attr("dy", 2)
        .attr("stdDeviation", 3)
        .attr("flood-color", "#00000025");

      // 그룹 생성
      svg.append("g")
        .attr("class", "tree-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      isInitializedRef.current = true;
    }

    const g = svg.select<SVGGElement>(".tree-group");

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
      if (isCurrentSearch(nodeId)) return "#fbbf24"; // amber-400 (더 밝게)
      if (isInSearchPath(nodeId)) return "#fef9c3"; // amber-50 (더 연하게)
      if (nodeId === selectedNodeId) return "#52525b"; // zinc-600
      return "#fafafa"; // zinc-50 (더 밝게)
    };

    const getNodeStroke = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#f59e0b"; // amber-500
      if (isInSearchPath(nodeId)) return "#fcd34d"; // amber-300
      if (nodeId === selectedNodeId) return "#3f3f46"; // zinc-700
      return "#e4e4e7"; // zinc-200 (더 연하게)
    };

    const getTextFill = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "#78350f"; // amber-900 (진한 텍스트)
      if (nodeId === selectedNodeId) return "#ffffff";
      return "#52525b"; // zinc-600
    };

    const getStrokeWidth = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return 2;
      if (isInSearchPath(nodeId)) return 1.5;
      return 1;
    };

    // 필터 결정
    const getFilter = (nodeId: string) => {
      if (isCurrentSearch(nodeId)) return "url(#search-glow)";
      if (nodeId === selectedNodeId) return "url(#select-shadow)";
      return "url(#node-shadow)";
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

    // 엣지 색상/두께 헬퍼
    const getLinkStroke = (d: d3.HierarchyPointLink<TreeNodeData>) => {
      const sourceInPath = isInSearchPath(d.source.data.id);
      const targetInPath = isInSearchPath(d.target.data.id);
      if (sourceInPath && targetInPath) return "#fcd34d"; // amber-300
      return "#e4e4e7"; // zinc-200
    };

    const getLinkWidth = (d: d3.HierarchyPointLink<TreeNodeData>) => {
      const sourceInPath = isInSearchPath(d.source.data.id);
      const targetInPath = isInSearchPath(d.target.data.id);
      if (sourceInPath && targetInPath) return 2;
      return 1;
    };

    // 새 엣지 진입
    links
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#e4e4e7")
      .attr("stroke-width", 1)
      .attr("stroke-linecap", "round")
      .attr("opacity", 0)
      .attr("d", (d) => {
        const prev = getPrevPosition(d.source.data.id);
        return `M${prev.x},${prev.y}L${prev.x},${prev.y}`;
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("opacity", 1)
      .attr("d", linkGenerator)
      .attr("stroke", getLinkStroke)
      .attr("stroke-width", getLinkWidth);

    // 기존 엣지 업데이트
    links
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("d", linkGenerator)
      .attr("stroke", getLinkStroke)
      .attr("stroke-width", getLinkWidth);

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
      .attr("filter", (d) => getFilter(d.data.id))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("r", 16);

    // 리프 노드 (사각형) - 진입
    nodesEnter
      .filter((d) => d.data.type === "leaf")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", 0)
      .attr("rx", 6)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id))
      .attr("filter", (d) => getFilter(d.data.id))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("x", -26)
      .attr("y", -12)
      .attr("width", 52)
      .attr("height", 24);

    // 텍스트 - 진입
    nodesEnter
      .append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-family", "ui-monospace, monospace")
      .attr("font-weight", 500)
      .attr("fill", (d) => getTextFill(d.data.id))
      .attr("opacity", 0)
      .attr("pointer-events", "none")
      .text((d) => {
        if (d.data.type === "leaf") {
          const text = d.data.text || "";
          return text.length > 5 ? text.slice(0, 4) + "…" : text;
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
      .attr("filter", (d) => getFilter(d.data.id))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("r", 16)
      .attr("fill", (d) => getNodeFill(d.data.id))
      .attr("stroke", (d) => getNodeStroke(d.data.id))
      .attr("stroke-width", (d) => getStrokeWidth(d.data.id));

    // 리프 노드 업데이트
    nodes
      .select("rect")
      .attr("filter", (d) => getFilter(d.data.id))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("x", -26)
      .attr("y", -12)
      .attr("width", 52)
      .attr("height", 24)
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
          return text.length > 5 ? text.slice(0, 4) + "…" : text;
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

    // cleanup
    return () => {
      // 진행 중인 트랜지션 취소
      svg.selectAll("*").interrupt();
    };
  }, [data, selectedNodeId, onNodeClick, width, height, searchPathNodeIds, currentSearchNodeId]);

  // 컴포넌트 언마운트 시 초기화
  useEffect(() => {
    return () => {
      nodePositionsRef.current.clear();
      isInitializedRef.current = false;
    };
  }, []);

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
