/* =============================================================
 *  AI-ASSISTED UNIT TESTS
 *  Tests for yarn compatibility scoring functions.
 *  Generated with Claude 3.5 Sonnet (Anthropic).
 * ============================================================= */

import { describe, it, expect } from 'vitest'
import { gaugeCompatibilityScore, strandsFromPattern } from '@/utils/compatibility'
import type { Pattern } from '@/types/domain'

describe('gaugeCompatibilityScore', () => {
  it('gives 100 for exact match', () => {
    expect(gaugeCompatibilityScore(22, 22)).toBe(100)
  })
  it('falls off as diff grows', () => {
    expect(gaugeCompatibilityScore(22, 21)).toBeGreaterThan(gaugeCompatibilityScore(22, 24))
  })
})

describe('strandsFromPattern', () => {
  const base = {
    id: 1,
    name: 'x',
    category: 'cardigan',
    yarn_weight: 'DK',
    gauge_sts_per_10cm: 22,
    required_yardage: 1000,
    needles_mm: [4],
    tags: [],
    photo_url: '',
    held_with: [],
  } satisfies Pattern

  it('falls back to a single main strand when held_with is empty', () => {
    expect(strandsFromPattern(base)).toEqual([{ label: 'main', gauge_sts_per_10cm: 22 }])
  })
})
