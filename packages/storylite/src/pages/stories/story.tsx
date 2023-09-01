import { CanvasIframe } from '@/components/canvas/CanvasIframe'
import TopFrameLayout from '@/components/layouts/TopFrameLayout'
import { SLStoryPageProps } from '@/types'

export default function StoryPage({ storyId }: SLStoryPageProps) {
  if (!storyId) {
    return <div>Error: story route segment is empty</div>
  }

  return <CanvasIframe storyId={storyId} />
}

export const Layout = TopFrameLayout
