import React from 'react'
import ReactDOM from 'react-dom/client'

import type { SLAppComponentProps, StoryModuleMap } from '@/types'

import { StoryLiteApp } from '.'

/**
 * Use this method if you don't want to mount the StoryLite app component yourself.
 */
export function renderStoryLiteApp(root: HTMLElement, stories: StoryModuleMap, config?: Partial<SLAppComponentProps>) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <StoryLiteApp stories={stories} config={config}>
        {config?.children}
      </StoryLiteApp>
    </React.StrictMode>,
  )
}
