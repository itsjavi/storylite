import { useEffect } from 'react'

import { useStoryLiteStore } from '@/app/stores/global'

import { registerWindowMessageListener, sendWindowMessage } from './windowMessaging'
import {
  type CrossDocumentMessage,
  CrossDocumentMessageSource,
  CrossDocumentMessageType,
} from './windowMessaging.types'

export function useWindowMessenger() {
  const [canvas, params, setParams] = useStoryLiteStore((state) => [
    state.canvas,
    state.parameters,
    state.setParameters,
  ])

  const handleMessageFromTopFrame = (message: CrossDocumentMessage) => {
    // here is where the iframe processes messages from the root
    if (message.source !== CrossDocumentMessageSource.Root) {
      return
    }
    if (message.type === CrossDocumentMessageType.UpdateParameters) {
      setParams(message.payload, { persist: false, crossWindow: false })
    }
  }

  useEffect(() => {
    if (!canvas.element || !canvas.element.contentWindow) {
      return
    }
    if (canvas.element.contentWindow) {
      // send a message to the iframe window, and tell it to update the parameters in its context
      sendWindowMessage(
        {
          type: CrossDocumentMessageType.UpdateParameters,
          payload: params,
        },
        CrossDocumentMessageSource.Root,
        canvas.element.contentWindow,
      )
    }
  }, [canvas, canvas.element, params])

  // If we receive a message from the root, it means we are in an iframe
  registerWindowMessageListener(handleMessageFromTopFrame, CrossDocumentMessageSource.Root, window)
}
