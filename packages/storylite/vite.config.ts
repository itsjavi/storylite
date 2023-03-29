/// <reference types="vitest" />
/// <reference types="vite/client" />

/**
 * @see https://vitejs.dev/config
 */

import path from 'node:path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import removeTestIds from './src/lib/vite-plugins/removeTestIdPlugin'
import storylite from './src/lib/vite-plugins/storylitePlugin'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  server: {
    port: Number(process.env.PORT || 0) || 7707,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [storylite(), removeTestIds(isProduction), dts(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testing/setup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
    coverage: {
      provider: 'istanbul',
    },
  },
})
