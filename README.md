# storylite

<p>
  <a href="https://npmjs.com/package/@storylite/storylite"><img src="https://img.shields.io/npm/v/@storylite/storylite.svg" alt="npm package"></a>
  <a href="https://github.com/itsjavi/storylite/actions/workflows/quality.yml"><img src="https://github.com/itsjavi/storylite/actions/workflows/quality.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://app.codecov.io/gh/itsjavi/storylite"><img src="https://img.shields.io/codecov/c/github/itsjavi/storylite" alt="code coverage"></a>
  <!--<a href="https://itsjavi.com/storylite?sandbox"><img src="https://img.shields.io/badge/Stackblitz-sandbox-orange" alt="stackblitz"></a>-->
  <a href="https://www.jsdocs.io/package/@storylite/storylite"><img src="https://img.shields.io/badge/API%20Reference-📖-blue" alt="homepage"></a>
</p>

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/itsjavi/storylite?startScript=dev&installDependencies=true&title=StoryLite%20Example&file=packages/examples/react/stories/index.stories.tsx)

StoryLite is a modern and lightweight tool for developing and managing design systems and components. It is inspired by
the popular StoryBook UI and built on top of Vite⚡️, offering a streamlined and user-friendly experience.

With StoryLite, individuals and teams can quickly create, test, and iterate on their UI components in isolation to
ensure consistency across the application.

Designed for small projects that don't require all the features and complexity of a full-blown StoryBook setup,
StoryLite provides a familiar UI that is easy to use and customize to each team's unique needs.

![StoryLite](https://raw.githubusercontent.com/itsjavi/storylite/main/packages/storylite/screenshot.png)

## Features

- Lightweight and customizable, with a minimal set of dependencies.
- Addons system with the basics (dark mode, viewport size, grid, outline, fullscreen, etc.).
- HMR (Hot Module Reload) support when story files change.
- SSG (Static Site Generation) support.
- Supports `.stories.jsx` and `.stories.tsx` stories.

## Installation

To install StoryLite, simply run one of the following commands in the project where you want
to define the stories:

```bash
# Using npm
npm install -D @storylite/storylite vite @storylite/vite-plugin

# Using yarn
yarn add -D @storylite/storylite vite @storylite/vite-plugin

# Using pnpm
pnpm add -D @storylite/storylite vite @storylite/vite-plugin
```

> You also need `vite` as a devDependency.

For the next steps, please check the [example React](https://github.com/itsjavi/storylite/tree/main/packages/examples/react) directory
to learn how to integrate it in your project.

## Roadmap

### Features

- [ ] Addons:
  - [ ] Different responsive sizes + custom size
  - [ ] Zoom in/out
  - [ ] Accessibility
- [ ] Multiple resizable viewports (side by side)
- [ ] Create `packages/examples` packages
  - [x] Support React
  - [ ] Support other frameworks like Vue, Svelte, Solid, and Qwik.
- Customizable components (props, styles, etc.)

### Technical

- [ ] Provide documentation (`packages/docs`)
  - [ ] Use Nextra https://nextra.site/
  - [ ] Host in GitHub Pages (build and deploy via GitHub Actions)
- [ ] Better handling of the iframes
- [ ] Better addons API
- [ ] Use redux-toolkit or similar (Zustand?)
- [ ] SSR/SSG frameworks support (Next, Astro, etc)
- [ ] Stories format compatible with Storybook (backwards compatible with SB v6 and v7)
- [ ] Better mobile experience (specially for sidebars and toolbars)
- [ ] Use Panda CSS
- [ ] Bundle entirely with `tsup`

## Current Limitations

- Currently, there is no support for things such as "auto docs", "code snippets", "knobs", "controls", "actions"
  or "events".
- It has only been tested with React components, but it could potentially work with any framework that Vite supports. Support
  and/or fixes for Vue, Svelte, Solid, and others is welcome via PRs.
- No support for MDX files, to keep the project simple, but adding support via PRs is welcome as long as it doesn't
  add too much complexity.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](https://github.com/itsjavi/storylite/tree/main/CONTRIBUTING.md) before submitting a PR.

## License

[MIT License](https://github.com/itsjavi/storylite/tree/main/LICENSE)

## Acknowledgements

Inspired by:

- [StoryBook](https://storybook.js.org/)
- [Ladle](https://ladle.dev/)

Built with:

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
