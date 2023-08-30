import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'
import IframeLayout from '@/components/layouts/IframeLayout'

export default function StoryPage(props: any) {
  const { story, export_name } = props

  if (!story) {
    return <div>Error: story route segment is empty</div>
  }

  if (!export_name) {
    return <div>Error: export_name route segment is empty</div>
  }

  return <CanvasIframeBody story={story} exportName={export_name} />
}

export const Layout = IframeLayout
