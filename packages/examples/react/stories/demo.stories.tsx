import { StoryComponent, StoryMeta } from '@storylite/storylite'

export default {
  title: 'Demos',
} satisfies StoryMeta

const Demo1: StoryComponent = () => <button>It Works!</button>
Demo1.storyTitle = 'Demo 1'

const Demo2: StoryComponent = () => (
  <div style={{ color: 'orange', fontSize: '28px' }}>It Works!</div>
)
Demo2.storyTitle = 'Demo 2'

export { Demo1, Demo2 }
