import { ExternalLink } from 'lucide-react'

import { getStoryUrl } from '@/app/navigation/urlUtils'

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
      href={getStoryUrl(story, exportName, {
        target: 'iframe',
        hashbang: true,
        standalone: true,
      })}
      target="_blank"
    >
      {<ExternalLink />}
    </ToolbarBtn>
  )
}
