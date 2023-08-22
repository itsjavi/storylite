/// <reference types="vite/client" />

/**
 * @see https://vitejs.dev/config
 */

import storylitePlugin from '@storylite/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    storylitePlugin({
      stories: 'stories/**/*.stories.tsx', // relative to process.cwd()
    }),
    react(),
  ],
})
