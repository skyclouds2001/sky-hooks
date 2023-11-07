import { test, expect } from '@playwright/test'

test.describe('usePictureInPicture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render document-picture-in-picture dom', async ({ page }) => {
    await expect(page.locator('#picture-in-picture .video')).toBeVisible()
    await expect(page.locator('#picture-in-picture .status')).toHaveText('false')
  })

  test('should support enter or exit picture-in-picture', async ({ page }) => {
    test.skip((await page.locator('#picture-in-picture .support').textContent()) === 'false')

    const status = page.locator('#picture-in-picture .status')
    const enter = page.locator('#picture-in-picture .enter')
    const exit = page.locator('#picture-in-picture .exit')

    await enter.click()

    expect(page.evaluate(() => document.pictureInPictureElement != null)).toBeTruthy()
    await expect(status).toHaveText('true')

    await enter.click()

    expect(page.evaluate(() => document.pictureInPictureElement != null)).toBeTruthy()
    await expect(status).toHaveText('true')

    await exit.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')

    await exit.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')
  })

  test('should support toggle picture-in-picture', async ({ page }) => {
    test.skip((await page.locator('#picture-in-picture .support').textContent()) === 'false')

    const status = page.locator('#picture-in-picture .status')
    const toggle = page.locator('#picture-in-picture .toggle')

    await toggle.click()

    expect(page.evaluate(() => document.pictureInPictureElement != null)).toBeTruthy()
    await expect(status).toHaveText('true')

    await toggle.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')

    await toggle.click()

    expect(page.evaluate(() => document.pictureInPictureElement != null)).toBeTruthy()
    await expect(status).toHaveText('true')

    await toggle.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')
  })

  test('should not switch to picture-in-picture mode if video element is disabled for picture-in-picture mode', async ({ page }) => {
    const video = page.locator('#picture-in-picture .video')
    const status = page.locator('#picture-in-picture .status')
    const enter = page.locator('#picture-in-picture .enter')
    const exit = page.locator('#picture-in-picture .exit')
    const toggle = page.locator('#picture-in-picture .toggle')

    await video.evaluate((node) => ((node as HTMLVideoElement).disablePictureInPicture = true))

    await enter.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')

    await exit.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')

    await toggle.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')

    await toggle.click()

    expect(page.evaluate(() => document.pictureInPictureElement == null)).toBeTruthy()
    await expect(status).toHaveText('false')

    await video.evaluate((node) => ((node as HTMLVideoElement).disablePictureInPicture = false))
  })
})
