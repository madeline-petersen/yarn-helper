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
        <table class="yarn-table">
          <caption class="sr-only">
            Compatible yarn suggestions by strand
          </caption>
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.label" scope="col">
                {{ col.label }} (target: {{ col.targetGauge }} sts/10cm)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in maxRows" :key="row">
              <td v-for="col in columns" :key="col.label">
                <template v-if="col.suggestions[row - 1]">
                  <strong>{{ col.suggestions[row - 1]?.name }}</strong>
                  <div>{{ col.suggestions[row - 1]?.gauge_sts_per_10cm }} sts/10cm</div>
                  <div>Score: {{ col.suggestions[row - 1]?.score }}</div>
                </template>
                <template v-else>—</template>
              </td>
            </tr>
          </tbody>
        </table>
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
import { computed, watchEffect, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import patterns from '@/data/patterns'
import yarns from '@/data/yarns'
import { useYarnSuggestions } from '@/composables/useYarnSuggestions'
import type { Pattern } from '@/types/domain'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const pattern = computed<Pattern | undefined>(() => patterns.find((p) => p.id === id.value))

// Yarn suggestions
const { columns, maxRows } = useYarnSuggestions(pattern, yarns, 5)

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
  max-width: 800px;
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
  margin-bottom: 1.5rem;
}

.yarn-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.yarn-table th {
  background: var(--color-background-mute);
  color: var(--color-heading);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.yarn-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.yarn-table td:last-child {
  border-right: none;
}

.yarn-table tr:last-child td {
  border-bottom: none;
}

.yarn-table strong {
  color: var(--color-heading);
  display: block;
  margin-bottom: 0.25rem;
}

.yarn-table div {
  color: var(--color-text);
  font-size: 0.875rem;
  margin-bottom: 0.125rem;
}

.yarn-table div:last-child {
  margin-bottom: 0;
  font-weight: 500;
  color: var(--color-text);
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

/* Responsive table */
@media (max-width: 768px) {
  .yarn-table {
    font-size: 0.875rem;
  }

  .yarn-table th,
  .yarn-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
