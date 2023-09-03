import { useStoryLiteStore } from '@/app/stores/global'
import { STORYLITE_BASE_PATH } from '@/services/router'
import { Link } from '@/services/router/router.component'

export function SidebarTitle() {
  const config = useStoryLiteStore(state => state.config)

  return (
    <div className={'storylite-sidebar-title'}>
      <Link to={STORYLITE_BASE_PATH}>{config.title}</Link>
    </div>
  )
}
