import { resolvedVirtualImportedCssId, virtualImportedCssId } from './project-graph.mjs'

const cssRequestRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss)(?:$|\?)/
const viteUpdateStyleCall = '__vite__updateStyle(__vite__id, __vite__css)'
const viteRemoveStylePruneCall = 'import.meta.hot.prune(() => __vite__removeStyle(__vite__id))'

export function storyliteImportedCssBridgePlugin() {
  return {
    name: 'storylite-imported-css-bridge',
    enforce: 'post',
    resolveId(id) {
      if (id === virtualImportedCssId) {
        return resolvedVirtualImportedCssId
      }

      return null
    },
    load(id) {
      if (id !== resolvedVirtualImportedCssId) {
        return null
      }

      return createImportedCssRuntimeCode()
    },
    transform(code, id) {
      if (!cssRequestRE.test(id)) {
        return null
      }

      const rewritten = rewriteImportedCssModule(code)
      return rewritten === code ? null : { code: rewritten, map: null }
    },
  }
}

export function createImportedCssRuntimeCode() {
  return `function createStoryLiteImportedCssRegistry() {
  const entries = new Map();

  return {
    set(id, css) {
      entries.set(String(id), String(css ?? ''));
    },
    delete(id) {
      entries.delete(String(id));
    },
    toArray() {
      return Array.from(entries.values()).filter(Boolean);
    },
  };
}

const storyliteImportedCssTarget = globalThis.window ?? globalThis;

export const storyliteImportedCss =
  storyliteImportedCssTarget.__STORYLITE_IMPORTED_CSS__ ??
  createStoryLiteImportedCssRegistry();

storyliteImportedCssTarget.__STORYLITE_IMPORTED_CSS__ = storyliteImportedCss;
`
}

export function rewriteImportedCssModule(code) {
  if (!code.includes(viteUpdateStyleCall)) {
    return code
  }

  const withBridgeHelpers = `${importedCssBridgeHelpers()}\n${code}`

  return withBridgeHelpers
    .replace(
      viteUpdateStyleCall,
      '__storylite_updateImportedCss(__vite__id, __vite__css, __vite__updateStyle)',
    )
    .replace(
      viteRemoveStylePruneCall,
      'import.meta.hot.prune(() => __storylite_removeImportedCss(__vite__id, __vite__removeStyle))',
    )
}

function importedCssBridgeHelpers() {
  return `function __storylite_importedCssRegistry() {
  const target = globalThis.window ?? globalThis;
  return target.__STORYLITE_IMPORTED_CSS__;
}

function __storylite_updateImportedCss(id, css, fallback) {
  const registry = __storylite_importedCssRegistry();

  if (registry && typeof registry.set === 'function') {
    registry.set(id, css);
    return;
  }

  fallback(id, css);
}

function __storylite_removeImportedCss(id, fallback) {
  const registry = __storylite_importedCssRegistry();

  if (registry && typeof registry.delete === 'function') {
    registry.delete(id);
    return;
  }

  fallback(id);
}
`
}
