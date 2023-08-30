import { useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { parametersToDataProps } from '@/app/parameters/parametersToDataProps'

import { Sidebar } from '../sidebar/Sidebar'
import { SidebarTitle } from '../sidebar/SidebarTitle'
import { Toolbar } from '../toolbar/Toolbar'

export default function TopFrameLayout({ children, ...props }: any) {
  const { standalone } = props
  const isStandalone = standalone === 'true'

  const [params] = useStoryLiteParameters()
  const paramsDataProps = parametersToDataProps(params)

  return (
    <div className={'storylite-app storylite-top-frame'} {...paramsDataProps}>
      <Sidebar title={<SidebarTitle />} />
      <div className={'storylite-layout-center'}>
        <div className={'storylite-layout-center--pad'}>
          {!isStandalone && (
            <div className={'storylite-top-panel'}>
              <Toolbar />
            </div>
          )}
          <main className={'storylite-main'}>{children}</main>
          {/* <div>Bottom Panel here</div> */}
        </div>
      </div>
    </div>
  )
}
