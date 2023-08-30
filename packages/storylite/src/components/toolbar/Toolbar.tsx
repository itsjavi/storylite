import { useStoryLiteStore } from '@/app/stores/global'
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
            // return <div key={key + '-stateful'}>Stateful Addon</div>
            return <ToolbarStatefulAddon key={key} {...(props as SLAddonProps<true>)} />
          }

          // return <div key={key}>Stateful Addon</div>

          return <ToolbarAddon key={key} {...(props as SLAddonProps<false>)} />
        })}
    </div>
  )
}

export function Toolbar() {
  const addons = useStoryLiteStore(state => Array.from(state.addons.values()))

  return (
    <div className={'storylite-addon-toolbar'}>
      <ToolbarGroup addons={addons} placement={'left'} />
      <ToolbarGroup addons={addons} placement={'right'} />
    </div>
  )
}
