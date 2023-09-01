import '@storylite/storylite/styles.css'
import './src/styles/components.css'
import './src/styles/storylite-overrides.css'

import { renderStoryLiteApp, SLAddonPropsWithoutId } from '@storylite/storylite'
import stories from '@storylite/vite-plugin:stories'

const rootElement = document.getElementById('root') as HTMLElement

renderStoryLiteApp(rootElement, stories, {
  title: ' ⚡️ StoryLite React',
  defaultStory: 'index-main',
  iframeProps: {
    style: {
      // padding: '10px',
    },
  },
  useIframeStyles: true,
  children: <div>Extra children are rendered here</div>,
  addons: [
    // ['id-of-addon-to-exclude', false],
    [
      'custom-addon',
      {
        defaultContent: <span>👋</span>,
        stateful: false,
        onClick: ctx => {
          // eslint-disable-next-line no-console
          console.log('custom-addon context', ctx)
          alert('You clicked the custom addon!')
        },
      } satisfies SLAddonPropsWithoutId<false>,
    ],
  ],
})
