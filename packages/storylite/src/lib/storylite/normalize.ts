import type {
  StoryArgType,
  StoryArgTypes,
  StoryArgs,
  StoryComponentGroup,
  StoryExport,
  StoryIdCollision,
  StoryIdOptions,
  StoryLiteRenderer,
  StoryLiteStory,
  StoryMeta,
  StoryModuleSourceMetadata,
  StoryModule,
  StoryNormalizationResult,
  StorySort,
  StorySortOrder,
  StorySourceMetadataByImportPath,
  StoryParameters,
  StoryTreeItem,
} from './types'
import { isRecord, kebabCase } from './utils.js'

type MutableComponentGroup = {
  readonly title: string
  readonly stories: StoryLiteStory[]
}

type MutableStoryGroup = {
  readonly title: string
  readonly components: Map<string, MutableComponentGroup>
}

type MutableStoryTreeItem =
  | {
      readonly kind: 'component'
      readonly component: MutableComponentGroup
    }
  | {
      readonly kind: 'group'
      readonly group: MutableStoryGroup
    }

const reservedExports = new Set(['default', '__esModule'])

type StoryNormalizationOptions = StoryIdOptions & {
  readonly exportNames?: readonly string[]
  readonly exportNamesByImportPath?: Record<string, readonly string[]>
  readonly sourceMetadata?: StoryModuleSourceMetadata
  readonly sourceMetadataByImportPath?: StorySourceMetadataByImportPath
}

export function normalizeStoryModules(
  modules: Record<string, StoryModule>,
  options: StoryNormalizationOptions = {},
): readonly StoryLiteStory[] {
  return normalizeStoryModulesWithDiagnostics(modules, options).stories
}

export function normalizeStoryModulesWithDiagnostics(
  modules: Record<string, StoryModule>,
  options: StoryNormalizationOptions = {},
): StoryNormalizationResult {
  const stories = Object.entries(modules).flatMap(([importPath, module]) =>
    normalizeStoryModule(importPath, module, {
      ...options,
      exportNames: options.exportNamesByImportPath?.[importPath] ?? options.exportNames,
      sourceMetadata: options.sourceMetadataByImportPath?.[importPath] ?? options.sourceMetadata,
    }),
  )

  return {
    stories,
    idCollisions: findStoryIdCollisions(stories),
  }
}

export function normalizeStoryModule(
  importPath: string,
  module: StoryModule,
  options: StoryNormalizationOptions = {},
): readonly StoryLiteStory[] {
  const meta = isRecord(module.default) ? (module.default as StoryMeta) : {}
  const title = normalizeTitle(meta.title, importPath)
  const stories: StoryLiteStory[] = []

  for (const [exportName, value] of orderedStoryModuleEntries(module, options.exportNames)) {
    if (reservedExports.has(exportName)) {
      continue
    }

    const storyExport = normalizeStoryExport(value)
    if (!storyExport) {
      continue
    }

    const name = storyExport.name ?? labelFromExportName(exportName)
    const args = mergeArgs(meta.args, storyExport.args)
    const argTypes = mergeArgTypes(meta.argTypes, storyExport.argTypes)
    const parameters = mergeParameters(meta.parameters, storyExport.parameters)
    const component = storyExport.component ?? meta.component
    const render = storyExport.render
    const source = storyExport.source ?? meta.source
    const sourceComponentName =
      options.sourceMetadata?.storyComponentNames?.[exportName] ??
      options.sourceMetadata?.metaComponentName
    const renderer = selectRenderer(parameters, component, render)

    stories.push({
      id: storyId(importPath, exportName, options.resolveId),
      importPath,
      exportName,
      title,
      name,
      component,
      args,
      argTypes,
      parameters,
      render,
      source,
      sourceComponentName,
      renderer,
    })
  }

  return stories
}

