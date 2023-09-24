import React, { useEffect } from 'react'

import { useStoryLiteStore } from '@/app/stores/global'
import type { SLColorScheme } from '@/types'

export function useDetectTheme(): string {
  const [userConfig, params] = useStoryLiteStore(state => [state.config, state.parameters])
  const [detectedTheme, setDetectedTheme] = React.useState<'light' | 'dark' | 'auto'>(
    (params.theme.value as SLColorScheme) ?? 'auto',
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const themeAttrName = userConfig.themeAttribute ?? 'data-theme'

    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isAuto = params.theme.value === 'auto' || !params.theme.value

      if (!isAuto) {
        const value = String(params.theme.value ?? '')
        document.body.setAttribute(themeAttrName, value)
        setDetectedTheme(value as SLColorScheme)

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
  }, [params.theme.value, userConfig.themeAttribute])

  return detectedTheme
}
