import { useStoryLiteStore } from '@/app/stores/global'
import { useDetectTheme } from '@/hooks/useDetectTheme'
import { useWindowMessenger } from '@/services/messenger/useWindowMessenger'
import { parametersToDataProps } from '@/utility/parametersToDataProps'

import { Sidebar } from '../sidebar/Sidebar'
import { SidebarTitle } from '../sidebar/SidebarTitle'
import { Toolbar } from '../toolbar/Toolbar'

export default function TopFrameLayout({ children, ...props }: any) {
  useWindowMessenger()

  const { standalone } = props
  const isStandalone = standalone === 'true'

  const params = useStoryLiteStore(state => state.parameters)
  const paramsDataProps = parametersToDataProps(params)
  const resolvedTheme = useDetectTheme()
  paramsDataProps['data-sl-theme'] = resolvedTheme

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
