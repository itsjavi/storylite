import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'

export default function StoryPage(props: any) {
  const { story } = props

  if (!story) {
    return <div>Error: story route segment is empty</div>
  }

  return <CanvasIframeBody story={story} />
}

export const Layout = IframeLayout
