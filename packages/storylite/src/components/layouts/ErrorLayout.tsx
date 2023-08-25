import { useStoryLiteParameters } from '@/app/context/StoriesDataContext'
import { parametersToDataProps } from '@/app/parameters/parametersToDataProps'

export default function ErrorLayout({ children }: any) {
  const [params] = useStoryLiteParameters()
  const paramsDataProps = parametersToDataProps(params)

  return (
    <div className={'storylite-app storylite-top-frame_ storylite-error'} {...paramsDataProps}>
      {children}
    </div>
  )
}
