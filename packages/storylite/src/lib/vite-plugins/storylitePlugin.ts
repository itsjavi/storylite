import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { Plugin } from 'vite'
import { StoryLiteUserConfig } from '@/types'

const storyliteConfigFile: string = path.resolve(process.cwd(), 'storylite.config.ts')
const configFileExists = existsSync(storyliteConfigFile)

if (
  configFileExists &&
  (storyliteConfigFile.endsWith('.ts') || storyliteConfigFile.endsWith('.tsx'))
) {
  execSync('tsc --moduleResolution node --module esnext ' + storyliteConfigFile, {
    encoding: 'utf-8',
    stdio: 'inherit',
  })
}

const storyliteConfigFileJs = storyliteConfigFile.replace(/\.tsx?$/, '.js')

const defaultConfig: StoryLiteUserConfig = {
  stories: path.join(process.cwd(), 'stories/**/*.stories.tsx'),
  defaultStory: 'index',
  title: 'StoryLite',
  styles: {
    ui: [],
    sandbox: [],
  },
}

const getStoryLiteConfig = async (): Promise<{ config: StoryLiteUserConfig; code: string }> => {
  if (existsSync(storyliteConfigFile)) {
    const storyliteConfig = await import(storyliteConfigFileJs)

    const code = `
    import config from '${storyliteConfigFileJs}'
    
    const defaultConfig = ${JSON.stringify(defaultConfig)}
    const resolvedConfig = { ...defaultConfig, ...config }
    
    export default resolvedConfig
  `

    return {
      config: storyliteConfig.default,
      code,
    }
  }

  const code = `
    export default ${JSON.stringify(defaultConfig)}
  `

  return {
    config: defaultConfig,
    code,
  }
}

//
// const getCssContents = async (cssFiles: string[]) => {
//   const cssFileContents = await Promise.all(
//     cssFiles.map(async cssFile => {
//       return await fs.readFile(cssFile)
//     })
//   )
//
//   return cssFileContents.join('\n')
// }

const createCssBundleCode = (cssFiles: string[]) => {
  // import all as inline and export a concat of them:
  const cssImports = cssFiles
    .map((cssFile, idx) => `import css${idx} from '${cssFile}?inline'`)
    .join('\n')

  const cssExports = cssFiles.map((cssFile, idx) => `css${idx}`).join(' + ')

  const cssVarDeclaration = `const cssConcat = ${cssExports.length > 0 ? cssExports : '""'};`

  return `${cssImports}\n${cssVarDeclaration}\nexport default cssConcat`
}

const moduleNames = {
  userConfig: 'storylite-user-config',
  userStories: 'storylite-user-stories',
  userUiStyles: 'storylite-user-styles-ui',
  userSandboxStyles: 'storylite-user-styles-sandbox',
}

const storylitePlugin = async (): Promise<Plugin> => {
  const { config: storyliteConfig, code: storyliteConfigImportCode } = await getStoryLiteConfig()
  // Define the file pattern to match
  const pattern = storyliteConfig.stories
  const moduleIds = Object.values(moduleNames)

  return {
    name: 'import-stories',
    config: async () => {
      return storyliteConfig.vite
    },
    resolveId(id) {
      if (moduleIds.includes(id)) {
        return id // return the exact same ID, so Vite knows how to resolve it
      }

      return null // otherwise, return null to let Vite handle the import as usual
    },
    async load(id) {
      if (id === moduleNames.userStories) {
        // the returned code can only be JS
        return `
          
          import { createStoryMap } from '@/lib/createStoryMap';
          
          console.log('import.meta.glob', '/${pattern}');
          
          const storyMap = createStoryMap(import.meta.glob('/${pattern}', {eager: true}));
          
          console.dir(Array.from(storyMap.entries()));
          
          export default storyMap
        `
      }

      if (id === moduleNames.userConfig) {
        return storyliteConfigImportCode
      }

      if (id === moduleNames.userUiStyles) {
        const cssFiles = storyliteConfig.styles?.ui || []

        return createCssBundleCode(cssFiles)
      }

      if (id === moduleNames.userSandboxStyles) {
        const cssFiles = storyliteConfig.styles?.sandbox || []

        return createCssBundleCode(cssFiles)
      }

      return null // otherwise, return null to let Vite handle the import as usual
    },
  }
}

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [storylitePlugin(), react()],
//   server: {
//     port: 7707,
//     host: '0.0.0.0',
//   },
//   resolve: {
//     alias: {
//       '@/': './src/',
//       '@/*': './src/*',
//     },
//   },
// })

export default storylitePlugin
