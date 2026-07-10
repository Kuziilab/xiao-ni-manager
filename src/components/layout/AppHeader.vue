<template>
  <header class="app-header" :style="{ backgroundImage: `url(${bgImage})` }">
    <h1 class="app-header__title">{{ title }}</h1>
    <slot name="right" />
  </header>
</template>

<script setup>
const BASE = import.meta.env.BASE_URL
const bgImage = `${BASE}images/7.jpg`

defineProps({
  title: { type: String, default: '小妮管家' }
})
</script>