export function groupStories(stories: readonly StoryLiteStory[]): readonly StoryTreeItem[] {
  const items: MutableStoryTreeItem[] = []
  const rootComponents = new Map<string, MutableComponentGroup>()
  const groups = new Map<string, MutableStoryGroup>()

  for (const story of stories) {
    const path = storyTreePath(story.title)

    if (!path.groupTitle) {
      let component = rootComponents.get(path.componentTitle)

      if (!component) {
        component = { title: path.componentTitle, stories: [] }
        rootComponents.set(path.componentTitle, component)
        items.push({ kind: 'component', component })
      }

      component.stories.push(story)
      continue
    }

    let group = groups.get(path.groupTitle)

    if (!group) {
      group = { title: path.groupTitle, components: new Map() }
      groups.set(path.groupTitle, group)
      items.push({ kind: 'group', group })
    }

    let component = group.components.get(path.componentTitle)

    if (!component) {
      component = { title: path.componentTitle, stories: [] }
      group.components.set(path.componentTitle, component)
    }

    component.stories.push(story)
  }

  return items.map((item) =>
    item.kind === 'component'
      ? finalizeComponentGroup(item.component)
      : finalizeStoryGroup(item.group),
  )
}

type ParsedSortEntry = {
  name: string
  children?: StorySortOrder
}

function parseStorySortOrder(order: StorySortOrder): {
  entries: ParsedSortEntry[]
  fallback: number
} {
  const entries: ParsedSortEntry[] = []

  for (const item of order) {
    if (typeof item === 'string') {
      entries.push({ name: item })
    } else if (Array.isArray(item) && entries.length > 0) {
      entries[entries.length - 1].children = item
    }
  }

  const wildcardIndex = entries.findIndex((entry) => entry.name === '*')
  return { entries, fallback: wildcardIndex === -1 ? entries.length : wildcardIndex }
}

function sortByStorySortOrder<T>(
  nodes: readonly T[],
  getName: (node: T) => string,
  order: StorySortOrder | undefined,
): { node: T; children?: StorySortOrder }[] {
  if (!Array.isArray(order) || order.length === 0) {
    return nodes.map((node) => ({ node }))
  }

  const { entries, fallback } = parseStorySortOrder(order)
  const positionOf = (name: string): number => {
    const index = entries.findIndex((entry) => entry.name === name)
    return index === -1 ? fallback : index
  }

  return nodes
    .map((node, index) => ({ node, index, position: positionOf(getName(node)) }))
    .sort((a, b) => a.position - b.position || a.index - b.index)
    .map(({ node }) => ({
      node,
      children: entries.find((entry) => entry.name === getName(node))?.children,
    }))
}

export function sortStoryTree(
  items: readonly StoryTreeItem[],
  storySort?: StorySort | null,
): readonly StoryTreeItem[] {
  const order = storySort?.order
  if (!Array.isArray(order) || order.length === 0) {
    return items
  }

  return sortByStorySortOrder(items, (item) => item.title, order).map(({ node, children }) =>
    sortTreeItemChildren(node, children),
  )
}

function sortTreeItemChildren(
  item: StoryTreeItem,
  childOrder: StorySortOrder | undefined,
): StoryTreeItem {
  if (item.kind === 'group') {
    return {
      ...item,
      components: sortByStorySortOrder(
        item.components,
        (component) => component.title,
        childOrder,
      ).map(({ node, children }) => sortComponentStories(node, children)),
    }
  }

  return sortComponentStories(item, childOrder)
}

function sortComponentStories(
  component: StoryComponentGroup,
  storyOrder: StorySortOrder | undefined,
): StoryComponentGroup {
  if (!Array.isArray(storyOrder) || storyOrder.length === 0) {
    return component
  }

  return {
    ...component,
    stories: sortByStorySortOrder(component.stories, (story) => story.name, storyOrder).map(
      ({ node }) => node,
    ),
  }
}

export function storyId(
  importPath: string,
  exportName: string,
  resolveId?: StoryIdOptions['resolveId'],
): string {
  return storyIdFromSuggestion(importPath, exportName, resolveId)
}

export function storyIdFromSuggestion(
  importPath: string,
  exportName: string,
  resolveId?: StoryIdOptions['resolveId'],
): string {
  const suggestedId = suggestedStoryId(importPath, exportName)
  const resolvedId = resolveId?.(importPath, suggestedId) ?? suggestedId
  return String(resolvedId || suggestedId).trim() || suggestedId
}

