import '@storylite/storylite/dist/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { StoryLiteApp } from '@storylite/storylite'
import stories from 'virtual:storylite-stories'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoryLiteApp
      stories={stories}
      config={{
        title: 'My Storylite',
        defaultStory: 'index',
        stylesheets: [],
      }}
    />
  </React.StrictMode>,
)
