import { Link } from 'react-router-dom'

import { useStoryLiteConfig } from '@/app/context/StoriesDataContext'

export default function SidebarTitle() {
  const config = useStoryLiteConfig()

  return (
    <div className={'SidebarTitle'}>
      <Link to={'/'}>{config.title}</Link>
    </div>
  )
}
