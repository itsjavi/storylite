import { Story } from '@storylite/storylite'

export default {
  title: 'Welcome',
  navigation: {
    icon: <span>+🏠</span>,
    iconExpanded: <span>-🏠</span>,
    order: 0, // put on top
    hidden: true, // dont show the default export component in the navigation
  },
  component: () => <div>This is a default component defined in the default export.</div>,
} satisfies Story

export const Main = () => <div className="story-1">React Demo Index Page</div>

export const ZDemo1: Story = {
  title: 'Inherited Story 1',
  navigation: {
    icon: <span>🥚</span>,
    order: 0, // put on top
  },
}

export const Demo2: Story = {
  title: 'Inherited Story 2',
  navigation: {
    icon: <span>🐣</span>,
    order: 999,
  },
}

// Main.storyTitle = 'Main Component'
