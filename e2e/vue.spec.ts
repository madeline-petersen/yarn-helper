/* =============================================================
 *  AI-ASSISTED TEST
 *  Playwright/Vitest scaffold generated with Claude 3.5 Sonnet (Anthropic).
 *  Assertions, structure, and selectors manually reviewed.
 * ============================================================= */
import { test, expect } from '@playwright/test'

test('happy path: navigate home → pattern → back', async ({ page }) => {
  await page.goto('/')
  // Home renders title and pattern tiles
  await expect(page.getByRole('heading', { name: /yarn helper/i })).toBeVisible()
  // Find the first pattern link (skip the "Skip to content" link)
  const firstCard = page.getByRole('link').nth(1) // Skip the first link (skip link)
  await expect(firstCard).toBeVisible()

  // Go to first pattern
  await firstCard.click()
  await expect(
    page.getByRole('button', { name: /back/i }).or(page.getByRole('link', { name: /back/i })),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: /agnete cardigan/i })).toBeVisible()

  // Back to home
  await page.goBack()
  await expect(page.getByRole('heading', { name: /yarn helper/i })).toBeVisible()
})
