/* =============================================================
 *  AI-ASSISTED UNIT TESTS
 *  Tests for utility formatting functions used across the app.
 *  Generated with Claude 3.5 Sonnet (Anthropic).
 * ============================================================= */
import { describe, it, expect } from 'vitest'
import { formatNeedles, formatGauge, capitalize } from '@/utils/formatters'

describe('formatNeedles', () => {
  it('formats a single needle size', () => {
    expect(formatNeedles([3])).toBe('3.0 mm')
  })

  it('formats a range of needles', () => {
    expect(formatNeedles([2.5, 3.0])).toBe('2.5–3.0 mm')
  })

  it('sorts and deduplicates needles', () => {
    expect(formatNeedles([3.0, 2.5, 3.0])).toBe('2.5–3.0 mm')
  })

  it('returns an em dash when no needles', () => {
    expect(formatNeedles([])).toBe('—')
  })
})

describe('formatGauge', () => {
  it('formats gauge correctly', () => {
    expect(formatGauge(19)).toBe('19 sts per 10 cm')
  })
})

describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalize('cardigan')).toBe('Cardigan')
  })
  it('returns empty string if input is empty', () => {
    expect(capitalize('')).toBe('')
  })
})
