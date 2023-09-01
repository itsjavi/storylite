import { SLAddonPropsWithoutId, SLAppComponentProps } from '@storylite/storylite'
import { GithubIcon } from 'lucide-react'

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
    [
      'github-link',
      {
        defaultContent: (
          <span>
            <GithubIcon /> Github
          </span>
        ),
        placement: 'right',
        stateful: false,
        getHref: () => {
          return 'https://github.com/itsjavi/storylite/releases'
        },
        hrefTarget: '_blank',
      } satisfies SLAddonPropsWithoutId<false>,
    ],
    [
      'npm-link',
      {
        defaultContent: <span>NPM</span>,
        placement: 'right',
        stateful: false,
        getHref: () => {
          return 'https://www.npmjs.com/package/@storylite/storylite'
        },
        hrefTarget: '_blank',
      } satisfies SLAddonPropsWithoutId<false>,
    ],
  ],
}

export default config
