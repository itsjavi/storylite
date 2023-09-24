import ErrorLayout from '@/components/layouts/ErrorLayout'

import type { SLStoryPageProps } from '..'

export default function Error404(props: SLStoryPageProps) {
  return (
    <div className={'storylite-page404'}>
      <section>
        <h1>Error 404: Page Not Found 😵</h1>
        <pre>{props.storyId}</pre>
      </section>
    </div>
  )
}

export const Layout = ErrorLayout
