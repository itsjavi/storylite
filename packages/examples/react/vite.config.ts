/// <reference types="vite/client" />

/**
 * @see https://vitejs.dev/config
 */

import { storylitePlugin } from '@storylite/storylite/dist/plugins'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: Number(process.env.PORT || 0) || 7707,
    host: '0.0.0.0',
  },
  plugins: [
    storylitePlugin({
      title: 'StoryLite - React', // Sidebar title
      stories: 'stories/**/*.stories.tsx', // relative to the CWD
      defaultStory: 'index', // index page file prefix, e.g. index = index.stories.tsx
    }),
    react(),
  ],
})
