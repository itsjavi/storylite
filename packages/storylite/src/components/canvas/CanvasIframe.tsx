import { HTMLProps } from 'react'
import { cn } from '@r1stack/core'

import { ElementIds } from '@/types'

import { useStoryLiteConfig } from '../../app/context/StoriesDataContext'
import { useCanvasIframe } from './useCanvasIframe'

const allowList = [
  'autoplay',
  'camera',
  'encrypted-media',
  'fullscreen',
  'geolocation',
  'microphone',
  'midi',
  'payment',
  'picture-in-picture',
  'clipboard-write',
  'accelerometer',
  'gyroscope',
  'magnetometer',
  'xr-spatial-tracking',
  'usb',
]

// const sandboxAllowList = [
//   'allow-same-origin',
//   // 'allow-forms',
//   // 'allow-fullscreen',
//   // 'allow-modals',
//   // 'allow-orientation-lock',
//   // 'allow-pointer-lock',
//   // 'allow-popups',
//   // 'allow-popups-to-escape-sandbox',
//   // 'allow-presentation',
//   // 'allow-scripts',
//   // 'allow-top-navigation',
//   // 'allow-top-navigation-by-user-activation',
// ]

export type CanvasIframeProps = {
  story?: string
  exportName?: string
} & Omit<HTMLProps<HTMLIFrameElement>, 'src'>

const handleReceivedMessage = (message: any) => {
  // eslint-disable-next-line no-console
  console.log('[top] Message received:', message)
}

export function CanvasIframe(props: CanvasIframeProps) {
  const userConfig = useStoryLiteConfig()
  const userProps = userConfig?.iframeProps || {}
  const { className: userClassName, ...userRest } = userProps
  const { story, exportName, className, ...rest } = props

  const iframeSrc =
    story === undefined ? '/#/sandbox/dashboard' : `/#/sandbox/stories/${story}/${exportName || ''}`

  const { ref, isReady, sendMessage } = useCanvasIframe(handleReceivedMessage)

  const handleToolbarAction = () => {
    if (isReady) {
      sendMessage({
        type: 'chat',
        payload: {
          message: 'Hello from top window',
        },
      })
    }
  }

  return (
    <>
      <button onClick={handleToolbarAction}>Send message to iframe</button>
      <iframe
        ref={ref}
        id={ElementIds.Iframe}
        src={iframeSrc}
        title="StoryLite-iframe"
        className={cn('StoryFrame', className, userClassName)}
        allow={allowList.map(permission => `${permission} *`).join('; ')}
        allowFullScreen={true}
        {...rest}
        {...userRest}
      />
    </>
  )
}
