<template>
  <div class="empty-state">
    <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🐣</div>
    <p class="empty-state__text">{{ message }}</p>
    <button v-if="action" class="btn btn--cute" style="margin-top: 16px" @click="$emit('action')">
      {{ action }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '暂无数据' },
  action: { type: String, default: '' }
})

defineEmits(['action'])
</script>
