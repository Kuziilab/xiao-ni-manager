<template>
  <teleport to="body">
    <div v-if="visible" class="toast" :class="'toast--' + type">
      {{ message }}
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' },
  type: { type: String, default: 'info' }
})
</script>
