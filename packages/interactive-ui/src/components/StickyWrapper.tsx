'use client';

import { styled } from '../stitches.config';

// 섹션 컨테이너: sticky 동작의 범위를 제한하는 부모 요소
export const Section = styled('section', {
  position: 'relative',
  margin: '$10 0',
  paddingBottom: '$8',
  borderBottom: '1px dashed $border',
  
  '&:last-child': {
    borderBottom: 'none',
  },
});

// 스티키 래퍼: 화면 상단에 고정되는 요소
export const StickyWrapper = styled('div', {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.95)', // 반투명 배경
  backdropFilter: 'blur(8px)',
  padding: '$4 0',
  borderBottom: '1px solid $border',
  marginBottom: '$6',
  boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)',
  
  // 모바일 대응
  '@media (max-width: 768px)': {
    top: 0,
    padding: '$3 0',
  },
});

