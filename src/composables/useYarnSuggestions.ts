import { computed, type ComputedRef } from 'vue'
import { gaugeCompatibilityScore } from '@/utils/compatibility'
import { strandsFromPattern } from '@/utils/compatibility'
import type { Pattern, Yarn } from '@/types/domain'

export function useYarnSuggestions(
  pattern: ComputedRef<Pattern | undefined>,
  yarns: Yarn[],
  topN = 5,
) {
  const columns = computed(() => {
    if (!pattern.value) return []
    const strands = strandsFromPattern(pattern.value)
    return strands.map((strand) => {
      const ranked = yarns
        .map((y) => ({
          id: y.id,
          name: y.name,
          gauge_sts_per_10cm: y.gauge_sts_per_10cm,
          score: gaugeCompatibilityScore(strand.gauge_sts_per_10cm, y.gauge_sts_per_10cm),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
      return { label: strand.label, suggestions: ranked }
    })
  })

  const maxRows = computed(() => Math.max(0, ...columns.value.map((c) => c.suggestions.length)))

  return { columns, maxRows }
}
