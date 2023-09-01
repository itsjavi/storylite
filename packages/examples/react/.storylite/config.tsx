import { SLAddonPropsWithoutId, SLAppComponentProps } from '@storylite/storylite'

const config: SLAppComponentProps = {
  title: ' ⚡️ StoryLite React',
  defaultStory: 'index-default',
  useIframeStyles: false,
  iframeProps: {
    style: {
      // padding: '10px',
    },
  },
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
}

export default config
