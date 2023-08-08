import { Link } from 'react-router-dom'

import { Library } from 'lucide-react'
import storiesConfig from 'storylite-user-config'

export default function SidebarTitle() {
  return (
    <div className={'SidebarTitle'}>
      <Link to={'/'}>
        <Library style={{ verticalAlign: 'middle' }} /> {storiesConfig.title}
      </Link>
    </div>
  )
}
