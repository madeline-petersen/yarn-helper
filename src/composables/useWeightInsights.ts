/* =============================================================
 *  AI-ASSISTED COMPOSABLE
 *  Weight compatibility analysis generated with Claude 3.5 Sonnet (Anthropic).
 *  Yarn weight hierarchy logic and Vue 3 integration manually reviewed.
 *
 *  Prompt: "Create a Vue 3 composable that analyzes yarn weight compatibility
 *  for multi-strand patterns. Input: pattern ref, selected yarns ref.
 *  Output: computed weight insights with match levels and human-readable descriptions."
 * ============================================================= */
import { computed, unref, type MaybeRef } from 'vue'
import type { Pattern } from '@/types/domain'
import { WEIGHT_HIERARCHY } from '@/constants/yarn'

type Selection = Record<
  string,
  | { id: number; name: string; weight: string; gauge_sts_per_10cm: number; score: number }
  | undefined
>

type WeightLevel = (typeof WEIGHT_HIERARCHY)[number]

export function useWeightInsights(
  patternRef: MaybeRef<Pattern | undefined>,
  selectedYarnsRef: MaybeRef<Selection>,
) {
  const weightInsight = computed(() => {
    const pattern = unref(patternRef)
    const selected = unref(selectedYarnsRef)

    if (!pattern) {
      return {
        headline: 'Weight data unavailable',
        detail: 'Pattern data not available.',
        matchLevel: 'off' as const,
      }
    }

    // Get selected yarns from the actual selection with their column labels
    const selectedEntries = Object.entries(selected).filter(([, yarn]) => yarn)

    if (selectedEntries.length === 0) {
      return {
        headline: 'Weight data unavailable',
        detail: 'No yarn weight information available for selected yarns.',
        matchLevel: 'off' as const,
      }
    }

    // Get weights from the selected yarns with their column labels
    const selectedWeights = selectedEntries.map(([, yarn]) => yarn!.weight as WeightLevel)
    const selectedLabeled = selectedEntries.map(([label, yarn]) => ({
      label,
      weight: yarn!.weight as WeightLevel,
    }))

    if (selectedWeights.length === 0) {
      return {
        headline: 'Weight data unavailable',
        detail: 'No yarn weight information available for selected yarns.',
        matchLevel: 'off' as const,
      }
    }

    // Determine combined weight
    let combinedWeight: WeightLevel
    if (selectedWeights.length === 1) {
      combinedWeight = selectedWeights[0]!
    } else {
      // Multiple yarns held together — base on the heaviest strand
      const heaviestWeight = selectedWeights.reduce((heaviest, weight) => {
        const heaviestIndex = WEIGHT_HIERARCHY.indexOf(heaviest)
        const weightIndex = WEIGHT_HIERARCHY.indexOf(weight)
        return weightIndex > heaviestIndex ? weight : heaviest
      })

      const heaviestIndex = WEIGHT_HIERARCHY.indexOf(heaviestWeight)

      // Fingering + Lace → +2 steps → DK
      // Fingering + Fingering → +1 step → Sport
      // DK + Lace → +1 step → Worsted
      const stepsHeavier = selectedWeights.includes('Lace') && selectedWeights.length >= 2 ? 2 : 1

      const newIndex = Math.min(heaviestIndex + stepsHeavier, WEIGHT_HIERARCHY.length - 1)
      combinedWeight = WEIGHT_HIERARCHY[newIndex]!
    }

    // Compare to pattern weight
    const patternWeight = pattern.yarn_weight as WeightLevel
    const patternIndex = WEIGHT_HIERARCHY.indexOf(patternWeight)
    const combinedIndex = WEIGHT_HIERARCHY.indexOf(combinedWeight)

    // Generate insight text
    // Build a human-friendly description like: "Fingering + Lace"
    const weightDescription =
      selectedLabeled.length === 1
        ? selectedLabeled[0]!.weight
        : selectedLabeled.map((s) => s.weight).join(' + ')

    let headline = ''
    let detail = ''
    let matchLevel: 'exact' | 'close' | 'off'

    const isSingleYarn = selectedLabeled.length === 1
    const yarnText = isSingleYarn ? 'yarn' : 'yarns'
    const verbText = isSingleYarn ? 'behaves' : 'behave'
    const togetherText = isSingleYarn ? '' : 'Held together, '
    const startText = isSingleYarn ? 'Your selected ' : 'your selected '

    if (patternIndex === combinedIndex) {
      headline = `${weightDescription} = ${combinedWeight} — matches the pattern target (${patternWeight}).`
      detail = `${togetherText}${startText}${yarnText} ${verbText} like ${combinedWeight}, which aligns with the pattern's ${patternWeight} weight.`
      matchLevel = 'exact'
    } else if (Math.abs(patternIndex - combinedIndex) === 1) {
      const direction = combinedIndex > patternIndex ? 'heavier' : 'lighter'
      headline = `${weightDescription} = ${combinedWeight} — a bit ${direction} than the pattern target (${patternWeight}).`
      if (combinedIndex > patternIndex) {
        detail = `${togetherText}${startText}${yarnText} tends toward ${combinedWeight}. Expect a slightly thicker, denser fabric than the pattern's ${patternWeight} target.`
      } else {
        detail = `${togetherText}${startText}${yarnText} tends toward ${combinedWeight}. Expect a slightly lighter, more fluid fabric than the pattern's ${patternWeight} target.`
      }
      matchLevel = 'close'
    } else {
      const direction = combinedIndex > patternIndex ? 'heavier' : 'lighter'
      const severity = Math.abs(patternIndex - combinedIndex) > 2 ? 'much' : 'noticeably'
      headline = `${weightDescription} = ${combinedWeight} — ${severity} ${direction} than the pattern target (${patternWeight}).`
      if (combinedIndex > patternIndex) {
        detail = `${togetherText}${startText}${yarnText} ${verbText} like ${combinedWeight}. The fabric will be ${severity} thicker and denser than intended. Swatch to confirm drape and structure.`
      } else {
        detail = `${togetherText}${startText}${yarnText} ${verbText} like ${combinedWeight}. The fabric will be ${severity} lighter and more fluid than intended. Swatch to check drape and structure.`
      }
      matchLevel = 'off'
    }

    return {
      headline,
      detail,
      matchLevel,
    }
  })

  return { weightInsight }
}
