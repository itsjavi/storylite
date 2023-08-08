import { useState } from 'react'

import { Sidebar } from 'lucide-react'

import { ElementIds } from '../../types'
import ToolbarBtn from '../ToolbarBtn'

function SidebarAddon() {
  const [isOpen, setIsOpen] = useState(true)

  if (!document.exitFullscreen) {
    return null
  }

  const _handleToggle = () => {
    const parentDoc = window.parent.document
    const sidebar = parentDoc.getElementById(ElementIds.Sidebar)

    if (sidebar === null) {
      throw new Error('sidebar element not found on window.parent.document')
    }

    if (!isOpen) {
      sidebar.dataset.open = 'true'
    } else {
      sidebar.dataset.open = 'false'
    }

    setIsOpen(!isOpen)
  }

  return (
    <ToolbarBtn title={`Open and close the sidebar`} onClick={_handleToggle} isActive={isOpen}>
      {<Sidebar />}
    </ToolbarBtn>
  )
}

export default SidebarAddon
