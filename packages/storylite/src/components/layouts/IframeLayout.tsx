import { useSearchParams } from 'react-router-dom'
import { cn } from '@r1stack/core'

import { useStoryLiteConfig, useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { parametersToDataProps } from '@/app/parameters/parametersToDataProps'

export default function CanvasIframeLayout({ children }: any) {
  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')
  const userConfig = useStoryLiteConfig()

  const [params] = useStoryLiteParameters()
  const paramsDataProps = parametersToDataProps(params)

  return (
    <div
      className={cn(
        'storylite-app',
        'storylite-iframe',
        [userConfig.iframeOptions?.useDefaultStyles ?? true, 'storylite-iframe--default-styles'],
        [isStandalone, 'storylite-iframe--standalone'],
      )}
      {...paramsDataProps}
      data-sl-standlone={isStandalone}
    >
      <main className={'storylite-main'}>{children}</main>
    </div>
  )
}
