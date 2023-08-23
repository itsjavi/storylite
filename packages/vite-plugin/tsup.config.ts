// import fs from 'node:fs'
// import path from 'node:path'

import { defineConfig } from 'tsup'

// const extraDts = ['src/stories.d.ts']
//   .map(filename => {
//     return fs.readFileSync(path.join(__dirname, filename), 'utf-8')
//   })
//   .join('\n')

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
    },
    outDir: './dist',
    format: ['esm', 'cjs'],
    target: 'es2020',
    ignoreWatch: ['**/dist/**', '**/node_modules/**', '*.test.ts'],
    clean: true,
    dts: {
      // resolve: true,
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
      // footer: `\n${extraDts}\n`,
    },
    sourcemap: true,
    splitting: true,
    minify: false,
    skipNodeModulesBundle: true,
    external: ['node_modules'],
    onSuccess: [
      // Hack! wait for DTS to be generated :( -> https://github.com/egoist/tsup/issues/700
      'sleep 2', // DTS needs around 0.5s to be generated, so 2s should be enough
      'cp ./src/virtual-modules.d.ts ./dist/virtual-modules.d.ts',
      'cp ./src/virtual-modules.d.ts ./dist/virtual-modules.d.cts',
    ].join(' && '),
  },
])
