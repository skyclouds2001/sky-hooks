import { test, expect } from '@playwright/test'

test('basic', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('sky-hooks')

  await expect(page.getByText('sky-hooks')).toBeVisible()
})
