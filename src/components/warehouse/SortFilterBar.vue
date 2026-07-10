<template>
  <div style="display: flex; gap: 8px; padding: 8px 16px; background: var(--color-surface); border-bottom: 0.5px solid var(--color-separator)">
    <button
      v-for="opt in sortOptions"
      :key="opt.field"
      class="btn btn--ghost"
      style="flex: 1; font-size: 12px; min-height: 28px; padding: 4px 8px"
      :style="modelValue.field === opt.field ? { color: 'var(--color-pink)', background: 'var(--color-pink-light)' } : {}"
      @click="toggleSort(opt.field)"
    >
      {{ opt.label }}
      <span v-if="modelValue.field === opt.field" style="margin-left: 2px; font-size: 10px">
        {{ modelValue.order === 'asc' ? '↑' : '↓' }}
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Object, default: () => ({ field: 'updatedAt', order: 'desc' }) }
})

const emit = defineEmits(['update:modelValue'])

const sortOptions = [
  { field: 'updatedAt', label: '时间' },
  { field: 'sellingPrice', label: '价格' },
  { field: 'name', label: '名称' }
]

function toggleSort(field) {
  // Don't need to access modelValue here — emit the new value based on current
  emit('toggle', field)
}
</script>
