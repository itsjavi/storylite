import { StoryComponent, StoryMeta } from '@storylite/storylite'

export default {
  title: '🏠 Welcome',
  // icon: <span>🏠</span>,
  priority: 100,
} satisfies StoryMeta

export const Main: StoryComponent = () => (
  <div style={{ color: 'green', fontSize: '28px' }}>React Demo Index Page</div>
)

// Main.storyTitle = 'Main Component'
