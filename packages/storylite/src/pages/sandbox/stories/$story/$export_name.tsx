import React from 'react'
import { useParams } from 'react-router-dom'

import { Story } from '@/components/Story'

import SandboxLayout from '../../../../layouts/SandboxLayout'

export default function StoryPage() {
  const { story, export_name } = useParams()

  if (!story || !export_name) {
    return <div>Error: story or export_name is empty</div>
  }

  return <Story story={story} exportName={export_name} />
}

export const Layout = SandboxLayout
