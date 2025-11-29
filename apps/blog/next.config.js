/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/interactive-ui"],
  
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // 이미지 포맷 최적화 (WebP, AVIF 자동 변환)
    formats: ['image/avif', 'image/webp'],
    // 이미지 크기 최적화
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 실험적 기능
  experimental: {
    // 스크롤 복원
    scrollRestoration: true,
  },
  
  // 압축 활성화
  compress: true,
  
  // 빌드 시 소스맵 비활성화 (프로덕션 번들 크기 감소)
  productionBrowserSourceMaps: false,
  
  // 정적 페이지 생성 타임아웃 (긴 MDX 컴파일 대비)
  staticPageGenerationTimeout: 120,
  
  // 빌드 출력 최적화
  output: 'standalone',
  
  // HTTP 헤더 설정 (캐싱 최적화)
  async headers() {
    return [
      {
        // 정적 에셋 캐싱 (1년)
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 폰트 캐싱 (1년)
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // HTML 페이지 캐싱 (revalidate 활용)
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // 보안 헤더
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Webpack 설정
  webpack: (config, { isServer }) => {
    // 이미지 파일 복사
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "articles"),
            to: path.join(__dirname, "public/images/articles"),
            noErrorOnMissing: true,
            globOptions: {
              ignore: ["**/*.mdx", "**/*.tsx", "**/*.ts", "**/*.js", "**/*.json"],
            },
          },
        ],
      })
    );
    
    // 클라이언트 번들 최적화
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // 벤더 청크 분리
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            // 공통 모듈 청크
            common: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
