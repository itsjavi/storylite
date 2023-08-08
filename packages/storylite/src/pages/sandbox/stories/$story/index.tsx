import { useParams } from 'react-router-dom'

import { Story } from '@/components/Story'

import SandboxLayout from '../../../../layouts/SandboxLayout'

export default function StoryPage() {
  const { story } = useParams()

  if (!story) {
    return <div>Error: story is empty</div>
  }

  return <Story story={story} />
}

export const Layout = SandboxLayout
