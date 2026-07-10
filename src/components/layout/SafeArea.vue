<template>
  <div :style="{ paddingTop: safeTop, paddingBottom: safeBottom }">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const safeTop = computed(() => 'env(safe-area-inset-top, 0px)')
const safeBottom = computed(() => 'env(safe-area-inset-bottom, 0px)')
</script>
