/// <reference types="vite/client" />
import { resolve } from 'node:path'

import mdx from '@mdx-js/rollup'
import storylite from '@storylite/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'

/**
 * @see https://vitejs.dev/config
 * @see https://vitejs.dev/guide/build.html#multi-page-app
 */

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
    {
      enforce: 'pre', // this ensures that .md/mdx files are processed before react & storylite plugins
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
    },
    storylite({
      stories: 'stories/**/*.stories.{tsx,md,mdx}', // relative to process.cwd()
    }),
    react(),
  ],
})
