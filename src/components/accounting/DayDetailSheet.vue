<template>
  <BottomSheet :modelValue="modelValue" :title="'详情 - ' + date" @update:modelValue="$emit('update:modelValue', $event)">
    <div v-if="!daySales.length && !dayTxs.length" style="text-align:center;padding:16px;color:var(--color-text-hint)">
      当日无记录
    </div>

    <div v-if="daySales.length">
      <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:8px">售出记录</div>
      <div v-for="s in daySales" :key="s.id" style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;border-bottom:0.5px solid var(--color-separator)">
        <span>{{ s.productName }} ×{{ s.quantity }}</span>
        <span>¥{{ s.totalRevenue }} <span style="color:var(--color-text-secondary);font-size:12px">利润 ¥{{ s.totalProfit }}</span></span>
      </div>
    </div>

    <div v-if="dayTxs.length" style="margin-top:12px">
      <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:8px">其他收支</div>
      <div v-for="t in dayTxs" :key="t.id" style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;border-bottom:0.5px solid var(--color-separator)">
        <span>{{ t.categoryName }}</span>
        <span :style="{ color: t.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }">
          {{ t.type === 'income' ? '+' : '-' }}¥{{ t.amount }}
        </span>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup>
import { computed } from 'vue'
import BottomSheet from '../shared/BottomSheet.vue'
import { useAccountingStore } from '../../stores/accounting.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  date: { type: String, default: '' }
})

defineEmits(['update:modelValue'])

const store = useAccountingStore()

const daySales = computed(() =>
  store.sales.filter(s => {
    const d = new Date(s.saleTime)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === props.date
  })
)

const dayTxs = computed(() =>
  store.transactions.filter(t => t.date === props.date)
)
</script>
