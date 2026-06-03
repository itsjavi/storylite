import {
  globalCss,
  home,
  importedCss,
  isStaticBuild,
  managerHtml,
  previewHtml,
  projectUi,
  rendererClientLoaders,
  setupPreview,
  staticStoriesBase,
  storyIdResolver,
  storyModuleExportNames,
  storySourceMetadata,
  storyModules,
} from 'virtual:storylite/project'
import { normalizeStoryModulesWithDiagnostics } from './lib/storylite/normalize'

const normalizedStories = normalizeStoryModulesWithDiagnostics(storyModules, {
  resolveId: storyIdResolver,
  exportNamesByImportPath: storyModuleExportNames,
  sourceMetadataByImportPath: storySourceMetadata,
})

export const stories = normalizedStories.stories
export const storyIdCollisions = normalizedStories.idCollisions
export {
  globalCss,
  home,
  importedCss,
  isStaticBuild,
  managerHtml,
  previewHtml,
  projectUi,
  rendererClientLoaders,
  setupPreview,
  staticStoriesBase,
}
