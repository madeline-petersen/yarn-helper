<template>
  <div class="pattern-view">
    <div class="back-button">
      <RouterLink to="/" class="back-link" aria-label="Back to pattern list" rel="prev"
        >← Back to Patterns</RouterLink
      >
    </div>

    <div v-if="pattern">
      <h1 class="pattern-title">{{ pattern.name }}</h1>
      <p class="pattern-description">{{ describePatternNatural(pattern) }}</p>
      <div class="pattern-details">
        <div class="pattern-image">
          <figure>
            <img
              :src="pattern.photo_url"
              :alt="`${pattern.name} knitting pattern`"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              sizes="(min-width: 768px) 400px, 100vw"
              aria-describedby="pattern-figcap"
            />
            <figcaption id="pattern-figcap">
              {{ pattern.yarn_weight }} weight yarn • {{ formatGauge(pattern.gauge_sts_per_10cm) }}
            </figcaption>
          </figure>
        </div>
        <div class="pattern-info">
          <h2 id="details-h">Pattern Details</h2>
          <dl aria-labelledby="details-h">
            <dt>Category</dt>
            <dd>{{ capitalize(pattern.category) }}</dd>

            <dt>Yarn Weight</dt>
            <dd>{{ pattern.yarn_weight }}</dd>

            <dt>Gauge</dt>
            <dd>{{ formatGauge(pattern.gauge_sts_per_10cm) }}</dd>

            <dt>Required Yardage</dt>
            <dd>{{ pattern.required_yardage }} yards</dd>

            <dt>Needles</dt>
            <dd>{{ pattern.needles_mm ? formatNeedles(pattern.needles_mm) : '—' }}</dd>
          </dl>

          <div class="tags">
            <h3>Tags</h3>
            <ul class="tag-list" role="list">
              <li v-for="tag in pattern.tags" :key="tag" class="tag">{{ tag }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Yarn Suggestions -->
      <div v-if="columns.length > 0" class="yarn-suggestions">
        <h2>Compatible Yarn Suggestions</h2>
        <div class="selection-header">
          <p class="selection-guidance">
            {{
              columns.length === 1
                ? 'Select a yarn to see insights'
                : 'Select one yarn from each column to see insights'
            }}
          </p>
          <button
            v-if="Object.keys(selectedYarns).length > 0"
            @click="clearSelection"
            class="clear-all-link"
          >
            Clear all
          </button>
        </div>

        <div class="yarn-columns">
          <div v-for="col in columns" :key="col.label" class="yarn-column">
            <h3 :id="`col-${col.label}`">
              {{ col.label }} (target: {{ col.targetGauge }} sts/10cm)
            </h3>
            <div role="radiogroup" :aria-labelledby="`col-${col.label}`" class="yarn-options">
              <button
                v-for="suggestion in col.suggestions"
                :key="suggestion.id"
                type="button"
                class="yarn-option"
                :class="{
                  selected: selectedYarns[col.label]?.id === suggestion.id,
                  clickable: true,
                }"
                @click="selectYarn(col.label, suggestion)"
                role="radio"
                :aria-checked="selectedYarns[col.label]?.id === suggestion.id"
                :aria-label="`${suggestion.name}, ${suggestion.gauge_sts_per_10cm} sts per 10 cm, score ${suggestion.score}. Select for ${col.label}`"
              >
                <strong>{{ suggestion.name }}</strong>
                <div>
                  {{ suggestion.gauge_sts_per_10cm }} sts/10cm
                  <span v-if="suggestion.weight"> • {{ suggestion.weight }}</span>
                </div>
                <div class="yarn-yardage">{{ suggestion.yardage_per_skein }} yards per skein</div>
                <div>Compatibility Score: {{ suggestion.score }}</div>
              </button>
              <div v-if="col.suggestions.length === 0" class="empty-column">—</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selection status announcer -->
      <div id="selection-status" role="status" aria-live="polite" class="sr-only"></div>

      <!-- Yarn Selection Insights -->
      <div v-if="isSelectionComplete" id="yarn-insights" class="yarn-insights">
        <div class="insights-header">
          <h2 ref="insightsHeadingRef" tabindex="-1">🧶 Your Yarn Selection Insights 🧶</h2>
        </div>
        <div class="insights-content">
          <!-- Selected Strands -->
          <div v-if="isSelectionComplete" class="selected-strands">
            <div class="selected-yarns-grid">
              <div v-for="column in columns" :key="column.label" class="selected-yarn">
                <h3>{{ column.label }} (target: {{ column.targetGauge }} sts/10cm)</h3>
                <div class="yarn-details">
                  <strong>{{ selectedYarns[column.label]?.name }}</strong>
                  <div>
                    {{ selectedYarns[column.label]?.gauge_sts_per_10cm }} sts/10cm
                    <span v-if="selectedYarns[column.label]?.weight">
                      • {{ selectedYarns[column.label]?.weight }}</span
                    >
                  </div>
                  <div class="yarn-yardage">
                    {{ selectedYarns[column.label]?.yardage_per_skein }} yards per skein
                  </div>
                  <div>Compatibility Score: {{ selectedYarns[column.label]?.score }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Weight Analysis -->
          <div v-if="isSelectionComplete" class="weight-analysis">
            <h3>Weight Analysis</h3>
            <p>{{ weightInsight.headline }}</p>
            <p>{{ weightInsight.detail }}</p>
          </div>

          <!-- Gauge Insights -->
          <div v-if="gaugeInsights.length > 0" class="gauge-insights">
            <div v-for="g in gaugeInsights" :key="g.headline" class="gauge-analysis">
              <h3 class="compatibility-headline">Gauge Analysis</h3>

              <div class="gauge-summary">
                <div class="gauge-simulation">
                  <GaugePreviewSvg
                    :pattern="{
                      weightLabel: pattern?.yarn_weight || 'Unknown',
                      stsPer10: g.targetGauge,
                      needles: pattern?.needles_mm ? formatNeedles(pattern.needles_mm) : undefined,
                    }"
                    :combo="{
                      weightLabel: combinedWeightLabel,
                      stsPer10: g.combinedGauge,
                      needles: pattern?.needles_mm ? formatNeedles(pattern.needles_mm) : undefined,
                    }"
                    :scores="{
                      weight: 100,
                      gauge: Math.max(0, 100 - Math.abs(g.pct) * 2),
                      skeins: 100,
                      fiber: 100,
                    }"
                    :enable-demo="true"
                    :initial-needle="
                      pattern?.needles_mm ? formatNeedles(pattern.needles_mm) : '3.0mm'
                    "
                    :suggested-needle="
                      pattern?.needles_mm
                        ? formatNeedles(pattern.needles_mm).replace(/\d+\.?\d*/, (match) =>
                            (parseFloat(match) + 0.5).toFixed(1),
                          )
                        : '3.5mm'
                    "
                    :show-summary="true"
                    title="Gauge Comparison"
                    subtitle="Pattern target vs. your yarn selection"
                  />
                </div>

                <div class="swatch-guidance" v-html="g.swatchGuidance"></div>

                <p class="gauge-caveat">
                  Note: this is an estimate. Personal tension, stitch pattern, and blocking can all
                  affect results.
                </p>
              </div>
            </div>
          </div>

          <!-- Skein Analysis -->
          <div v-if="isSelectionComplete" class="skein-analysis">
            <h3>Skein Analysis</h3>
            <div v-if="skeinInsights.length > 0" class="skein-visualization">
              <div class="yardage-info">
                <div class="pattern-yardage">
                  <strong>Pattern requires:</strong> {{ pattern?.required_yardage }} yards
                  <span v-if="skeinInsights[0]?.isHeldTogether"> (per strand)</span>
                </div>
              </div>
              <div class="strands-container">
                <template v-for="insight in skeinInsights" :key="insight?.columnLabel || 'null'">
                  <div v-if="insight" class="skein-strand">
                    <div class="skein-content">
                      <div class="strand-label">{{ insight.columnLabel }}</div>
                      <div class="skein-details">
                        <strong>{{ insight.yarn.name }}</strong>
                        <div class="yarn-yardage">
                          {{ insight.yarn.yardage_per_skein }} yards per skein
                        </div>
                        <div class="skein-info">
                          {{ insight.skeinsNeeded }} skein{{
                            insight.skeinsNeeded === 1 ? '' : 's'
                          }}
                          needed
                          <div class="skein-count">
                            <span
                              v-for="n in Math.min(insight.skeinsNeeded, 10)"
                              :key="n"
                              class="skein-emoji"
                              >🧶</span
                            >
                            <span v-if="insight.skeinsNeeded > 10"
                              >+{{ insight.skeinsNeeded - 10 }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="skein-strand">
                    <div class="skein-content">
                      <div class="strand-label">No data available</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Fabric Analysis -->
          <div v-if="isSelectionComplete" class="fabric-analysis">
            <h3>Fabric Analysis</h3>
            <p>Fabric analysis coming soon...</p>
          </div>

          <div class="insights-summary">
            <h3>Summary</h3>

            <div v-if="isSelectionComplete" class="summary-content">
              <p v-if="summaryText" class="summary-text">{{ summaryText }}</p>
            </div>

            <!-- Gauge Status Indicator -->
            <div
              v-if="gaugeInsights.length > 0"
              class="gauge-status-indicator"
              :class="getGaugeStatusClass(avgCompatibilityScore)"
              :aria-label="getGaugeStatusLabel(avgCompatibilityScore)"
              :title="getGaugeStatusLabel(avgCompatibilityScore)"
              role="img"
            >
              {{ getGaugeStatusEmoji(avgCompatibilityScore) }}
            </div>
          </div>

          <div class="summary-actions">
            <button @click="clearSelection" class="clear-selection">Clear selection</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error" role="alert">
      <h1>Pattern Not Found</h1>
      <p>The requested pattern could not be found.</p>
      <router-link to="/">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatGauge, formatNeedles, capitalize } from '@/utils/formatters'
