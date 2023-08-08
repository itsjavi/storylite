import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
      plugins: './src/plugins/index.ts',
    },
    outDir: './dist',
    format: ['esm', 'cjs'],
    target: 'es2020',
    ignoreWatch: ['**/dist/**', '**/node_modules/**', '*.test.ts'],
    clean: true,
    dts: true,
    sourcemap: true,
    splitting: true,
    minify: false,
    skipNodeModulesBundle: true,
    external: ['node_modules'],
    onSuccess: 'cp ../../README.md ./dist/README.md && cp ../../LICENSE ./dist/LICENSE',
  },
])
