import { getStoryLiteState } from '@/app/stores/global'

export function getStoryLiteBasePath() {
  return getStoryLiteState().config.basePath
}

export function getStoryLiteBaseCanvasPath() {
  return getStoryLiteState().config.canvasPath
}
