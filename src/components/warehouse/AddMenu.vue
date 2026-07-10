<template>
  <BottomSheet :modelValue="modelValue" title="录入" @update:modelValue="$emit('update:modelValue', $event)">
    <div style="display: flex; flex-direction: column; gap: 0">
      <button class="list-item" @click="$emit('new-product')">
        <div class="list-item__icon" style="background: var(--color-pink-light)">
          <IconTag :size="20" />
        </div>
        <span class="list-item__title">新商品</span>
        <IconArrowRight class="list-item__arrow" />
      </button>
      <button class="list-item" @click="$emit('new-category')">
        <div class="list-item__icon" style="background: var(--color-pink-light)">
          <IconFolder :size="20" />
        </div>
        <span class="list-item__title">新分类</span>
        <IconArrowRight class="list-item__arrow" />
      </button>
    </div>
  </BottomSheet>
</template>

<script setup>
import BottomSheet from '../shared/BottomSheet.vue'
import { IconTag, IconFolder, IconArrowRight } from '../../icons/index.js'

defineProps({
  modelValue: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'new-product', 'new-category'])
</script>
