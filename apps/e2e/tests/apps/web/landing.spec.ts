import { expect, test } from './fixtures.ts'
import { expectHomeReady, expandPureCssStories, openStory } from './test-utils.ts'
import { expectHash, expectNoPageOverflow } from '../../shared/test-utils.ts'

test('home page renders StoryLite project information and sidebar stories', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  const response = await page.goto('/')

  expect(response?.status() ?? 200).toBeLessThan(400)
  await expectHash(page).toBe('')
  await expectHomeReady(page)
  const sidebar = page.getByRole('complementary', { name: 'Stories' })
  await expect(sidebar.getByText('Component Stories', { exact: true })).toBeVisible()
  await expect(sidebar.getByRole('button', { name: /^Examples\b/ })).toBeVisible()
  await expandPureCssStories(page)
  for (const story of ['Button', 'Card', 'Field', 'Badge', 'Layout']) {
    await expect(sidebar.getByRole('link', { name: story, exact: true })).toBeVisible()
  }
  await expectNoPageOverflow(page)
  expect(consoleErrors).toEqual([])
})

test('story search filters the sidebar without changing the current route', async ({ page }) => {
  await page.goto('/')
  await expectHomeReady(page)

  await page.getByRole('searchbox', { name: 'Search stories' }).fill('badge')

  await expect(page.getByRole('link', { name: 'Badge', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Button', exact: true })).toHaveCount(0)
  await expectHash(page).toBe('')
})

test('selecting a story opens the preview route', async ({ page }) => {
  await page.goto('/')
  await expectHomeReady(page)

  await openStory(page, 'Button', 'basic--button')
  await expect(page.locator('.inspector__header strong')).toHaveText('Button')
})
