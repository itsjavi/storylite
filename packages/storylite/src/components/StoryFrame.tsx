import { ElementIds } from '@/types'

type StoryFrameProps = {
  story?: string
  exportName?: string
}

export default function StoryFrame({ story, exportName }: StoryFrameProps) {
  const iframeSrc =
    story === undefined ? '/#/sandbox/dashboard' : `/#/sandbox/stories/${story}/${exportName || ''}`

  return (
    <iframe title="StoryFrame" id={ElementIds.Iframe} className={'StoryFrame'} src={iframeSrc} />
  )
}
