import { expect, test } from './fixtures.ts'

test.use({ javaScriptEnabled: false })

test('static build sidebar links open materialized story pages without JavaScript', async ({
  page,
}) => {
  const response = await page.goto('/')

  expect(response?.status() ?? 200).toBeLessThan(400)
  const sidebar = page.getByRole('complementary', { name: 'Stories' })
  await expect(sidebar).toBeVisible()
  await expect(sidebar.getByText('Component Stories', { exact: true })).toBeVisible()
  await expect(sidebar.getByRole('button', { name: /^Examples\b/ })).toBeVisible()
  await expect(sidebar.getByRole('button', { name: /^Pure CSS\b/ })).toBeVisible()

  const buttonStory = sidebar.getByRole('link', { name: 'Button', exact: true })
  await expect(buttonStory).toBeVisible()
  await expect(buttonStory).toHaveAttribute('href', './stories/basic--button/')

  await buttonStory.click()

  await expect(page).toHaveURL(/\/stories\/basic--button\/$/)
  await expect(page.locator('iframe[title="StoryLite isolated preview"]')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Run storylite build' })).toBeVisible()
})
