import userConfig from 'storylite-user-config'

import { Story } from '@/components/Story'

import SandboxLayout from '../../layouts/SandboxLayout'

export default function StoryPage() {
  return <Story story={userConfig.defaultStory || 'index'} exportName={'Main'} />
}

export const Layout = SandboxLayout
