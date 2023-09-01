import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'
import { SLStoryPageProps } from '@/types'

export default function StoryPage({ storyId }: SLStoryPageProps) {
  if (!storyId) {
    return <div>Error: story route segment is empty</div>
  }

  return <CanvasIframeBody storyId={storyId} />
}

export const Layout = IframeLayout
