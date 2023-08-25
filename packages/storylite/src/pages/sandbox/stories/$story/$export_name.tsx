import { useParams } from 'react-router-dom'

import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'

import SandboxLayout from '../../../../layouts/SandboxLayout'

export default function StoryPage() {
  const { story, export_name } = useParams()

  if (!story) {
    return <div>Error: story route segment is empty</div>
  }

  if (!export_name) {
    return <div>Error: export_name route segment is empty</div>
  }

  return <CanvasIframeBody story={story} exportName={export_name} />
}

export const Layout = SandboxLayout
