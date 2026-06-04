import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { expectHash, expectRouteDocumentReady } from '../../shared/test-utils.ts'

export const PREVIEW_IFRAME = 'iframe[title="StoryLite isolated preview"]'

export async function expectHomeReady(page: Page): Promise<void> {
  await expectRouteDocumentReady(page)
  const home = page.locator('.home-page')
  await expect(home.getByRole('heading', { name: 'StoryLite', exact: true })).toBeVisible()
  await expect(home.getByText('lightweight, Vite-powered alternative')).toBeVisible()
}

export async function openStory(
  page: Page,
  storyButtonName: string,
  storyId: string,
): Promise<void> {
  await expandPureCssStories(page)
  await page.getByRole('link', { name: storyButtonName, exact: true }).click()
  await expectHash(page).toBe(`#/story/${storyId}`)
  await expect(page.locator(PREVIEW_IFRAME)).toBeVisible()
}

export async function expectStoryShell(page: Page, storyName: string): Promise<void> {
  await expect(page.getByRole('complementary', { name: 'Stories' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Preview workspace' })).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'Story controls' })).toBeVisible()
  await expect(page.locator('.inspector__header strong')).toHaveText(storyName)
}

export async function expandPureCssStories(page: Page): Promise<void> {
  const sidebar = page.getByRole('complementary', { name: 'Stories' })

  await expandSection(sidebar.getByRole('button', { name: /^Examples\b/ }))
  await expandSection(sidebar.getByRole('button', { name: /^Pure CSS\b/ }))
}

async function expandSection(button: Locator): Promise<void> {
  await expect(button).toBeVisible()

  if ((await button.getAttribute('aria-expanded')) !== 'true') {
    await button.click()
  }
}
