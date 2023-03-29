import { Moon } from 'lucide-react'

import { useEffect } from 'react'

import { useBrowserStorage } from '@storylite/support/dist/react'

import { ColorScheme } from '@/types'

import ToolbarBtn from '../ToolbarBtn'

function DarkModeAddon() {
  const { value: colorScheme, setValue: setColorScheme } = useBrowserStorage(
    'color-scheme',
    ColorScheme.Light
  )

  const updateHtmlAttribute = (colorScheme: ColorScheme): void => {
    const htmlRoot = document.getElementsByTagName('html')[0]
    const parentHtmlRoot = window.parent.document.getElementsByTagName('html')[0]

    // window.frames[0].document.getElementsByTagName('html')[0].dataset.colorScheme = 'dark'
    // window.frames[ElementIds.Iframe].document.getElementsByTagName('html')[0].dataset.colorScheme = 'dark'

    parentHtmlRoot.dataset.colorScheme = htmlRoot.dataset.colorScheme = colorScheme
  }

  const handleClick = () => {
    if (colorScheme === ColorScheme.Dark) {
      updateHtmlAttribute(ColorScheme.Light)
      setColorScheme(ColorScheme.Light)

      return
    }
    updateHtmlAttribute(ColorScheme.Dark)
    setColorScheme(ColorScheme.Dark)
  }

  useEffect(() => {
    if (colorScheme) {
      updateHtmlAttribute(colorScheme)
    }
  }, [colorScheme])

  return (
    <ToolbarBtn
      title={`Switch color scheme Dark/Light`}
      onClick={handleClick}
      isActive={colorScheme === ColorScheme.Dark}
    >
      {<Moon />}
    </ToolbarBtn>
  )
}

export default DarkModeAddon
