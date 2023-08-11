import { Link } from 'react-router-dom'

import { Library } from 'lucide-react'

import { useStoryliteConfig } from '@/context/StoriesDataContext'

export default function SidebarTitle() {
  const config = useStoryliteConfig()

  return (
    <div className={'SidebarTitle'}>
      <Link to={'/'}>
        <Library style={{ verticalAlign: 'middle' }} /> {config.title}
      </Link>
    </div>
  )
}
