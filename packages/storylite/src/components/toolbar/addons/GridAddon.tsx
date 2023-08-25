import { Grid } from 'lucide-react'

import { useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { SLCoreAddon } from '@/types'

import ToolbarBtn from '../ToolbarBtn'

// TODO refactor using a global state manager (e.g. Zustand)
export default function GridAddon() {
  const [params, , setSingleParam] = useStoryLiteParameters()
  const isEnabled = params[SLCoreAddon.Grid].value === true
  const toggleValue = () => setSingleParam(SLCoreAddon.Grid, !isEnabled)

  return (
    <ToolbarBtn title={`Display pixel grid`} onClick={toggleValue} isActive={isEnabled}>
      {<Grid />}
    </ToolbarBtn>
  )
}
