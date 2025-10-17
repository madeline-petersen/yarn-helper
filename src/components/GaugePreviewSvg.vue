<!-- AI-assisted: SVG gauge swatch visualization
     Displays pattern vs user combo gauge grids for visual comparison -->
<template>
  <div class="gauge-preview-svg">
    <div v-if="title || subtitle" class="header">
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-grids">
        <div class="skeleton-grid"></div>
        <div class="skeleton-grid"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isValid" class="empty-state">
      <p>Pick one yarn per strand to preview the gauge.</p>
    </div>

    <!-- Main Visualization -->
    <div v-else class="visualization">
      <!-- Gauge Swatches -->
      <div class="gauge-grids">
        <div class="gauge-column">
          <h4>Pattern Target</h4>
          <svg
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid meet"
            class="gauge-svg"
            role="img"
            :aria-label="`Pattern ${pattern.weightLabel}, ${patternCols} sts × ${patternRows} rows / 10 cm`"
            data-testid="swatch-pattern"
          >
            <title>
              Pattern: {{ pattern.weightLabel }}, {{ patternCols }} sts × {{ patternRows }} rows /
              10 cm
            </title>
            <defs>
              <clipPath id="patternClip">
                <rect x="0" y="0" width="200" height="200" rx="8" ry="8" />
              </clipPath>
            </defs>
            <rect x="0" y="0" width="200" height="200" rx="8" ry="8" fill="#fff" stroke="#e9ecef" />
            <g clip-path="url(#patternClip)">
              <g v-for="r in patternRows" :key="`pr-${r}`">
                <rect
                  v-for="c in patternCols"
                  :key="`pr-${r}-pc-${c}`"
                  :x="(c - 1) * patternCellW"
                  :y="(r - 1) * patternCellH"
                  :width="patternCellW"
                  :height="patternCellH"
                  :rx="Math.min(patternCellW, patternCellH) * 0.15"
                  :ry="Math.min(patternCellW, patternCellH) * 0.15"
                  fill="var(--color-accent)"
                  class="stitch"
                />
              </g>
            </g>
            <!-- ticks -->
            <g stroke="#adb5bd" stroke-width="0.8">
              <!-- top ticks -->
              <line v-for="c in 10" :key="`pt-${c}`" :x1="c * 20" y1="0" :x2="c * 20" y2="6" />
              <!-- left ticks -->
              <line v-for="r in 10" :key="`pl-${r}`" x1="0" :y1="r * 20" x2="6" :y2="r * 20" />
            </g>
            <text x="100" y="-6" text-anchor="middle" fill="#6c757d">10 cm</text>
          </svg>
          <div class="gauge-info">
            <div class="weight">{{ pattern.weightLabel }}</div>
            <div class="gauge">
              {{ patternCols }} sts × {{ patternRows }} rows / 10 cm
              <span v-if="patternRowsEstimated" class="est">(est.)</span>
            </div>
          </div>
        </div>

        <div class="gauge-column">
          <h4>Your Selection</h4>
          <svg
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid meet"
            class="gauge-svg"
            role="img"
            :aria-label="`Combo ${combo.weightLabel}, ${comboCols} sts × ${comboRows} rows / 10 cm`"
            data-testid="swatch-combo"
          >
            <title>
              Combo: {{ combo.weightLabel }}, {{ comboCols }} sts × {{ comboRows }} rows / 10 cm
            </title>
            <defs>
              <clipPath id="comboClip">
                <rect x="0" y="0" width="200" height="200" rx="8" ry="8" />
              </clipPath>
            </defs>
            <rect x="0" y="0" width="200" height="200" rx="8" ry="8" fill="#fff" stroke="#e9ecef" />
            <g clip-path="url(#comboClip)">
              <g v-for="r in comboRows" :key="`cr-${r}`">
                <rect
                  v-for="c in comboCols"
                  :key="`cr-${r}-cc-${c}`"
                  :x="(c - 1) * comboCellW"
                  :y="(r - 1) * comboCellH"
                  :width="comboCellW"
                  :height="comboCellH"
                  :rx="Math.min(comboCellW, comboCellH) * 0.15"
                  :ry="Math.min(comboCellW, comboCellH) * 0.15"
                  fill="#28a745"
                  class="stitch"
                />
              </g>
            </g>
            <!-- ticks -->
            <g stroke="#adb5bd" stroke-width="0.8">
              <line v-for="c in 10" :key="`ct-${c}`" :x1="c * 20" y1="0" :x2="c * 20" y2="6" />
              <line v-for="r in 10" :key="`cl-${r}`" x1="0" :y1="r * 20" x2="6" :y2="r * 20" />
            </g>
            <text x="100" y="-6" text-anchor="middle" fill="#6c757d">10 cm</text>
          </svg>
          <div class="gauge-info">
            <div class="weight">{{ combo.weightLabel }}</div>
            <div class="gauge">
              {{ comboCols }} sts × {{ comboRows }} rows / 10 cm
              <span v-if="comboRowsEstimated" class="est">(est.)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type GaugeSide = {
  weightLabel: string
  stsPer10: number
  rowsPer10?: number
  needles?: string
}

