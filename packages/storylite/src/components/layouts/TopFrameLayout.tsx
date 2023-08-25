import { useStoryLiteParameters, useStoryLiteState } from '@/app/context/StoriesDataContext'
import { parametersToDataProps } from '@/app/parameters/parametersToDataProps'

import Sidebar from '../navbar/Sidebar'
import SidebarTitle from '../navbar/SidebarTitle'
import Toolbar from '../toolbar/Toolbar'

export default function TopFrameLayout({ children }: any) {
  const state = useStoryLiteState()
  const { currentStory, isStandalone } = state

  const [params] = useStoryLiteParameters()
  const paramsDataProps = parametersToDataProps(params)

  return (
    <div className={'storylite-app storylite-top-frame'} {...paramsDataProps}>
      <Sidebar title={<SidebarTitle />} />
      <div className={'storylite-layout-center'}>
        <div className={'storylite-layout-center--pad'}>
          {!isStandalone && (
            <div className={'Header'}>
              <Toolbar
                story={currentStory?.story}
                exportName={currentStory?.exportName}
                storyMeta={currentStory?.meta}
              />
            </div>
          )}
          <main className={'storylite-main'}>{children}</main>
          {/* <div>panel 2</div> */}
        </div>
      </div>
    </div>
  )
}
