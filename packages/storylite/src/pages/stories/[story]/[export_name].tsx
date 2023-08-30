import { CanvasIframe } from '@/components/canvas/CanvasIframe'
import TopFrameLayout from '@/components/layouts/TopFrameLayout'

export default function StoryPage(props: any) {
  const { story, export_name } = props

  return <CanvasIframe story={story} exportName={export_name} />
}

export const Layout = TopFrameLayout
