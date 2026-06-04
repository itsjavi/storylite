#!/usr/bin/env node
import { spawn } from 'node:child_process'
import process from 'node:process'

const args = process.argv.slice(2)
const versionRE = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/

if (
  args.length !== 1 ||
  (!['major', 'minor', 'patch'].includes(args[0]) && !versionRE.test(args[0]))
) {
  console.error('Usage: pnpm pkg:release <major|minor|patch|X.X.X>')
  process.exit(1)
}

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const child = spawn(
  pnpm,
  ['--filter', '@storylite/storylite', 'version', args[0], '--no-git-tag-version'],
  {
    stdio: 'inherit',
  },
)

child.on('error', (error) => {
  console.error(error.message)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`pnpm version exited with signal ${signal}`)
    process.exit(1)
  }

  process.exit(code ?? 1)
})
