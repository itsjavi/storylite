import { StoryComponent, StoryMeta } from '@storylite/storylite'

export default {
  title: '🏠 Welcome',
  // icon: <span>🏠</span>,
  priority: 100,
} satisfies StoryMeta

export const Main: StoryComponent = () => <div className="story-1">React Demo Index Page</div>

// Main.storyTitle = 'Main Component'