import { describePatternNatural } from '@/composables/describePatternNatural'
import { ref, computed, watchEffect, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import patterns from '@/data/patterns'
import yarns from '@/data/yarns'
import { useYarnSuggestions } from '@/composables/useYarnSuggestions'
import { useGaugeInsights } from '@/composables/useGaugeInsights'
import { useWeightInsights } from '@/composables/useWeightInsights'
import { useSkeinInsights } from '@/composables/useSkeinInsights'
import { describeSummaryNatural } from '@/composables/describeSummaryNatural'
import GaugePreviewSvg from '@/components/GaugePreviewSvg.vue'
import type { Pattern } from '@/types/domain'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const pattern = computed<Pattern | undefined>(() => patterns.find((p) => p.id === id.value))

// Yarn suggestions
const { columns } = useYarnSuggestions(pattern, yarns, 5)

// Yarn selection state
type Suggestion = {
  id: number
  name: string
  weight: string
  gauge_sts_per_10cm: number
  yardage_per_skein: number
  score: number
}
const selectedYarns = ref<Record<string, Suggestion | undefined>>({})
const { perColumn: gaugeInsights } = useGaugeInsights(pattern, selectedYarns)
const { weightInsight } = useWeightInsights(pattern, selectedYarns)
const { skeinInsights } = useSkeinInsights(pattern, selectedYarns)

// Calculate average compatibility score from selected yarns
const avgCompatibilityScore = computed(() => {
  if (!isSelectionComplete.value) return 0
  const scores = Object.values(selectedYarns.value)
    .filter(Boolean)
    .map((yarn) => yarn!.score)
  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
})

// Generate natural language summary
const summaryText = describeSummaryNatural(
  pattern,
  weightInsight,
  gaugeInsights,
  skeinInsights,
  avgCompatibilityScore,
)

// Gauge status indicator functions based on compatibility score
const getGaugeStatusEmoji = (score: number) => {
  if (score >= 90) return '✅'
  if (score >= 60) return '⚠️'
  return '❌'
}

const getGaugeStatusClass = (score: number) => {
  if (score >= 90) return 'gauge-excellent'
  if (score >= 60) return 'gauge-close'
  return 'gauge-poor'
}

const getGaugeStatusLabel = (score: number) => {
  if (score >= 90) return 'Excellent gauge compatibility'
  if (score >= 60) return 'Good gauge compatibility'
  return 'Poor gauge compatibility'
}

// Extract the combined weight from the weight insight for display
const combinedWeightLabel = computed(() => {
  if (!weightInsight.value?.headline) return 'Combined Yarns'
  const match = weightInsight.value.headline.match(/= ([^—]+)/)
  return match ? match[1]!.trim() : 'Combined Yarns'
})

const isSelectionComplete = computed(
  () => columns.value.length > 0 && columns.value.every((col) => !!selectedYarns.value[col.label]),
)

function selectYarn(columnLabel: string, yarn: Suggestion) {
  selectedYarns.value[columnLabel] = yarn
  const status = document.getElementById('selection-status')
  if (status) status.textContent = `Selected ${yarn.name} for ${columnLabel}.`
}

function clearSelection() {
  selectedYarns.value = {}
  const status = document.getElementById('selection-status')
  if (status) status.textContent = 'Selection cleared.'
}

const insightsHeadingRef = ref<HTMLElement | null>(null)

watchEffect(async () => {
  if (isSelectionComplete.value) {
    await nextTick()
    const el = document.getElementById('yarn-insights')
    if (el) {
      // Smooth scroll to the insights section
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })

      // Wait for scroll to complete before focusing
      setTimeout(() => {
        insightsHeadingRef.value?.focus()
        const status = document.getElementById('selection-status')
        if (status) status.textContent = 'Selection complete.'
      }, 500) // Wait 500ms for smooth scroll to complete
    }
  }
})

