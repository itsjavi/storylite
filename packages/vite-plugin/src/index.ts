import storylitePlugin from './plugin'

export default storylitePlugin

//
// Tell the bundler to also include the following code in the final bundle,
// so we can use it in the storylite plugin for module resolution.
//
export * from './story-collector'
