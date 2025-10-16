import { describe, it, expect } from 'vitest'
import { describePatternNatural } from '@/composables/describePatternNatural'
import type { Pattern } from '@/types/domain'

const base = {
  id: 1,
  name: 'Test',
  category: 'Cardigan',
  yarn_weight: 'DK',
  gauge_sts_per_10cm: 22,
  required_yardage: 1000,
  needles_mm: [3.75, 4.0],
  tags: [],
  photo_url: '',
  held_with: [],
} satisfies Pattern

describe('describePatternNatural', () => {
  it('describes single-strand DK with typical gauge/needles', () => {
    const s = describePatternNatural({ ...base })
    expect(s).toMatch(/This cardigan is knit using a DK-weight yarn\./)
    expect(s).toMatch(/uses 3\.8 mm and 4\.0 mm needles/)
    expect(s).toMatch(/gauge of 22 sts per 10 cm — typical for DK-weight yarn\./)
  })

  it('mentions held-with combo when present', () => {
    const s = describePatternNatural({
      ...base,
      held_with: [
        { label: 'main', weight: 'Fingering', gauge_sts_per_10cm: 26 },
        { label: 'carry', weight: 'Lace', gauge_sts_per_10cm: 28, fiber_hint: 'mohair' },
      ],
    })
    expect(s).toMatch(/holding Fingering \+ Lace \(mohair\) together/)
  })
})
