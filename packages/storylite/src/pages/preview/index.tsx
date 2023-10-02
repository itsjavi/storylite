import { useStoryLiteStore } from '@/app/stores/global'
import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'

export default function StoryPage() {
  const config = useStoryLiteStore((state) => state.config)

  return <CanvasIframeBody storyId={config.defaultStory ?? 'index'} />
}

export const Layout = IframeLayout