interface Props {
  pattern: GaugeSide
  combo: GaugeSide
  scores: {
    weight: number
    gauge: number
    skeins: number
    fiber: number
  }
  title?: string
  subtitle?: string
  loading?: boolean
  enableDemo?: boolean
  initialNeedle?: string
  suggestedNeedle?: string
  showSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  enableDemo: false,
  showSummary: true,
})

// Row estimation heuristics
const estimateRows = (sts: number, weight: string | undefined) => {
  if (!isFinite(sts) || sts <= 0) return 0
  const byWeight: Record<string, number> = {
    Lace: 36,
    Fingering: 34,
    Sport: 30,
    DK: 28,
    Worsted: 26,
    Aran: 24,
    Bulky: 18,
    'Super Bulky': 12,
  }
  return Math.round(byWeight[weight ?? ''] ?? sts * 1.3)
}

// Pattern side computed values
const patternCols = computed(() => Math.max(1, Math.round(props.pattern.stsPer10)))
const patternRowsRaw = computed(
  () => props.pattern.rowsPer10 ?? estimateRows(props.pattern.stsPer10, props.pattern.weightLabel),
)
const patternRows = computed(() => Math.max(1, Math.round(patternRowsRaw.value)))
const patternRowsEstimated = computed(() => props.pattern.rowsPer10 == null)
const patternCellW = computed(() => 200 / patternCols.value)
const patternCellH = computed(() => 200 / patternRows.value)

// Combo side computed values
const comboCols = computed(() => Math.max(1, Math.round(props.combo.stsPer10)))
const comboRowsRaw = computed(
  () => props.combo.rowsPer10 ?? estimateRows(props.combo.stsPer10, props.combo.weightLabel),
)
const comboRows = computed(() => Math.max(1, Math.round(comboRowsRaw.value)))
const comboRowsEstimated = computed(() => props.combo.rowsPer10 == null)
const comboCellW = computed(() => 200 / comboCols.value)
const comboCellH = computed(() => 200 / comboRows.value)

// Validation
const isValid = computed(() => {
  return (
    !isNaN(props.pattern.stsPer10) &&
    !isNaN(props.combo.stsPer10) &&
    props.pattern.stsPer10 > 0 &&
    props.combo.stsPer10 > 0 &&
    props.pattern.weightLabel &&
    props.combo.weightLabel
  )
})

// Check for reduced motion preference
const prefersReducedMotion = ref(false)

onMounted(async () => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<style scoped>
.gauge-preview-svg {
  padding: 1.5rem;
}

.header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.header h3 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 1.2rem;
}

.subtitle {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Loading State */
.loading-state {
  text-align: center;
}

.skeleton-grids {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.skeleton-grid {
  width: 200px;
  height: 200px;
  background: #e9ecef;
  border-radius: 8px;
  margin: 0 auto;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

/* Main Visualization */
.visualization {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.gauge-grids {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  justify-items: center;
  align-items: start;
}

.gauge-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.gauge-column h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gauge-svg {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
}

.stitch {
  transition: opacity 0.2s ease;
}

.stitch:hover {
  opacity: 0.8;
}

.gauge-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.gauge-info .weight {
  font-weight: 600;
  color: var(--color-accent);
}

.gauge-info .gauge {
  color: #495057;
}

.gauge-info .est {
  color: #6c757d;
  font-size: 0.8em;
  margin-left: 4px;
}

.est-note {
  margin: 0;
  text-align: center;
  color: #6c757d;
  font-size: 0.85rem;
}

.gauge-context-explanation {
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--color-accent, #6c757d);
}

.gauge-context-explanation h5 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
}

.gauge-context-explanation p {
  margin: 0 0 1rem 0;
  color: #495057;
  line-height: 1.6;
  font-size: 0.95rem;
}

.gauge-context-explanation p:last-child {
  margin-bottom: 0;
}

.gauge-info .needles {
  color: #6c757d;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .stitch {
    transition: none;
  }
}

/* Disclaimer */
.disclaimer {
  text-align: center;
  margin-top: 1.5rem;
}

.disclaimer p {
  margin: 0;
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .gauge-grids {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .gauge-svg {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .gauge-preview-svg {
    padding: 1rem;
  }

  .gauge-svg {
    width: 120px;
    height: 120px;
  }
}
</style>
