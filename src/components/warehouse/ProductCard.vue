<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-card__image">
      <img v-if="product.imageBase64" :src="product.imageBase64" style="width:100%;height:100%;object-fit:cover" alt="" />
      <IconImage v-else :size="48" style="opacity: 0.3" />
    </div>
    <div class="product-card__body">
      <div class="product-card__name">{{ product.name }}</div>
      <div class="product-card__price">¥{{ product.sellingPrice }}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px">
        <span class="product-card__meta">
          <span class="status-dot" :style="{ background: statusInfo.color }" />
          {{ statusInfo.label }}
        </span>
        <button style="padding:2px 8px;font-size:12px;color:var(--color-text-secondary)" @click.stop="$emit('manage')">
          <IconMore :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconImage, IconMore } from '../../icons/index.js'
import { PRODUCT_STATUS } from '../../utils/constants.js'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['click', 'manage'])

const statusInfo = computed(() => PRODUCT_STATUS[props.product.status] || { label: '未知', color: '#999' })
</script>
