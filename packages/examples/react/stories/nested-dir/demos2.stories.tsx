import { Story } from '@storylite/storylite'

export default {
  title: 'Demos - Nested Dir',
} satisfies Story

const Demo1 = () => <button>It Works in a nested route!</button>
Demo1.storyTitle = 'Demo 1'

const Demo2 = () => (
  <div style={{ color: 'orange', fontSize: '28px' }}>It Works in a nested route!</div>
)
Demo2.storyTitle = 'Demo 2'

export { Demo1, Demo2 }
