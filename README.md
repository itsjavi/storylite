# storylite

<p>
  <a href="https://npmjs.com/package/@storylite/storylite"><img src="https://img.shields.io/npm/v/@storylite/storylite.svg" alt="npm package"></a>
  <a href="https://github.com/itsjavi/storylite/actions/workflows/quality.yml"><img src="https://github.com/itsjavi/storylite/actions/workflows/quality.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://app.codecov.io/gh/itsjavi/storylite"><img src="https://img.shields.io/codecov/c/github/itsjavi/storylite" alt="code coverage"></a>
  <!--<a href="https://itsjavi.com/storylite?sandbox"><img src="https://img.shields.io/badge/Stackblitz-sandbox-orange" alt="stackblitz"></a>-->
  <a href="https://www.jsdocs.io/package/@storylite/storylite"><img src="https://img.shields.io/badge/API%20Reference-📖-blue" alt="homepage"></a>
</p>

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/itsjavi/storylite?startScript=dev&installDependencies=true&title=StoryLite%20Example&file=packages/examples/react/stories/index.stories.tsx)

StoryLite is a modern and lightweight toolkit for crafting and managing design systems and
components with ease. Inspired by the popular StoryBook UI and powered by Vite⚡️, StoryLite offers
a streamlined and familiar developer experience.

With StoryLite, you can swiftly create, test, and refine UI components in isolation, ensuring that
your application maintains a consistent look and feel.

Tailored for smaller projects that crave simplicity without the overhead of a full StoryBook setup,
StoryLite provides an intuitive UI that's customizable to your unique needs.

![StoryLite](https://raw.githubusercontent.com/itsjavi/storylite/main/packages/storylite/screenshot.png)

## Features

- Lightweight and customizable, with a minimal set of dependencies.
- Addons system with the basics (dark mode, viewport size, grid, outline, fullscreen, etc.).
- HMR (Hot Module Reload) support when story files change.
- SSG (Static Site Generation) support.
- Supports `.stories.jsx` and `.stories.tsx` stories.

## Installation

To install StoryLite, simply run one of the following commands in the project where you want to
define the stories:

```bash
# Using npm
npm install -D @storylite/storylite vite @storylite/vite-plugin

# Using yarn
yarn add -D @storylite/storylite vite @storylite/vite-plugin

# Using pnpm
pnpm add -D @storylite/storylite vite @storylite/vite-plugin
```

> You also need `vite` as a devDependency.

For the next steps, please check the
[example React](https://github.com/itsjavi/storylite/tree/main/packages/examples/react) directory to
learn how to integrate it in your project.

## Current Focus and Future

While StoryLite is geared towards React components at the moment, the potential exists for broader
compatibility with other frameworks supported by Vite. We're continuously enhancing the tool and
looking to:

- Better story interoperability with StoryBook and Ladle.
- Better extensibility and configuration options.
- Expand addons to support multiple resizable viewports, and tools for zoom, accessibility, etc.
- Extend examples to frameworks like Vue, Svelte, Solid, and Qwik.
- Ability to generate code snippets for each story.
- Ability to edit component props and state in the UI.
- Improve documentation and mobile experience of the UI.
- Full test coverage.

## Contributing

Contributions are encouraged; Please check out our
[contributing guidelines](https://github.com/itsjavi/storylite/tree/main/CONTRIBUTING.md) before
submitting a PR.

## License

[MIT License](https://github.com/itsjavi/storylite/tree/main/LICENSE)

## Acknowledgements

Inspired by:

- [StoryBook](https://storybook.js.org/)
- [Ladle](https://ladle.dev/)

Built with:

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
