import { useStoryLiteStore } from '@/app/stores/global'
import { Link } from '@/services/router/router.component'

export function SidebarTitle() {
  const config = useStoryLiteStore(state => state.config)

  return (
    <div className={'SidebarTitle'}>
      <Link to={'/'}>{config.title}</Link>
    </div>
  )
}
