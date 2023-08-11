# @storylite/storylite

## 0.2.2

### Patch Changes

- [`bb3d34a`](https://github.com/itsjavi/storylite/commit/bb3d34a17d59af3890f785a4471202664bb85be2) Thanks [@itsjavi](https://github.com/itsjavi)! - minor changes

## 0.2.1

### Patch Changes

- [`a8501c9`](https://github.com/itsjavi/storylite/commit/a8501c9da45f5456398f3a0bf407d4e16c76240b) Thanks [@itsjavi](https://github.com/itsjavi)! - chore: better dependencies definition

- [`9279eb4`](https://github.com/itsjavi/storylite/commit/9279eb4a0659cd390b3d99aa923ec2750f1d374c) Thanks [@itsjavi](https://github.com/itsjavi)! - chore: better dependencies definition

## 0.2.0

### Breaking Changes

- big refactoring to use context instead of virtual modules.
- fixes stories resolution and the issues with the virtual modules being bundled.
- changed: renamed `StoryLiteRouter` -> `StoryLiteApp`
- changed: plugin config now only accepts the `stories` option, which is the relative glob path to the stories.
- changed: `StoryLiteApp` now requires a `stories` prop, which the modules map of the stories, you can load them
  dynamically with `import stories from 'virtual:storylite-stories'`
  (make sure you import it in the ts config types as `"@storylite/storylite/dist/virtual-modules.d.ts"`)
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
