<template>
  <div style="padding: 12px 16px">
    <!-- Period pills in box -->
    <div class="module-box" style="margin:0 0 12px">
      <div class="module-box__body">
        <div style="display: flex; gap: 8px; overflow-x: auto">
          <button
            v-for="p in periods"
            :key="p.value"
            class="pill"
            :class="{ 'pill--active': activePeriod === p.value }"
            @click="activePeriod = p.value"
          >
            {{ p.icon }} {{ p.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px">
      <div class="stat-card">
        <div class="stat-card__icon">📦</div>
        <div class="stat-card__label">售出件数</div>
        <div class="stat-card__value">{{ summary.count }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">💵</div>
        <div class="stat-card__label">总收入</div>
        <div class="stat-card__value">¥{{ summary.totalRevenue }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">📋</div>
        <div class="stat-card__label">总成本</div>
        <div class="stat-card__value">¥{{ summary.totalCost }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">🎉</div>
        <div class="stat-card__label">利润</div>
        <div class="stat-card__value" :class="summary.totalProfit >= 0 ? 'stat-card__value--profit' : 'stat-card__value--loss'">
          ¥{{ summary.totalProfit }}
        </div>
      </div>
    </div>

    <!-- Custom transactions summary -->
    <div class="module-box" style="margin:0">
      <div class="module-box__body">
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:8px">
          💰 其他收支
          <span style="font-size:11px;color:var(--color-text-hint);margin-left:4px">（{{ periodLabel }}）</span>
        </div>
        <div style="display:flex;gap:16px;font-size:15px">
          <span>收入 <span style="color:var(--color-success);font-weight:600">¥{{ transSummary.income }}</span></span>
          <span>支出 <span style="color:var(--color-danger);font-weight:600">¥{{ transSummary.expense }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAccountingStore } from '../../stores/accounting.js'

const store = useAccountingStore()
const activePeriod = ref('month')

const periods = [
  { icon: '📅', label: '今日', value: 'today' },
  { icon: '📊', label: '本周', value: 'week' },
  { icon: '📈', label: '本月', value: 'month' },
  { icon: '🗓️', label: '本年', value: 'year' },
  { icon: '📋', label: '全部', value: 'all' }
]

const periodLabel = computed(() => periods.find(p => p.value === activePeriod.value)?.label || '全部')

onMounted(async () => {
  await store.init()
})

const summary = computed(() => store.getSalesSummary(activePeriod.value))
const transSummary = computed(() => store.getTransactionsSummary(null))
</script>
