<template>
  <nav class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': tab.active }"
      @click="goTo(tab.path)"
    >
      <img :src="tab.img" class="tab-bar__img" :alt="tab.label" />
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const BASE = import.meta.env.BASE_URL
const route = useRoute()
const router = useRouter()

const tabs = computed(() => [
  { path: '/warehouse', label: '仓库', img: `${BASE}images/1.jpg`, active: route.path.startsWith('/warehouse') },
  { path: '/notes', label: '记事', img: `${BASE}images/2.jpg`, active: route.path.startsWith('/notes') },
  { path: '/accounting', label: '记账', img: `${BASE}images/3.jpg`, active: route.path.startsWith('/accounting') },
  { path: '/profile', label: '我', img: `${BASE}images/4.jpg`, active: route.path.startsWith('/profile') }
])

function goTo(path) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.tab-bar__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  transition: opacity 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.tab-bar__item--active {
  opacity: 1;
}

.tab-bar__item:not(.tab-bar__item--active) {
  opacity: 0.55;
}

.tab-bar__img {
  height: 38px;
  width: auto;
  max-width: 90%;
  object-fit: contain;
}
</style>
