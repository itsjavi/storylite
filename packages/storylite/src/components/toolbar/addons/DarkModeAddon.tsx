import { Moon } from 'lucide-react'

import { useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { SLCoreAddon } from '@/types'

import ToolbarBtn from '../ToolbarBtn'

function DarkModeAddon() {
  const [params, , setSingleParam] = useStoryLiteParameters()
  const isDarkMode = params[SLCoreAddon.DarkMode].value === true
  const toggleValue = () => setSingleParam(SLCoreAddon.DarkMode, !isDarkMode)

  return (
    <ToolbarBtn
      title={`Switch color scheme Dark/Light`}
      onClick={toggleValue}
      isActive={isDarkMode}
    >
      {<Moon />}
    </ToolbarBtn>
  )
}

export default DarkModeAddon
