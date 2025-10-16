/* =============================================================
 *  AI-ASSISTED TEST
 *  Playwright/Vitest scaffold generated with Claude 3.5 Sonnet (Anthropic).
 *  Assertions, structure, and selectors manually reviewed.
 * ============================================================= */
import { test, expect } from '@playwright/test'

test('keyboard: tab to first pattern, open with Enter, go back with keyboard', async ({ page }) => {
  await page.goto('/')

  // Tab through to find the first pattern link
  await page.keyboard.press('Tab') // Skip link
  await page.keyboard.press('Tab') // First pattern link

  // Activate with Enter (should work regardless of focus state)
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: /agnete cardigan/i })).toBeVisible()

  // Tab to Back and activate with Enter
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  // Wait for the home page to load by checking for the heading
  await expect(page.getByRole('heading', { name: /yarn helper/i })).toBeVisible()
})
