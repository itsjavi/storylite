import { useParams } from 'react-router-dom'

import { CanvasIframeBody } from '@/components/canvas/CanvasIframeBody'

import SandboxLayout from '../../../../layouts/SandboxLayout'

export default function StoryPage() {
  const { story } = useParams()

  if (!story) {
    return <div>Error: story route segment is empty</div>
  }

  return <CanvasIframeBody story={story} />
}

export const Layout = SandboxLayout
