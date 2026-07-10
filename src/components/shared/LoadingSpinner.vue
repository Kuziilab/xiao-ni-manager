<template>
  <div class="loading-spinner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      style="animation: spin 1s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <span v-if="text" style="margin-left: 8px; font-size: 14px">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' }
})
</script>
