import type { Story } from '@storylite/storylite'

import '../src/styles/components.css'

export default {
  title: 'Welcome',
  navigation: {
    icon: <span>🏠</span>,
    // iconExpanded: <span>-🏠</span>,
    order: 0, // put on top
    hidden: false, // dont show the default export component in the navigation
  },
  component: () => <div>This is a default component defined in the default export.</div>,
} satisfies Story
