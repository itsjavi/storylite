import { useEffect } from 'react'

import { BoxSelect as Icon } from 'lucide-react'

import { ElementIds } from '@/types'

import { useBrowserStorage } from '../../hooks/useBrowserStorage'
import ToolbarBtn from '../ToolbarBtn'

export default function OutlineAddon() {
  const { value: addonValue, setValue: setAddonValue } = useBrowserStorage<{ enabled: boolean }>(
    'outlined-elements',
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
      element.dataset.outlinesVisible = 'false'

      return
    }

    element.dataset.outlinesVisible = 'true'
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
      title={`Display outlines`}
      onClick={handleClick}
      isActive={addonValue?.enabled === true}
    >
      {<Icon />}
    </ToolbarBtn>
  )
}
