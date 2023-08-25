import { useStoryLiteConfig } from '@/app/context/StoriesDataContext'
import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'

import SandboxLayout from '../../layouts/SandboxLayout'

export default function StoryPage() {
  const config = useStoryLiteConfig()

  return <CanvasIframeBody story={config.defaultStory ?? 'index'} exportName="Main" />
  // <Story story={config.defaultStory || 'index'} exportName={'Main'} />
}

export const Layout = SandboxLayout
