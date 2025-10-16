/* =============================================================
 *  AI-ASSISTED TEST
 *  Playwright/Vitest scaffold generated with Claude 3.5 Sonnet (Anthropic).
 *  Assertions, structure, and selectors manually reviewed.
 * ============================================================= */
import { test, expect } from '@playwright/test'

test('pattern view renders core details and title updates', async ({ page }) => {
  await page.goto('/pattern/1')

  // Wait for Vue app to load
  await page.waitForLoadState('domcontentloaded')

  // Title updates
  await expect(page).toHaveTitle(/Agnete Cardigan · Yarn Helper/i)

  // Heading + back link
  await expect(page.getByRole('heading', { name: /agnete cardigan/i })).toBeVisible()
  await expect(page.locator('a[href="/"]').filter({ hasText: '← Back to Patterns' })).toBeVisible()

  // Image with accessible alt + figcaption
  const img = page.locator('figure img')
  await expect(img).toHaveAttribute('alt', /agnete cardigan knitting pattern/i)
  await expect(page.locator('figcaption')).toContainText(/DK weight/i)
  await expect(page.locator('figcaption')).toContainText(/sts per 10 cm/i)

  // Definition list shows key fields
  const dl = page.locator('dl')
  await expect(dl).toBeVisible()
  await expect(dl).toContainText(/Category/i)
  await expect(dl).toContainText(/Yarn Weight/i)
  await expect(dl).toContainText(/Gauge/i)
  await expect(dl).toContainText(/Needles/i)

  // Tags render as a list
  const tags = page.locator('.tag-list li')
  await expect(tags.first()).toBeVisible()
})

test('back link returns to home', async ({ page }) => {
  await page.goto('/pattern/1')

  // Wait for Vue app to load
  await page.waitForLoadState('domcontentloaded')

  await page.locator('a[href="/"]').filter({ hasText: '← Back to Patterns' }).click()
  await expect(page.getByRole('heading', { name: /yarn helper/i })).toBeVisible()
})

test('unknown pattern shows not-found UI', async ({ page }) => {
  await page.goto('/pattern/99999')
  await expect(page.getByRole('heading', { name: /pattern not found/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible()
})