export function suggestedStoryId(importPath: string, exportName: string): string {
  const pathPart = importPath
    .replace(/^\.\.\//, '')
    .replace(/^(?:\.\/)?src\//, '')
    .replace(/\.(stories|story)\.[cm]?[tj]sx?$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return `${pathPart}--${kebabCase(exportName)}`
}

export function findStoryIdCollisions(
  stories: readonly StoryLiteStory[],
): readonly StoryIdCollision[] {
  const byId = new Map<string, StoryLiteStory[]>()

  for (const story of stories) {
    const group = byId.get(story.id) ?? []
    group.push(story)
    byId.set(story.id, group)
  }

  return Array.from(byId.entries())
    .filter(([, group]) => group.length > 1)
    .map(([id, group]) => ({
      id,
      stories: group.map((story) => ({
        importPath: story.importPath,
        exportName: story.exportName,
        title: story.title,
        name: story.name,
      })),
    }))
}

export function inferControlType(argType: StoryArgType | undefined, value: unknown): string {
  const control = argType?.control

  if (typeof control === 'string') {
    return control
  }

  if (isRecord(control) && typeof control.type === 'string') {
    return control.type
  }

  if (Array.isArray(argType?.options)) {
    return 'select'
  }

  switch (typeof value) {
    case 'boolean':
      return 'boolean'
    case 'number':
      return 'number'
    case 'object':
      return 'json'
    default:
      return 'text'
  }
}

function normalizeStoryExport(value: unknown): StoryExport | null {
  if (typeof value === 'function') {
    return { render: value as StoryExport['render'] }
  }

  if (!isRecord(value)) {
    return null
  }

  return value as StoryExport
}

function orderedStoryModuleEntries(
  module: StoryModule,
  exportNames: readonly string[] = [],
): [string, unknown][] {
  const entries: [string, unknown][] = []
  const seen = new Set<string>()

  for (const exportName of exportNames) {
    if (seen.has(exportName) || reservedExports.has(exportName) || !(exportName in module)) {
      continue
    }

    entries.push([exportName, module[exportName]])
    seen.add(exportName)
  }

  for (const [exportName, value] of Object.entries(module)) {
    if (!seen.has(exportName)) {
      entries.push([exportName, value])
    }
  }

  return entries
}

function normalizeTitle(title: string | undefined, importPath: string): string {
  if (title?.trim()) {
    return title.trim()
  }

  return (
    importPath
      .split('/')
      .at(-1)
      ?.replace(/\.(stories|story)\.[cm]?[tj]sx?$/, '')
      .replaceAll('-', ' ') ?? 'Stories'
  )
}

function storyTreePath(title: string): { groupTitle?: string; componentTitle: string } {
  const parts = title
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return { componentTitle: 'Stories' }
  }

  if (parts.length === 1) {
    return { componentTitle: parts[0] ?? 'Stories' }
  }

  return {
    groupTitle: parts.slice(0, -1).join('/'),
    componentTitle: parts.at(-1) ?? 'Stories',
  }
}

function finalizeComponentGroup(component: MutableComponentGroup): StoryComponentGroup {
  return {
    kind: 'component',
    title: component.title,
    stories: component.stories,
    storyCount: component.stories.length,
  }
}

function finalizeStoryGroup(group: MutableStoryGroup): StoryTreeItem {
  const components = Array.from(group.components.values()).map(finalizeComponentGroup)

  return {
    kind: 'group',
    title: group.title,
    components,
    storyCount: components.reduce((count, component) => count + component.storyCount, 0),
  }
}

function labelFromExportName(exportName: string): string {
  return exportName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mergeArgs(metaArgs: StoryArgs | undefined, storyArgs: StoryArgs | undefined): StoryArgs {
  return { ...(metaArgs ?? {}), ...(storyArgs ?? {}) }
}

function mergeArgTypes(
  metaArgTypes: StoryArgTypes | undefined,
  storyArgTypes: StoryArgTypes | undefined,
): Record<string, StoryArgType> {
  const merged: Record<string, StoryArgType> = {}

  for (const [name, argType] of Object.entries({
    ...(metaArgTypes ?? {}),
    ...(storyArgTypes ?? {}),
  })) {
    if (argType) {
      merged[name] = argType
    }
  }

  return merged
}

function mergeParameters(
  metaParameters: StoryParameters | undefined,
  storyParameters: StoryParameters | undefined,
): StoryParameters {
  return { ...(metaParameters ?? {}), ...(storyParameters ?? {}) }
}

function selectRenderer(
  parameters: StoryParameters,
  component: string | unknown,
  render: StoryExport['render'],
): StoryLiteRenderer {
  if (parameters.renderer) {
    return parameters.renderer
  }

  if (typeof component === 'string' && !render) {
    return 'web-components'
  }

  return 'html'
}
