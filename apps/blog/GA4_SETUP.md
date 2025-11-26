# Google Analytics 4 (GA4) 설정 가이드

이 블로그에는 Google Analytics 4가 통합되어 있습니다.

## 📋 설정 방법

### 1. GA4 측정 ID 발급받기

1. [Google Analytics](https://analytics.google.com/) 접속
2. 왼쪽 하단 **톱니바퀴 아이콘(관리)** 클릭
3. **속성** 열에서 **데이터 스트림** 클릭
4. **웹** 선택 (또는 기존 스트림 클릭)
5. **측정 ID** 확인 (형식: `G-XXXXXXXXXX`)

### 2. 환경 변수 설정

프로젝트 루트의 `apps/blog` 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> ⚠️ `.env.local` 파일은 Git에 커밋되지 않습니다. 실제 측정 ID로 교체하세요.

### 3. 개발 서버 재시작

환경 변수 변경 후 개발 서버를 재시작해야 합니다:

```bash
pnpm dev
```

## 🔍 확인 방법

### 로컬 환경에서 테스트

1. 개발 서버 실행
2. 브라우저 개발자 도구 열기 (F12)
3. **네트워크** 탭 확인
4. `google-analytics.com` 또는 `analytics.js` 요청이 있는지 확인

### GA4 실시간 보고서 확인

1. [Google Analytics](https://analytics.google.com/) 접속
2. 왼쪽 메뉴에서 **보고서** > **실시간** 클릭
3. 현재 사이트 방문자 수 확인

## 🚀 프로덕션 배포

Vercel, Netlify 등 호스팅 플랫폼에서 환경 변수를 설정하세요:

### Vercel
1. 프로젝트 설정 > Environment Variables
2. `NEXT_PUBLIC_GA_ID` 추가
3. 값에 측정 ID 입력
4. 재배포

### Netlify
1. Site settings > Environment variables
2. `NEXT_PUBLIC_GA_ID` 추가
3. 값에 측정 ID 입력
4. 재배포

## 📊 수집되는 데이터

- 페이지 조회수 (Page Views)
- 세션 정보
- 사용자 위치 (국가/도시)
- 기기 정보 (데스크톱/모바일/태블릿)
- 브라우저 정보
- 유입 경로 (Referrer)
- Core Web Vitals (성능 지표)

## 🔒 프라이버시

- Google Analytics는 쿠키를 사용합니다
- 개인 식별 정보는 수집하지 않습니다
- GDPR 및 CCPA 준수를 위해 필요시 쿠키 동의 배너를 추가하세요

## 🛠 추가 설정

### 이벤트 트래킹

특정 액션을 추적하려면 다음과 같이 사용하세요:

```typescript
'use client';

import { sendGAEvent } from '@next/third-parties/google';

export function MyComponent() {
  const handleClick = () => {
    sendGAEvent('event', 'button_click', {
      button_name: 'subscribe',
    });
  };

  return <button onClick={handleClick}>구독하기</button>;
}
```

### 페이지뷰 자동 추적

Next.js App Router를 사용하는 경우, 페이지 전환 시 자동으로 페이지뷰가 기록됩니다.

## 🐛 문제 해결

### GA4가 작동하지 않는 경우

1. `.env.local` 파일의 측정 ID가 올바른지 확인
2. 개발 서버를 재시작했는지 확인
3. 브라우저의 광고 차단기가 GA 스크립트를 차단하는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 데이터가 보이지 않는 경우

- GA4 데이터는 **24-48시간** 후에 완전히 처리됩니다
- **실시간 보고서**에서는 즉시 확인 가능합니다

## 📚 참고 자료

- [Google Analytics 4 공식 문서](https://support.google.com/analytics/answer/9304153)
- [Next.js Third-Party Libraries](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
- [@next/third-parties 패키지](https://www.npmjs.com/package/@next/third-parties)

