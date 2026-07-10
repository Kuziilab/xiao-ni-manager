<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-card__image">
      <img v-if="product.imageBase64" :src="product.imageBase64" style="width:100%;height:100%;object-fit:cover" alt="" />
      <IconImage v-else :size="40" style="opacity: 0.25; color: var(--color-text-hint)" />
    </div>
    <div class="product-card__body">
      <div class="product-card__name">{{ product.name }}</div>
      <div class="product-card__price">¥{{ product.sellingPrice }}</div>
      <div style="display:flex;align-items:center;gap:4px;margin-top:2px;font-size:11px;color:var(--color-text-secondary)">
        📦 库存 {{ stock }}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
        <span class="cute-badge" :class="'cute-badge--' + badgeColor">
          {{ statusInfo.label }}
        </span>
        <button style="padding:2px 6px;color:var(--color-text-hint)" @click.stop="$emit('manage')">
          <IconMore :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconImage, IconMore } from '../../icons/index.js'
import { PRODUCT_STATUS } from '../../utils/constants.js'
import { useWarehouseStore } from '../../stores/warehouse.js'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['click', 'manage'])

const warehouse = useWarehouseStore()

const stock = computed(() => warehouse.getBatchTotal(props.product.id))

const statusInfo = computed(() => PRODUCT_STATUS[props.product.status] || { label: '未知', color: '#999' })

const badgeColor = computed(() => {
  switch (props.product.status) {
    case 'sold': return 'green'
    case 'pending-listing': return 'orange'
    case 'personal-selling': return 'pink'
    case 'consignment': return 'pink'
    default: return 'pink'
  }
})
</script>
