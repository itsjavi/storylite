import { HTMLProps } from 'react'
import { cn } from '@r1stack/core'

import { useStoryLiteConfig, useStoryLiteIframe } from '@/app/context/StoriesDataContext'
import { getStoryUrl } from '@/app/navigation/urlUtils'

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

export type CanvasIframeProps = {
  story?: string
  exportName?: string
} & Omit<HTMLProps<HTMLIFrameElement>, 'src'>

export function CanvasIframe(props: CanvasIframeProps) {
  const userConfig = useStoryLiteConfig()
  const userProps = userConfig?.iframeProps || {}
  const { className: userClassName, ...userRest } = userProps
  const { story, exportName, className, ...rest } = props
  const iframeSrc = getStoryUrl(story, exportName, {
    target: 'iframe',
    hashbang: true,
    standalone: false,
  })

  const portal = useStoryLiteIframe()

  return (
    <iframe
      ref={portal.setIframe}
      src={iframeSrc}
      title="StoryLite-iframe"
      className={cn('storylite-iframe-element', className, userClassName)}
      allow={allowList.map(permission => `${permission} *`).join('; ')}
      {...rest}
      {...userRest}
    />
  )
}
