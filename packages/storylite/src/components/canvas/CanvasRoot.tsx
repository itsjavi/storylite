import { useStoryLiteStore } from '@/app/stores/global'
import { parametersToDataProps } from '@/utility/parametersToDataProps'

import { CanvasIframe } from './CanvasIframe'
import { CanvasIframeBody } from './CanvasIframeBody'

export function CanvasRoot({ storyId }: { storyId?: string }) {
  const [stories, defaultStory, currentParams] = useStoryLiteStore(state => [
    state.stories,
    state.config.defaultStory,
    state.parameters,
  ])

  const _storyId = storyId ?? defaultStory

  const renderFrame = stories.get(_storyId)?.renderFrame ?? 'iframe'
  const paramsDataProps = parametersToDataProps(currentParams)

  if (renderFrame === 'root') {
    return (
      <div id="storylite_canvas_root" className="storylite-canvas-root" {...paramsDataProps}>
        <CanvasIframeBody storyId={_storyId} />
      </div>
    )
  }

  return (
    <div id="storylite_canvas_root" className="storylite-canvas-root" {...paramsDataProps}>
      <CanvasIframe storyId={_storyId} />
    </div>
  )
}
