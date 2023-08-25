import { useEffect, useState } from 'react'

import { Maximize2, Minimize2 } from 'lucide-react'

import ToolbarBtn from '../ToolbarBtn'

function FullScreenAddon() {
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [])

  if (!document.exitFullscreen) {
    return null
  }

  const handleToggleFullScreen = () => {
    const parentDoc = window.parent.document

    if (!isFullScreen) {
      const elem = parentDoc.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      }
    } else {
      if (parentDoc.exitFullscreen) {
        parentDoc.exitFullscreen()
      }
    }
    // setIsFullScreen(!isFullScreen)
  }

  return (
    <ToolbarBtn title={`Switch between full screen and normal`} onClick={handleToggleFullScreen}>
      {isFullScreen ? <Minimize2 /> : <Maximize2 />}
    </ToolbarBtn>
  )
}

export default FullScreenAddon
