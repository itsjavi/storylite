import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

import { defineConfig, devices } from '@playwright/test'

const here = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = resolve(here, '../..')
const envPath = resolve(repoRoot, '.env')
const webEnvPath = resolve(repoRoot, 'apps/web/.env')
const e2eEnvPath = resolve(here, '.env')
const stackEnvPath = process.env.STORYLITE_E2E_ENV_FILE

const rootEnvVars = readEnvFile(envPath)
const webEnvVars = readEnvFile(webEnvPath)
const e2eEnvVars = readEnvFile(e2eEnvPath)
const stackEnvVars = stackEnvPath === undefined ? {} : readEnvFile(stackEnvPath)
const shellEnvVars = definedEnv(process.env)
const configEnv = {
  ...rootEnvVars,
  ...webEnvVars,
  ...e2eEnvVars,
  ...stackEnvVars,
  ...shellEnvVars,
}

const configuredWebBaseUrl = configEnv.STORYLITE_E2E_WEB_BASE_URL
const webPort = parsePort(configEnv.STORYLITE_E2E_WEB_PORT, 'STORYLITE_E2E_WEB_PORT', 6340)
const webBaseURL = normalizeBaseUrl(configuredWebBaseUrl ?? `http://127.0.0.1:${webPort}`)
const webServerEnv: Record<string, string> = {
  ...rootEnvVars,
  ...webEnvVars,
  ...e2eEnvVars,
  ...stackEnvVars,
  ...shellEnvVars,
  NODE_ENV: 'production',
  PORT: String(webPort),
  TZ: configEnv.TZ ?? 'UTC',
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      slowMo: configEnv.STORYLITE_E2E_SLOW_MO ? Number(configEnv.STORYLITE_E2E_SLOW_MO) : undefined,
    },
  },
  projects: [
    {
      name: 'web-chromium',
      testMatch: /tests\/apps\/web\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: webBaseURL },
    },
  ],
  webServer:
    configuredWebBaseUrl === undefined
      ? {
          command: 'pnpm -F @storylite/web run build && pnpm -F @storylite/web run preview',
          cwd: repoRoot,
          env: webServerEnv,
          url: webBaseURL,
          reuseExistingServer: false,
          timeout: 60_000,
          stdout: 'ignore' as const,
          stderr: 'pipe' as const,
        }
      : undefined,
})

function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) {
    return {}
  }

  return definedEnv(parseEnv(readFileSync(path, 'utf8')))
}

function definedEnv(env: NodeJS.ProcessEnv): Record<string, string> {
  return Object.fromEntries(
    Object.entries(env).filter((entry): entry is [string, string] => entry[1] !== undefined),
  )
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

function parsePort(value: string | undefined, envName: string, fallback: number): number {
  if (value === undefined || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65_535) {
    throw new Error(`Invalid ${envName} value: ${value}`)
  }

  return parsed
}
