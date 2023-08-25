import { BoxSelect as Icon } from 'lucide-react'

import { useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { SLCoreAddon } from '@/types'

import ToolbarBtn from '../ToolbarBtn'

export default function OutlineAddon() {
  const [params, , setSingleParam] = useStoryLiteParameters()
  const isEnabled = params[SLCoreAddon.Outline].value === true
  const toggleValue = () => setSingleParam(SLCoreAddon.Outline, !isEnabled)

  return (
    <ToolbarBtn title={`Display outlines`} onClick={toggleValue} isActive={isEnabled}>
      {<Icon />}
    </ToolbarBtn>
  )
}
