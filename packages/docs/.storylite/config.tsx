import { SLAddonPropsWithoutId, SLAppComponentProps } from '@storylite/storylite'
import { BoxIcon, GithubIcon, ZapIcon } from 'lucide-react'

const config: Partial<SLAppComponentProps> = {
  title: ' ⚡️ StoryLite',
  defaultStory: 'index-default',
  useIframeStyles: false,
  iframeProps: {
    style: {
      // padding: '10px',
    },
  },
  addons: [
    [
      'github-link',
      {
        defaultContent: (
          <span className="ext-link ext-link-github">
            <GithubIcon />
          </span>
        ),
        tooltip: 'Github Repository',
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
        defaultContent: (
          <span className="ext-link ext-link-npm">
            <BoxIcon />
          </span>
        ),
        placement: 'right',
        stateful: false,
        tooltip: 'NPM Package',
        getHref: () => {
          return 'https://www.npmjs.com/package/@storylite/storylite'
        },
        hrefTarget: '_blank',
      } satisfies SLAddonPropsWithoutId<false>,
    ],
    [
      'stackblitz-link',
      {
        defaultContent: (
          <span className="ext-link ext-link-stackblitz">
            <ZapIcon />
          </span>
        ),
        placement: 'right',
        stateful: false,
        getHref: () => {
          return 'https://stackblitz.com/edit/storylite-demo?file=stories/index.stories.tsx'
        },
        hrefTarget: '_blank',
      } satisfies SLAddonPropsWithoutId<false>,
    ],
  ],
}

export default config
