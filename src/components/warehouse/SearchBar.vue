<template>
  <div class="search-bar">
    <div class="search-bar__wrapper">
      <IconSearch class="search-bar__icon" />
      <input
        class="search-bar__input"
        type="search"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <!-- Suggestions -->
    <div v-if="suggestions.length && modelValue" style="padding: 8px 0">
      <div
        v-for="(s, i) in suggestions"
        :key="i"
        style="padding: 8px 16px; font-size: 14px; cursor: pointer"
        @click="$emit('update:modelValue', s)"
      >
        {{ s }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from '../../icons/index.js'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '搜索' },
  suggestions: { type: Array, default: () => [] }
})

defineEmits(['update:modelValue'])
</script>
