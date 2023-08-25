import React from 'react'

import { act, render, renderHook, waitFor } from '@testing-library/react'

import {
  CrossDocumentMessage,
  CrossDocumentMessageSource,
  useCanvasIframe,
} from './useCanvasIframe'

// Mock postMessage for testing
window.postMessage = jest.fn()
const iframeMock = {
  contentWindow: {
    postMessage: jest.fn(),
  },
  addEventListener: jest.fn().mockImplementation((event, cb) => {
    if (event === 'load') {
      cb()
    }
  }),
  removeEventListener: jest.fn(),
}

describe('useCanvasIframe', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockUseRef = () => {
    jest.spyOn(React, 'useRef').mockReturnValue({ current: iframeMock })
  }

  const renderIframe = (args: Parameters<typeof useCanvasIframe> = []) => {
    const { result } = renderHook(() => useCanvasIframe(...args))
    render(
      <div>
        <iframe
          data-testid="test-iframe"
          title="test"
          onLoad={() => {
            result.current.isReady = true
            // result.current.ref.current = iframeElementMock as unknown as HTMLIFrameElement
          }}
        />
      </div>,
    )

    return result.current
  }

  const renderMockedIframe = async (args: Parameters<typeof useCanvasIframe> = []) => {
    mockUseRef()
    const result = renderIframe(args)
    await waitFor(() => {
      expect(result.isReady).toBe(true)
    })

    return result
  }

  test('should set up iframe listeners correctly', async () => {
    const result = await renderMockedIframe()

    expect(result.isReady).toBe(true)
  })

  test('should send message to iframe', async () => {
    const result = await renderMockedIframe()

    const message: CrossDocumentMessage = {
      type: 'test',
      payload: {
        test: 'Hello',
      },
    }
    act(() => {
      result.sendMessage(message)
    })

    expect(iframeMock.contentWindow.postMessage).toHaveBeenCalledWith(
      { ...message, source: CrossDocumentMessageSource.Root },
      '/',
    )
  })

  test('should call onMessage callback when message received', async () => {
    const onMessage = jest.fn()
    await renderMockedIframe([onMessage])

    const message: CrossDocumentMessage = {
      type: 'test',
      payload: {
        test: 'Hello',
      },
      source: CrossDocumentMessageSource.Iframe,
    }
    const event = new MessageEvent('message', {
      source: iframeMock.contentWindow as unknown as Window,
      data: message,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(onMessage).toHaveBeenCalledWith(message)
  })

  test('should not call onMessage callback if source is not the iframe', async () => {
    const onMessage = jest.fn()
    await renderMockedIframe([onMessage])

    const event = new MessageEvent('message', {
      source: null,
      data: {
        source: 'other' as any,
        type: 'test',
        payload: {
          test: 'Hello',
        },
      } satisfies CrossDocumentMessage,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(onMessage).not.toHaveBeenCalled()
  })
})
