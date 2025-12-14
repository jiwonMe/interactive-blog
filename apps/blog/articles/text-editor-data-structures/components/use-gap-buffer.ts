"use client";

import { useState, useCallback, useMemo, useRef } from "react";

/**
 * 애니메이션 상태
 */
export type GapAnimationPhase =
  | "idle"
  | "moving-gap"
  | "inserting"
  | "deleting"
  | "complete";

export interface GapAnimationState {
  phase: GapAnimationPhase;
  movingIndex: number;
  moveCount: number;
}

/**
 * Gap Buffer 상태
 */
export interface GapBufferState {
  buffer: (string | null)[];
  gapStart: number;
  gapEnd: number;
  capacity: number;
}

const INITIAL_CAPACITY = 16;
const ANIMATION_SPEED = 150;

/**
 * Gap Buffer 커스텀 훅
 */
export function useGapBuffer(initialText: string = "Hello") {
  // Gap Buffer 상태
  const [state, setState] = useState<GapBufferState>(() =>
    createGapBuffer(initialText, INITIAL_CAPACITY)
  );

  // 애니메이션 상태
  const [animation, setAnimation] = useState<GapAnimationState>({
    phase: "idle",
    movingIndex: -1,
    moveCount: 0,
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // 텍스트 추출
  const text = useMemo(() => {
    const before = state.buffer.slice(0, state.gapStart).join("");
    const after = state.buffer.slice(state.gapEnd).join("");
    return before + after;
  }, [state]);

  // 커서 위치 (gap 시작 = 논리적 커서 위치)
  const cursorPosition = state.gapStart;

  // gap 크기
  const gapSize = state.gapEnd - state.gapStart;

  /**
   * 커서 이동 (gap 이동) - 애니메이션 포함
   */
  const moveCursor = useCallback(
    (newPosition: number) => {
      if (isAnimating) return;

      const clampedPos = Math.max(
        0,
        Math.min(newPosition, state.buffer.length - gapSize)
      );
      if (clampedPos === state.gapStart) return;

      setIsAnimating(true);

      const moveRight = clampedPos > state.gapStart;
      const moveCount = Math.abs(clampedPos - state.gapStart);

      setAnimation({
        phase: "moving-gap",
        movingIndex: 0,
        moveCount,
      });

      let step = 0;
      const animate = () => {
        if (step < moveCount) {
          setState((prev) => {
            const newBuffer = [...prev.buffer];
            if (moveRight) {
              // gap 오른쪽으로 이동: gap 뒤의 문자를 gap 앞으로
              newBuffer[prev.gapStart] = newBuffer[prev.gapEnd];
              newBuffer[prev.gapEnd] = null;
              return {
                ...prev,
                buffer: newBuffer,
                gapStart: prev.gapStart + 1,
                gapEnd: prev.gapEnd + 1,
              };
            } else {
              // gap 왼쪽으로 이동: gap 앞의 문자를 gap 뒤로
              newBuffer[prev.gapEnd - 1] = newBuffer[prev.gapStart - 1];
              newBuffer[prev.gapStart - 1] = null;
              return {
                ...prev,
                buffer: newBuffer,
                gapStart: prev.gapStart - 1,
                gapEnd: prev.gapEnd - 1,
              };
            }
          });

          setAnimation((prev) => ({
            ...prev,
            movingIndex: step + 1,
          }));

          step++;
          animationRef.current = setTimeout(animate, ANIMATION_SPEED);
        } else {
          setAnimation({ phase: "complete", movingIndex: -1, moveCount: 0 });
          setLastOperation(`커서 이동: ${moveCount}칸 (O(${moveCount}))`);
          setTimeout(() => {
            setAnimation({ phase: "idle", movingIndex: -1, moveCount: 0 });
            setIsAnimating(false);
          }, 300);
        }
      };

      animationRef.current = setTimeout(animate, 100);
    },
    [isAnimating, state, gapSize]
  );

  /**
   * 문자 삽입 - 애니메이션 포함
   */
  const insert = useCallback(
    (char: string) => {
      if (isAnimating || gapSize === 0) return;

      setIsAnimating(true);
      setAnimation({ phase: "inserting", movingIndex: -1, moveCount: 0 });

      setTimeout(() => {
        setState((prev) => {
          const newBuffer = [...prev.buffer];
          newBuffer[prev.gapStart] = char;
          return {
            ...prev,
            buffer: newBuffer,
            gapStart: prev.gapStart + 1,
          };
        });

        setAnimation({ phase: "complete", movingIndex: -1, moveCount: 0 });
        setLastOperation(`삽입: "${char}" (O(1))`);

        setTimeout(() => {
          setAnimation({ phase: "idle", movingIndex: -1, moveCount: 0 });
          setIsAnimating(false);
        }, 300);
      }, ANIMATION_SPEED);
    },
    [isAnimating, gapSize]
  );

  /**
   * 문자 삭제 (backspace) - 애니메이션 포함
   */
  const deleteChar = useCallback(() => {
    if (isAnimating || state.gapStart === 0) return;

    setIsAnimating(true);
    setAnimation({ phase: "deleting", movingIndex: -1, moveCount: 0 });

    setTimeout(() => {
      setState((prev) => {
        const newBuffer = [...prev.buffer];
        newBuffer[prev.gapStart - 1] = null;
        return {
          ...prev,
          buffer: newBuffer,
          gapStart: prev.gapStart - 1,
        };
      });

      setAnimation({ phase: "complete", movingIndex: -1, moveCount: 0 });
      setLastOperation(`삭제 (O(1))`);

      setTimeout(() => {
        setAnimation({ phase: "idle", movingIndex: -1, moveCount: 0 });
        setIsAnimating(false);
      }, 300);
    }, ANIMATION_SPEED);
  }, [isAnimating, state.gapStart]);

  /**
   * 초기화
   */
  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setState(createGapBuffer(initialText, INITIAL_CAPACITY));
    setAnimation({ phase: "idle", movingIndex: -1, moveCount: 0 });
    setIsAnimating(false);
    setLastOperation(null);
  }, [initialText]);

  return {
    // 상태
    buffer: state.buffer,
    gapStart: state.gapStart,
    gapEnd: state.gapEnd,
    gapSize,
    text,
    cursorPosition,
    capacity: state.capacity,
    // 애니메이션
    animation,
    isAnimating,
    lastOperation,
    // 함수
    moveCursor,
    insert,
    deleteChar,
    reset,
  };
}

/**
 * Gap Buffer 초기 생성
 */
function createGapBuffer(text: string, capacity: number): GapBufferState {
  const buffer: (string | null)[] = new Array(capacity).fill(null);

  // 텍스트를 버퍼 앞에 배치
  for (let i = 0; i < text.length; i++) {
    buffer[i] = text[i];
  }

  return {
    buffer,
    gapStart: text.length,
    gapEnd: capacity,
    capacity,
  };
}
