import React from 'react'
import ReactDOM from 'react-dom/client'

import { SLAppComponentProps, StoryModulesMap } from '@/types'

import { StoryLiteApp } from './'

export function renderStoryLiteApp(
  root: HTMLElement,
  stories: StoryModulesMap,
  config?: Partial<SLAppComponentProps>,
) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <StoryLiteApp stories={stories} config={config}>
        {config?.children}
      </StoryLiteApp>
    </React.StrictMode>,
  )
}
