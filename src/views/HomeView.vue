<script setup lang="ts">
import { RouterLink } from 'vue-router'
import patterns from '@/data/patterns'
import type { Pattern } from '@/types/domain'

// Ensure the import matches the type at build time
const patternList = patterns as Pattern[]
</script>

<template>
  <section aria-labelledby="home-title" class="home">
    <header class="app-header">
      <h1 id="home-title">Yarn Helper</h1>
      <p class="app-description">
        Browse and explore knitting patterns with detailed information about yarn requirements,
        gauge, and techniques.
      </p>
    </header>

    <p v-if="!patternList.length" class="empty">No patterns yet.</p>

    <ul v-else class="patterns-list">
      <li v-for="pattern in patternList" :key="pattern.id" class="pattern-item">
        <RouterLink
          :to="`/pattern/${pattern.id}`"
          class="pattern-link"
          :aria-label="`Open ${pattern.name}`"
        >
          <div class="pattern-info">
            <h2 class="pattern-name">{{ pattern.name }}</h2>
            <p class="pattern-category">{{ pattern.category }}</p>
            <p class="pattern-details">
              {{ pattern.yarn_weight }} • {{ pattern.gauge_sts_per_10cm }} sts/10cm
            </p>
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.app-header h1 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.app-description {
  color: var(--color-text);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.home h2 {
  text-align: left;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.subtitle {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.patterns-list {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.pattern-item {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.pattern-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pattern-link {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 1.5rem;
}

.pattern-item:has(.pattern-link:focus-visible) {
  transform: translateY(-2px);
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.25);
}

.pattern-link:focus-visible {
  outline: none;
}

.pattern-info {
  padding: 0;
}

.pattern-category {
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
  font-weight: 500;
  text-transform: capitalize;
}

.pattern-details {
  margin: 0;
  color: var(--color-text);
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .patterns-list {
    max-width: 100%;
    gap: 0.75rem;
  }

  .home {
    padding: 1rem;
  }

  .pattern-link {
    padding: 1rem;
  }
}
</style>
