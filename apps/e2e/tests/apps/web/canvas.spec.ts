import { expect, test } from './fixtures.ts'
import { expectHash } from '../../shared/test-utils.ts'

test('standalone canvas route renders only the selected story preview', async ({ page }) => {
  await page.goto('/#/canvas/basic--button')

  await expectHash(page).toBe('#/canvas/basic--button')
  await expect(page.getByLabel('Standalone story preview')).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'Stories' })).toHaveCount(0)
  await expect(page.getByRole('complementary', { name: 'Story controls' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Run storylite build' })).toBeVisible()
})
