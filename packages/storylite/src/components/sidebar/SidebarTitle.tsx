import { useStoryLiteConfig } from '@/app/context/StoriesDataContext'
import { Link } from '@/services/router/router.component'

export function SidebarTitle() {
  const config = useStoryLiteConfig()

  return (
    <div className={'SidebarTitle'}>
      <Link to={'/'}>{config.title}</Link>
    </div>
  )
}
