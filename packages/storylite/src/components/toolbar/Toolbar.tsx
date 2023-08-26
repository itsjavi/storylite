import { useStoryLiteAddons } from '@/app/context/StoriesDataContext'
import { SLAddonProps } from '@/types'

import { ToolbarAddon, ToolbarStatefulAddon } from './ToolbarAddon'

function ToolbarGroup({
  addons,
  placement,
}: {
  addons: SLAddonProps<boolean>[]
  placement: 'left' | 'right'
}) {
  return (
    <div className="storylite-addon-toolbar-group">
      {addons
        .filter(
          props => props.placement === placement || (placement === 'left' && !props.placement),
        )
        .map((props, index) => {
          const key = `addon-${props.id}---${props.placement || placement}-${index}`
          if (props.stateful) {
            return <ToolbarStatefulAddon key={key} {...(props as SLAddonProps<true>)} />
          }

          return <ToolbarAddon key={key} {...(props as SLAddonProps<false>)} />
        })}
    </div>
  )
}

export function Toolbar() {
  const addons = Array.from(useStoryLiteAddons().values())

  return (
    <div className={'storylite-addon-toolbar'}>
      <ToolbarGroup addons={addons} placement={'left'} />
      <ToolbarGroup addons={addons} placement={'right'} />
      {/* <section>
        <DarkModeAddon key={10} />
        <GridAddon key={11} />
        <OutlineAddon key={12} />
        <ResponsiveAddon key={13} />
      </section>
      <section>
        <FullScreenAddon key={31} />
        <OpenStoryAddon key={32} story={story} exportName={exportName} />
      </section> */}
    </div>
  )
}
