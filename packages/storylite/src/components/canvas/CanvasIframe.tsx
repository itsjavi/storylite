import { HTMLProps, useEffect } from 'react'
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
  const { storyId, className, ...rest } = props
  const iframeState = useStoryLiteIframe()
  const [userConfig, stories, currentParams, setParameters] = useStoryLiteStore(state => [
    state.config,
    state.stories,
    state.parameters,
    state.setParameters,
  ])

  const onIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    iframeState?.setIframe(e.currentTarget)
  }

  useEffect(() => {
    if (!storyId || !iframeState.loaded || !iframeState.iframe) {
      return
    }

    const story = stories.get(storyId)
    const hasParams = Object.keys(story?.parameters ?? {}).length > 0

    if (story && hasParams) {
      // If the story has parameters, set them when the iframe loads
      setParameters(
        {
          ...currentParams,
          ...story.parameters,
        },
        { crossWindow: true, persist: false },
      )

      return () => {
        setParameters(currentParams, { crossWindow: true, persist: false })
      }
    }
  }, [storyId, stories, iframeState.loaded, iframeState.iframe])

  const userProps = userConfig?.iframeProps || {}
  const { className: userClassName, ...userRest } = userProps
  const paramsDataProps = parametersToDataProps(currentParams)
  const iframeSrc = getStoryUrl(storyId, {
    target: 'iframe',
    standalone: false,
  })

  return (
    <iframe
      // ref={ref}
      src={iframeSrc}
      onLoad={onIframeLoad}
      title="StoryLite Canvas"
      className={cn('storylite-iframe-element', className, userClassName)}
      allow={allowList.map(permission => `${permission} *`).join('; ')}
      {...rest}
      {...paramsDataProps}
      {...userRest}
    />
  )
}
