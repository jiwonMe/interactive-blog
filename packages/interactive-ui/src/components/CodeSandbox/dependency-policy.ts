/**
 * npm 의존성 allowlist 정책
 *
 * MDX에서 사용 가능한 npm 패키지 목록을 정의합니다.
 * 보안 및 성능을 위해 허용된 패키지만 Sandpack에 전달됩니다.
 */

/**
 * 기본 허용 패키지 목록
 * 필요에 따라 확장 가능
 */
export const DEFAULT_ALLOWED_DEPENDENCIES = [
  // React 생태계
  'react',
  'react-dom',

  // 유틸리티
  'lodash',
  'lodash-es',
  'clsx',
  'date-fns',
  'uuid',

  // 스타일링
  'styled-components',
  '@emotion/react',
  '@emotion/styled',
  'tailwind-merge',

  // 상태 관리
  'zustand',
  'jotai',
  'immer',

  // 애니메이션
  'framer-motion',
  'motion',

  // 데이터 시각화
  'd3',
  'recharts',

  // 아이콘
  'lucide-react',
  'react-icons',
] as const;

export type AllowedDependency = (typeof DEFAULT_ALLOWED_DEPENDENCIES)[number];

export interface DependencyFilterResult {
  /** 허용된 의존성 (Sandpack에 전달할 것) */
  allowed: Record<string, string>;
  /** 차단된 의존성 (경고 표시용) */
  blocked: string[];
}

/**
 * 요청된 의존성을 allowlist 기반으로 필터링합니다.
 *
 * @param requested - 요청된 의존성 맵 (패키지명 -> 버전)
 * @param allowlist - 허용할 패키지 목록 (기본값: DEFAULT_ALLOWED_DEPENDENCIES)
 * @returns 허용/차단된 의존성 정보
 */
export function filterDependencies(
  requested: Record<string, string> | undefined,
  allowlist: readonly string[] = DEFAULT_ALLOWED_DEPENDENCIES
): DependencyFilterResult {
  if (!requested || Object.keys(requested).length === 0) {
    return { allowed: {}, blocked: [] };
  }

  const allowlistSet = new Set(allowlist);
  const allowed: Record<string, string> = {};
  const blocked: string[] = [];

  for (const [pkg, version] of Object.entries(requested)) {
    // 패키지명에서 스코프를 포함해 정확히 매칭
    if (allowlistSet.has(pkg)) {
      allowed[pkg] = version;
    } else {
      blocked.push(pkg);
    }
  }

  // 차단된 패키지가 있으면 콘솔에 경고
  if (blocked.length > 0) {
    console.warn(
      `[CodeSandbox] 다음 의존성이 allowlist에 없어 제외되었습니다: ${blocked.join(', ')}`
    );
  }

  return { allowed, blocked };
}

