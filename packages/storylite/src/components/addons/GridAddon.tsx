import { useEffect } from 'react'

import { Grid } from 'lucide-react'

import { ElementIds } from '@/types'

import { useBrowserStorage } from '../../hooks/useBrowserStorage'
import ToolbarBtn from '../ToolbarBtn'

export default function GridAddon() {
  const { value: addonValue, setValue: setAddonValue } = useBrowserStorage<{ enabled: boolean }>(
    'pixel-grid',
    {
      enabled: false,
    },
  )

  const updateClass = (value: boolean): void => {
    const element = document.getElementById(ElementIds.StoryCanvas)
    if (element === null) {
      console.error(`Element #${ElementIds.StoryCanvas} not found`)

      return
    }

    if (!value) {
      element.dataset.gridVisible = 'false'

      return
    }

    element.dataset.gridVisible = 'true'
  }

  const handleClick = () => {
    const newState = !addonValue?.enabled
    updateClass(newState)
    setAddonValue({ enabled: newState })
  }

  useEffect(() => {
    if (addonValue) {
      updateClass(addonValue.enabled)
    }
  }, [addonValue])

  return (
    <ToolbarBtn
      title={`Display pixel grid`}
      onClick={handleClick}
      isActive={addonValue?.enabled === true}
    >
      {<Grid />}
    </ToolbarBtn>
  )
}
