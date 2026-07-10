<template>
  <div class="list-item" :style="goal.completed ? { opacity: 0.5, textDecoration: 'line-through' } : {}">
    <div class="list-item__icon" style="background: var(--color-pink-light)">
      <IconStar :size="20" />
    </div>
    <div class="list-item__content">
      <div class="list-item__title">{{ goal.name }}</div>
      <div v-if="goal.time || goal.location" class="list-item__subtitle">
        <span v-if="goal.time">🕐 {{ goal.time }}</span>
        <span v-if="goal.location" style="margin-left: 8px">📍 {{ goal.location }}</span>
      </div>
    </div>
    <div style="display: flex; gap: 8px; flex-shrink: 0">
      <button
        v-if="!goal.completed"
        class="btn btn--text"
        style="padding: 4px 8px; font-size: 12px; color: var(--color-success)"
        @click="$emit('toggle')"
      >
        完成
      </button>
      <button
        class="btn btn--text"
        style="padding: 4px 8px; font-size: 12px; color: var(--color-text-hint)"
        @click="$emit('cancel')"
      >
        取消
      </button>
    </div>
  </div>
</template>

<script setup>
import { IconStar } from '../../icons/index.js'

defineProps({
  goal: { type: Object, required: true }
})

defineEmits(['toggle', 'cancel', 'delete'])
</script>
