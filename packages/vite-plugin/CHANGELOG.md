# @storylite/vite-plugin

## 0.2.0

### Breaking Changes

- big refactoring to use context instead of virtual modules.
- fixes stories resolution and the issues with the virtual modules being bundled.
- changed: renamed `StoryLiteRouter` -> `StoryLiteApp`
- changed: plugin config now only accepts the `stories` option, which is the relative glob path to the stories.
- changed: `StoryLiteApp` now requires a `stories` prop, which the modules map of the stories, you can load them
  dynamically with `import stories from 'virtual:storylite-stories'`
  (make sure you import it in the ts config types as `"@storylite/vite-plugin/dist/virtual-modules.d.ts"`)
  and Vite with the StoryLite plugin will take care of the rest. Check the react examples for more info.

### Patch Changes

- update react-router-dom to 6.15.0

## 0.1.3

### Patch Changes

- better dependency definitions

## 0.1.2

### Patch Changes

- fix: router has now fully static site support. fix navigation.

## 0.1.1

### Patch Changes

- fix: license

## 0.1.0

### Minor Changes

- 134cf89: refactor: The project is now basically a plugin to integrate with Vite, with a React app.

### Patch Changes

- d4e07ac: initial Vite project setup
