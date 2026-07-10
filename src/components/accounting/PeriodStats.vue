<template>
  <div style="padding: 12px 16px">
    <div style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto">
      <button
        v-for="p in periods"
        :key="p.value"
        class="pill"
        :class="{ 'pill--active': activePeriod === p.value }"
        @click="activePeriod = p.value"
      >
        {{ p.label }}
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
      <div class="stat-card">
        <div class="stat-card__label">售出件数</div>
        <div class="stat-card__value">{{ summary.count }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">总收入</div>
        <div class="stat-card__value">¥{{ summary.totalRevenue }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">总成本</div>
        <div class="stat-card__value">¥{{ summary.totalCost }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">利润</div>
        <div class="stat-card__value" :class="summary.totalProfit >= 0 ? 'stat-card__value--profit' : 'stat-card__value--loss'">
          ¥{{ summary.totalProfit }}
        </div>
      </div>
    </div>

    <!-- Custom transactions summary -->
    <div style="margin-top: 12px; padding: 12px; background: var(--color-surface); border-radius: var(--radius-sm)">
      <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px">其他收支 ({{ activePeriod === 'today' ? '今日' : activePeriod === 'all' ? '全部' : '本' + activePeriod }})</div>
      <div style="display: flex; gap: 16px; font-size: 15px">
        <span>收入 <span style="color: var(--color-success)">¥{{ transSummary.income }}</span></span>
        <span>支出 <span style="color: var(--color-danger)">¥{{ transSummary.expense }}</span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAccountingStore } from '../../stores/accounting.js'

const store = useAccountingStore()
const activePeriod = ref('today')

const periods = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
  { label: '全部', value: 'all' }
]

onMounted(async () => {
  await store.init()
})

const summary = computed(() => store.getSalesSummary(activePeriod.value))
const transSummary = computed(() => store.getTransactionsSummary(null))
</script>
