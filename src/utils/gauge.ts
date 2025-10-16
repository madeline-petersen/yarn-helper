/* =============================================================
 *  AI-ASSISTED UTILITIES
 *  Functions for gauge calculations and fabric advice
 *  Generated with Claude 3.5 Sonnet (Anthropic).
 * ============================================================= */
export function gaugeDiff(patternGauge: number, yarnGauge: number) {
  // positive => yarn is *denser* (more sts/10cm than target)
  const diff = Math.round((yarnGauge - patternGauge) * 10) / 10
  const pct = Math.round(((yarnGauge - patternGauge) / patternGauge) * 100)
  return { diff, pct }
}

export function fabricNote(diffSts: number) {
  const abs = Math.abs(diffSts)
  if (abs === 0) return 'Theoretical match - swatch to confirm.'
  const dir = diffSts > 0 ? 'denser' : 'looser' // >0 means more sts → denser
  if (abs <= 1) return `Very close; might be slightly ${dir}. Swatch to verify.`
  if (abs <= 3) return `Potentially ${dir}; swatching strongly recommended.`
  return `Likely ${dir}; swatching essential - consider different needle size or yarn.`
}

export function needleHint(diffSts: number) {
  if (diffSts === 0) return 'Start with pattern needle size; adjust based on swatch.'
  // yarn gauge > pattern gauge → denser → go up a needle size
  return diffSts > 0
    ? 'Consider a larger needle if swatch is too dense.'
    : 'Consider a smaller needle if swatch is too loose.'
}

export function swatchAdvice(diffSts: number, pctDelta: number): string {
  const abs = Math.abs(diffSts)
  if (abs === 0) return 'Swatch to confirm the theoretical match - individual tension varies.'
  if (abs <= 2) return 'Swatch to verify - small adjustments to needle size may be needed.'
  return 'Swatch is essential - the combination may behave differently than predicted.'
}

/**
 * Calculate the combined gauge when holding multiple yarns together.
 * Uses harmonic sum model: combinedGauge = 1 / Σ(1 / gaugeᵢ)
 * This models how thickness adds up when yarns are held together.
 */
export function combinedGauge(individualGauges: number[]): number {
  if (individualGauges.length === 0) return 0
  if (individualGauges.length === 1) return individualGauges[0]!

  // Harmonic sum model: when strands are held together, thickness ~ sum(thicknessᵢ)
  // and stitches/10cm ~ 1/thickness, so combinedGauge = 1 / Σ(1 / gaugeᵢ)
  const harmonicSum = individualGauges.reduce((sum, gauge) => sum + 1 / gauge, 0)
  const combined = 1 / harmonicSum
  return Math.round(combined * 10) / 10
}

/**
 * Generate compatibility headline based on the lowest per-strand score.
 */
export function compatibilityHeadline(scores: number[]): string {
  if (scores.length === 0) return 'No yarns selected.'

  const minScore = Math.min(...scores)
  const scoreList = scores.map((s) => `${s}%`).join(', ')
  const isSingleYarn = scores.length === 1
  const yarnText = isSingleYarn ? 'this yarn' : 'these yarns'

  if (minScore >= 95) {
    return `Excellent compatibility (${scoreList}) — you've set yourself up for success with ${yarnText}.`
  }
  if (minScore >= 80) {
    return `Good compatibility (${scoreList}) — you're in a solid position with ${isSingleYarn ? 'this selection' : 'these selections'}.`
  }
  if (minScore >= 60) {
    return `Moderate compatibility (${scoreList}) — ${yarnText} will work with some adjustments.`
  }
  return `Challenging compatibility (${scoreList}) — ${yarnText} may require careful consideration.`
}

/**
 * Generate context-aware swatch guidance that explains apparent mismatches
 * between high individual scores and combined gauge deviations.
 */
