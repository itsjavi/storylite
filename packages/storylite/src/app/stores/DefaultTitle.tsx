import logo from '@/assets/logo.svg'
import { InlineHtml } from '@/components/InlineHtml'

export function DefaultTitle(): JSX.Element {
  return (
    <>
      <InlineHtml style={{ width: '24px', height: '24px' }}>{logo}</InlineHtml> StoryLite
    </>
  )
}

export function getDefaultTitle(): JSX.Element {
  return <DefaultTitle />
}
