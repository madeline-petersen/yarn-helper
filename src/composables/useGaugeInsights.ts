import { computed, unref, type MaybeRef } from 'vue'
import {
  gaugeDiff,
  fabricNote,
  needleHint,
  swatchAdvice,
  combinedGauge,
  compatibilityHeadline,
  swatchGuidance,
  contextualSwatchGuidance,
} from '@/utils/gauge'
import { strandsFromPattern } from '@/utils/compatibility'
import type { Pattern } from '@/types/domain'

type Selection = Record<
  string,
  { id: number; name: string; gauge_sts_per_10cm: number; score: number } | undefined
>

export function useGaugeInsights(
  patternRef: MaybeRef<Pattern | undefined>,
  selectedYarnsRef: MaybeRef<Selection>,
) {
  const perColumn = computed(() => {
    const pattern = unref(patternRef)
    const selected = unref(selectedYarnsRef)
    if (!pattern) return []

    const strands = strandsFromPattern(pattern)

    // Check if all strands are selected
    const allSelected = strands.every((strand) => selected?.[strand.label])
    if (!allSelected) return []

    // Calculate combined gauge of all selected yarns using harmonic sum
    const selectedGauges = strands.map((strand) => selected[strand.label]!.gauge_sts_per_10cm)
    const combinedYarnGauge = combinedGauge(selectedGauges)

    // Compare combined gauge to pattern's target gauge
    const { diff, pct } = gaugeDiff(pattern.gauge_sts_per_10cm, combinedYarnGauge)

    // Get scores for compatibility headline
    const scores = strands.map((strand) => selected[strand.label]!.score)

    return [
      {
        headline: compatibilityHeadline(scores),
        combinedGauge: combinedYarnGauge,
        targetGauge: pattern.gauge_sts_per_10cm,
        diff: diff,
        pct: Math.abs(pct),
        swatchGuidance: contextualSwatchGuidance(diff, Math.abs(pct), scores),
        isSingleYarn: scores.length === 1,
      },
    ] as Array<{
      headline: string
      combinedGauge: number
      targetGauge: number
      diff: number
      pct: number
      swatchGuidance: string
      isSingleYarn: boolean
    }>
  })

  const overall = computed(() => {
    if (!perColumn.value.length) return null
    const avgAbsPct =
      Math.round(
        (perColumn.value.reduce((a, c) => a + Math.abs(c.pct), 0) / perColumn.value.length) * 10,
      ) / 10
    const worst = perColumn.value.reduce((min, c) =>
      Math.abs(c.pct) > Math.abs(min.pct) ? c : min,
    )
    return {
      avgAbsPct,
      worstDelta: worst.pct,
      worstLabel: worst.headline,
    }
  })

  return { perColumn, overall }
}
