# Vercel 배포 설정 가이드

## 배포 방법

이 프로젝트는 Turborepo monorepo 구조로 되어 있습니다. Vercel 배포를 위해서는 다음 설정이 필요합니다.

### 옵션 1: Vercel 대시보드에서 설정 (권장)

1. **Vercel 대시보드**에 로그인
2. 프로젝트 선택 → **Settings** → **General**
3. **Build & Development Settings** 섹션에서:
   - **Framework Preset**: `Next.js` 선택
   - **Root Directory**: `apps/blog` 입력
   - **Build Command**: 비워두기 (Vercel이 자동으로 `pnpm build` 실행)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: 비워두기 (Vercel이 자동으로 `pnpm install` 실행)

4. **Save** 버튼 클릭
5. **Deployments** 탭에서 재배포

### 옵션 2: vercel.json을 통한 설정

현재 `vercel.json`은 최소 설정만 포함하고 있습니다. 다음 내용으로 업데이트할 수 있습니다:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm turbo build --filter=blog",
  "installCommand": "pnpm install"
}
```

그리고 **Vercel 대시보드**에서:
- **Root Directory**: `apps/blog` 설정

### 환경 변수 설정

필요한 환경 변수가 있다면 Vercel 대시보드의 **Settings** → **Environment Variables**에서 추가하세요.

## 로컬에서 배포 테스트

```bash
# Vercel CLI 설치 (아직 설치하지 않았다면)
npm i -g vercel

# 배포 (처음 실행 시 프로젝트 설정 필요)
vercel

# 프로덕션 배포
vercel --prod
```

## 문제 해결

### 빌드 실패 시

1. **로컬에서 빌드 확인**:
   ```bash
   pnpm build
   ```

2. **Root Directory 확인**: Vercel 대시보드에서 `apps/blog`로 설정되어 있는지 확인

3. **빌드 로그 확인**: Vercel 대시보드의 Deployments에서 상세 로그 확인

### monorepo 관련 이슈

Vercel은 Turborepo를 자동으로 감지하지만, Root Directory 설정이 중요합니다:
- Root Directory를 `apps/blog`로 설정하면, Vercel은 해당 디렉토리를 기준으로 빌드합니다.
- `pnpm-workspace.yaml`이 루트에 있어야 workspace가 정상 작동합니다.

## 배포 상태 확인

배포가 완료되면 다음을 확인하세요:
- ✅ 모든 페이지가 정상적으로 렌더링되는지
- ✅ p5.js를 사용하는 인터랙티브 컴포넌트가 작동하는지
- ✅ MDX 콘텐츠가 제대로 표시되는지
- ✅ 이미지가 올바르게 로드되는지

