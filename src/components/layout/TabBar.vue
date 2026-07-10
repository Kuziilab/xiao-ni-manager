<template>
  <nav class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': tab.active }"
      @click="goTo(tab.path)"
    >
      <component :is="tab.icon" class="tab-bar__icon" :size="24" />
      <span class="tab-bar__label">{{ tab.label }}</span>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconWarehouse, IconNotes, IconAccounting, IconProfile } from '../../icons/index.js'

const route = useRoute()
const router = useRouter()

const tabs = computed(() => [
  { path: '/warehouse', label: '仓库', icon: IconWarehouse, active: route.path.startsWith('/warehouse') },
  { path: '/notes', label: '记事', icon: IconNotes, active: route.path.startsWith('/notes') },
  { path: '/accounting', label: '记账', icon: IconAccounting, active: route.path.startsWith('/accounting') },
  { path: '/profile', label: '我', icon: IconProfile, active: route.path.startsWith('/profile') }
])

function goTo(path) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>
