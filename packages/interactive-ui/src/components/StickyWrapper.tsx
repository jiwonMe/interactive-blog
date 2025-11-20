'use client';

import { styled } from '../stitches.config';

// 섹션 컨테이너: sticky 동작의 범위를 제한하는 부모 요소
export const Section = styled('section', {
  position: 'relative',
  margin: '$10 0',
  paddingBottom: '$8',
  borderBottom: '1px dashed $border',
  /* Flexbox로 2단 컬럼 레이아웃 구현 */
  display: 'flex',
  alignItems: 'flex-start', // sticky 요소가 위에서부터 시작되도록 함
  gap: '$8', // 컬럼 사이 간격
  
  '&:last-child': {
    borderBottom: 'none',
  },

  // 모바일 대응
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '$6',
  },
});

// 스티키 래퍼: 화면 상단에 고정되는 요소
export const StickyWrapper = styled('div', {
  position: 'sticky',
  // 헤더 높이(64px) + 여백(16px) = 80px
  top: '80px',
  zIndex: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.95)', // 반투명 배경
  backdropFilter: 'blur(8px)',
  padding: '$4 0',
  borderBottom: '1px solid $border',
  marginBottom: '$6',
  boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  
  variants: {
    side: {
      full: {
        width: '100%',
        order: 0,
      },
      left: {
        width: '45%',
        order: -1, // Content보다 왼쪽
        marginRight: 0, // flex gap으로 처리
        marginBottom: 0,
        padding: '$4',
        border: '1px solid $border',
        borderBottom: '1px solid $border',
        borderRadius: '$2',
      },
      right: {
        width: '45%',
        order: 1, // Content보다 오른쪽
        marginLeft: 0, // flex gap으로 처리
        marginBottom: 0,
        padding: '$4',
        border: '1px solid $border',
        borderBottom: '1px solid $border',
        borderRadius: '$2',
      }
    }
  },

  defaultVariants: {
    side: 'full'
  },
  
  // 모바일 대응
  '@media (max-width: 768px)': {
    top: '64px',
    padding: '$3 0',
    width: '100% !important',
    order: 0, // 순서 초기화
    position: 'relative', // sticky 해제
    margin: '0 0 $6 0 !important',
    border: 'none',
    borderBottom: '1px solid $border',
    borderRadius: 0,
  },
});

// 본문 콘텐츠 래퍼: 텍스트가 들어가는 영역
export const Content = styled('div', {
  flex: 1, // 남은 공간 차지 (55% 정도)
  minWidth: 0, // flex item overflow 방지
  
  // 모바일 대응
  '@media (max-width: 768px)': {
    width: '100%',
  },
});
