import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    // watch 모드에서는 dts 생성이 @stitches/react 타입 이슈로 non-zero exit를 유발함
    dts: options.watch ? false : true,
    clean: true,
    banner: {
      js: "'use client';",
    },
  };
});

