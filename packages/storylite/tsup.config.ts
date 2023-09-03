import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
    },
    outDir: './dist',
    format: ['esm', 'cjs'],
    target: 'es2020',
    ignoreWatch: ['**/dist/**', '**/node_modules/**', '*.test.*'],
    dts: {
      compilerOptions: {
        // Ensure ".d.ts" modules are generated
        declaration: true,
        // Skip ".js" generation
        noEmit: false,
        emitDeclarationOnly: true,
        // Skip code generation when error occurs
        noEmitOnError: true,
        // Avoid extra work
        checkJs: false,
        declarationMap: false,
        skipLibCheck: true,
        // Ensure TS2742 errors are visible
        preserveSymlinks: true,
        // Ensure we can parse the latest code
        target: 'ESNext',
        types: ['node'],
      },
    },
    loader: {
      '.svg': 'text',
    },
    sourcemap: true,
    splitting: true,
    minify: false,
    skipNodeModulesBundle: true,
    external: ['node_modules'],
    onSuccess: ['cp ../../README.md ./README.md'].join(' && '),
  },
  {
    entry: {
      index: './src/styles/index.css',
    },
    outDir: './dist',
    format: ['esm'],
    ignoreWatch: ['**/dist/**', '**/node_modules/**', '*.test.*'],
    sourcemap: true,
    splitting: false,
    minify: false,
    skipNodeModulesBundle: true,
    external: ['node_modules'],
  },
])
