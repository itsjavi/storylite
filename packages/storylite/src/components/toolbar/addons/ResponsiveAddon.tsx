import { useEffect } from 'react'

import { Smartphone } from 'lucide-react'

import { useStoryLiteIframe, useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { SLCoreAddon } from '@/types'

import ToolbarBtn from '../ToolbarBtn'

function ResponsiveAddon() {
  const [params, , setSingleParam] = useStoryLiteParameters()
  const currentSize = (params[SLCoreAddon.Responsive].value || '100%') as string
  const iframeState = useStoryLiteIframe()

  const updateWidth = (newWidth: string): void => {
    if (!iframeState.iframe) {
      // eslint-disable-next-line no-console
      console.error('storylite: iframe is not ready yet')

      return
    }
    setSingleParam(SLCoreAddon.Responsive, newWidth)
    iframeState.iframe.style.width = newWidth
  }

  const handleClick = () => {
    if (currentSize === '100%') {
      updateWidth('320px')

      return
    }

    updateWidth('100%')
  }

  useEffect(() => {
    if (currentSize) {
      updateWidth(currentSize)
    }
  }, [currentSize, iframeState.iframe, iframeState.loaded])

  return (
    <ToolbarBtn
      title={`Switch between full-width and 320px`}
      onClick={handleClick}
      isActive={currentSize !== '100%'}
    >
      {<Smartphone />}
    </ToolbarBtn>
  )
}

export default ResponsiveAddon
