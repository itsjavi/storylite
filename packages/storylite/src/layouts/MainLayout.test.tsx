import { render, screen } from '@/testing'
import App from './MainLayout'

describe('MainLayout', () => {
  it('all the elements are visible', () => {
    render(<App />)
    expect(screen.getByTestId('styles-global')).toBeInTheDocument()
    expect(screen.queryByTestId('styles-global--userDefined')).toBeNull()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('main')).toBeInTheDocument()
  })
})
