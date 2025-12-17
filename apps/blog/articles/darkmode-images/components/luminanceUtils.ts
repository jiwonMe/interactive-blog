/**
 * 휘도 계산 관련 유틸리티 함수
 */

// WCAG 2.1 상대 휘도 가중치
export const LUMINANCE_WEIGHTS = {
  r: 0.2126,
  g: 0.7152,
  b: 0.0722,
} as const;

/**
 * RGB 값을 0-1 범위로 정규화
 */
export function normalizeRGB(r: number, g: number, b: number): [number, number, number] {
  return [r / 255, g / 255, b / 255];
}

/**
 * 상대 휘도 계산
 * Y = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  const [rNorm, gNorm, bNorm] = normalizeRGB(r, g, b);
  return (
    LUMINANCE_WEIGHTS.r * rNorm +
    LUMINANCE_WEIGHTS.g * gNorm +
    LUMINANCE_WEIGHTS.b * bNorm
  );
}

/**
 * 휘도 기반 반전
 * RGB' = RGB + (1 - 2Y) * [1, 1, 1]
 */
export function invertByLuminance(r: number, g: number, b: number): [number, number, number] {
  const [rNorm, gNorm, bNorm] = normalizeRGB(r, g, b);
  const luminance = calculateLuminance(r, g, b);
  const adjustment = 1 - 2 * luminance;

  const rInverted = Math.max(0, Math.min(1, rNorm + adjustment));
  const gInverted = Math.max(0, Math.min(1, gNorm + adjustment));
  const bInverted = Math.max(0, Math.min(1, bNorm + adjustment));

  return [
    Math.round(rInverted * 255),
    Math.round(gInverted * 255),
    Math.round(bInverted * 255),
  ];
}

/**
 * RGB 값을 hex 문자열로 변환
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * 각 채널의 휘도 기여도 계산
 */
export function calculateChannelContributions(
  r: number,
  g: number,
  b: number
): { r: number; g: number; b: number; total: number } {
  const [rNorm, gNorm, bNorm] = normalizeRGB(r, g, b);
  const rContrib = LUMINANCE_WEIGHTS.r * rNorm;
  const gContrib = LUMINANCE_WEIGHTS.g * gNorm;
  const bContrib = LUMINANCE_WEIGHTS.b * bNorm;
  const total = rContrib + gContrib + bContrib;

  return { r: rContrib, g: gContrib, b: bContrib, total };
}
