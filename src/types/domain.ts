export type YarnWeight =
  | 'Lace'
  | 'Light Fingering'
  | 'Fingering'
  | 'Sport'
  | 'DK'
  | 'Worsted'
  | 'Aran'
  | 'Bulky'
  | 'Super Bulky'

export interface HeldStrand {
  label: string
  weight: YarnWeight
  gauge_sts_per_10cm: number
  fiber_hint?: string
}

export interface Pattern {
  id: number
  name: string
  category: string
  yarn_weight: YarnWeight
  gauge_sts_per_10cm: number
  required_yardage: number
  needles_mm: number[]
  tags: string[]
  photo_url: string
  held_with: HeldStrand[]
}

export interface Fiber {
  name: string
  percent: number
}

export interface Yarn {
  id: number
  name: string
  weight: YarnWeight
  gauge_sts_per_10cm: number
  yardage_per_skein: number
  grams_per_skein: number
  fibers: Fiber[]
}
