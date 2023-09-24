import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'
import type { SLStoryPageProps } from '@/types'

export default function StoryPage({ storyId }: SLStoryPageProps) {
  return <CanvasIframeBody storyId={storyId} />
}

export const Layout = IframeLayout
