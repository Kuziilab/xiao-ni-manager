<template>
  <div id="app-root">
    <AppHeader :title="currentTitle" />
    <router-view v-slot="{ Component }">
      <transition name="page">
        <component :is="Component" />
      </transition>
    </router-view>
    <TabBar />
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import TabBar from './components/layout/TabBar.vue'
import Toast from './components/shared/Toast.vue'
import { useToast } from './composables/useToast.js'

const route = useRoute()
const currentTitle = computed(() => route.meta?.title || '小妮管家')

// Global toast state
const toast = useToast()
</script>

<style scoped>
#app-root {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  background: var(--color-bg);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
