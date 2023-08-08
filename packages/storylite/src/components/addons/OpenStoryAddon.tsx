import { ExternalLink } from 'lucide-react'

import ToolbarBtn from '../ToolbarBtn'

export default function OpenStoryAddon({
  story,
  exportName,
}: {
  story?: string
  exportName?: string
}) {
  if (!story) {
    return null
  }

  return (
    <ToolbarBtn
      title={`Open story in a new tab`}
      href={`/#/sandbox/stories/${story}${exportName ? '/' + exportName : ''}?standalone`}
      target="_blank"
    >
      {<ExternalLink />}
    </ToolbarBtn>
  )
}
