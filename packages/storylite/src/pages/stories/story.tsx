import { CanvasRoot } from '@/components/canvas/CanvasRoot'
import TopFrameLayout from '@/components/layouts/TopFrameLayout'
import type { SLStoryPageProps } from '@/types'

export default function StoryPage({ storyId }: SLStoryPageProps) {
  return <CanvasRoot storyId={storyId} />
}

export const Layout = TopFrameLayout
