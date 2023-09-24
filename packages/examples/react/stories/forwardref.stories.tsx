import { Story } from '@storylite/storylite'

import { ForwardRefButton } from '../src/components/ForwardRefButton'

import '../src/styles/components.css'

type StoryType = Story<typeof ForwardRefButton>

// all properties (except navigation) defined in the 'default' export are inherited by
// all other stories in this file
export default {
  title: 'ForwardRefButton',
  component: ForwardRefButton,
  decorators: [
    (Story, context) => {
      return (
        <div style={{ padding: 20, borderRadius: '8px', background: '#ddd' }}>
          <Story {...context?.args} />
        </div>
      )
    },
  ],
  args: {
    // default args
    children: 'My Button',
  },
  navigation: {
    // overriden navigation options
    icon: <span>⏩</span>,
    hidden: true, // hidden in sub-menu
  },
} satisfies StoryType

export const DefaultStory: StoryType = {
  name: 'Default',
}

export const WithComponentProps: StoryType = {
  args: {
    variant: 'green',
    children: 'Green Variant',
  },
}
