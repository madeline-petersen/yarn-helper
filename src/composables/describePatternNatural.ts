/* =============================================================
 *  AI-ASSISTED COMPOSABLE
 *  Natural language pattern descriptions generated with Claude 3.5 Sonnet (Anthropic).
 *  Logic and formatting manually reviewed.
 * ============================================================= */
import type { Pattern, YarnWeight } from '@/types/domain'
import { YARN_WEIGHT_INFO } from '@/constants/yarn'
import { formatGauge, formatNeedles, formatHeldCombo, sentenceJoin } from '@/utils/formatters'

function average(nums: number[] = []): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : NaN
}

function articleAndVerb(category: string): { article: string; verb: string } {
  const lower = category.toLowerCase()
  // crude plural check: known plurals + words ending with 's'
  const isPlural = ['socks', 'mittens', 'gloves', 'scarves'].includes(lower) || /s$/.test(lower)
  return isPlural ? { article: 'These', verb: 'are' } : { article: 'This', verb: 'is' }
}

function describeGaugeDelta(avgGauge: number, weight: YarnWeight): string {
  const range = YARN_WEIGHT_INFO[weight]?.gauge
  if (!range) return ''
  const [min, max] = range
  if (!Number.isFinite(avgGauge) || !Number.isFinite(min) || !Number.isFinite(max)) return ''
  if (avgGauge < min) return `— a bit looser than standard ${weight} fabric, giving a softer drape.`
  if (avgGauge > max)
    return `— a bit denser than standard ${weight} fabric, for a more structured feel.`
  return `— typical for ${weight}-weight yarn.`
}

export function describePatternNatural(p: Pattern): string {
  const weight = p.yarn_weight as YarnWeight
  const combo = formatHeldCombo(p)
  const needlesStr = formatNeedles(p.needles_mm)
  const avgNeedle = average(p.needles_mm)
  const typicalNeedle = YARN_WEIGHT_INFO[weight]?.needle
  const { article, verb } = articleAndVerb(p.category)
  const noun = p.category.toLowerCase()

  // Only use "holding together" if there are actually multiple yarns
  const hasMultipleYarns = p.held_with && p.held_with.length > 1
  const first =
    hasMultipleYarns && combo
      ? `${article} ${noun} ${verb} knit by holding ${combo} together, which makes them behave like a ${weight}-weight yarn.`
      : `${article} ${noun} ${verb} knit using a ${weight}-weight yarn.`

  let needleComparison = ''
  if (
    Number.isFinite(avgNeedle) &&
    typicalNeedle &&
    Number.isFinite(typicalNeedle[0]) &&
    Number.isFinite(typicalNeedle[1])
  ) {
    if (avgNeedle < typicalNeedle[0])
      needleComparison = `, slightly smaller than typical for ${weight} yarn`
    else if (avgNeedle > typicalNeedle[1])
      needleComparison = `, slightly larger than typical for ${weight} yarn`
  }

  const second = needlesStr ? `The pattern uses ${needlesStr} needles${needleComparison}.` : null

  const third = Number.isFinite(p.gauge_sts_per_10cm)
    ? `It works to a gauge of ${formatGauge(p.gauge_sts_per_10cm)} ${describeGaugeDelta(p.gauge_sts_per_10cm, weight)}`
    : null

  return sentenceJoin([first, second, third])
}
