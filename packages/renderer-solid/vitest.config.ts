import solid from 'vite-plugin-solid'
import { defineConfig, mergeConfig } from 'vitest/config'
import rootConfig from '../../vitest.config.js'

export default mergeConfig(
  rootConfig,
  defineConfig({
    plugins: [solid()],
    test: {
      environment: 'jsdom',
    },
  }),
)
