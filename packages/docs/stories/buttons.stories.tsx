import { SLCoreAddon, type Story } from '@storylite/storylite'

import { LinkableBtn } from '../src/components/LinkableBtn'

import '../src/styles/components.css'

type StoryType = Story<typeof LinkableBtn>

// all properties (except navigation) defined in the 'default' export are inherited by
// all other stories in this file
export default {
  title: 'Feature Showcase',
  component: LinkableBtn,
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
  parameters: {
    // overriden addon parameters
  },
  navigation: {
    // overriden navigation options
    icon: <span>✨</span>,
    hidden: true, // hidden in sub-menu
  },
} satisfies StoryType

export const WithComponentProps: StoryType = {
  title: 'This title is overriden by "name"',
  name: 'With Args',
  args: {
    hoverable: true,
    primary: true,
    children: 'Primary Button',
  },
}

export const WithGridAddonOn: StoryType = {
  args: {
    hoverable: true,
    primary: false,
    children: 'With Grid Addon ON',
  },
  parameters: {
    [SLCoreAddon.Grid]: {
      value: true, // Turns on the grid for this story
    },
  },
}

export const WithCustomDecorators: StoryType = {
  args: {
    hoverable: true,
    primary: false,
    children: 'With Custom Decorators',
  },
  decorators: [
    (Story, context) => {
      return (
        <div style={{ padding: 20, borderRadius: '8px', background: '#aaa' }}>
          <Story {...context?.args} />
        </div>
      )
    },
    (Story, context) => {
      return (
        <div style={{ padding: 20, borderRadius: '8px', background: '#ccc' }}>
          <Story {...context?.args} />
        </div>
      )
    },
  ],
}

export const WithCustomRender: StoryType = {
  args: {
    hoverable: true,
    primary: false,
    children: 'With Custom Render Function',
  },
  render: args => {
    const Story = LinkableBtn

    return (
      <div style={{ padding: 20, borderRadius: '8px', background: '#ccc', color: '#000' }}>
        <Story {...args} />
        <br />
        <div>Rendered with a custom render. Args:</div>
        <pre>{JSON.stringify(args, null, 2)}</pre>
      </div>
    )
  },
}

export const WithScrollbar: StoryType = {
  args: {
    hoverable: true,
    primary: true,
    children: 'Primary Button',
  },
  decorators: [
    (Story, context) => {
      return (
        <div
          style={{
            background: '#ddd',
            height: '1200px',
            borderBlockEnd: '6px solid #1fa7fd',
          }}
        >
          <Story {...context?.args} />
        </div>
      )
    },
  ],
}
