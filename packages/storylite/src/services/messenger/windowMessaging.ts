import { CrossDocumentMessageSource, WindowMessageOrigin, type CrossDocumentMessage } from './windowMessaging.types'

export const sendWindowMessageToRoot = (message: CrossDocumentMessage) => {
  sendWindowMessage(message, CrossDocumentMessageSource.Iframe, window.parent)
}

export const sendWindowMessage = (
  message: CrossDocumentMessage,
  from: CrossDocumentMessageSource,
  to: Window | null | undefined,
) => {
  if (!to) {
    throw new Error('[sendMessage] The destinatary window is null or undefined')
  }

  to.postMessage({ ...message, source: from }, WindowMessageOrigin.Same)
}

export const registerWindowMessageListener = (
  callback: (message: CrossDocumentMessage) => void,
  scope: CrossDocumentMessageSource,
  window: Window | null | undefined,
) => {
  if (!window) {
    return
  }

  const handleReceivedMessage = (event: MessageEvent) => {
    const eventSource = event.data?.source
    // Verify that the message comes from the expected emitter
    if (eventSource === scope) {
      callback(event.data)
    }
  }

  window.addEventListener('message', handleReceivedMessage)

  return () => {
    window.removeEventListener('message', handleReceivedMessage)
  }
}
