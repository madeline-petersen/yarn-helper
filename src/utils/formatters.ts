// Type-safe formatters for small display helpers

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
