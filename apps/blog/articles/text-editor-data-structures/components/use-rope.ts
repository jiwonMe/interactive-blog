"use client";

import { useState, useCallback, useMemo, useRef } from "react";

/**
 * Rope 노드 타입
 */
export interface RopeNode {
  id: string;
  type: "internal" | "leaf";
  // internal 노드: 서브트리 전체 길이
  // leaf 노드: 문자열 길이
  weight: number;
  // leaf 노드만 가짐
  text?: string;
  // internal 노드만 가짐
  left?: RopeNode;
  right?: RopeNode;
}

/**
 * 탐색 경로의 각 단계 정보
 */
export interface SearchStep {
  nodeId: string;
  position: number;
  weight: number;
  direction: "left" | "right" | "found";
  comparison: string;
}

/**
 * D3 시각화를 위한 트리 노드
 */
export interface TreeNodeData {
  id: string;
  name: string;
  type: "internal" | "leaf";
  weight: number;
  text?: string;
  children?: TreeNodeData[];
}

let nodeIdCounter = 0;
const generateNodeId = (): string => `node-${++nodeIdCounter}`;

/**
 * 리프 노드 생성
 */
function createLeaf(text: string): RopeNode {
  return {
    id: generateNodeId(),
    type: "leaf",
    weight: text.length,
    text,
  };
}

/**
 * 내부 노드 생성 (두 자식 연결)
 */
function createInternal(left: RopeNode, right: RopeNode): RopeNode {
  return {
    id: generateNodeId(),
    type: "internal",
    weight: getLength(left),
    left,
    right,
  };
}

/**
 * 노드의 전체 길이 계산
 */
function getLength(node: RopeNode): number {
  if (node.type === "leaf") {
    return node.weight;
  }
  const leftLen = node.left ? getLength(node.left) : 0;
  const rightLen = node.right ? getLength(node.right) : 0;
  return leftLen + rightLen;
}

/**
 * Rope에서 전체 문자열 추출
 */
function collectText(node: RopeNode): string {
  if (node.type === "leaf") {
    return node.text || "";
  }
  const leftText = node.left ? collectText(node.left) : "";
  const rightText = node.right ? collectText(node.right) : "";
  return leftText + rightText;
}

/**
 * 트리 높이 계산
 */
