import React from 'react'
import { useParams } from 'react-router-dom'
import StoryFrame from '@/components/StoryFrame'
import MainLayout from '@/layouts/MainLayout'

export default function StoryPage() {
  const { story, export_name } = useParams()

  return <StoryFrame story={story} exportName={export_name} />
}

export const Layout = MainLayout
