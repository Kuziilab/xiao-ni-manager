<template>
  <div class="section-header">
    <slot>{{ title }}</slot>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' }
})
</script>
