import React from 'react'
import { Story } from '@/components/Story'
import SandboxLayout from '../../layouts/SandboxLayout'

export default function StoryPage() {
  return <Story story={'index'} exportName={'Welcome'} />
}

export const Layout = SandboxLayout
