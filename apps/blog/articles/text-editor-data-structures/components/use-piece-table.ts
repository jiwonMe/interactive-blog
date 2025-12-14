"use client";

import { useState, useCallback, useMemo } from "react";

/**
 * Piece: 버퍼의 특정 영역을 참조하는 조각
 */
export interface Piece {
  id: string;
  buffer: "original" | "add";
  offset: number;
  length: number;
}

/**
 * Piece Table 상태
 */
export interface PieceTableState {
  originalBuffer: string;
  addBuffer: string;
  pieces: Piece[];
  selectedPieceId: string | null;
}

/**
 * 고유 ID 생성
 */
let pieceIdCounter = 0;
const generatePieceId = (): string => `piece-${++pieceIdCounter}`;

/**
 * 초기 텍스트로 Piece Table 상태 생성
 */
const createInitialState = (initialText: string): PieceTableState => ({
  originalBuffer: initialText,
  addBuffer: "",
  pieces: initialText.length > 0
    ? [{ id: generatePieceId(), buffer: "original", offset: 0, length: initialText.length }]
    : [],
  selectedPieceId: null,
});

/**
 * Piece Table 자료구조를 관리하는 커스텀 훅
 */
export function usePieceTable(initialText: string = "Hello World") {
  const [state, setState] = useState<PieceTableState>(() => 
    createInitialState(initialText)
  );

  /**
   * 현재 텍스트 재구성
   */
  const getText = useCallback((): string => {
    return state.pieces
      .map((piece) => {
        const buffer = piece.buffer === "original" 
          ? state.originalBuffer 
          : state.addBuffer;
        return buffer.slice(piece.offset, piece.offset + piece.length);
      })
      .join("");
  }, [state.pieces, state.originalBuffer, state.addBuffer]);

  /**
   * 텍스트를 줄 단위로 분리
   */
  const getLines = useCallback((): string[] => {
    return getText().split("\n");
  }, [getText]);

  /**
   * 논리적 위치에서 piece 인덱스와 piece 내 오프셋 찾기
   */
  const findPieceAtPosition = useCallback(
    (position: number): { pieceIndex: number; offsetInPiece: number } | null => {
      let currentPos = 0;
      for (let i = 0; i < state.pieces.length; i++) {
        const piece = state.pieces[i];
        if (position <= currentPos + piece.length) {
          return { pieceIndex: i, offsetInPiece: position - currentPos };
        }
        currentPos += piece.length;
      }
      return state.pieces.length > 0
        ? { pieceIndex: state.pieces.length - 1, offsetInPiece: state.pieces[state.pieces.length - 1].length }
        : null;
    },
    [state.pieces]
  );

  /**
   * 삽입 연산: position 위치에 text 삽입
   * 연속 입력 시 이전 piece를 확장하여 piece 수를 최소화
   */
  const insert = useCallback((position: number, text: string) => {
    if (text.length === 0) return;

    setState((prev) => {
      const newAddBuffer = prev.addBuffer + text;

      // 빈 상태에서 삽입
      if (prev.pieces.length === 0) {
        const newPiece: Piece = {
          id: generatePieceId(),
          buffer: "add",
          offset: prev.addBuffer.length,
          length: text.length,
        };
        return { ...prev, addBuffer: newAddBuffer, pieces: [newPiece] };
      }

      // 위치 찾기
      let currentPos = 0;
      let pieceIndex = 0;
      let offsetInPiece = 0;

      for (let i = 0; i < prev.pieces.length; i++) {
        const piece = prev.pieces[i];
        if (position <= currentPos + piece.length) {
          pieceIndex = i;
          offsetInPiece = position - currentPos;
          break;
        }
        currentPos += piece.length;
        if (i === prev.pieces.length - 1) {
          pieceIndex = i;
          offsetInPiece = piece.length;
        }
      }

      const targetPiece = prev.pieces[pieceIndex];

      // 연속 입력 최적화: 이전 piece 끝에 연속으로 입력하는 경우
      // - 이전 piece가 add buffer를 참조하고
      // - 그 piece가 add buffer의 끝을 참조하고 (offset + length === addBuffer.length)
      // - 현재 삽입이 그 piece의 끝에서 일어나면
      // → 새 piece를 만들지 않고 기존 piece의 length만 증가
      if (
        offsetInPiece === targetPiece.length &&
        targetPiece.buffer === "add" &&
        targetPiece.offset + targetPiece.length === prev.addBuffer.length
      ) {
        const newPieces = prev.pieces.map((p, i) =>
          i === pieceIndex
            ? { ...p, length: p.length + text.length }
            : p
        );
        return { ...prev, addBuffer: newAddBuffer, pieces: newPieces };
      }

      // 새 piece 생성
      const newPiece: Piece = {
        id: generatePieceId(),
        buffer: "add",
        offset: prev.addBuffer.length,
        length: text.length,
      };

      const newPieces = [...prev.pieces];

      // 끝에 삽입
      if (offsetInPiece === targetPiece.length) {
        newPieces.splice(pieceIndex + 1, 0, newPiece);
      }
      // 시작에 삽입
      else if (offsetInPiece === 0) {
        newPieces.splice(pieceIndex, 0, newPiece);
      }
      // 중간에 삽입 (piece 분할 필요)
      else {
        const leftPiece: Piece = {
          id: generatePieceId(),
          buffer: targetPiece.buffer,
          offset: targetPiece.offset,
          length: offsetInPiece,
        };
        const rightPiece: Piece = {
          id: generatePieceId(),
          buffer: targetPiece.buffer,
          offset: targetPiece.offset + offsetInPiece,
          length: targetPiece.length - offsetInPiece,
        };
        newPieces.splice(pieceIndex, 1, leftPiece, newPiece, rightPiece);
      }

      return { ...prev, addBuffer: newAddBuffer, pieces: newPieces };
    });
  }, []);

  /**
   * 삭제 연산: start부터 length만큼 삭제
   */
  const remove = useCallback((start: number, length: number) => {
    if (length === 0) return;

    setState((prev) => {
      const end = start + length;
      const newPieces: Piece[] = [];
      let currentPos = 0;

      for (const piece of prev.pieces) {
        const pieceStart = currentPos;
        const pieceEnd = currentPos + piece.length;

        // 삭제 범위와 겹치지 않음
        if (pieceEnd <= start || pieceStart >= end) {
          newPieces.push(piece);
        }
        // 삭제 범위가 piece 전체를 포함
        else if (start <= pieceStart && end >= pieceEnd) {
          // piece 전체 삭제 (추가하지 않음)
        }
        // 삭제 범위가 piece 일부만 포함
        else {
          // 왼쪽 부분 유지
          if (start > pieceStart) {
            newPieces.push({
              id: generatePieceId(),
              buffer: piece.buffer,
              offset: piece.offset,
              length: start - pieceStart,
            });
          }
          // 오른쪽 부분 유지
          if (end < pieceEnd) {
            newPieces.push({
              id: generatePieceId(),
              buffer: piece.buffer,
              offset: piece.offset + (end - pieceStart),
              length: pieceEnd - end,
            });
          }
        }

        currentPos = pieceEnd;
      }

      return { ...prev, pieces: newPieces };
    });
  }, []);

  /**
   * Piece 선택 (하이라이트용)
   */
  const selectPiece = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedPieceId: id }));
  }, []);

  /**
   * 초기 상태로 복원
   */
  const reset = useCallback(() => {
    pieceIdCounter = 0;
    setState(createInitialState(initialText));
  }, [initialText]);

  /**
   * 선택된 piece 정보
   */
  const selectedPiece = useMemo(() => {
    return state.pieces.find((p) => p.id === state.selectedPieceId) ?? null;
  }, [state.pieces, state.selectedPieceId]);

  /**
   * 선택된 piece의 텍스트 내 시작/끝 위치 및 버퍼 타입 계산
   */
  const selectedTextRange = useMemo((): {
    start: number;
    end: number;
    buffer: "original" | "add";
  } | null => {
    if (!state.selectedPieceId) return null;

    let start = 0;
    for (const piece of state.pieces) {
      if (piece.id === state.selectedPieceId) {
        return { start, end: start + piece.length, buffer: piece.buffer };
      }
      start += piece.length;
    }
    return null;
  }, [state.pieces, state.selectedPieceId]);

  /**
   * 각 piece가 참조하는 실제 텍스트
   */
  const getPieceText = useCallback(
    (piece: Piece): string => {
      const buffer = piece.buffer === "original" 
        ? state.originalBuffer 
        : state.addBuffer;
      return buffer.slice(piece.offset, piece.offset + piece.length);
    },
    [state.originalBuffer, state.addBuffer]
  );

  return {
    // 상태
    originalBuffer: state.originalBuffer,
    addBuffer: state.addBuffer,
    pieces: state.pieces,
    selectedPieceId: state.selectedPieceId,
    selectedPiece,
    selectedTextRange,
    // 계산된 값
    text: getText(),
    lines: getLines(),
    // 액션
    insert,
    remove,
    selectPiece,
    reset,
    // 유틸리티
    getPieceText,
  };
}

export type UsePieceTableReturn = ReturnType<typeof usePieceTable>;
