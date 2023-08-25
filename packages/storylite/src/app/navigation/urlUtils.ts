export function getStoryUrl(
  story: string | undefined,
  exportName: string | undefined,
  options: { standalone?: boolean; hashbang?: boolean; target: 'top' | 'iframe' } = {
    target: 'top',
    standalone: false,
    hashbang: true,
  },
): string {
  const { standalone, hashbang, target } = options
  const targetStr = target === 'iframe' ? '/iframe/' : '/'
  const hashStr = hashbang ? '/#' : '/'
  const baseStr = `${hashStr}${targetStr}`.replace(/\/\//g, '/')

  let url =
    story === undefined ? `${baseStr}dashboard` : `${baseStr}stories/${story}/${exportName || ''}`

  if (standalone) {
    url += `/?standalone=true`
  }

  return url
}

/**
 * Splits string by every '/', when it's not followed by another '/'
 */
export const splitPathSegments = (path: string) => path.split(/\/(?!\/)/g)
