import React, { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { cleanup, render, RenderOptions } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

const renderWithProviders = (ui: ReactElement, options: RenderOptions = {}) =>
  render(ui, {
    // add provider(s) here if needed:
    wrapper: ({ children }) => {
      return <BrowserRouter>{children}</BrowserRouter>
    },
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { renderWithProviders as render }
