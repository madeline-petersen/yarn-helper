/* =============================================================
 *  AI-ASSISTED E2E TESTS
 *  Tests for yarn selection functionality in PatternView
 *  Generated with Claude 3.5 Sonnet (Anthropic).
 * ============================================================= */
import { test, expect } from '@playwright/test'

test.describe('Yarn Selection', () => {
  test('allows selecting yarns and shows insights with smooth scroll', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Click on the first pattern link
    const firstPatternLink = page.getByRole('link').nth(1) // Skip "Skip to content" link
    await firstPatternLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Verify guidance text is visible
    await expect(page.getByText(/Select one yarn from each column to see insights/)).toBeVisible()

    // Get the first yarn option from the first column
    const firstYarnOption = page.locator('.yarn-option').first()
    await expect(firstYarnOption).toBeVisible()

    // Click the first yarn option
    await firstYarnOption.click()

    // Verify the yarn is selected (has selected class)
    await expect(firstYarnOption).toHaveClass(/selected/)

    // Check if there are multiple columns (some patterns have held_with)
    const columns = page.locator('.yarn-column')
    const columnCount = await columns.count()

    if (columnCount > 1) {
      // If multiple columns, select from the second column too
      const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()
      await secondColumnYarn.click()
      await expect(secondColumnYarn).toHaveClass(/selected/)
    }

    // Wait for insights section to appear (it should show after all columns are selected)
    await expect(page.getByText('Your Yarn Selection Insights')).toBeVisible({ timeout: 10000 })

    // Verify selected yarn details are shown
    await expect(page.getByText('Compatibility Score:').first()).toBeVisible()

    // Verify "Clear all" button appears in the header
    await expect(page.getByText('Clear all')).toBeVisible()

    // Verify "Clear selection" button appears in insights
    await expect(page.getByText('Clear selection')).toBeVisible()
  })

  test('clears selection and hides insights when clear button is clicked', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Click on the first pattern link
    const firstPatternLink = page.getByRole('link').nth(1)
    await firstPatternLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Select a yarn
    const firstYarnOption = page.locator('.yarn-option').first()
    await firstYarnOption.click()

    // Check if there are multiple columns and select from all if needed
    const columns = page.locator('.yarn-column')
    const columnCount = await columns.count()

    if (columnCount > 1) {
      // If multiple columns, select from the second column too
      const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()
      await secondColumnYarn.click()
    }

    // Verify insights appear
    await expect(page.getByText('Your Yarn Selection Insights')).toBeVisible({ timeout: 10000 })

    // Click "Clear all" button
    await page.getByText('Clear all').click()

    // Verify insights disappear
    await expect(page.getByText('Your Yarn Selection Insights')).not.toBeVisible()

    // Verify yarn is no longer selected
    await expect(firstYarnOption).not.toHaveClass(/selected/)

    // Verify "Clear all" button disappears
    await expect(page.getByText('Clear all')).not.toBeVisible()
  })

  test('shows appropriate guidance text for single vs multiple columns', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Click on the first pattern link
    const firstPatternLink = page.getByRole('link').nth(1)
    await firstPatternLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Check the guidance text based on number of columns
    const columns = page.locator('.yarn-column')
    const columnCount = await columns.count()

    if (columnCount === 1) {
      await expect(page.getByText('Select a yarn to see insights')).toBeVisible()
    } else {
      await expect(page.getByText('Select one yarn from each column to see insights')).toBeVisible()
    }
  })

  test('announces selection changes to screen readers', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Click on the first pattern link
    const firstPatternLink = page.getByRole('link').nth(1)
    await firstPatternLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Select a yarn
    const firstYarnOption = page.locator('.yarn-option').first()
    await firstYarnOption.click()

    // Check that the selection status element has been updated
    const statusElement = page.locator('#selection-status')
    await expect(statusElement).toContainText(/Selected/)
  })

  test('focuses insights heading after selection is complete', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Click on the first pattern link
    const firstPatternLink = page.getByRole('link').nth(1)
    await firstPatternLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Select a yarn
    const firstYarnOption = page.locator('.yarn-option').first()
    await firstYarnOption.click()

    // Check if there are multiple columns and select from all if needed
    const columns = page.locator('.yarn-column')
    const columnCount = await columns.count()

    if (columnCount > 1) {
      // If multiple columns, select from the second column too
      const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()
      await secondColumnYarn.click()
    }

    // Wait for insights to appear
    await expect(page.getByText('Your Yarn Selection Insights')).toBeVisible({ timeout: 10000 })

    // Check that the insights heading is focused (has tabindex="-1" and should be focusable)
    const insightsHeading = page.getByRole('heading', { name: 'Your Yarn Selection Insights' })
    await expect(insightsHeading).toBeVisible()

    // The heading should be focusable for keyboard users
    await expect(insightsHeading).toHaveAttribute('tabindex', '-1')
  })
})
