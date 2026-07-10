<template>
  <div class="pills">
    <button
      class="pill"
      :class="{ 'pill--active': modelValue === '' }"
      @click="$emit('update:modelValue', '')"
    >
      全部
    </button>
    <button
      v-for="s in statuses"
      :key="s.value"
      class="pill"
      :class="{ 'pill--active': modelValue === s.value }"
      @click="$emit('update:modelValue', s.value)"
    >
      <span class="status-dot" :style="{ background: s.color }" />
      {{ s.label }}
    </button>
  </div>
</template>

<script setup>
import { PRODUCT_STATUS_LIST } from '../../utils/constants.js'

const statuses = PRODUCT_STATUS_LIST

defineProps({
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>
