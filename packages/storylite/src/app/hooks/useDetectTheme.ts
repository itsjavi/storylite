import React, { useEffect } from 'react'

import { SLColorScheme } from '@/types'

import { useStoryLiteConfig, useStoryLiteParameters } from '../context/StoriesDataContext'

export function useDetectTheme(): string {
  const userConfig = useStoryLiteConfig()
  const [params] = useStoryLiteParameters()
  const [detectedTheme, setDetectedTheme] = React.useState<'light' | 'dark' | 'auto'>(
    (params.theme.value as SLColorScheme) ?? 'auto',
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const themeAttrName = userConfig.themeAttribute ?? 'data-theme'

    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isAuto = params.theme.value === 'auto' || !params.theme.value

      if (!isAuto) {
        document.body.setAttribute(themeAttrName, String(params.theme.value ?? ''))

        return
      }
      const theme = e.matches ? 'dark' : 'light'
      document.body.setAttribute(themeAttrName, theme)
      setDetectedTheme(theme)
    }

    handleThemeChange(mediaQuery)

    mediaQuery.addEventListener('change', handleThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [params])

  return detectedTheme
}
