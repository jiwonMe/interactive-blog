'use client';

import React from 'react';
import { styled } from '../stitches.config';

// 카드 루트 컨테이너: 링크를 감싸는 카드 스타일
const CardRoot = styled('a', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$background',
  borderRadius: '$3',
  border: '1px solid $border',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  
  '&:hover': {
    borderColor: '$primary',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
    transform: 'translateY(-2px)',
  },
  
  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '2px',
  },
  
  variants: {
    // 카드 크기 변형
    size: {
      small: {
        maxWidth: '280px',
      },
      medium: {
        maxWidth: '400px',
      },
      large: {
        maxWidth: '600px',
      },
    },
  },
  
  defaultVariants: {
    size: 'medium',
  },
});

// 썸네일 이미지 컨테이너
const ImageContainer = styled('div', {
  width: '100%',
  backgroundColor: '$zinc100',
  overflow: 'hidden',
  position: 'relative',
  flexShrink: 0,
  
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  variants: {
    // 크기에 따른 이미지 높이
    size: {
      small: {
        height: '120px',
      },
      medium: {
        height: '160px',
      },
      large: {
        height: '240px',
      },
    },
  },
  
  defaultVariants: {
    size: 'medium',
  },
});

// 콘텐츠 영역
const ContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  flex: 1,
  minWidth: 0,
  
  variants: {
    // 크기에 따른 패딩
    size: {
      small: {
        padding: '$3',
      },
      medium: {
        padding: '$4',
      },
      large: {
        padding: '$6',
      },
    },
  },
  
  defaultVariants: {
    size: 'medium',
  },
});

// 제목 영역: 아이콘과 제목을 함께 표시
const TitleWrapper = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$2',
});

// 제목 텍스트
const Title = styled('h3', {
  fontWeight: 600,
  color: '$text',
  margin: 0,
  lineHeight: 1.4,
  flex: 1,
  
  variants: {
    // 크기에 따른 폰트 크기
    size: {
      small: {
        fontSize: '$3',
      },
      medium: {
        fontSize: '$4',
      },
      large: {
        fontSize: '$5',
      },
    },
  },
  
  defaultVariants: {
    size: 'medium',
  },
});

// 외부 링크 아이콘
const ExternalIcon = styled('svg', {
  width: '16px',
  height: '16px',
  color: '$textSecondary',
  flexShrink: 0,
  marginTop: '2px',
  transition: 'color 0.2s ease',
  
  [`${CardRoot}:hover &`]: {
    color: '$primary',
  },
});

// 설명 텍스트
const Description = styled('p', {
  color: '$textSecondary',
  margin: 0,
  lineHeight: 1.6,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  
  variants: {
    // 크기에 따른 폰트 크기와 줄 수
    size: {
      small: {
        fontSize: '$2',
        WebkitLineClamp: 2,
      },
      medium: {
        fontSize: '$3',
        WebkitLineClamp: 2,
      },
      large: {
        fontSize: '$3',
        WebkitLineClamp: 3,
      },
    },
  },
  
  defaultVariants: {
    size: 'medium',
  },
});

// URL 표시 영역
const UrlText = styled('span', {
  fontSize: '$2',
  color: '$textSecondary',
  marginTop: 'auto',
  fontFamily: 'monospace',
});

// 외부 링크 아이콘 SVG 컴포넌트
const ExternalLinkIcon = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const iconSize = size === 'small' ? '14px' : size === 'large' ? '20px' : '16px';
  
  return (
    <ExternalIcon
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      css={{ width: iconSize, height: iconSize }}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </ExternalIcon>
  );
};

export interface LinkCardProps {
  href: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LinkCard: React.FC<LinkCardProps> = ({
  href,
  title,
  description,
  image,
  imageAlt,
  size = 'medium',
}) => {
  // URL에서 도메인 추출
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // props 검증 및 정규화: MDX에서 전달되는 문자열 props를 처리
  const normalizedSize = (['small', 'medium', 'large'].includes(size as string) 
    ? size 
    : 'medium') as 'small' | 'medium' | 'large';

  return (
    <CardRoot 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      size={normalizedSize}
    >
      {image && (
        <ImageContainer size={normalizedSize}>
          <img src={image} alt={imageAlt || title} />
        </ImageContainer>
      )}
      <ContentWrapper size={normalizedSize}>
        <TitleWrapper>
          <Title size={normalizedSize}>{title}</Title>
          <ExternalLinkIcon size={normalizedSize} />
        </TitleWrapper>
        {description && (
          <Description size={normalizedSize}>
            {description}
          </Description>
        )}
        <UrlText>{getDomain(href)}</UrlText>
      </ContentWrapper>
    </CardRoot>
  );
};

