import { useStoryLiteConfig } from '@/app/context/StoriesDataContext'
import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'

export default function StoryPage() {
  const config = useStoryLiteConfig()

  return <CanvasIframeBody story={config.defaultStory ?? 'index'} exportName="Main" />
}

export const Layout = IframeLayout
