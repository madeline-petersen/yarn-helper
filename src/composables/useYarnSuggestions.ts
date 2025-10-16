import { computed, unref, type MaybeRef } from 'vue'
import { gaugeCompatibilityScore, strandsFromPattern } from '@/utils/compatibility'
import type { Pattern, Yarn } from '@/types/domain'

/* =============================================================
 *  AI-ASSISTED IMPLEMENTATION
 *  Suggested by Claude 3.5 Sonnet (Anthropic).
 *
 *  Reasoning:
 *  - We accept `pattern` as a MaybeRef<Pattern | undefined> because in our app
 *    it's a `computed` ref derived from the current route.
 *  - Using `unref()` ensures the function works with both plain objects and refs.
 *  - This avoids a subtle bug where the suggestions table would not update
 *    when navigating between patterns (because Vue wouldn't track `.value` changes).
 *
 *  Reviewed manually and verified to preserve reactivity and type safety.
 * ============================================================= */
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
          gauge_sts_per_10cm: y.gauge_sts_per_10cm,
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
