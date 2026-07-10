<template>
  <BottomSheet :modelValue="modelValue" title="选择日期" @update:modelValue="$emit('update:modelValue', $event)">
    <div style="text-align: center; padding: 8px 0">
      <input
        type="date"
        :value="modelValue"
        @change="$emit('select', $event.target.value)"
        style="font-size: 18px; padding: 12px; width: 100%; border: 1px solid var(--color-separator); border-radius: var(--radius-sm); text-align: center"
      />
    </div>
  </BottomSheet>
</template>

<script setup>
import BottomSheet from './BottomSheet.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  date: { type: String, default: '' }
})

defineEmits(['update:modelValue', 'select'])
</script>
