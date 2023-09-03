import { cn } from '@r1stack/cn'

import { useStoryLiteStore } from '@/app/stores/global'
import { useDetectTheme } from '@/hooks/useDetectTheme'
import { useWindowMessenger } from '@/services/messenger/useWindowMessenger'
import { parametersToDataProps } from '@/utility/parametersToDataProps'

export default function CanvasIframeLayout({ children, ...props }: any) {
  useWindowMessenger()

  const { standalone } = props
  const isStandalone = standalone === 'true'
  const [userConfig, params] = useStoryLiteStore(state => [state.config, state.parameters])
  const paramsDataProps = parametersToDataProps(params)

  const resolvedTheme = useDetectTheme()
  paramsDataProps['data-sl-theme'] = resolvedTheme

  return (
    <div
      className={cn(
        'storylite-app',
        'storylite-iframe',
        [userConfig.useIframeStyles ?? true, 'storylite-iframe--default-styles'],
        [isStandalone, 'storylite-iframe--standalone'],
      )}
      {...paramsDataProps}
      data-sl-standalone={isStandalone}
    >
      <main className={'storylite-main'}>{children}</main>
    </div>
  )
}
