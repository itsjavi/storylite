import '@storylite/storylite/dist/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { StoryLiteRouter } from '@storylite/storylite'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoryLiteRouter />
  </React.StrictMode>,
)
