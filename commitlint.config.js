const fs = require('fs')

const folderNamesUnderPackages = fs
  .readdirSync('./packages')
  .filter(file => fs.statSync(`./packages/${file}`).isDirectory())

/**
 * @type {import('@commitlint/types').UserConfig}
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 100],
    'type-empty': [1, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    // 'scope-empty': [2, 'never'],
    'scope-enum': [
      1,
      'always',
      [
        'general',
        'releases',
        'deps',
        'ui',
        'plugin',
        'framework',
        'config',
        'setup',
        'readme',
        'tools',
        'workflow',
        // packages:
        ...folderNamesUnderPackages,
      ],
    ],
  },
  ignores: [commit => commit.includes('update deps')],
}
