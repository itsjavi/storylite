import { Plugin } from 'vite'

function removeTestIdsPlugin(enabled = true): Plugin {
  return {
    name: 'remove-test-ids',
    transform(code, id) {
      if (enabled && (id.endsWith('ts') || id.endsWith('tsx'))) {
        code.match(/data-testid=".*?"/g)?.forEach(match => {
          code = code.replace(match, '')
        })
      }

      return code
    },
  }
}

export default removeTestIdsPlugin
