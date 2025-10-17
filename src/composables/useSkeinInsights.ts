/* =============================================================
 *  AI-ASSISTED COMPOSABLE
 *  Skein calculation and yardage insights generated with Claude 3.5 Sonnet (Anthropic).
 *  Mathematical formulas and Vue 3 integration manually reviewed.
 *
 *  Prompt: "Create a Vue 3 composable that calculates skein requirements and
 *  yardage insights for knitting patterns. Input: pattern ref, selected yarns ref.
 *  Output: computed skein counts, yardage analysis, and cost estimates."
 * ============================================================= */
import { computed, unref, type MaybeRef } from 'vue'
import type { Pattern } from '@/types/domain'
import { strandsFromPattern } from '@/utils/compatibility'

type Selection = {
  id: number
  name: string
  weight: string
  gauge_sts_per_10cm: number
  yardage_per_skein: number
  score: number
}

export function useSkeinInsights(
  patternRef: MaybeRef<Pattern | undefined>,
  selectedYarnsRef: MaybeRef<Record<string, Selection | undefined>>,
) {
  return computed(() => {
    const pattern = unref(patternRef)
    const selectedYarns = unref(selectedYarnsRef)

    if (!pattern?.required_yardage || pattern.required_yardage <= 0 || !selectedYarns) {
      return { skeinInsights: [] }
    }

    const isHeldTogether = pattern.held_with && pattern.held_with.length > 1
    const yardagePerStrand = pattern.required_yardage

    // Get the column order from the pattern strands to maintain UI consistency
    const strands = strandsFromPattern(pattern)
    const columnOrder = strands.map((strand) => strand.label)

    const skeinInsights = columnOrder
      .map((columnLabel) => {
        const yarn = selectedYarns[columnLabel]
        if (!yarn || !yarn.yardage_per_skein || yarn.yardage_per_skein <= 0) return null

        // For held-together patterns, yardage is per strand
        // For single-strand patterns, yardage is total
        const skeinsNeeded = Math.ceil(yardagePerStrand / yarn.yardage_per_skein)

        // Calculate total yardage needed
        const totalYardageNeeded = skeinsNeeded * yarn.yardage_per_skein

        return {
          columnLabel,
          yarn,
          skeinsNeeded,
          totalYardageNeeded,
          wasteYardage: totalYardageNeeded - yardagePerStrand,
          wastePercentage: Math.round(
            ((totalYardageNeeded - yardagePerStrand) / yardagePerStrand) * 100,
          ),
          isHeldTogether,
        }
      })
      .filter(Boolean)

    return { skeinInsights }
  })
}