// Store default title and update when pattern changes
const defaultTitle = document.title
watchEffect(() => {
  if (pattern.value) {
    document.title = `${pattern.value.name} · Yarn Helper`
  }
})

// Restore default title on unmount
onUnmounted(() => {
  document.title = defaultTitle
})
</script>

<style scoped>
.pattern-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  transition: all 0.2s ease;
}

.back-link:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.back-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.25);
  transform: translateY(-1px);
}

.pattern-title {
  color: var(--color-heading);
  margin-bottom: 1rem;
  text-align: left;
}

.pattern-description {
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
}

.pattern-image {
  text-align: center;
  width: 400px;
  height: 500px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--color-background-mute);
  flex-shrink: 0;
}

.pattern-image img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pattern-info {
  background: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.pattern-info h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.pattern-info p {
  margin: 0.5rem 0;
  color: var(--color-text);
}

.pattern-info dt {
  font-weight: 600;
  color: var(--color-heading);
  text-align: left;
}

.pattern-info dd {
  margin: 0;
  color: var(--color-text);
}

.pattern-info dd {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
}

.tags {
  margin-top: 1.5rem;
}

.tags h3 {
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.tag-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
}

.error {
  text-align: center;
  padding: 2rem;
}

.error h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.error a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}

.error a:hover {
  text-decoration: underline;
}

