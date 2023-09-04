import { useStoryLiteStore } from '@/app/stores/global'
import { getStoryLiteBasePath } from '@/services/router/getStoryLiteBasePath'
import { Link } from '@/services/router/router.component'

export function SidebarTitle() {
  const config = useStoryLiteStore(state => state.config)
  const basePath = getStoryLiteBasePath()

  return (
    <div className={'storylite-sidebar-title'}>
      <Link to={basePath}>{config.title}</Link>
    </div>
  )
}
