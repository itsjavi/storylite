import '@storylite/storylite/styles.css'
import './src/styles/components.css'
import './src/styles/storylite-overrides.css'

import { renderStoryLiteApp } from '@storylite/storylite'
import stories from '@storylite/vite-plugin:stories'

const rootElement = document.getElementById('root') as HTMLElement

renderStoryLiteApp(rootElement, stories, {
  title: ' ⚡️ StoryLite React',
  defaultStory: 'index',
  iframeProps: {
    style: {
      padding: '10px',
    },
  },
  iframeOptions: {
    useDefaultStyles: false,
  },
})
