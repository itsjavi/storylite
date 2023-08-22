import { useEffect } from 'react'

import { Smartphone } from 'lucide-react'

import { ElementIds } from '@/types'

import { useBrowserStorage } from '../../hooks/useBrowserStorage'
import ToolbarBtn from '../ToolbarBtn'

function ResponsiveAddon() {
  const { value: addonValue, setValue: setAddonValue } = useBrowserStorage(
    'responsive-width',
    '100%',
  )

  const _update = (newWidth: string): void => {
    const parentIframe = window.parent.document.getElementById(ElementIds.Iframe)

    if (!parentIframe) {
      // eslint-disable-next-line no-console
      console.error(`#${ElementIds.Iframe} iframe element not found on window.parent.document`)

      return
    }

    parentIframe.style.width = newWidth
  }

  const handleClick = () => {
    if (addonValue === '100%') {
      _update('320px')
      setAddonValue('320px')

      return
    }

    _update('100%')
    setAddonValue('100%')
  }

  useEffect(() => {
    if (addonValue) {
      _update(addonValue)
    }
  }, [addonValue])

  if (!window.parent.document) {
    return null
  }

  const parentIframe = window.parent.document.getElementById(ElementIds.Iframe)
  if (!parentIframe) {
    return null
  }

  return (
    <ToolbarBtn
      title={`Switch between full-width and 320px`}
      onClick={handleClick}
      isActive={addonValue !== '100%'}
    >
      {<Smartphone />}
    </ToolbarBtn>
  )
}

export default ResponsiveAddon
