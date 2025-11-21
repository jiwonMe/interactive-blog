# 각주(Footnote) 컴포넌트 사용 가이드

블로그 글에서 각주를 사용하여 출처나 추가 설명을 표시할 수 있는 컴포넌트입니다.

## 주요 기능

- 📝 본문에 `[1]`, `[2]` 형태로 각주 참조 표시
- 📚 글 하단에 모든 각주를 자동으로 모아서 표시
- 💡 **Tooltip 미리보기**: 마우스를 올리면 각주 내용을 즉시 확인
- 🔗 **딥링크 복사**: 특정 각주 링크를 클립보드에 복사
- 🔄 **각주 재사용**: 같은 출처를 여러 곳에서 참조 가능
- 🔗 각주와 본문 간 양방향 링크 (클릭하면 이동)
- 🎨 다크 모드 지원
- ♿ 접근성 고려 (ARIA 속성 포함)

## 컴포넌트 구성

### 1. `Footnote`
본문에서 각주 참조를 표시하는 컴포넌트입니다.

```mdx
이것은 예시 문장입니다<Footnote>이것은 각주 내용입니다.</Footnote>.
```

### 2. `Footnotes`
글 하단에 모든 각주를 표시하는 컴포넌트입니다.

```mdx
<Footnotes />
```

### 3. `FootnoteProvider`
각주들을 관리하는 Context Provider입니다. (자동으로 적용되어 있어 별도 설정 불필요)

## 사용 방법

### 기본 사용

```mdx
# 제목

이것은 본문입니다<Footnote>첫 번째 각주입니다.</Footnote>.

또 다른 문장입니다<Footnote>두 번째 각주입니다.</Footnote>.

---

<Footnotes />
```

### ID 지정과 재사용

같은 출처를 여러 번 인용할 때 유용합니다:

```mdx
React는 UI 라이브러리입니다<Footnote id="react-docs">React 공식 문서: https://react.dev</Footnote>.

...중간 내용...

React를 사용하면<Footnote refId="react-docs" /> 컴포넌트 기반 개발이 가능합니다.

또한 React는<Footnote refId="react-docs" /> 선언적 프로그래밍을 지향합니다.
```

위 예제에서 `[1]`, `[1]`, `[1]` 모두 같은 각주를 참조하며, 하단에는 한 번만 표시됩니다.

### 딥링크 복사

각주 번호 옆의 🔗 아이콘을 클릭하면:
- 해당 각주로 바로 가는 URL이 클립보드에 복사됩니다
- 예: `https://example.com/posts/article#footnote-3`
- 다른 사람과 특정 각주를 공유할 때 유용합니다

## 고급 사용법

### 출처 표시

```mdx
React는 UI 라이브러리입니다<Footnote>React 공식 문서: https://react.dev</Footnote>.
```

### 긴 설명 추가

```mdx
TypeScript를 사용하면 코드의 안정성이 향상됩니다<Footnote>
TypeScript는 컴파일 시점에 타입 오류를 발견할 수 있어 런타임 에러를 줄일 수 있습니다. 
또한 IDE의 자동완성 기능을 통해 개발 생산성도 향상됩니다.
</Footnote>.
```

### 마크다운 포맷 사용

```mdx
성능 최적화가 중요합니다<Footnote>
**중요**: React.memo, useMemo, useCallback 등을 활용하세요.
자세한 내용은 [React 공식 문서](https://react.dev/reference/react/memo)를 참고하세요.
</Footnote>.
```

## 스타일링

각주는 다음과 같은 스타일로 표시됩니다:

- **참조 번호**: 파란색 상첨자 `[1]`, `[2]`
- **호버 효과**: 
  - 마우스를 올리면 색상이 진해짐
  - Tooltip으로 각주 내용 미리보기 표시
- **복사 버튼**: 호버 시 🔗 아이콘 표시, 클릭하면 ✓로 변경
- **하단 목록**: 작은 글씨로 번호와 함께 표시
- **돌아가기 링크**: 각 각주 끝에 `↩` 기호
- **복사 완료 피드백**: "링크 복사됨!" 메시지 표시

## 주의사항

1. **`<Footnotes />` 필수**: 글 하단에 반드시 `<Footnotes />` 컴포넌트를 추가해야 각주 목록이 표시됩니다.

2. **자동 번호 매기기**: 각주 번호는 자동으로 순차적으로 매겨지므로 수동으로 번호를 지정할 필요가 없습니다.

3. **중첩 사용 불가**: `Footnote` 안에 또 다른 `Footnote`를 넣을 수 없습니다.

4. **Provider 범위**: 모든 MDX 컨텐츠는 자동으로 `FootnoteProvider`로 감싸져 있습니다.

5. **재사용 시 순서**: `refId`로 참조하기 전에 `id`로 먼저 정의해야 합니다. 정의되지 않은 ID를 참조하면 콘솔에 경고가 출력됩니다.

6. **브라우저 지원**: 딥링크 복사 기능은 `navigator.clipboard` API를 사용하므로 HTTPS 환경이나 localhost에서만 작동합니다.

## 접근성

- ARIA 속성을 통해 스크린 리더 사용자도 각주를 쉽게 탐색할 수 있습니다.
- 키보드 탐색이 가능합니다 (Tab 키로 이동).
- `aria-describedby`로 각주와 본문을 연결합니다.

## 예제 파일

전체 예제는 `apps/blog/articles/footnote-example/content.mdx` 파일을 참고하세요.

