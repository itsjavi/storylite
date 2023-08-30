import { useStoryLiteStore } from '@/app/stores/global'
import { parametersToDataProps } from '@/utility/parametersToDataProps'

export default function ErrorLayout({ children }: any) {
  const params = useStoryLiteStore(state => state.parameters)
  const paramsDataProps = parametersToDataProps(params)

  return (
    <div className={'storylite-app storylite-top-frame_ storylite-error'} {...paramsDataProps}>
      {children}
    </div>
  )
}
