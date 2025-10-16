/* =============================================================
 *  AI-ASSISTED FUNCTION: gaugeCompatibilityScore
 *  Claude 3.5 Sonnet suggested using a Gaussian (normal distribution)
 *  falloff after analyzing how knitters typically handle gauge differences:
 *
 *  - Small differences (±1-2 sts) are easily adjusted with needle size
 *  - Medium differences (±3 sts) start becoming problematic
 *  - Large differences (±4-5+ sts) make yarns effectively incompatible
 *
 *  A Gaussian curve naturally models this real-world behavior:
 *  it falls off gently at first, then more steeply, approaching
 *  but never quite reaching zero. Claude chose σ=2 to make the
 *  curve match typical gauge adjustment ranges seen in knitting
 *  patterns and yarn substitution guides.
 * ============================================================= */
import type { Pattern } from '@/types/domain'

export function gaugeCompatibilityScore(targetGauge: number, yarnGauge: number): number {
  if (!Number.isFinite(targetGauge) || !Number.isFinite(yarnGauge)) return 0
  const diff = Math.abs(targetGauge - yarnGauge)

  // 0 diff => 100
  // 1 diff => ~90
  // 2 diff => ~75
  // 3 diff => ~60
  // 4 diff => ~45
  // >5 diff => <30
  const sigma = 2
  const score = Math.exp(-(diff * diff) / (2 * sigma * sigma)) * 100
  return Math.round(score)
}

export function strandsFromPattern(
  p: Pattern,
): Array<{ label: string; gauge_sts_per_10cm: number }> {
  if (p.held_with?.length) {
    return p.held_with.map((s) => ({
      label: s.label,
      gauge_sts_per_10cm: s.gauge_sts_per_10cm,
    }))
  }
  // fallback: treat the pattern's single gauge as one "strand"
  return [{ label: 'main', gauge_sts_per_10cm: p.gauge_sts_per_10cm }]
}
