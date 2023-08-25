import { Sidebar } from 'lucide-react'

import { useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { SLCoreAddon } from '@/types'

import ToolbarBtn from '../ToolbarBtn'

// TODO refactor using a global state manager (e.g. Zustand)
function SidebarAddon() {
  const [params, , setSingleParam] = useStoryLiteParameters()
  const isEnabled = params[SLCoreAddon.Sidebar].value === true
  const toggleValue = () => setSingleParam(SLCoreAddon.Sidebar, !isEnabled)

  if (!document.exitFullscreen) {
    return null
  }

  return (
    <ToolbarBtn title={`Open and close the sidebar`} onClick={toggleValue} isActive={isEnabled}>
      {<Sidebar />}
    </ToolbarBtn>
  )
}

export default SidebarAddon
