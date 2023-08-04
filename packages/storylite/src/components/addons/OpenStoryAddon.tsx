import { ExternalLink } from 'lucide-react'
import ToolbarBtn from '../ToolbarBtn'

export default function OpenStoryAddon({ story }: { story?: string }) {
  if (!story) {
    return null
  }

  return (
    <ToolbarBtn
      title={`Open story in a new tab`}
      href={`/sandbox/stories/${story}?standalone`}
      target="_blank"
    >
      {<ExternalLink />}
    </ToolbarBtn>
  )
}
