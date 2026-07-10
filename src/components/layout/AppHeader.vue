<template>
  <header class="app-header">
    <h1 class="app-header__title">{{ title }}</h1>
    <slot name="right" />
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: '小妮管家' }
})
</script>
