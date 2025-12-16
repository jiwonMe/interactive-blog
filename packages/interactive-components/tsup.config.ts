import { defineConfig } from 'tsup';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: options.watch ? false : true,
    // watch 모드에서 dist를 삭제하면 Next가 순간적으로 import를 못해 dev가 깨질 수 있음
    clean: options.watch ? false : true,
    banner: {
      js: "'use client';",
    },
    esbuildPlugins: [vanillaExtractPlugin()],
  };
});



