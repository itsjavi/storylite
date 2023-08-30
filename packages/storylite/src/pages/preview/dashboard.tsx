import { useStoryLiteStore } from '@/app/stores/global'
import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'

export default function StoryPage() {
  const config = useStoryLiteStore(state => state.config)

  return <CanvasIframeBody story={config.defaultStory ?? 'index'} exportName="Main" />
}

export const Layout = IframeLayout
