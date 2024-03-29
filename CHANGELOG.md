# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.15.1](https://github.com/itsjavi/storylite/compare/v0.15.0...v0.15.1) (2024-03-27)


### Bug Fixes

* make base and canvas paths configurable ([9dfc797](https://github.com/itsjavi/storylite/commit/9dfc7975fb8ff4bdfc5f62c4a5f5d13b731932eb))





# [0.15.0](https://github.com/itsjavi/storylite/compare/v0.14.2...v0.15.0) (2024-03-27)


### Features

* add support for React Server Components ([410ef23](https://github.com/itsjavi/storylite/commit/410ef234adfb33f161dd35ecb0228312d3ee15f1))





## [0.14.2](https://github.com/itsjavi/storylite/compare/v0.14.1...v0.14.2) (2024-03-27)

**Note:** Version bump only for package storylite







## v0.14.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.13.0...v0.14.0)

### 🩹 Fixes

- Publish script ([ca5026a](https://github.com/itsjavi/storylite/commit/ca5026a))
- Publish script ([4efec23](https://github.com/itsjavi/storylite/commit/4efec23))
- Props component props could not be required in stories. closes #72 ([#72](https://github.com/itsjavi/storylite/issues/72))
- Empty decorator array not rendering component properly. fix args inheritance. closes #76 ([#76](https://github.com/itsjavi/storylite/issues/76))

### 💅 Refactors

- Use clsx instead of r1stack/cn ([08842da](https://github.com/itsjavi/storylite/commit/08842da))

### 🏡 Chore

- Replace eslint & prettier with biome ([#78](https://github.com/itsjavi/storylite/pull/78))
- Upgrade dependencies and fix linter issues ([7794c4a](https://github.com/itsjavi/storylite/commit/7794c4a))

### ❤️ Contributors

- Javi Aguilar 
- Jrson



## v0.13.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.12.1...v0.13.0)

### 🩹 Fixes

- Add forwardref support ([#74](https://github.com/itsjavi/storylite/pull/74))
- **ui:** Fix sidebar menu items too small ([#69](https://github.com/itsjavi/storylite/pull/69))
- **types:** Typing issues on DTS generation
  ([f3865c9](https://github.com/itsjavi/storylite/commit/f3865c9))

### 💅 Refactors

- Replace coding-style package and versioning scripts
  ([57edd7e](https://github.com/itsjavi/storylite/commit/57edd7e))

### 🏡 Chore

- Fix jest path to use pnpx command ([#71](https://github.com/itsjavi/storylite/pull/71))

### 🎨 Styles

- Enforce the use of top-level import type qualifier
  ([7f4340a](https://github.com/itsjavi/storylite/commit/7f4340a))

### 🤖 CI

- Fix setup project ([f923ecf](https://github.com/itsjavi/storylite/commit/f923ecf))

### ❤️ Contributors

- Javi Aguilar
- Jrson

## v0.12.1

[compare changes](https://github.com/itsjavi/storylite/compare/v0.12.0...v0.12.1)

### 🩹 Fixes

- Rename and optimize versioning scripts
  ([a912d73](https://github.com/itsjavi/storylite/commit/a912d73))
- **ui:** Fix sidebar not visible ([#63](https://github.com/itsjavi/storylite/pull/63))

### 🤖 CI

- Fix release script ([d7205e7](https://github.com/itsjavi/storylite/commit/d7205e7))

### ❤️ Contributors

- Jrson
- Javi Aguilar

## v0.12.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.11.1...v0.12.0)

### 🚀 Enhancements

- **vite-plugin:** Add initial MDX and frontmatter support
  ([ca0c54b](https://github.com/itsjavi/storylite/commit/ca0c54b))

### ❤️ Contributors

- Javi Aguilar

## v0.11.1

[compare changes](https://github.com/itsjavi/storylite/compare/v0.11.0...v0.11.1)

### 🩹 Fixes

- **ui:** Fix and improve svg styles ([#53](https://github.com/itsjavi/storylite/pull/53))
- **ui:** Fix iframe height styles ([#56](https://github.com/itsjavi/storylite/pull/56))

### ❤️ Contributors

- Jrson

## v0.11.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.10.2...v0.11.0)

### 💅 Refactors

- Use individial lucide icons ([#44](https://github.com/itsjavi/storylite/pull/44))
- **ui:** Simplify router parser with fixes and more tests
  ([b45ea8c](https://github.com/itsjavi/storylite/commit/b45ea8c))
- **ui:** Remove vite as dev dependency of the ui
  ([4f3c187](https://github.com/itsjavi/storylite/commit/4f3c187))
- Add more lucide icons, remove lucide-react ([#46](https://github.com/itsjavi/storylite/pull/46))

### ❤️ Contributors

- Jrson
- Javi Aguilar

## v0.10.2

[compare changes](https://github.com/itsjavi/storylite/compare/v0.10.1...v0.10.2)

### 🩹 Fixes

- **ui:** Logo link and dark theme flikering
  ([3d40a7c](https://github.com/itsjavi/storylite/commit/3d40a7c))

### 💅 Refactors

- Replace r1stack/core with r1stack/cn
  ([cf6ecb8](https://github.com/itsjavi/storylite/commit/cf6ecb8))
- Add simple SVG file loader ([cff5373](https://github.com/itsjavi/storylite/commit/cff5373))

### ❤️ Contributors

- Javi Aguilar

## v0.10.1

[compare changes](https://github.com/itsjavi/storylite/compare/v0.10.0...v0.10.1)

### 🚀 Enhancements

- **ui:** Allow stories to be rendered in the main frame with the story option
  ([d1baef9](https://github.com/itsjavi/storylite/commit/d1baef9))

### 🩹 Fixes

- **ui:** Allow router to work on subdirs
  ([c0206d1](https://github.com/itsjavi/storylite/commit/c0206d1))
- **ui:** Reset params set by de story after switching to another one
  ([78bc46e](https://github.com/itsjavi/storylite/commit/78bc46e))

### 📖 Documentation

- Add separate package to host the website and docs
  ([5efb039](https://github.com/itsjavi/storylite/commit/5efb039))

### 🤖 CI

- **setup:** Add workflow to deploy to GH pages
  ([6d75ee4](https://github.com/itsjavi/storylite/commit/6d75ee4))
- **setup:** Add workflow to deploy to GH pages
  ([3c0e7b8](https://github.com/itsjavi/storylite/commit/3c0e7b8))
- **setup:** Add workflow to deploy to GH pages
  ([744127d](https://github.com/itsjavi/storylite/commit/744127d))

### ❤️ Contributors

- Javi Aguilar

## v0.10.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.9.0...v0.10.0)

### 💅 Refactors

- **ui:** Better iframe isolation support. now with separate entry point
  ([c8256ca](https://github.com/itsjavi/storylite/commit/c8256ca))

### ❤️ Contributors

- Javi Aguilar

## v0.9.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.8.0...v0.9.0)

### 💅 Refactors

- Add initial support for Component Story Format (CSF)
  ([#39](https://github.com/itsjavi/storylite/pull/39))

### 🏡 Chore

- Update badges to include pkg size ([034b01e](https://github.com/itsjavi/storylite/commit/034b01e))

### ❤️ Contributors

- Javi Aguilar

## v0.8.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.7.1...v0.8.0)

### 💅 Refactors

- Reorganize code files structure ([dd6c055](https://github.com/itsjavi/storylite/commit/dd6c055))
- Replace global state manager with Zustand
  ([a70f0a1](https://github.com/itsjavi/storylite/commit/a70f0a1))
- Replace router context with Zustand, fixing rerenders on global state change
  ([b9e4f4f](https://github.com/itsjavi/storylite/commit/b9e4f4f))

### ❤️ Contributors

- Javi Aguilar

## v0.7.1

[compare changes](https://github.com/itsjavi/storylite/compare/v0.7.0...v0.7.1)

### 🚀 Enhancements

- **ui:** Add support for auto theme mode (system preference)
  ([7bc1833](https://github.com/itsjavi/storylite/commit/7bc1833))

### 🩹 Fixes

- **ui:** Some hash resolving was not working as expected
  ([247c2b5](https://github.com/itsjavi/storylite/commit/247c2b5))
- **ui:** UseDetectTheme not updating if it was not auto
  ([a2c38c5](https://github.com/itsjavi/storylite/commit/a2c38c5))

### ❤️ Contributors

- Javi Aguilar

## v0.7.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.6.1...v0.7.0)

### 🎨 Styles

- **config:** Reformat markdown files
  ([09ed5f0](https://github.com/itsjavi/storylite/commit/09ed5f0))

### ❤️ Contributors

- Javi Aguilar

## v0.6.1

[compare changes](https://github.com/itsjavi/storylite/compare/v0.6.0...v0.6.1)

### 🚀 Enhancements

- **ui:** Configure dark theme using data-theme attributes (or custom name). add useDetectTheme hook
  ([c8327b2](https://github.com/itsjavi/storylite/commit/c8327b2))

### 💅 Refactors

- **ui:** Replace react-router-dom with a small custom Router implementation
  ([2103223](https://github.com/itsjavi/storylite/commit/2103223))

### 🏡 Chore

- Update dependencies ([c008b4d](https://github.com/itsjavi/storylite/commit/c008b4d))

### ❤️ Contributors

- Javi Aguilar

## v0.6.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.5.1...v0.6.0)

### 💅 Refactors

- **ui:** Complete rewrite of the addon API, with extensibility support, better mobile UI
  ([da4a900](https://github.com/itsjavi/storylite/commit/da4a900))

### ❤️ Contributors

- Javi Aguilar

## v0.5.1

[compare changes](https://github.com/itsjavi/storylite/compare/v0.5.0...v0.5.1)

### 🩹 Fixes

- **ui:** Adjust some wrong styles ([b09c0ac](https://github.com/itsjavi/storylite/commit/b09c0ac))

### 🏡 Chore

- **tools:** Fix publish script ([bf2911e](https://github.com/itsjavi/storylite/commit/bf2911e))

### ❤️ Contributors

- Javi Aguilar

## v0.5.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.4.0...v0.5.0)

### 💅 Refactors

- **storylite:** Define a new api almost compatible with SB CSF3
  ([ee68a5f](https://github.com/itsjavi/storylite/commit/ee68a5f))
- **ui:** Allow replacing the title entirely with the icon + other optimizations
  ([32632fa](https://github.com/itsjavi/storylite/commit/32632fa))
- **ui:** Implement an event-driven bidirectional communication system between for the iframe
  ([afaec92](https://github.com/itsjavi/storylite/commit/afaec92))
- **ui:** Stop using useBrowserStorage hook and use a simpler api usable with postMessage
  ([9867907](https://github.com/itsjavi/storylite/commit/9867907))
- **ui:** Improve UX and redefine all classes and styles to make the iframe more isolated
  ([3b6303d](https://github.com/itsjavi/storylite/commit/3b6303d))

### 🏡 Chore

- **releases:** Scope npm publish to public packages
  ([504d449](https://github.com/itsjavi/storylite/commit/504d449))

### ❤️ Contributors

- Javi Aguilar

## v0.4.0

[compare changes](https://github.com/itsjavi/storylite/compare/v0.3.1...v0.4.0)

### 🩹 Fixes

- **workflow:** Quality checks fail after updated script
  ([d41690d](https://github.com/itsjavi/storylite/commit/d41690d))
- **tools:** Publint broken on CI ([f0e64a2](https://github.com/itsjavi/storylite/commit/f0e64a2))

### 💅 Refactors

- **vite-plugin:** Rework build process and rename virtual imports
  ([0d77a69](https://github.com/itsjavi/storylite/commit/0d77a69))

### 📖 Documentation

- **readme:** Simplify contents ([74c8487](https://github.com/itsjavi/storylite/commit/74c8487))

### 🏡 Chore

- **tools:** Avoid to release examples as npm pkgs
  ([41922a8](https://github.com/itsjavi/storylite/commit/41922a8))
- **tools:** Avoid to release examples as npm pkgs
  ([4f59718](https://github.com/itsjavi/storylite/commit/4f59718))
- **tools:** Standarize scripts between @itsjavi repos
  ([a23a760](https://github.com/itsjavi/storylite/commit/a23a760))
- **examples:** Open on vite dev, change port to 7007 to follow SB port pattern
  ([4f9e8cb](https://github.com/itsjavi/storylite/commit/4f9e8cb))
- **tools:** Better webcontainers compatibility
  ([4a3fb5b](https://github.com/itsjavi/storylite/commit/4a3fb5b))
- **vite-plugin:** Bundle the additional dts in the main index.d.ts file
  ([7d7c5d7](https://github.com/itsjavi/storylite/commit/7d7c5d7))

### ❤️ Contributors

- Javi Aguilar

## v0.3.1

### 🚀 Enhancements

- Add first version of the app ([7a63bf1](https://github.com/itsjavi/storylite/commit/7a63bf1))

### 🩹 Fixes

- **deps:** Update dependency lucide-react to ^0.263.0
  ([#6](https://github.com/itsjavi/storylite/pull/6))
- Linting issues ([d4abcbf](https://github.com/itsjavi/storylite/commit/d4abcbf))
- Pnpm dev ([b9274f3](https://github.com/itsjavi/storylite/commit/b9274f3))
- **deps:** Update dependency lucide-react to ^0.264.0
  ([#18](https://github.com/itsjavi/storylite/pull/18))
- **deps:** Update dependency lucide-react to ^0.265.0
  ([#20](https://github.com/itsjavi/storylite/pull/20))
- Router has now fully static site support, fix navigation
  ([2893e37](https://github.com/itsjavi/storylite/commit/2893e37))
- **vite-plugin:** Add missing virtual type exports
  ([#28](https://github.com/itsjavi/storylite/pull/28))

### 💅 Refactors

- Cleanup project and fix linting issues
  ([af851c9](https://github.com/itsjavi/storylite/commit/af851c9))
- Bundle with tsup and improve overall support
  ([1bb4804](https://github.com/itsjavi/storylite/commit/1bb4804))
- Ditch separate config file, improve examples
  ([7d05ce9](https://github.com/itsjavi/storylite/commit/7d05ce9))
- **storylite:** Use context instead of virtual modules
  ([93ec0dc](https://github.com/itsjavi/storylite/commit/93ec0dc))
- Split ui from vite plugin ([6ae02ef](https://github.com/itsjavi/storylite/commit/6ae02ef))

### 📖 Documentation

- Improve readmes ([ec4e077](https://github.com/itsjavi/storylite/commit/ec4e077))
- **changeset:** Chore: better dependencies definition
  ([9279eb4](https://github.com/itsjavi/storylite/commit/9279eb4))
- **changeset:** Chore: better dependencies definition
  ([a8501c9](https://github.com/itsjavi/storylite/commit/a8501c9))
- **changeset:** Minor changes ([bb3d34a](https://github.com/itsjavi/storylite/commit/bb3d34a))
- **changeset:** Add new entries ([4c51edb](https://github.com/itsjavi/storylite/commit/4c51edb))
- **changeset:** Add new entries ([6c34e8e](https://github.com/itsjavi/storylite/commit/6c34e8e))
- **changeset:** Add new entries ([ad8aa95](https://github.com/itsjavi/storylite/commit/ad8aa95))
- **changeset:** Add new entries ([bf9ce99](https://github.com/itsjavi/storylite/commit/bf9ce99))
- Update readme ([4793bab](https://github.com/itsjavi/storylite/commit/4793bab))
- Update guidelines ([656997f](https://github.com/itsjavi/storylite/commit/656997f))

### 🏡 Chore

- **testing:** Integrate playwright ([8398deb](https://github.com/itsjavi/storylite/commit/8398deb))
- Upgrade deps ([e66b73b](https://github.com/itsjavi/storylite/commit/e66b73b))
- Remove docker files ([8bdfe87](https://github.com/itsjavi/storylite/commit/8bdfe87))
- Use lint-staged ([fff2096](https://github.com/itsjavi/storylite/commit/fff2096))
- Upgrade deps ([6d3bef4](https://github.com/itsjavi/storylite/commit/6d3bef4))
- Reconfigure project ([7d86078](https://github.com/itsjavi/storylite/commit/7d86078))
- Upgrade deps ([59762a8](https://github.com/itsjavi/storylite/commit/59762a8))
- Add changeset ([134cf89](https://github.com/itsjavi/storylite/commit/134cf89))
- V0.1.0 ([6ea6af2](https://github.com/itsjavi/storylite/commit/6ea6af2))
- Fix license ([618a8c7](https://github.com/itsjavi/storylite/commit/618a8c7))
- V0.1.1 ([bd5397c](https://github.com/itsjavi/storylite/commit/bd5397c))
- Add root preview script ([26837cf](https://github.com/itsjavi/storylite/commit/26837cf))
- Use jest preset from r1stack ([639e8c1](https://github.com/itsjavi/storylite/commit/639e8c1))
- Reorganize storylite deps ([5583b95](https://github.com/itsjavi/storylite/commit/5583b95))
- V0.1.3 ([bf76572](https://github.com/itsjavi/storylite/commit/bf76572))
- Update dependencies ([#22](https://github.com/itsjavi/storylite/pull/22))
- Update dependencies ([#23](https://github.com/itsjavi/storylite/pull/23))
- Fix build md paths ([e690ebf](https://github.com/itsjavi/storylite/commit/e690ebf))
- V0.1.4 ([71ac657](https://github.com/itsjavi/storylite/commit/71ac657))
- Update deps ([3c002e6](https://github.com/itsjavi/storylite/commit/3c002e6))
- V0.2.0 ([bd35a8f](https://github.com/itsjavi/storylite/commit/bd35a8f))
- Better dependency definition ([ef9f19a](https://github.com/itsjavi/storylite/commit/ef9f19a))
- Test ([e3db970](https://github.com/itsjavi/storylite/commit/e3db970))
- **changeset:** Add custom commit script
  ([2d993a8](https://github.com/itsjavi/storylite/commit/2d993a8))
- Release @storylite/storylite@0.2.3
  ([1885c64](https://github.com/itsjavi/storylite/commit/1885c64))
- Revert test changelogs ([83f66ea](https://github.com/itsjavi/storylite/commit/83f66ea))
- Update dependencies ([#24](https://github.com/itsjavi/storylite/pull/24))
- Update dependencies ([13b96f6](https://github.com/itsjavi/storylite/commit/13b96f6))
- Update dependencies ([7c9c205](https://github.com/itsjavi/storylite/commit/7c9c205))
- Fix changeset setup ([e3d460e](https://github.com/itsjavi/storylite/commit/e3d460e))
- Fix changeset setup ([71041c3](https://github.com/itsjavi/storylite/commit/71041c3))
- Update dependencies ([#26](https://github.com/itsjavi/storylite/pull/26))
- **tools:** Setup custom versioning and changelog scripts
  ([1d34b77](https://github.com/itsjavi/storylite/commit/1d34b77))

### ✅ Tests

- Configure jest ([23134b3](https://github.com/itsjavi/storylite/commit/23134b3))

### 🤖 CI

- Disable e2e for now ([ae451ce](https://github.com/itsjavi/storylite/commit/ae451ce))
- Refactor workflows and add a new one to update deps
  ([25661c9](https://github.com/itsjavi/storylite/commit/25661c9))
- Fix workflows ([a1ccefe](https://github.com/itsjavi/storylite/commit/a1ccefe))
- Fix workflows ([8a9cef8](https://github.com/itsjavi/storylite/commit/8a9cef8))
- **update-deps:** Create PR only if there are pending changes
  ([49af2ea](https://github.com/itsjavi/storylite/commit/49af2ea))
- **update-deps:** Fix diff ([d890136](https://github.com/itsjavi/storylite/commit/d890136))
- **update-deps:** Fixes ([69cd4b8](https://github.com/itsjavi/storylite/commit/69cd4b8))
- **update-deps:** Fixes ([0f0c9e8](https://github.com/itsjavi/storylite/commit/0f0c9e8))
- **update-deps:** Fixes ([fc0e0a2](https://github.com/itsjavi/storylite/commit/fc0e0a2))
- **update-deps:** Fixes ([78a5dc7](https://github.com/itsjavi/storylite/commit/78a5dc7))
- **update-deps:** Fixes ([9641fba](https://github.com/itsjavi/storylite/commit/9641fba))
- **update-deps:** Fixes ([4fbb376](https://github.com/itsjavi/storylite/commit/4fbb376))
- **update-deps:** Fixes ([71beccd](https://github.com/itsjavi/storylite/commit/71beccd))
- **update-deps:** Fixes ([7b1cf32](https://github.com/itsjavi/storylite/commit/7b1cf32))
- **update-deps:** Fixes ([530c2f8](https://github.com/itsjavi/storylite/commit/530c2f8))
- Use turbo cache ([e0b185e](https://github.com/itsjavi/storylite/commit/e0b185e))
- **workflow:** Run build before publint
  ([ca50adf](https://github.com/itsjavi/storylite/commit/ca50adf))

### ❤️ Contributors

- Javi Aguilar
- Jrson
