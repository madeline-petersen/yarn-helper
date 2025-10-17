/* =============================================================
 *  AI-ASSISTED COMPOSABLE
 *  Natural language summary generation created with Claude 3.5 Sonnet (Anthropic).
 *  Template logic and Vue 3 integration manually reviewed.
 *
 *  Prompt: "Create a Vue 3 composable that generates natural language summaries
 *  of yarn selection insights. Input: pattern ref, selected yarns ref, insights object.
 *  Output: computed summary text with contextual advice and recommendations."
 * ============================================================= */
import { computed, unref, type MaybeRef } from 'vue'
import type { Pattern } from '@/types/domain'

type WeightInsight = {
  headline: string
  detail: string
  matchLevel: 'exact' | 'close' | 'off'
}

type GaugeInsight = {
  headline: string
  combinedGauge: number
  targetGauge: number
  diff: number
  pct: number
  swatchGuidance: string
  isSingleYarn: boolean
}

type SkeinInsight = {
  columnLabel: string
  skeinsNeeded: number
  yarn: {
    name: string
    yardage_per_skein: number
  }
}

export function describeSummaryNatural(
  patternRef: MaybeRef<Pattern | undefined>,
  weightInsightRef: MaybeRef<WeightInsight | undefined>,
  gaugeInsightsRef: MaybeRef<GaugeInsight[]>,
  skeinInsightsRef: MaybeRef<SkeinInsight[]>,
  avgCompatibilityScoreRef: MaybeRef<number>,
) {
  return computed(() => {
    const pattern = unref(patternRef)
    const weightInsight = unref(weightInsightRef)
    const gaugeInsights = unref(gaugeInsightsRef)
    const skeinInsights = unref(skeinInsightsRef)
    const avgCompatibilityScore = unref(avgCompatibilityScoreRef)

    if (!pattern || !weightInsight || !gaugeInsights.length || !skeinInsights.length) {
      return ''
    }

    // Build natural language summary
    const parts: string[] = []

    // Overall compatibility assessment based on compatibility scores
    if (avgCompatibilityScore >= 90) {
      parts.push('Your yarn selection is an excellent match for this pattern.')
    } else if (avgCompatibilityScore >= 60) {
      parts.push(
        'Your yarn selection is a good match for this pattern with minor adjustments needed.',
      )
    } else {
      parts.push('Your yarn selection may need some adjustments to work well with this pattern.')
    }

    // Skein requirements
    if (skeinInsights.length === 1) {
      const insight = skeinInsights[0]!
      parts.push(
        `You'll need ${insight.skeinsNeeded} skein${insight.skeinsNeeded === 1 ? '' : 's'} of ${insight.yarn.name} (${insight.yarn.yardage_per_skein} yards each).`,
      )
    } else {
      const skeinDetails = skeinInsights
        .map((insight) => `${insight.skeinsNeeded} ${insight.columnLabel}`)
        .join(' and ')
      parts.push(`You'll need ${skeinDetails} skeins total.`)
    }

    // Final recommendation based on score
    if (avgCompatibilityScore >= 90) {
      parts.push('You can proceed with confidence.')
    } else if (avgCompatibilityScore >= 60) {
      parts.push('A gauge swatch is recommended to verify the fabric meets your expectations.')
    } else {
      parts.push('Make sure to swatch carefully and adjust needle size if needed.')
    }

    return parts.join(' ')
  })
}
