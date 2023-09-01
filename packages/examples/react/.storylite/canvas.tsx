import '@storylite/storylite/styles.css'
//
import '../src/styles/storylite-iframe.css'
import '../src/styles/storylite-ui.css'
//
import '../src/styles/components.css'

// import iframe-scope styles here

import { renderStoryLiteApp } from '@storylite/storylite'
import stories from '@storylite/vite-plugin:stories'

import config from './config'

const rootElement = document.getElementById('root') as HTMLElement

renderStoryLiteApp(rootElement, stories, config)
