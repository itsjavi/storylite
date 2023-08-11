import { Story } from '@/components/Story'
import { useStoryliteConfig } from '@/context/StoriesDataContext'

import SandboxLayout from '../../layouts/SandboxLayout'

export default function StoryPage() {
  const config = useStoryliteConfig()

  return <Story story={config.defaultStory || 'index'} exportName={'Main'} />
}

export const Layout = SandboxLayout
