<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main">
    <RouterView />
  </main>
</template>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  padding: 0.5rem 0.75rem;
  background: #fff;
  color: #000;
  border: 2px solid #005fcc;
  border-radius: 6px;
  z-index: 1000;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
  outline: none;
}
</style>
