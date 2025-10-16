import type { Pattern } from '@/types/domain'

const patterns = [
  {
    id: 1,
    name: 'Agnete Cardigan',
    category: 'cardigan',
    yarn_weight: 'DK',
    gauge_sts_per_10cm: 19,
    required_yardage: 1378,
    needles_mm: [2.5, 3.0],
    tags: [
      'top-down',
      'brioche',
      'unisex',
      'positive-ease',
      'short-rows',
      'worked-flat',
      'written-pattern',
    ],
    photo_url:
      'https://images4-g-cdn.ravelrycache.com/uploads/PetiteKnitDK/947662054/agnete_tversted_medium.jpeg',
    held_with: [
      { label: 'main strand', weight: 'Fingering', gauge_sts_per_10cm: 26 },
      {
        label: 'carry strand',
        weight: 'Lace',
        gauge_sts_per_10cm: 28,
        fiber_hint: 'mohair',
      },
    ],
  },
  {
    id: 2,
    name: 'Barbara Balaclava',
    category: 'balaclava',
    yarn_weight: 'Sport',
    gauge_sts_per_10cm: 24,
    required_yardage: 328,
    needles_mm: [2.0, 2.5, 3.0],
    tags: ['adult', 'female', 'male', 'top-down', 'unisex', 'written-pattern'],
    photo_url:
      'https://images4-g-cdn.ravelrycache.com/uploads/PetiteKnitDK/1049402498/barbara_balaclava_badstuerock_medium.jpg',
    held_with: [
      {
        label: 'main strand',
        weight: 'Fingering',
        gauge_sts_per_10cm: 28,
      },
      {
        label: 'carry strand',
        weight: 'Lace',
        gauge_sts_per_10cm: 32,
        fiber_hint: 'mohair',
      },
    ],
  },
  {
    id: 3,
    name: 'Celeste Mittens',
    category: 'mittens',
    yarn_weight: 'DK',
    gauge_sts_per_10cm: 22,
    required_yardage: 227,
    needles_mm: [3.0, 3.5, 4.0],
    tags: ['adult', 'child', 'in-the-round', 'stranded', 'written-pattern', 'chart'],
    photo_url:
      'https://images4-g-cdn.ravelrycache.com/uploads/PetiteKnitDK/1027460867/celeste_vanter_thy_medium.jpg',
    held_with: [
      {
        label: 'main strand',
        weight: 'DK',
        gauge_sts_per_10cm: 22,
      },
    ],
  },
  {
    id: 4,
    name: 'Dagmar Jacket',
    category: 'cardigan',
    yarn_weight: 'Aran',
    gauge_sts_per_10cm: 18,
    required_yardage: 1804,
    needles_mm: [3.5, 4.0, 4.5],
    tags: [
      'adult',
      'buttoned',
      'cables',
      'crew-neck',
      'drop-sleeve',
      'male',
      'oversized',
      'positive-ease',
      'textured',
      'top-down',
      'unisex',
      'written-pattern',
    ],
    photo_url:
      'https://images4-g-cdn.ravelrycache.com/uploads/PetiteKnitDK/1053678804/dagmar_jacket_i_sevilla2_medium.jpg',
    held_with: [
      {
        label: 'main strand',
        weight: 'Aran',
        gauge_sts_per_10cm: 18,
      },
    ],
  },
] satisfies Pattern[]

export default patterns
