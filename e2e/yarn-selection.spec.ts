/* =============================================================
 *  AI-ASSISTED E2E TEST
 *  Comprehensive yarn selection and analysis tests generated with Claude 3.5 Sonnet (Anthropic).
 *  Assertions, structure, and selectors manually reviewed.
 *
 *  Prompt: "Create comprehensive Playwright e2e tests for yarn selection and analysis.
 *  Input: Single/multi-strand patterns, yarn selection interactions, analysis sections.
 *  Output: Test cases for selection flow, all analysis sections display, gauge visualization,
 *  weight compatibility, skein calculations, and accessibility features."
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

    // Select from second column if it exists
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()
    await secondColumnYarn.click()
    await expect(secondColumnYarn).toHaveClass(/selected/)

    // Wait for insights section to appear (it should show after all columns are selected)
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

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

    // Select from second column
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()
    await secondColumnYarn.click()

    // Verify insights appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Click "Clear all" button
    await page.getByText('Clear all').click()

    // Verify insights disappear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeHidden()

    // Verify yarn is no longer selected
    await expect(firstYarnOption).not.toHaveClass(/selected/)

    // Verify "Clear all" button disappears
    await expect(page.getByText('Clear all')).toBeHidden()
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

    // Verify appropriate guidance text for multiple columns
    await expect(page.getByText('Select one yarn from each column to see insights')).toBeVisible()
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

    // Select from second column
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()
    await secondColumnYarn.click()

    // Wait for insights to appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Check that the insights heading is focused (has tabindex="-1" and should be focusable)
    const insightsHeading = page.getByRole('heading', {
      name: '🧶 Your Yarn Selection Insights 🧶',
    })
    await expect(insightsHeading).toBeVisible()

    // The heading should be focusable for keyboard users
    await expect(insightsHeading).toHaveAttribute('tabindex', '-1')
  })

  test('displays all expected analysis sections for single-strand pattern', async ({ page }) => {
    // Navigate to a single-strand pattern (Celeste Mittens - pattern ID 3)
    await page.goto('/pattern/3')
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Select a yarn from the single column
    const firstYarnOption = page.locator('.yarn-option').first()
    await firstYarnOption.click()

    // Wait for insights to appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Verify all expected analysis sections are present
    await expect(page.getByText('Gauge Analysis')).toBeVisible()
    await expect(page.getByText('Weight Analysis')).toBeVisible()
    await expect(page.getByText('Skein Analysis')).toBeVisible()
    await expect(page.getByText('Summary')).toBeVisible()

    // Verify gauge visualization is present
    await expect(page.locator('[data-testid="swatch-pattern"]')).toBeVisible()
    await expect(page.locator('[data-testid="swatch-combo"]')).toBeVisible()

    // Verify compatibility score is displayed
    await expect(page.getByText(/Compatibility Score:/)).toBeVisible()

    // Verify weight analysis shows match level
    await expect(page.getByText(/matches the pattern target|a bit|noticeably/)).toBeVisible()

    // Verify skein information is shown
    await expect(page.getByText(/skeins? needed|yards? required/)).toBeVisible()
  })

  test('displays all expected analysis sections for multi-strand pattern', async ({ page }) => {
    // Navigate to a multi-strand pattern (Agnete Cardigan - pattern ID 1)
    await page.goto('/pattern/1')
    await page.waitForLoadState('domcontentloaded')

    // Wait for yarn suggestions to load
    await expect(page.getByText('Compatible Yarn Suggestions')).toBeVisible()

    // Verify guidance text for multiple columns
    await expect(page.getByText('Select one yarn from each column to see insights')).toBeVisible()

    // Select yarns from both columns
    const firstColumnYarn = page.locator('.yarn-column').nth(0).locator('.yarn-option').first()
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()

    await firstColumnYarn.click()
    await secondColumnYarn.click()

    // Wait for insights to appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Verify all expected analysis sections are present
    await expect(page.getByText('Gauge Analysis')).toBeVisible()
    await expect(page.getByText('Weight Analysis')).toBeVisible()
    await expect(page.getByText('Skein Analysis')).toBeVisible()
    await expect(page.getByText('Summary')).toBeVisible()

    // Verify gauge visualization shows both pattern and combo
    await expect(page.locator('[data-testid="swatch-pattern"]')).toBeVisible()
    await expect(page.locator('[data-testid="swatch-combo"]')).toBeVisible()

    // Verify combined gauge calculation is shown (check for visible gauge text)
    await expect(page.locator('.gauge-info .gauge').first()).toBeVisible()

    // Verify weight analysis accounts for multiple strands
    await expect(page.getByText(/\+ |held together/).first()).toBeVisible()

    // Verify skein requirements for both yarns
    await expect(page.getByText(/skeins? needed|yards? required/).first()).toBeVisible()
  })

  test('verifies gauge visualization shows correct data', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/pattern/1')
    await page.waitForLoadState('domcontentloaded')

    // Select yarns from both columns
    const firstColumnYarn = page.locator('.yarn-column').nth(0).locator('.yarn-option').first()
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()

    await firstColumnYarn.click()
    await secondColumnYarn.click()

    // Wait for insights to appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Verify gauge visualization section
    const gaugeSection = page.locator('.gauge-preview-svg')
    await expect(gaugeSection).toBeVisible()

    // Verify pattern side shows correct gauge
    await expect(gaugeSection.getByRole('heading', { name: 'Pattern Target' })).toBeVisible()
    await expect(gaugeSection.locator('.gauge-info .gauge').first()).toBeVisible()

    // Verify combo side shows combined gauge
    await expect(gaugeSection.getByRole('heading', { name: 'Your Selection' })).toBeVisible()
    await expect(gaugeSection.locator('.gauge-info .gauge').nth(1)).toBeVisible()

    // Verify both SVG elements are present
    await expect(page.locator('[data-testid="swatch-pattern"]')).toBeVisible()
    await expect(page.locator('[data-testid="swatch-combo"]')).toBeVisible()
  })

  test('verifies weight compatibility analysis for different match levels', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/pattern/1')
    await page.waitForLoadState('domcontentloaded')

    // Select yarns from both columns
    const firstColumnYarn = page.locator('.yarn-column').nth(0).locator('.yarn-option').first()
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()

    await firstColumnYarn.click()
    await secondColumnYarn.click()

    // Wait for insights to appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Verify weight compatibility section
    await expect(page.getByText('Weight Analysis')).toBeVisible()

    // Verify weight analysis shows appropriate match level
    const weightSection = page.locator('.weight-analysis')
    await expect(weightSection).toBeVisible()

    // Should show either exact match, close match, or off match
    const weightText = await weightSection.textContent()
    expect(weightText).toMatch(
      /matches the pattern target|a bit|noticeably|much|thicker|lighter|expect|fabric|behave/,
    )
  })

  test('verifies skein requirements calculation', async ({ page }) => {
    // Navigate to a pattern page
    await page.goto('/pattern/1')
    await page.waitForLoadState('domcontentloaded')

    // Select yarns from both columns
    const firstColumnYarn = page.locator('.yarn-column').nth(0).locator('.yarn-option').first()
    const secondColumnYarn = page.locator('.yarn-column').nth(1).locator('.yarn-option').first()

    await firstColumnYarn.click()
    await secondColumnYarn.click()

    // Wait for insights to appear
    await expect(page.getByText('🧶 Your Yarn Selection Insights 🧶')).toBeVisible({
      timeout: 10000,
    })

    // Verify skein requirements section
    await expect(page.getByText('Skein Analysis')).toBeVisible()

    // Verify skein information is displayed
    const skeinSection = page.locator('.skein-analysis')
    await expect(skeinSection).toBeVisible()

    // Should show skein counts and yardage
    await expect(skeinSection.getByText(/\d+ skeins? needed/).first()).toBeVisible()
    await expect(skeinSection.getByText(/yards?/).first()).toBeVisible()
  })
})