export function contextualSwatchGuidance(diff: number, pct: number, scores: number[]): string {
  const minScore = Math.min(...scores)
  const isHighCompatibility = minScore >= 90
  const isSignificantDeviation = Math.abs(pct) >= 15
  const isSingleYarn = scores.length === 1

  const yarnText = isSingleYarn ? 'this yarn' : 'the combined yarns'
  let guidance = `Our estimate suggests ${yarnText} may produce `

  // Special handling for high compatibility with significant deviation
  if (isHighCompatibility && isSignificantDeviation) {
    if (diff > 0) {
      guidance += 'a denser fabric than the pattern gauge.'
    } else {
      guidance += 'a looser fabric than the pattern gauge.'
    }
  } else {
    // Standard guidance for other cases
    if (diff === 0) {
      guidance += 'a fabric that matches the pattern gauge quite closely.'
    } else if (diff > 0) {
      if (pct <= 5) {
        guidance += 'a slightly denser fabric than the pattern gauge.'
      } else if (pct <= 10) {
        guidance += 'a denser fabric than the pattern gauge.'
      } else {
        guidance += 'a noticeably denser fabric than the pattern gauge.'
      }
    } else {
      if (pct <= 5) {
        guidance += 'a slightly looser fabric than the pattern gauge.'
      } else if (pct <= 10) {
        guidance += 'a looser fabric than the pattern gauge.'
      } else {
        guidance += 'a noticeably looser fabric than the pattern gauge.'
      }
    }
  }

  // Add adjustment suggestions
  if (diff !== 0) {
    guidance +=
      '\n\nIf after measuring your <a href="https://elizabethsmithknits.com/techniques/what-is-a-gauge-swatch/" target="_blank" rel="noopener noreferrer">gauge swatch</a> you find that to be the case, '
    if (diff > 0) {
      if (pct <= 5) {
        guidance += 'try a slightly larger needle if needed to match the pattern gauge.'
      } else if (pct <= 10) {
        guidance += 'try a larger needle to achieve the target gauge.'
      } else {
        guidance += 'try a larger needle or consider different yarn to achieve the target gauge.'
      }
    } else {
      if (pct <= 5) {
        guidance += 'try a slightly smaller needle if needed to match the pattern gauge.'
      } else if (pct <= 10) {
        guidance += 'try a smaller needle to achieve the target gauge.'
      } else {
        guidance += 'try a smaller needle or consider different yarn to achieve the target gauge.'
      }
    }
  } else {
    guidance += '\n\nAlways swatch before starting your project to confirm the gauge.'
  }

  return guidance
}

/**
 * Generate swatch guidance based on gauge deviation.
 */
export function swatchGuidance(diff: number, pct: number): string {
  let guidance =
    'Based on our calculations, when you knit your <a href="https://elizabethsmithknits.com/techniques/what-is-a-gauge-swatch/" target="_blank" rel="noopener noreferrer">gauge swatch</a>, you might find that '

  if (diff === 0) {
    guidance += 'your gauge matches the pattern target quite closely.'
  } else if (diff > 0) {
    // Denser/tighter (more sts/10cm)
    if (pct <= 5) {
      guidance += 'your fabric is a hair denser than the target gauge.'
    } else if (pct <= 10) {
      guidance += 'your fabric is a bit denser than the target gauge.'
    } else {
      guidance += 'your fabric is noticeably denser than the target gauge.'
    }
  } else {
    // Looser (fewer sts/10cm)
    if (pct <= 5) {
      guidance += 'your fabric is slightly looser than the target gauge.'
    } else if (pct <= 10) {
      guidance += 'your fabric is a bit looser than the target gauge.'
    } else {
      guidance += 'your fabric is noticeably looser than the target gauge.'
    }
  }

  // Add adjustment suggestions
  if (diff !== 0) {
    guidance += " If that's the case, "
    if (diff > 0) {
      if (pct <= 5) {
        guidance +=
          'the difference is likely within blocking range, but you may want to try a slightly larger needle size.'
      } else if (pct <= 10) {
        guidance += 'try a slightly larger needle size to achieve the target gauge.'
      } else {
        guidance +=
          'try a larger needle size or consider different yarn to achieve the target gauge.'
      }
    } else {
      if (pct <= 5) {
        guidance +=
          'blocking may be sufficient, but you may want to try a slightly smaller needle size.'
      } else if (pct <= 10) {
        guidance += 'try a slightly smaller needle size to achieve the target gauge.'
      } else {
        guidance +=
          'try a smaller needle size or consider different yarn to achieve the target gauge.'
      }
    }
  }

  // Add important caveat
  guidance +=
    ' Please note that our estimated gauge is just an estimate, and it will depend on your personal knitting tension, which we can\'t factor into our calculation. As such, it\'s imperative to knit a <a href="https://elizabethsmithknits.com/techniques/what-is-a-gauge-swatch/" target="_blank" rel="noopener noreferrer">gauge swatch</a> before beginning work on the pattern.'

  return guidance
}
