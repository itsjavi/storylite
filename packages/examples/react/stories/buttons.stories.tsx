import { SLCoreAddon, Story } from '@storylite/storylite'

import { LinkableBtn } from '../src/components/LinkableBtn'

import '../src/styles/components.css'

import { ComponentProps } from 'react'

type StoryType = Story<ComponentProps<typeof LinkableBtn>>

// all properties (except navigation) defined in the 'default' export are inherited by
// all other stories in this file
export default {
  title: 'Feature Showcase',
  component: LinkableBtn,
  decorators: [
    (Story, context) => {
      return (
        <div style={{ padding: 20, borderRadius: '8px', background: '#ddd' }}>
          <Story {...context.args} />
        </div>
      )
    },
  ],
  render: (args, ctx) => {
    const Story = ctx.meta.component!

    return (
      <div style={{ padding: 20, borderRadius: '8px', background: '#ccc', color: '#000' }}>
        <h1>{ctx.meta.title}</h1>
        <Story {...args} />
        <div>Rendered with custom render. Context:</div>
        <pre>{JSON.stringify(ctx, null, 2)}</pre>
      </div>
    )
  },
  args: {
    // default args
    children: 'My Button',
  },
  parameters: {
    // overriden addon parameters
  },
  navigation: {
    // overriden navigation options
    hidden: true,
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
  render: undefined, // turn off the inherited render
}

export const WithGridOn: StoryType = {
  args: {
    hoverable: true,
    primary: false,
    children: 'My Button',
  },
  render: undefined, // turn off the inherited render
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
    children: 'My Button',
  },
  render: undefined, // turn off the inherited render
  decorators: [
    (Story, context) => {
      return (
        <div style={{ padding: 20, borderRadius: '8px', background: '#aaa' }}>
          <Story {...context.args} />
        </div>
      )
    },
    (Story, context) => {
      return (
        <div style={{ padding: 20, borderRadius: '8px', background: '#ccc' }}>
          <Story {...context.args} />
        </div>
      )
    },
  ],
}

export const WithCustomRender: StoryType = {
  args: {
    hoverable: true,
    primary: false,
    children: 'My Button',
  },
  // render: undefined, // keep the inherited render
}
