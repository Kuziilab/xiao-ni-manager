<template>
  <div class="list-item" :style="goal.completed ? { opacity: 0.5 } : {}">
    <div class="list-item__icon" style="background: var(--color-pink-light); border-radius: var(--radius-full)">
      <IconStar :size="18" />
    </div>
    <div class="list-item__content">
      <div class="list-item__title" :style="goal.completed ? { textDecoration: 'line-through' } : {}">{{ goal.name }}</div>
      <div v-if="goal.time || goal.location" class="list-item__subtitle">
        <span v-if="goal.time">🕐 {{ goal.time }}</span>
        <span v-if="goal.location" style="margin-left: 8px">📍 {{ goal.location }}</span>
      </div>
    </div>
    <div style="display: flex; gap: 6px; flex-shrink: 0">
      <button
        v-if="!goal.completed"
        class="btn btn--text"
        style="padding: 4px 10px; font-size: 12px; color: var(--color-success)"
        @click="$emit('toggle')"
      >
        <IconCheck :size="14" style="margin-right:2px" />
        完成
      </button>
      <button
        class="btn btn--text"
        style="padding: 4px 10px; font-size: 12px; color: var(--color-text-hint)"
        @click="$emit('cancel')"
      >
        <IconClose :size="12" style="margin-right:2px" />
        取消
      </button>
    </div>
  </div>
</template>

<script setup>
import { IconStar, IconCheck, IconClose } from '../../icons/index.js'

defineProps({
  goal: { type: Object, required: true }
})

defineEmits(['toggle', 'cancel', 'delete'])
</script>
