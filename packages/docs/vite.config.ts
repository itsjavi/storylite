/// <reference types="vite/client" />
import { resolve } from 'path'

/**
 * @see https://vitejs.dev/config
 * @see https://vitejs.dev/guide/build.html#multi-page-app
 */

import storylitePlugin from '@storylite/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'canvas.html'),
      },
    },
  },
  plugins: [
    storylitePlugin({
      stories: 'stories/**/*.stories.tsx', // relative to process.cwd()
    }),
    react(),
  ],
})
