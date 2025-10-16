// Type-safe formatters for small display helpers
import type { Pattern } from '@/types/domain'

/**
 * Format gauge: e.g. 22 -> "22 sts per 10 cm"
 */
export function formatGauge(sts: number): string {
  return `${sts} sts per 10 cm`
}

/**
 * Format needle sizes:
 * - [3.0] → "3.0 mm"
 * - [2.5, 3.0] → "2.5–3.0 mm"
 * - [2.0, 2.5, 3.0] → "2.0–3.0 mm"
 * - [] → "—"
 */
export function formatNeedles(
  needles: number[],
  opts: { decimals?: number } = { decimals: 1 },
): string {
  if (!needles?.length) return '—'
  const uniq = Array.from(new Set(needles.map(Number))).sort((a, b) => a - b)
  const fmt = (n: number) => n.toFixed(opts.decimals ?? 1)

  if (uniq.length === 1) return `${fmt(uniq[0]!)} mm`
  return `${fmt(uniq[0]!)}–${fmt(uniq[uniq.length - 1]!)} mm`
}

/**
 * Capitalize a string:
 * - "cardigan" → "Cardigan"
 * - "sweater" → "Sweater"
 * - undefined → undefined
 */
export function capitalize(s: string | undefined): string | undefined {
  return s ? s[0]!.toUpperCase() + s.slice(1) : s
}

/**
 * Format held-together yarns:
 * - undefined → null
 * - [] → null
 * - [{weight: "DK"}] → "DK"
 * - [{weight: "DK", fiber_hint: "mohair"}] → "DK (mohair)"
 * - [{weight: "DK"}, {weight: "Lace"}] → "DK + Lace"
 */
export function formatHeldCombo(p: Pattern): string | null {
  if (!p.held_with?.length) return null
  const strands = p.held_with
    .map((s) => s.weight + (s.fiber_hint ? ` (${s.fiber_hint})` : ''))
    .filter(Boolean)
  return strands.length ? strands.join(' + ') : null
}

/**
 * Join strings into a sentence:
 * - [] → ""
 * - ["Hello"] → "Hello."
 * - ["Hello", "world"] → "Hello world."
 * - ["Hello!", "World"] → "Hello! World."
 */
export function sentenceJoin(parts: Array<string | null | undefined>): string {
  // join with spaces, trim duplicate whitespace, ensure terminal period
  const s = parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
  if (!s) return ''
  return /[.!?]$/.test(s) ? s : s + '.'
}
