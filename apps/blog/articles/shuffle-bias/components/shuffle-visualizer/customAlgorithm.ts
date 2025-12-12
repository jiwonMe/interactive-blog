'use client';

import type { ShuffleFunction } from '../../lib/algorithms';

export const CUSTOM_ALGO_ID = 'custom';

export const DEFAULT_CUSTOM_CODE = `// 배열을 셔플하는 함수를 작성하세요
// 함수는 array를 받아서 셔플된 새 배열을 반환해야 합니다
// 예: return [...array].sort(() => Math.random() - 0.5);

const copy = [...array];
// 여기에 셔플 로직을 작성하세요
return copy;`;

export type CreateCustomShuffleResult = {
  func: ShuffleFunction | null;
  error: string | null;
};

export const createCustomShuffle = (code: string): CreateCustomShuffleResult => {
  try {
    const func = new Function(
      'array',
      `
      ${code}
    `,
    );

    const testArray = [0, 1, 2];
    const result = func(testArray);

    if (!Array.isArray(result)) {
      throw new Error('함수는 배열을 반환해야 합니다.');
    }
    if (result.length !== testArray.length) {
      throw new Error('반환된 배열의 길이가 원본과 같아야 합니다.');
    }

    return { func: func as ShuffleFunction, error: null };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
    return { func: null, error: errorMessage };
  }
};



