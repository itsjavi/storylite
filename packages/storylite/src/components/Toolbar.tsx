import { useSearchParams } from 'react-router-dom'

import { StoryMeta } from '@/types'

import DarkModeAddon from './addons/DarkModeAddon'
import FullScreenAddon from './addons/FullScreenAddon'
import GridAddon from './addons/GridAddon'
import OpenStoryAddon from './addons/OpenStoryAddon'
import OutlineAddon from './addons/OutlineAddon'
import ResponsiveAddon from './addons/ResponsiveAddon'
import SidebarAddon from './addons/SidebarAddon'

type AddonToolbarProps = { story?: string; storyMeta?: StoryMeta }

export default function Toolbar({ story }: AddonToolbarProps) {
  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')

  return (
    <div className={'Toolbar'}>
      <section>
        <SidebarAddon />
        <DarkModeAddon />
        <GridAddon />
        <OutlineAddon />
        {!isStandalone && <ResponsiveAddon />}
      </section>
      <section>
        <FullScreenAddon />
        <OpenStoryAddon story={story} />
      </section>
    </div>
  )
}
