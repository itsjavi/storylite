import '@storylite/storylite/styles.css'
import '../src/styles/storylite-ui.css'

// import other StoryLite UI styles here

import stories from '@storylite/vite-plugin:stories'
import { renderStoryLiteApp } from '@storylite/storylite'

import config from './config'

const rootElement = document.getElementById('root') as HTMLElement

renderStoryLiteApp(rootElement, stories, config)
