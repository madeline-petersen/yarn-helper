/* =============================================================
 *  AI-ASSISTED COMPOSABLE
 *  Yarn suggestion algorithm generated with Claude 3.5 Sonnet (Anthropic).
 *  Gaussian compatibility scoring and Vue 3 integration manually reviewed.
 *
 *  Prompt: "Create a Vue 3 composable that suggests compatible yarns for knitting
 *  patterns. Input: pattern ref, yarns array, topN count.
 *  Output: computed columns with ranked suggestions and compatibility scores."
 * ============================================================= */
import { computed, unref, type MaybeRef } from 'vue'
import { gaugeCompatibilityScore, strandsFromPattern } from '@/utils/compatibility'
import type { Pattern, Yarn } from '@/types/domain'

export function useYarnSuggestions(
  patternRef: MaybeRef<Pattern | undefined>,
  yarns: Yarn[],
  topN = 5,
) {
  const columns = computed(() => {
    const pattern = unref(patternRef) // ✅ unwraps ref or passes plain object
    if (!pattern) return []

    const strands = strandsFromPattern(pattern)
    return strands.map((strand) => {
      const ranked = yarns
        .map((y) => ({
          id: y.id,
          name: y.name,
          weight: y.weight,
          gauge_sts_per_10cm: y.gauge_sts_per_10cm,
          yardage_per_skein: y.yardage_per_skein,
          score: gaugeCompatibilityScore(strand.gauge_sts_per_10cm, y.gauge_sts_per_10cm),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)

      return { label: strand.label, targetGauge: strand.gauge_sts_per_10cm, suggestions: ranked }
    })
  })

  const maxRows = computed(() => Math.max(0, ...columns.value.map((c) => c.suggestions.length)))

  return { columns, maxRows }
}
