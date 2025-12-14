"use client";

import { useState, useCallback, useRef } from "react";

// 고정 애니메이션 속도 (ms)
const ANIMATION_SPEED = 80;

// 기본 원본 문자열
const DEFAULT_ORIGINAL = "Hello World";

/**
 * 애니메이션 단계
 */
export type AnimationPhase =
  | "idle" // 대기 상태
  | "allocate" // 1단계: 새 배열 할당
  | "copy-before" // 2단계: 앞부분 복사
  | "insert" // 3단계: 새 텍스트 삽입
  | "copy-after" // 4단계: 뒷부분 복사
  | "complete"; // 완료

/**
 * 애니메이션 상태
 */
export interface AnimationState {
  phase: AnimationPhase;
  copiedCount: number;
  currentIndex: number;
  newArray: string[];
}

/**
 * 문자열 삽입 시각화를 위한 커스텀 훅
 */
export function useStringInsert() {
  // 원본 문자열 (사용자 입력)
  const [originalText, setOriginalText] = useState(DEFAULT_ORIGINAL);
  // 삽입할 텍스트
  const [insertText, setInsertText] = useState("Beautiful ");
  // 삽입 위치 (클릭으로 선택)
  const [insertPosition, setInsertPosition] = useState(6);

  // 원본 문자열을 배열로 변환
  const originalArray = originalText.split("");
  const stringLength = originalArray.length;

  // 애니메이션 상태
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: "idle",
    copiedCount: 0,
    currentIndex: 0,
    newArray: [],
  });

  // 애니메이션 타이머 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  /**
   * 애니메이션 정리
   */
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  /**
   * 애니메이션 리셋
   */
  const reset = useCallback(() => {
    cleanup();
    setAnimationState({
      phase: "idle",
      copiedCount: 0,
      currentIndex: 0,
      newArray: [],
    });
  }, [cleanup]);

  /**
   * 삽입 위치 선택 (셀 클릭)
   */
  const selectInsertPosition = useCallback(
    (index: number) => {
      // 애니메이션 중이면 무시
      if (isRunningRef.current) return;
      // 완료 상태면 리셋
      if (animationState.phase === "complete") {
        reset();
      }
      setInsertPosition(Math.min(index, stringLength));
    },
    [stringLength, animationState.phase, reset]
  );

  /**
   * 단계별 애니메이션 실행
   */
  const runAnimation = useCallback(() => {
    if (insertText.length === 0 || stringLength === 0) return;

    cleanup();
    isRunningRef.current = true;

    const insertArray = insertText.split("");
    const totalLength = stringLength + insertArray.length;

    // 1단계: 새 배열 할당
    setAnimationState({
      phase: "allocate",
      copiedCount: 0,
      currentIndex: 0,
      newArray: Array(totalLength).fill(""),
    });

    // 2단계: 앞부분 복사
    const copyBefore = () => {
      let index = 0;
      const copyBeforeStep = () => {
        if (!isRunningRef.current) return;
        if (index < insertPosition) {
          const currentIdx = index; // 클로저에서 현재 index 캡처
          setAnimationState((prev) => {
            const newArr = [...prev.newArray];
            newArr[currentIdx] = originalArray[currentIdx];
            return {
              phase: "copy-before",
              copiedCount: prev.copiedCount + 1,
              currentIndex: currentIdx,
              newArray: newArr,
            };
          });
          index++;
          timerRef.current = setTimeout(copyBeforeStep, ANIMATION_SPEED);
        } else {
          insertNew();
        }
      };
      // 앞부분이 있으면 즉시 첫 번째 step 실행
      if (insertPosition > 0) {
        copyBeforeStep();
      } else {
        insertNew();
      }
    };

    // 3단계: 새 텍스트 삽입
    const insertNew = () => {
      let index = 0;
      const insertStep = () => {
        if (!isRunningRef.current) return;
        if (index < insertArray.length) {
          const currentIdx = index; // 클로저에서 현재 index 캡처
          setAnimationState((prev) => {
            const newArr = [...prev.newArray];
            newArr[insertPosition + currentIdx] = insertArray[currentIdx];
            return {
              phase: "insert",
              copiedCount: prev.copiedCount,
              currentIndex: insertPosition + currentIdx,
              newArray: newArr,
            };
          });
          index++;
          timerRef.current = setTimeout(insertStep, ANIMATION_SPEED);
        } else {
          copyAfter();
        }
      };
      // 즉시 첫 번째 step 실행
      insertStep();
    };

    // 4단계: 뒷부분 복사
    const copyAfter = () => {
      let srcIndex = insertPosition;
      const copyAfterStep = () => {
        if (!isRunningRef.current) return;
        if (srcIndex < stringLength) {
          const currentSrcIdx = srcIndex; // 클로저에서 현재 index 캡처
          const destIndex = currentSrcIdx + insertArray.length;
          setAnimationState((prev) => {
            const newArr = [...prev.newArray];
            newArr[destIndex] = originalArray[currentSrcIdx];
            return {
              phase: "copy-after",
              copiedCount: prev.copiedCount + 1,
              currentIndex: destIndex,
              newArray: newArr,
            };
          });
          srcIndex++;
          timerRef.current = setTimeout(copyAfterStep, ANIMATION_SPEED);
        } else {
          // 완료
          setAnimationState((prev) => ({
            ...prev,
            phase: "complete",
          }));
          isRunningRef.current = false;
        }
      };
      // 뒷부분이 있으면 즉시 첫 번째 step 실행
      if (insertPosition < stringLength) {
        copyAfterStep();
      } else {
        // 뒷부분이 없으면 바로 완료
        setAnimationState((prev) => ({
          ...prev,
          phase: "complete",
        }));
        isRunningRef.current = false;
      }
    };

    // 애니메이션 시작 (allocate 후 잠시 대기)
    timerRef.current = setTimeout(copyBefore, ANIMATION_SPEED * 2);
  }, [cleanup, stringLength, insertPosition, insertText, originalArray]);

  return {
    // 원본 텍스트
    originalText,
    setOriginalText,
    // 삽입 텍스트
    insertText,
    setInsertText,
    // 삽입 위치
    insertPosition,
    selectInsertPosition,
    // 데이터
    originalArray,
    stringLength,
    // 애니메이션
    animationState,
    runAnimation,
    reset,
    isRunning: isRunningRef.current,
  };
}
