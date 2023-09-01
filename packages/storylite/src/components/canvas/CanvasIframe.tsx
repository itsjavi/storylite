import { HTMLProps } from 'react'
import { cn } from '@r1stack/core'

import { useStoryLiteIframe, useStoryLiteStore } from '@/app/stores/global'
import { getStoryUrl } from '@/services/csf-api/navigation'
import { parametersToDataProps } from '@/utility/parametersToDataProps'

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
  storyId?: string
} & Omit<HTMLProps<HTMLIFrameElement>, 'src'>

export function CanvasIframe(props: CanvasIframeProps) {
  const [userConfig, params] = useStoryLiteStore(state => [state.config, state.parameters])
  const userProps = userConfig?.iframeProps || {}
  const { className: userClassName, ...userRest } = userProps
  const { storyId, className, ...rest } = props
  const iframeSrc = getStoryUrl(storyId, {
    target: 'iframe',
    standalone: false,
  })
  const paramsDataProps = parametersToDataProps(params)

  const portal = useStoryLiteIframe()

  return (
    <iframe
      // ref={ref}
      src={iframeSrc}
      onLoad={e => {
        portal?.setIframe(e.currentTarget)
      }}
      title="StoryLite Canvas"
      className={cn('storylite-iframe-element', className, userClassName)}
      allow={allowList.map(permission => `${permission} *`).join('; ')}
      {...rest}
      {...paramsDataProps}
      {...userRest}
    />
  )
}
