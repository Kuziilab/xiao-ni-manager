<template>
  <div class="list-group">
    <div v-if="sortedSales.length === 0" style="padding:16px;text-align:center;color:var(--color-text-hint);font-size:14px">
      暂无销售记录
    </div>
    <div
      v-for="sale in sortedSales"
      :key="sale.id"
      class="list-item"
    >
      <div class="list-item__icon" style="background: var(--color-pink-light)">
        <IconMoney :size="18" />
      </div>
      <div class="list-item__content">
        <div class="list-item__title">{{ sale.productName }}</div>
        <div class="list-item__subtitle">{{ formatDateTime(sale.saleTime) }}</div>
      </div>
      <div style="text-align: right; flex-shrink: 0">
        <div style="font-size: 14px; font-weight: 600">¥{{ sale.totalRevenue }}</div>
        <div style="font-size: 12px" :style="{ color: sale.totalProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }">
          利润 ¥{{ sale.totalProfit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconMoney } from '../../icons/index.js'
import { formatDateTime } from '../../utils/date.js'
import { useAccountingStore } from '../../stores/accounting.js'

const store = useAccountingStore()

const sortedSales = computed(() =>
  [...store.sales].sort((a, b) => b.saleTime - a.saleTime).slice(0, 50)
)
</script>
