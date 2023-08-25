import { useParams } from 'react-router-dom'

import { CanvasIframe } from '@/components/canvas/CanvasIframe'
import MainLayout from '@/layouts/MainLayout'

export default function StoryPage() {
  const { story, export_name } = useParams()

  return <CanvasIframe story={story} exportName={export_name} />
}

export const Layout = MainLayout
