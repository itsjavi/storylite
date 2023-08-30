import { ExternalLink } from 'lucide-react'

import { getStoryUrl } from '@/app/router/router.utils'

import { Btn } from '../../Btn'

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
    <Btn
      title={`Open story in a new tab`}
      href={getStoryUrl(story, exportName, {
        target: 'iframe',
        standalone: true,
      })}
      target="_blank"
    >
      {<ExternalLink />}
    </Btn>
  )
}
