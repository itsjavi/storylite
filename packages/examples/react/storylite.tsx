import '@storylite/storylite/styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { StoryLiteApp } from '@storylite/storylite'
import stories from '@storylite/vite-plugin:stories'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoryLiteApp
      stories={stories}
      config={{
        title: ' ⚡️ StoryLite React',
        defaultStory: 'index',
      }}
    />
  </React.StrictMode>,
)
