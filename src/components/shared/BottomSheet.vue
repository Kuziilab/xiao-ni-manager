<template>
  <teleport to="body">
    <div v-if="modelValue" class="sheet-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="sheet" :style="{ maxHeight: maxHeight }">
        <div class="sheet__handle" />
        <div v-if="title" class="sheet__header">{{ title }}</div>
        <div class="sheet__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="sheet__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  maxHeight: { type: String, default: '85vh' }
})

defineEmits(['update:modelValue'])
</script>
