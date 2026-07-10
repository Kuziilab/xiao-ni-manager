<template>
  <nav class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': tab.active }"
      @click="goTo(tab.path)"
    >
      <component :is="tab.icon" class="tab-bar__icon" :size="22" />
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

<style scoped>
.tab-bar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--color-text-secondary);
  transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
  padding: 4px 0;
}

.tab-bar__item--active {
  color: var(--color-pink);
}

.tab-bar__icon {
  width: 22px;
  height: 22px;
}

.tab-bar__label {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  padding: 2px 14px;
  border-radius: var(--radius-sm);
  border: 2px solid transparent;
  transition: all 0.15s;
  background: transparent;
}

.tab-bar__item--active .tab-bar__label {
  background: var(--color-pink-light);
  border-color: var(--color-pink);
  color: var(--color-pink-dark);
}
</style>
