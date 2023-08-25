import { HTMLProps, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '@r1stack/core'

import { Story } from '../Story'
import { CrossDocumentMessageSource, sendMessageToRoot } from './useCanvasIframe'

export type CanvasIframeBodyProps = {
  story?: string
  exportName?: string
} & HTMLProps<HTMLDivElement>

export function CanvasIframeBody(props: CanvasIframeBodyProps) {
  const { story, exportName, ...rest } = props

  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')

  useEffect(() => {
    const onMessage = (message: any) => {
      // eslint-disable-next-line no-console
      console.log('[iframe] Message received:', message)
      // do something, .e.g.: use global state manager
    }
    const handleReceivedMessage = (event: MessageEvent) => {
      const eventSource = event.data?.source

      // Verify that the message comes from the expected sender
      if (eventSource === CrossDocumentMessageSource.Root) {
        onMessage(event.data)
      }
    }
    window.addEventListener('message', handleReceivedMessage)

    return () => {
      window.removeEventListener('message', handleReceivedMessage)
    }
  }, [])

  return (
    <div className={cn('SandboxLayout', [isStandalone, 'StandaloneSandboxLayout'])} {...rest}>
      <button
        onClick={() => {
          sendMessageToRoot({
            type: 'chat',
            payload: {
              message: 'Hello from iframe',
            },
          })
        }}
      >
        Send message to main window
      </button>
      <Story story={story ?? 'index'} exportName={exportName ?? 'default'} />
    </div>
  )
}
