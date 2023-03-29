/// <reference types="vitest" />
/// <reference types="vite/client" />

/**
 * @see https://vitejs.dev/config
 */

import path from 'node:path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

// const entryMap = globSync('./src/**/*.{ts,tsx,css}', {
//   absolute: false,
//   ignore: 'src/**/*.test.{ts,tsx}',
// })
//   .map(file => {
//     const name = file
//       .replace(/^src\//, '')
//       //.replace(/\/index/, '')
//       .replace('.tsx', '')
//       .replace('.ts', '')
//
//     return { [name]: file }
//   })
//   .reduce((acc, cur) => ({ ...acc, ...cur }), {})

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [dts({}), react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    target: 'modules',
    formats: ['es', 'cjs'],
    copyPublicDir: true,
    cssCodeSplit: true,
    minify: false,
    lib: {
      entry: {
        index: './src/index.ts',
        react: './src/react/index.ts',
        'reset.css': './src/styling/css/reset.css',
      },
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts',
    // you might want to disable it if you don't have tests that rely on CSS,
    // since parsing CSS is slow.
    css: false,
    coverage: {
      provider: 'istanbul',
    },
  },
} as UserConfig)
