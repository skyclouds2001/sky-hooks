import { test, expect } from '@playwright/test'

test.describe('useDocumentPictureInPicture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    test.skip((await page.locator('#document-picture-in-picture .support').textContent()) === 'false')
  })

  test('should render document-picture-in-picture dom', async ({ page }) => {
    await expect(page.getByText('document-picture-in-picture')).toBeVisible()
    await expect(page.locator('#document-picture-in-picture .status')).toHaveText('false')
  })

  test('should support enter or exit picture-in-picture', async ({ page }) => {
    const status = page.locator('#document-picture-in-picture .status')
    const enter = page.locator('#document-picture-in-picture .enter')
    const exit = page.locator('#document-picture-in-picture .exit')

    await enter.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window != null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeHidden()
    await expect(status).toHaveText('true')

    await enter.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window != null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeHidden()
    await expect(status).toHaveText('true')

    await exit.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window == null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeVisible()
    await expect(status).toHaveText('false')

    await exit.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window == null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeVisible()
    await expect(status).toHaveText('false')
  })

  test('should support toggle picture-in-picture', async ({ page }) => {
    const status = page.locator('#document-picture-in-picture .status')
    const toggle = page.locator('#document-picture-in-picture .toggle')

    await toggle.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window != null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeHidden()
    await expect(status).toHaveText('true')

    await toggle.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window == null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeVisible()
    await expect(status).toHaveText('false')

    await toggle.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window != null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeHidden()
    await expect(status).toHaveText('true')

    await toggle.click()

    expect(page.evaluate(() => window.documentPictureInPicture.window == null)).toBeTruthy()
    await expect(page.getByText('document-picture-in-picture')).toBeVisible()
    await expect(status).toHaveText('false')
  })
})