/* Pattern layout: stacked by default */
.pattern-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: start;
}

.pattern-image {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  height: auto;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 8px;
  background: var(--color-background-mute);
  flex-shrink: 0;
}

.pattern-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Details list: stacked terms/values by default */
.pattern-info dl {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  margin: 0;
}

.pattern-info dt {
  margin-top: 0.5rem;
  font-weight: 600;
}

.pattern-info dd {
  margin: 0 0 0.5rem 0;
}

.pattern-info dd + dt {
  padding-top: 0.5rem;
}

/* At small screens, switch the dl to a neat two-column grid */
@media (min-width: 640px) {
  .pattern-info dl {
    grid-template-columns: max-content 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;
  }

  .pattern-info dt {
    margin-top: 0;
    border-top: 0;
    padding-top: 0;
  }

  .pattern-info dd {
    margin: 0;
  }

  .pattern-info dd + dt {
    border-top: 0;
    padding-top: 0;
  }
}

/* At medium screens, lay image + info side-by-side */
@media (min-width: 768px) {
  .pattern-details {
    flex-direction: row;
    align-items: start;
  }

  .pattern-image {
    width: 400px;
    margin: 0;
  }
}

/* Yarn Suggestions */
.yarn-suggestions {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.yarn-suggestions h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
}

.selection-guidance {
  color: var(--color-text);
  margin: 0;
  text-align: left;
}

