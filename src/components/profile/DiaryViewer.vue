<template>
  <BottomSheet :modelValue="modelValue" :title="'日记 - ' + entry?.date" @update:modelValue="$emit('update:modelValue', $event)">
    <div v-if="entry">
      <p style="font-size: 15px; line-height: 1.8; white-space: pre-wrap; margin-bottom: 16px">
        {{ entry.content || '（无文字内容）' }}
      </p>
      <div v-if="entry.images?.length" style="display: flex; flex-direction: column; gap: 8px">
        <img
          v-for="(img, i) in entry.images"
          :key="i"
          :src="img"
          style="width: 100%; border-radius: 8px"
        />
      </div>
    </div>
  </BottomSheet>
</template>

<script setup>
import BottomSheet from '../shared/BottomSheet.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  entry: { type: Object, default: null }
})

defineEmits(['update:modelValue'])
</script>
