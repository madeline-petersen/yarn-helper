import type { YarnWeight } from '@/types/domain'

export interface YarnWeightInfo {
  gauge: readonly [number, number] // sts per 10 cm
  needle: readonly [number, number] // mm
}

export const YARN_WEIGHT_INFO = {
  Lace: { gauge: [32, 34], needle: [1.5, 2.5] },
  'Light Fingering': { gauge: [28, 30], needle: [2.0, 3.0] },
  Fingering: { gauge: [26, 28], needle: [2.25, 3.25] },
  Sport: { gauge: [24, 26], needle: [3.0, 3.5] },
  DK: { gauge: [22, 24], needle: [3.75, 4.5] },
  Worsted: { gauge: [19, 21], needle: [4.5, 5.0] },
  Aran: { gauge: [17, 19], needle: [5.0, 5.5] },
  Bulky: { gauge: [14, 15], needle: [6.0, 8.0] },
  'Super Bulky': { gauge: [7, 12], needle: [8.0, 12.0] },
} satisfies Record<YarnWeight, YarnWeightInfo>