.clear-all-link {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.clear-all-link:hover {
  color: var(--color-heading);
}

/* Yarn columns layout */
.yarn-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, 1fr);
  gap: 1.5rem;
  background: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.yarn-column h3 {
  color: var(--color-heading);
  font-size: 1rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.yarn-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-column {
  text-align: center;
  padding: 1rem;
  color: var(--color-text);
  background: var(--color-background-mute);
  border-radius: 8px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Yarn selection buttons */
.yarn-option {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
}

@media (max-width: 320px) {
  .yarn-option {
    padding: 0.75rem;
  }
}

.yarn-option:hover {
  border-color: var(--color-border-hover);
  background: var(--color-background-soft);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.yarn-option:focus-visible {
  outline: none;
  border-color: var(--color-border-hover);
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.25);
}

.yarn-option.selected {
  border-color: var(--color-text);
  background: var(--color-background-mute);
  box-shadow: 0 0 0 2px rgba(0, 95, 204, 0.2);
}

.yarn-option strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-heading);
}

.yarn-option div {
  color: var(--color-text);
  font-size: 0.875rem;
  margin-bottom: 0.125rem;
}

/* Yarn insights section */
.yarn-insights {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  scroll-margin-top: 2rem;
}

.insights-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.insights-header h2 {
  color: var(--color-heading);
  margin: 0;
  text-align: center;
}

.insights-header h2:focus {
  outline: none;
}

.clear-selection {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-selection:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.insights-content {
  display: grid;
  gap: 1.5rem;
}

.selected-strands {
  background: var(--color-background-soft);
  border-radius: 8px;
}

.selected-yarns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 1fr);
  gap: 1.5rem;
}

.selected-yarn {
  padding: 1rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.selected-yarn h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1rem;
}

.yarn-details strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-heading);
}

.yarn-details div {
  color: var(--color-text);
  font-size: 0.875rem;
  margin-bottom: 0.125rem;
}

.gauge-insights {
  padding: 1rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.compatibility-headline {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.swatch-guidance {
  margin: 0.75rem 0 1rem 0;
  color: var(--color-text);
  font-size: 0.9rem;
  line-height: 1.5;
  font-weight: normal;
}

.weight-analysis {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.weight-analysis h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.weight-analysis p {
  margin: 0;
  color: var(--color-text);
  font-size: 0.95rem;
}

.weight-analysis p + p {
  margin-top: 0.5rem;
}

.fabric-analysis {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.fabric-analysis h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.fabric-analysis p {
  margin: 0;
  color: var(--color-text);
  font-size: 0.95rem;
}

.skein-analysis {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.skein-analysis h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.skein-analysis p {
  margin: 0;
  color: var(--color-text);
  font-size: 0.95rem;
}

.skein-visualization {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.strands-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
}

.skein-strand {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-background-soft);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  flex: 1;
}

.skein-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.strand-label {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.9rem;
}

.skein-count {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.skein-emoji {
  font-size: 1.2rem;
}

.skein-details {
  flex: 1;
  font-size: 0.9rem;
}

.skein-details strong {
  display: block;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.skein-details div {
  color: var(--color-text-mute);
  font-size: 0.85rem;
}

.skein-info {
  margin-top: 0.25rem;
  font-weight: 500;
  color: var(--color-text) !important;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pattern-yardage {
  font-size: 0.9rem;
  color: var(--color-text);
}

.yarn-yardage {
  color: var(--color-text-mute);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.gauge-simulation {
  margin: 1rem 0;
}

.gauge-caveat {
  margin: 1rem 0 0 0;
  color: var(--color-text-mute);
  font-size: 0.9rem;
  font-style: normal;
  opacity: 0.8;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
}

.insights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.insights-list li {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: var(--color-background-soft);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.insights-list li:last-child {
  margin-bottom: 0;
}

.insights-list strong {
  color: var(--color-heading);
  display: block;
  margin-bottom: 0.25rem;
}

.insights-list span {
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.4;
}

.insights-summary {
  position: relative;
  padding: 1rem 1rem 3rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.insights-summary h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.insights-summary p {
  margin: 0;
  color: var(--color-text);
  line-height: 1.5;
}

.summary-content {
  margin: 1rem 0;
}

.summary-text {
  margin: 0 0 1rem 0;
  color: var(--color-text);
  line-height: 1.6;
  font-size: 1rem;
}

.gauge-status-indicator {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 50%;
  transition: opacity 0.2s ease;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
}

/* Responsive layout */
@media (max-width: 768px) {
  .yarn-insights {
    padding: 1.5rem;
  }

  .yarn-columns {
    grid-template-columns: 1fr;
  }

  .selected-yarns-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .skein-strand {
    flex: 1 1 100%;
  }
}
</style>
