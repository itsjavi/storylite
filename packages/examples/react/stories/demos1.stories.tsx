import { Story } from '@storylite/storylite'

export default {
  title: 'Demos',
} satisfies Story

const Demo1 = () => <button>It Works!</button>

const Demo2 = () => <div style={{ color: 'orange', fontSize: '28px' }}>It Works!</div>

export { Demo1, Demo2 }
