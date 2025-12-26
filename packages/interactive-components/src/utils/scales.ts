import { scaleLinear, scaleTime } from '@visx/scale';

// NOTE: 반환 타입을 d.ts에 안정적으로 노출하기 위해 `any`로 고정합니다.
// (tsup dts 빌드에서 d3-scale 타입 경로가 추론에 섞이는 것을 방지)
export function linearScale(params: { domain: [number, number]; range: [number, number] }): any {
  return scaleLinear({ domain: params.domain, range: params.range });
}

// NOTE: 반환 타입을 d.ts에 안정적으로 노출하기 위해 `any`로 고정합니다.
export function timeScale(params: { domain: [Date, Date]; range: [number, number] }): any {
  return scaleTime({ domain: params.domain, range: params.range });
}






