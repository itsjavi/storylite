import { cn } from '@r1stack/core'

import { useStoryLiteConfig, useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { useDetectTheme } from '@/app/hooks/useDetectTheme'
import { parametersToDataProps } from '@/app/parameters/parametersToDataProps'

export default function CanvasIframeLayout({ children, ...props }: any) {
  const { standalone } = props
  const isStandalone = standalone === 'true'
  const userConfig = useStoryLiteConfig()

  const [params] = useStoryLiteParameters()
  const paramsDataProps = parametersToDataProps(params)

  const resolvedTheme = useDetectTheme()
  paramsDataProps['data-sl-theme'] = resolvedTheme

  return (
    <div
      className={cn(
        'storylite-app',
        'storylite-iframe',
        [userConfig.iframeOptions?.useDefaultStyles ?? true, 'storylite-iframe--default-styles'],
        [isStandalone, 'storylite-iframe--standalone'],
      )}
      {...paramsDataProps}
      data-sl-standalone={isStandalone}
    >
      <main className={'storylite-main'}>{children}</main>
    </div>
  )
}