function getHeight(node: RopeNode | undefined): number {
  if (!node) return 0;
  if (node.type === "leaf") return 1;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

/**
 * 노드 개수 계산
 */
function countNodes(node: RopeNode | undefined): number {
  if (!node) return 0;
  if (node.type === "leaf") return 1;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

/**
 * Split: 특정 위치에서 Rope를 둘로 나눔
 */
function split(
  node: RopeNode,
  index: number
): [RopeNode | null, RopeNode | null] {
  if (node.type === "leaf") {
    const text = node.text || "";
    if (index <= 0) return [null, node];
    if (index >= text.length) return [node, null];
    const left = createLeaf(text.slice(0, index));
    const right = createLeaf(text.slice(index));
    return [left, right];
  }

  const leftLen = node.left ? getLength(node.left) : 0;

  if (index <= 0) {
    return [null, node];
  }
  if (index >= leftLen + (node.right ? getLength(node.right) : 0)) {
    return [node, null];
  }

  if (index <= leftLen) {
    // 왼쪽 서브트리에서 분할
    const [ll, lr] = node.left ? split(node.left, index) : [null, null];
    const newRight = lr && node.right ? createInternal(lr, node.right) : lr || node.right;
    return [ll, newRight || null];
  } else {
    // 오른쪽 서브트리에서 분할
    const [rl, rr] = node.right ? split(node.right, index - leftLen) : [null, null];
    const newLeft = node.left && rl ? createInternal(node.left, rl) : node.left || rl;
    return [newLeft || null, rr];
  }
}

/**
 * Concat: 두 Rope를 연결
 */
function concat(left: RopeNode | null, right: RopeNode | null): RopeNode | null {
  if (!left) return right;
  if (!right) return left;
  return createInternal(left, right);
}

/**
 * Insert: 특정 위치에 문자열 삽입
 */
function insert(
  root: RopeNode | null,
  index: number,
  text: string
): RopeNode {
  const newNode = createLeaf(text);
  if (!root) return newNode;

  const [left, right] = split(root, index);
  return concat(concat(left, newNode), right)!;
}

/**
 * RopeNode를 D3 시각화용 트리 데이터로 변환
 */
function toTreeData(node: RopeNode): TreeNodeData {
  if (node.type === "leaf") {
    return {
      id: node.id,
      name: `"${node.text}"`,
      type: "leaf",
      weight: node.weight,
      text: node.text,
    };
  }

  const children: TreeNodeData[] = [];
  if (node.left) children.push(toTreeData(node.left));
  if (node.right) children.push(toTreeData(node.right));

  return {
    id: node.id,
    name: String(getLength(node)),
    type: "internal",
    weight: node.weight,
    children: children.length > 0 ? children : undefined,
  };
}

/**
 * 초기 Rope 생성 (문자열을 균형잡힌 트리로)
 */
function createBalancedRope(text: string, chunkSize: number = 5): RopeNode {
  if (text.length <= chunkSize) {
    return createLeaf(text);
  }

  const mid = Math.floor(text.length / 2);
  const left = createBalancedRope(text.slice(0, mid), chunkSize);
  const right = createBalancedRope(text.slice(mid), chunkSize);
  return createInternal(left, right);
}

/**
 * 삽입 위치까지의 탐색 경로 계산
 * O(log n) 탐색 과정을 단계별로 기록
 */
function calculateSearchPath(
  node: RopeNode,
  index: number,
  path: SearchStep[] = []
): SearchStep[] {
  if (node.type === "leaf") {
    path.push({
      nodeId: node.id,
      position: index,
      weight: node.weight,
      direction: "found",
      comparison: `리프 도달: 위치 ${index}`,
    });
    return path;
  }

  const leftLen = node.left ? getLength(node.left) : 0;

  if (index <= leftLen && node.left) {
    path.push({
      nodeId: node.id,
      position: index,
      weight: leftLen,
      direction: "left",
      comparison: `${index} ≤ ${leftLen} → 왼쪽`,
    });
    return calculateSearchPath(node.left, index, path);
  } else if (node.right) {
    path.push({
      nodeId: node.id,
      position: index,
      weight: leftLen,
      direction: "right",
      comparison: `${index} > ${leftLen} → 오른쪽 (${index} - ${leftLen} = ${index - leftLen})`,
    });
    return calculateSearchPath(node.right, index - leftLen, path);
  }

  return path;
}

const INITIAL_TEXT = "Hello World";
const SEARCH_ANIMATION_SPEED = 600;

/**
 * Rope 자료구조를 관리하는 커스텀 훅
 */
export function useRope() {
  const [root, setRoot] = useState<RopeNode>(() =>
    createBalancedRope(INITIAL_TEXT)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  // 탐색 애니메이션 상태
  const [searchPath, setSearchPath] = useState<SearchStep[]>([]);
  const [currentSearchStep, setCurrentSearchStep] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 전체 텍스트
  const text = useMemo(() => collectText(root), [root]);

  // 트리 데이터 (D3용)
  const treeData = useMemo(() => toTreeData(root), [root]);

  // 트리 높이
  const height = useMemo(() => getHeight(root), [root]);

  // 노드 개수
  const nodeCount = useMemo(() => countNodes(root), [root]);

  // 현재 탐색 단계 정보
  const currentStep = useMemo(() => {
    if (currentSearchStep < 0 || currentSearchStep >= searchPath.length) {
      return null;
    }
    return searchPath[currentSearchStep];
  }, [searchPath, currentSearchStep]);

  // 탐색 경로상의 노드 ID 목록 (하이라이트용)
  const searchPathNodeIds = useMemo(() => {
    if (currentSearchStep < 0) return [];
    return searchPath.slice(0, currentSearchStep + 1).map((s) => s.nodeId);
  }, [searchPath, currentSearchStep]);

  /**
   * 탐색 애니메이션 시작
   */
  const startSearch = useCallback(
    (index: number, onComplete?: () => void) => {
      // 이전 애니메이션 정리
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // 탐색 경로 계산
      const path = calculateSearchPath(root, index);
      setSearchPath(path);
      setCurrentSearchStep(-1);
      setIsSearching(true);

      // 단계별 애니메이션
      let step = 0;
      const animate = () => {
        if (step < path.length) {
          setCurrentSearchStep(step);
          step++;
          searchTimeoutRef.current = setTimeout(animate, SEARCH_ANIMATION_SPEED);
        } else {
          // 애니메이션 완료
          setIsSearching(false);
          if (onComplete) {
            searchTimeoutRef.current = setTimeout(() => {
              onComplete();
              // 탐색 상태 초기화
              setSearchPath([]);
              setCurrentSearchStep(-1);
            }, SEARCH_ANIMATION_SPEED);
          }
        }
      };

      // 첫 단계 시작
      searchTimeoutRef.current = setTimeout(animate, 100);
    },
    [root]
  );

  /**
   * 탐색 후 삽입 (애니메이션 포함)
   */
  const searchAndInsert = useCallback(
    (index: number, newText: string) => {
      if (newText.length === 0 || isSearching) return;

      startSearch(index, () => {
        setRoot((prev) => insert(prev, index, newText));
        setLastOperation(`삽입: "${newText}" at ${index}`);
      });
    },
    [isSearching, startSearch]
  );

  /**
   * 삽입 연산 (애니메이션 없이)
   */
  const insertText = useCallback((index: number, newText: string) => {
    if (newText.length === 0) return;
    setRoot((prev) => insert(prev, index, newText));
    setLastOperation(`삽입: "${newText}" at ${index}`);
  }, []);

  /**
   * 연결 연산 (끝에 추가)
   */
  const appendText = useCallback((newText: string) => {
    if (newText.length === 0) return;
    const newNode = createLeaf(newText);
    setRoot((prev) => concat(prev, newNode)!);
    setLastOperation(`연결: "${newText}"`);
  }, []);

  /**
   * 노드 선택
   */
  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  /**
   * 초기화
   */
  const reset = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    nodeIdCounter = 0;
    setRoot(createBalancedRope(INITIAL_TEXT));
    setSelectedNodeId(null);
    setLastOperation(null);
    setSearchPath([]);
    setCurrentSearchStep(-1);
    setIsSearching(false);
  }, []);

  return {
    root,
    text,
    treeData,
    height,
    nodeCount,
    selectedNodeId,
    lastOperation,
    // 탐색 관련
    isSearching,
    searchPath,
    currentStep,
    searchPathNodeIds,
    // 함수
    insertText,
    appendText,
    selectNode,
    reset,
    searchAndInsert,
    startSearch,
  };
}
