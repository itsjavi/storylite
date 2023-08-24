import { useStoryLiteConfig } from '@/app/context/StoriesDataContext'
import { Story } from '@/components/Story'

import SandboxLayout from '../../layouts/SandboxLayout'

export default function StoryPage() {
  const config = useStoryLiteConfig()

  return <Story story={config.defaultStory || 'index'} exportName={'Main'} />
}

export const Layout = SandboxLayout
