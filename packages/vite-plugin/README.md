# @storylite/vite-plugin

A Vite plugin to integrate StoryLite with Vite.

## Installation

```bash

npm i -D @storylite/vite-plugin

```

## Usage

```ts
// vite.config.ts

/// <reference types="vite/client" />

import storylite from '@storylite/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    storylite({
      stories: 'stories/**/*.stories.tsx', // should be relative to process.cwd()
    }),
  ],
})
```
