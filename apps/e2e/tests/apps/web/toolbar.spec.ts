import { expect, test } from './fixtures.ts'
import { PREVIEW_IFRAME, expectStoryShell } from './test-utils.ts'

test('viewport selector resizes the canvas frame', async ({ page }) => {
  await page.goto('/#/story/basic--layout')
  await expectStoryShell(page, 'Layout')

  const canvasFrame = page.getByLabel('Isolated story preview')
  await expect(canvasFrame).toBeVisible()

  await page.getByRole('button', { name: 'Choose viewport' }).click()
  await page.getByLabel('Viewports').getByRole('button').filter({ hasText: 'Mobile' }).click()
  await expect(canvasFrame).toHaveCSS('width', '390px')

  await page.getByRole('button', { name: 'Choose viewport' }).click()
  await page.getByLabel('Viewports').getByRole('button').filter({ hasText: 'Desktop' }).click()
  await expect(canvasFrame).toHaveCSS('width', '1120px')
})

test('preview theme control updates the iframe document', async ({ page }) => {
  await page.goto('/#/story/basic--button')
  await expectStoryShell(page, 'Button')

  const frame = page.frameLocator(PREVIEW_IFRAME)

  await page.getByRole('button', { name: 'Use dark theme' }).click()
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('background selector applies the selected preview background', async ({ page }) => {
  await page.goto('/#/story/basic--card')
  await expectStoryShell(page, 'Card')

  await page.getByRole('button', { name: 'Choose canvas background' }).click()
  await page.getByLabel('Canvas backgrounds').getByRole('button', { name: 'Dark' }).click()

  await expect(page.frameLocator(PREVIEW_IFRAME).locator('body')).toHaveCSS(
    'background-color',
    'rgb(17, 17, 17)',
  )
})

test('workspace can be maximized and restored', async ({ page }) => {
  await page.goto('/#/story/basic--button')
  await expectStoryShell(page, 'Button')

  await page.getByRole('button', { name: 'Expand workspace' }).click()
  await expect(page.getByRole('complementary', { name: 'Stories' })).toHaveCount(0)
  await expect(page.getByRole('complementary', { name: 'Story controls' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Shrink workspace' }).click()
  await expectStoryShell(page, 'Button')
})
