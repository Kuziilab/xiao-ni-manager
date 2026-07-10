<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <component :is="icon" :size="64" v-if="icon" />
      <IconBox v-else :size="64" />
    </div>
    <p class="empty-state__text">{{ message }}</p>
    <button v-if="action" class="btn btn--primary" style="margin-top: 16px" @click="$emit('action')">
      {{ action }}
    </button>
  </div>
</template>

<script setup>
import { IconBox } from '../../icons/index.js'

defineProps({
  message: { type: String, default: '暂无数据' },
  action: { type: String, default: '' },
  icon: { type: Object, default: null }
})

defineEmits(['action'])
</script>
