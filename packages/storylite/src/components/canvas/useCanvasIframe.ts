import { useEffect, useRef, useState } from 'react'

enum WindowMessageOrigin {
  Same = '/',
  Any = '*',
}

export enum CrossDocumentMessageSource {
  Root = 'storylite_root',
  Iframe = 'storylite_iframe',
}

export type CrossDocumentMessage = {
  source?: CrossDocumentMessageSource
  type: string
  payload: {
    [key: string]: any
  }
}

export type CanvasIframeState = {
  ref: React.MutableRefObject<HTMLIFrameElement | null>
  isReady: boolean
  window?: Window | null
  document?: Document
  sendMessage: (message: CrossDocumentMessage) => void
}

export const sendMessageToRoot = (message: CrossDocumentMessage) => {
  window.parent.postMessage(
    { ...message, source: CrossDocumentMessageSource.Iframe },
    WindowMessageOrigin.Same,
  )
}

export const useCanvasIframe = (
  onIncomingMessage?: (message: CrossDocumentMessage) => void,
): CanvasIframeState => {
  const ref = useRef<HTMLIFrameElement | null>(null)
  const [loadingState, setLoadingState] = useState<'loading' | 'ready'>('loading')

  useEffect(() => {
    const handleIframeLoad = () => {
      setLoadingState('ready')
    }

    const handleReceivedMessage = (event: MessageEvent) => {
      if (!onIncomingMessage) {
        return
      }
      const eventSource = event.data?.source

      // Verify that the message comes from the expected iframe
      if (eventSource === CrossDocumentMessageSource.Iframe) {
        onIncomingMessage(event.data)
      }
    }

    if (ref.current) {
      ref.current.addEventListener('load', handleIframeLoad)
      window.addEventListener('message', handleReceivedMessage)
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('load', handleIframeLoad)
        window.removeEventListener('message', handleReceivedMessage)
      }
    }
  }, [onIncomingMessage])

  const sendMessage = (message: CrossDocumentMessage) => {
    if (!ref.current) {
      throw new Error('useCanvasIframe: ref.current is null')
    }

    if (!ref.current.contentWindow) {
      throw new Error('useCanvasIframe: ref.current.contentWindow is null')
    }

    ref.current.contentWindow.postMessage(
      { ...message, source: CrossDocumentMessageSource.Root },
      WindowMessageOrigin.Same,
    )
  }

  return {
    ref,
    isReady: loadingState === 'ready' && ref.current !== null,
    window: ref.current?.contentWindow,
    document: ref.current?.contentWindow?.document,
    sendMessage,
  }
}
