# StoryLite Contributing Guide

Thanks for your interest to contribute to StoryLite. Please take a moment and read through this guide:

## Repository

StoryLite is a monorepo using turbo and pnpm workspaces. We use Node v18. The package manager used to install and link
dependencies must be [pnpm v7](https://pnpm.io/). It can be installed as:

```sh
npm install -g pnpm@7
```

Install the dependencies after forking and cloning the repository

```sh
pnpm install
```

## Developing

The main `@storylite/storylite` package can be found in `packages/storylite`. You can quickly test and debug your
changes in `@storylite/storylite` by running `packages/example` (it's a playground project so feel free to add more
stories using other frontend frameworks there):

```sh
cd packages/example
pnpm storylite serve
pnpm storylite build
```

## Tests

Please, cover all your changes with tests.

Before creating a PR you should make sure all tests are still passing:

```sh
# On the root project dir
pnpm typecheck
pnpm lint

# On the directory of individual packages
pnpm build
pnpm test
```

<!--
There are unit tests and end-to-end tests powered by Playwright in `e2e/` folder. If you are adding a new feature, you
will be almost always asked to add a new e2e test. You can add it to one of the existing suites / test applications or
create new one.
-->

## Documentation

If applicable, your changes should be also documented on `packages/docs`.
The doc site can be started as:

```sh
cd packages/docs
pnpm start
```

## Changesets

StoryLite uses [changesets](https://github.com/changesets/changesets) to manage the changelog and releases.

If you are changing `@storylite/storylite` you need to
[add a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)
(or you will be asked to do so in your PR):

```sh
pnpm changeset
```

You will be asked to select the scope (pick `@storylite/storylite`) and version (patch, minor, major).
Then you should add a summary of the changes in the following format:

- WHAT the change is
- WHY the change was made
- HOW a consumer should update their code to use the new changes (if applicable)

This will create an `.changeset/*.md` file that gets merged with your PR and attached to the release by admins later.

The `*.md` file will have a random name. Don't worry about it, the file name is not important, and it's not used to
generate the changelog. Commit the file in your PR.

## Creating a new package

If you need to create a new package under `packages`, it also needs to be added to:

- `pnpm-workspace.yaml#packages`

The package should have a `package.json` file with at least the following fields:

- `name` (e.g. `@storylite/my-package`)
- `version` (e.g. `0.0.0`)
- `"private": true` if it's not meant to be published to npm

Then run `pnpm install` to install the dependencies and update the lockfile.
