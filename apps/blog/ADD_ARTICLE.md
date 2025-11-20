# 새로운 아티클(Article) 추가 가이드

이 프로젝트는 `apps/blog/articles` 디렉토리에 각 글을 독립적인 폴더로 관리하는 구조를 따릅니다.

## 1. 글 디렉토리 생성

`apps/blog/articles/` 경로 아래에 URL 슬러그로 사용할 이름으로 폴더를 생성합니다.

```bash
mkdir apps/blog/articles/my-new-post
```

## 2. content.mdx 작성

생성한 폴더 안에 `content.mdx` 파일을 만들고 다음과 같이 작성합니다. `date`는 반드시 `YYYY-MM-DD` 형식을 지켜야 합니다.

```mdx
---
title: '글 제목'
date: '2024-03-21'
description: '글에 대한 짧은 설명'
tags: ['tag1', 'tag2']
series: '시리즈 이름 (선택)'
seriesOrder: 1 (선택)
---

# 글 제목

여기에 내용을 작성합니다.

## 이미지 추가 (로컬 이미지)

이제 아티클 디렉토리 내부에 이미지를 직접 저장하고 사용할 수 있습니다 (Colocation).

1. 아티클 디렉토리 내부에 `images` 폴더를 생성하거나 이미지를 둡니다.
   예: `apps/blog/articles/my-new-post/images/screenshot.png`

2. MDX 파일에서 **상대 경로**로 참조합니다.

### 일반 마크다운 문법 (권장)
```md
![스크린샷 설명](./images/screenshot.png)
```
또는
```md
![스크린샷 설명](images/screenshot.png)
```

### Image 컴포넌트 사용
```tsx
<Image 
  src="./images/screenshot.png" 
  alt="스크린샷 설명"
  width={800}
  height={400}
/>
```

> **참고:** 빌드 시점에 `articles` 폴더의 내용이 자동으로 `public` 폴더로 복사되어 서빙됩니다.

```

## 3. 인터랙티브 컴포넌트 추가 방법

현재 구조상 아티클 전용 컴포넌트를 사용하려면 2단계 과정이 필요합니다.

### 3-1. 컴포넌트 작성
글 디렉토리 내부에 `components` 폴더를 만들고 컴포넌트를 작성합니다.

```bash
apps/blog/articles/my-new-post/
├── content.mdx
└── components/
    └── my-interactive-demo.tsx
```

### 3-2. MDX 컴포넌트 등록 (중요)
작성한 컴포넌트를 MDX에서 인식할 수 있도록 `apps/blog/components/mdx-remote.tsx`에 등록해야 합니다.

1. `apps/blog/components/mdx-remote.tsx` 파일을 엽니다.
2. 컴포넌트를 import 합니다.
   ```typescript
   import { MyInteractiveDemo } from '../articles/my-new-post/components/my-interactive-demo';
   ```
3. `components` 객체에 추가합니다.
   ```typescript
   const components = {
     // ... 기존 컴포넌트들
     MyInteractiveDemo: () => (
       <div className="my-8">
         <MyInteractiveDemo />
       </div>
     ),
   };
   ```
4. 이제 `content.mdx`에서 `<MyInteractiveDemo />` 태그를 사용할 수 있습니다.

## 4. 시리즈 작성

연재 글인 경우 `series` 필드를 동일하게 맞추고 `seriesOrder`로 순서를 지정하면, 글 상단과 하단에 시리즈 네비게이션이 자동으로 생성됩니다.

```mdx
---
title: '1편: 시작하기'
series: '나의 멋진 시리즈'
seriesOrder: 1
---
```

